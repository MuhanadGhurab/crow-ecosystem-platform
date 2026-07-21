/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createActivationStore,
  SCREEN_STATE_SOURCE,
} from "../lib/activation-authority.mjs";

describe("SPK-ARC-003 activation authority", () => {
  it("rejects activation complete without risk accept (ACT-013)", () => {
    const s = createActivationStore();
    s.createAccount("a1");
    s.applyEmailResult("a1", "VERIFIED");
    s.acceptTerms("a1");
    assert.throws(() => s.completeActivation("a1"), /formula_incomplete/);
  });

  it("happy path ACT-011 → ACT-005 → ACT-013 → ACT-006", () => {
    const s = createActivationStore();
    s.createAccount("a2");
    s.applyEmailResult("a2", "VERIFIED");
    s.acceptTerms("a2");
    s.acceptRisk("a2");
    const done = s.completeActivation("a2");
    assert.equal(done.activation_complete, true);
  });

  it("rejects client-forged activation flags", () => {
    const s = createActivationStore();
    s.createAccount("a3");
    const r = s.tryClientForge("a3", {
      activation_complete: true,
      account_risk_status: "acceptable",
    });
    assert.equal(r.accepted, false);
    assert.equal(r.authoritative.activation_complete, false);
  });

  it("maps screens to server state; ACT-004 historical only", () => {
    assert.equal(SCREEN_STATE_SOURCE["ACT-004"], "HISTORICAL_ONLY_NOT_ACTIVE");
    assert.equal(SCREEN_STATE_SOURCE["ACT-013"], "server.account_risk_status");
  });
});
