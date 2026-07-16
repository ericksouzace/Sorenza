import { describe, expect, it } from 'vitest';
import { evaluateEvidence } from '../src/evidenceGate';
import type { EvidenceRecord, MissionContract } from '../../contracts/src/index';

const contract: MissionContract = {
  id: 'mission-1',
  objective: 'Finalizar página de produto com validação independente.',
  acceptanceCriteria: ['Build passa', 'Fluxo de compra funciona'],
  constraints: ['Sem deploy'],
  requiredEvidence: ['build', 'browser'],
  budget: { maxActions: 40, maxMinutes: 30, maxUsd: 5 },
  lockedAt: '2026-07-15T12:00:00.000Z',
};

function evidence(criterion: string, status: EvidenceRecord['status']): EvidenceRecord {
  return {
    id: `${criterion}-${status}`,
    criterion,
    kind: criterion === 'Build passa' ? 'build' : 'browser',
    status,
    summary: 'fixture',
    capturedAt: '2026-07-15T12:00:00.000Z',
  };
}

describe('evidence gate', () => {
  it('passes only with positive evidence for every criterion', () => {
    expect(
      evaluateEvidence(contract, [
        evidence('Build passa', 'pass'),
        evidence('Fluxo de compra funciona', 'pass'),
      ]).status,
    ).toBe('pass');
  });

  it('fails when any criterion has a fail', () => {
    expect(
      evaluateEvidence(contract, [
        evidence('Build passa', 'pass'),
        evidence('Fluxo de compra funciona', 'fail'),
      ]).status,
    ).toBe('fail');
  });

  it('is inconclusive when evidence is missing', () => {
    const result = evaluateEvidence(contract, [evidence('Build passa', 'pass')]);
    expect(result.status).toBe('inconclusive');
    expect(result.missingCriteria).toEqual(['Fluxo de compra funciona']);
  });
});
