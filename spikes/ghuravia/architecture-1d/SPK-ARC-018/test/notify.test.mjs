/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createNotificationBus } from '../../shared/kernels.mjs';

describe('SPK-ARC-018 notification isolation', () => {
  it('delivery failure does not change business state', () => {
    const bus = createNotificationBus();
    const v0 = bus.getBusinessVersion();
    bus.enqueue({ id: 'n1', channel: 'email', userId: 'u1', template: 'activation' });
    bus.deliver('n1', { fail: true });
    assert.equal(bus.getBusinessVersion(), v0);
    bus.bumpBusiness();
    assert.equal(bus.getBusinessVersion(), v0 + 1);
    const dup = bus.enqueue({ id: 'n1', channel: 'email', userId: 'u1', template: 'activation' });
    assert.equal(dup.idempotent, true);
  });
});
