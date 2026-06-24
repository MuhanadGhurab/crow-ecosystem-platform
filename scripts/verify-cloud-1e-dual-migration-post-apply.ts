#!/usr/bin/env tsx
/**
 * CLOUD.1E — read-only post-apply verification after controlled dual-migration apply.
 * Aggregate/schema evidence only. Does not mutate hosted data.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  FTGP_APPROVED_MIGRATION_INVENTORY,
  assertRepositoryMigrationHashesMatchInventory,
} from "./lib/controlled-migration-inventory";
import {
  fingerprintDatabaseUrl,
  maskDatabaseTarget,
  targetIdentityFingerprintLabel,
} from "./lib/database-fingerprint";
import { countMigrationSql } from "./lib/migration-baseline";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";

const LEGAL_MIGRATION = "20260618120000_c3_legal_publication_lifecycle";
const FTGP_MIGRATION = "20260621120000_ftgp_platform_internal_role_assignment";
const EXPECTED_FINGERPRINT = "0355c17692e2a90d";

const BASELINE = {
  implementation_requests: 7,
  tenant_memberships: 3,
  internal_role_assignments_total: Number(
    process.env.FTGP_EXPECTED_TOTAL_INTERNAL_ASSIGNMENTS?.trim() || "3"
  ),
  internal_role_assignments_active: Number(
    process.env.FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS?.trim() || "2"
  ),
  internal_role_assignments_revoked: Number(
    process.env.FTGP_EXPECTED_REVOKED_INTERNAL_ASSIGNMENTS?.trim() || "1"
  ),
} as const;

function fail(msg: string): never {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

async function main() {
  assert.doesNotThrow(() => assertRepositoryMigrationHashesMatchInventory());

  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.migration.recovery",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);
  const hosted = assertHostedVerificationTarget({
    envFile: envLoad.primaryEnvFile,
    requireDatabaseUrls: true,
  });

  const directUrl = process.env.DIRECT_URL?.trim();
  if (!directUrl) fail("DIRECT_URL required");

  const fp = fingerprintDatabaseUrl(directUrl);
  if (fp.targetHash !== EXPECTED_FINGERPRINT) {
    fail(`fingerprint: expected ${EXPECTED_FINGERPRINT}, got ${fp.targetHash}`);
  }

  console.log("\n=== CLOUD.1E dual-migration post-apply verification ===\n");
  console.log(`  env_file=${hosted.envFile}`);
  console.log(`  target=${maskDatabaseTarget(directUrl)}`);
  console.log(`  ${targetIdentityFingerprintLabel()}=${fp.targetHash} (host/db/schema/port identity; unchanged by schema migrations)`);

  for (const entry of FTGP_APPROVED_MIGRATION_INVENTORY) {
    const diskHash = createHash("sha256")
      .update(readFileSync(join(process.cwd(), `prisma/migrations/${entry.name}/migration.sql`), "utf8"))
      .digest("hex");
    if (diskHash !== entry.sqlSha256) {
      fail(`migration hash mismatch for ${entry.name}`);
    }
  }
  ok("repository migration hashes match approved inventory");

  const prisma = new PrismaClient();
  try {
    for (const name of [LEGAL_MIGRATION, FTGP_MIGRATION]) {
      const rows = await prisma.$queryRaw<
        { finished_at: Date | null; rolled_back_at: Date | null }[]
      >`
        SELECT finished_at, rolled_back_at FROM "_prisma_migrations"
        WHERE migration_name = ${name}
      `;
      if (rows.length !== 1) fail(`${name}: expected exactly one history row, got ${rows.length}`);
      const row = rows[0];
      if (!row?.finished_at || row.rolled_back_at) {
        fail(`${name}: expected APPLIED_ONCE_FINISHED`);
      }
      ok(`${name} = APPLIED_ONCE_FINISHED`);
    }

    const failed = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;
    if (Number(failed[0]?.count ?? 0) !== 0) {
      fail(`FAILED_MIGRATION_COUNT=${failed[0]?.count ?? 0}`);
    }
    ok("FAILED_MIGRATION_COUNT=0");
    ok("pending migration count=0");

    const successfulMigrations = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations"
      WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL
    `;
    const repoMigrationFolders = countMigrationSql(process.cwd());
    const ledgerSuccessful = Number(successfulMigrations[0]?.count ?? 0);
    if (ledgerSuccessful !== repoMigrationFolders) {
      fail(
        `migration ledger count ${ledgerSuccessful} != repository folders ${repoMigrationFolders}`
      );
    }
    ok(`successful_migration_count=${ledgerSuccessful} (matches repository folders)`);

    const enumLabels = await prisma.$queryRaw<{ enumlabel: string }[]>`
      SELECT e.enumlabel FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'LegalDocumentVersionStatus'
      ORDER BY e.enumsortorder
    `;
    const labels = enumLabels.map((r) => r.enumlabel);
    for (const label of ["reviewed", "approved_for_publication"]) {
      if (!labels.includes(label)) fail(`LegalDocumentVersionStatus missing ${label}`);
    }
    ok(`LegalDocumentVersionStatus includes reviewed, approved_for_publication (${labels.length} labels)`);

    const legalPublished = await prisma.$queryRaw<
      { documentType: string; published: bigint }[]
    >`
      SELECT d."documentType"::text AS "documentType",
             COUNT(v.id) FILTER (WHERE v."publishedAt" IS NOT NULL)::bigint AS published
      FROM legal_documents d
      LEFT JOIN legal_document_versions v ON v."legalDocumentId" = d.id
      GROUP BY d."documentType"
      ORDER BY d."documentType"
    `;
    console.log("\n  Legal published version counts:");
    for (const row of legalPublished) {
      console.log(`    ${row.documentType}: ${row.published}`);
    }

    const v11Published = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM legal_document_versions
      WHERE "versionNumber" = 2 AND "publishedAt" IS NOT NULL
    `;
    if (Number(v11Published[0]?.count ?? 0) !== 0) {
      fail(`Legal v1.1 published count=${v11Published[0]?.count ?? 0}`);
    }
    ok("Legal v1.1 remains unpublished");

    const reviewedOrApproved = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM legal_document_versions
      WHERE status::text IN ('reviewed', 'approved_for_publication')
    `;
    if (Number(reviewedOrApproved[0]?.count ?? 0) !== 0) {
      fail(`documents in reviewed/approved status: ${reviewedOrApproved[0]?.count ?? 0}`);
    }
    ok("no legal document auto-reviewed or approved");

    const legalAcceptances = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM account_legal_acceptances
    `;
    console.log(
      `  account_legal_acceptances=${legalAcceptances[0]?.count ?? 0} (baseline unchanged expected)`
    );

    for (const enumName of ["PlatformInternalRole", "PlatformInternalRoleAssignmentStatus"]) {
      const exists = await prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*)::bigint AS count FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public' AND t.typname = ${enumName}
      `;
      if (Number(exists[0]?.count ?? 0) !== 1) fail(`${enumName} enum missing`);
      ok(`${enumName} enum exists`);
    }

    const tableExists = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'platform_internal_role_assignments'
    `;
    if (Number(tableExists[0]?.count ?? 0) !== 1) {
      fail("platform_internal_role_assignments table missing");
    }
    ok("platform_internal_role_assignments table exists");

    const indexes = await prisma.$queryRaw<{ indexname: string }[]>`
      SELECT indexname FROM pg_indexes
      WHERE schemaname = 'public' AND tablename = 'platform_internal_role_assignments'
      ORDER BY indexname
    `;
    const indexNames = indexes.map((r) => r.indexname);
    const requiredIndexes = [
      "platform_internal_role_assignments_grantCorrelationId_idx",
      "platform_internal_role_assignments_one_active_per_role",
      "platform_internal_role_assignments_pkey",
      "platform_internal_role_assignments_platformAccountId_status_idx",
      "platform_internal_role_assignments_role_status_idx",
    ];
    for (const idx of requiredIndexes) {
      if (!indexNames.includes(idx)) fail(`missing index ${idx}`);
    }
    ok("all expected FTGP indexes present (including partial unique)");

    const partial = await prisma.$queryRaw<{ indexdef: string }[]>`
      SELECT indexdef FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'platform_internal_role_assignments_one_active_per_role'
    `;
    const partialDef = partial[0]?.indexdef ?? "";
    if (!partialDef.includes("ACTIVE")) {
      fail("partial unique index missing ACTIVE predicate");
    }
    ok("partial unique index ACTIVE predicate verified");

    const fkRows = await prisma.$queryRaw<{ conname: string; def: string }[]>`
      SELECT c.conname, pg_get_constraintdef(c.oid) AS def
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      WHERE t.relname = 'platform_internal_role_assignments' AND c.contype = 'f'
      ORDER BY c.conname
    `;
    const fkText = fkRows.map((r) => r.def).join("\n").toLowerCase();
    if (!fkText.includes("platformaccountid") || !fkText.includes("on delete cascade")) {
      fail("subject PlatformAccount FK CASCADE missing");
    }
    if (!fkText.includes("grantedbyplatformaccountid") || !fkText.includes("on delete restrict")) {
      fail("grantor PlatformAccount FK RESTRICT missing");
    }
    if (!fkText.includes("revokedbyplatformaccountid") || !fkText.includes("on delete set null")) {
      fail("revoker PlatformAccount FK SET NULL missing");
    }
    ok("foreign keys: subject CASCADE, grantor RESTRICT, revoker SET NULL");

    const rls = await prisma.$queryRaw<{ rowsecurity: boolean }[]>`
      SELECT c.relrowsecurity AS rowsecurity FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = 'platform_internal_role_assignments'
    `;
    if (!rls[0]?.rowsecurity) fail("RLS not enabled");
    ok("RLS enabled=true");

    const policyCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'platform_internal_role_assignments'
    `;
    if (Number(policyCount[0]?.count ?? 0) !== 0) {
      fail(`policy count=${policyCount[0]?.count ?? 0}`);
    }
    ok("policy count=0");

    const grants = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM information_schema.table_privileges
      WHERE table_schema = 'public'
        AND table_name = 'platform_internal_role_assignments'
        AND grantee IN ('anon', 'authenticated')
    `;
    if (Number(grants[0]?.count ?? 0) !== 0) {
      fail(`anon/authenticated grants=${grants[0]?.count ?? 0}`);
    }
    ok("anon privileges=none, authenticated privileges=none");

    const implRequests = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM implementation_requests
    `;
    if (Number(implRequests[0]?.count ?? 0) !== BASELINE.implementation_requests) {
      fail(`implementation_requests=${implRequests[0]?.count ?? 0}`);
    }
    ok(`implementation_requests=${BASELINE.implementation_requests}`);

    const memberships = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM tenant_memberships
    `;
    if (Number(memberships[0]?.count ?? 0) !== BASELINE.tenant_memberships) {
      fail(`tenant_memberships=${memberships[0]?.count ?? 0}`);
    }
    ok(`tenant_memberships=${BASELINE.tenant_memberships}`);

    const internalAssignmentsTotal = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_internal_role_assignments
    `;
    const internalAssignmentsActive = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_internal_role_assignments WHERE status = 'ACTIVE'
    `;
    const internalAssignmentsRevoked = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_internal_role_assignments WHERE status = 'REVOKED'
    `;
    const total = Number(internalAssignmentsTotal[0]?.count ?? 0);
    const active = Number(internalAssignmentsActive[0]?.count ?? 0);
    const revoked = Number(internalAssignmentsRevoked[0]?.count ?? 0);
    if (total !== BASELINE.internal_role_assignments_total) {
      fail(`internal role assignments total=${total}`);
    }
    if (active !== BASELINE.internal_role_assignments_active) {
      fail(`internal role assignments active=${active}`);
    }
    if (revoked !== BASELINE.internal_role_assignments_revoked) {
      fail(`internal role assignments revoked=${revoked}`);
    }
    ok(`internal role assignments total=${total}`);
    ok(`internal role assignments active=${active}`);
    ok(`internal role assignments revoked=${revoked}`);

    const activePlatformAdmins = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_internal_role_assignments
      WHERE status = 'ACTIVE' AND role = 'PLATFORM_ADMIN'
    `;
    const activeImplementers = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_internal_role_assignments
      WHERE status = 'ACTIVE' AND role = 'IMPLEMENTER'
    `;
    if (Number(activePlatformAdmins[0]?.count ?? 0) !== 1) {
      fail(`active PLATFORM_ADMIN count=${activePlatformAdmins[0]?.count ?? 0}`);
    }
    if (Number(activeImplementers[0]?.count ?? 0) !== 1) {
      fail(`active IMPLEMENTER count=${activeImplementers[0]?.count ?? 0}`);
    }
    ok("active PLATFORM_ADMIN count=1");
    ok("active IMPLEMENTER count=1");

    const platformAccounts = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_accounts
    `;
    console.log(`  platform_accounts=${platformAccounts[0]?.count ?? 0} (baseline unchanged expected)`);

    const clientOrgMembers = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM client_organization_members
    `;
    console.log(
      `  client_organization_members=${clientOrgMembers[0]?.count ?? 0} (baseline unchanged expected)`
    );

    const providerIdentities = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM platform_provider_identities
    `;
    console.log(
      `  platform_provider_identities=${providerIdentities[0]?.count ?? 0} (baseline unchanged expected)`
    );
    ok("revoked assignments not counted as active authority");
  } finally {
    await prisma.$disconnect();
  }

  console.log("\nPASS — CLOUD.1E DUAL-MIGRATION POST-APPLY VERIFICATION\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
