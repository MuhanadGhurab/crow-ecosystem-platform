/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 * Spike: SPK-ARC-010 — progression event idempotency + reversal
 */

export const EVENT_TYPE_COUNT = 53;
export const VALIDITY_STATES = 7;
export const LEDGER_COUNT = 11;

export function createProgressionEngine() {
  /** @type {Map<string, object>} */
  const events = new Map();
  /** @type {Map<string, number>} */
  const xp = new Map();
  /** @type {Map<string, object>} */
  const audit = new Map();

  function ensureUser(u) {
    if (!xp.has(u)) xp.set(u, 0);
  }

  return {
    applyEvent(evt) {
      if (!evt.eventId) throw new Error("eventId_required");
      if (events.has(evt.eventId)) {
        return { applied: false, reason: "duplicate", standing: xp.get(evt.userId) };
      }
      if (evt.validity && evt.validity !== "valid") {
        return { applied: false, reason: "invalid_state", standing: xp.get(evt.userId) };
      }
      // Commercial events must not grant progression XP
      if (evt.type === "commercial.entitlement") {
        events.set(evt.eventId, { ...evt, appliedXp: 0 });
        return { applied: true, reason: "entitlement_only", standing: xp.get(evt.userId) ?? 0 };
      }
      ensureUser(evt.userId);
      const delta = evt.xpDelta ?? 0;
      xp.set(evt.userId, xp.get(evt.userId) + delta);
      events.set(evt.eventId, { ...evt, appliedXp: delta });
      audit.set(evt.eventId, { action: "apply", at: Date.now(), formulaVersion: evt.formulaVersion });
      return { applied: true, reason: "ok", standing: xp.get(evt.userId) };
    },
    reverseEvent(eventId, reason) {
      const evt = events.get(eventId);
      if (!evt) throw new Error("missing_event");
      if (evt.reversed) return { reversed: false, reason: "already_reversed" };
      ensureUser(evt.userId);
      xp.set(evt.userId, xp.get(evt.userId) - (evt.appliedXp || 0));
      evt.reversed = true;
      audit.set(`${eventId}:rev`, { action: "reverse", reason, at: Date.now() });
      return { reversed: true, standing: xp.get(evt.userId) };
    },
    standing(userId) {
      return xp.get(userId) ?? 0;
    },
    eventCount() {
      return events.size;
    },
  };
}
