#!/usr/bin/env tsx
/**
 * FTGP.0C — read-only hosted preflight for internal-role migration.
 * Aggregate counts only; no PII. Does not apply migrations.
 *
 * Usage:
 *   npx tsx --env-file=.env.staging.runtime --env-file=.env.preview.operator scripts/verify-ftgp-migration-preflight-hosted.ts
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { queryServerMajorVersion, resolvePgBackupClient, runPsqlQuery } from "./lib/pg-backup-client";
import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";

const FTGP_MIGRATION = "20260621120000_ftgp_platform_internal_role_assignment";
const MIGRATION_SQL_PATH = join(
  process.cwd(),
  `prisma/migrations/${FTGP_MIGRATION}/migration.sql`
);

function directUrl(): string {
  const url = process.env.DIRECT_URL?.trim();
  if (!url) throw new Error("DIRECT_URL is required.");
  return url;
}

function q(url: string, sql: string, client: ReturnType<typeof resolvePgBackupClient>): string {
  return runPsqlQuery(url, sql, client);
}

function main() {
  const postApply = process.argv.includes("--post-apply");

  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.migration.recovery"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  const url = directUrl();
  const server = queryServerMajorVersion(url);
  const client = resolvePgBackupClient(server.major);
  const fp = fingerprintDatabaseUrl(url);

  console.log("\n=== FTGP hosted migration preflight (read-only) ===\n");
  const hosted = assertHostedVerificationTarget({
    envFile: envLoad.primaryEnvFile,
    requireDatabaseUrls: true,
  });
  console.log(`  env_file=${hosted.envFile}`);
  console.log(`  target: ${maskDatabaseTarget(url)}`);
  console.log(`  fingerprint: ${fp.targetHash} (${fp.maskedHost} / ${fp.maskedDatabase})`);

  const migrationHash = createHash("sha256")
    .update(readFileSync(MIGRATION_SQL_PATH, "utf8"))
    .digest("hex");
  console.log(`  ftgpMigrationSha256: ${migrationHash}`);

  const tableExists = q(
    url,
    `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_internal_role_assignments';`,
    client
  );
  const roleEnumExists = q(
    url,
    `SELECT COUNT(*) FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typname = 'PlatformInternalRole';`,
    client
  );
  const statusEnumExists = q(
    url,
    `SELECT COUNT(*) FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typname = 'PlatformInternalRoleAssignmentStatus';`,
    client
  );
  const partialIndexExists = q(
    url,
    `SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'platform_internal_role_assignments_one_active_per_role';`,
    client
  );

  console.log("\nObject preflight:");
  console.log(`  platform_internal_role_assignments table exists: ${tableExists}`);
  console.log(`  PlatformInternalRole enum exists: ${roleEnumExists}`);
  console.log(`  PlatformInternalRoleAssignmentStatus enum exists: ${statusEnumExists}`);
  console.log(`  partial unique index exists: ${partialIndexExists}`);

  if (postApply) {
    if (tableExists !== "1" || roleEnumExists !== "1" || statusEnumExists !== "1" || partialIndexExists !== "1") {
      console.error("\nFAIL: post-apply FTGP objects incomplete.");
      process.exit(1);
    }
  } else if (tableExists !== "0" || roleEnumExists !== "0" || statusEnumExists !== "0") {
    console.error("\nFAIL: FTGP objects already present — reconcile before apply.");
    process.exit(1);
  }

  const assignmentCount = tableExists === "1"
    ? q(url, `SELECT COUNT(*) FROM public."platform_internal_role_assignments";`, client)
    : "0";

  const counts = {
    platform_accounts: q(url, `SELECT COUNT(*) FROM public."platform_accounts";`, client),
    tenant_memberships: q(url, `SELECT COUNT(*) FROM public."tenant_memberships";`, client),
    platform_account_audit_events: q(
      url,
      `SELECT COUNT(*) FROM public."platform_account_audit_events";`,
      client
    ),
    internal_role_assignments: assignmentCount,
  };

  console.log("\nAggregate row counts:");
  for (const [table, count] of Object.entries(counts)) {
    console.log(`  ${table}: ${count}`);
  }

  const pendingIncomplete = q(
    url,
    `SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NULL ORDER BY migration_name;`,
    client
  );
  const blockingUnfinished = q(
    url,
    `SELECT migration_name FROM "_prisma_migrations" m WHERE m.finished_at IS NULL AND NOT EXISTS (SELECT 1 FROM "_prisma_migrations" s WHERE s.migration_name = m.migration_name AND s.finished_at IS NOT NULL AND s.rolled_back_at IS NULL) ORDER BY migration_name;`,
    client
  );
  const rolledBackCount = q(
    url,
    `SELECT COUNT(*) FROM "_prisma_migrations" WHERE rolled_back_at IS NOT NULL;`,
    client
  );
  const appliedCount = q(
    url,
    `SELECT COUNT(*) FROM "_prisma_migrations" WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL;`,
    client
  );

  console.log("\nMigration history:");
  console.log(`  applied migrations: ${appliedCount}`);
  console.log(`  rolled-back history rows: ${rolledBackCount}`);
  if (pendingIncomplete.trim()) {
    console.log("  unfinished migration rows (historical):");
    for (const line of pendingIncomplete.split("\n").filter(Boolean)) {
      console.log(`    - ${line}`);
    }
  } else {
    console.log("  unfinished migration rows (historical): (none)");
  }
  if (blockingUnfinished.trim()) {
    console.log("  blocking unfinished migrations:");
    for (const line of blockingUnfinished.split("\n").filter(Boolean)) {
      console.log(`    - ${line}`);
    }
  } else {
    console.log("  blocking unfinished migrations: (none)");
  }

  const ftgpApplied = q(
    url,
    `SELECT COUNT(*) FROM "_prisma_migrations" WHERE migration_name = '${FTGP_MIGRATION}' AND finished_at IS NOT NULL AND rolled_back_at IS NULL;`,
    client
  );
  console.log(`  ftgp migration applied: ${ftgpApplied === "1" ? "yes" : "no"}`);

  if (postApply && ftgpApplied !== "1") {
    console.error("\nFAIL: post-apply expects FTGP migration finished in history.");
    process.exit(1);
  }
  if (!postApply && ftgpApplied === "1") {
    console.error("\nFAIL: FTGP migration already applied — use --post-apply for post-migration checks.");
    process.exit(1);
  }

  const passwordRecoveryEnum = q(
    url,
    `SELECT COUNT(*) FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid WHERE t.typname = 'PlatformAccountAuditEventType' AND e.enumlabel = 'password_recovery_requested';`,
    client
  );
  console.log(`  password_recovery_requested enum present: ${passwordRecoveryEnum === "1" ? "yes" : "no"}`);

  console.log("\nPreflight summary:");
  console.log(`  existing internal assignments = ${counts.internal_role_assignments}`);
  console.log(`  backfill required = false`);

  if (counts.internal_role_assignments !== "0") {
    console.error("\nFAIL: unexpected existing internal role assignments.");
    process.exit(1);
  }

  if (!postApply && blockingUnfinished.trim()) {
    console.error("\nFAIL: blocking unfinished migration rows detected in _prisma_migrations.");
    process.exit(1);
  }

  console.log(`\nPASS — FTGP HOSTED PREFLIGHT (${postApply ? "POST-APPLY" : "READ-ONLY"})\n`);
}

main();
