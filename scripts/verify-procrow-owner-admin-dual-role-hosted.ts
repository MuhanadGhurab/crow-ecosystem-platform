#!/usr/bin/env tsx
/**
 * PROCROW.ADMIN.2A — Hosted dual-role authority snapshot (read-only).
 */
import { PrismaClient } from "@prisma/client";

import { includesActiveInternalRole } from "../src/lib/auth/authority-boundaries";
import { procrowOwnerAdminTargetFingerprint } from "../src/lib/platform/procrow-owner-admin-transfer.constants";
import { findActivePlatformAdminAssignment } from "../src/lib/platform/procrow-owner-admin-transfer.service";
import { targetFingerprintFromAccountId } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { PROCROW_OWNER_ADMIN_OPERATOR_ENV } from "./lib/procrow-owner-admin-operator";

const EXPECTED_OWNER_FINGERPRINT = "832287cbd374fb83";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(2);
}

async function main() {
  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator", ".env.platform-bootstrap.operator", PROCROW_OWNER_ADMIN_OPERATOR_ENV],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });
  assertHostedVerificationTarget();

  console.log("\n=== PROCROW owner dual-role hosted verify ===\n");

  const prisma = new PrismaClient();
  try {
    const [total, active, revoked] = await Promise.all([
      prisma.platformInternalRoleAssignment.count(),
      prisma.platformInternalRoleAssignment.count({ where: { status: "ACTIVE" } }),
      prisma.platformInternalRoleAssignment.count({ where: { status: "REVOKED" } }),
    ]);
    console.log(`  total_assignments=${total}`);
    console.log(`  active_assignments=${active}`);
    console.log(`  revoked_assignments=${revoked}`);

    const activeAdmin = await findActivePlatformAdminAssignment();
    if (!activeAdmin) fail("ACTIVE_PLATFORM_ADMIN_COUNT!=1");
    if (activeAdmin.fingerprint !== EXPECTED_OWNER_FINGERPRINT) {
      fail(`owner fingerprint mismatch (expected ${EXPECTED_OWNER_FINGERPRINT})`);
    }
    ok(`ACTIVE_PLATFORM_ADMIN_FINGERPRINT=${activeAdmin.fingerprint}`);

    const implementer = await prisma.platformInternalRoleAssignment.findFirst({
      where: { role: "IMPLEMENTER", status: "ACTIVE" },
      select: { platformAccountId: true },
    });
    if (!implementer) fail("ACTIVE_IMPLEMENTER missing");
    const implFingerprint = procrowOwnerAdminTargetFingerprint(implementer.platformAccountId);
    ok(`ACTIVE_IMPLEMENTER_FINGERPRINT=${implFingerprint}`);

    const dualMatch = implementer.platformAccountId === activeAdmin.platformAccountId;
    if (!dualMatch) fail("PROCROW_OWNER_DUAL_ROLE_ACCOUNT_MATCH=false");
    ok("PROCROW_OWNER_DUAL_ROLE_ACCOUNT_MATCH=true");

    const roles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: activeAdmin.platformAccountId, status: "ACTIVE" },
      select: { role: true },
    });
    const roleNames = roles.map((r) => r.role);
    if (!includesActiveInternalRole(roleNames, "PLATFORM_ADMIN")) {
      fail("PLATFORM_ADMIN_ASSIGNMENT_ACTIVE=false");
    }
    if (!includesActiveInternalRole(roleNames, "IMPLEMENTER")) {
      fail("IMPLEMENTER_ASSIGNMENT_ACTIVE=false");
    }
    ok("PLATFORM_ADMIN_ASSIGNMENT_ACTIVE=true");
    ok("IMPLEMENTER_ASSIGNMENT_ACTIVE=true");

    const previousId = process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim();
    if (previousId) {
      const formerActive = await prisma.platformInternalRoleAssignment.count({
        where: {
          platformAccountId: previousId,
          role: "PLATFORM_ADMIN",
          status: "ACTIVE",
        },
      });
      if (formerActive !== 0) fail("FORMER_PLATFORM_ADMIN_ASSIGNMENT_REVOKED=false");
      const formerAccount = await prisma.platformAccount.findUnique({
        where: { id: previousId },
        select: { id: true },
      });
      if (!formerAccount) fail("former bootstrap account missing");
      const formerFtgpFingerprint = targetFingerprintFromAccountId(previousId);
      const formerProcrowFingerprint = procrowOwnerAdminTargetFingerprint(previousId);
      console.log(`  former_bootstrap_ftgp_fingerprint=${formerFtgpFingerprint}`);
      console.log(`  former_bootstrap_procrow_fingerprint=${formerProcrowFingerprint}`);
      ok("FORMER_PLATFORM_ADMIN_ASSIGNMENT_REVOKED=true");
      ok("FORMER_BOOTSTRAP_ACCOUNT_PRESERVED=true");
    }

    console.log("\nPROCROW_OWNER_DUAL_ROLE_HOSTED_VERIFY=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
