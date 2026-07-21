/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../lib/upload-store.mjs';

describe('SPK-ARC-007 Evidence upload isolation', () => {
  it('resumable upload finalizes to quarantine without review access', async () => {
    const store = createStore();
    await store.init();
    const body = Buffer.from('synthetic evidence pdf bytes');
    const { uploadId, token } = store.beginUpload({
      ownerId: 'u1',
      mediaType: 'application/pdf',
      sizeBytes: body.length,
      filename: 'mission-report.pdf',
    });
    store.putChunk(uploadId, token, 0, body.subarray(0, 10));
    store.putChunk(uploadId, token, 10, body.subarray(10));
    const meta = await store.finalize(uploadId, token);
    assert.equal(meta.status, 'QUARANTINED');
    assert.equal(meta.reviewAccess, false);
    assert.equal(store.canReview(uploadId), false);
    assert.equal(meta.hash.length, 64);
  });

  it('rejects bad media, wrong token, and admin credential leak', async () => {
    const store = createStore();
    await store.init();
    assert.throws(() =>
      store.beginUpload({ ownerId: 'u1', mediaType: 'application/x-msdownload', sizeBytes: 10, filename: 'x.exe' }),
    );
    const body = Buffer.from('ok');
    const { uploadId, token } = store.beginUpload({
      ownerId: 'u1',
      mediaType: 'text/plain',
      sizeBytes: body.length,
      filename: 'a.txt',
    });
    assert.throws(() => store.putChunk(uploadId, 'bad', 0, body));
    store.putChunk(uploadId, token, 0, body);
    await store.finalize(uploadId, token);
    const admin = store.adminListKeys();
    assert.match(admin.note, /no_storage_credentials/);
  });

  it('review only after scan pass gate', async () => {
    const store = createStore();
    await store.init();
    const body = Buffer.from('png');
    const { uploadId, token } = store.beginUpload({
      ownerId: 'u1',
      mediaType: 'image/png',
      sizeBytes: body.length,
      filename: 'x.png',
    });
    store.putChunk(uploadId, token, 0, body);
    await store.finalize(uploadId, token);
    assert.throws(() => store.grantReviewAfterScan(uploadId));
    store.getMeta(uploadId).scanStatus = 'SCAN_PASSED';
    store.grantReviewAfterScan(uploadId);
    assert.equal(store.canReview(uploadId), true);
  });
});
