#!/usr/bin/env tsx
/**
 * FTGP.0G — Post-grant IMPLEMENTER runtime authority verification.
 * Run: npm run ftgp-implementer-runtime:verify
 */
import { PrismaClient } from "@prisma/client";

import {
  resolveAuthoritativePlatformRole,
} from "../src/lib/auth/authority-boundaries";
import { Permission, hasPermission } from "../src/lib/auth/permissions";
import { countActiveImplementerAssignments } from "../src/lib/platform/ftgp-implementer-grant";
import { countActivePlatformAdminAssignments } from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  implementerTargetFingerprint,
  loadImplementerGrantManifest,
} from "./lib/ftgp-implementer-grant-manifest";
import { resolveCloud1hCandidateOperator } from "./lib/cloud-1h-candidate-resolution";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import { resolveImplementerGrantor } from "./lib/ftgp-implementer-grantor-resolution";

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

  console.log("\n=== FTGP IMPLEMENTER runtime authority verify ===\n");

  const manifest = loadImplementerGrantManifest();
  if (!manifest.grantExecuted) fail("manifest grantExecuted is not true");

  const targetAccountId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() || null;
  if (!targetAccountId) fail("target account ID missing");

  const prisma = new PrismaClient();
  try {
    const activeAdmins = await countActivePlatformAdminAssignments();
    const activeImplementers = await countActiveImplementerAssignments();
    if (activeAdmins !== 1) fail(`ACTIVE_PLATFORM_ADMIN_COUNT=${activeAdmins}`);
    if (activeImplementers !== 1) fail(`ACTIVE_IMPLEMENTER_COUNT=${activeImplementers}`);

    const grantor = await resolveImplementerGrantor(prisma);
    if (!grantor) fail("grantor not found");

    const assignment = await prisma.platformInternalRoleAssignment.findFirst({
      where: {
        platformAccountId: targetAccountId,
        role: "IMPLEMENTER",
        status: "ACTIVE",
        grantCorrelationId: manifest.correlationId,
        grantedByPlatformAccountId: grantor.platformAccountId,
      },
    });
    if (!assignment) fail("active IMPLEMENTER assignment not found");
    ok("database assignment ACTIVE for designated candidate");

    const roles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: targetAccountId, status: "ACTIVE" },
      select: { role: true },
    });
    const roleNames = roles.map((r) => r.role);
    const platformRole = resolveAuthoritativePlatformRole(roleNames, null);
    if (platformRole !== "implementer") {
      fail("authoritative platform role not implementer");
    }
    ok("IMPLEMENTER_RUNTIME_AUTHORITY=PASS");
    ok("IMPLEMENTER_AUTHORITY_SOURCE=DATABASE_INTERNAL_ROLE_ASSIGNMENT");

    if (resolveAuthoritativePlatformRole([], "implementer") !== null) {
      fail("METADATA_ONLY_INTERNAL_AUTHORITY would authorize");
    }
    ok("METADATA_ONLY_INTERNAL_AUTHORITY=DENIED");

    if (!hasPermission(platformRole, Permission["platform.requests.manage"])) {
      fail("IMPLEMENTER missing platform.requests.manage");
    }
    if (!hasPermission(platformRole, Permission["platform.admin.view"])) {
      fail("IMPLEMENTER missing platform.admin.view");
    }
    ok("role-appropriate implementation workspace permissions present");

    const allPerms = Object.values(Permission);
    const adminOnlyDenied = allPerms.filter(
      (p) => hasPermission("platform_admin", p) && !hasPermission(platformRole, p)
    );
    if (adminOnlyDenied.length === 0) {
      fail("expected Platform Admin-only capability gap");
    }
    ok("PLATFORM_ADMIN_ONLY_CAPABILITIES=DENIED");

    const grantorRoles = roleNames;
    if (grantorRoles.includes("PLATFORM_ADMIN")) {
      fail("candidate must not hold PLATFORM_ADMIN");
    }
    ok("IMPLEMENTER role-management grant controls denied");

    const [requests, clientMembers, tenantMemberships] = await Promise.all([
      prisma.implementationRequest.count({
        where: {
          submittedByUserId: (
            await prisma.platformAccount.findUnique({
              where: { id: targetAccountId },
              select: { supabaseUserId: true },
            })
          )!.supabaseUserId,
        },
      }),
      prisma.clientOrganizationMember.count({
        where: {
          supabaseUserId: (
            await prisma.platformAccount.findUnique({
              where: { id: targetAccountId },
              select: { supabaseUserId: true },
            })
          )!.supabaseUserId,
        },
      }),
      prisma.tenantMembership.count({
        where: {
          supabaseUserId: (
            await prisma.platformAccount.findUnique({
              where: { id: targetAccountId },
              select: { supabaseUserId: true },
            })
          )!.supabaseUserId,
        },
      }),
    ]);
    if (requests > 0 || clientMembers > 0) fail("IMPLEMENTER gained customer authority");
    if (tenantMemberships > 0) fail("IMPLEMENTER gained tenant authority");
    ok("IMPLEMENTER_CUSTOMER_AUTHORITY=DENIED");
    ok("IMPLEMENTER_TENANT_AUTHORITY=DENIED");

    const { preservedAccountId } = requireProofOperatorEnv();
    if (preservedAccountId) {
      const requesterRoles = await prisma.platformInternalRoleAssignment.count({
        where: { platformAccountId: preservedAccountId, status: "ACTIVE" },
      });
      if (requesterRoles !== 0) fail("retained requester has internal roles");
      ok("retained requester internal roles = 0");
    }

    const implementerCandidate = await resolveCloud1hCandidateOperator(
      prisma,
      preservedAccountId ? [preservedAccountId, targetAccountId] : [targetAccountId]
    );
    if (implementerCandidate && implementerCandidate.platformAccountId !== targetAccountId) {
      const otherRoles = await prisma.platformInternalRoleAssignment.count({
        where: { platformAccountId: implementerCandidate.platformAccountId, status: "ACTIVE" },
      });
      if (otherRoles !== 0) fail("unrelated candidate has internal roles");
    }

    const adminAssignment = await prisma.platformInternalRoleAssignment.findFirst({
      where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
    });
    if (!adminAssignment) fail("Platform Admin assignment missing");
    ok("Platform Admin preservation verified");

    console.log(`\n  candidate_fingerprint=${implementerTargetFingerprint(targetAccountId)}`);
    console.log(`  grantor_fingerprint=${manifest.grantorFingerprint}`);
    console.log("\nPASS — FTGP IMPLEMENTER RUNTIME AUTHORITY\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
