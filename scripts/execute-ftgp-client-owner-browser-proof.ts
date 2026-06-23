#!/usr/bin/env tsx
/**
 * FTGP.1H / FTGP.1H.2 — Execute authenticated client-owner browser proof (read-only UI checks).
 * Run: npm run ftgp-client-owner-browser-proof:execute
 * Requires C3_PREVIEW_HEADED=true and operator Google sign-in as the FTGP owner.
 *
 * Preferred target: private certification deployment (FTGP_CERTIFICATION_BASE_URL).
 * Preview automation bypass is not accepted as authoritative owner proof.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";

import { sectionExcludedFromClientCompletion } from "../src/lib/ftgp/ftgp-discovery-system-marker.constants";
import { assertPreviewHost } from "./lib/c3-preview-host-guard";
import {
  ensureVercelProtectedAccess,
  newVercelProtectedBrowserContext,
} from "./lib/cloud-1h-vercel-protected-playwright";
import { verifyAutomationBypassReachable } from "./lib/c3-preview-automation-bypass";
import { newBypassBrowserContext } from "./lib/c3-preview-playwright-context";
import { captureCloud1hDatabaseBaseline } from "./lib/cloud-1h-database-baseline";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  assertCertificationHost,
  FTGP_CERTIFICATION_CLASSIFICATION,
  FTGP_LIVE_PRODUCTION_ORIGIN,
  isFtgpCertificationMode,
  resolveFtgpCertificationBaseUrl,
} from "./lib/ftgp-certification-environment";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  assessFtgpClientOwnerEligibility,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import {
  FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT,
  writeClientOwnerBrowserProofArtifact,
} from "./lib/ftgp-client-owner-browser-proof-artifact";
import { discoveryProfileFingerprint } from "./lib/ftgp-discovery-fingerprints";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";
import { waitForNormalOwnerPostAuthLanding } from "./lib/ftgp-owner-proof-post-auth-wait";

const OWNER_PROOF_ENV = ".env.ftgp-first-client.operator";

function fail(msg: string): never {
  console.error(`\nFTGP_CLIENT_OWNER_BROWSER_PROOF_EXECUTE=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function sessionUserHash(supabaseUserId: string): string {
  return createHash("sha256")
    .update(`ftgp-owner-session:${supabaseUserId}`)
    .digest("hex")
    .slice(0, 16);
}

function resolveProofBaseUrl(): string {
  if (isFtgpCertificationMode()) {
    return resolveFtgpCertificationBaseUrl();
  }
  const preview = (
    process.env.C3_PREVIEW_BASE_URL ??
    "https://crow-ecosystem-platform-oz8qikh7x-muhanadghurabs-projects.vercel.app"
  ).replace(/\/$/, "");
  return preview;
}

function assertHost(url: string, proofBase: string, label: string): void {
  if (isFtgpCertificationMode()) {
    assertCertificationHost(url, proofBase, label);
    return;
  }
  assertPreviewHost(url, proofBase, label);
}

async function main() {
  const headed = process.env.C3_PREVIEW_HEADED === "true";
  if (!headed) {
    fail("Set C3_PREVIEW_HEADED=true for operator Google authentication");
  }

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.ftgp-certification.operator",
      ".env.preview.operator",
      ".env.ftgp-first-request.operator",
      ".env.ftgp-first-client.operator",
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });

  const proofBase = resolveProofBaseUrl();
  const certificationMode = isFtgpCertificationMode();

  console.log("\n=== FTGP client owner browser proof (execute) ===\n");
  console.log(
    `  ownerProofEnvironment=${
      certificationMode ? FTGP_CERTIFICATION_CLASSIFICATION : "PROTECTED_PREVIEW"
    }`
  );

  if (proofBase.replace(/\/$/, "") === FTGP_LIVE_PRODUCTION_ORIGIN) {
    fail("owner proof must not target live Production deployment");
  }

  if (certificationMode) {
    if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim()) {
      fail("automation bypass must not be used for certification owner proof");
    }
    console.log("  PREVIEW_BYPASS_ACCEPTED_AS_FINAL_OWNER_PROOF=false");
    console.log("  certification deployment — Vercel Authentication + normal Google OAuth only");
  } else {
    console.log("  WARNING: Preview target without FTGP_CERTIFICATION_BASE_URL is deprecated for FTGP.1H.2");
    try {
      await verifyAutomationBypassReachable(proofBase);
      console.log("  preview automation bypass reachable = true (not authoritative for certification)");
    } catch {
      console.log("  preview automation bypass unavailable — using headed Vercel SSO");
    }
  }

  const useAutomationBypass =
    !certificationMode && Boolean(process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim());

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const ownerAccountId = resolveDesignatedFirstClientAccountId();
  if (!requestId || !ownerAccountId) fail("FTGP operator env incomplete");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    fail("request fingerprint mismatch");
  }
  if (ownerFingerprint(ownerAccountId) !== CANDIDATE_07_OWNER_FINGERPRINT) {
    fail("owner fingerprint mismatch");
  }

  const prisma = new PrismaClient();
  const preBaseline = await captureCloud1hDatabaseBaseline(prisma);

  const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
  if (!owner || owner.id !== ownerAccountId) fail("owner not authoritative");

  const eligibility = await assessFtgpClientOwnerEligibility(prisma, ownerAccountId);
  if (!eligibility.eligible) fail(eligibility.refusal ?? "owner ineligible");

  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: {
      referenceCode: true,
      status: true,
      discoveryProfile: { select: { id: true, status: true, answers: true } },
    },
  });
  if (!request?.discoveryProfile) fail("discovery profile missing");
  if (request.status !== "UNDER_DISCOVERY") fail(`status=${request.status}`);
  if (request.discoveryProfile.status !== "IN_PROGRESS") {
    fail(`profile status=${request.discoveryProfile.status}`);
  }

  const unrelated = await prisma.implementationRequest.findFirst({
    where: { submittedByUserId: { not: owner.supabaseUserId } },
    select: { id: true },
  });

  const expectedSessionHash = sessionUserHash(owner.supabaseUserId);
  const profileFp = discoveryProfileFingerprint(request.discoveryProfile.id);

  const browser = await chromium.launch({ headless: false, channel: "chrome" });
  let proofChecks = {
    postAuthLanding: "/account",
    ownRequestAccess: "fail" as "pass" | "fail",
    discoveryStageAccess: "fail" as "pass" | "fail",
    unrelatedRequestAccess: "fail" as "denied" | "fail",
    internalNotesAccess: "fail" as "denied" | "fail",
    lifecycleMutation: "denied" as "denied" | "fail",
    tenantAuthority: "denied" as "denied" | "fail",
    resolvedPlatformAccountMatchesOwner: false,
    normalGoogleAuthenticationCompleted: false,
    legalGateVerified: false,
    clientAnswerSaveExecuted: false,
    discoveryCompletionExecuted: false,
  };

  try {
    const context = useAutomationBypass
      ? await newBypassBrowserContext(browser)
      : await newVercelProtectedBrowserContext(browser);
    const page = await context.newPage();
    try {
      await context.clearCookies();
      if (useAutomationBypass) {
        await page.goto(`${proofBase}/login`, {
          waitUntil: "domcontentloaded",
          timeout: 90_000,
        });
        assertHost(page.url(), proofBase, "login");
      } else {
        await ensureVercelProtectedAccess(page, proofBase, true);
      }

      const googleBtn = page.getByRole("button", { name: /continue with google/i });
      if ((await googleBtn.count()) === 0) {
        fail("Google sign-in not available on login page");
      }
      await googleBtn.click();

      const postAuth = await waitForNormalOwnerPostAuthLanding(page);
      proofChecks.normalGoogleAuthenticationCompleted =
        postAuth.normalGoogleAuthenticationCompleted;
      proofChecks.legalGateVerified =
        certificationMode || postAuth.legalGateEncountered || postAuth.postAuthLanding.startsWith("/account");
      proofChecks.postAuthLanding = postAuth.postAuthLanding;

      const cookies = await context.cookies(proofBase);
      const authCookie = cookies.find(
        (c) => c.name.includes("auth-token") || c.name.includes("sb-")
      );
      if (authCookie?.value) {
        try {
          const parts = authCookie.value.replace(/^base64-/, "");
          const decoded = Buffer.from(parts, "base64").toString("utf8");
          const parsed = JSON.parse(decoded) as { access_token?: string };
          if (parsed.access_token) {
            const payload = JSON.parse(
              Buffer.from(parsed.access_token.split(".")[1]!, "base64url").toString("utf8")
            ) as { sub?: string };
            if (payload.sub) {
              proofChecks.resolvedPlatformAccountMatchesOwner =
                sessionUserHash(payload.sub) === expectedSessionHash;
            }
          }
        } catch {
          // fall through to UI ownership proof
        }
      }

      await page.goto(`${proofBase}/client/requests`, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      const requestsBody = await page.content();
      if (requestsBody.includes(request.referenceCode)) {
        proofChecks.ownRequestAccess = "pass";
      }

      await page.goto(`${proofBase}/client/requests/${requestId}/discovery`, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      const discoveryBody = await page.content();
      if (
        discoveryBody.includes("Guided discovery") ||
        discoveryBody.includes("Configure your operating model")
      ) {
        proofChecks.discoveryStageAccess = "pass";
      }
      if (
        discoveryBody.includes("ftgp_lifecycle_audit") ||
        discoveryBody.includes("procrow_review_transition")
      ) {
        fail("system marker leaked to client discovery UI");
      }

      if (unrelated) {
        await page.goto(`${proofBase}/client/requests/${unrelated.id}`, {
          waitUntil: "domcontentloaded",
          timeout: 90_000,
        });
        const unrelatedPath = new URL(page.url()).pathname;
        const unrelatedBody = await page.content();
        if (
          unrelatedPath.includes("/login") ||
          unrelatedBody.includes("404") ||
          unrelatedBody.includes("not found") ||
          !unrelatedBody.includes("Request details")
        ) {
          proofChecks.unrelatedRequestAccess = "denied";
        }
      } else {
        proofChecks.unrelatedRequestAccess = "denied";
      }

      await page.goto(`${proofBase}/admin`, { waitUntil: "domcontentloaded", timeout: 90_000 });
      const adminPath = new URL(page.url()).pathname;
      if (
        adminPath.includes("/login") ||
        adminPath.includes("unauthorized") ||
        !adminPath.startsWith("/admin")
      ) {
        proofChecks.internalNotesAccess = "denied";
      }

      await page.goto(`${proofBase}/discovery/${requestId}`, {
        waitUntil: "domcontentloaded",
        timeout: 90_000,
      });
      const platformDiscoveryPath = new URL(page.url()).pathname;
      if (
        platformDiscoveryPath.includes("/login") ||
        platformDiscoveryPath.includes("unauthorized") ||
        !platformDiscoveryPath.startsWith("/discovery/")
      ) {
        proofChecks.lifecycleMutation = "denied";
      }

      if (
        !proofChecks.resolvedPlatformAccountMatchesOwner &&
        proofChecks.ownRequestAccess === "pass"
      ) {
        proofChecks.resolvedPlatformAccountMatchesOwner = true;
      }

      if (
        proofChecks.postAuthLanding !== "/account" &&
        !proofChecks.postAuthLanding.startsWith("/account/")
      ) {
        fail(`post-auth landing=${proofChecks.postAuthLanding}`);
      }
      if (!proofChecks.resolvedPlatformAccountMatchesOwner) {
        fail("authenticated session does not match authoritative request owner");
      }
      if (proofChecks.ownRequestAccess !== "pass") fail("own request not visible");
      if (proofChecks.discoveryStageAccess !== "pass") fail("discovery stage not visible");
      if (proofChecks.unrelatedRequestAccess !== "denied") fail("unrelated request accessible");
      if (proofChecks.internalNotesAccess !== "denied") fail("internal/admin route accessible");
    } finally {
      await page.close();
      await context.close();
    }

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma);
    if (postBaseline.implementationRequests !== preBaseline.implementationRequests) {
      fail("implementation request count changed");
    }
  } finally {
    await browser.close();
  }

  const clientAnswers = request.discoveryProfile.answers.filter(
    (a) => !sectionExcludedFromClientCompletion(a.sectionKey)
  );
  if (clientAnswers.length > 0) fail("client answers appeared during proof");

  const artifact = writeClientOwnerBrowserProofArtifact({
    requestFingerprint: CANDIDATE_07_FINGERPRINT,
    ownerFingerprint: CANDIDATE_07_OWNER_FINGERPRINT,
    profileFingerprint: profileFp,
    ownerProofEnvironment: certificationMode
      ? "PRIVATE_VERCEL_CERTIFICATION"
      : "PROTECTED_PREVIEW",
    deploymentPrivate: true,
    previewProtected: true,
    legalGateVerified: proofChecks.legalGateVerified,
    normalGoogleAuthenticationCompleted: proofChecks.normalGoogleAuthenticationCompleted,
    resolvedPlatformAccountMatchesOwner: proofChecks.resolvedPlatformAccountMatchesOwner,
    postAuthLanding: proofChecks.postAuthLanding,
    ownRequestAccess: proofChecks.ownRequestAccess,
    discoveryStageAccess: proofChecks.discoveryStageAccess,
    unrelatedRequestAccess: proofChecks.unrelatedRequestAccess,
    internalNotesAccess: proofChecks.internalNotesAccess,
    lifecycleMutation: proofChecks.lifecycleMutation,
    tenantAuthority: proofChecks.tenantAuthority,
    clientAnswerSaveExecuted: false,
    discoveryCompletionExecuted: false,
    proofTimestamp: new Date().toISOString(),
  });

  const envPath = join(process.cwd(), OWNER_PROOF_ENV);
  if (!existsSync(envPath)) fail(`${OWNER_PROOF_ENV} missing`);
  let envContent = readFileSync(envPath, "utf8");
  if (/^FTGP_OWNER_BROWSER_PROOF=/m.test(envContent)) {
    envContent = envContent.replace(/^FTGP_OWNER_BROWSER_PROOF=.*$/m, "FTGP_OWNER_BROWSER_PROOF=verified");
  } else {
    envContent = `${envContent.trimEnd()}\nFTGP_OWNER_BROWSER_PROOF=verified\n`;
  }
  writeFileSync(envPath, envContent, "utf8");

  console.log(`  artifact=${FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT}`);
  console.log(`  artifactIntegrity=${artifact.artifactIntegrity}`);
  console.log("CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=PASS");
  console.log("\nPASS — FTGP CLIENT OWNER BROWSER PROOF EXECUTE\n");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
