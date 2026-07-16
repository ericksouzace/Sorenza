import type { MissionPhase } from '../../contracts/src/index';

const allowed: Record<MissionPhase, ReadonlySet<MissionPhase>> = {
  draft: new Set(['contracting', 'cancelled']),
  contracting: new Set(['ready', 'blocked', 'cancelled']),
  ready: new Set(['executing', 'cancelled']),
  executing: new Set(['awaiting_approval', 'verifying', 'blocked', 'failed', 'cancelled']),
  awaiting_approval: new Set(['executing', 'blocked', 'cancelled']),
  verifying: new Set(['executing', 'promoting', 'blocked', 'failed', 'cancelled']),
  promoting: new Set(['completed', 'failed']),
  completed: new Set(),
  blocked: new Set(),
  failed: new Set(),
  cancelled: new Set(),
};

export function canTransition(from: MissionPhase, to: MissionPhase): boolean {
  return allowed[from].has(to);
}

export function transition(from: MissionPhase, to: MissionPhase): MissionPhase {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid mission transition: ${from} -> ${to}`);
  }
  return to;
}
