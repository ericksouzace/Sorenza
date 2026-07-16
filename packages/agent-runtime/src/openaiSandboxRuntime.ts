import { run } from '@openai/agents';
import { filesystem, gitRepo, SandboxAgent, shell } from '@openai/agents/sandbox';
import { UnixLocalSandboxClient } from '@openai/agents/sandbox/local';

export interface SandboxMissionRequest {
  repository: string;
  objective: string;
  model?: string;
  maxTurns?: number;
  signal?: AbortSignal;
}

export interface SandboxMissionResult {
  output: string;
  usage: unknown;
}

/**
 * Primary OpenAI runtime adapter for repository-backed, isolated candidate work.
 * The Sorenza Trust Kernel and Evidence Gate must remain outside this runtime.
 */
export async function runOpenAISandboxMission(
  request: SandboxMissionRequest,
): Promise<SandboxMissionResult> {
  const agent = new SandboxAgent({
    name: 'Forge',
    model: request.model ?? 'gpt-5.6-sol',
    instructions: [
      'Work only inside the provided sandbox workspace.',
      'Inspect the repository before editing.',
      'Do not claim success without running the available quality gates.',
      'Never attempt deployment, credential access, or external side effects.',
      'Return a concise candidate-completion report; Sorenza verifies independently.',
    ].join('\n'),
    defaultManifest: {
      entries: {
        repo: gitRepo({ repo: request.repository }),
      },
    },
    capabilities: [filesystem(), shell()],
  });

  const runOptions = {
    maxTurns: request.maxTurns ?? 40,
    sandbox: { client: new UnixLocalSandboxClient() },
    ...(request.signal ? { signal: request.signal } : {}),
  };

  const result = await run(agent, request.objective, runOptions);

  return {
    output: result.finalOutput ?? '',
    usage: result.state._context.usage,
  };
}
