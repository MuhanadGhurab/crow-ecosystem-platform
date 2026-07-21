/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createAuditLedger } from '../lib/audit.mjs';

describe('SPK-ARC-019 audit and privileged correction', () => {
  it('requires actor reason authority; blocks secrets and evidence content', () => {
    const a = createAuditLedger();
    assert.throws(() => a.append({ actorId: 'a', action: 'X', resource: 'r' }));
    assert.throws(() =>
      a.append({
        actorId: 'a',
        reason: 'r',
        authority: 'ADMIN',
        action: 'X',
        resource: 'r',
        evidenceContent: 'raw bytes',
      }),
    );
  });

  it('privileged correction with dual control and reversal', () => {
    const a = createAuditLedger();
    assert.throws(() =>
      a.privilegedCorrect({
        actorId: 'admin1',
        subjectId: 'u1',
        resource: 'activation',
        priorRef: 's1',
        resultRef: 's2',
        reason: 'emergency',
        authority: 'BREAK_GLASS',
      }),
    );
    const rec = a.privilegedCorrect({
      actorId: 'admin1',
      subjectId: 'u1',
      resource: 'progression',
      priorRef: 'led-1',
      resultRef: 'led-2',
      reason: 'appeal_correction',
      authority: 'BREAK_GLASS',
      dualControlApprover: 'admin2',
    });
    assert.equal(rec.action, 'PRIVILEGED_CORRECTION');
    const rev = a.reverse({
      actorId: 'admin2',
      originalAuditId: rec.id,
      reason: 'error',
      authority: 'ADMIN',
    });
    assert.equal(rev.action, 'CORRECTION_REVERSAL');
    assert.equal(a.all().length, 2);
  });
});
