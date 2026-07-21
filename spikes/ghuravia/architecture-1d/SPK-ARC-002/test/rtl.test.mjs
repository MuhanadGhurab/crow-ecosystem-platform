/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { composeDocument } from '../../shared/kernels.mjs';

describe('SPK-ARC-002 RTL LTR islands', () => {
  it('Arabic document is RTL with LTR technical islands', () => {
    const doc = composeDocument({
      locale: 'ar-SA',
      blocks: [
        { kind: 'prose', text: 'مرحبا' },
        { kind: 'technical', text: 'npm install && curl https://example.com' },
        { kind: 'technical', text: '192.168.1.1' },
      ],
    });
    assert.equal(doc.documentDir, 'rtl');
    assert.equal(doc.blocks[0].dir, 'rtl');
    assert.equal(doc.blocks[1].dir, 'ltr');
    assert.equal(doc.blocks[1].unicodeBidi, 'isolate');
    assert.equal(doc.blocks[2].dir, 'ltr');
  });
});
