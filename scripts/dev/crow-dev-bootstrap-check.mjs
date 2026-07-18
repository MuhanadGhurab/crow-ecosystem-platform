#!/usr/bin/env node
/**
 * CROW.DEVFLOW.PORTABLE.1 — first-time / laptop bootstrap check.
 *
 * Stricter than doctor: expects feature branch for FTGP alpha work.
 * Still does not print secrets, connect to DB, migrate, or write hosted data.
 *
 * Usage: node scripts/dev/crow-dev-bootstrap-check.mjs
 *        npm run crow-dev:bootstrap-check
 *
 * Flags:
 *   --allow-any-branch   do not require feat/first-tenant-golden-path
 *   --require-env-local  fail if .env.local is missing
 */

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  collectPortableDevStatus,
  printStatusReport,
  DEFAULT_FEATURE_BRANCH,
} from "./crow-dev-portable-lib.mjs";

const args = new Set(process.argv.slice(2));
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const result = collectPortableDevStatus(repoRoot, {
  requireFeatureBranch: !args.has("--allow-any-branch"),
  requireEnvLocal: args.has("--require-env-local"),
});

printStatusReport("crow-dev:bootstrap-check — Laptop / multi-device bootstrap", result);
console.log(`Expected feature branch: ${DEFAULT_FEATURE_BRANCH}`);
console.log("Next: see docs/crow/development/LAPTOP-SETUP-CHECKLIST.md");
console.log("DEV_BOOTSTRAP_CHECK_ADDED_COUNT=1");
process.exit(result.ok ? 0 : 1);
