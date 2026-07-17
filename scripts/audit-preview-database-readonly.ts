/**
 * C2.1 — Read-only Preview / hosted database audit.
 *
 * NEVER runs Prisma migration apply, schema push, resolve, seed, or backfill apply mode.
 *
 *   CYBERCROW_SCRIPT_PRISMA=1 npx tsx scripts/audit-preview-database-readonly.ts
 *
 * Writes masked evidence to:
 *   docs/architecture/crow-core/c2/.c21-preview-audit-evidence.json
 */

import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { C2_MIGRATION_DIR } from "./lib/migration-baseline";
import { fingerprintDatabaseUrl, maskId, type DatabaseFingerprint } from "./lib/database-fingerprint";
import { runBlueprintPersistenceBackfill } from "../src/lib/crow-core/blueprint-runtime/blueprint-backfill.service";

const ROOT = join(import.meta.dirname, "..");
const EVIDENCE_PATH = join(
  ROOT,
  "docs/architecture/crow-core/c2/.c21-preview-audit-evidence.json"
);

const REPO_MIGRATIONS = [
  "20260515150000_init_crow_ecosystem",
  "20260519120000_phase5_hr_crm_phase6_notifications",
  "20260519180000_phase7_commercial_proposal",
  "20260522120000_client_portal_identity",
  "20260522140000_phase5_tenant_sales",
  "20260522150000_phase5_tenant_inventory",
  "20260522160000_phase5_tenant_warehouse",
  "20260522170000_phase5_tenant_finance",
  "20260523120000_m8_stripe_subscription",
  "20260524120000_org_intelligence",
  "20260525120000_phase_e_notification_stabilization",
  "20260527120000_client_org_membership",
  "20260605120000_tenant_membership_invite",
  C2_MIGRATION_DIR,
] as const;

const PRE_C2_TABLES = [
  "enterprise_blueprints",
  "client_organization_request_links",
  "tenants",
  "_prisma_migrations",
] as const;

const C2_TABLES = [
  "enterprise_blueprint_versions",
  "blueprint_approvals",
  "blueprint_trace_events",
  "blueprint_change_requests",
  "blueprint_configuration_proposals",
  "roi_assumptions",
  "roi_assumption_revisions",
  "roi_snapshots",
  "sow_documents",
  "sow_versions",
  "sow_sections",
] as const;

type MigrationRow = {
  migration_name: string;
  finished_at: Date | null;
  rolled_back_at: Date | null;
  applied_steps_count: number;
};

function classifyMigrationHistory(applied: string[]): string {
  const c2Present = applied.includes(C2_MIGRATION_DIR);
  const baseline = REPO_MIGRATIONS.slice(0, 13);
  const baselinePresent = baseline.every((m) => applied.includes(m));
  const extra = applied.filter((m) => !REPO_MIGRATIONS.includes(m as (typeof REPO_MIGRATIONS)[number]));
  const missing = REPO_MIGRATIONS.filter((m) => !applied.includes(m));

  if (c2Present) return "C2_ALREADY_APPLIED";
  if (missing.length === 0 && extra.length === 0) return "ALIGNED";
  if (missing.length === 1 && missing[0] === C2_MIGRATION_DIR && baselinePresent)
    return "ALIGNED_PENDING_C2_ONLY";
  if (baselinePresent && missing.length > 0) return "INCOMPLETE";
  if (extra.length > 0) return "DRIFTED";
  return "UNKNOWN";
}

