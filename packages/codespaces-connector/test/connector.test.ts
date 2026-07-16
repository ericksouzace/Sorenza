import { describe, expect, it } from 'vitest';
import { assertCodespaceName, assertMissionId, assertWorkspacePath } from '../src/index';

describe('codespaces connector validation', () => {
  it('accepts safe identifiers and workspace roots', () => {
    expect(() => {
      assertCodespaceName('pijama-de-rica-123');
    }).not.toThrow();
    expect(() => {
      assertMissionId('mission-2026-07');
    }).not.toThrow();
    expect(() => {
      assertWorkspacePath('/workspaces/pijama-de-rica');
    }).not.toThrow();
  });

  it('rejects shell metacharacters and external paths', () => {
    expect(() => {
      assertCodespaceName('x;rm-rf');
    }).toThrow();
    expect(() => {
      assertMissionId('../escape');
    }).toThrow();
    expect(() => {
      assertWorkspacePath('/home/codespace/.ssh');
    }).toThrow();
  });
});
