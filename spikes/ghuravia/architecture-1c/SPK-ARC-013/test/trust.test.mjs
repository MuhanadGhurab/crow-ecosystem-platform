/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createTrustStore } from '../lib/trust-privacy.mjs';

describe('SPK-ARC-013 Trust privacy', () => {
  it('rejects numeric public trust score', () => {
    const t = createTrustStore();
    assert.throws(() => t.setUserFacing('u1', { score: 87 }));
  });

  it('public view has no trust; overturn clears restriction without mastery touch', () => {
    const t = createTrustStore();
    t.setUserFacing('u1', { eligibility: 'ELIGIBLE' });
    t.openCase({ caseId: 'c1', subjectId: 'u1', reporterId: 'r1', reason: 'spam' });
    t.decide({ caseId: 'c1', decision: 'RESTRICT', restriction: 'COMMUNITY_MUTE', actorId: 'mod1' });
    assert.equal(t.publicView('u1').trust, undefined);
    assert.equal(t.publicView('u1').score, undefined);
    const o = t.overturn({ caseId: 'c1', actorId: 'admin1', reason: 'false_positive' });
    assert.equal(o.masteryUnchanged, true);
  });

  it('moderator without private-identity authority cannot see private identity', () => {
    const t = createTrustStore();
    t.setUserFacing('u1', {});
    t.setRestrictedSignal('u1', { signal: 'internal' });
    const view = t.moderatorView({ roles: ['moderator'], canViewPrivateIdentity: false }, 'u1');
    assert.equal(view.privateIdentity, null);
  });
});
