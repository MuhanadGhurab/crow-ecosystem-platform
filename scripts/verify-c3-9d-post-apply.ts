#!/usr/bin/env tsx
/** C3.9D — read-only post-apply verification after dual-channel migration. */
import { PrismaClient } from "@prisma/client";

import { maskDatabaseTarget } from "./lib/database-fingerprint";

const C3_8 = "20260618140000_c3_dual_channel_onboarding";
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

  console.log("\n=== C3.9D post-apply verification ===\n");
  console.log(`  target: ${maskDatabaseTarget(direct)}\n`);

  const prisma = new PrismaClient();
  let failed = false;
  const pass = (msg: string) => console.log(`  ✓ ${msg}`);
  const fail = (msg: string) => {
    console.error(`  ✗ ${msg}`);
    failed = true;
  };

  try {
    const c38 = await prisma.$queryRaw<
      { migration_name: string; finished_at: Date | null; rolled_back_at: Date | null }[]
    >`
      SELECT migration_name, finished_at, rolled_back_at
      FROM "_prisma_migrations"
      WHERE migration_name = ${C3_8}
      ORDER BY finished_at DESC NULLS LAST
      LIMIT 1
    `;
    const row = c38[0];
    if (row?.finished_at && !row.rolled_back_at) {
      pass(`${C3_8} finished at ${row.finished_at.toISOString()}`);
    } else {
      fail(`${C3_8} not marked finished`);
    }

    const activeFailed = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;
    const failedCount = Number(activeFailed[0]?.count ?? 0);
    if (failedCount === 0) pass("active failed migrations: 0");
    else fail(`active failed migrations: ${failedCount}`);

    const pending = await prisma.$queryRaw<{ migration_name: string }[]>`
      SELECT migration_name FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;
    if (pending.length === 0) pass("pending migrations: 0");
    else fail(`pending migrations: ${pending.map((p) => p.migration_name).join(", ")}`);

    const rolledBack = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations" WHERE rolled_back_at IS NOT NULL
    `;
    console.log(`  rolled-back historical rows: ${rolledBack[0]?.count ?? 0}`);

    const tenants = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM tenants
    `;
    const accounts = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_accounts
    `;
    const tenantCount = Number(tenants[0]?.count ?? 0);
    const accountCount = Number(accounts[0]?.count ?? 0);
    console.log(`  tenants: ${tenantCount}`);
    console.log(`  platform_accounts: ${accountCount}`);
    if (tenantCount !== 2) fail(`tenant count expected 2, got ${tenantCount}`);
    else pass("tenant count unchanged (2)");
    if (accountCount !== 7) fail(`platform account count expected 7, got ${accountCount}`);
    else pass("platform account count unchanged (7)");

    const genStats = await prisma.$queryRaw<
      { status: string; onboardingGeneration: number; count: bigint }[]
    >`
      SELECT status::text, "onboardingGeneration", COUNT(*)::bigint AS count
      FROM platform_accounts
      GROUP BY status, "onboardingGeneration"
      ORDER BY status, "onboardingGeneration"
    `;
    console.log("\n  PlatformAccount generation aggregates:");
    for (const g of genStats) {
      console.log(`    ${g.status} gen=${g.onboardingGeneration}: ${g.count}`);
    }

    const activeNotGen1 = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_accounts
      WHERE status = 'ACTIVE' AND "onboardingGeneration" <> 1
    `;
    if (Number(activeNotGen1[0]?.count ?? 0) === 0) {
      pass("all ACTIVE accounts remain generation 1");
    } else {
      fail("ACTIVE accounts found with generation != 1");
    }

    const fabricatedEmail = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_accounts
      WHERE "emailVerifiedAt" IS NOT NULL
        AND ("emailVerificationSource" IS NULL OR "emailVerificationSource" = '')
    `;
    if (Number(fabricatedEmail[0]?.count ?? 0) === 0) pass("no fabricated email verification timestamps");
    else fail("email verification timestamps without source");

    const phoneEvidence = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_accounts
      WHERE "phoneVerifiedAt" IS NOT NULL OR "phoneNormalized" IS NOT NULL
    `;
    if (Number(phoneEvidence[0]?.count ?? 0) === 0) pass("no phone evidence added to existing accounts");
    else fail("unexpected phone fields populated");

    const providerIds = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_provider_identities
    `;
    if (Number(providerIds[0]?.count ?? 0) === 0) pass("no provider identities created");
    else fail(`unexpected provider identities: ${providerIds[0]?.count}`);

    const phoneChallenges = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM phone_verification_challenges
    `;
    if (Number(phoneChallenges[0]?.count ?? 0) === 0) pass("no phone verification challenges created");
    else fail(`unexpected phone challenges: ${phoneChallenges[0]?.count}`);

    const statusChanges = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_accounts
      WHERE status::text NOT IN (
        'ACTIVE', 'PENDING_EMAIL_VERIFICATION', 'PENDING_LEGAL_ACCEPTANCE', 'PENDING_PHONE_VERIFICATION', 'SUSPENDED'
      )
    `;
    if (Number(statusChanges[0]?.count ?? 0) === 0) pass("no unexpected account statuses");
    else fail("unexpected account status values");

    const memberships = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM tenant_memberships
    `;
    console.log(`  tenant_memberships total: ${memberships[0]?.count ?? 0} (baseline unchanged expected)`);

    console.log("\n  Original C3 tables:");
    for (const table of C3_TABLES) {
      const exists = await prisma.$queryRaw<{ reg: string | null }[]>`
        SELECT to_regclass(${`public.${table}`})::text AS reg
      `;
      if (!exists[0]?.reg) {
        fail(`missing ${table}`);
        continue;
      }
      const rls = await prisma.$queryRaw<{ rowsecurity: boolean }[]>`
        SELECT c.relrowsecurity AS rowsecurity FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relname = ${table}
      `;
      const grants = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count FROM information_schema.table_privileges
        WHERE table_schema = 'public' AND table_name = ${table}
          AND grantee IN ('anon', 'authenticated')
      `;
      if (rls[0]?.rowsecurity && Number(grants[0]?.count ?? 0) === 0) {
        pass(`${table} present, RLS, no anon/auth grants`);
      } else {
        fail(`${table} RLS/grant regression`);
      }
    }

    const legal = await prisma.$queryRaw<{ documentType: string; published: bigint }[]>`
      SELECT d."documentType"::text AS "documentType", COUNT(v.id)::bigint AS published
      FROM legal_documents d
      LEFT JOIN legal_document_versions v ON v."legalDocumentId" = d.id AND v."publishedAt" IS NOT NULL
      GROUP BY d."documentType"
      ORDER BY d."documentType"
    `;
    console.log("\n  Legal published versions:");
    for (const doc of legal) {
      console.log(`    ${doc.documentType}: ${doc.published}`);
      if (Number(doc.published) !== 1) fail(`${doc.documentType} published count != 1`);
    }

    const serverProbe = await prisma.$queryRaw<{ one: number }[]>`SELECT 1 AS one`;
    if (serverProbe[0]?.one === 1) pass("server-side Prisma read access OK");
    else fail("server-side Prisma read failed");
  } finally {
    await prisma.$disconnect();
  }

  console.log(failed ? "\nPOST-APPLY: FAILED\n" : "\nPOST-APPLY: PASSED\n");
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
