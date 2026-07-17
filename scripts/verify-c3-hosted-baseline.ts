#!/usr/bin/env tsx
/**
 * C3.9C — read-only hosted migration inventory + C3.5 schema verification.
 */
import { PrismaClient } from "@prisma/client";

import { maskDatabaseTarget } from "./lib/database-fingerprint";

const C3_5 = [
  "20260614140000_c3_account_registration",
  "20260614150000_c3_legal_agreement",
  "20260614160000_c3_public_schema_access_hardening",
] as const;

const C3_TABLES = [
  "platform_accounts",
  "platform_account_profiles",
  "email_verification_challenges",
  "legal_documents",
  "legal_document_versions",
  "account_legal_acceptances",
  "platform_account_audit_events",
  "account_consent_preferences",
] as const;

async function main() {
  const direct = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();
  if (!direct) {
    console.error("DIRECT_URL required");
    process.exit(1);
  }

  console.log("\n=== Hosted migration inventory ===\n");
  console.log(`  target: ${maskDatabaseTarget(direct)}\n`);

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRaw<
      {
        migration_name: string;
        finished_at: Date | null;
        rolled_back_at: Date | null;
        checksum: string | null;
        started_at: Date | null;
      }[]
    >`
      SELECT migration_name, started_at, finished_at, rolled_back_at, checksum
      FROM "_prisma_migrations"
      ORDER BY migration_name ASC
    `;

    console.log(`Hosted migration rows: ${rows.length}`);
    for (const row of rows) {
      const status = row.rolled_back_at
        ? "rolled_back"
        : row.finished_at
          ? "applied"
          : "in_progress_or_failed";
      console.log(
        `  ${row.migration_name} | ${status} | finished=${row.finished_at?.toISOString() ?? "null"} | rolled_back=${row.rolled_back_at?.toISOString() ?? "null"}`
      );
    }

    const activeFailed = rows.filter((r) => !r.finished_at && !r.rolled_back_at);
    console.log(`\nActive failed/in-progress rows: ${activeFailed.length}`);
    for (const row of activeFailed) {
      console.log(`  ! ${row.migration_name}`);
    }

    console.log("\nC3.5 applied evidence:");
    for (const name of C3_5) {
      const row = rows.find((r) => r.migration_name === name);
      const ok = Boolean(row?.finished_at && !row.rolled_back_at);
      console.log(`  ${ok ? "✓" : "✗"} ${name}`);
    }

    const rolledBack = rows.filter((r) => r.rolled_back_at);
    console.log(`\nRolled-back historical rows: ${rolledBack.length}`);

    console.log("\n=== C3 hosted schema verification ===\n");

    for (const table of C3_TABLES) {
      const exists = await prisma.$queryRaw<{ reg: string | null }[]>`
        SELECT to_regclass(${`public.${table}`})::text AS reg
      `;
      console.log(`  ${exists[0]?.reg ? "✓" : "✗"} table ${table}`);
    }

    const rls = await prisma.$queryRaw<{ tablename: string; rowsecurity: boolean }[]>`
      SELECT c.relname AS tablename, c.relrowsecurity AS rowsecurity
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = ANY(${C3_TABLES as unknown as string[]})
      ORDER BY c.relname
    `;
    const rlsOff = rls.filter((r) => !r.rowsecurity);
    console.log(`\nRLS enabled on C3 tables: ${rls.length - rlsOff.length}/${C3_TABLES.length}`);
    if (rlsOff.length) {
      for (const t of rlsOff) console.log(`  ✗ RLS off: ${t.tablename}`);
    }

    const grants = await prisma.$queryRaw<{ table_name: string; grantee: string; priv: string }[]>`
      SELECT table_name, grantee, privilege_type AS priv
      FROM information_schema.table_privileges
      WHERE table_schema = 'public'
        AND table_name = ANY(${C3_TABLES as unknown as string[]})
        AND grantee IN ('anon', 'authenticated')
      ORDER BY table_name, grantee
    `;
    console.log(`\nDirect anon/authenticated grants on C3 tables: ${grants.length}`);
    if (grants.length > 0) {
      for (const g of grants.slice(0, 10)) {
        console.log(`  ! ${g.table_name} ${g.grantee} ${g.priv}`);
      }
    } else {
      console.log("  ✓ none");
    }

    const legalDocs = await prisma.$queryRaw<{ slug: string; version_count: bigint }[]>`
      SELECT d."documentType"::text AS slug, COUNT(v.id)::bigint AS version_count
      FROM legal_documents d
      LEFT JOIN legal_document_versions v ON v."legalDocumentId" = d.id AND v."publishedAt" IS NOT NULL
      GROUP BY d."documentType"
      ORDER BY d."documentType"
    `;
    console.log("\nLegal documents (published version counts):");
    for (const row of legalDocs) {
      console.log(`  ${row.slug}: ${row.version_count}`);
    }

    const tenantCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM tenants
    `;
    const platformCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_accounts
    `;

    console.log(`\nTenant count: ${tenantCount[0]?.count ?? 0}`);
    console.log(`PlatformAccount count: ${platformCount[0]?.count ?? 0}`);

    process.exit(activeFailed.length > 0 ? 2 : 0);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
