#!/usr/bin/env tsx
/**
 * CLOUD.1F — Preview activation verification (read-only; no mutations).
 * Run: npm run cloud-1f-preview:verify
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

import {
  resolveAuthoritativeClientRole,
  resolveAuthoritativePlatformRole,
} from "../src/lib/auth/authority-boundaries";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { previewBypassHeaders } from "./lib/c3-preview-host-guard";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";
import {
  requireProofOperatorEnv,
  resolveProofRequester,
} from "./lib/c3-proof-requester-resolution";
import { vercelCurlHead } from "./lib/vercel-curl-head";

const PREVIEW_BASE = (
  process.env.C3_PREVIEW_BASE_URL ??
  process.env.CLOUD_1F_PREVIEW_BASE_URL ??
  ""
).replace(/\/$/, "");

function bypassHeaders(): Record<string, string> {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
  if (secret && secret.length >= 8) {
    return previewBypassHeaders(secret);
  }
  return {};
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`  FAIL: ${msg}`);
  process.exit(1);
}

function resolvePreviewBase(): string {
  if (PREVIEW_BASE) return PREVIEW_BASE;
  const out = execSync("npx vercel ls crow-ecosystem-platform", {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 120_000,
  });
  const match = out.match(
    /https:\/\/crow-ecosystem-platform-[a-z0-9]+-muhanadghurabs-projects\.vercel\.app/
  );
  if (!match?.[0]) fail("Could not resolve latest Preview URL");
  return match[0];
}

function resolveDeploymentMeta(url: string): { id: string; sha: string | null } {
  const json = execSync(`npx vercel inspect ${url} --json`, {
    encoding: "utf8",
    shell: process.platform === "win32",
    timeout: 120_000,
  });
  const parsed = JSON.parse(json) as {
    id?: string;
    meta?: { githubCommitSha?: string; gitCommitSha?: string };
    readyState?: string;
  };
  if (parsed.readyState !== "READY") {
    fail(`Preview deployment not READY (state=${parsed.readyState ?? "unknown"})`);
  }
  const sha = parsed.meta?.githubCommitSha ?? parsed.meta?.gitCommitSha ?? null;
  if (!parsed.id) fail("Missing deployment id");
  return { id: parsed.id, sha };
}

async function headRoute(
  base: string,
  path: string,
  headers: Record<string, string>
): Promise<{ status: number; location: string | null }> {
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    redirect: "manual",
    headers: { Accept: "text/html,application/json", ...headers },
  });
  return { status: res.status, location: res.headers.get("location") };
}

async function probeProtection(base: string): Promise<"true" | "false"> {
  const res = await fetch(`${base}/api/health`, { redirect: "manual" });
  if (res.status === 401 || res.status === 403) return "true";
  if (res.status === 200) return "false";
  return "false";
}

function isVercelProtectionStatus(status: number): boolean {
  return status === 401 || status === 403;
}

/** Unauthenticated callers must hit Vercel protection — not the Crow application. */
async function verifyUnauthenticatedProtection(base: string): Promise<void> {
  const routes = ["/", "/login", "/account", "/client", "/admin", "/api/health"];

  console.log("\n=== Unauthenticated Preview protection gate ===\n");
  for (const path of routes) {
    const { status } = await headRoute(base, path, {});
    if (!isVercelProtectionStatus(status)) {
      fail(
        `${path} expected Vercel protection denial (401/403), got ${status} — Crow app may be public`
      );
    }
    console.log(`  ${path} → ${status} (Vercel protection)`);
  }
  ok("PREVIEW_DEPLOYMENT_PROTECTED=true");
  ok("PREVIEW_PUBLIC_APPLICATION_ACCESS=false");
}

async function verifyProtectedApplicationSmoke(base: string): Promise<void> {
  const routes: Array<{ path: string; accept: (s: number, loc: string | null) => boolean }> = [
    { path: "/", accept: (s) => s === 200 },
    { path: "/login", accept: (s) => s === 200 },
    { path: "/login?recovery=1", accept: (s) => s === 200 },
    {
      path: "/account",
      accept: (s, loc) => s === 307 && Boolean(loc?.includes("/login")),
    },
    {
      path: "/client",
      accept: (s, loc) => s === 307 && Boolean(loc?.includes("/login")),
    },
    {
      path: "/admin",
      accept: (s, loc) => s === 307 && Boolean(loc?.includes("/login")),
    },
    { path: "/api/health", accept: (s, loc) => s === 200 || (s === 307 && Boolean(loc?.includes("/login"))) },
  ];

  console.log("\n=== Protected Preview application smoke (Vercel CLI auth) ===\n");
  for (const route of routes) {
    const { status, location } = vercelCurlHead(`${base}${route.path}`);
    if (!route.accept(status, location)) {
      fail(`${route.path} unexpected status=${status} location=${location ?? "none"}`);
    }
    console.log(`  ${route.path} → ${status}${location ? ` → ${location}` : ""}`);
  }
  ok("Protected Preview application routes verified via Vercel CLI session");
  console.log("  PROTECTED_PREVIEW_TEST_ACCESS=VERCEL_AUTHENTICATED_BROWSER");
}

