/**
 * Verify C3 tables exist on disposable local database after migrate.
 */
import { PrismaClient } from "@prisma/client";
import { assertDisposableLocalDatabase, classifyDisposableLocalDatabase } from "./lib/local-database-safety";

async function main() {
  const proof = classifyDisposableLocalDatabase(process.env.DATABASE_URL);
  assertDisposableLocalDatabase(process.env.DATABASE_URL);

  const prisma = new PrismaClient();
  const checks: { label: string; ok: boolean }[] = [];

  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    const names = new Set(tables.map((t) => t.tablename));

    const required = [
      "platform_accounts",
      "email_verification_challenges",
      "legal_documents",
      "legal_document_versions",
      "account_legal_acceptances",
      "enterprise_blueprints",
      "client_organization_request_links",
      "tenant_memberships",
      "_prisma_migrations",
    ];

    for (const table of required) {
      checks.push({ label: `table ${table}`, ok: names.has(table) });
    }

    const migrations = await prisma.$queryRaw<{ migration_name: string }[]>`
      SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL ORDER BY finished_at
    `;
    const migrationNames = migrations.map((m) => m.migration_name);
    for (const name of [
      "20260614140000_c3_account_registration",
      "20260614150000_c3_legal_agreement",
    ]) {
      checks.push({ label: `migration ${name}`, ok: migrationNames.includes(name) });
    }

    const blueprintCols = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'enterprise_blueprints'
    `;
    checks.push({
      label: "enterprise_blueprints.tenantId column",
      ok: blueprintCols.some((c) => c.column_name === "tenantId"),
    });
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=== C3 disposable database schema proof ===\n");
  console.log(`  Target: ${proof.maskedTarget}`);
  let passed = true;
  for (const c of checks) {
    console.log(`  ${c.ok ? "✓" : "✗"} ${c.label}`);
    if (!c.ok) passed = false;
  }
  console.log(passed ? "\nschema proof PASSED\n" : "\nschema proof FAILED\n");
  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
