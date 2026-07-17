#!/usr/bin/env tsx
/**
 * FTGP.0C — static verification of internal-role migration SQL (no database connection).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const MIGRATION_PATH = join(
  ROOT,
  "prisma/migrations/20260621120000_ftgp_platform_internal_role_assignment/migration.sql"
);
const SCHEMA_PATH = join(ROOT, "prisma/schema.prisma");

function fail(msg: string): never {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function main() {
  const sql = readFileSync(MIGRATION_PATH, "utf8");
  const schema = readFileSync(SCHEMA_PATH, "utf8");
  const hash = createHash("sha256").update(sql).digest("hex");

  console.log("\n=== FTGP migration SQL static verification ===\n");
  console.log(`  migrationSha256: ${hash}`);

  const forbidden = [
    /^\s*DROP TABLE/im,
    /^\s*DROP COLUMN/im,
    /^\s*ALTER TABLE[^\n]*DROP/im,
    /^\s*RENAME TO/im,
    /^\s*ALTER TABLE[^\n]*ALTER COLUMN/im,
    /^\s*CREATE TRIGGER/im,
    /^\s*UPDATE\s+"platform_accounts"/im,
    /^\s*UPDATE\s+"tenant_memberships"/im,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(sql)) {
      fail(`Forbidden pattern in migration SQL: ${pattern}`);
    }
  }
  ok("No destructive DDL or data backfill statements");

  const required = [
    'CREATE TYPE "PlatformInternalRole"',
    'CREATE TYPE "PlatformInternalRoleAssignmentStatus"',
    "platform_internal_role_granted",
    "platform_internal_role_revoked",
    'CREATE TABLE "platform_internal_role_assignments"',
    "platform_internal_role_assignments_one_active_per_role",
    'WHERE "status" = \'ACTIVE\'',
    "ON DELETE CASCADE",
    "ON DELETE RESTRICT",
    "ON DELETE SET NULL",
  ];
  for (const fragment of required) {
    if (!sql.includes(fragment)) {
      fail(`Missing expected SQL fragment: ${fragment}`);
    }
  }
  ok("Required DDL fragments present");

  if (
    !/platform_internal_role_assignments_one_active_per_role[\s\S]*WHERE "status" = 'ACTIVE'/.test(
      sql
    )
  ) {
    fail("Partial unique index predicate must constrain ACTIVE rows only");
  }
  ok("Partial unique index uses ACTIVE status predicate");

  const schemaChecks: Array<[string, RegExp]> = [
    ["PlatformInternalRole enum in schema", /enum PlatformInternalRole/],
    ["PlatformInternalRoleAssignmentStatus enum", /enum PlatformInternalRoleAssignmentStatus/],
    ["platform_internal_role_granted audit enum", /platform_internal_role_granted/],
    ["platform_internal_role_revoked audit enum", /platform_internal_role_revoked/],
    ["onDelete: Cascade subject FK", /onDelete: Cascade/],
    ["onDelete: Restrict grantor FK", /onDelete: Restrict/],
    ["onDelete: SetNull revoker FK", /onDelete: SetNull/],
  ];
  for (const [label, pattern] of schemaChecks) {
    if (!pattern.test(schema)) {
      fail(`Prisma schema missing: ${label}`);
    }
  }
  ok("Prisma schema aligns with migration intent");

  const failClosed = [
    'ENABLE ROW LEVEL SECURITY',
    'REVOKE ALL ON TABLE "platform_internal_role_assignments" FROM anon, authenticated',
  ];
  for (const fragment of failClosed) {
    if (!sql.includes(fragment)) {
      fail(`Missing CLOUD.1B fail-closed fragment: ${fragment}`);
    }
  }
  ok("Internal-role table is fail-closed for anon/authenticated PostgREST");

  console.log("\nPASS — FTGP MIGRATION SQL STATIC CHECKS\n");
}

main();
