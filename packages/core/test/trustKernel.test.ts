import { describe, expect, it } from 'vitest';
import { decideTrust } from '../src/trustKernel';

describe('trust kernel', () => {
  it('denies production and A4 operations', () => {
    expect(
      decideTrust({
        risk: 'A1',
        environment: 'production',
        networkRequested: false,
        touchesSecrets: false,
      }),
    ).toBe('deny');
    expect(
      decideTrust({
        risk: 'A4',
        environment: 'sandbox',
        networkRequested: false,
        touchesSecrets: false,
      }),
    ).toBe('deny');
  });

  it('denies secret access and requires approval for networked mutations', () => {
    expect(
      decideTrust({
        risk: 'A0',
        environment: 'sandbox',
        networkRequested: false,
        touchesSecrets: true,
      }),
    ).toBe('deny');
    expect(
      decideTrust({
        risk: 'A2',
        environment: 'sandbox',
        networkRequested: true,
        touchesSecrets: false,
      }),
    ).toBe('approval_required');
  });

  it('allows low risk sandbox operations', () => {
    expect(
      decideTrust({
        risk: 'A1',
        environment: 'sandbox',
        networkRequested: false,
        touchesSecrets: false,
      }),
    ).toBe('allow');
  });
});
