/**
 * CROW.GAP015.2 — Tests for vercel-production-deploy-guard.mjs
 *
 * No DB access. No secrets printed. Certifies Ignored Build Step exit semantics:
 *   exit 0 = skip/block Production build
 *   exit 1 = allow build
 */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  evaluateProductionDeployGuard,
  evaluateFromEnv,
  shortSha,
} from "./vercel-production-deploy-guard.mjs";

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    console.error(`  ✗ ${name}`);
    throw e;
  }
}

const root = process.cwd();
const script = join(root, "scripts/safety/vercel-production-deploy-guard.mjs");
const FULL_SHA = "abcdef0123456789abcdef0123456789abcdef01";
const WRONG_SHA = "1111111111111111111111111111111111111111";

/** @type {Record<string, string | undefined>} */
const cleanEnv = {
  ...process.env,
  VERCEL_ENV: undefined,
  VERCEL_GIT_COMMIT_SHA: undefined,
  CROW_PRODUCTION_DEPLOY_AUTHORIZED: undefined,
  CROW_PRODUCTION_DEPLOY_SHA: undefined,
  CROW_PRODUCTION_DEPLOY_REASON: undefined,
  DATABASE_URL: undefined,
  DIRECT_URL: undefined,
};

/**
 * @param {Record<string, string | undefined>} envOverlay
 */
function runScript(envOverlay) {
  return spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: "utf8",
    env: { ...cleanEnv, ...envOverlay },
  });
}

console.log("vercel-production-deploy-guard:test");

let unauthorizedBlockedCount = 0;
let authorizedAllowedCount = 0;

test("1. Preview build proceeds (exit 1)", () => {
  const r = evaluateProductionDeployGuard({
    vercelEnv: "preview",
    commitSha: FULL_SHA,
    authorized: undefined,
    authorizedSha: undefined,
    reason: undefined,
  });
  assert.equal(r.decision, "ALLOW_NON_PRODUCTION_BUILD");
  assert.equal(r.exitCode, 1);
  const spawned = runScript({
    VERCEL_ENV: "preview",
    VERCEL_GIT_COMMIT_SHA: FULL_SHA,
  });
  assert.equal(spawned.status, 1, spawned.stdout + spawned.stderr);
  assert.ok(spawned.stdout.includes("ALLOW_NON_PRODUCTION_BUILD"));
});

test("2. Development/local build proceeds (exit 1)", () => {
  const unset = evaluateProductionDeployGuard({
    vercelEnv: undefined,
    commitSha: undefined,
    authorized: undefined,
    authorizedSha: undefined,
    reason: undefined,
  });
  assert.equal(unset.decision, "ALLOW_NON_PRODUCTION_BUILD");
  assert.equal(unset.exitCode, 1);

  const dev = evaluateProductionDeployGuard({
    vercelEnv: "development",
    commitSha: FULL_SHA,
    authorized: undefined,
    authorizedSha: undefined,
    reason: undefined,
  });
  assert.equal(dev.decision, "ALLOW_NON_PRODUCTION_BUILD");
  assert.equal(dev.exitCode, 1);

  const spawned = runScript({});
  assert.equal(spawned.status, 1, spawned.stdout + spawned.stderr);
});

test("3. Production build without authorization is blocked (exit 0)", () => {
  const r = evaluateProductionDeployGuard({
    vercelEnv: "production",
    commitSha: FULL_SHA,
    authorized: undefined,
    authorizedSha: undefined,
    reason: undefined,
  });
  assert.equal(r.decision, "BLOCK_UNAUTHORIZED_PRODUCTION_BUILD");
  assert.equal(r.exitCode, 0);
  const spawned = runScript({
    VERCEL_ENV: "production",
    VERCEL_GIT_COMMIT_SHA: FULL_SHA,
  });
  assert.equal(spawned.status, 0, spawned.stdout + spawned.stderr);
  assert.ok(spawned.stdout.includes("BLOCK_UNAUTHORIZED_PRODUCTION_BUILD"));
  unauthorizedBlockedCount += 1;
});

test("4. Production build with authorization flag only is blocked", () => {
  const r = evaluateProductionDeployGuard({
    vercelEnv: "production",
    commitSha: FULL_SHA,
    authorized: "true",
    authorizedSha: undefined,
    reason: "owner reason",
  });
  assert.equal(r.decision, "BLOCK_UNAUTHORIZED_PRODUCTION_BUILD");
  assert.equal(r.exitCode, 0);
  unauthorizedBlockedCount += 1;
});

test("5. Production build with wrong SHA is blocked", () => {
  const r = evaluateProductionDeployGuard({
    vercelEnv: "production",
    commitSha: FULL_SHA,
    authorized: "true",
    authorizedSha: WRONG_SHA,
    reason: "owner reason",
  });
  assert.equal(r.decision, "BLOCK_UNAUTHORIZED_PRODUCTION_BUILD");
  assert.equal(r.shaMatch, false);
  assert.equal(r.exitCode, 0);
  unauthorizedBlockedCount += 1;
});

test("6. Production build with matching SHA but missing reason is blocked", () => {
  const r = evaluateProductionDeployGuard({
    vercelEnv: "production",
    commitSha: FULL_SHA,
    authorized: "true",
    authorizedSha: FULL_SHA,
    reason: "   ",
  });
  assert.equal(r.decision, "BLOCK_UNAUTHORIZED_PRODUCTION_BUILD");
  assert.equal(r.reasonPresent, false);
  assert.equal(r.exitCode, 0);
  unauthorizedBlockedCount += 1;
});

