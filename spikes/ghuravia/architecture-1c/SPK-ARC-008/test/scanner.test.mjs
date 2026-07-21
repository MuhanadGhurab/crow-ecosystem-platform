/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createScannerPipeline, HARMLESS_MALWARE_SIG, SECRET_MARKERS } from '../lib/scanner.mjs';

describe('SPK-ARC-008 scanning fail-closed', () => {
  it('passes clean synthetic content', () => {
    const p = createScannerPipeline();
    p.enqueue('o1', Buffer.from('clean synthetic evidence'));
    const r = p.run('o1');
    assert.equal(r.status, 'SCAN_PASSED');
    assert.equal(r.releaseAllowed, true);
  });

  it('fails on harmless malware signature and secrets', () => {
    const p = createScannerPipeline();
    p.enqueue('o2', Buffer.from(`x ${HARMLESS_MALWARE_SIG} y`));
    assert.equal(p.run('o2').releaseAllowed, false);
    p.enqueue('o3', Buffer.from(`token ${SECRET_MARKERS[0]}`));
    assert.equal(p.run('o3').status, 'SCAN_FAILED');
    assert.equal(p.run('o3').releaseAllowed, false);
  });

  it('scanner outage does not fail open', () => {
    const p = createScannerPipeline({ failOpen: true });
    p.enqueue('o4', Buffer.from('clean'));
    const r = p.run('o4', { scannerDown: true });
    assert.equal(r.releaseAllowed, false);
    assert.equal(r.status || p.get('o4').status, 'SCAN_INCONCLUSIVE');
  });
});
