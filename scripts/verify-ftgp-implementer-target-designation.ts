#!/usr/bin/env tsx
/**
 * FTGP.0G — Verify IMPLEMENTER grant candidate eligibility (read-only).
 * Run: npm run ftgp-implementer-target:verify
 */
import { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../src/lib/legal/legal-acceptance.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveCloud1hCandidateOperator } from "./lib/cloud-1h-candidate-resolution";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import {
  implementerTargetFingerprint,
  isPostImplementerGrantState,
  loadImplementerGrantManifest,
} from "./lib/ftgp-implementer-grant-manifest";
import { resolveImplementerGrantor } from "./lib/ftgp-implementer-grantor-resolution";

const TARGET_ENV = "FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nIMPLEMENTER_TARGET_ELIGIBLE=BLOCKED`);
  console.error(`  reason: ${msg}\n`);
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

  console.log("\n=== FTGP IMPLEMENTER target verify (read-only) ===\n");

  const targetAccountId = process.env[TARGET_ENV]?.trim();
  if (!targetAccountId) {
    blocked(`Set ${TARGET_ENV} in .env.ftgp-implementer-grant.operator`);
  }

  console.log(`  TARGET_SELECTION_MODE=EXPLICIT_IMMUTABLE_PLATFORM_ACCOUNT_ID`);
  console.log(`  target_fingerprint=${implementerTargetFingerprint(targetAccountId)}`);

  const prisma = new PrismaClient();
  try {
    const grantor = await resolveImplementerGrantor(prisma);
    if (!grantor) blocked("verified Platform Admin grantor not found");
    ok("grantor resolved from active PLATFORM_ADMIN assignment");

    const { preservedAccountId } = requireProofOperatorEnv();
    const platformAdminId =
      process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;

    if (preservedAccountId && targetAccountId === preservedAccountId) {
      console.log("  TARGET_REQUESTER_COLLISION=true");
      blocked("target is retained proof requester");
    }
    if (platformAdminId && targetAccountId === platformAdminId) {
      console.log("  TARGET_PLATFORM_ADMIN_COLLISION=true");
      blocked("target is current Platform Admin");
    }
    if (grantor.platformAccountId === targetAccountId) {
      console.log("  TARGET_PLATFORM_ADMIN_COLLISION=true");
      blocked("target is grantor Platform Admin");
    }
    ok("target is not retained requester");
    ok("target is not current Platform Admin");
    console.log("  TARGET_REQUESTER_COLLISION=false");
    console.log("  TARGET_PLATFORM_ADMIN_COLLISION=false");

    const account = await prisma.platformAccount.findUnique({
      where: { id: targetAccountId },
      select: {
        id: true,
        status: true,
        supabaseUserId: true,
        providerIdentities: { select: { provider: true, emailVerified: true } },
      },
    });
    if (!account) blocked("PlatformAccount does not exist");
    ok("PlatformAccount exists");

    if (account.status !== "ACTIVE") blocked(`status=${account.status}`);
    ok("status=ACTIVE");

    const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";
    const legalComplete = await hasMandatoryLegalAcceptanceComplete(account.id, locale);
    if (!legalComplete) blocked("legal acceptance incomplete");
    ok("mandatory legal acceptance complete");

    const verifiedProvider = account.providerIdentities.some((p) => p.emailVerified);
    if (!verifiedProvider) blocked("no verified provider identity");
    ok("verified provider identity exists");

    const [requests, clientMembers, tenantMemberships, internalRoles] = await Promise.all([
      prisma.implementationRequest.count({
        where: { submittedByUserId: account.supabaseUserId },
      }),
      prisma.clientOrganizationMember.count({
        where: { supabaseUserId: account.supabaseUserId },
      }),
      prisma.tenantMembership.count({
        where: { supabaseUserId: account.supabaseUserId },
      }),
      prisma.platformInternalRoleAssignment.count({
        where: { platformAccountId: account.id, status: "ACTIVE" },
      }),
    ]);

    const postGrant = isPostImplementerGrantState();
    if (postGrant) {
      const manifest = loadImplementerGrantManifest();
      const assignment = await prisma.platformInternalRoleAssignment.findFirst({
        where: {
          platformAccountId: targetAccountId,
          role: "IMPLEMENTER",
          status: "ACTIVE",
          grantCorrelationId: manifest.correlationId,
        },
      });
      if (!assignment) blocked("expected IMPLEMENTER assignment missing");
      if (internalRoles !== 1) blocked(`expected 1 active internal role, got ${internalRoles}`);
      ok("active IMPLEMENTER assignment verified");
    } else {
      if (requests > 0) blocked("request ownership present");
      if (clientMembers > 0) blocked("client membership present");
      if (tenantMemberships > 0) blocked("tenant membership present");
      if (internalRoles > 0) blocked("active internal role present");
      ok("request ownership count = 0");
      ok("client membership count = 0");
      ok("tenant membership count = 0");
      ok("active internal role count = 0");
    }

    console.log("  TARGET_CUSTOMER_AUTHORITY=false");
    console.log("  TARGET_TENANT_AUTHORITY=false");
    console.log("\nIMPLEMENTER_TARGET_ELIGIBLE=PASS");
    console.log("\nPASS — FTGP IMPLEMENTER TARGET VERIFIED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