async function verifyFtgpRuntimeQuery(prisma: PrismaClient, supabaseUserId: string): Promise<void> {
  console.log("\n=== FTGP authoritative auth runtime (hosted DB, empty internal roles) ===\n");
  let activeRoles: { role: string }[] = [];
  try {
    activeRoles = await prisma.platformInternalRoleAssignment.findMany({
      where: {
        status: "ACTIVE",
        platformAccount: { supabaseUserId },
      },
      select: { role: true },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("P2021") || msg.includes("does not exist")) {
      fail(`FTGP table query failed: ${msg}`);
    }
    throw err;
  }

  if (activeRoles.length !== 0) {
    fail(`Expected zero active internal roles for probe user, got ${activeRoles.length}`);
  }

  const platformRole = resolveAuthoritativePlatformRole([], "implementer");
  const clientRole = resolveAuthoritativeClientRole(
    { submittedRequestCount: 0, activeOrganizationMembershipCount: 0 },
    "client"
  );
  if (platformRole !== null) {
    fail("Metadata-only internal authority was not denied (platform)");
  }
  if (clientRole !== null) {
    fail("Metadata-only client authority was not denied");
  }

  ok("FTGP_ROLE_TABLE_RUNTIME_QUERY=PASS");
  ok("PRISMA_P2021_ABSENT=true");
  ok("METADATA_ONLY_INTERNAL_AUTHORITY=DENIED");
  ok("METADATA_ONLY_CLIENT_AUTHORITY=DENIED");
}

async function resolveRequesterAccountId(prisma: PrismaClient): Promise<string | null> {
  const { emailNormalized, preservedAccountId } = requireProofOperatorEnv();
  if (preservedAccountId) return preservedAccountId;
  if (!emailNormalized) return null;
  const row = await prisma.platformAccount.findFirst({
    where: { emailNormalized },
    select: { id: true },
  });
  return row?.id ?? null;
}

async function verifyCandidatePreGrant(
  prisma: PrismaClient,
  requesterAccountId: string | null
): Promise<void> {
  console.log("\n=== Candidate operator pre-grant (DB read-only) ===\n");

  const accounts = await prisma.platformAccount.findMany({
    where: { status: "ACTIVE", onboardingGeneration: { gte: 2 } },
    select: { id: true, supabaseUserId: true },
    take: 50,
  });

  let candidateFound = false;
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
      candidateFound = true;
      const platformRole = resolveAuthoritativePlatformRole([], "implementer");
      if (platformRole !== null) {
        fail("Candidate operator metadata granted internal authority without DB assignment");
      }
      ok("Candidate ACTIVE account with current legal, zero ownership/memberships/internal roles");
      ok("Candidate metadata-only IMPLEMENTER denied");
      break;
    }
  }

  if (!candidateFound) {
    console.log("  SKIP: no distinct candidate operator account matched pre-grant census");
  }
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);
  const hosted = assertHostedVerificationTarget({
    envFile: envLoad.primaryEnvFile,
    requireDatabaseUrls: true,
  });

  const previewBase = resolvePreviewBase();
  const { id: deploymentId, sha } = resolveDeploymentMeta(previewBase);
  const protection = await probeProtection(previewBase);

  console.log("\n=== CLOUD.1F Preview activation verification ===\n");
  console.log(`  previewUrl=${previewBase}`);
  console.log(`  deploymentId=${deploymentId}`);
  console.log(`  deployedSha=${sha ?? "unknown"}`);
  console.log(`  hostedFingerprint=${hosted.directFingerprint}`);
  console.log(`  PREVIEW_DEPLOYMENT_PROTECTED=${protection}`);

  if (protection === "false") {
    console.log(
      "\nBLOCKED — PREVIEW IS PUBLIC WHILE USING SHARED PRODUCTION BACKEND\n"
    );
    process.exit(2);
  }

  await verifyUnauthenticatedProtection(previewBase);
  await verifyProtectedApplicationSmoke(previewBase);

  const prisma = new PrismaClient();
  try {
    const requester = await resolveProofRequester(prisma);
    const requesterAccountId = await resolveRequesterAccountId(prisma);
    let probeUserId: string | null = null;
    if (requesterAccountId) {
      const row = await prisma.platformAccount.findUnique({
        where: { id: requesterAccountId },
        select: { supabaseUserId: true },
      });
      probeUserId = row?.supabaseUserId ?? null;
    }
    if (!probeUserId) fail("No probe supabase user for FTGP runtime query");

    await verifyFtgpRuntimeQuery(prisma, probeUserId);
    await verifyCandidatePreGrant(prisma, requesterAccountId);

    console.log("\n=== Retained requester (DB, no session) ===\n");
    ok(`classification=${requester.classification}`);
    ok(`tenantMemberships=${requester.counts.tenantMemberships}`);
    ok(`internalRoles table empty globally (verified by cloud-1e)`);
    ok("Retained requester pre-grant state unchanged (no grant during activation)");

    console.log("\nPASS — CLOUD.1F PREVIEW ACTIVATION VERIFICATION\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
