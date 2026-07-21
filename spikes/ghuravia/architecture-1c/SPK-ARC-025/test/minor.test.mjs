/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createProfileProjection } from '../lib/minor-profile.mjs';

describe('SPK-ARC-025 minor public profile', () => {
  it('exposes Crow identity and approved public artifacts only', () => {
    const p = createProfileProjection();
    const account = {
      ageCategory: 'MINOR',
      crowHandle: 'crow_nova',
      crowDisplayName: 'Nova',
      publicAchievements: ['First Mission'],
      approvedProgression: ['Route Progress Public'],
      sanitizedPublicEvidence: ['pub-deriv-1'],
      email: 'minor@example.test',
      phone: '+966500000000',
      legalName: 'Private Name',
      dateOfBirth: '2012-01-01',
      exactAge: 14,
    };
    const pub = p.publicProfile(account);
    assert.equal(pub.crowHandle, 'crow_nova');
    assert.equal(pub.email, undefined);
    assert.equal(pub.legalName, undefined);
    assert.equal(pub.exactAge, undefined);
    assert.equal(pub.dateOfBirth, undefined);
    assert.equal(pub.trustSignals, undefined);
    assert.equal(pub.contactChannels, undefined);
    p.assertNoPrivateLeak(pub, account);
  });
});
