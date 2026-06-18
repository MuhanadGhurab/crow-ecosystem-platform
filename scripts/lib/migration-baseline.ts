import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const C1_MIGRATION_BASELINE = 13;

export const C2_MIGRATION_DIR = "20260614120000_blueprint_versioning_traceability";

export const C3_ACCOUNT_MIGRATION_DIR = "20260614140000_c3_account_registration";

export const C3_LEGAL_MIGRATION_DIR = "20260614150000_c3_legal_agreement";

export const C3_RLS_MIGRATION_DIR = "20260614160000_c3_public_schema_access_hardening";

export function countMigrationSql(root: string): number {
  const dir = join(root, "prisma/migrations");
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(join(dir, entry.name, "migration.sql"))) {
      count += 1;
    }
  }
  return count;
}

export function hasC2BlueprintMigration(root: string): boolean {
  return existsSync(join(root, "prisma/migrations", C2_MIGRATION_DIR, "migration.sql"));
}

export function hasC3AccountMigration(root: string): boolean {
  return existsSync(join(root, "prisma/migrations", C3_ACCOUNT_MIGRATION_DIR, "migration.sql"));
}

export function hasC3LegalMigration(root: string): boolean {
  return existsSync(join(root, "prisma/migrations", C3_LEGAL_MIGRATION_DIR, "migration.sql"));
}

export function hasC3RlsMigration(root: string): boolean {
  return existsSync(join(root, "prisma/migrations", C3_RLS_MIGRATION_DIR, "migration.sql"));
}

/** Expected migration folder count for the current branch stack. */
export function expectedMigrationBaseline(root: string): number {
  let baseline = C1_MIGRATION_BASELINE;
  if (hasC2BlueprintMigration(root)) baseline += 1;
  if (hasC3AccountMigration(root)) baseline += 1;
  if (hasC3LegalMigration(root)) baseline += 1;
  if (hasC3RlsMigration(root)) baseline += 1;
  return baseline;
}
