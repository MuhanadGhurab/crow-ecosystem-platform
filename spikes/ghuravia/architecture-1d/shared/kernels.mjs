/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Multi-spike domain kernels for Architecture 1D
 */

/** SPK-ARC-002 RTL + LTR islands */
export function composeDocument({ locale, dir, blocks }) {
  const documentDir = dir || (locale?.startsWith('ar') ? 'rtl' : 'ltr');
  return {
    documentDir,
    blocks: blocks.map((b) => {
      if (b.kind === 'technical') {
        return { ...b, dir: 'ltr', unicodeBidi: 'isolate' };
      }
      return { ...b, dir: documentDir };
    }),
  };
}

/** SPK-ARC-017 accessibility checks (automated synthetic) */
export function a11yChecklist(surface) {
  const required = [
    'keyboardNav',
    'visibleFocus',
    'landmarks',
    'headingOrder',
    'reducedMotionRespect',
    'formErrorsAnnounced',
  ];
  const missing = required.filter((k) => !surface[k]);
  return {
    automatedPass: missing.length === 0,
    missing,
    userValidation: 'NOT_RUN',
    manualReview: 'REQUIRED',
  };
}

/** SPK-ARC-006 save/resume */
export function createSaveResumeStore() {
  /** @type {Map<string, any>} */
  const missions = new Map();
  return {
    save({ userId, missionId, revision, payload, clientClock }) {
      const key = `${userId}:${missionId}`;
      const cur = missions.get(key);
      if (cur && revision < cur.revision) {
        return { ok: false, conflict: true, server: cur, code: 'STALE_WRITE' };
      }
      if (cur && revision === cur.revision && cur.idempotencyKey === payload.idempotencyKey) {
        return { ok: true, idempotent: true, record: cur };
      }
      const next = {
        userId,
        missionId,
        revision: (cur?.revision || 0) + 1,
        payload: { ...payload, body: payload.body },
        clientClock,
        updatedAt: Date.now(),
        idempotencyKey: payload.idempotencyKey,
        status: payload.status || 'DRAFT',
      };
      if (payload.status === 'COMPLETE') {
        // completion is server-authoritative only via complete()
        throw new Error('USE_COMPLETE_COMMAND');
      }
      missions.set(key, next);
      return { ok: true, record: next };
    },
    complete({ userId, missionId, revision }) {
      const key = `${userId}:${missionId}`;
      const cur = missions.get(key);
      if (!cur) throw new Error('NOT_FOUND');
      if (revision < cur.revision) return { ok: false, conflict: true };
      cur.status = 'COMPLETE';
      cur.revision += 1;
      cur.completedAt = Date.now();
      return { ok: true, record: cur };
    },
    classify(op) {
      const map = {
        draft_edit: 'OFFLINE_CAPABLE',
        read_progress: 'OFFLINE_READ_ONLY',
        submit_evidence: 'ONLINE_ONLY',
        complete_mission: 'ONLINE_ONLY',
        approve_evidence: 'ONLINE_ONLY',
      };
      return map[op] || 'RECONNECT_REQUIRED';
    },
    get(userId, missionId) {
      return missions.get(`${userId}:${missionId}`) || null;
    },
  };
}

/** SPK-ARC-023 Skyboard composition */
export function composeSkyboard(panels) {
  const results = {};
  const failures = [];
  for (const p of panels) {
    if (p.fail) {
      failures.push(p.id);
      results[p.id] = { status: 'DEGRADED', data: p.fallback || null, critical: !!p.critical };
    } else {
      results[p.id] = { status: 'OK', data: p.data, critical: !!p.critical };
    }
  }
  // privacy locks
  for (const id of Object.keys(results)) {
    const d = results[id].data;
    if (d && (d.trustScore != null || d.privateEvidence || d.paymentRank)) {
      throw new Error('PRIVACY_LEAK');
    }
  }
  const criticalFailed = panels.some((p) => p.critical && p.fail);
  return {
    panels: results,
    failures,
    pageStatus: criticalFailed ? 'CRITICAL_DEGRADED' : failures.length ? 'PARTIAL' : 'OK',
    cacheRole: 'NON_AUTHORITATIVE',
  };
}

