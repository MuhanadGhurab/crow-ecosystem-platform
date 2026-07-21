/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createEntitlementEngine } from '../../shared/kernels.mjs';

describe('SPK-ARC-012 payment entitlement', () => {
  it('idempotent webhooks and progression neutrality', () => {
    const e = createEntitlementEngine();
    const a = e.ingestWebhook({
      eventId: 'evt1',
      signatureOk: true,
      type: 'payment.succeeded',
      userId: 'u1',
      order: { plan: 'pro' },
    });
    assert.equal(a.progressionEffect, false);
    assert.equal(a.entitlement.status, 'ACTIVE');
    const dup = e.ingestWebhook({
      eventId: 'evt1',
      signatureOk: true,
      type: 'payment.succeeded',
      userId: 'u1',
      order: { plan: 'pro' },
    });
    assert.equal(dup.idempotent, true);
    assert.equal(e.getProgressionTouch('u1').xp, 0);
    assert.equal(e.getProgressionTouch('u1').mastery, 0);
  });

  it('rejects bad signature and handles refund', () => {
    const e = createEntitlementEngine();
    assert.throws(() =>
      e.ingestWebhook({
        eventId: 'x',
        signatureOk: false,
        type: 'payment.succeeded',
        userId: 'u1',
        order: { plan: 'pro' },
      }),
    );
    e.ingestWebhook({
      eventId: 'ok',
      signatureOk: true,
      type: 'payment.succeeded',
      userId: 'u1',
      order: { plan: 'pro' },
    });
    e.ingestWebhook({
      eventId: 'ref',
      signatureOk: true,
      type: 'payment.refunded',
      userId: 'u1',
      order: { plan: 'pro' },
    });
    assert.equal(e.getEntitlement('u1').status, 'INACTIVE');
  });
});
