/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createProgressionEngine,
  EVENT_TYPE_COUNT,
  VALIDITY_STATES,
  LEDGER_COUNT,
} from "../lib/progression-ledger.mjs";

describe("SPK-ARC-010 progression idempotency and reversal", () => {
  it("documents design inventory capacities", () => {
    assert.equal(EVENT_TYPE_COUNT, 53);
    assert.equal(VALIDITY_STATES, 7);
    assert.equal(LEDGER_COUNT, 11);
  });

  it("rejects duplicate event IDs (no double XP)", () => {
    const eng = createProgressionEngine();
    const evt = {
      eventId: "evt-1",
      userId: "u1",
      type: "mission.complete",
      xpDelta: 10,
      validity: "valid",
      formulaVersion: "FRM-XP-001@0.1.1",
    };
    assert.equal(eng.applyEvent(evt).standing, 10);
    assert.equal(eng.applyEvent(evt).applied, false);
    assert.equal(eng.standing("u1"), 10);
  });

  it("reverses Evidence approval effect locally", () => {
    const eng = createProgressionEngine();
    eng.applyEvent({
      eventId: "ev-ok",
      userId: "u2",
      type: "evidence.approved",
      xpDelta: 25,
      validity: "valid",
      formulaVersion: "FRM-XP-001@0.1.1",
    });
    assert.equal(eng.standing("u2"), 25);
    eng.reverseEvent("ev-ok", "evidence_revoked");
    assert.equal(eng.standing("u2"), 0);
  });

  it("does not grant XP for commercial entitlement events", () => {
    const eng = createProgressionEngine();
    eng.applyEvent({
      eventId: "pay-1",
      userId: "u3",
      type: "commercial.entitlement",
      xpDelta: 999,
      validity: "valid",
    });
    assert.equal(eng.standing("u3"), 0);
  });
});
