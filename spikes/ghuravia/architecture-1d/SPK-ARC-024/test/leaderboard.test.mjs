/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildLeaderboard } from '../../shared/kernels.mjs';

describe('SPK-ARC-024 leaderboard privacy', () => {
  it('hides public board below 20 and strips private fields', () => {
    const small = Array.from({ length: 19 }, (_, i) => ({
      id: `u${i}`,
      crowHandle: `c${i}`,
      masteryPoints: i,
      legalName: 'SECRET',
    }));
    assert.equal(buildLeaderboard(small).publicBoard, null);
    const big = Array.from({ length: 25 }, (_, i) => ({
      id: `u${i}`,
      crowHandle: `c${i}`,
      masteryPoints: 100 - i,
      legalName: 'SECRET',
    }));
    const board = buildLeaderboard(big, { optOutIds: new Set(['u0']), minors: new Set(['u1']) });
    assert.ok(board.publicBoard.length >= 20);
    assert.equal(board.publicBoard.every((r) => r.legalName === undefined), true);
    assert.equal(board.publicBoard.every((r) => r.trust === undefined), true);
    assert.equal(board.publicBoard.some((r) => r.crowHandle === 'c0'), false);
  });
});
