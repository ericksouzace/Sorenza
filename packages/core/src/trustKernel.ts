import type { RiskClass } from '../../contracts/src/index';

export type EnvironmentClass = 'sandbox' | 'development' | 'staging' | 'production';
export type PolicyDecision = 'allow' | 'approval_required' | 'deny';

export interface TrustRequest {
  risk: RiskClass;
  environment: EnvironmentClass;
  networkRequested: boolean;
  touchesSecrets: boolean;
}

export function decideTrust(request: TrustRequest): PolicyDecision {
  if (request.risk === 'A4' || request.environment === 'production') return 'deny';
  if (request.touchesSecrets) return 'deny';
  if (request.networkRequested && request.risk !== 'A0') return 'approval_required';
  if (request.environment === 'staging' && request.risk === 'A2') return 'approval_required';
  if (request.risk === 'A3') return 'approval_required';
  return 'allow';
}
