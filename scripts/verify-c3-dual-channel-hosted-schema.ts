/**
 * C3.9A — Dual-channel hosted schema preflight (static + optional disposable live proof).
 * Does not connect to hosted Supabase unless DATABASE_URL is disposable local (5433).
 *
 * Run: npm run c3-dual-channel:hosted-schema-verify
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import {
  assertDisposableLocalDatabase,
  classifyDisposableLocalDatabase,
} from "./lib/local-database-safety";
import { fingerprintDatabaseUrl } from "./lib/database-fingerprint";

const ROOT = process.cwd();
const DUAL_CHANNEL_MIGRATION = join(
  ROOT,
  "prisma/migrations/20260618140000_c3_dual_channel_onboarding/migration.sql"
);

const NEW_TABLES = ["phone_verification_challenges", "platform_provider_identities"] as const;

const PLATFORM_ACCOUNT_COLUMNS = [
  "onboardingGeneration",
  "emailVerifiedAt",
  "emailVerificationSource",
  "phoneNormalized",
  "phoneMasked",
  "phoneVerifiedAt",
  "phoneVerificationSource",
] as const;

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
}

function staticMigrationAudit(): boolean {
  console.log("\n=== Static migration audit (20260618140000) ===\n");
  let passed = true;
  const check = (cond: boolean, pass: string, failMsg: string) => {
    if (cond) ok(pass);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  const sql = readFileSync(DUAL_CHANNEL_MIGRATION, "utf8");

  check(!/DROP TABLE/i.test(sql), "no DROP TABLE", "destructive DROP TABLE present");
  check(!/DROP COLUMN/i.test(sql), "no DROP COLUMN", "destructive DROP COLUMN present");
  check(!/RENAME TO/i.test(sql), "no RENAME TO", "destructive RENAME present");

  for (const table of NEW_TABLES) {
    check(sql.includes(`CREATE TABLE "${table}"`), `creates ${table}`, `missing CREATE TABLE ${table}`);
    check(
      sql.includes(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`),
      `RLS enabled on ${table}`,
      `RLS missing on ${table}`
    );
    check(
      sql.includes(`REVOKE ALL ON TABLE "${table}" FROM anon, authenticated`),
      `revokes anon/authenticated on ${table}`,
      `grant revoke missing on ${table}`
    );
  }

  for (const col of PLATFORM_ACCOUNT_COLUMNS) {
    check(sql.includes(`"${col}"`), `platform_accounts.${col}`, `missing column ${col}`);
  }

  check(
    sql.includes('UPDATE "platform_accounts" SET "onboardingGeneration" = 1'),
    "legacy ACTIVE backfill to generation 1",
    "missing generation-1 backfill for legacy ACTIVE"
  );

  check(
    sql.includes('"onboardingGeneration" INTEGER NOT NULL DEFAULT 2'),
    "new accounts default generation 2",
    "missing generation default 2"
  );

  return passed;
}

async function liveDisposableAudit(): Promise<boolean> {
  const live = process.argv.includes("--live-disposable");
  if (!live) {
    console.log("\n(Skipping live DB audit — pass --live-disposable with disposable DATABASE_URL)\n");
    return true;
  }

  assertDisposableLocalDatabase(process.env.DATABASE_URL);
  const proof = classifyDisposableLocalDatabase(process.env.DATABASE_URL);
  console.log(`\n=== Live disposable schema audit (${proof.maskedTarget}) ===\n`);

  const prisma = new PrismaClient();
  let passed = true;
  const check = (cond: boolean, label: string) => {
    if (cond) ok(label);
    else {
      fail(label);
      passed = false;
    }
  };

  try {
    for (const table of NEW_TABLES) {
      const rows = await prisma.$queryRaw<{ relrowsecurity: boolean }[]>`
        SELECT c.relrowsecurity
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = ${table}
      `;
      check(rows[0]?.relrowsecurity === true, `${table} RLS enabled (live)`);

      const grants = await prisma.$queryRaw<{ grantee: string; privilege_type: string }[]>`
        SELECT grantee::text, privilege_type
        FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = ${table}
          AND grantee IN ('anon', 'authenticated')
      `;
      check(grants.length === 0, `${table} no anon/authenticated grants (live)`);
    }

    const policies = await prisma.$queryRaw<{ tablename: string; policyname: string }[]>`
      SELECT tablename, policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = ANY(${NEW_TABLES as unknown as string[]})
    `;
    check(policies.length === 0, "no permissive RLS policies on new C3.8 tables (live)");
  } finally {
    await prisma.$disconnect();
  }

  return passed;
}

async function liveHostedAudit(): Promise<boolean> {
  const liveHosted = process.argv.includes("--live-hosted");
  if (!liveHosted) {
    console.log("\n(Skipping live hosted DB audit — pass --live-hosted with operator DATABASE_URL)\n");
    return true;
  }

  const expected = process.env.EXPECTED_DATABASE_FINGERPRINT?.trim() ?? "0355c17692e2a90d";
  const direct = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!direct) {
    fail("DIRECT_URL required for --live-hosted");
    return false;
  }

  const fp = fingerprintDatabaseUrl(direct);
  if (fp.targetHash !== expected || /127\.0\.0\.1|localhost/i.test(direct)) {
    fail("live-hosted audit refused: not the verified shared Supabase target");
    return false;
  }

  console.log(`\n=== Live hosted schema audit (${fp.supabaseProjectRef ?? "hosted"}) ===\n`);

  const prisma = new PrismaClient();
  let passed = true;
  const check = (cond: boolean, label: string) => {
    if (cond) ok(label);
    else {
      fail(label);
      passed = false;
    }
  };

  try {
    for (const table of NEW_TABLES) {
      const exists = await prisma.$queryRaw<{ reg: string | null }[]>`
        SELECT to_regclass(${`public.${table}`})::text AS reg
      `;
      check(Boolean(exists[0]?.reg), `${table} exists (live)`);

      const rows = await prisma.$queryRaw<{ relrowsecurity: boolean }[]>`
        SELECT c.relrowsecurity
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = ${table}
      `;
      check(rows[0]?.relrowsecurity === true, `${table} RLS enabled (live)`);

      const grants = await prisma.$queryRaw<{ grantee: string }[]>`
        SELECT grantee::text
        FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = ${table}
          AND grantee IN ('anon', 'authenticated')
      `;
      check(grants.length === 0, `${table} no anon/authenticated grants (live)`);
    }

    const policies = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_policies
      WHERE schemaname = 'public' AND tablename = ANY(${NEW_TABLES as unknown as string[]})
    `;
    check(policies.length === 0, "no RLS policies on new C3.8 tables (live)");

    for (const col of PLATFORM_ACCOUNT_COLUMNS) {
      const cols = await prisma.$queryRaw<{ column_name: string }[]>`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'platform_accounts' AND column_name = ${col}
      `;
      check(cols.length === 1, `platform_accounts.${col} (live)`);
    }

    const fks = await prisma.$queryRaw<{ conname: string }[]>`
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace n ON n.oid = rel.relnamespace
      WHERE n.nspname = 'public'
        AND rel.relname = ANY(${NEW_TABLES as unknown as string[]})
        AND con.contype = 'f'
    `;
    check(fks.length >= 2, "foreign keys on new tables (live)");

    const indexes = await prisma.$queryRaw<{ indexname: string }[]>`
      SELECT indexname FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = ANY(${NEW_TABLES as unknown as string[]})
    `;
    check(indexes.length >= 4, "indexes on new tables (live)");
  } finally {
    await prisma.$disconnect();
  }

  return passed;
}

async function main() {
  const staticOk = staticMigrationAudit();
  const liveOk = process.argv.includes("--live-hosted")
    ? await liveHostedAudit()
    : await liveDisposableAudit();
  const passed = staticOk && liveOk;
  console.log(passed ? "\nc3-dual-channel:hosted-schema-verify PASSED\n" : "\nFAILED\n");
  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
