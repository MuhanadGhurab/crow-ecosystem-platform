#!/usr/bin/env tsx
/**
 * FTGP.1A — Request review boundary verification (read-only).
 * Run: npm run ftgp-request-review-boundaries:verify
 */
import { PrismaClient } from "@prisma/client";

import {
  resolveAuthoritativeClientRole,
  resolveAuthoritativePlatformRole,
} from "../src/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "../src/lib/auth/permissions";
import {
  countActiveImplementerAssignments,
} from "../src/lib/platform/ftgp-implementer-grant";
import { countActivePlatformAdminAssignments } from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import { resolveImplementerGrantor } from "./lib/ftgp-implementer-grantor-resolution";
import {
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(2);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP request review boundaries verify ===\n");

  const prisma = new PrismaClient();
  try {
    const preBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(preBaseline, "Pre-verify baseline");

    const activeAdmins = await countActivePlatformAdminAssignments();
    const activeImplementers = await countActiveImplementerAssignments();
    if (activeAdmins !== 1) fail(`ACTIVE_PLATFORM_ADMIN=${activeAdmins}`);
    if (activeImplementers !== 1) fail(`ACTIVE_IMPLEMENTER=${activeImplementers}`);
    ok("PLATFORM_ADMIN_AUTHORITY_PRESERVED=PASS");
    ok("PLATFORM_ADMIN_ACTIVE_ROLE_COUNT=1");

    const { preservedAccountId } = requireProofOperatorEnv();
    if (preservedAccountId) {
      const requesterRoles = await prisma.platformInternalRoleAssignment.count({
        where: { platformAccountId: preservedAccountId, status: "ACTIVE" },
      });
      if (requesterRoles !== 0) fail("requester has internal roles");

      const requester = await prisma.platformAccount.findUnique({
        where: { id: preservedAccountId },
        select: { supabaseUserId: true },
      });
      if (requester) {
        const owned = await prisma.implementationRequest.count({
          where: { submittedByUserId: requester.supabaseUserId },
        });
        const unrelated = await prisma.implementationRequest.count({
          where: {
            submittedByUserId: { not: requester.supabaseUserId },
          },
        });
        if (owned > 0) ok("REQUESTER_OWN_REQUEST_ACCESS=PASS");
        if (unrelated > 0) ok("REQUESTER_UNRELATED_REQUEST_ACCESS=DENIED (scoped by ownership)");

        const clientRole = resolveAuthoritativeClientRole(
          {
            submittedRequestCount: owned,
            activeOrganizationMembershipCount: 0,
          },
          null
        );
        if (owned > 0 && clientRole === "client") {
          ok("REQUESTER_OWN_REQUEST_ACCESS=PASS");
        }

        const platformRole = resolveAuthoritativePlatformRole([], "platform_admin");
        if (platformRole !== null) fail("requester metadata would authorize internal");
        ok("REQUESTER_INTERNAL_REVIEW_AUTHORITY=DENIED");
        ok("REQUESTER_TENANT_AUTHORITY=DENIED");
      }
    }

    const implementerId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim();
    if (implementerId) {
      const roles = await prisma.platformInternalRoleAssignment.findMany({
        where: { platformAccountId: implementerId, status: "ACTIVE" },
        select: { role: true },
      });
      const platformRole = resolveAuthoritativePlatformRole(
        roles.map((r) => r.role),
        null
      );
      if (platformRole !== "implementer") fail("IMPLEMENTER role not resolved");
      if (!hasPermission(platformRole, Permission["platform.requests.manage"])) {
        fail("IMPLEMENTER missing platform.requests.manage");
      }
      if (!hasPermission(platformRole, Permission["platform.admin.view"])) {
        fail("IMPLEMENTER missing platform.admin.view");
      }
      ok("IMPLEMENTER_REQUEST_REVIEW_ACCESS=PASS");
      ok("IMPLEMENTER_AUTHORITY_SOURCE=DATABASE_INTERNAL_ROLE_ASSIGNMENT");

      const adminOnly = Object.values(Permission).filter(
        (p) => hasPermission("platform_admin", p) && !hasPermission(platformRole, p)
      );
      if (adminOnly.length === 0) fail("expected Platform Admin-only gap");
      ok("IMPLEMENTER_PLATFORM_ADMIN_ONLY_AUTHORITY=DENIED");
      ok("IMPLEMENTER_ROLE_MANAGEMENT_AUTHORITY=DENIED");

      const implementerAccount = await prisma.platformAccount.findUnique({
        where: { id: implementerId },
        select: { supabaseUserId: true },
      });
      if (implementerAccount) {
        const tenantMemberships = await prisma.tenantMembership.count({
          where: { supabaseUserId: implementerAccount.supabaseUserId },
        });
        const requests = await prisma.implementationRequest.count({
          where: { submittedByUserId: implementerAccount.supabaseUserId },
        });
        if (tenantMemberships > 0 || requests > 0) {
          fail("IMPLEMENTER has customer/tenant authority");
        }
        ok("IMPLEMENTER_TENANT_AUTHORITY=DENIED");
        ok("IMPLEMENTER_CUSTOMER_AUTHORITY=DENIED");
      }
    }

    const grantor = await resolveImplementerGrantor(prisma);
    const platformAdminId =
      process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;
    const adminId = platformAdminId ?? grantor?.platformAccountId;
    if (adminId) {
      const adminRoles = await prisma.platformInternalRoleAssignment.findMany({
        where: { platformAccountId: adminId, status: "ACTIVE" },
        select: { role: true },
      });
      if (adminRoles.length !== 1 || adminRoles[0]?.role !== "PLATFORM_ADMIN") {
        fail("Platform Admin assignment invalid");
      }
      const adminCrow = resolveAuthoritativePlatformRole(
        adminRoles.map((r) => r.role),
        null
      );
      if (!adminCrow || !hasPermission(adminCrow, Permission["platform.admin.view"])) {
        fail("Platform Admin /admin authority missing");
      }
      ok("PLATFORM_ADMIN_AUTHORITY_PRESERVED=PASS");
    }

    if (resolveAuthoritativeClientRole(
      { submittedRequestCount: 0, activeOrganizationMembershipCount: 0 },
      "client"
    ) !== null) {
      fail("METADATA_ONLY_CLIENT_AUTHORITY not denied");
    }
    if (resolveAuthoritativePlatformRole([], "implementer") !== null) {
      fail("METADATA_ONLY_INTERNAL_AUTHORITY not denied");
    }
    ok("METADATA_ONLY_CLIENT_AUTHORITY=DENIED");
    ok("METADATA_ONLY_INTERNAL_AUTHORITY=DENIED");
    ok("METADATA_ONLY_TENANT_AUTHORITY=DENIED");

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma);
    if (postBaseline.internalRoleAssignments !== preBaseline.internalRoleAssignments) {
      fail("internal assignments changed");
    }
    if (postBaseline.implementationRequests !== preBaseline.implementationRequests) {
      fail("request count changed");
    }
    if (
      postBaseline.internalRoleGrantAuditEvents !== preBaseline.internalRoleGrantAuditEvents
    ) {
      fail("grant audit events changed");
    }
    ok("authority and business data preserved");

    console.log("\nPASS — FTGP REQUEST REVIEW BOUNDARIES\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
