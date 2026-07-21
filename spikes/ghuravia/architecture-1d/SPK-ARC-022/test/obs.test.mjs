/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeLog } from '../../shared/kernels.mjs';

describe('SPK-ARC-022 observability privacy', () => {
  it('redacts secrets and strips evidence content', () => {
    const s = sanitizeLog({
      level: 'error',
      message: 'upload failed AKIAIOSFODNN7EXAMPLE',
      evidenceContent: 'raw bytes',
      password: 'x',
      correlationId: 'c1',
    });
    assert.equal(s.evidenceContent, undefined);
    assert.equal(s.password, undefined);
    assert.match(s.message, /REDACTED/);
    assert.equal(s.correlationId, 'c1');
  });
});