/** SPK-ARC-012 payment / entitlement */
export function createEntitlementEngine() {
  /** @type {Map<string, any>} */
  const events = new Map();
  /** @type {Map<string, any>} */
  const entitlements = new Map();
  /** @type {Map<string, any>} */
  const progressionTouches = new Map();

  return {
    ingestWebhook({ eventId, signatureOk, type, userId, order }) {
      if (!signatureOk) throw new Error('SIGNATURE_INVALID');
      if (events.has(eventId)) return { idempotent: true, entitlement: entitlements.get(userId) };
      events.set(eventId, { eventId, type, userId, order, at: Date.now() });
      const ent = entitlements.get(userId) || { userId, status: 'NONE', plan: null, version: 0 };
      if (type === 'payment.succeeded') {
        ent.status = 'ACTIVE';
        ent.plan = order.plan;
        ent.version += 1;
      } else if (type === 'payment.refunded' || type === 'subscription.cancelled') {
        ent.status = 'INACTIVE';
        ent.version += 1;
      } else if (type === 'payment.failed') {
        // no entitlement grant
      }
      entitlements.set(userId, ent);
      // commercial must never touch progression
      progressionTouches.set(userId, progressionTouches.get(userId) || { xp: 0, mastery: 0 });
      return { idempotent: false, entitlement: ent, progressionEffect: false };
    },
    getEntitlement(userId) {
      return entitlements.get(userId) || null;
    },
    getProgressionTouch(userId) {
      return progressionTouches.get(userId) || { xp: 0, mastery: 0 };
    },
  };
}

/** SPK-ARC-014/015 Live Sky */
export function createLiveSky() {
  /** @type {Map<string, any>} */
  const sessions = new Map();
  /** @type {Map<string, any>} */
  const contributions = new Map();
  /** @type {Map<string, number>} */
  const cursors = new Map();

  return {
    join({ eventId, userId, role }) {
      const key = `${eventId}:${userId}`;
      sessions.set(key, { eventId, userId, role, connected: true });
      cursors.set(key, 0);
      return sessions.get(key);
    },
    command({ eventId, userId, commandId, action }) {
      const s = sessions.get(`${eventId}:${userId}`);
      if (!s) throw new Error('NOT_JOINED');
      if (s.role === 'spectator') throw new Error('SPECTATOR_CANNOT_MUTATE');
      if (s.role !== 'participant' && s.role !== 'moderator') throw new Error('FORBIDDEN');
      if (contributions.has(commandId)) return { duplicate: true, contribution: contributions.get(commandId) };
      const c = { commandId, eventId, userId, action, at: Date.now() };
      contributions.set(commandId, c);
      return { duplicate: false, contribution: c };
    },
    spectatorProjection(eventId) {
      return {
        eventId,
        safeState: 'PHASE_VISIBLE',
        participantPrivate: undefined,
        canMutate: false,
      };
    },
    reconnect({ eventId, userId, lastCursor }) {
      const key = `${eventId}:${userId}`;
      const s = sessions.get(key);
      if (!s) throw new Error('NOT_JOINED');
      s.connected = true;
      const from = lastCursor ?? cursors.get(key) ?? 0;
      cursors.set(key, from);
      return { replayFrom: from, duplicateContributionRisk: false };
    },
  };
}

/** SPK-ARC-016 Arabic search */
export function normalizeArabic(s) {
  return s
    .normalize('NFKC')
    .replace(/[\u064B-\u065F]/g, '') // diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase();
}

