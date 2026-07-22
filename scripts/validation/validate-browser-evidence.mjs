#!/usr/bin/env node
/**
 * Validates that mandatory Closure-01 browser scenarios are declared in the evidence matrix
 * and present as Playwright test titles.
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

const required = [
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
  "session expiry clears private route access",
  "authorized and major states",
];

const missing = [];
for (const title of required) {
  if (!spec.includes(title)) missing.push(`spec:${title}`);
  if (!matrix.includes(title)) missing.push(`matrix:${title}`);
}

if (missing.length) {
  console.error("validate:browser-evidence FAILED");
  for (const m of missing) console.error(" -", m);
  process.exit(1);
}

console.log(
  `validate:browser-evidence OK — ${required.length} mandatory scenarios present`,
);
