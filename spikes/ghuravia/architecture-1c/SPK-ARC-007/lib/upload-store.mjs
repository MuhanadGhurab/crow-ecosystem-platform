/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 *
 * Local filesystem object-store simulation + resumable upload tokens.
 */
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, writeFile, readFile, access, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ALLOWED = new Set(['application/pdf', 'image/png', 'text/plain']);
const MAX_BYTES = 5 * 1024 * 1024;

export function createStore(root = join(tmpdir(), `ghv-1c-007-${randomBytes(4).toString('hex')}`)) {
  /** @type {Map<string, any>} */
  const sessions = new Map();
  /** @type {Map<string, any>} */
  const objects = new Map();
  /** @type {Map<string, any>} */
  const metadata = new Map();

  return {
    root,
    async init() {
      await mkdir(join(root, 'quarantine'), { recursive: true });
      await mkdir(join(root, 'objects'), { recursive: true });
    },
    beginUpload({ ownerId, mediaType, sizeBytes, filename }) {
      if (!ALLOWED.has(mediaType)) throw new Error('MEDIA_TYPE_REJECTED');
      if (sizeBytes > MAX_BYTES) throw new Error('SIZE_LIMIT');
      const safeName = String(filename || 'blob').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
      const uploadId = randomBytes(8).toString('hex');
      const token = randomBytes(16).toString('hex');
      const expiresAt = Date.now() + 15 * 60 * 1000;
      const objectKey = `quarantine/${ownerId}/${uploadId}/${safeName}`;
      sessions.set(uploadId, {
        uploadId,
        token,
        ownerId,
        mediaType,
        sizeBytes,
        objectKey,
        received: 0,
        chunks: [],
        expiresAt,
        status: 'UPLOAD_PENDING',
      });
      return { uploadId, token, objectKey, expiresAt, maxBytes: MAX_BYTES };
    },
    putChunk(uploadId, token, offset, chunk) {
      const s = sessions.get(uploadId);
      if (!s) throw new Error('UNKNOWN_UPLOAD');
      if (s.token !== token) throw new Error('UNAUTHORIZED');
      if (Date.now() > s.expiresAt) throw new Error('TOKEN_EXPIRED');
      if (offset !== s.received) throw new Error('OFFSET_MISMATCH');
      if (s.received + chunk.length > s.sizeBytes) throw new Error('OVERFLOW');
      s.chunks.push(Buffer.from(chunk));
      s.received += chunk.length;
      return { received: s.received };
    },
    async finalize(uploadId, token) {
      const s = sessions.get(uploadId);
      if (!s) throw new Error('UNKNOWN_UPLOAD');
      if (s.token !== token) throw new Error('UNAUTHORIZED');
      if (s.received !== s.sizeBytes) throw new Error('INCOMPLETE');
      const body = Buffer.concat(s.chunks);
      const hash = createHash('sha256').update(body).digest('hex');
      const path = join(root, s.objectKey);
      await mkdir(join(root, 'quarantine', s.ownerId, uploadId), { recursive: true });
      await writeFile(path, body);
      const meta = {
        objectId: uploadId,
        ownerId: s.ownerId,
        objectKey: s.objectKey,
        hash,
        size: body.length,
        mediaType: s.mediaType,
        status: 'QUARANTINED',
        scanStatus: 'SCAN_PENDING',
        reviewAccess: false,
      };
      objects.set(uploadId, { path, hash });
      metadata.set(uploadId, meta);
      s.status = 'UPLOADED';
      return meta;
    },
    getMeta(objectId) {
      return metadata.get(objectId) || null;
    },
    canReview(objectId) {
      const m = metadata.get(objectId);
      return Boolean(m && m.reviewAccess === true && m.scanStatus === 'SCAN_PASSED');
    },
    grantReviewAfterScan(objectId) {
      const m = metadata.get(objectId);
      if (!m) throw new Error('NOT_FOUND');
      if (m.scanStatus !== 'SCAN_PASSED') throw new Error('SCAN_NOT_PASSED');
      m.reviewAccess = true;
      m.status = 'RELEASED_FOR_REVIEW';
      return m;
    },
    async signedRead(objectId, actorId, { isOwner, isReviewer, expiresMs = 60_000 } = {}) {
      const m = metadata.get(objectId);
      if (!m) throw new Error('NOT_FOUND');
      if (!(isOwner && actorId === m.ownerId) && !isReviewer) throw new Error('FORBIDDEN');
      if (isReviewer && !m.reviewAccess) throw new Error('NOT_RELEASED');
      return {
        url: `file://${join(root, m.objectKey)}?sig=${randomBytes(4).toString('hex')}`,
        expiresAt: Date.now() + expiresMs,
      };
    },
    adminListKeys() {
      // Admin of app DB must not see storage credentials — simulate isolation
      return { note: 'no_storage_credentials_exposed', objectCount: metadata.size };
    },
  };
}

export const SPIKE_LIMITS = { ALLOWED, MAX_BYTES };
