import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canAccessOnboardingRoute,
  onboardingRouteFor,
  resolveResumeScreen,
  ONBOARDING_ROUTES,
} from "../lib/onboarding-routes.js";
import { isAllowedReturnTo as activationAllowed } from "../lib/activation-routes.js";

const notStarted = {
  state: "NOT_STARTED",
  personalization: {
    path: null,
    status: "NOT_STARTED",
    crowOptionId: null,
    colorOptionId: null,
    styleOptionId: null,
    habitatOptionId: null,
    characterOptionId: null,
    accessoryOptionId: null,
  },
  origin: { status: "NOT_STARTED" },
  accessibleScreens: ["ONB-001"],
};

const guidedStarted = {
  state: "PERSONALIZATION_STARTED",
  personalization: {
    path: "GUIDED",
    status: "DRAFT",
    crowOptionId: null,
    colorOptionId: null,
    styleOptionId: null,
    habitatOptionId: null,
    characterOptionId: null,
    accessoryOptionId: null,
  },
  origin: { status: "NOT_STARTED" },
  accessibleScreens: ["ONB-001", "IDN-001"],
};

const crowBasics = {
  state: "PERSONALIZATION_STARTED",
  personalization: {
    path: "GUIDED",
    status: "DRAFT",
    crowOptionId: "crow.classic",
    colorOptionId: "color.ink_sand",
    styleOptionId: "style.calm",
    habitatOptionId: null,
    characterOptionId: null,
    accessoryOptionId: "accessory.none",
  },
  origin: { status: "NOT_STARTED" },
  accessibleScreens: ["ONB-001", "IDN-001", "IDN-002"],
};

const minPersonalization = {
  state: "PERSONALIZATION_MINIMUM_COMPLETE",
  personalization: {
    path: "GUIDED",
    status: "MINIMUM_COMPLETE",
    crowOptionId: "crow.classic",
    colorOptionId: "color.ink_sand",
    styleOptionId: "style.calm",
    habitatOptionId: "habitat.coastal_shelf",
    characterOptionId: "character.curious_scout",
    accessoryOptionId: "accessory.none",
  },
  origin: { status: "NOT_STARTED" },
  accessibleScreens: ["ONB-001", "IDN-001", "IDN-002", "IDN-003", "ONB-002"],
};

const originComplete = {
  state: "ORIGIN_COMPLETE",
  personalization: {
    path: "GUIDED",
    status: "REVIEWED",
    crowOptionId: "crow.classic",
    colorOptionId: "color.ink_sand",
    styleOptionId: "style.calm",
    habitatOptionId: "habitat.coastal_shelf",
    characterOptionId: "character.curious_scout",
    accessoryOptionId: "accessory.none",
  },
  origin: { status: "COMPLETE" },
  accessibleScreens: [
    "ONB-001",
    "IDN-001",
    "IDN-002",
    "IDN-003",
    "ONB-002",
    "ONB-003",
  ],
};

test("activated entry: null onboarding allows ONB-001 only", () => {
  assert.equal(canAccessOnboardingRoute("ONB-001", null).allowed, true);
  assert.equal(canAccessOnboardingRoute("IDN-001", null).allowed, false);
  assert.equal(canAccessOnboardingRoute("ONB-002", null).redirectTo, "ONB-001");
  assert.equal(canAccessOnboardingRoute("ONB-003", null).allowed, false);
});

test("ONB-002 unauthorized before minimum personalization", () => {
  const r = canAccessOnboardingRoute("ONB-002", guidedStarted);
  assert.equal(r.allowed, false);
  assert.equal(r.redirectTo, "IDN-001");
});

test("ONB-003 unauthorized before origin complete or review-later", () => {
  const r = canAccessOnboardingRoute("ONB-003", minPersonalization);
  assert.equal(r.allowed, false);
  assert.equal(resolveResumeScreen(minPersonalization), "ONB-002");
});

test("ONB-002 allowed after minimum personalization", () => {
  assert.equal(
    canAccessOnboardingRoute("ONB-002", minPersonalization).allowed,
    true,
  );
});

test("ONB-003 allowed after origin complete", () => {
  assert.equal(
    canAccessOnboardingRoute("ONB-003", originComplete).allowed,
    true,
  );
});

test("IDN-002 requires crow basics", () => {
  assert.equal(
    canAccessOnboardingRoute("IDN-002", guidedStarted).allowed,
    false,
  );
  assert.equal(canAccessOnboardingRoute("IDN-002", crowBasics).allowed, true);
});

test("not-started resource stays on entry", () => {
  assert.equal(canAccessOnboardingRoute("ONB-001", notStarted).allowed, true);
  assert.equal(canAccessOnboardingRoute("IDN-001", notStarted).allowed, false);
});

test("route map covers all governed onboarding screens", () => {
  assert.equal(onboardingRouteFor("ONB-001"), "/onboarding/entry");
  assert.equal(onboardingRouteFor("IDN-001"), "/onboarding/crow");
  assert.equal(onboardingRouteFor("IDN-002"), "/onboarding/habitat");
  assert.equal(onboardingRouteFor("IDN-003"), "/onboarding/character");
  assert.equal(onboardingRouteFor("ONB-002"), "/onboarding/origin");
  assert.equal(onboardingRouteFor("ONB-003"), "/onboarding/nest-intro");
  assert.equal(Object.keys(ONBOARDING_ROUTES).length, 6);
});

test("ALLOWED_RETURN_TO includes onboarding paths via activation compose", () => {
  assert.equal(activationAllowed("/onboarding/origin"), true);
  assert.equal(activationAllowed("/onboarding/nest-intro"), true);
  assert.equal(activationAllowed("/onboarding/crow"), true);
  assert.equal(activationAllowed("https://evil.example"), false);
});