export function createSearchIndex() {
  /** @type {any[]} */
  const docs = [];
  return {
    add(doc) {
      docs.push({
        ...doc,
        _n: normalizeArabic(`${doc.title || ''} ${doc.body || ''}`),
        _en: `${doc.title || ''} ${doc.body || ''}`.toLowerCase(),
      });
    },
    search(q, viewer) {
      const nq = normalizeArabic(q);
      const eq = q.toLowerCase();
      return docs
        .filter((d) => {
          if (d.classification === 'RESTRICTED' && !viewer.canSeeRestricted) return false;
          if (d.privateEvidence) return false;
          if (d.moderationRemoved) return false;
          if (!d.authorizedFor?.includes(viewer.role) && viewer.role !== 'admin') return false;
          return d._n.includes(nq) || d._en.includes(eq);
        })
        .map(({ _n, _en, privateEvidence, ...rest }) => rest);
    },
  };
}

/** SPK-ARC-018 notifications */
export function createNotificationBus() {
  /** @type {Map<string, any>} */
  const outbox = new Map();
  let businessVersion = 0;
  return {
    enqueue({ id, channel, userId, template }) {
      if (outbox.has(id)) return { idempotent: true };
      outbox.set(id, { id, channel, userId, template, status: 'PENDING' });
      return { idempotent: false };
    },
    deliver(id, { fail = false } = {}) {
      const n = outbox.get(id);
      if (!n) throw new Error('NOT_FOUND');
      if (fail) {
        n.status = 'FAILED';
        // business state unchanged
        return { delivered: false, businessVersion };
      }
      n.status = 'SENT';
      return { delivered: true, businessVersion };
    },
    bumpBusiness() {
      businessVersion += 1;
      return businessVersion;
    },
    getBusinessVersion() {
      return businessVersion;
    },
  };
}

/** SPK-ARC-024 leaderboards */
export function buildLeaderboard(eligibleUsers, { optOutIds = new Set(), minors = new Set() } = {}) {
  const pool = eligibleUsers.filter((u) => !optOutIds.has(u.id));
  if (pool.length < 20) {
    return { publicBoard: null, reason: 'POPULATION_BELOW_20', context: { eligible: pool.length } };
  }
  const ranked = [...pool]
    .sort((a, b) => b.masteryPoints - a.masteryPoints || a.crowHandle.localeCompare(b.crowHandle))
    .map((u, i) => ({
      rank: i + 1,
      crowHandle: u.crowHandle,
      // never expose trust, xp-as-mastery-tiebreak already avoided for mastery boards
      trust: undefined,
      legalName: undefined,
      exactAge: undefined,
      isMinor: minors.has(u.id) ? true : undefined,
    }));
  // strip private fields for minors already undefined
  return { publicBoard: ranked, reason: null, snapshot: true };
}

/** SPK-ARC-022 observability privacy */
export function sanitizeLog(entry) {
  const ban = ['evidenceContent', 'password', 'secret', 'privateKey', 'trustSignalDetail'];
  const out = { ...entry };
  for (const k of ban) {
    if (k in out) delete out[k];
  }
  if (typeof out.message === 'string') {
    out.message = out.message.replace(/AKIA[0-9A-Z]{16}/g, '[REDACTED]');
  }
  return out;
}

/** SPK-ARC-020 backup/restore */
export function createBackupStore() {
  /** @type {Map<string, any>} */
  const snapshots = new Map();
  /** @type {Map<string, any>} */
  const live = new Map();
  /** @type {any[]} */
  const audit = [];

  return {
    put(record) {
      live.set(record.id, { ...record });
    },
    backup(tag) {
      const data = Object.fromEntries(live);
      snapshots.set(tag, JSON.parse(JSON.stringify(data)));
      return { tag, count: live.size };
    },
    delete(id) {
      live.delete(id);
    },
    restoreTargeted(tag, id) {
      const snap = snapshots.get(tag);
      if (!snap || !snap[id]) throw new Error('MISSING_IN_BACKUP');
      const prior = live.get(id);
      live.set(id, { ...snap[id] });
      audit.push({
        action: 'TARGETED_RESTORE',
        id,
        tag,
        priorRef: prior ? prior.revision : null,
        resultRef: snap[id].revision,
        at: Date.now(),
      });
      return live.get(id);
    },
    get(id) {
      return live.get(id) || null;
    },
    auditLog() {
      return [...audit];
    },
  };
}
