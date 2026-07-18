#!/usr/bin/env node
/**
 * CROW.DEVFLOW.PORTABLE.1 — local Alpha Development doctor.
 *
 * Does not print secrets, connect to hosted DB, run migrations, or write data.
 *
 * Usage: node scripts/dev/crow-dev-doctor.mjs
 *        npm run crow-dev:doctor
 */

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  collectPortableDevStatus,
  printStatusReport,
} from "./crow-dev-portable-lib.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const result = collectPortableDevStatus(repoRoot, {
  requireFeatureBranch: false,
  requireEnvLocal: false,
});

printStatusReport("crow-dev:doctor — Portable Alpha Development", result);
console.log("DEV_DOCTOR_SCRIPT_ADDED_COUNT=1");
process.exit(result.ok ? 0 : 1);