async function tableExists(prisma: PrismaClient, table: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = current_schema()
        AND table_name = ${table}
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

async function main() {
  const directUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!directUrl) {
    throw new Error("DIRECT_URL or DATABASE_URL required for read-only audit");
  }

  const fingerprint: DatabaseFingerprint = fingerprintDatabaseUrl(directUrl);
  const prisma = new PrismaClient({
    datasources: { db: { url: directUrl } },
    log: ["error"],
  });

  try {
    const versionRow = await prisma.$queryRaw<{ version: string }[]>`SELECT version() AS version`;
    const serverVersion = versionRow[0]?.version?.split(" ")[0] ?? "unknown";

    const migrationRows = await prisma.$queryRaw<MigrationRow[]>`
      SELECT migration_name, finished_at, rolled_back_at, applied_steps_count
      FROM "_prisma_migrations"
      ORDER BY finished_at NULLS LAST, migration_name
    `;

    const appliedNames = migrationRows
      .filter((r) => r.finished_at && !r.rolled_back_at)
      .map((r) => r.migration_name);
    const failed = migrationRows.filter((r) => !r.finished_at && !r.rolled_back_at);
    const rolledBack = migrationRows.filter((r) => r.rolled_back_at);

    const historyClass = classifyMigrationHistory(appliedNames);

    const tablePresence: Record<string, boolean> = {};
    for (const t of [...PRE_C2_TABLES, ...C2_TABLES]) {
      tablePresence[t] = await tableExists(prisma, t);
    }

    const blueprintCount = tablePresence.enterprise_blueprints
      ? Number(
          (
            await prisma.$queryRaw<{ count: bigint }[]>`
              SELECT COUNT(*)::bigint AS count FROM "enterprise_blueprints"
            `
          )[0]?.count ?? 0n
        )
      : 0;

    const missingTenantId = tablePresence.enterprise_blueprints
      ? Number(
          (
            await prisma.$queryRaw<{ count: bigint }[]>`
              SELECT COUNT(*)::bigint AS count
              FROM "enterprise_blueprints"
              WHERE "tenantId" IS NULL
            `
          )[0]?.count ?? 0n
        )
      : 0;

    const invalidTenantRefs = tablePresence.enterprise_blueprints
      ? Number(
          (
            await prisma.$queryRaw<{ count: bigint }[]>`
              SELECT COUNT(*)::bigint AS count
              FROM "enterprise_blueprints" eb
              LEFT JOIN "tenants" t ON t.id = eb."tenantId"
              WHERE eb."tenantId" IS NOT NULL AND t.id IS NULL
            `
          )[0]?.count ?? 0n
        )
      : 0;

    const proposalStatusRows = tablePresence.enterprise_blueprints
      ? await prisma.$queryRaw<{ proposalStatus: string; count: bigint }[]>`
          SELECT "proposalStatus"::text AS "proposalStatus", COUNT(*)::bigint AS count
          FROM "enterprise_blueprints"
          GROUP BY "proposalStatus"
        `
      : [];

    const versionCount = tablePresence.enterprise_blueprint_versions
      ? Number(
          (
            await prisma.$queryRaw<{ count: bigint }[]>`
              SELECT COUNT(*)::bigint AS count FROM "enterprise_blueprint_versions"
            `
          )[0]?.count ?? 0n
        )
      : 0;

    const backfillReport = tablePresence.enterprise_blueprints
      ? await runBlueprintPersistenceBackfill({ dryRun: true, limit: 500 })
      : {
          dryRun: true,
          processed: 0,
          created: 0,
          skipped: 0,
          unresolved: 0,
          rows: [],
        };

    const knownProductionRef = "wbwnsndcxrgyqwppurms";
    const isolation =
      fingerprint.supabaseProjectRef === knownProductionRef
        ? "SHARED_OR_POSSIBLY_SHARED"
        : fingerprint.supabaseProjectRef
          ? "ISOLATED_PROJECT_REF"
          : fingerprint.maskedHost.includes("localhost")
            ? "LOCAL_DISPOSABLE"
            : "UNKNOWN";

    const evidence = {
      auditedAt: new Date().toISOString(),
      mode: "READ_ONLY",
      hostedMutation: false,
      fingerprint: {
        ...fingerprint,
        serverVersion,
        environmentClassification:
          isolation === "LOCAL_DISPOSABLE" ? "local" : isolation === "ISOLATED_PROJECT_REF" ? "preview_candidate" : "shared_staging_production_risk",
      },
      isolation: {
        classification: isolation,
        knownProductionSupabaseRef: knownProductionRef,
        note:
          isolation === "SHARED_OR_POSSIBLY_SHARED"
            ? "DATABASE_URL targets documented production/staging Supabase project; Preview and Production likely share one Postgres unless Vercel Preview env uses a different URL."
            : isolation === "LOCAL_DISPOSABLE"
              ? "Audit ran against local/disposable Postgres — not hosted Preview."
              : "Project ref differs from documented production ref or host is non-Supabase.",
      },
      migrationHistory: {
        classification: historyClass,
        appliedCount: appliedNames.length,
        repoExpectedCount: REPO_MIGRATIONS.length,
        c2Present: appliedNames.includes(C2_MIGRATION_DIR),
        failedCount: failed.length,
        rolledBackCount: rolledBack.length,
        missingFromRepo: REPO_MIGRATIONS.filter((m) => !appliedNames.includes(m)),
        extraNotInRepo: appliedNames.filter(
          (m) => !REPO_MIGRATIONS.includes(m as (typeof REPO_MIGRATIONS)[number])
        ),
        failedMigrationNames: failed.map((r) => r.migration_name),
      },
      schemaDrift: {
        tablePresence,
        clientOrgRequestLinks: tablePresence.client_organization_request_links
          ? "present"
          : "absent",
        c2TablesPresent: C2_TABLES.every((t) => tablePresence[t]),
      },
      blueprintData: {
        enterpriseBlueprintCount: blueprintCount,
        missingTenantIdCount: missingTenantId,
        invalidTenantRefCount: invalidTenantRefs,
        versionRowCount: versionCount,
        proposalStatusDistribution: Object.fromEntries(
          proposalStatusRows.map((r) => [r.proposalStatus, Number(r.count)])
        ),
      },
      backfillDryRun: {
        dryRun: backfillReport.dryRun,
        processed: backfillReport.processed,
        wouldCreate: backfillReport.created,
        skipped: backfillReport.skipped,
        unresolvedTenant: backfillReport.unresolved,
        sampleUnresolvedIds: backfillReport.rows
          .filter((r) => r.action === "unresolved_tenant")
          .slice(0, 5)
          .map((r) => maskId(r.blueprintId)),
      },
      checksum: createHash("sha256")
        .update(JSON.stringify({ fingerprint, appliedNames, tablePresence }))
        .digest("hex")
        .slice(0, 16),
    };

    writeFileSync(EVIDENCE_PATH, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

    console.log("\n=== C2.1 read-only database audit (masked) ===\n");
    console.log(`Target hash: ${evidence.fingerprint.targetHash}`);
    console.log(`Provider: ${fingerprint.provider}`);
    console.log(`Host: ${fingerprint.maskedHost}`);
    console.log(`Database: ${fingerprint.maskedDatabase}`);
    console.log(`Schema: ${fingerprint.schema}`);
    console.log(`Isolation: ${isolation}`);
    console.log(`Migration history: ${historyClass}`);
    console.log(`C2 applied: ${appliedNames.includes(C2_MIGRATION_DIR)}`);
    console.log(`Enterprise blueprints: ${blueprintCount}`);
    console.log(`Missing tenantId: ${missingTenantId}`);
    console.log(`Backfill dry-run unresolved: ${backfillReport.unresolved}`);
    console.log(`Evidence: ${EVIDENCE_PATH}`);
    console.log("\nDone (read-only).\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
