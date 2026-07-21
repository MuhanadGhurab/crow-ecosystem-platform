/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSearchIndex, normalizeArabic } from '../../shared/kernels.mjs';

describe('SPK-ARC-016 Arabic search', () => {
  it('normalizes Arabic and enforces privacy/auth filters', () => {
    assert.equal(normalizeArabic('إِنْشاء'), normalizeArabic('انشاء'));
    const idx = createSearchIndex();
    idx.add({
      id: '1',
      title: 'مسار الحماية',
      body: 'Route PROTECT basics',
      authorizedFor: ['learner'],
      classification: 'PUBLIC',
    });
    idx.add({
      id: '2',
      title: 'secret',
      body: 'private',
      privateEvidence: true,
      authorizedFor: ['learner'],
    });
    idx.add({
      id: '3',
      title: 'restricted ops',
      body: 'admin only',
      classification: 'RESTRICTED',
      authorizedFor: ['admin'],
    });
    const hits = idx.search('الحمايه', { role: 'learner', canSeeRestricted: false });
    assert.equal(hits.some((h) => h.id === '1'), true);
    assert.equal(hits.some((h) => h.id === '2'), false);
    assert.equal(hits.some((h) => h.id === '3'), false);
  });
});
