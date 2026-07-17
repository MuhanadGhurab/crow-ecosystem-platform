#!/usr/bin/env tsx
/**
 * FTGP.1H — Zero-write client answer capture readiness dry run.
 */
import { PrismaClient } from "@prisma/client";

import { planDiscoveryAnswerWrite } from "../src/lib/ftgp/ftgp-discovery-answer-write.service";
import { FTGP_DISCOVERY_QUESTION_CATALOG_VERSION } from "../src/lib/ftgp/ftgp-discovery-question-catalog";
import { FTGP_PROCROW_REVIEW_TO_STATUS } from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import {
  readClientOwnerBrowserProofArtifact,
  validateProofArtifactFreshness,
  validateProofArtifactIntegrity,
} from "./lib/ftgp-client-owner-browser-proof-artifact";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`\nCLIENT_ANSWER_CAPTURE_READINESS=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

async function main() {
  console.log("\n=== FTGP Discovery client answer dry-run ===\n");

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

  const artifact = readClientOwnerBrowserProofArtifact();
  const envProof = process.env.FTGP_OWNER_BROWSER_PROOF?.trim().toLowerCase() === "verified";
  const ownerProofPass =
    envProof &&
    artifact &&
    validateProofArtifactIntegrity(artifact) &&
    validateProofArtifactFreshness(artifact) &&
    artifact.ownerFingerprint === CANDIDATE_07_OWNER_FINGERPRINT;

  if (!ownerProofPass) fail("authenticated owner proof not PASS");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const ownerAccountId = resolveDesignatedFirstClientAccountId();
  if (!requestId || !ownerAccountId) fail("operator env incomplete");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    fail("request fingerprint mismatch");
  }

  const prisma = new PrismaClient();
  try {
    const request = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      include: { discoveryProfile: true },
    });
    if (!request?.discoveryProfile) fail("profile missing");
    if (request.status !== FTGP_PROCROW_REVIEW_TO_STATUS) fail(`status=${request.status}`);
    if (request.discoveryProfile.status !== "IN_PROGRESS") fail("profile not IN_PROGRESS");

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner || owner.id !== ownerAccountId) fail("owner mismatch");
    if (ownerFingerprint(owner.id) !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail("owner fingerprint mismatch");
    }

    ok("request status = UNDER_DISCOVERY");
    ok("DiscoveryProfile status = IN_PROGRESS");
    ok("authenticated owner proof = PASS");
    ok("owner matches request = true");
    ok("selected question = none");
    ok("answer payload = none");

    const hypothetical = await planDiscoveryAnswerWrite({
      requestId,
      discoveryProfileId: request.discoveryProfile.id,
      actorPlatformAccountId: ownerAccountId,
      sectionKey: "client_discovery",
      questionKey: "industryTemplate",
      questionVersion: FTGP_DISCOVERY_QUESTION_CATALOG_VERSION,
      correlationId: "ftgp-1h-readiness-hypothetical",
      provenance: "client_owner",
      ownerBrowserProofVerified: true,
    });

    if (!hypothetical.allowed) {
      fail(`client answer not technically eligible: ${hypothetical.refusal}`);
    }
    ok("client answer capture technically eligible = true");
    ok("execution authorization = false");
    ok("writes executed = 0");
    ok("lifecycle delta = 0");

    console.log("\nCLIENT_ANSWER_CAPTURE_READINESS=PASS");
    console.log("CLIENT_ANSWER_CAPTURE_AUTHORIZED=false");
    console.log("DISCOVERY_CLIENT_ANSWER_WRITES_EXECUTED=false");
    console.log("\nPASS — FTGP CLIENT ANSWER READINESS DRY-RUN\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
