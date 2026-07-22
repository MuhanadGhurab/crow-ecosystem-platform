import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAnswerRecord,
  computeReadinessBand,
  nestReadinessCapabilityCoverage,
  nestReadinessIdentityImpact,
  nestReadinessProgressionImpact,
  nestReadinessTotalItems,
  NEST_READINESS_ITEMS,
  scoreAttempt,
  scorePercentage,
} from "../src/index.ts";

test("thresholds: 49 Nest Recommended, 50 Guided Skip, 69 Guided Skip, 70 Ready", () => {
  assert.equal(computeReadinessBand(49), "NEST_RECOMMENDED");
  assert.equal(computeReadinessBand(50), "GUIDED_SKIP");
  assert.equal(computeReadinessBand(69), "GUIDED_SKIP");
  assert.equal(computeReadinessBand(70), "READY_TO_FLY");
  assert.equal(computeReadinessBand(0), "NEST_RECOMMENDED");
  assert.equal(computeReadinessBand(100), "READY_TO_FLY");
});

test("scorePercentage rounding and scoreAttempt bands", () => {
  assert.equal(scorePercentage(0, 10), 0);
  assert.equal(scorePercentage(5, 10), 50);
  assert.equal(scorePercentage(7, 10), 70);
  assert.equal(scorePercentage(10, 10), 100);
  assert.equal(nestReadinessTotalItems(), 10);

  const allCorrect = NEST_READINESS_ITEMS.map((item) => ({
    itemId: item.id,
    optionId: item.correctOptionId,
  }));
  const perfect = scoreAttempt(allCorrect);
  assert.equal(perfect.score, 100);
  assert.equal(perfect.band, "READY_TO_FLY");
  assert.equal(perfect.weakCapabilityIds.length, 0);

  const allWrong = NEST_READINESS_ITEMS.map((item) => {
    const wrong = item.options.find((o) => o.id !== item.correctOptionId)!;
    return { itemId: item.id, optionId: wrong.id };
  });
  const zero = scoreAttempt(allWrong);
  assert.equal(zero.score, 0);
  assert.equal(zero.band, "NEST_RECOMMENDED");
  assert.ok(zero.weakCapabilityIds.length > 0);
});

test("catalogue covers all 13 Nest capabilities", () => {
  const coverage = nestReadinessCapabilityCoverage();
  assert.equal(coverage.length, 13);
  for (let i = 1; i <= 13; i += 1) {
    const id = `NST-CAP-${String(i).padStart(3, "0")}`;
    assert.ok(coverage.includes(id as (typeof coverage)[number]), id);
  }
});

test("nest readiness has zero progression and identity impact", () => {
  assert.deepEqual(nestReadinessProgressionImpact(), {
    xp: 0,
    mastery: 0,
    rank: 0,
    prestige: 0,
    trust: 0,
  });
  assert.deepEqual(nestReadinessIdentityImpact(), {
    lineageAwarded: false,
    crossWingMajorCreated: false,
    evidenceSealIssued: false,
    fusionSignatureIssued: false,
    paymentEntitlementChanged: false,
  });
});

test("buildAnswerRecord marks correctness from catalogue", () => {
  const item = NEST_READINESS_ITEMS[0]!;
  const ok = buildAnswerRecord(item.id, item.correctOptionId);
  assert.equal(ok.correct, true);
  const wrong = item.options.find((o) => o.id !== item.correctOptionId)!;
  const bad = buildAnswerRecord(item.id, wrong.id);
  assert.equal(bad.correct, false);
});
