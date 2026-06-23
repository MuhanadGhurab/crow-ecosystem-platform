#!/usr/bin/env tsx
/**
 * FTGP.CLIENT.1 — Execute atomic Candidate 07 ownership transfer.
 * Run: npm run ftgp-first-client:ownership:execute
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import {
  executeFtgpFirstClientOwnershipTransfer,
  ownerFingerprint,
} from "../src/lib/ftgp/ftgp-first-client-ownership-transfer.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { resolveFtgpFirstClientDesignation } from "./lib/ftgp-first-client-designation";
import { resolveRequestOwnerPlatformAccount } from "./lib/ftgp-first-client-resolution";
import {
  FTGP_FIRST_CLIENT_DESIGNATION_ARTIFACT,
  FTGP_FIRST_CLIENT_OPERATOR_ENV,
  loadFtgpFirstClientOperatorConfig,
  verifyDesignationArtifactIntegrity,
} from "./lib/ftgp-first-client-operator";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function stop(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(2);
}

async function main() {
  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
      FTGP_FIRST_CLIENT_OPERATOR_ENV,
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });
  assertHostedVerificationTarget();

  console.log("\n=== FTGP first-client ownership execute ===\n");

  const operator = loadFtgpFirstClientOperatorConfig();
  if (!operator.emailNormalized) {
    stop("READY — FIRST-CLIENT TOOLING PREPARED; ENTER THE CLIENT GMAIL TO CONTINUE");
  }
  if (!operator.transferAuthorized) {
    stop(
      "READY WITH MANUAL ACTION — FIRST-CLIENT DESIGNATION PASSED; SET OWNERSHIP TRANSFER AUTHORIZATION TO TRUE"
    );
  }

  const artifactPath = join(process.cwd(), FTGP_FIRST_CLIENT_DESIGNATION_ARTIFACT);
  if (!existsSync(artifactPath)) {
    stop(`Run ftgp-first-client:designate first (${FTGP_FIRST_CLIENT_DESIGNATION_ARTIFACT})`);
  }
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8")) as Record<string, unknown>;
  if (!verifyDesignationArtifactIntegrity(artifact)) {
    stop("Designation artifact integrity hash mismatch — rerun designate");
  }

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  if (!requestId) stop("FTGP_FIRST_REQUEST_ID not set");

  const prisma = new PrismaClient();
  try {
    const designation = await resolveFtgpFirstClientDesignation(prisma, {
      ...operator,
      transferAuthorized: false,
    });
    if (!designation.ok || !designation.targetPlatformAccountId) {
      stop(`Designation invalid: ${designation.refusal}`);
    }

    const result = await executeFtgpFirstClientOwnershipTransfer({
      requestId,
      expectedRequestFingerprint: operator.requestFingerprint,
      targetAccountId: designation.targetPlatformAccountId,
      expectedTargetFingerprint: designation.targetFingerprint ?? undefined,
      expectedCurrentOwnerFingerprint: designation.currentOwnerFingerprint,
    });

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner || owner.id !== designation.targetPlatformAccountId) {
      stop("BLOCKED — OWNERSHIP TRANSFER CANNOT PROVE ONE AUTHORITATIVE CANDIDATE OWNER");
    }

    const ownerCount = await prisma.implementationRequest.count({
      where: { id: requestId, submittedByUserId: owner.supabaseUserId },
    });
    if (ownerCount !== 1) {
      stop("BLOCKED — OWNERSHIP TRANSFER CANNOT PROVE ONE AUTHORITATIVE CANDIDATE OWNER");
    }

    console.log(`  transfer type: ${result.transferType}`);
    console.log(`  idempotent: ${result.idempotent}`);
    console.log(`  final owner fingerprint: ${ownerFingerprint(owner.id)}`);

    ok("FTGP_FIRST_CLIENT_OWNERSHIP_EXECUTE=PASS");
    ok("AUTHORITATIVE_OWNER_COUNT=1");
    console.log("\nFTGP_FIRST_CLIENT_OWNERSHIP_EXECUTE=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
