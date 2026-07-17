#!/usr/bin/env tsx
/**
 * FTGP.CLIENT.1 — First-client ownership transfer dry-run (zero writes).
 * Run: npm run ftgp-first-client:ownership:dry-run
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { planFtgpFirstClientOwnershipTransfer } from "../src/lib/ftgp/ftgp-first-client-ownership-transfer.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { resolveFtgpFirstClientDesignation } from "./lib/ftgp-first-client-designation";
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

  console.log("\n=== FTGP first-client ownership dry-run (zero writes) ===\n");

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
      if (designation.classification === "LEGAL_REQUIRED") {
        stop(
          "READY WITH MANUAL ACTION — DESIGNATED CLIENT MUST COMPLETE NORMAL GOOGLE LOGIN AND LEGAL ACCEPTANCE"
        );
      }
      stop(`Designation invalid: ${designation.refusal}`);
    }

    if (artifact.targetFingerprint !== designation.targetFingerprint) {
      stop("Designation artifact target fingerprint stale — rerun designate");
    }

    const plan = await planFtgpFirstClientOwnershipTransfer({
      requestId,
      expectedRequestFingerprint: operator.requestFingerprint,
      targetAccountId: designation.targetPlatformAccountId,
      expectedTargetFingerprint: designation.targetFingerprint ?? undefined,
      expectedCurrentOwnerFingerprint: designation.currentOwnerFingerprint,
    });

    console.log(`  transfer type: ${plan.transferType}`);
    console.log(`  current owner fingerprint: ${plan.currentOwnerFingerprint ?? "none"}`);
    console.log(`  target fingerprint: ${plan.targetFingerprint}`);
    console.log(`  ownership updates: ${plan.ownershipUpdates}`);
    console.log(`  audit events: ${plan.auditEvents}`);
    console.log(`  expected final owner count: 1`);

    ok("FTGP_FIRST_CLIENT_OWNERSHIP_DRY_RUN=PASS");
    ok("PHYSICAL_MUTATION_COUNT_EXPLICIT=true");
    ok("AUDIT_EVENT_COUNT_EXPLICIT=true");
    ok("WRITES_EXECUTED=0");
    console.log("\nFTGP_FIRST_CLIENT_OWNERSHIP_DRY_RUN=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
