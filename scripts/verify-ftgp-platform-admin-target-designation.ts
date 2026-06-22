#!/usr/bin/env tsx
/**
 * FTGP.0F.1 — Verify operator-designated Platform Admin target (read-only).
 * Run: npm run ftgp-platform-admin-target:verify
 */
import { createHash } from "node:crypto";

import { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../src/lib/legal/legal-acceptance.service";
import {
  planPlatformOwnerBootstrapByAccountId,
  resolutionManifestDigest,
} from "../src/lib/platform/platform-owner-bootstrap.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveCloud1hCandidateOperator } from "./lib/cloud-1h-candidate-resolution";
import {
  countExistingPlatformOwners,
  findAuthUsersByNormalizedEmail,
} from "./lib/platform-owner-bootstrap-deps";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import {
  EXPECTED_MANIFEST_CORRELATION_ID,
  isPostBootstrapInternalRoleState,
  loadBootstrapManifest,
} from "./lib/ftgp-platform-admin-bootstrap-manifest";

const TARGET_ENV = "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nDEDICATED_PLATFORM_ADMIN_TARGET=BLOCKED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function targetFingerprint(id: string): string {
  return createHash("sha256").update(`ftgp-pa-target:${id}`).digest("hex").slice(0, 16);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator", ".env.platform-bootstrap.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP Platform Admin target designation verify (read-only) ===\n");

  const targetAccountId = process.env[TARGET_ENV]?.trim();
  if (!targetAccountId) {
    blocked(`Set ${TARGET_ENV} in .env.platform-bootstrap.operator`);
  }

  console.log(`  TARGET_SELECTION_MODE=EXPLICIT_IMMUTABLE_PLATFORM_ACCOUNT_ID`);
  console.log(`  ELIGIBLE_TARGET_COUNT_SELECTED=1`);
  console.log(`  target_fingerprint=${targetFingerprint(targetAccountId)}`);

  const prisma = new PrismaClient();
  try {
    const { preservedAccountId } = requireProofOperatorEnv();
    const implementerCandidate = await resolveCloud1hCandidateOperator(
      prisma,
      preservedAccountId ? [preservedAccountId] : []
    );

    if (preservedAccountId && targetAccountId === preservedAccountId) {
      console.log("  TARGET_REQUESTER_COLLISION=true");
      blocked("target is retained proof requester");
    }
    if (implementerCandidate && targetAccountId === implementerCandidate.platformAccountId) {
      console.log("  TARGET_IMPLEMENTER_COLLISION=true");
      blocked("target is candidate IMPLEMENTER operator");
    }
    ok("target is not retained requester");
    ok("target is not candidate IMPLEMENTER");
    console.log("  TARGET_REQUESTER_COLLISION=false");
    console.log("  TARGET_IMPLEMENTER_COLLISION=false");

    const account = await prisma.platformAccount.findUnique({
      where: { id: targetAccountId },
      select: {
        id: true,
        status: true,
        supabaseUserId: true,
        emailVerifiedAt: true,
        createdAt: true,
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
    ok("legal acceptance current");

    const verifiedProvider = account.providerIdentities.some((p) => p.emailVerified);
    if (!verifiedProvider) blocked("no verified provider identity");
    ok(`provider verified (${account.providerIdentities.length} identities)`);

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

    if (requests > 0) blocked("request ownership present");
    if (clientMembers > 0) blocked("client membership present");
    if (tenantMemberships > 0) blocked("tenant membership present");

    const postBootstrap = isPostBootstrapInternalRoleState();
    if (postBootstrap) {
      const assignment = await prisma.platformInternalRoleAssignment.findFirst({
        where: {
          platformAccountId: account.id,
          role: "PLATFORM_ADMIN",
          status: "ACTIVE",
          grantCorrelationId: EXPECTED_MANIFEST_CORRELATION_ID,
        },
      });
      if (!assignment) blocked("expected PLATFORM_ADMIN assignment missing");
      if (internalRoles !== 1) blocked(`expected 1 active internal role, got ${internalRoles}`);
      ok("request ownership count = 0");
      ok("client membership count = 0");
      ok("tenant membership count = 0");
      ok("active PLATFORM_ADMIN assignment verified");
      console.log("  TARGET_CUSTOMER_AUTHORITY=false");
      console.log("  TARGET_TENANT_AUTHORITY=false");
      console.log("\nDEDICATED_PLATFORM_ADMIN_TARGET=VERIFIED_POST_BOOTSTRAP");
      console.log("\nPASS — FTGP PLATFORM ADMIN TARGET VERIFIED (post-bootstrap)\n");
      return;
    }

    if (internalRoles > 0) blocked("active internal role present");
    ok("request ownership count = 0");
    ok("client membership count = 0");
    ok("tenant membership count = 0");
    ok("active internal role count = 0");
    console.log("  TARGET_CUSTOMER_AUTHORITY=false");
    console.log("  TARGET_TENANT_AUTHORITY=false");

    const deps = {
      findAuthUsersByEmail: findAuthUsersByNormalizedEmail,
      countExistingPlatformOwners,
      locale,
    };
    const plan = await planPlatformOwnerBootstrapByAccountId(targetAccountId, deps);
    if (!plan.allowed) blocked(plan.refusal ?? plan.message);
    ok("bootstrap plan allowed (dry-run)");

    console.log("\nDEDICATED_PLATFORM_ADMIN_TARGET=READY");
    console.log(`plan_digest=${resolutionManifestDigest(plan)}`);
    console.log("\nPASS — FTGP PLATFORM ADMIN TARGET VERIFIED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
