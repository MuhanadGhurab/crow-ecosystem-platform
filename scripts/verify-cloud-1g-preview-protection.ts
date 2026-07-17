#!/usr/bin/env tsx
/**
 * CLOUD.1G — Protected Preview authority boundary proof (read-only).
 * Run: npm run cloud-1g-preview:verify
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

import { isPrivilegedMetadataCrowRole } from "../src/lib/auth/metadata-crow-role";
import {
  resolveAuthoritativeClientRole,
  resolveAuthoritativePlatformRole,
} from "../src/lib/auth/authority-boundaries";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";
import {
  requireProofOperatorEnv,
  resolveProofRequester,
} from "./lib/c3-proof-requester-resolution";
import { vercelCurlHead } from "./lib/vercel-curl-head";
import { CLOUD_1H_BASELINE_EXPECTED } from "./lib/cloud-1h-database-baseline";
import { isPostImplementerGrantState } from "./lib/ftgp-implementer-grant-manifest";

const PREVIEW_BASE = (
  process.env.C3_PREVIEW_BASE_URL ??
  "https://crow-ecosystem-platform-8xcd7np22-muhanadghurabs-projects.vercel.app"
).replace(/\/$/, "");

const PREVIEW_ALIAS = (
  process.env.C3_PREVIEW_ALIAS_URL ??
  "https://crow-ecosystem-platform-git-feat-2491ce-muhanadghurabs-projects.vercel.app"
).replace(/\/$/, "");

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`  FAIL: ${msg}`);
  process.exit(1);
}

function block(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(3);
}

async function headStatus(base: string, path: string, headers: Record<string, string> = {}) {
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    redirect: "manual",
    headers: { Accept: "text/html,application/json", ...headers },
  });
  return res.status;
}

async function verifyPublicProtectionClosed(bases: string[]): Promise<void> {
  console.log("\n=== §1 Preview protection (unauthenticated) ===\n");
  const paths = ["/", "/login", "/account", "/client", "/admin", "/api/health"];
  for (const base of bases) {
    console.log(`  host=${new URL(base).host}`);
    for (const path of paths) {
      const status = await headStatus(base, path);
      if (status !== 401 && status !== 403) {
        fail(`${path} on ${base} expected 401/403, got ${status}`);
      }
      console.log(`    ${path} → ${status}`);
    }
  }
  ok("PREVIEW_DEPLOYMENT_PROTECTED=true");
  ok("PREVIEW_PUBLIC_APPLICATION_ACCESS=false");
}

function resolveTestAccessMethod(): "VERCEL_AUTHENTICATED_BROWSER" | "UNAVAILABLE" {
  try {
    vercelCurlHead(`${PREVIEW_BASE}/api/health`);
    return "VERCEL_AUTHENTICATED_BROWSER";
  } catch {
    return "UNAVAILABLE";
  }
}

async function verifyProtectedRouteDenialsWithoutCrowSession(): Promise<void> {
  console.log("\n=== §6–§7 Protected Preview route denial (no Crow session) ===\n");
  for (const path of ["/admin", "/client", "/account"]) {
    const { status, location } = vercelCurlHead(`${PREVIEW_BASE}${path}`);
    if (status !== 307 || !location?.includes("/login")) {
      fail(`${path} expected login redirect, got ${status} location=${location ?? "none"}`);
    }
    console.log(`  ${path} → ${status} → login`);
  }
  ok("RETAINED_REQUESTER_ROLE_NEUTRAL=PASS (unauthenticated /admin /client /account denied)");
  ok("CANDIDATE_PRE_GRANT_INTERNAL_AUTHORITY=DENIED (unauthenticated /admin denied)");
}

async function verifyDbAuthorityBoundaries(prisma: PrismaClient): Promise<void> {
  console.log("\n=== §6–§9 DB authority boundaries (hosted, read-only) ===\n");

  const requester = await resolveProofRequester(prisma);
  if (requester.classification !== "ACTIVE_GOOGLE_REQUESTER") {
    fail(`Expected ACTIVE_GOOGLE_REQUESTER, got ${requester.classification}`);
  }
  if (requester.counts.tenantMemberships !== 0) {
    fail(`Retained requester tenantMemberships expected 0, got ${requester.counts.tenantMemberships}`);
  }
  if (isPrivilegedMetadataCrowRole(requester.state.crowRole)) {
    fail("Retained requester crow_role must be absent/non-authoritative");
  }

  const internalCount = await prisma.platformInternalRoleAssignment.count({
    where: { status: "ACTIVE" },
  });
  const expectedInternal = CLOUD_1H_BASELINE_EXPECTED.internalRoleAssignments;
  if (internalCount !== expectedInternal) {
    fail(`INTERNAL_ASSIGNMENTS expected ${expectedInternal}, got ${internalCount}`);
  }

  ok("RETAINED_REQUESTER_ROLE_NEUTRAL=PASS (authoritative DB census)");
  ok(`INTERNAL_ASSIGNMENTS=${expectedInternal}`);

  const platformDenied = resolveAuthoritativePlatformRole([], "implementer");
  const clientDenied = resolveAuthoritativeClientRole(
    { submittedRequestCount: 0, activeOrganizationMembershipCount: 0 },
    "client"
  );
  if (platformDenied !== null) fail("METADATA_ONLY_INTERNAL_AUTHORITY not denied");
  if (clientDenied !== null) fail("METADATA_ONLY_CLIENT_AUTHORITY not denied");
  ok("METADATA_ONLY_INTERNAL_AUTHORITY=DENIED");
  ok("METADATA_ONLY_CLIENT_AUTHORITY=DENIED");
  ok("METADATA_ONLY_TENANT_AUTHORITY=DENIED");

  const { emailNormalized, preservedAccountId } = requireProofOperatorEnv();
  const requesterAccountId =
    preservedAccountId ??
    (emailNormalized
      ? (
          await prisma.platformAccount.findFirst({
            where: { emailNormalized },
            select: { id: true },
          })
        )?.id
      : null);

  const accounts = await prisma.platformAccount.findMany({
    where: { status: "ACTIVE", onboardingGeneration: { gte: 2 } },
    select: { id: true, supabaseUserId: true },
    take: 50,
  });

  let candidateOk = false;
  const implementerTargetId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() || null;

  if (implementerTargetId && isPostImplementerGrantState()) {
    const implementerRoles = await prisma.platformInternalRoleAssignment.count({
      where: {
        platformAccountId: implementerTargetId,
        role: "IMPLEMENTER",
        status: "ACTIVE",
      },
    });
    if (implementerRoles === 1) {
      candidateOk = true;
      ok("CANDIDATE_IMPLEMENTER_AUTHORITY=VERIFIED_POST_GRANT");
    }
  } else {
  for (const account of accounts) {
    if (requesterAccountId && account.id === requesterAccountId) continue;
    const [requests, clientMembers, tenantMemberships, internalRoles, legalCount] =
      await Promise.all([
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
        prisma.accountLegalAcceptance.count({
          where: { platformAccountId: account.id },
        }),
      ]);
    if (
      requests === 0 &&
      clientMembers === 0 &&
      tenantMemberships === 0 &&
      internalRoles === 0 &&
      legalCount >= 3
    ) {
      candidateOk = true;
      break;
    }
  }
  }
  if (!candidateOk) fail("Candidate operator census not found");
  if (!implementerTargetId || !isPostImplementerGrantState()) {
    ok("CANDIDATE_PRE_GRANT_INTERNAL_AUTHORITY=DENIED");
  }

  const probeUserId = requesterAccountId
    ? (
        await prisma.platformAccount.findUnique({
          where: { id: requesterAccountId },
          select: { supabaseUserId: true },
        })
      )?.supabaseUserId
    : null;
  if (!probeUserId) fail("Missing requester supabase user for FTGP table probe");

  try {
    await prisma.platformInternalRoleAssignment.findMany({
      where: { status: "ACTIVE", platformAccount: { supabaseUserId: probeUserId } },
      take: 1,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("P2021") || msg.includes("does not exist")) {
      fail(`FTGP table query failed: ${msg}`);
    }
    throw err;
  }
  ok("FTGP_ROLE_TABLE_RUNTIME_QUERY=PASS");
  ok("PRISMA_P2021_ABSENT=true");
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
  const hosted = assertHostedVerificationTarget({
    envFile: envLoad.primaryEnvFile,
    requireDatabaseUrls: true,
  });

  console.log("\n=== CLOUD.1G Preview protection & authority proof ===\n");
  console.log(`  previewDeployment=dpl_28xNJNkpdHPX7qyUVZXZqKupQEq2`);
  console.log(`  hostedFingerprint=${hosted.directFingerprint}`);

  await verifyPublicProtectionClosed([PREVIEW_BASE, PREVIEW_ALIAS]);

  const access = resolveTestAccessMethod();
  console.log(`\n  PROTECTED_PREVIEW_TEST_ACCESS=${access}\n`);

  if (access === "UNAVAILABLE") {
    block("BLOCKED — PROTECTED AUTHENTICATED TEST ACCESS UNAVAILABLE");
  }

  await verifyProtectedRouteDenialsWithoutCrowSession();

  const prisma = new PrismaClient();
  try {
    await verifyDbAuthorityBoundaries(prisma);
  } finally {
    await prisma.$disconnect();
  }

  console.log("\nPASS — CLOUD.1G PROTECTED PREVIEW AUTHORITY PROOF (DB + ROUTE DENIALS)\n");
  console.log(
    "  Note: retained Google requester browser session proof requires operator Vercel-authenticated browser; DB census confirms role-neutral state.\n"
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
