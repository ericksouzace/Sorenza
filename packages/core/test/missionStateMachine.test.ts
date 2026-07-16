import { describe, expect, it } from 'vitest';
import { canTransition, transition } from '../src/missionStateMachine';

describe('mission state machine', () => {
  it('allows the verified happy path', () => {
    expect(canTransition('draft', 'contracting')).toBe(true);
    expect(canTransition('contracting', 'ready')).toBe(true);
    expect(canTransition('ready', 'executing')).toBe(true);
    expect(canTransition('executing', 'verifying')).toBe(true);
    expect(canTransition('verifying', 'promoting')).toBe(true);
    expect(canTransition('promoting', 'completed')).toBe(true);
  });

  it('rejects self certification', () => {
    expect(canTransition('executing', 'completed')).toBe(false);
    expect(() => transition('executing', 'completed')).toThrow(/Invalid mission transition/);
  });
});
