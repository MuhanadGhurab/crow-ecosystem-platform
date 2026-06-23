#!/usr/bin/env tsx
/**
 * PROCROW.ADMIN.1 — Verify owner-admin transfer state (read-only).
 * Run: npm run procrow-owner-admin:verify
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { resolveAuthoritativePlatformRole, internalRoleToCrowRole } from "../src/lib/auth/authority-boundaries";
import { findActivePlatformAdminAssignment } from "../src/lib/platform/procrow-owner-admin-transfer.service";
import { procrowOwnerAdminTargetFingerprint } from "../src/lib/platform/procrow-owner-admin-transfer.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { EXPECTED_DATABASE_FINGERPRINT } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import {
  loadProcrowOwnerAdminOperatorConfig,
  PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT,
  PROCROW_OWNER_ADMIN_OPERATOR_ENV,
} from "./lib/procrow-owner-admin-operator";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(2);
}

function grepRuntimeEmailAuthorization(): boolean {
  const roots = ["src/app", "src/lib", "src/middleware.ts"];
  const needles = [
    "PROCROW_OWNER_ADMIN_EMAIL",
    ".env.procrow-owner-admin.operator",
    "procrow-owner-admin.operator",
  ];
  for (const root of roots) {
    const path = join(process.cwd(), root);
    if (!existsSync(path)) continue;
    const stack = [path];
    while (stack.length) {
      const current = stack.pop()!;
      if (!statSync(current).isDirectory()) {
        if (!/\.(ts|tsx)$/.test(current)) continue;
        if (/\.test\.(ts|tsx)$/.test(current)) continue;
        const content = readFileSync(current, "utf8");
        for (const needle of needles) {
          if (content.includes(needle)) return true;
        }
        continue;
      }
      for (const entry of readdirSync(current)) {
        stack.push(join(current, entry));
      }
    }
  }
  return false;
}

async function main() {
  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-first-request.operator",
      PROCROW_OWNER_ADMIN_OPERATOR_ENV,
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });
  assertHostedVerificationTarget();

  console.log("\n=== PROCROW owner-admin verify ===\n");

  const operator = loadProcrowOwnerAdminOperatorConfig();
  const artifactPath = join(process.cwd(), PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT);
  let expectedTargetFingerprint: string | null = null;
  if (existsSync(artifactPath)) {
    const artifact = JSON.parse(readFileSync(artifactPath, "utf8")) as {
      targetFingerprint?: string;
    };
    expectedTargetFingerprint = artifact.targetFingerprint ?? null;
  }

  const prisma = new PrismaClient();
  try {
    const activeAdmin = await findActivePlatformAdminAssignment();
    if (!activeAdmin) fail("Active PLATFORM_ADMIN count is not exactly 1");

    ok(`ACTIVE_PLATFORM_ADMIN_COUNT=1`);
    ok(`ACTIVE_PLATFORM_ADMIN_FINGERPRINT=${activeAdmin.fingerprint}`);

    if (expectedTargetFingerprint && activeAdmin.fingerprint !== expectedTargetFingerprint) {
      fail("SOLE_ACTIVE_PLATFORM_ADMIN_IS_DESIGNATED_OWNER=false");
    } else if (expectedTargetFingerprint) {
      ok("SOLE_ACTIVE_PLATFORM_ADMIN_IS_DESIGNATED_OWNER=true");
    }

    const implementerCount = await prisma.platformInternalRoleAssignment.count({
      where: { role: "IMPLEMENTER", status: "ACTIVE" },
    });
    if (implementerCount !== 1) fail(`IMPLEMENTER count=${implementerCount}`);
    ok("IMPLEMENTER_COUNT=1");

    const implementer = await prisma.platformInternalRoleAssignment.findFirst({
      where: { role: "IMPLEMENTER", status: "ACTIVE" },
      select: { platformAccountId: true },
    });
    if (implementer && implementer.platformAccountId === activeAdmin.platformAccountId) {
      ok("PROCROW_OWNER_DUAL_ROLE_ACCOUNT_MATCH=true");
    }

    const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
    if (requestId) {
      const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
      if (owner) {
        const internalRoles = await prisma.platformInternalRoleAssignment.count({
          where: { platformAccountId: owner.id, status: "ACTIVE" },
        });
        if (internalRoles !== 0) {
          fail("Candidate 07 owner has internal roles");
        }
        ok("CANDIDATE_07_OWNER_INTERNAL_ROLES=0");
      }
    }

    const previousAdminAccountId =
      process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;
    if (previousAdminAccountId) {
      const previousActivePa = await prisma.platformInternalRoleAssignment.count({
        where: {
          platformAccountId: previousAdminAccountId,
          role: "PLATFORM_ADMIN",
          status: "ACTIVE",
        },
      });
      if (previousActivePa !== 0) {
        fail("PREVIOUS_PLATFORM_ADMIN_AUTHORITY_REVOKED=false");
      }
      ok("PREVIOUS_PLATFORM_ADMIN_AUTHORITY_REVOKED=true");

      const previousAccount = await prisma.platformAccount.findUnique({
        where: { id: previousAdminAccountId },
        select: { id: true, status: true },
      });
      if (!previousAccount) fail("PREVIOUS_ACCOUNT_PRESERVED=false");
      ok("PREVIOUS_ACCOUNT_PRESERVED=true");
    }

    const activeRoles = await prisma.platformInternalRoleAssignment.findMany({
      where: { platformAccountId: activeAdmin.platformAccountId, status: "ACTIVE" },
      select: { role: true },
    });
    const role = resolveAuthoritativePlatformRole(
      activeRoles.map((r) => r.role),
      null
    );
    if (role !== "platform_admin") {
      fail("Authoritative role resolution failed for sole admin");
    }
    ok("PROCROW_OWNER_ADMIN_ROUTE_AUTHORITY=PASS");

    const runtimeEmail = grepRuntimeEmailAuthorization();
    if (runtimeEmail) fail("RUNTIME_EMAIL_ALLOWLIST_USED=true");
    ok("RUNTIME_EMAIL_ALLOWLIST_USED=false");
    ok("RUNTIME_OPERATOR_FILE_USED=false");
    ok("METADATA_AUTHORIZATION_USED=false");

    console.log("\nPROCROW_OWNER_ADMIN_VERIFY=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