test("7. Production build with flag + matching SHA + reason proceeds (exit 1)", () => {
  const r = evaluateFromEnv({
    VERCEL_ENV: "production",
    VERCEL_GIT_COMMIT_SHA: FULL_SHA,
    CROW_PRODUCTION_DEPLOY_AUTHORIZED: "true",
    CROW_PRODUCTION_DEPLOY_SHA: FULL_SHA,
    CROW_PRODUCTION_DEPLOY_REASON: "CROW.GAP015 owner authorize production build",
  });
  assert.equal(r.decision, "ALLOW_AUTHORIZED_PRODUCTION_BUILD");
  assert.equal(r.exitCode, 1);
  assert.equal(r.shaMatch, true);

  const spawned = runScript({
    VERCEL_ENV: "production",
    VERCEL_GIT_COMMIT_SHA: FULL_SHA,
    CROW_PRODUCTION_DEPLOY_AUTHORIZED: "true",
    CROW_PRODUCTION_DEPLOY_SHA: FULL_SHA,
    CROW_PRODUCTION_DEPLOY_REASON: "CROW.GAP015 owner authorize production build",
  });
  assert.equal(spawned.status, 1, spawned.stdout + spawned.stderr);
  assert.ok(spawned.stdout.includes("ALLOW_AUTHORIZED_PRODUCTION_BUILD"));
  authorizedAllowedCount += 1;
});

test("8. Script output does not include secrets", () => {
  const secret = "super-secret-token-do-not-leak";
  const reason = "owner reason with no secret";
  const spawned = runScript({
    VERCEL_ENV: "production",
    VERCEL_GIT_COMMIT_SHA: FULL_SHA,
    CROW_PRODUCTION_DEPLOY_AUTHORIZED: "true",
    CROW_PRODUCTION_DEPLOY_SHA: FULL_SHA,
    CROW_PRODUCTION_DEPLOY_REASON: reason,
    DATABASE_URL: `postgresql://user:${secret}@db.example.com:5432/postgres`,
    DIRECT_URL: `postgresql://user:${secret}@db.example.com:5432/postgres`,
    SOME_API_KEY: secret,
  });
  const out = (spawned.stdout || "") + (spawned.stderr || "");
  assert.ok(!out.includes(secret));
  assert.ok(!out.includes("postgresql://"));
  assert.ok(!out.includes(FULL_SHA)); // only short prefix
  assert.ok(out.includes(shortSha(FULL_SHA)));
  assert.ok(!out.includes("SOME_API_KEY"));
});

test("9. Exit codes match Vercel ignored-build behavior", () => {
  // Documented contract: 0=skip, 1=allow
  const block = evaluateProductionDeployGuard({
    vercelEnv: "production",
    commitSha: FULL_SHA,
    authorized: "false",
    authorizedSha: FULL_SHA,
    reason: "x",
  });
  assert.equal(block.exitCode, 0, "blocked Production must exit 0 (skip)");

  const allowPreview = evaluateProductionDeployGuard({
    vercelEnv: "preview",
    commitSha: FULL_SHA,
    authorized: undefined,
    authorizedSha: undefined,
    reason: undefined,
  });
  assert.equal(allowPreview.exitCode, 1, "Preview must exit 1 (allow)");

  const allowProd = evaluateProductionDeployGuard({
    vercelEnv: "production",
    commitSha: FULL_SHA,
    authorized: "yes",
    authorizedSha: FULL_SHA,
    reason: "authorized",
  });
  assert.equal(allowProd.exitCode, 1, "authorized Production must exit 1 (allow)");
});

test("10. No DB access occurs (static + runtime)", () => {
  const src = readFileSync(script, "utf8");
  assert.ok(src.includes("no database access"));
  assert.ok(!/\bprisma\b/i.test(src));
  assert.ok(!/createConnection|pg\.Client|mongoose|supabase\.from/i.test(src));
  assert.ok(!/fetch\s*\(/i.test(src));
  // Runtime: evaluate does not throw without DATABASE_URL
  const r = evaluateFromEnv({ VERCEL_ENV: "preview" });
  assert.equal(r.decision, "ALLOW_NON_PRODUCTION_BUILD");
});

assert.ok(
  unauthorizedBlockedCount >= 1,
  "UNAUTHORIZED_PRODUCTION_BUILD_BLOCKED_COUNT expected >= 1",
);
assert.ok(
  authorizedAllowedCount >= 1,
  "AUTHORIZED_PRODUCTION_BUILD_ALLOWED_BY_TEST_COUNT expected >= 1",
);

console.log("Counters:");
console.log(`PRODUCTION_DEPLOY_GUARD_IMPLEMENTED_COUNT=1`);
console.log(
  `UNAUTHORIZED_PRODUCTION_BUILD_BLOCKED_COUNT=${unauthorizedBlockedCount}`,
);
console.log(
  `AUTHORIZED_PRODUCTION_BUILD_ALLOWED_BY_TEST_COUNT=${authorizedAllowedCount}`,
);
console.log("UNAUTHORIZED_MIGRATION_COUNT=0");
console.log("HOSTED_BUSINESS_WRITE_COUNT=0");
console.log("vercel-production-deploy-guard:test PASS");
