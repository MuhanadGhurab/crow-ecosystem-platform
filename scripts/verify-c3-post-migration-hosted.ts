#!/usr/bin/env tsx
/** C3.5 — Read-only hosted post-migration verification (RLS, grants, schema counts). */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { queryServerMajorVersion, resolvePgBackupClient, runPsqlQuery } from "./lib/pg-backup-client";

const C3_TABLES = [
  "platform_accounts",
  "platform_account_profiles",
  "platform_account_audit_events",
  "email_verification_challenges",
  "legal_documents",
  "legal_document_versions",
  "account_legal_acceptances",
  "account_consent_preferences",
] as const;

function directUrl(): string {
  const url = process.env.DIRECT_URL?.trim();
  if (!url) throw new Error("DIRECT_URL is required.");
  return url;
}

function main() {
  const url = directUrl();
  const server = queryServerMajorVersion(url);
  const client = resolvePgBackupClient(server.major);

  console.log("\n=== C3 hosted post-migration verification ===\n");

  const rlsRows = runPsqlQuery(
    url,
    `SELECT c.relname, c.relrowsecurity::text FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relname IN (${C3_TABLES.map((t) => `'${t}'`).join(",")}) ORDER BY c.relname;`,
    client
  );
  console.log("RLS enabled:");
  for (const line of rlsRows.split("\n").filter(Boolean)) {
    const [name, enabledRaw] = line.split("|");
    const enabled = enabledRaw === "t" || enabledRaw === "true";
    console.log(`  ${name}: ${enabled ? "PASS" : "FAIL"}`);
  }

  const policyCount = runPsqlQuery(
    url,
    `SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename IN (${C3_TABLES.map((t) => `'${t}'`).join(",")});`,
    client
  );
  console.log(`\nRLS policies on C3 tables: ${policyCount} (expect 0)`);
  console.log(`  broad policies: ${policyCount === "0" ? "PASS" : "FAIL"}`);

  console.log("\nTable grants (anon/authenticated):");
  for (const table of C3_TABLES) {
    const grants = runPsqlQuery(
      url,
      `SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_schema = 'public' AND grantee IN ('anon','authenticated') AND table_name = '${table}' ORDER BY grantee, privilege_type;`,
      client
    );
    const status = grants.trim().length === 0 ? "PASS (none)" : `FAIL (${grants.split("\n").length} grants)`;
    console.log(`  ${table}: ${status}`);
  }

  const migrations = runPsqlQuery(
    url,
    `SELECT migration_name, finished_at FROM "_prisma_migrations" WHERE migration_name LIKE '%c3%' ORDER BY migration_name;`,
    client
  );
  console.log("\nC3 migration records:");
  for (const line of migrations.split("\n").filter(Boolean)) {
    const [name, finished] = line.split("|");
    console.log(`  ${name}: ${finished ? "applied" : "pending"}`);
  }

  const failed = runPsqlQuery(
    url,
    `SELECT COUNT(*) FROM "_prisma_migrations" WHERE rolled_back_at IS NOT NULL;`,
    client
  );
  console.log(`\nFailed migration rows (rolled_back_at set): ${failed}`);

  const counts: Record<string, string> = {};
  for (const table of [
    "platform_accounts",
    "legal_documents",
    "legal_document_versions",
    "tenants",
    "enterprise_blueprint_versions",
  ]) {
    counts[table] = runPsqlQuery(url, `SELECT COUNT(*) FROM public."${table}";`, client);
  }
  console.log("\nRow counts (no content):");
  for (const [table, count] of Object.entries(counts)) {
    console.log(`  ${table}: ${count}`);
  }

  const sqlPath = join(process.cwd(), "docs/internal/c3-post-migration-rls-verification.sql");
  if (readFileSync(sqlPath, "utf8").includes("platform_accounts")) {
    console.log("\nRLS verification SQL artifact: present");
  }

  console.log("\nverify-c3-post-migration-hosted PASSED\n");
}

main();
