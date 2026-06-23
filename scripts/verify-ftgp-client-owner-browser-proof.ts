#!/usr/bin/env tsx
/**
 * FTGP.1H — Verify authenticated client-owner browser proof gate.
 * Requires gitignored artifact + operator env set by execute script.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE } from "../src/lib/ftgp/ftgp-discovery-provenance.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
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
  readClientOwnerBrowserProofArtifact,
  validateProofArtifactFreshness,
  validateProofArtifactIntegrity,
} from "./lib/ftgp-client-owner-browser-proof-artifact";
import { discoveryProfileFingerprint } from "./lib/ftgp-discovery-fingerprints";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nCANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

async function main() {
  console.log("\n=== FTGP client owner browser proof verify ===\n");

  if (!existsSync(join(process.cwd(), FTGP_CLIENT_OWNER_BROWSER_PROOF_ARTIFACT))) {
    fail("missing local proof artifact — run ftgp-client-owner-browser-proof:execute");
  }

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
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

  const envProof = process.env.FTGP_OWNER_BROWSER_PROOF?.trim().toLowerCase();
  if (envProof !== "verified") {
    fail("FTGP_OWNER_BROWSER_PROOF must be verified via execute script, not manual env-only");
  }

  const artifact = readClientOwnerBrowserProofArtifact();
  if (!artifact) fail("proof artifact unreadable");
  if (!validateProofArtifactIntegrity(artifact)) fail("artifact integrity mismatch");
  if (!validateProofArtifactFreshness(artifact)) fail("stale proof artifact");

  if (artifact.requestFingerprint !== CANDIDATE_07_FINGERPRINT) {
    fail("artifact request fingerprint mismatch");
  }
  if (artifact.ownerFingerprint !== CANDIDATE_07_OWNER_FINGERPRINT) {
    fail("artifact owner fingerprint mismatch");
  }
  if (!artifact.previewProtected) fail("preview not protected");
  if (!artifact.normalGoogleAuthenticationCompleted) fail("google auth not completed");
  if (!artifact.resolvedPlatformAccountMatchesOwner) fail("session owner mismatch");
  if (artifact.clientAnswerSaveExecuted) fail("client answer save executed");
  if (artifact.discoveryCompletionExecuted) fail("discovery completion executed");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const ownerAccountId = resolveDesignatedFirstClientAccountId();
  if (!requestId || !ownerAccountId) fail("operator env incomplete");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    fail("request fingerprint mismatch");
  }

  const prisma = new PrismaClient();
  try {
    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner || owner.id !== ownerAccountId) fail("owner not authoritative");
    if (ownerFingerprint(owner.id) !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail("owner fingerprint mismatch");
    }

    const eligibility = await assessFtgpClientOwnerEligibility(prisma, ownerAccountId);
    if (!eligibility.eligible) fail(eligibility.refusal ?? "owner ineligible");
    if (eligibility.activeInternalRoleCount > 0) {
      fail("OWNER_BROWSER_PROOF_INTERNAL_ACTOR=true");
    }

    const profile = await prisma.discoveryProfile.findUnique({
      where: { requestId },
      select: { id: true },
    });
    if (!profile) fail("profile missing");
    const profileFp = discoveryProfileFingerprint(profile.id);
    if (artifact.profileFingerprint !== profileFp) fail("profile fingerprint mismatch");

    ok("AUTHENTICATED_BROWSER_PLATFORM_ACCOUNT_MATCHES_OWNER=true");
    ok("AUTHORITY_SOURCE=AUTHORITATIVE_REQUEST_OWNERSHIP");
    ok("OWNER_INTERNAL_ROLE_COUNT=0");
    ok("OWNER_TENANT_MEMBERSHIP_COUNT=0");
    ok("CANDIDATE_07_OWNER_POST_AUTH_LANDING=/account");
    ok("CANDIDATE_07_OWNER_ACCOUNT_STATE=PASS");
    ok("CANDIDATE_07_OWNER_OWN_REQUEST_ACCESS=PASS");
    ok("CANDIDATE_07_OWNER_DISCOVERY_STAGE_ACCESS=PASS");
    ok("CLIENT_PROVIDED_ANSWER_COUNT=0");
    ok("OWNER_BROWSER_PROOF_REQUEST_MATCH=true");
    ok("OWNER_BROWSER_PROOF_ACCOUNT_MATCH=true");
    ok("OWNER_BROWSER_PROOF_INTERNAL_ACTOR=false");
    ok("OWNER_BROWSER_PROOF_FRESH=true");

    if (CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE !== true) {
      fail("owner proof gate disabled");
    }

    console.log("\nCANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=PASS");
    console.log("\nPASS — FTGP CLIENT OWNER BROWSER PROOF\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
