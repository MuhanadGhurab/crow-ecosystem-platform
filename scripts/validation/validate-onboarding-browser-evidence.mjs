#!/usr/bin/env node
/**
 * Validates mandatory IMPLEMENTATION-0D onboarding browser scenarios and
 * accessibility-state labels.
 *
 * The required lists below are independently defined — they must NOT be derived
 * from the evidence matrix under validation.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const matrixPath = join(
  root,
  "governance/implementation/IMPLEMENTATION-0D-BROWSER-EVIDENCE-MATRIX.md",
);
const specPath = join(root, "apps/web/e2e/onboarding-flow.spec.ts");

const matrix = readFileSync(matrixPath, "utf8");
const spec = readFileSync(specPath, "utf8");

/** Independently required Playwright scenario titles (18). */
const REQUIRED_SCENARIO_TITLES = [
  "guided keyboard personalization to nest handoff",
  "quick-start keyboard path to origin and nest",
  "refresh resume returns to authorized screen",
  "stale personalization write requires resubmission",
  "stale origin write requires resubmission",
  "identical onboarding command idempotent replay",
  "same idempotency key with different onboarding payload",
  "cross-user isolation via session-bound aggregate",
  "catalogue-version conflict on personalization",
  "origin-schema conflict on invalid goal",
  "ONB-002 guard before minimum personalization",
  "ONB-003 guard before origin complete or review-later",
  "review-later path reaches nest handoff",
  "locked cosmetic explanation is preview only",
  "contrast adjustment acknowledgment required",
  "privacy preview acknowledgment on review",
  "Arabic and English locale parity on entry",
  "actual-state accessibility states",
];

/** Independently required actual-state accessibility labels (12). */
const REQUIRED_ACCESSIBILITY_STATE_LABELS = [
  "ONB-001 entry handoff",
  "ONB-001 guided begun",
  "IDN-001 crow personalize",
  "IDN-001 locked accessory",
  "IDN-002 habitat",
  "IDN-003 character",
  "IDN-001 personalization review",
  "ONB-002 origin ready",
  "ONB-002 origin review-later",
  "ONB-003 nest handoff",
  "onboarding stale-conflict error state",
  "onboarding catalogue-conflict error state",
];

const failures = [];

if (REQUIRED_SCENARIO_TITLES.length !== 18) {
  failures.push(
    `independent scenario list length ${REQUIRED_SCENARIO_TITLES.length} !== 18`,
  );
}
if (REQUIRED_ACCESSIBILITY_STATE_LABELS.length !== 12) {
  failures.push(
    `independent accessibility-state list length ${REQUIRED_ACCESSIBILITY_STATE_LABELS.length} !== 12`,
  );
}

for (const title of REQUIRED_SCENARIO_TITLES) {
  if (!spec.includes(title))
    failures.push(`Missing browser scenario: ${title}`);
  if (!matrix.includes(title))
    failures.push(`Missing evidence-matrix row: ${title}`);
}

for (const label of REQUIRED_ACCESSIBILITY_STATE_LABELS) {
  if (!spec.includes(label))
    failures.push(`Missing accessibility state label in spec: ${label}`);
  if (!matrix.includes(label))
    failures.push(`Missing accessibility state label in matrix: ${label}`);
}

const scenarioCountMatch = matrix.match(
  /Mandatory scenarios defined:\s*(\d+)/i,
);
const a11yCountMatch = matrix.match(/Required accessibility states:\s*(\d+)/i);
if (!scenarioCountMatch || Number(scenarioCountMatch[1]) !== 18) {
  failures.push("Mandatory count not equal to 18 in evidence matrix roll-up");
}
if (!a11yCountMatch || Number(a11yCountMatch[1]) !== 12) {
  failures.push(
    "Accessibility-state count not equal to 12 in evidence matrix roll-up",
  );
}

if (failures.length) {
  console.error("validate:onboarding-browser-evidence FAILED");
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log(
  `validate:onboarding-browser-evidence OK — ${REQUIRED_SCENARIO_TITLES.length} mandatory scenarios, ${REQUIRED_ACCESSIBILITY_STATE_LABELS.length} accessibility states`,
);
