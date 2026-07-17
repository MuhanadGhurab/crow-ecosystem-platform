#!/usr/bin/env tsx
/**
 * C3.9C — validate operator hosted DB identity (no credentials printed).
 */
import { readFileSync } from "node:fs";

import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";

const EXPECTED_REF = "wbwnsndcxrgyqwppurms";
const EXPECTED_FINGERPRINT = "0355c17692e2a90d";

function parseEnv(path: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i <= 0) continue;
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    map.set(t.slice(0, i), v);
  }
  return map;
}

function mergeEnv(...paths: string[]): Map<string, string> {
  const merged = new Map<string, string>();
  for (const path of paths) {
    for (const [k, v] of parseEnv(path)) {
      if (v) merged.set(k, v);
    }
  }
  return merged;
}

function main() {
  const env = mergeEnv(".env.preview.operator", ".env.staging");
  const direct = env.get("DIRECT_URL")?.trim();
  const pool = env.get("DATABASE_URL")?.trim();

  console.log("\n=== Operator hosted environment validation ===\n");
  console.log(`  APP_ENVIRONMENT: ${env.get("APP_ENVIRONMENT") ?? "(unset)"}`);
  console.log(`  DATABASE_ENVIRONMENT: ${env.get("DATABASE_ENVIRONMENT") ?? "(unset)"}`);
  console.log(`  BACKEND_ISOLATION: ${env.get("BACKEND_ISOLATION") ?? "(unset)"}`);
  console.log(`  EXPECTED_DATABASE_FINGERPRINT: ${env.get("EXPECTED_DATABASE_FINGERPRINT") ?? "(unset)"}`);

  let ok = true;
  const fail = (msg: string) => {
    console.error(`  ✗ ${msg}`);
    ok = false;
  };
  const pass = (msg: string) => console.log(`  ✓ ${msg}`);

  if (env.get("APP_ENVIRONMENT") !== "preview") fail("APP_ENVIRONMENT must be preview");
  else pass("APP_ENVIRONMENT=preview");

  if (env.get("DATABASE_ENVIRONMENT") !== "production") fail("DATABASE_ENVIRONMENT must be production");
  else pass("DATABASE_ENVIRONMENT=production");

  if (env.get("BACKEND_ISOLATION") !== "shared") fail("BACKEND_ISOLATION must be shared");
  else pass("BACKEND_ISOLATION=shared");

  if (!direct) fail("DIRECT_URL missing");
  else {
    const fp = fingerprintDatabaseUrl(direct);
    console.log(`  direct: ${maskDatabaseTarget(direct)}`);
    if (/127\.0\.0\.1|localhost/i.test(direct)) fail("DIRECT_URL resolves to localhost");
    else pass("direct target is not localhost");
    if (fp.supabaseProjectRef !== EXPECTED_REF) {
      fail(`direct project ref mismatch (expected ${EXPECTED_REF})`);
    } else pass(`direct project ref ${EXPECTED_REF}`);
    if (fp.targetHash !== EXPECTED_FINGERPRINT) {
      fail(`direct fingerprint mismatch (expected ${EXPECTED_FINGERPRINT})`);
    } else pass(`direct fingerprint ${EXPECTED_FINGERPRINT}`);
  }

  if (!pool) fail("DATABASE_URL missing");
  else {
    const fp2 = fingerprintDatabaseUrl(pool);
    console.log(`  pool: ${maskDatabaseTarget(pool)}`);
    if (/127\.0\.0\.1|localhost/i.test(pool)) fail("DATABASE_URL resolves to localhost");
    else pass("pool target is not localhost");
    if (fp2.supabaseProjectRef && fp2.supabaseProjectRef !== EXPECTED_REF) {
      fail(`pool project ref mismatch (expected ${EXPECTED_REF})`);
    } else if (fp2.supabaseProjectRef) {
      pass(`pool project ref ${EXPECTED_REF}`);
    }
  }

  if (direct && pool) {
    const dRef = fingerprintDatabaseUrl(direct).supabaseProjectRef;
    const pRef = fingerprintDatabaseUrl(pool).supabaseProjectRef;
    if (dRef && pRef && dRef !== pRef) fail("direct and pooler reference different projects");
    else pass("direct/pooler project alignment");
  }

  for (const [flag, expected] of [
    ["ACCOUNT_REGISTRATION_ENABLED", "false"],
    ["C3_REGISTRATION_DIAGNOSTICS", "false"],
    ["C3_SESSION_DIAGNOSTICS", "false"],
    ["C3_AUTH_CANARY_ENABLED", "false"],
    ["CROW_ONBOARDING_GENERATION_REQUIRED", "1"],
  ] as const) {
    const actual = env.get(flag) ?? "(unset)";
    if (actual !== expected) fail(`${flag}=${actual} (expected ${expected})`);
    else pass(`${flag}=${expected}`);
  }

  console.log(ok ? "\nOPERATOR_ENV=OK\n" : "\nOPERATOR_ENV=FAILED\n");
  process.exit(ok ? 0 : 1);
}

main();
