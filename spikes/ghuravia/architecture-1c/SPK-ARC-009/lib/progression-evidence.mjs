/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 *
 * Evidence approval/revocation drives targeted Capability/Route recalculation only.
 * Raw Evidence objects never enter progression ledgers.
 */
export function createProgressionEngine() {
  /** @type {Map<string, any>} */
  const events = new Map();
  /** @type {Map<string, any>} */
  const capabilities = new Map();
  /** @type {Map<string, any>} */
  const routes = new Map();
  /** @type {Map<string, string[]>} */
  const evidenceIndex = new Map();

  function ensureUser(userId) {
    if (!capabilities.has(userId)) {
      capabilities.set(userId, new Map());
      routes.set(userId, new Map());
      evidenceIndex.set(userId, []);
    }
  }

  function recalcUser(userId, affectedCaps) {
    ensureUser(userId);
    const caps = capabilities.get(userId);
    const rts = routes.get(userId);
    for (const capId of affectedCaps) {
      const approved = (evidenceIndex.get(userId) || [])
        .map((eid) => events.get(eid))
        .filter((e) => e && e.status === 'APPROVED' && e.capabilityId === capId);
      const mastery = approved.length >= 1 ? 'MASTERED' : 'NOT_MASTERED';
      caps.set(capId, { capabilityId: capId, mastery, formulaVersion: 'v1.0.0-spike' });
      const routeId = `RT-${capId}`;
      const peer = [...caps.values()].filter((c) => c.capabilityId.startsWith(capId.split('-')[0] || capId));
      rts.set(routeId, {
        routeId,
        status: mastery === 'MASTERED' ? 'ROUTE_ELIGIBLE' : 'ROUTE_INCOMPLETE',
        basedOn: capId,
      });
    }
  }

  return {
    approveEvidence({ evidenceId, userId, capabilityId, objectRef }) {
      if (events.has(evidenceId) && events.get(evidenceId).status === 'APPROVED') {
        return { idempotent: true, event: events.get(evidenceId) };
      }
      // objectRef stored as opaque id only — never body
      const ev = {
        evidenceId,
        userId,
        capabilityId,
        objectRef,
        status: 'APPROVED',
        recordedAt: Date.now(),
        kind: 'EVIDENCE_APPROVED',
      };
      events.set(evidenceId, ev);
      ensureUser(userId);
      evidenceIndex.get(userId).push(evidenceId);
      recalcUser(userId, [capabilityId]);
      return { idempotent: false, event: ev, ledgerContainsObjectBody: false };
    },
    revokeEvidence({ evidenceId, reason, actorId }) {
      const ev = events.get(evidenceId);
      if (!ev) throw new Error('NOT_FOUND');
      const prior = { ...ev };
      ev.status = 'REVOKED';
      ev.revokedBy = actorId;
      ev.revokeReason = reason;
      ev.revokedAt = Date.now();
      // historical event preserved
      events.set(`${evidenceId}:revoke:${ev.revokedAt}`, {
        kind: 'EVIDENCE_REVOKED',
        evidenceId,
        priorStatus: prior.status,
        reason,
        actorId,
        recordedAt: ev.revokedAt,
      });
      recalcUser(ev.userId, [ev.capabilityId]);
      return { event: ev, recalculated: [ev.capabilityId] };
    },
    restoreEvidence({ evidenceId, actorId, reason }) {
      const ev = events.get(evidenceId);
      if (!ev) throw new Error('NOT_FOUND');
      ev.status = 'APPROVED';
      ev.restoredBy = actorId;
      ev.restoreReason = reason;
      recalcUser(ev.userId, [ev.capabilityId]);
      return { event: ev, recalculated: [ev.capabilityId] };
    },
    getCapability(userId, capabilityId) {
      return capabilities.get(userId)?.get(capabilityId) || null;
    },
    getRoute(userId, routeId) {
      return routes.get(userId)?.get(routeId) || null;
    },
    snapshot(userId) {
      ensureUser(userId);
      return {
        capabilities: Object.fromEntries(capabilities.get(userId)),
        routes: Object.fromEntries(routes.get(userId)),
        events: [...events.values()].filter((e) => e.userId === userId),
      };
    },
  };
}
