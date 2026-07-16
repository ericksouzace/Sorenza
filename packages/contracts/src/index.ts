import { z } from 'zod';

export const missionPhaseSchema = z.enum([
  'draft',
  'contracting',
  'ready',
  'executing',
  'awaiting_approval',
  'verifying',
  'promoting',
  'completed',
  'blocked',
  'failed',
  'cancelled',
]);
export type MissionPhase = z.infer<typeof missionPhaseSchema>;

export const riskClassSchema = z.enum(['A0', 'A1', 'A2', 'A3', 'A4']);
export type RiskClass = z.infer<typeof riskClassSchema>;

export const missionContractSchema = z.object({
  id: z.string().min(1),
  objective: z.string().min(12),
  acceptanceCriteria: z.array(z.string().min(5)).min(1),
  constraints: z.array(z.string()).default([]),
  requiredEvidence: z.array(z.string().min(3)).min(1),
  budget: z.object({
    maxActions: z.number().int().min(1).max(500),
    maxMinutes: z.number().int().min(1).max(480),
    maxUsd: z.number().nonnegative().max(10_000),
  }),
  lockedAt: z.iso.datetime(),
});
export type MissionContract = z.infer<typeof missionContractSchema>;

export const evidenceRecordSchema = z.object({
  id: z.string(),
  criterion: z.string(),
  kind: z.enum(['test', 'build', 'lint', 'typecheck', 'browser', 'security', 'manual']),
  status: z.enum(['pass', 'fail', 'inconclusive']),
  command: z.string().optional(),
  exitCode: z.number().int().optional(),
  summary: z.string(),
  capturedAt: z.iso.datetime(),
});
export type EvidenceRecord = z.infer<typeof evidenceRecordSchema>;

export const skillManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().min(10),
  capabilities: z.array(z.string()),
  permissions: z.array(z.string()),
  qualityGates: z.array(z.string()),
  enabled: z.boolean(),
});
export type SkillManifest = z.infer<typeof skillManifestSchema>;

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  source: z.enum(['codespaces', 'local']),
  repository: z.string().optional(),
  codespaceName: z.string().optional(),
  status: z.enum(['connected', 'disconnected', 'sleeping', 'unknown']),
});
export type Project = z.infer<typeof projectSchema>;
