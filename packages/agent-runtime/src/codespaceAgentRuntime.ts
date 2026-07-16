import { Agent, Runner, tool } from '@openai/agents';
import { z } from 'zod';
import {
  getCandidateDiff,
  readCandidateFile,
  runQualityGate,
  writeCandidateFile,
  type CodespaceTarget,
} from '../../codespaces-connector/src/index';

export interface CodespaceMissionRuntimeRequest {
  target: CodespaceTarget;
  candidatePath: string;
  objective: string;
  model?: string;
  maxTurns?: number;
  signal?: AbortSignal;
}

export async function runCodespaceMission(
  request: CodespaceMissionRuntimeRequest,
): Promise<{ candidateReport: string; usage: unknown }> {
  const readTool = tool({
    name: 'read_file',
    description: 'Read a UTF-8 text file from the isolated candidate workspace.',
    parameters: z.object({ path: z.string().min(1) }),
    execute: async ({ path }) => readCandidateFile(request.target, request.candidatePath, path),
  });

  const writeTool = tool({
    name: 'write_file',
    description: 'Replace a file in the isolated candidate workspace with complete UTF-8 content.',
    parameters: z.object({ path: z.string().min(1), content: z.string() }),
    execute: async ({ path, content }) => {
      await writeCandidateFile(request.target, request.candidatePath, path, content);
      return `Updated ${path}`;
    },
  });

  const gateTool = tool({
    name: 'run_quality_gate',
    description: 'Run one supported project quality gate in the candidate workspace.',
    parameters: z.object({ gate: z.enum(['typecheck', 'lint', 'test', 'build']) }),
    execute: async ({ gate }) => runQualityGate(request.target, request.candidatePath, gate),
  });

  const diffTool = tool({
    name: 'review_diff',
    description: 'Review the current git diff in the isolated candidate workspace.',
    parameters: z.object({}),
    execute: async () => getCandidateDiff(request.target, request.candidatePath),
  });

  const agent = new Agent({
    name: 'Forge',
    model: request.model ?? 'gpt-5.6',
    instructions: [
      'You are Forge, the implementation specialist inside Sorenza.',
      'You work only in an isolated candidate workspace.',
      'Inspect relevant files before editing.',
      'Write complete files, not patch fragments.',
      'Run applicable quality gates after the last mutation.',
      'Review the final diff before submitting your candidate report.',
      'Do not deploy, publish, access secrets, or claim final PASS.',
      'Sorenza Evidence Gate decides whether the mission is complete.',
    ].join('\n'),
    tools: [readTool, writeTool, gateTool, diffTool],
  });

  const runner = new Runner({
    workflowName: 'Sorenza Codespace Mission',
    traceIncludeSensitiveData: false,
  });

  const options = {
    maxTurns: request.maxTurns ?? 40,
    ...(request.signal ? { signal: request.signal } : {}),
  };
  const result = await runner.run(agent, request.objective, options);
  return {
    candidateReport: result.finalOutput ?? '',
    usage: result.state._context.usage,
  };
}
