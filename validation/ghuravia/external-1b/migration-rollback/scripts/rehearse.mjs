/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

if (!process.env.GHV_VAL_1B_DATABASE_URL) throw new Error("GHV_VAL_1B_DATABASE_URL is required");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = new pg.Client({ connectionString: process.env.GHV_VAL_1B_DATABASE_URL });
const apply = async (name) => client.query(await readFile(path.join(root, "sql", name), "utf8"));

await client.connect();
try {
  await client.query("DROP SCHEMA IF EXISTS ghv_migration_validation CASCADE");
  await apply("001_init.sql");
  await apply("001_init.sql");
  await client.query("INSERT INTO ghv_migration_validation.item(id,legacy_label) VALUES('SYNTHETIC:one','old')");
  await apply("002_additive.sql");
  await apply("003_expand.sql");
  await apply("backfill.sql");
  await apply("backfill.sql");
  assert.equal((await client.query("SELECT canonical_label FROM ghv_migration_validation.item")).rows[0].canonical_label, "old");
  await apply("004_contract.sql");
  await client.query("BEGIN");
  await client.query("INSERT INTO ghv_migration_validation.migration_audit(migration_name,action) VALUES('interrupted','partial')");
  await client.query("ROLLBACK");
  assert.equal((await client.query("SELECT count(*)::int AS n FROM ghv_migration_validation.migration_audit WHERE migration_name='interrupted'")).rows[0].n, 0);
  await client.query("DROP SCHEMA ghv_migration_validation CASCADE");
  console.log("PASS local migration rehearsal; PASS local reset; validation schema removed");
} finally {
  await client.end();
}
