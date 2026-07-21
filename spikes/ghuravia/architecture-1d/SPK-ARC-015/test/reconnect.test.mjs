/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createLiveSky } from '../../shared/kernels.mjs';

describe('SPK-ARC-015 reconnect duplicate prevention', () => {
  it('reconnect does not duplicate contribution', () => {
    const live = createLiveSky();
    live.join({ eventId: 'e1', userId: 'p1', role: 'participant' });
    const first = live.command({ eventId: 'e1', userId: 'p1', commandId: 'c1', action: 'SCORE' });
    assert.equal(first.duplicate, false);
    const recon = live.reconnect({ eventId: 'e1', userId: 'p1', lastCursor: 0 });
    assert.equal(recon.duplicateContributionRisk, false);
    const again = live.command({ eventId: 'e1', userId: 'p1', commandId: 'c1', action: 'SCORE' });
    assert.equal(again.duplicate, true);
  });
});
