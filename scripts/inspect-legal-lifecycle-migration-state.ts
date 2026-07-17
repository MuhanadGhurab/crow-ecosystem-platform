#!/usr/bin/env tsx
/**
 * FTGP.0D — read-only legal-lifecycle migration reconciliation inspection.
 * Aggregate/schema evidence only. Does not apply or resolve migrations.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import { queryServerMajorVersion, resolvePgBackupClient, runPsqlQuery } from "./lib/pg-backup-client";

const LEGAL_MIGRATION = "20260618120000_c3_legal_publication_lifecycle";
const LEGAL_SQL_PATH = join(
  process.cwd(),
  `prisma/migrations/${LEGAL_MIGRATION}/migration.sql`
);

type LegalMigrationClassification =
  | "TRULY_UNAPPLIED"
  | "SCHEMA_APPLIED_HISTORY_MISSING"
  | "PARTIALLY_APPLIED"
  | "ENVIRONMENT_OR_DATABASE_MISMATCH";

function q(url: string, sql: string, client: ReturnType<typeof resolvePgBackupClient>): string {
  return runPsqlQuery(url, sql, client);
}

function main() {
  const poolerUrl = process.env.DATABASE_URL?.trim();
  const directUrl = process.env.DIRECT_URL?.trim();
  if (!poolerUrl || !directUrl) {
    throw new Error("DATABASE_URL and DIRECT_URL are required.");
  }

  const poolerFp = fingerprintDatabaseUrl(poolerUrl);
  const directFp = fingerprintDatabaseUrl(directUrl);
  const projectRefMatch =
    poolerFp.supabaseProjectRef !== null &&
    directFp.supabaseProjectRef !== null &&
    poolerFp.supabaseProjectRef === directFp.supabaseProjectRef;
  const databaseMatch = poolerFp.maskedDatabase === directFp.maskedDatabase;

  const client = resolvePgBackupClient(queryServerMajorVersion(directUrl).major);
  const legalSqlHash = createHash("sha256").update(readFileSync(LEGAL_SQL_PATH, "utf8")).digest("hex");

  console.log("\n=== Legal lifecycle migration reconciliation (read-only) ===\n");
  console.log(`  poolerTarget: ${maskDatabaseTarget(poolerUrl)}`);
  console.log(`  directTarget: ${maskDatabaseTarget(directUrl)}`);
  console.log(`  poolerFingerprint: ${poolerFp.targetHash}`);
  console.log(`  directFingerprint: ${directFp.targetHash}`);
  console.log(`  projectRefMatch: ${projectRefMatch ? "yes" : "no"}`);
  console.log(`  databaseMatch: ${databaseMatch ? "yes" : "no"}`);
  console.log(`  note: pooler/direct targetHash differ by host/port (expected on Supabase)`);
  console.log(`  legalMigrationSqlSha256: ${legalSqlHash}`);

  const migrationRows = q(
    directUrl,
    `SELECT migration_name,
            CASE WHEN finished_at IS NOT NULL THEN 'finished' ELSE 'unfinished' END AS finish_state,
            CASE WHEN rolled_back_at IS NOT NULL THEN 'yes' ELSE 'no' END AS rolled_back,
            LEFT(checksum, 16) AS checksum_prefix,
            started_at::text,
            finished_at::text
     FROM "_prisma_migrations"
     WHERE migration_name = '${LEGAL_MIGRATION}'
     ORDER BY started_at;`,
    client
  );

  console.log("\n_prisma_migrations rows for legal lifecycle:");
  if (migrationRows.trim()) {
    for (const line of migrationRows.split("\n")) {
      console.log(`  ${line.replace(/\|/g, " | ")}`);
    }
  } else {
    console.log("  (none)");
  }

  const enumLabels = q(
    directUrl,
    `SELECT e.enumlabel
     FROM pg_enum e
     JOIN pg_type t ON t.oid = e.enumtypid
     WHERE t.typname = 'LegalDocumentVersionStatus'
     ORDER BY e.enumsortorder;`,
    client
  );
  const labels = enumLabels.split("\n").filter(Boolean);
  const hasReviewed = labels.includes("reviewed");
  const hasApproved = labels.includes("approved_for_publication");

  console.log("\nLegalDocumentVersionStatus enum labels (aggregate):");
  console.log(`  totalLabels: ${labels.length}`);
  console.log(`  reviewed: ${hasReviewed ? "present" : "absent"}`);
  console.log(`  approved_for_publication: ${hasApproved ? "present" : "absent"}`);

  const finishedRowCount = q(
    directUrl,
    `SELECT COUNT(*) FROM "_prisma_migrations"
     WHERE migration_name = '${LEGAL_MIGRATION}'
       AND finished_at IS NOT NULL
       AND rolled_back_at IS NULL;`,
    client
  );

  let classification: LegalMigrationClassification;
  if (!projectRefMatch || !databaseMatch) {
    classification = "ENVIRONMENT_OR_DATABASE_MISMATCH";
  } else if (hasReviewed && hasApproved && finishedRowCount === "0") {
    classification = "SCHEMA_APPLIED_HISTORY_MISSING";
  } else if (!hasReviewed && !hasApproved && finishedRowCount === "0") {
    classification = "TRULY_UNAPPLIED";
  } else if ((hasReviewed || hasApproved) && !(hasReviewed && hasApproved)) {
    classification = "PARTIALLY_APPLIED";
  } else if (hasReviewed && hasApproved && finishedRowCount !== "0") {
    classification = "SCHEMA_APPLIED_HISTORY_MISSING";
  } else {
    classification = "TRULY_UNAPPLIED";
  }

  console.log(`\nCLASSIFICATION: ${classification}\n`);
}

main();
