/**
 * Browser persistence for ERP requests until API integration.
 * Audit rows support enriched fields; legacy entries are normalized on read (see {@link normalizeAuditEntry}).
 */

const REQUESTS_KEY = "cybercrow.requests.v1";
const DRAFT_KEY = "cybercrow.requestDraft.v1";
const AUDIT_LOG_KEY = "cybercrow.auditLog.v1";

/**
 * @returns {Array<Record<string, unknown>>}
 */
export function readRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * @param {Array<Record<string, unknown>>} requests
 */
export function writeRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

/**
 * @param {Record<string, unknown>} request
 */
export function appendRequest(request) {
  const list = readRequests();
  list.unshift(request);
  writeRequests(list);
}

/**
 * @returns {Record<string, unknown> | null}
 */
export function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * @param {Record<string, unknown> | null} draft
 */
export function writeDraft(draft) {
  if (!draft) {
    localStorage.removeItem(DRAFT_KEY);
    return;
  }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

/**
 * Raw JSON rows as stored (may predate enriched audit fields).
 * @returns {Array<Record<string, unknown>>}
 */
function readAuditLogRaw() {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Normalize a single audit row for display and persistence (backward compatible).
 * @param {Record<string, unknown>} entry
 * @returns {Record<string, unknown>}
 */
export function normalizeAuditEntry(entry) {
  const e = /** @type {Record<string, unknown>} */ (
    entry && typeof entry === "object" ? { ...entry } : {}
  );
  const created =
    (typeof e.createdAt === "string" && e.createdAt) ||
    (typeof e.timestamp === "string" && e.timestamp) ||
    new Date().toISOString();
  const id =
    (typeof e.id === "string" && e.id.trim()) ||
    `aud_legacy_${String(e.requestId || "na")}_${created}`;

  const action = String(e.action || "legacy_event");
  const actorName =
    typeof e.actorName === "string" && e.actorName.trim()
      ? e.actorName.trim()
      : "Unknown (legacy)";
  const actorRole =
    typeof e.actorRole === "string" && e.actorRole.trim()
      ? e.actorRole.trim()
      : "unknown";

  const target =
    (e.target != null && String(e.target).trim()) ||
    (e.requestId != null && String(e.requestId).trim()) ||
    (e.companyName != null && String(e.companyName).trim()) ||
    "—";

  const sevRaw = String(e.severity || "info").toLowerCase();
  const severity =
    sevRaw === "warning" || sevRaw === "critical" ? sevRaw : "info";

  return {
    ...e,
    id,
    createdAt: created,
    timestamp: created,
    action,
    actorName,
    actorRole,
    target,
    severity,
  };
}

/**
 * @returns {Array<Record<string, unknown>>}
 */
export function readAuditLog() {
  return readAuditLogRaw().map((row) => normalizeAuditEntry(/** @type {Record<string, unknown>} */ (row)));
}

/**
 * Prepends one audit row (newest first), same merge style as submitted requests.
 * @param {Record<string, unknown>} entry
 */
export function appendAuditEntry(entry) {
  const list = readAuditLogRaw();
  const id =
    typeof entry.id === "string" && entry.id.trim()
      ? entry.id.trim()
      : `aud_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const createdAt =
    typeof entry.createdAt === "string" && entry.createdAt
      ? entry.createdAt
      : typeof entry.timestamp === "string" && entry.timestamp
        ? entry.timestamp
        : new Date().toISOString();
  const row = normalizeAuditEntry({ ...entry, id, createdAt, timestamp: createdAt });
  list.unshift(row);
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(list));
}

/**
 * @param {string} requestId
 * @param {Record<string, unknown>} patch
 * @returns {{ prev: Record<string, unknown>, next: Record<string, unknown> } | null}
 */
export function patchRequestById(requestId, patch) {
  const list = readRequests();
  const idx = list.findIndex((r) => String(/** @type {Record<string, unknown>} */ (r).id) === String(requestId));
  if (idx === -1) return null;
  const prev = { .../** @type {Record<string, unknown>} */ (list[idx]) };
  list[idx] = { .../** @type {Record<string, unknown>} */ (list[idx]), ...patch };
  writeRequests(list);
  return { prev, next: /** @type {Record<string, unknown>} */ (list[idx]) };
}
