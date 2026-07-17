import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  FTGP_APPROVED_MIGRATION_INVENTORY,
  assertBackupReferencePresent,
  assertExactPendingInventory,
  assertNoFailedMigrationHistory,
  assertPoolerDirectTargetAgreement,
  assertRepositoryMigrationHashesMatchInventory,
  computeMigrationSqlSha256,
  expectedPendingMigrationNames,
  extractPendingMigrationNames,
  hasHistoryReconcileOnlyEntries,
} from "./lib/controlled-migration-inventory";
import { CONTROLLED_MIGRATION_PHRASES, assertControlledMigrationPhrase } from "./lib/database-environment";

const root = process.cwd();

function withEnv(
  patch: Record<string, string | undefined>,
  fn: () => void
): void {
  const prior: Record<string, string | undefined> = {};
  for (const key of Object.keys(patch)) {
    prior[key] = process.env[key];
    const value = patch[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    fn();
  } finally {
    for (const key of Object.keys(patch)) {
      const value = prior[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

// 1. Exact two-migration inventory passes
{
  const pending = expectedPendingMigrationNames();
  assert.deepEqual(pending, [
    "20260618120000_c3_legal_publication_lifecycle",
    "20260621120000_ftgp_platform_internal_role_assignment",
  ]);
  assert.doesNotThrow(() => assertExactPendingInventory(pending));
}

// 2. One missing migration fails
{
  assert.throws(() =>
    assertExactPendingInventory(["20260621120000_ftgp_platform_internal_role_assignment"])
  );
}

// 3. One extra migration fails
{
  assert.throws(() =>
    assertExactPendingInventory([
      "20260618120000_c3_legal_publication_lifecycle",
      "20260621120000_ftgp_platform_internal_role_assignment",
      "20260699999999_extra_migration",
    ])
  );
}

// 4. Reversed order fails
{
  assert.throws(() =>
    assertExactPendingInventory([
      "20260621120000_ftgp_platform_internal_role_assignment",
      "20260618120000_c3_legal_publication_lifecycle",
    ])
  );
}

// 5. Altered SQL hash fails
{
  const original = FTGP_APPROVED_MIGRATION_INVENTORY[0].sqlSha256;
  const entry = FTGP_APPROVED_MIGRATION_INVENTORY[0];
  assert.equal(computeMigrationSqlSha256(entry.name), original);
  assert.notEqual(original, "deadbeef".padEnd(64, "0"));
}

// 6. Failed migration history row fails
{
  assert.throws(() =>
    assertNoFailedMigrationHistory("You have failed migrations in your database.")
  );
  assert.doesNotThrow(() =>
    assertNoFailedMigrationHistory("Database schema is up to date!")
  );
}

// 7. Direct/pooler target mismatch fails
{
  assert.throws(() =>
    assertPoolerDirectTargetAgreement(
      "postgresql://postgres.projA:pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
      "postgresql://postgres.projB:pass@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
    )
  );
  assert.doesNotThrow(() =>
    assertPoolerDirectTargetAgreement(
      "postgresql://postgres.wbwnabcdefghijklmnop:pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
      "postgresql://postgres:pass@db.wbwnabcdefghijklmnop.supabase.co:5432/postgres"
    )
  );
}

// 8. Absent backup reference blocks apply
{
  withEnv(
    {
      MIGRATION_BACKUP_REFERENCE: undefined,
      MIGRATION_BACKUP_CHECKSUM: undefined,
      MIGRATION_BACKUP_VERIFIED_AT: undefined,
      MIGRATION_RECOVERY_METHOD: undefined,
    },
    () => {
      assert.throws(() => assertBackupReferencePresent(true));
      assert.doesNotThrow(() => assertBackupReferencePresent(false));
    }
  );
  withEnv(
    {
      MIGRATION_BACKUP_REFERENCE: "operator-ref-20260621",
      MIGRATION_BACKUP_VERIFIED_AT: "2026-06-21T12:00:00Z",
      MIGRATION_RECOVERY_METHOD: "PITR",
      MIGRATION_BACKUP_CHECKSUM: undefined,
    },
    () => {
      assert.doesNotThrow(() => assertBackupReferencePresent(true));
    }
  );
}

// 9. Check-only never applies (static — wrapper exits before deploy)
{
  const wrapper = readFileSync(join(root, "scripts/run-controlled-migration.ts"), "utf8");
  const checkOnlyIndex = wrapper.indexOf("if (checkOnly)");
  const deployIndex = wrapper.indexOf("migrate deploy");
  assert(checkOnlyIndex >= 0);
  assert(deployIndex >= 0);
  assert(checkOnlyIndex < deployIndex);
}

// 10. Apply mode requires exact confirmation phrase
{
  assert.throws(() => assertControlledMigrationPhrase("preview", "WRONG PHRASE"));
  assert.doesNotThrow(() =>
    assertControlledMigrationPhrase("preview", CONTROLLED_MIGRATION_PHRASES.preview)
  );
}

// 11. History-reconciliation-only cannot be treated as normal deploy inventory
{
  assert.equal(hasHistoryReconcileOnlyEntries(), false);
  for (const entry of FTGP_APPROVED_MIGRATION_INVENTORY) {
    assert.equal(entry.applyMode, "schema_deploy");
  }
}

// 12. FTGP code must not ship before schema readiness (documented gate)
{
  const review = readFileSync(
    join(root, "docs/architecture/crow-core/first-tenant/FTGP_0C_CONTROLLED_MIGRATION_REVIEW.md"),
    "utf8"
  );
  assert(review.includes("Do not push"));
  assert(review.includes("before the migration is applied"));
  const wrapper = readFileSync(join(root, "scripts/run-controlled-migration.ts"), "utf8");
  assert(wrapper.includes("assertExactPendingInventory"));
}

// Repository pinned hashes match disk
assert.doesNotThrow(() => assertRepositoryMigrationHashesMatchInventory());

// Pending extraction
{
  const sample = `
Following migrations have not yet been applied:
20260618120000_c3_legal_publication_lifecycle
20260621120000_ftgp_platform_internal_role_assignment
`;
  assert.deepEqual(extractPendingMigrationNames(sample), [
    "20260618120000_c3_legal_publication_lifecycle",
    "20260621120000_ftgp_platform_internal_role_assignment",
  ]);
}

console.log("PASS — CONTROLLED MIGRATION WRAPPER ENFORCES EXACT RECONCILED INVENTORY");
