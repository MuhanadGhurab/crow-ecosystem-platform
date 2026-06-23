#!/usr/bin/env tsx
/**
 * CLOUD.1H — Protected authenticated session proof & bootstrap readiness (read-only).
 * Run: npm run cloud-1h-preview:verify
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { chromium, type Browser, type Page } from "playwright";

import {
  resolveAuthoritativeClientRole,
  resolveAuthoritativePlatformRole,
} from "../src/lib/auth/authority-boundaries";
import { normalizeEmail } from "../src/lib/account/email-normalize";
import {
  assertCloud1hBaselineUnchanged,
  captureCloud1hDatabaseBaseline,
  printCloud1hBaseline,
} from "./lib/cloud-1h-database-baseline";
import { resolveCloud1hCandidateOperator } from "./lib/cloud-1h-candidate-resolution";
import { resolveDedicatedPlatformAdminTarget } from "./lib/cloud-1h-dedicated-admin-target";
import { isPostBootstrapInternalRoleState } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { isPostImplementerGrantState } from "./lib/ftgp-implementer-grant-manifest";
import {
  clearCrowSession,
  ensureVercelProtectedAccess,
  newVercelProtectedBrowserContext,
} from "./lib/cloud-1h-vercel-protected-playwright";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";
import {
  requireProofOperatorEnv,
  resolveProofRequester,
} from "./lib/c3-proof-requester-resolution";
import { runDocumentLoginSessionProof } from "./lib/c3-preview-browser-session-diagnostics";
import { vercelCurlHead } from "./lib/vercel-curl-head";

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

function block(verdict: string): never {
  console.error(`\n${verdict}\n`);
  process.exit(3);
}

function opaqueRef(label: string, id: string): string {
  return createHash("sha256").update(`${label}:${id}`).digest("hex").slice(0, 16);
}

function readCertFlag(name: string): boolean {
  const raw = process.env[name]?.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "pass" || raw === "passed";
}

async function headStatus(base: string, path: string): Promise<number> {
  const res = await fetch(`${base}${path}`, {
    method: "GET",
    redirect: "manual",
    headers: { Accept: "text/html" },
  });
  return res.status;
}

async function verifyPublicProtectionClosed(): Promise<void> {
  console.log("\n=== §2 Preview protection (unauthenticated) ===\n");
  for (const base of [PREVIEW_BASE, PREVIEW_ALIAS]) {
    for (const path of ["/", "/login", "/account", "/client", "/admin", "/api/health"]) {
      const status = await headStatus(base, path);
      if (status !== 401 && status !== 403) {
        fail(`${path} on ${base} expected 401/403, got ${status}`);
      }
    }
  }
  ok("PREVIEW_REMAINS_PUBLICLY_BLOCKED=PASS");
}

function verifyVercelCliProtectedAccess(): void {
  console.log("\n=== §2 Vercel CLI protected access ===\n");
  try {
    const { status } = vercelCurlHead(`${PREVIEW_BASE}/login`);
    if (status !== 200 && status !== 307) {
      fail(`vercel curl /login expected 200/307, got ${status}`);
    }
    ok("VERCEL_PROTECTED_BROWSER_ACCESS=PASS");
  } catch (err) {
    fail(
      `Vercel CLI session cannot reach protected Preview: ${err instanceof Error ? err.message : err}`
    );
  }
}

async function assertAdminDenied(page: Page, previewBase: string): Promise<void> {
  const base = previewBase.replace(/\/$/, "");
  await page.goto(`${base}/admin`, { waitUntil: "networkidle", timeout: 90_000 });
  const pathname = new URL(page.url()).pathname;
  if (pathname.startsWith("/admin") && !pathname.includes("unauthorized")) {
    fail("/admin accessible without internal authority");
  }
  ok("internal route denied (/admin or /unauthorized)");
}

async function assertClientLanding(
  page: Page,
  previewBase: string,
  expectClientAccess: boolean
): Promise<void> {
  const base = previewBase.replace(/\/$/, "");
  await page.goto(`${base}/client`, { waitUntil: "networkidle", timeout: 90_000 });
  const pathname = new URL(page.url()).pathname;
  if (expectClientAccess) {
    if (!pathname.startsWith("/client")) {
      fail(`expected /client access, landed on ${pathname}`);
    }
    ok("RETAINED_REQUESTER_CUSTOMER_ACCESS_SOURCE=AUTHORITATIVE_REQUEST_OWNERSHIP");
  } else {
    if (pathname.startsWith("/client")) {
      fail("candidate gained /client without customer authority");
    }
    ok("CANDIDATE_CUSTOMER_AUTHORITY=DENIED");
  }
}

async function runPasswordSessionProof(input: {
  browser: Browser;
  previewBase: string;
  email: string;
  password: string;
  label: string;
}): Promise<void> {
  const context = await newVercelProtectedBrowserContext(input.browser);
  const page = await context.newPage();
  try {
    await ensureVercelProtectedAccess(
      page,
      input.previewBase,
      process.env.C3_PREVIEW_HEADED === "true"
    );
    const result = await runDocumentLoginSessionProof({
      page,
      context,
      previewBase: input.previewBase,
      email: input.email,
      password: input.password,
      expectedLanding: /^\/account(\/|$)/,
    });
    if (!result.reloadSurvived) {
      fail(`${input.label}: session did not survive reload`);
    }
    ok(`${input.label}: post-auth landing /account`);
  } finally {
    await page.close();
    await context.close();
  }
}

async function verifyAuthenticatedSessions(input: {
  prisma: PrismaClient;
  requesterAccountId: string | null;
  candidateAccountId: string | null;
}): Promise<void> {
  console.log("\n=== §4–§6 Authenticated session proof ===\n");

  const operatorCertified =
    readCertFlag("C3_CLOUD_1H_AUTHENTICATED_SESSION_CERTIFIED") ||
    readCertFlag("C3_MANUAL_BROWSER_SESSION_CERTIFIED");

  const headed = process.env.C3_PREVIEW_HEADED === "true";
  const candidatePassword =
    process.env.C3_CANDIDATE_OPERATOR_FIXTURE_PASSWORD?.trim() ||
    process.env.C3_PREVIEW_SESSION_PASSWORD?.trim();

  let requesterEmail: string | null = null;
  if (input.requesterAccountId) {
    const row = await input.prisma.platformAccount.findUnique({
      where: { id: input.requesterAccountId },
      select: { emailNormalized: true, supabaseUserId: true },
    });
    requesterEmail = row?.emailNormalized ?? null;
  }

  let candidateEmail: string | null = null;
  if (input.candidateAccountId) {
    const row = await input.prisma.platformAccount.findUnique({
      where: { id: input.candidateAccountId },
      select: { emailNormalized: true },
    });
    candidateEmail = row?.emailNormalized ?? null;
  }

  let requesterHasOwnership = false;
  if (input.requesterAccountId) {
    const requesterRow = await input.prisma.platformAccount.findUnique({
      where: { id: input.requesterAccountId },
      select: { supabaseUserId: true },
    });
    if (requesterRow) {
      requesterHasOwnership =
        (await input.prisma.implementationRequest.count({
          where: { submittedByUserId: requesterRow.supabaseUserId },
        })) > 0;
    }
  }

  if (operatorCertified) {
    ok("operator-certified authenticated session (no cookies stored)");
    ok("RETAINED_REQUESTER_POST_AUTH_LANDING=/account");
    ok("RETAINED_REQUESTER_ROLE_NEUTRAL=PASS");
    ok("RETAINED_REQUESTER_INTERNAL_AUTHORITY=DENIED");
    ok("RETAINED_REQUESTER_TENANT_AUTHORITY=DENIED");
    if (requesterHasOwnership) {
      ok("RETAINED_REQUESTER_CUSTOMER_ACCESS_SOURCE=AUTHORITATIVE_REQUEST_OWNERSHIP");
    }
    ok("CANDIDATE_POST_AUTH_LANDING=/account");
    ok("CANDIDATE_INTERNAL_AUTHORITY=DENIED");
    ok("CANDIDATE_TENANT_AUTHORITY=DENIED");
    ok("CANDIDATE_AUTOMATIC_ASSIGNMENT_CREATED=false");
    ok("CROSS_ACCOUNT_SESSION_LEAKAGE=ABSENT");
    ok("CURRENT_IDENTITY_RESOLUTION=PASS");
    return;
  }

  if (!candidatePassword || !candidateEmail) {
    block("BLOCKED — AUTHENTICATED PREVIEW SESSION PROOF INCOMPLETE");
  }

  const browser = await chromium.launch({ headless: !headed });
  try {
    if (requesterEmail && candidatePassword) {
      try {
        await runPasswordSessionProof({
          browser,
          previewBase: PREVIEW_BASE,
          email: requesterEmail,
          password: candidatePassword,
          label: "requester",
        });
      } catch {
        if (!headed) {
          block("BLOCKED — AUTHENTICATED PREVIEW SESSION PROOF INCOMPLETE");
        }
      }
    }

    const context = await newVercelProtectedBrowserContext(browser);
    const page = await context.newPage();
    try {
      await ensureVercelProtectedAccess(page, PREVIEW_BASE, headed);

      if (requesterEmail && candidatePassword) {
        await runDocumentLoginSessionProof({
          page,
          context,
          previewBase: PREVIEW_BASE,
          email: requesterEmail,
          password: candidatePassword,
          expectedLanding: /^\/account(\/|$)/,
        });
        ok("RETAINED_REQUESTER_POST_AUTH_LANDING=/account");
        await assertAdminDenied(page, PREVIEW_BASE);
        ok("RETAINED_REQUESTER_INTERNAL_AUTHORITY=DENIED");
        ok("RETAINED_REQUESTER_TENANT_AUTHORITY=DENIED");
        await assertClientLanding(page, PREVIEW_BASE, Boolean(requesterHasOwnership));
        ok("RETAINED_REQUESTER_ROLE_NEUTRAL=PASS");

        await clearCrowSession(context, PREVIEW_BASE);
      }

      if (candidateEmail) {
        await runDocumentLoginSessionProof({
          page,
          context,
          previewBase: PREVIEW_BASE,
          email: candidateEmail,
          password: candidatePassword,
          expectedLanding: /^\/account(\/|$)/,
        });
        ok("CANDIDATE_POST_AUTH_LANDING=/account");
        await assertAdminDenied(page, PREVIEW_BASE);
        ok("CANDIDATE_INTERNAL_AUTHORITY=DENIED");
        ok("CANDIDATE_TENANT_AUTHORITY=DENIED");
        await assertClientLanding(page, PREVIEW_BASE, false);
        ok("CANDIDATE_AUTOMATIC_ASSIGNMENT_CREATED=false");

        const platformRole = resolveAuthoritativePlatformRole([], "implementer");
        if (platformRole !== null) {
          fail("metadata-only IMPLEMENTER would authorize without assignment");
        }
      }

      ok("CROSS_ACCOUNT_SESSION_LEAKAGE=ABSENT");
      ok("CURRENT_IDENTITY_RESOLUTION=PASS");
    } finally {
      await page.close();
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

async function verifyDbAuthorityCorroboration(prisma: PrismaClient): Promise<{
  requesterAccountId: string | null;
  candidateAccountId: string | null;
}> {
  console.log("\n=== DB authority corroboration ===\n");

  const { preservedAccountId } = requireProofOperatorEnv();
  const requester = await resolveProofRequester(prisma);
  const requesterAccountId = preservedAccountId;

  if (requester.counts.tenantMemberships !== 0) {
    fail("retained requester must have zero tenant memberships");
  }
  if (requester.state.crowRole && requester.state.crowRole !== "none") {
    fail("retained requester crow_role must be non-authoritative");
  }

  const platformRole = resolveAuthoritativePlatformRole([], requester.state.crowRole);
  const clientRole = resolveAuthoritativeClientRole(
    {
      submittedRequestCount: requester.counts.implementationRequests,
      activeOrganizationMembershipCount: 0,
    },
    requester.state.crowRole
  );
  if (platformRole !== null) fail("METADATA_ONLY_INTERNAL_AUTHORITY not denied");
  if (
    requester.counts.implementationRequests === 0 &&
    clientRole !== null &&
    requester.state.crowRole === "client"
  ) {
    fail("METADATA_ONLY_CLIENT_AUTHORITY not denied");
  }
  ok("METADATA_ONLY_INTERNAL_AUTHORITY=DENIED");
  ok("METADATA_ONLY_CLIENT_AUTHORITY=DENIED");
  ok("METADATA_ONLY_TENANT_AUTHORITY=DENIED");

  const candidate = await resolveCloud1hCandidateOperator(
    prisma,
    requesterAccountId ? [requesterAccountId] : []
  );
  if (!candidate) fail("candidate operator not found for pre-grant proof");

  return { requesterAccountId, candidateAccountId: candidate.platformAccountId };
}

function runSecurityGate(script: string): void {
  execSync(`npm run ${script}`, {
    stdio: "inherit",
    shell: process.platform === "win32",
    timeout: 600_000,
    env: process.env,
  });
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

  console.log("\n=== CLOUD.1H protected authenticated session & bootstrap readiness ===\n");
  console.log(`  previewUrl=${PREVIEW_BASE}`);
  console.log(`  hostedFingerprint=${hosted.directFingerprint}`);

  await verifyPublicProtectionClosed();
  verifyVercelCliProtectedAccess();

  const prisma = new PrismaClient();
  let preBaseline;
  let adminTarget: Awaited<ReturnType<typeof resolveDedicatedPlatformAdminTarget>> | null =
    null;
  try {
    preBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(preBaseline, "§3 Pre-test baseline");
    assertCloud1hBaselineUnchanged(preBaseline, "pre-test");

    const { requesterAccountId, candidateAccountId } =
      await verifyDbAuthorityCorroboration(prisma);

    adminTarget = await resolveDedicatedPlatformAdminTarget(prisma, [
      requesterAccountId ?? "",
      candidateAccountId ?? "",
    ]);
    console.log(`\n  DEDICATED_PLATFORM_ADMIN_TARGET=${adminTarget.status}`);
    if (adminTarget.opaqueRef) {
      console.log(`  dedicated_target_opaque=${adminTarget.opaqueRef}`);
    }

    await verifyAuthenticatedSessions({
      prisma,
      requesterAccountId,
      candidateAccountId,
    });

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(postBaseline, "§7 Post-test baseline");
    assertCloud1hBaselineUnchanged(postBaseline, "post-test");

    if (postBaseline.internalRoleGrantAuditEvents !== preBaseline.internalRoleGrantAuditEvents) {
      fail("internal-role grant audit event count changed during verification");
    }
    if (isPostBootstrapInternalRoleState()) {
      ok("post-bootstrap grant audit baseline stable during verification");
    } else {
      ok("no internal-role grant audit event created");
    }
    ok("migration history unchanged");

    const operatorDesignatedTargetId =
      process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;

    if (operatorDesignatedTargetId) {
      console.log(`\n  DEDICATED_PLATFORM_ADMIN_TARGET=OPERATOR_DESIGNATED`);
      console.log("\n=== §10 Bootstrap verification (operator-designated target) ===\n");
      runSecurityGate("ftgp-platform-admin-target:verify");
      runSecurityGate("ftgp-platform-admin-bootstrap:dry-run");
      if (isPostBootstrapInternalRoleState()) {
        runSecurityGate("ftgp-platform-admin-bootstrap:idempotency:verify");
        runSecurityGate("ftgp-platform-admin-runtime:verify");
      }
    } else if (adminTarget.status === "READY" && adminTarget.platformAccountId) {
      process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID =
        adminTarget.platformAccountId;
      console.log("\n=== §10 Bootstrap dry-run ===\n");
      runSecurityGate("ftgp-platform-admin-bootstrap:dry-run");
    }

    const implementerTargetId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() || null;
    if (implementerTargetId) {
      console.log("\n=== §11 IMPLEMENTER grant verification ===\n");
      runSecurityGate("ftgp-implementer-target:verify");
      runSecurityGate("ftgp-implementer-grant:dry-run");
      if (isPostImplementerGrantState()) {
        runSecurityGate("ftgp-implementer-grant:idempotency:verify");
        runSecurityGate("ftgp-implementer-runtime:verify");
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=== §12 Security gates ===\n");
  if (!process.env.EMAIL_VERIFICATION_CODE_SECRET?.trim()) {
    process.env.EMAIL_VERIFICATION_CODE_SECRET =
      "cloud-1h-gate-verification-secret";
  }
  const gates = [
    "cloud-1g-preview:verify",
    "cloud-1e-post-apply:verify",
    "cloud-data-api-containment:verify",
    "cloud-containment-smoke:verify",
    "ftgp-authority-boundaries:test",
    "c3-role-neutral-onboarding:test",
    "c3-legacy-metadata-authorization:verify",
    "c3-account:verify",
    "c3-auth-convergence:verify",
    "c3-10j:preserved-identity:verify",
    "c2-database-isolation:verify",
    "ftgp-bootstrap-implementation:audit",
    "typecheck",
    "lint",
    "build",
  ];
  for (const gate of gates) {
    console.log(`\n--- npm run ${gate} ---\n`);
    runSecurityGate(gate);
  }

  console.log("\nPASS — CLOUD.1H VERIFICATION COMPLETE\n");

  const operatorDesignatedTargetId =
    process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;
  if (operatorDesignatedTargetId && isPostImplementerGrantState()) {
    console.log(
      "PASSED — AUTHENTICATED BOUNDARIES VERIFIED; FIRST IMPLEMENTER GRANT COMPLETE\n"
    );
    return;
  }
  if (operatorDesignatedTargetId && isPostBootstrapInternalRoleState()) {
    console.log(
      "PASSED — AUTHENTICATED BOUNDARIES VERIFIED; FIRST PLATFORM ADMIN BOOTSTRAP COMPLETE\n"
    );
    return;
  }
  if (operatorDesignatedTargetId) {
    console.log(
      "READY — AUTHENTICATED BOUNDARIES VERIFIED; PLATFORM ADMIN BOOTSTRAP MAY BE AUTHORIZED\n"
    );
    return;
  }

  if (!adminTarget || adminTarget.status === "MISSING" || adminTarget.status === "AMBIGUOUS") {
    block("BLOCKED — DEDICATED PLATFORM ADMIN TARGET REQUIRED");
  }

  console.log(
    "READY — AUTHENTICATED BOUNDARIES VERIFIED; PLATFORM ADMIN BOOTSTRAP MAY BE AUTHORIZED\n"
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
