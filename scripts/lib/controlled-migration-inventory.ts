/**
 * FTGP.0D — exact controlled migration inventory and validation helpers.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { fingerprintDatabaseUrl } from "./database-fingerprint";

export type MigrationApplyMode = "schema_deploy" | "history_reconcile_only";

export type ControlledMigrationInventoryEntry = {
  name: string;
  sqlSha256: string;
  order: number;
  riskClassification: string;
  applyMode: MigrationApplyMode;
};

/** Canonical FTGP.0D approved inventory (ordered). */
export const FTGP_APPROVED_MIGRATION_INVENTORY: readonly ControlledMigrationInventoryEntry[] = [
  {
    name: "20260618120000_c3_legal_publication_lifecycle",
    sqlSha256: "07678643967a72ee8965e54681e69def4c50561b4774e24100f0fc925e30c1ab",
    order: 1,
    riskClassification: "ENUM_ADDITION_LOW_RISK",
    applyMode: "schema_deploy",
  },
  {
    name: "20260621120000_ftgp_platform_internal_role_assignment",
    sqlSha256: "4868d172cc2b100e54970e83977e3d9f9212d06c916258aa70df2b66f3f7bd5e",
    order: 2,
    riskClassification: "SHARED_DATABASE_MIGRATION_SECURITY_AUTHORITY",
    applyMode: "schema_deploy",
  },
] as const;

export function migrationSqlPath(name: string): string {
  return join(process.cwd(), "prisma/migrations", name, "migration.sql");
}

export function computeMigrationSqlSha256(name: string): string {
  const sql = readFileSync(migrationSqlPath(name), "utf8");
  return createHash("sha256").update(sql).digest("hex");
}

export function expectedPendingMigrationNames(): string[] {
  return FTGP_APPROVED_MIGRATION_INVENTORY.map((entry) => entry.name);
}

export function assertRepositoryMigrationHashesMatchInventory(): void {
  for (const entry of FTGP_APPROVED_MIGRATION_INVENTORY) {
    const actual = computeMigrationSqlSha256(entry.name);
    if (actual !== entry.sqlSha256) {
      throw new Error(
        `Migration SQL hash mismatch for ${entry.name}: expected ${entry.sqlSha256}, actual ${actual}`
      );
    }
  }
}

export function extractPendingMigrationNames(output: string): string[] {
  const marker = "Following migration have not yet been applied:";
  const altMarker = "Following migrations have not yet been applied:";
  const section =
    output.split(marker)[1]?.split("\n\n")[0] ??
    output.split(altMarker)[1]?.split("\n\n")[0] ??
    "";

  const pending: string[] = [];
  for (const line of section.split("\n")) {
    const match = line.trim().match(/^(\d{14}_[\w]+)/);
    if (match) pending.push(match[1]);
  }
  return pending;
}

export function assertExactPendingInventory(actualPending: string[]): void {
  const expected = expectedPendingMigrationNames();
  const actualSorted = [...actualPending].sort();
  const expectedSorted = [...expected].sort();

  if (actualSorted.length !== expectedSorted.length) {
    throw new Error(
      `Pending migration count mismatch: expected ${expectedSorted.length}, actual ${actualSorted.length}. ` +
        `Expected [${expectedSorted.join(", ")}], actual [${actualSorted.join(", ")}]`
    );
  }

  for (let i = 0; i < expected.length; i++) {
    const entry = FTGP_APPROVED_MIGRATION_INVENTORY[i];
    if (actualPending[i] !== entry.name) {
      throw new Error(
        `Pending migration order mismatch at position ${i + 1}: expected ${entry.name}, actual ${actualPending[i] ?? "(missing)"}`
      );
    }
  }

  const unexpected = actualSorted.filter((name) => !expectedSorted.includes(name));
  const missing = expectedSorted.filter((name) => !actualSorted.includes(name));
  if (unexpected.length > 0 || missing.length > 0) {
    throw new Error(
      `Pending inventory mismatch. Unexpected: [${unexpected.join(", ")}]. Missing: [${missing.join(", ")}]`
    );
  }
}

export function assertNoFailedMigrationHistory(output: string): void {
  if (/failed migrations/i.test(output)) {
    throw new Error("Failed migrations detected in migrate status output.");
  }
}

