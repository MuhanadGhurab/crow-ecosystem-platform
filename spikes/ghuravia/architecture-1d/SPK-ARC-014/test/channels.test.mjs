/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createLiveSky } from '../../shared/kernels.mjs';

describe('SPK-ARC-014 Live Sky channels', () => {
  it('separates spectator from participant mutation', () => {
    const live = createLiveSky();
    live.join({ eventId: 'e1', userId: 'p1', role: 'participant' });
    live.join({ eventId: 'e1', userId: 's1', role: 'spectator' });
    live.command({ eventId: 'e1', userId: 'p1', commandId: 'c1', action: 'SUBMIT' });
    assert.throws(() =>
      live.command({ eventId: 'e1', userId: 's1', commandId: 'c2', action: 'SUBMIT' }),
    );
    assert.equal(live.spectatorProjection('e1').canMutate, false);
  });
});
