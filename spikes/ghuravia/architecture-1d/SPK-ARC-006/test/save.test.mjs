/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSaveResumeStore } from '../../shared/kernels.mjs';

describe('SPK-ARC-006 save resume sync', () => {
  it('rejects stale overwrite and supports idempotent retry', () => {
    const s = createSaveResumeStore();
    const r1 = s.save({
      userId: 'u1',
      missionId: 'm1',
      revision: 0,
      payload: { body: 'a', idempotencyKey: 'k1' },
      clientClock: 1,
    });
    assert.equal(r1.ok, true);
    const stale = s.save({
      userId: 'u1',
      missionId: 'm1',
      revision: 0,
      payload: { body: 'b', idempotencyKey: 'k2' },
      clientClock: 2,
    });
    assert.equal(stale.conflict, true);
    const retry = s.save({
      userId: 'u1',
      missionId: 'm1',
      revision: 1,
      payload: { body: 'a', idempotencyKey: 'k1' },
      clientClock: 1,
    });
    assert.equal(retry.idempotent, true);
  });

  it('completion is online-only server command', () => {
    const s = createSaveResumeStore();
    s.save({
      userId: 'u1',
      missionId: 'm1',
      revision: 0,
      payload: { body: 'a', idempotencyKey: 'k1' },
      clientClock: 1,
    });
    assert.throws(() =>
      s.save({
        userId: 'u1',
        missionId: 'm1',
        revision: 1,
        payload: { body: 'a', idempotencyKey: 'k3', status: 'COMPLETE' },
        clientClock: 2,
      }),
    );
    assert.equal(s.classify('complete_mission'), 'ONLINE_ONLY');
    assert.equal(s.classify('approve_evidence'), 'ONLINE_ONLY');
    const c = s.complete({ userId: 'u1', missionId: 'm1', revision: 1 });
    assert.equal(c.record.status, 'COMPLETE');
  });
});
