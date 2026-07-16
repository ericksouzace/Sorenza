import { describe, expect, it } from 'vitest';
import {
  evidenceRecordSchema,
  missionContractSchema,
  missionPhaseSchema,
  projectSchema,
  riskClassSchema,
  skillManifestSchema,
} from '../../contracts/src/index';

describe('domain contracts', () => {
  it('validates a complete mission contract', () => {
    expect(
      missionContractSchema.parse({
        id: 'mission-42',
        objective: 'Construir e validar um fluxo de produto completo.',
        acceptanceCriteria: ['Build passa', 'Checkout funciona'],
        constraints: ['Sem deploy'],
        requiredEvidence: ['build', 'browser'],
        budget: { maxActions: 80, maxMinutes: 45, maxUsd: 12 },
        lockedAt: '2026-07-15T18:00:00.000Z',
      }).id,
    ).toBe('mission-42');
  });

  it('rejects unsafe or incomplete contracts', () => {
    expect(() =>
      missionContractSchema.parse({
        id: 'x',
        objective: 'curto',
        acceptanceCriteria: [],
        requiredEvidence: [],
        constraints: [],
        budget: { maxActions: 0, maxMinutes: 0, maxUsd: -1 },
        lockedAt: 'invalid',
      }),
    ).toThrow();
  });

  it('validates evidence, skills, projects, phases and risk classes', () => {
    expect(
      evidenceRecordSchema.parse({
        id: 'ev-1',
        criterion: 'Build passa',
        kind: 'build',
        status: 'pass',
        exitCode: 0,
        summary: 'Build finalizado.',
        capturedAt: '2026-07-15T18:00:00.000Z',
      }).status,
    ).toBe('pass');

    expect(
      skillManifestSchema.parse({
        id: 'secure-web',
        name: 'Secure Web',
        version: '1.2.3',
        description: 'Regras de segurança e qualidade para aplicações web.',
        capabilities: ['security'],
        permissions: ['read:workspace'],
        qualityGates: ['security-review'],
        enabled: true,
      }).enabled,
    ).toBe(true);

    expect(
      projectSchema.parse({
        id: 'p1',
        name: 'Pijama de Rica',
        source: 'codespaces',
        repository: 'erick/pijama-de-rica',
        codespaceName: 'pijama-main',
        status: 'connected',
      }).source,
    ).toBe('codespaces');

    expect(missionPhaseSchema.parse('verifying')).toBe('verifying');
    expect(riskClassSchema.parse('A3')).toBe('A3');
  });
});
