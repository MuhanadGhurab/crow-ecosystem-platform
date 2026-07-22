import test from "node:test";
import assert from "node:assert/strict";
import {
  applyOnboardingCommand,
  canAccessOnboardingScreen,
  createInitialOnboarding,
  explainableLocksForCosmetics,
  isMinimumPersonalizationComplete,
  LOCKED_HABITAT,
  nestIntroHandoffAllowed,
  NEST_READINESS_ITEMS,
  originDoesNotAffectTrust,
  personalizationProgressionImpact,
  QUICK_START_DEFAULTS,
  type Onboarding,
} from "../src/index.ts";

const PERSONALIZATION_CATALOGUE_VERSION = "0.1.0";
const ORIGIN_CATALOGUE_VERSION = "0.1.0";

const base = (): Onboarding => createInitialOnboarding("o1");

test("guided path reaches minimum personalization then origin complete and nest handoff", () => {
  let o = base();
  o = applyOnboardingCommand(
    o,
    {
      type: "BEGIN_GUIDED_PERSONALIZATION",
      idempotencyKey: "1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  assert.equal(o.state, "PERSONALIZATION_STARTED");
  assert.equal(o.path, "GUIDED");
  assert.equal(canAccessOnboardingScreen(o, "IDN-001"), true);
  assert.equal(canAccessOnboardingScreen(o, "ONB-002"), false);

  o = applyOnboardingCommand(
    o,
    {
      type: "SAVE_CROW_BASICS",
      idempotencyKey: "2",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
      crowOptionId: "crow.rounded",
      colorOptionId: "color.dusk_teal",
      styleOptionId: "style.alert",
      accessoryOptionId: "accessory.pattern_soft",
    },
    1,
  ).aggregate;
  assert.equal(canAccessOnboardingScreen(o, "IDN-002"), true);

  o = applyOnboardingCommand(
    o,
    {
      type: "SELECT_HABITAT",
      idempotencyKey: "3",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
      habitatOptionId: "habitat.mountain_roost",
    },
    2,
  ).aggregate;
  o = applyOnboardingCommand(
    o,
    {
      type: "SELECT_CHARACTER",
      idempotencyKey: "4",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
      characterOptionId: "character.steady_builder",
    },
    3,
  ).aggregate;
  assert.ok(isMinimumPersonalizationComplete(o));
  assert.equal(canAccessOnboardingScreen(o, "ONB-002"), true);

  o = applyOnboardingCommand(
    o,
    {
      type: "SAVE_PERSONALIZATION_REVIEW",
      idempotencyKey: "5",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    4,
  ).aggregate;
  assert.equal(o.personalizationStatus, "REVIEWED");
  assert.equal(o.state, "PERSONALIZATION_MINIMUM_COMPLETE");

  o = applyOnboardingCommand(
    o,
    {
      type: "COMPLETE_ORIGIN",
      idempotencyKey: "6",
      actorRef: "u",
      originCatalogueVersion: ORIGIN_CATALOGUE_VERSION,
      originRegionOption: "region.gulf",
      originExperienceOption: "exp.exploring",
      originGoalsOptions: ["goal.foundations", "goal.confidence"],
    },
    5,
  ).aggregate;
  assert.equal(o.state, "ORIGIN_COMPLETE");
  assert.equal(o.originStatus, "COMPLETE");
  assert.ok(nestIntroHandoffAllowed(o));
  assert.equal(canAccessOnboardingScreen(o, "ONB-003"), true);

  o = applyOnboardingCommand(
    o,
    {
      type: "ACK_NEST_INTRO_HANDOFF",
      idempotencyKey: "7",
      actorRef: "u",
    },
    6,
  ).aggregate;
  assert.equal(o.state, "NEST_INTRO_HANDOFF");
});

test("quick-start applies defaults and unlocks origin", () => {
  let o = base();
  o = applyOnboardingCommand(
    o,
    {
      type: "BEGIN_QUICK_START",
      idempotencyKey: "q1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  assert.equal(o.path, "QUICK_START");
  assert.equal(o.crowOptionId, QUICK_START_DEFAULTS.crowOptionId);
  assert.equal(o.habitatOptionId, QUICK_START_DEFAULTS.habitatOptionId);
  assert.ok(isMinimumPersonalizationComplete(o));
  assert.equal(o.state, "PERSONALIZATION_MINIMUM_COMPLETE");
  assert.equal(canAccessOnboardingScreen(o, "ONB-002"), true);
});

test("stale version conflicts", () => {
  assert.throws(
    () =>
      applyOnboardingCommand(
        base(),
        {
          type: "BEGIN_GUIDED_PERSONALIZATION",
          idempotencyKey: "1",
          actorRef: "u",
          personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
        },
        9,
      ),
    /CONFLICT/,
  );
});

test("catalogue version mismatch conflicts", () => {
  assert.throws(
    () =>
      applyOnboardingCommand(
        base(),
        {
          type: "BEGIN_GUIDED_PERSONALIZATION",
          idempotencyKey: "1",
          actorRef: "u",
          personalizationCatalogueVersion: "9.9.9",
        },
        0,
      ),
    /CATALOGUE_VERSION_CONFLICT/,
  );
  const started = applyOnboardingCommand(
    base(),
    {
      type: "BEGIN_QUICK_START",
      idempotencyKey: "1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  assert.throws(
    () =>
      applyOnboardingCommand(
        started,
        {
          type: "SAVE_ORIGIN_DRAFT",
          idempotencyKey: "2",
          actorRef: "u",
          originCatalogueVersion: "0.0.0",
          originRegionOption: "region.gulf",
        },
        1,
      ),
    /CATALOGUE_VERSION_CONFLICT/,
  );
});

test("locked habitat cannot be equipped", () => {
  let o = applyOnboardingCommand(
    base(),
    {
      type: "BEGIN_GUIDED_PERSONALIZATION",
      idempotencyKey: "1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  assert.throws(
    () =>
      applyOnboardingCommand(
        o,
        {
          type: "SELECT_HABITAT",
          idempotencyKey: "2",
          actorRef: "u",
          personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
          habitatOptionId: LOCKED_HABITAT,
        },
        1,
      ),
    /FORBIDDEN/,
  );
  const locks = explainableLocksForCosmetics();
  assert.ok(locks.some((l) => l.optionId === LOCKED_HABITAT));
  assert.ok(locks.every((l) => l.requiredForProgress === false));
  assert.ok(locks.every((l) => l.previewAllowed === true));
});

test("review-later allows nest handoff without complete", () => {
  let o = applyOnboardingCommand(
    base(),
    {
      type: "BEGIN_QUICK_START",
      idempotencyKey: "1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  o = applyOnboardingCommand(
    o,
    {
      type: "MARK_ORIGIN_REVIEW_LATER",
      idempotencyKey: "2",
      actorRef: "u",
      originCatalogueVersion: ORIGIN_CATALOGUE_VERSION,
    },
    1,
  ).aggregate;
  assert.equal(o.originStatus, "REVIEW_LATER");
  assert.ok(nestIntroHandoffAllowed(o));
  o = applyOnboardingCommand(
    o,
    {
      type: "ACK_NEST_INTRO_HANDOFF",
      idempotencyKey: "3",
      actorRef: "u",
    },
    2,
  ).aggregate;
  assert.equal(o.state, "NEST_INTRO_HANDOFF");
});

test("origin complete validates catalogue option ids", () => {
  const o = applyOnboardingCommand(
    base(),
    {
      type: "BEGIN_QUICK_START",
      idempotencyKey: "1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  assert.throws(
    () =>
      applyOnboardingCommand(
        o,
        {
          type: "COMPLETE_ORIGIN",
          idempotencyKey: "2",
          actorRef: "u",
          originCatalogueVersion: ORIGIN_CATALOGUE_VERSION,
          originRegionOption: "region.free_text_not_allowed",
        },
        1,
      ),
    /ORIGIN_SCHEMA_CONFLICT/,
  );
});

test("minimum personalization requires unlocked habitat and character", () => {
  let o = applyOnboardingCommand(
    base(),
    {
      type: "BEGIN_GUIDED_PERSONALIZATION",
      idempotencyKey: "1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  o = applyOnboardingCommand(
    o,
    {
      type: "SAVE_CROW_BASICS",
      idempotencyKey: "2",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
      crowOptionId: "crow.classic",
      colorOptionId: "color.ink_sand",
      styleOptionId: "style.calm",
    },
    1,
  ).aggregate;
  assert.equal(isMinimumPersonalizationComplete(o), false);
  assert.throws(
    () =>
      applyOnboardingCommand(
        o,
        {
          type: "SAVE_PERSONALIZATION_REVIEW",
          idempotencyKey: "3",
          actorRef: "u",
          personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
        },
        2,
      ),
    /INVALID_TRANSITION/,
  );
});

test("personalization and origin produce no progression side effects", () => {
  assert.deepEqual(personalizationProgressionImpact(), {
    xp: 0,
    mastery: 0,
    rank: 0,
    prestige: 0,
    trust: 0,
  });
  assert.deepEqual(originDoesNotAffectTrust(), { trust: 0 });
  const result = applyOnboardingCommand(
    base(),
    {
      type: "BEGIN_QUICK_START",
      idempotencyKey: "1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  );
  assert.deepEqual(personalizationProgressionImpact(), {
    xp: 0,
    mastery: 0,
    rank: 0,
    prestige: 0,
    trust: 0,
  });
  assert.ok(result.events.includes("Onboarding.BEGIN_QUICK_START"));
  assert.equal(result.auditIntent.fieldCategory, "personalization_path");
});

const NEST_READINESS_CATALOGUE_VERSION = "0.1.0";

function toNestIntro(): Onboarding {
  let o = applyOnboardingCommand(
    base(),
    {
      type: "BEGIN_QUICK_START",
      idempotencyKey: "n1",
      actorRef: "u",
      personalizationCatalogueVersion: PERSONALIZATION_CATALOGUE_VERSION,
    },
    0,
  ).aggregate;
  o = applyOnboardingCommand(
    o,
    {
      type: "COMPLETE_ORIGIN",
      idempotencyKey: "n2",
      actorRef: "u",
      originCatalogueVersion: ORIGIN_CATALOGUE_VERSION,
      originRegionOption: "region.gulf",
      originExperienceOption: "exp.exploring",
      originGoalsOptions: ["goal.foundations"],
    },
    1,
  ).aggregate;
  return applyOnboardingCommand(
    o,
    {
      type: "ACK_NEST_INTRO_HANDOFF",
      idempotencyKey: "n3",
      actorRef: "u",
    },
    2,
  ).aggregate;
}

test("nest assessment start/save/submit and Nest Recommended blocks horizon", () => {
  let o = toNestIntro();
  assert.equal(canAccessOnboardingScreen(o, "ONB-003"), true);
  assert.equal(canAccessOnboardingScreen(o, "ONB-004"), false);

  o = applyOnboardingCommand(
    o,
    {
      type: "START_NEST_ASSESSMENT",
      idempotencyKey: "n4",
      actorRef: "u",
      nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
      nestAttemptId: "attempt-1",
    },
    3,
  ).aggregate;
  assert.equal(o.state, "NEST_ASSESSMENT_IN_PROGRESS");
  assert.equal(o.nestAttemptStatus, "IN_PROGRESS");
  assert.equal(canAccessOnboardingScreen(o, "ONB-004"), true);

  let version = 4;
  for (const item of NEST_READINESS_ITEMS) {
    const wrong = item.options.find((opt) => opt.id !== item.correctOptionId)!;
    o = applyOnboardingCommand(
      o,
      {
        type: "SAVE_NEST_ANSWER",
        idempotencyKey: `save-${item.id}`,
        actorRef: "u",
        nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
        nestItemId: item.id,
        nestOptionId: wrong.id,
      },
      version,
    ).aggregate;
    version += 1;
  }
  assert.equal(o.nestAnswers.length, 10);

  o = applyOnboardingCommand(
    o,
    {
      type: "SUBMIT_NEST_ASSESSMENT",
      idempotencyKey: "submit",
      actorRef: "u",
      nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
    },
    version,
  ).aggregate;
  assert.equal(o.state, "NEST_RESULT_READY");
  assert.equal(o.nestAttemptStatus, "SUBMITTED");
  assert.equal(o.nestScore, 0);
  assert.equal(o.nestBand, "NEST_RECOMMENDED");
  assert.equal(canAccessOnboardingScreen(o, "ONB-005"), true);
  assert.equal(canAccessOnboardingScreen(o, "ONB-007"), false);

  assert.throws(
    () =>
      applyOnboardingCommand(
        o,
        {
          type: "CONTINUE_TO_HORIZON_HANDOFF",
          idempotencyKey: "horizon-blocked",
          actorRef: "u",
        },
        version + 1,
      ),
    /FORBIDDEN/,
  );

  o = applyOnboardingCommand(
    o,
    {
      type: "CHOOSE_NEST_LEARNING_PATH",
      idempotencyKey: "learn",
      actorRef: "u",
    },
    version + 1,
  ).aggregate;
  assert.equal(o.state, "NEST_LEARNING_HANDOFF");
  assert.equal(canAccessOnboardingScreen(o, "ONB-006"), true);
  assert.equal(canAccessOnboardingScreen(o, "ONB-007"), false);

  assert.throws(
    () =>
      applyOnboardingCommand(
        o,
        {
          type: "START_NEST_ASSESSMENT",
          idempotencyKey: "retake",
          actorRef: "u",
          nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
          nestAttemptId: "attempt-2",
        },
        version + 2,
      ),
    /INVALID_TRANSITION|FORBIDDEN/,
  );
});

test("ready band unlocks horizon handoff only", () => {
  let o = toNestIntro();
  o = applyOnboardingCommand(
    o,
    {
      type: "START_NEST_ASSESSMENT",
      idempotencyKey: "r1",
      actorRef: "u",
      nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
      nestAttemptId: "attempt-ready",
    },
    3,
  ).aggregate;
  let version = 4;
  for (const item of NEST_READINESS_ITEMS) {
    o = applyOnboardingCommand(
      o,
      {
        type: "SAVE_NEST_ANSWER",
        idempotencyKey: `ok-${item.id}`,
        actorRef: "u",
        nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
        nestItemId: item.id,
        nestOptionId: item.correctOptionId,
      },
      version,
    ).aggregate;
    version += 1;
  }
  o = applyOnboardingCommand(
    o,
    {
      type: "SUBMIT_NEST_ASSESSMENT",
      idempotencyKey: "r-submit",
      actorRef: "u",
      nestReadinessCatalogueVersion: NEST_READINESS_CATALOGUE_VERSION,
    },
    version,
  ).aggregate;
  assert.equal(o.nestBand, "READY_TO_FLY");
  o = applyOnboardingCommand(
    o,
    {
      type: "CONTINUE_TO_HORIZON_HANDOFF",
      idempotencyKey: "r-horizon",
      actorRef: "u",
    },
    version + 1,
  ).aggregate;
  assert.equal(o.state, "HORIZON_CHOICE_HANDOFF");
  assert.equal(canAccessOnboardingScreen(o, "ONB-007"), true);
});
