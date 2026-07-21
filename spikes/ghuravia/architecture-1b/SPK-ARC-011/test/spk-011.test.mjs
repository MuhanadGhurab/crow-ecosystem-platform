/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 * Gate: GHV.ARCHITECTURE.1B
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createFormulaRegistry,
  createHistoricalStandingStore,
  xpBandV1,
  xpBandV2,
} from "../lib/formula-version.mjs";

describe("SPK-ARC-011 formula-version reproduction", () => {
  it("stores and retrieves formula versions", () => {
    const reg = createFormulaRegistry();
    reg.register("FRM-XP-BAND", "1.0.0", xpBandV1);
    reg.register("FRM-XP-BAND", "2.0.0", xpBandV2);
    assert.ok(reg.get("FRM-XP-BAND", "1.0.0"));
    assert.ok(reg.get("FRM-XP-BAND", "2.0.0"));
  });

  it("reproduces historical standing under stored version despite newer formula", () => {
    const store = createHistoricalStandingStore();
    // xp=110 → Fledgling under v1, Skilled under v2
    store.record("u1", 110, "FRM-XP-BAND", "1.0.0", xpBandV1);
    assert.equal(xpBandV2(110), "Fledgling"); // wait - v2: <120 Fledgling, so still Fledgling
    // Use xp=150: v1 Skilled (<500), v2 Skilled (<600) — need clearer divergence
    store.record("u2", 110, "FRM-XP-BAND", "1.0.0", xpBandV1);
    // v1: 110 >=100 → Skilled; v2: 110 <120 → Fledgling
    assert.equal(xpBandV1(110), "Skilled");
    assert.equal(xpBandV2(110), "Fledgling");
    const replay = store.reproduce("u2", "FRM-XP-BAND", "1.0.0", xpBandV1);
    assert.equal(replay.match, true);
    assert.equal(replay.historical.band, "Skilled");
    // New formula must not silently rewrite stored history
    assert.notEqual(xpBandV2(110), replay.historical.band);
  });
});
