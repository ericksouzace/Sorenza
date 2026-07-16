import type { EvidenceRecord, MissionContract } from '../../contracts/src/index';

export interface EvidenceGateResult {
  status: 'pass' | 'fail' | 'inconclusive';
  missingCriteria: string[];
  failedCriteria: string[];
}

export function evaluateEvidence(
  contract: MissionContract,
  evidence: readonly EvidenceRecord[],
): EvidenceGateResult {
  const missingCriteria: string[] = [];
  const failedCriteria: string[] = [];

  for (const criterion of contract.acceptanceCriteria) {
    const relevant = evidence.filter((item) => item.criterion === criterion);
    if (relevant.length === 0) {
      missingCriteria.push(criterion);
      continue;
    }
    if (relevant.some((item) => item.status === 'fail')) {
      failedCriteria.push(criterion);
      continue;
    }
    if (!relevant.some((item) => item.status === 'pass')) {
      missingCriteria.push(criterion);
    }
  }

  if (failedCriteria.length > 0) {
    return { status: 'fail', missingCriteria, failedCriteria };
  }
  if (missingCriteria.length > 0) {
    return { status: 'inconclusive', missingCriteria, failedCriteria };
  }
  return { status: 'pass', missingCriteria, failedCriteria };
}
