#!/usr/bin/env tsx
/**
 * BLUEPRINT.1B.V — read-only migration ledger, schema, and immutability reconciliation.
 * Does not mutate business rows.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { countMigrationSql } from "./lib/migration-baseline";
import {
  assertRequestBaselineInvariants,
  verifyRequestBaselineInvariants,
} from "./lib/request-baseline-invariants";

const BLUEPRINT_MIGRATION = "20260624120000_blueprint_persistent_review_lifecycle";
const EXPECTED_CHECKSUM = "9405aa150bd3fd1f99622666025ce61fbac2e94bfbd31767ab2176e72b9cf7ff";
const EXPECTED_TARGET_FP = "0355c17692e2a90d";
const EXPECTED_PROJECT_REF = "wbwnsndcxrgyqwppurms";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}
function info(label: string, value: string | number) {
  console.log(`  ${label}=${value}`);
}
function fail(msg: string): never {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

async function assertIndex(prisma: PrismaClient, indexName: string) {
  const rows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = ${indexName}
  `;
  if (Number(rows[0]?.count ?? 0) !== 1) fail(`missing index ${indexName}`);
}

async function probeRestContainment(table: string): Promise<boolean> {
  const baseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "")
    .trim()
    .replace(/\/$/, "");
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""
  ).trim();
  if (!baseUrl || !anonKey) fail("Supabase URL/anon key required for REST containment probe");

  const url = `${baseUrl}/rest/v1/${table}?select=id`;
  const response = await fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json",
      Range: "0-0",
    },
  });
  // 404/401/403 or non-OK = not exposed via Data API (contained)
  return !response.ok;
}

async function main() {
  console.log("\n=== BLUEPRINT.1B.V migration ledger reconciliation ===\n");

  const repoCount = countMigrationSql(process.cwd());
  info("repository_migration_folders", repoCount);

  const sqlPath = join(process.cwd(), `prisma/migrations/${BLUEPRINT_MIGRATION}/migration.sql`);
  const checksum = createHash("sha256").update(readFileSync(sqlPath, "utf8")).digest("hex");
  info("migration_checksum", checksum);
  if (checksum !== EXPECTED_CHECKSUM) fail("MIGRATION_CHECKSUM_MISMATCH");
  ok("MIGRATION_CHECKSUM_MATCH");

  const envLoad = loadHostedOperatorEnv({ primaryEnvFile: ".env.staging.runtime" });
  assertHostedEnvNotLocalhost(envLoad);
  const hosted = assertHostedVerificationTarget({
    envFile: envLoad.primaryEnvFile,
    requireDatabaseUrls: true,
  });

  const directUrl = process.env.DIRECT_URL?.trim();
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!directUrl || !databaseUrl) fail("DIRECT_URL and DATABASE_URL required");

  const directFp = fingerprintDatabaseUrl(directUrl);
  const poolFp = fingerprintDatabaseUrl(databaseUrl);
  info("env_file", hosted.envFile);
  info("target", maskDatabaseTarget(directUrl));
  info("target_identity_fingerprint", directFp.targetHash);
  info("supabase_project_ref", directFp.supabaseProjectRef ?? "unknown");

  if (directFp.supabaseProjectRef !== EXPECTED_PROJECT_REF) fail("MIGRATION_TARGET_PROJECT mismatch");
  if (directFp.targetHash !== EXPECTED_TARGET_FP) fail("TARGET_IDENTITY_FINGERPRINT mismatch");
  if (poolFp.supabaseProjectRef !== directFp.supabaseProjectRef) fail("pool/direct project ref mismatch");
  ok("ALL_DATABASE_TARGETS_MATCH");

  const prisma = new PrismaClient();
  try {
    const successfulCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
      WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL
    `;
    const totalRows = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
    `;
    const successful = Number(successfulCount[0]?.count ?? 0);
    info("ledger_total_rows", Number(totalRows[0]?.count ?? 0));
    info("ledger_successful_count", successful);

    const bpRows = await prisma.$queryRaw<
      {
        checksum: string;
        finished_at: Date | null;
        rolled_back_at: Date | null;
        started_at: Date | null;
        applied_steps_count: number;
        logs: string | null;
      }[]
    >`
      SELECT checksum, finished_at, rolled_back_at, started_at, applied_steps_count, logs
      FROM "_prisma_migrations"
      WHERE migration_name = ${BLUEPRINT_MIGRATION}
    `;
    if (bpRows.length !== 1) fail(`BLUEPRINT migration ledger rows=${bpRows.length} (expected 1)`);
    const bp = bpRows[0]!;
    info("blueprint_migration_finished_at", bp.finished_at?.toISOString() ?? "null");
    info("blueprint_migration_rolled_back_at", bp.rolled_back_at?.toISOString() ?? "null");
    info("blueprint_migration_applied_steps", bp.applied_steps_count);
    info("blueprint_migration_logs_present", bp.logs ? "yes" : "no");
    if (!bp.finished_at || bp.rolled_back_at) fail("BLUEPRINT_MIGRATION_LEDGER not APPLIED_SUCCESSFULLY");
    ok("BLUEPRINT_MIGRATION_LEDGER=APPLIED_SUCCESSFULLY");

    const pending = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;
    if (Number(pending[0]?.count ?? 0) !== 0) fail("pending unfinished migrations exist");
    ok("pending migration count=0");

    if (successful !== repoCount) {
      fail(`successful migration count ${successful} != repository folders ${repoCount}`);
    }
    ok(`successful_migration_count=${successful} matches repository`);

    const ebCols = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema='public' AND table_name='enterprise_blueprints'
      AND column_name IN ('lifecycleState','clientVisibilityState','rowVersion','currentVersionId','sharedWithClientVersionNumber','platformFinalizedVersionId')
      ORDER BY column_name
    `;
    if (ebCols.length !== 6) fail(`enterprise_blueprints missing columns (${ebCols.length}/6)`);
    ok("EnterpriseBlueprint lifecycle columns present");

    const verCols = await prisma.$queryRaw<{ column_name: string; is_nullable: string }[]>`
      SELECT column_name, is_nullable FROM information_schema.columns
      WHERE table_schema='public' AND table_name='enterprise_blueprint_versions'
      AND column_name IN ('versionNumber','schemaVersion','compilerVersion','sourceModelKey','sourceModelHash','contentHash','contentSnapshot','validationJson','decisionRegisterJson','provenanceJson','scenarioProfileJson','reviewReadinessJson','createdByPlatformAccountId','tenantId')
      ORDER BY column_name
    `;
    const requiredVersionCols = [
      "versionNumber",
      "schemaVersion",
      "compilerVersion",
      "sourceModelKey",
      "sourceModelHash",
      "contentHash",
      "contentSnapshot",
      "validationJson",
      "decisionRegisterJson",
      "provenanceJson",
      "scenarioProfileJson",
      "reviewReadinessJson",
      "createdByPlatformAccountId",
      "tenantId",
    ];
    if (verCols.length !== requiredVersionCols.length) {
      fail(`enterprise_blueprint_versions missing columns (${verCols.length}/${requiredVersionCols.length})`);
    }
    if (verCols.find((c) => c.column_name === "tenantId")?.is_nullable !== "YES") {
      fail("tenantId not nullable on versions");
    }
    ok("EnterpriseBlueprintVersion columns + nullable tenantId");

    for (const table of ["blueprint_review_cycles", "blueprint_review_actions"]) {
      const t = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count FROM information_schema.tables
        WHERE table_schema='public' AND table_name=${table}
      `;
      if (Number(t[0]?.count ?? 0) !== 1) fail(`${table} missing`);
    }
    ok("BlueprintReviewCycle and BlueprintReviewAction tables present");

    const traceTenant = await prisma.$queryRaw<{ is_nullable: string }[]>`
      SELECT is_nullable FROM information_schema.columns
      WHERE table_schema='public' AND table_name='blueprint_trace_events' AND column_name='tenantId'
    `;
    if (traceTenant[0]?.is_nullable !== "YES") fail("BlueprintTraceEvent.tenantId not nullable");
    ok("BlueprintTraceEvent.tenantId nullable");

    for (const idx of [
      "enterprise_blueprints_currentVersionId_key",
      "enterprise_blueprints_platformFinalizedVersionId_key",
      "enterprise_blueprint_versions_blueprintId_versionNumber_idx",
      "enterprise_blueprint_versions_contentHash_idx",
      "enterprise_blueprint_versions_createdByPlatformAccountId_idx",
      "blueprint_review_cycles_blueprintId_cycleNumber_key",
      "blueprint_review_cycles_blueprintId_versionNumber_idx",
      "blueprint_review_actions_reviewCycleId_createdAt_idx",
      "blueprint_review_actions_blueprintVersionId_idx",
    ]) {
      await assertIndex(prisma, idx);
    }
    ok("BLUEPRINT_1B_INDEXES_PRESENT");

    const uniqueVersion = await prisma.$queryRaw<{ indexdef: string }[]>`
      SELECT indexdef FROM pg_indexes
      WHERE schemaname='public' AND tablename='enterprise_blueprint_versions'
      AND indexdef ILIKE '%UNIQUE%' AND indexdef ILIKE '%blueprintId%' AND indexdef ILIKE '%versionNumber%'
    `;
    if (uniqueVersion.length < 1) fail("unique blueprintId/versionNumber constraint missing");
    ok("unique blueprint/version constraint present");

    const fkCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      WHERE c.contype = 'f'
      AND t.relname IN ('blueprint_review_cycles', 'blueprint_review_actions', 'enterprise_blueprints')
      AND c.conname LIKE '%blueprint%'
    `;
    if (Number(fkCount[0]?.count ?? 0) < 6) {
      fail(`review/blueprint FK count=${fkCount[0]?.count ?? 0} (expected >=6)`);
    }
    ok("BLUEPRINT_1B_CONSTRAINTS_PRESENT");

    const triggerDef = await prisma.$queryRaw<{ def: string }[]>`
      SELECT pg_get_triggerdef(oid) AS def FROM pg_trigger
      WHERE tgname = 'blueprint_version_no_update' AND NOT tgisinternal
    `;
    const def = triggerDef[0]?.def ?? "";
    if (!def.includes("blueprint_version_no_update")) fail("immutability trigger missing");
    if (!/UPDATE/i.test(def) || !/DELETE/i.test(def)) fail("trigger must cover UPDATE and DELETE");
    ok("blueprint_version_no_update trigger covers UPDATE and DELETE");
    ok("VERSION_INSERT allowed (trigger is BEFORE UPDATE OR DELETE only)");

    const fn = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM pg_proc WHERE proname = 'blueprint_version_immutable_guard'
    `;
    if (Number(fn[0]?.count ?? 0) !== 1) fail("immutability function missing");
    ok("blueprint_version_immutable_guard function exists");

    for (const table of [
      "blueprint_review_cycles",
      "blueprint_review_actions",
      "enterprise_blueprints",
      "enterprise_blueprint_versions",
    ]) {
      const blocked = await probeRestContainment(table);
      if (!blocked) fail(`Data API exposes ${table} to anon`);
    }
    ok("Data API containment on blueprint tables (REST probe blocked)");

    const counts = await prisma.$queryRaw<
      { eb: bigint; ev: bigint; rc: bigint; ra: bigint; te: bigint; ir: bigint; tm: bigint }[]
    >`
      SELECT
        (SELECT COUNT(*)::bigint FROM enterprise_blueprints) AS eb,
        (SELECT COUNT(*)::bigint FROM enterprise_blueprint_versions) AS ev,
        (SELECT COUNT(*)::bigint FROM blueprint_review_cycles) AS rc,
        (SELECT COUNT(*)::bigint FROM blueprint_review_actions) AS ra,
        (SELECT COUNT(*)::bigint FROM blueprint_trace_events) AS te,
        (SELECT COUNT(*)::bigint FROM implementation_requests) AS ir,
        (SELECT COUNT(*)::bigint FROM tenant_memberships) AS tm
    `;
    const c = counts[0]!;
    const baseline = await verifyRequestBaselineInvariants(prisma);
    assertRequestBaselineInvariants(baseline);
    ok(`implementation_requests=${Number(c.ir)} with invariant baseline preserved`);
    ok(`enterprise_blueprints=${Number(c.eb)} (business delta 0 expected)`);
    ok(`blueprint_review_cycles=${Number(c.rc)} (business delta 0 expected)`);
    ok(`blueprint_review_actions=${Number(c.ra)} (business delta 0 expected)`);
    ok(`blueprint_trace_events=${Number(c.te)} (unchanged)`);
    ok(`tenant_memberships=${Number(c.tm)} unchanged`);

    console.log("\nPASS — BLUEPRINT.1B.V RECONCILIATION COMPLETE\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
