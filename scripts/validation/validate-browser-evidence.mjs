#!/usr/bin/env node
/**
 * Validates mandatory Closure-02 browser scenarios and accessibility-state labels.
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
  "governance/implementation/IMPLEMENTATION-0C-BROWSER-EVIDENCE-MATRIX.md",
);
const specPath = join(root, "apps/web/e2e/activation-flow.spec.ts");

const matrix = readFileSync(matrixPath, "utf8");
const spec = readFileSync(specPath, "utf8");

/** Independently required Playwright scenario titles (21). */
const REQUIRED_SCENARIO_TITLES = [
  "complete flow uses keyboard for all user actions",
  "ACT-005 before email verification",
  "ACT-013 before terms acceptance",
  "ACT-006 before activation",
  "ACT-007 before activation",
  "ONB-001 before activation",
  "ACT-012 without recoverable condition",
  "activated account may open ACT-006 ACT-007 ONB-001",
  "after verification requested",
  "after email verified",
  "after terms accepted",
  "after activation complete",
  "provider failure",
  "provider timeout",
  "expired challenge",
  "superseded challenge",
  "stale version requires explicit resubmission",
  "identical logical command replay",
  "same idempotency key with different payload",
  "session expiry clears private route access",
  "authorized and major states",
];

/** Independently required actual-state accessibility labels (15). */
const REQUIRED_ACCESSIBILITY_STATE_LABELS = [
  "ACT-003 pending",
  "ACT-011 invalid",
  "ACT-011 expired",
  "ACT-011 verified",
  "ACT-005 ready",
  "ACT-005 validation error",
  "ACT-013 ready",
  "ACT-013 locked representation",
  "ACT-012 recovery available",
  "ACT-006 complete",
  "ACT-007 optional",
  "ONB-001 handoff",
  "session-expired safe state",
  "provider-failure error state",
  "stale-conflict error state",
];

const failures = [];

if (REQUIRED_SCENARIO_TITLES.length !== 21) {
  failures.push(
    `independent scenario list length ${REQUIRED_SCENARIO_TITLES.length} !== 21`,
  );
}
if (REQUIRED_ACCESSIBILITY_STATE_LABELS.length !== 15) {
  failures.push(
    `independent accessibility-state list length ${REQUIRED_ACCESSIBILITY_STATE_LABELS.length} !== 15`,
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
if (!scenarioCountMatch || Number(scenarioCountMatch[1]) !== 21) {
  failures.push("Mandatory count not equal to 21 in evidence matrix roll-up");
}
if (!a11yCountMatch || Number(a11yCountMatch[1]) !== 15) {
  failures.push(
    "Accessibility-state count not equal to 15 in evidence matrix roll-up",
  );
}

if (failures.length) {
  console.error("validate:browser-evidence FAILED");
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log(
  `validate:browser-evidence OK — ${REQUIRED_SCENARIO_TITLES.length} mandatory scenarios, ${REQUIRED_ACCESSIBILITY_STATE_LABELS.length} accessibility states`,
);
