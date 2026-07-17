import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CROW_STORY_DEFINITION } from "./definition";
import {
  buildLoginHandoffUrl,
  buildRequestDestinationWithJourney,
  buildSignupHandoffUrl,
  clearCrowStoryState,
  CROW_STORY_STORAGE_KEY,
  journeyKindToUrl,
  parseJourneyUrlParam,
  resolveJourneyState,
} from "./journey-state";
import { projectCrowStoryState } from "./projection";
import { resolveStoryDeviceMode } from "./breakpoints";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

console.log("crow-story:test");

test("seven unique chapters", () => {
  assert.equal(CROW_STORY_DEFINITION.chapters.length, 7);
  const keys = new Set(CROW_STORY_DEFINITION.chapters.map((c) => c.key));
  assert.equal(keys.size, 7);
});

test("people chapter includes Work Persona explanation", () => {
  const people = CROW_STORY_DEFINITION.chapters.find((c) => c.key === "people");
  assert.ok(people?.supporting.includes("Work Persona"));
  assert.ok(people?.supporting.includes("authorized role"));
});

test("projection is deterministic", () => {
  const a = projectCrowStoryState({
    chapterKey: "idea",
    chapterProgress: 0.6,
    journey: null,
    deviceMode: "DESKTOP_STICKY",
    motionMode: "FULL",
  });
  const b = projectCrowStoryState({
    chapterKey: "idea",
    chapterProgress: 0.6,
    journey: null,
    deviceMode: "DESKTOP_STICKY",
    motionMode: "FULL",
  });
  assert.deepEqual(a, b);
});

test("choice chapter responds to journey", () => {
  const neu = projectCrowStoryState({
    chapterKey: "choice",
    chapterProgress: 0.5,
    journey: "NEW",
    deviceMode: "DESKTOP_STICKY",
    motionMode: "FULL",
  });
  const tr = projectCrowStoryState({
    chapterKey: "choice",
    chapterProgress: 0.5,
    journey: "TRANSFORM",
    deviceMode: "DESKTOP_STICKY",
    motionMode: "FULL",
  });
  assert.ok(neu.newPathEmphasis > tr.newPathEmphasis);
  assert.ok(tr.transformPathEmphasis > neu.transformPathEmphasis);
});

test("parse journey URL values", () => {
  assert.equal(parseJourneyUrlParam("new"), "NEW");
  assert.equal(parseJourneyUrlParam("transform"), "TRANSFORM");
  assert.equal(parseJourneyUrlParam("invalid"), null);
});

test("signup handoff preserves journey in next", () => {
  const url = buildSignupHandoffUrl("NEW");
  assert.ok(url.includes("journey=new"));
  assert.ok(url.includes(encodeURIComponent("/client/requests/new?journey=new")));
});

test("login handoff preserves journey", () => {
  const url = buildLoginHandoffUrl("TRANSFORM");
  assert.ok(url.includes("journey=transform"));
});

test("request destination includes journey", () => {
  assert.equal(buildRequestDestinationWithJourney("NEW"), "/client/requests/new?journey=new");
});

test("compact mode not assigned to all sub-900 widths", () => {
  const portrait = resolveStoryDeviceMode({ width: 820, height: 1100, prefersReducedMotion: false });
  assert.equal(portrait, "IPAD_PORTRAIT");
  const landscape = resolveStoryDeviceMode({ width: 1100, height: 800, prefersReducedMotion: false });
  assert.equal(landscape, "IPAD_LANDSCAPE_STICKY");
});

test("article page imports definition not interactive bundle", () => {
  const articlePage = readFileSync(
    join(process.cwd(), "src/app/experience/architects-map/article/page.tsx"),
    "utf8",
  );
  assert.ok(!articlePage.includes("crow-story-interactive"));
  assert.ok(articlePage.includes("crow-story-article"));
});

test("homepage does not import interactive story bundle", () => {
  const home = readFileSync(join(process.cwd(), "src/app/(public)/page.tsx"), "utf8");
  assert.ok(!home.includes("crow-story-interactive"));
  assert.ok(home.includes("homepage-architects-map-preview"));
});

test("story storage key uses scoped prefix", () => {
  assert.ok(CROW_STORY_STORAGE_KEY.startsWith("crow-client-scoped-v1:"));
});

test("sign-out clears story state hook", () => {
  const signOut = readFileSync(join(process.cwd(), "src/components/auth/sign-out-button.tsx"), "utf8");
  assert.ok(signOut.includes("clearCrowStoryState"));
});

test("request wizard clears story on submit", () => {
  const wizard = readFileSync(
    join(process.cwd(), "src/components/client-service-request/service-request-wizard.tsx"),
    "utf8",
  );
  assert.ok(wizard.includes("clearCrowStoryState"));
});

console.log("crow-story:test PASS");
