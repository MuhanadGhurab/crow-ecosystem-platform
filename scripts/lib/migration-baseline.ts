import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const C1_MIGRATION_BASELINE = 13;

export const C2_MIGRATION_DIR = "20260614120000_blueprint_versioning_traceability";

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

/** Expected migration folder count for the current branch stack. */
export function expectedMigrationBaseline(root: string): number {
  return hasC2BlueprintMigration(root) ? C1_MIGRATION_BASELINE + 1 : C1_MIGRATION_BASELINE;
}
