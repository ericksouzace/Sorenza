import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const SAFE_NAME = /^[A-Za-z0-9-]{1,128}$/;
const SAFE_MISSION = /^[a-z0-9-]{1,64}$/;

export type QualityGate = 'typecheck' | 'lint' | 'test' | 'build';

export interface CodespaceTarget {
  name: string;
  workspacePath: string;
}

export interface GateResult {
  gate: QualityGate;
  exitCode: number;
  stdout: string;
  stderr: string;
}

export function assertCodespaceName(name: string): void {
  if (!SAFE_NAME.test(name)) throw new Error('Invalid codespace name.');
}

export function assertWorkspacePath(path: string): void {
  if (!path.startsWith('/workspaces/') || path.includes('\0') || path.includes('\n')) {
    throw new Error('Workspace path must stay under /workspaces.');
  }
}

export function assertMissionId(id: string): void {
  if (!SAFE_MISSION.test(id)) throw new Error('Invalid mission id.');
}

function remotePython(script: string): string {
  const payload = Buffer.from(script, 'utf8').toString('base64');
  return `python3 -c "import base64;exec(base64.b64decode('${payload}'))"`;
}

async function ssh(target: CodespaceTarget, script: string, timeoutMs = 120_000): Promise<string> {
  assertCodespaceName(target.name);
  assertWorkspacePath(target.workspacePath);
  const { stdout } = await execFileAsync(
    'gh',
    ['codespace', 'ssh', '-c', target.name, remotePython(script)],
    { timeout: timeoutMs, maxBuffer: 2 * 1024 * 1024, windowsHide: true },
  );
  return stdout;
}

export async function createCandidateWorkspace(
  target: CodespaceTarget,
  missionId: string,
): Promise<string> {
  assertMissionId(missionId);
  const candidatePath = `/tmp/sorenza/${missionId}`;
  const script = [
    'import pathlib, subprocess',
    `root = pathlib.Path(${JSON.stringify(target.workspacePath)})`,
    `candidate = pathlib.Path(${JSON.stringify(candidatePath)})`,
    'candidate.parent.mkdir(parents=True, exist_ok=True)',
    "subprocess.run(['git','worktree','remove','--force',str(candidate)], cwd=root, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)",
    "subprocess.run(['git','worktree','add','--detach',str(candidate),'HEAD'], cwd=root, check=True)",
    'print(candidate)',
  ].join('\n');
  return (await ssh(target, script)).trim();
}

export async function readCandidateFile(
  target: CodespaceTarget,
  candidatePath: string,
  relativePath: string,
): Promise<string> {
  assertWorkspacePath(target.workspacePath);
  if (!candidatePath.startsWith('/tmp/sorenza/')) throw new Error('Invalid candidate path.');
  if (relativePath.startsWith('/') || relativePath.includes('..') || relativePath.includes('\0')) {
    throw new Error('Invalid relative path.');
  }
  const script = [
    'import pathlib',
    `base = pathlib.Path(${JSON.stringify(candidatePath)}).resolve()`,
    `path = (base / ${JSON.stringify(relativePath)}).resolve()`,
    'path.relative_to(base)',
    "if path.is_symlink(): raise RuntimeError('Symlinks are not readable by Sorenza')",
    "print(path.read_text(encoding='utf-8'))",
  ].join('\n');
  return ssh(target, script);
}

export async function writeCandidateFile(
  target: CodespaceTarget,
  candidatePath: string,
  relativePath: string,
  content: string,
): Promise<void> {
  if (!candidatePath.startsWith('/tmp/sorenza/')) throw new Error('Invalid candidate path.');
  if (relativePath.startsWith('/') || relativePath.includes('..') || relativePath.includes('\0')) {
    throw new Error('Invalid relative path.');
  }
  const tempDir = await mkdtemp(join(tmpdir(), 'sorenza-write-'));
  const localFile = join(tempDir, 'payload.txt');
  try {
    await writeFile(localFile, content, { encoding: 'utf8', mode: 0o600 });
    const remoteTemp = `/tmp/sorenza-upload-${String(Date.now())}-${Math.random().toString(36).slice(2)}.txt`;
    await execFileAsync(
      'gh',
      ['codespace', 'cp', '-c', target.name, localFile, `remote:${remoteTemp}`],
      {
        timeout: 120_000,
        windowsHide: true,
      },
    );
    const script = [
      'import pathlib, shutil',
      `base = pathlib.Path(${JSON.stringify(candidatePath)}).resolve()`,
      `path = (base / ${JSON.stringify(relativePath)}).resolve()`,
      'path.relative_to(base)',
      "if path.exists() and path.is_symlink(): raise RuntimeError('Refusing to overwrite symlink')",
      'path.parent.mkdir(parents=True, exist_ok=True)',
      `shutil.copyfile(${JSON.stringify(remoteTemp)}, path)`,
      `pathlib.Path(${JSON.stringify(remoteTemp)}).unlink(missing_ok=True)`,
    ].join('\n');
    await ssh(target, script);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

const GATE_SCRIPTS: Record<QualityGate, string> = {
  typecheck: 'typecheck',
  lint: 'lint',
  test: 'test',
  build: 'build',
};

export async function runQualityGate(
  target: CodespaceTarget,
  candidatePath: string,
  gate: QualityGate,
): Promise<GateResult> {
  if (!candidatePath.startsWith('/tmp/sorenza/')) throw new Error('Invalid candidate path.');
  const scriptName = GATE_SCRIPTS[gate];
  const script = [
    'import json, pathlib, subprocess',
    `base = pathlib.Path(${JSON.stringify(candidatePath)}).resolve()`,
    "pkg = json.loads((base / 'package.json').read_text()) if (base / 'package.json').exists() else {}",
    `name = ${JSON.stringify(scriptName)}`,
    "scripts = pkg.get('scripts', {})",
    "if name not in scripts: print(json.dumps({'exitCode':0,'stdout':'SKIPPED: script unavailable','stderr':''})); raise SystemExit(0)",
    "result = subprocess.run(['npm','run',name], cwd=base, text=True, capture_output=True, timeout=600)",
    "print(json.dumps({'exitCode':result.returncode,'stdout':result.stdout[-200000:],'stderr':result.stderr[-200000:]}))",
  ].join('\n');
  const parsed = JSON.parse((await ssh(target, script, 660_000)).trim()) as {
    exitCode: number;
    stdout: string;
    stderr: string;
  };
  return { gate, ...parsed };
}

export async function getCandidateDiff(
  target: CodespaceTarget,
  candidatePath: string,
): Promise<string> {
  const script = [
    'import pathlib, subprocess',
    `base = pathlib.Path(${JSON.stringify(candidatePath)}).resolve()`,
    "result = subprocess.run(['git','diff','--binary','--no-ext-diff','HEAD','--'], cwd=base, text=True, capture_output=True, check=True)",
    'print(result.stdout)',
  ].join('\n');
  return ssh(target, script);
}

export async function exportCandidatePatch(
  target: CodespaceTarget,
  candidatePath: string,
): Promise<Buffer> {
  const patch = await getCandidateDiff(target, candidatePath);
  return Buffer.from(patch, 'utf8');
}

export async function savePatchToFile(patch: Buffer, outputPath: string): Promise<void> {
  await writeFile(outputPath, patch, { mode: 0o600 });
  await readFile(outputPath);
}