export function assertPoolerDirectTargetAgreement(
  poolerUrl: string,
  directUrl: string
): { poolerFingerprint: string; directFingerprint: string; projectRef: string | null; match: boolean } {
  const pooler = fingerprintDatabaseUrl(poolerUrl);
  const direct = fingerprintDatabaseUrl(directUrl);

  const databaseMatch = pooler.maskedDatabase === direct.maskedDatabase;
  const schemaMatch = pooler.schema === direct.schema;
  const refMatch =
    pooler.supabaseProjectRef !== null &&
    direct.supabaseProjectRef !== null &&
    pooler.supabaseProjectRef === direct.supabaseProjectRef;

  const match = databaseMatch && schemaMatch && refMatch;

  if (!match) {
    throw new Error(
      "Pooler and direct targets disagree (database/schema/project ref). " +
        `pooler=${pooler.targetHash} direct=${direct.targetHash} refMatch=${refMatch}`
    );
  }

  return {
    poolerFingerprint: pooler.targetHash,
    directFingerprint: direct.targetHash,
    projectRef: direct.supabaseProjectRef,
    match,
  };
}

export function migrationSqlHashMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const entry of FTGP_APPROVED_MIGRATION_INVENTORY) {
    map[entry.name] = entry.sqlSha256;
  }
  return map;
}

export function hasHistoryReconcileOnlyEntries(): boolean {
  return FTGP_APPROVED_MIGRATION_INVENTORY.some(
    (entry) => entry.applyMode === "history_reconcile_only"
  );
}

export function assertBackupReferencePresent(applyMode: boolean): boolean {
  const reference = process.env.MIGRATION_BACKUP_REFERENCE?.trim();
  const checksum = process.env.MIGRATION_BACKUP_CHECKSUM?.trim();
  const verifiedAt = process.env.MIGRATION_BACKUP_VERIFIED_AT?.trim();
  const method = process.env.MIGRATION_RECOVERY_METHOD?.trim();

  if (!applyMode) {
    return Boolean(reference || checksum);
  }

  if (!reference && !checksum) {
    throw new Error(
      "MIGRATION_BACKUP_REFERENCE or MIGRATION_BACKUP_CHECKSUM is required for apply mode."
    );
  }

  if (!verifiedAt) {
    throw new Error("MIGRATION_BACKUP_VERIFIED_AT is required for apply mode.");
  }

  if (method !== "BACKUP" && method !== "PITR") {
    throw new Error("MIGRATION_RECOVERY_METHOD must be BACKUP or PITR for apply mode.");
  }

  return true;
}

export type ControlledMigrationCheckReport = {
  targetDatabaseFingerprint: string;
  directPoolerTargetMatch: boolean;
  appliedMigrationCount: number | null;
  failedMigrationCount: number | null;
  expectedPendingMigrations: string[];
  actualPendingMigrations: string[];
  migrationSqlHashes: Record<string, string>;
  backupReferencePresent: boolean;
  applyAuthorized: boolean;
};

export function buildCheckReport(options: {
  directFingerprint: string;
  directPoolerMatch: boolean;
  migrateStatusOutput: string;
  actualPending: string[];
  applyMode: boolean;
}): ControlledMigrationCheckReport {
  const appliedMatch = options.migrateStatusOutput.match(/(\d+) migrations found/i);
  const failed = /failed migrations/i.test(options.migrateStatusOutput);

  return {
    targetDatabaseFingerprint: options.directFingerprint,
    directPoolerTargetMatch: options.directPoolerMatch,
    appliedMigrationCount: appliedMatch ? Number(appliedMatch[1]) : null,
    failedMigrationCount: failed ? 1 : 0,
    expectedPendingMigrations: expectedPendingMigrationNames(),
    actualPendingMigrations: options.actualPending,
    migrationSqlHashes: migrationSqlHashMap(),
    backupReferencePresent: Boolean(
      process.env.MIGRATION_BACKUP_REFERENCE?.trim() ||
        process.env.MIGRATION_BACKUP_CHECKSUM?.trim()
    ),
    applyAuthorized: options.applyMode,
  };
}

export function printCheckReport(report: ControlledMigrationCheckReport): void {
  console.log("\n--- Controlled migration check report ---");
  console.log(`TARGET_DATABASE_FINGERPRINT=${report.targetDatabaseFingerprint}`);
  console.log(`DIRECT_POOLER_TARGET_MATCH=${report.directPoolerTargetMatch}`);
  console.log(`APPLIED_MIGRATION_COUNT=${report.appliedMigrationCount ?? "unknown"}`);
  console.log(`FAILED_MIGRATION_COUNT=${report.failedMigrationCount ?? "unknown"}`);
  console.log(`EXPECTED_PENDING_MIGRATIONS=${report.expectedPendingMigrations.join(",")}`);
  console.log(`ACTUAL_PENDING_MIGRATIONS=${report.actualPendingMigrations.join(",") || "(none)"}`);
  console.log("MIGRATION_SQL_HASHES=");
  for (const [name, hash] of Object.entries(report.migrationSqlHashes)) {
    console.log(`  ${name}=${hash}`);
  }
  console.log(`BACKUP_REFERENCE_PRESENT=${report.backupReferencePresent}`);
  console.log(`APPLY_AUTHORIZED=${report.applyAuthorized}`);
  console.log("-----------------------------------------\n");
}
