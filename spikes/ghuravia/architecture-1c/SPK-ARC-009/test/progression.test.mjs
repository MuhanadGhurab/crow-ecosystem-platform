/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createProgressionEngine } from '../lib/progression-evidence.mjs';

describe('SPK-ARC-009 targeted recalculation', () => {
  it('approval updates only affected capability; ledger has no object body', () => {
    const eng = createProgressionEngine();
    const r = eng.approveEvidence({
      evidenceId: 'ev1',
      userId: 'u1',
      capabilityId: 'CAP-A',
      objectRef: 'obj-opaque-1',
    });
    assert.equal(r.ledgerContainsObjectBody, false);
    assert.equal(eng.getCapability('u1', 'CAP-A').mastery, 'MASTERED');
    eng.approveEvidence({
      evidenceId: 'ev2',
      userId: 'u1',
      capabilityId: 'CAP-B',
      objectRef: 'obj-2',
    });
    const snap = eng.snapshot('u1');
    assert.equal(snap.capabilities['CAP-A'].mastery, 'MASTERED');
    assert.equal(snap.capabilities['CAP-B'].mastery, 'MASTERED');
  });

  it('revoke recalculates locally and preserves history; unrelated unchanged', () => {
    const eng = createProgressionEngine();
    eng.approveEvidence({ evidenceId: 'ev1', userId: 'u1', capabilityId: 'CAP-A', objectRef: 'o1' });
    eng.approveEvidence({ evidenceId: 'ev2', userId: 'u1', capabilityId: 'CAP-B', objectRef: 'o2' });
    eng.revokeEvidence({ evidenceId: 'ev1', reason: 'integrity', actorId: 'rev1' });
    assert.equal(eng.getCapability('u1', 'CAP-A').mastery, 'NOT_MASTERED');
    assert.equal(eng.getCapability('u1', 'CAP-B').mastery, 'MASTERED');
    eng.restoreEvidence({ evidenceId: 'ev1', actorId: 'rev1', reason: 'appeal_upheld' });
    assert.equal(eng.getCapability('u1', 'CAP-A').mastery, 'MASTERED');
  });

  it('duplicate approve is idempotent', () => {
    const eng = createProgressionEngine();
    eng.approveEvidence({ evidenceId: 'ev1', userId: 'u1', capabilityId: 'CAP-A', objectRef: 'o1' });
    const r = eng.approveEvidence({ evidenceId: 'ev1', userId: 'u1', capabilityId: 'CAP-A', objectRef: 'o1' });
    assert.equal(r.idempotent, true);
  });
});
