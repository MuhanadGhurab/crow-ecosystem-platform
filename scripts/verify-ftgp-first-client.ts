#!/usr/bin/env tsx
/**
 * FTGP.CLIENT.1 — Verify first-client designation and ownership state (read-only).
 * Run: npm run ftgp-first-client:verify
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { resolveFtgpFirstClientDesignation } from "./lib/ftgp-first-client-designation";
import {
  assessFtgpClientOwnerEligibility,
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import {
  FTGP_FIRST_CLIENT_OPERATOR_ENV,
  loadFtgpFirstClientOperatorConfig,
  redactEmailForReport,
} from "./lib/ftgp-first-client-operator";
import { requestFingerprint } from "../src/lib/ftgp/ftgp-first-client-ownership-transfer.service";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function stop(msg: string, code = 2): never {
  console.error(`\n${msg}\n`);
  process.exit(code);
}

async function main() {
  if (!existsSync(join(process.cwd(), FTGP_FIRST_CLIENT_OPERATOR_ENV))) {
    stop(`${FTGP_FIRST_CLIENT_OPERATOR_ENV} missing`);
  }

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

  console.log("\n=== FTGP first-client verify (read-only) ===\n");

  const operator = loadFtgpFirstClientOperatorConfig();
  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  if (!requestId) stop("FTGP_FIRST_REQUEST_ID not set");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    stop("designated request is not Candidate 07");
  }

  if (!operator.emailNormalized) {
    console.log("  CLIENT_SELECTION_MODE=EMAIL_DESIGNATION_PENDING");
    stop("READY — FIRST-CLIENT TOOLING PREPARED; ENTER THE CLIENT GMAIL TO CONTINUE");
  }

  console.log(`  designated email: ${redactEmailForReport(operator.emailNormalized)}`);
  console.log(`  CLIENT_SELECTION_MODE=EMAIL_DESIGNATION`);
  console.log(`  FIRST_CLIENT_EMAIL_USED_AS_RUNTIME_AUTHORITY=false`);
  console.log(`  FIRST_CLIENT_AUTHORITY_SOURCE=REQUEST_OWNERSHIP`);

  const prisma = new PrismaClient();
  try {
    const designation = await resolveFtgpFirstClientDesignation(prisma, {
      ...operator,
      transferAuthorized: false,
    });

    console.log(`  designation classification: ${designation.classification}`);
    console.log(`  target fingerprint: ${designation.targetFingerprint ?? "none"}`);
    console.log(`  legal state: ${designation.legalCurrent ? "CURRENT" : "MISSING"}`);

    if (!designation.ok) {
      if (designation.classification === "NOT_ENROLLED") {
        stop(
          "READY WITH MANUAL ACTION — DESIGNATED CLIENT MUST COMPLETE NORMAL GOOGLE LOGIN AND LEGAL ACCEPTANCE"
        );
      }
      if (designation.classification === "LEGAL_REQUIRED") {
        stop(
          "READY WITH MANUAL ACTION — DESIGNATED CLIENT MUST COMPLETE NORMAL GOOGLE LOGIN AND LEGAL ACCEPTANCE"
        );
      }
      if (
        designation.refusal === "procrow_admin_collision" ||
        designation.refusal === "internal_role_collision"
      ) {
        stop("BLOCKED — DESIGNATED FIRST CLIENT COLLIDES WITH PROCROW OR INTERNAL AUTHORITY");
      }
      stop(`FTGP_FIRST_CLIENT_VERIFY=BLOCKED (${designation.refusal})`);
    }

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner) stop("request owner not resolved");

    const ownerFp = ownerFingerprint(owner.id);
    console.log(`  current owner fingerprint: ${ownerFp}`);

    if (owner.id !== designation.targetPlatformAccountId) {
      if (!operator.transferAuthorized) {
        stop(
          "READY WITH MANUAL ACTION — FIRST-CLIENT DESIGNATION PASSED; SET OWNERSHIP TRANSFER AUTHORIZATION TO TRUE"
        );
      }
      stop("designated target does not own Candidate 07 — run ownership:execute");
    }

    if (ownerFp !== designation.targetFingerprint) {
      stop("owner fingerprint mismatch vs designation");
    }

    const eligibility = await assessFtgpClientOwnerEligibility(prisma, owner.id);
    if (!eligibility.eligible) {
      stop(eligibility.refusal ?? "owner ineligible");
    }

    ok("DESIGNATED_CLIENT_MATCHES_REQUEST_OWNER=true");
    ok("mandatory legal acceptance = current");
    ok(`active internal roles = ${eligibility.activeInternalRoleCount}`);
    ok(`FIRST_CLIENT_EQUALS_PROCROW_ADMIN=${designation.procrowAdminCollision}`);
    ok(`FIRST_CLIENT_EQUALS_IMPLEMENTER=${designation.implementerCollision}`);

    if (ownerFp === CANDIDATE_07_OWNER_FINGERPRINT || ownerFp !== designation.targetFingerprint) {
      ok(`owner fingerprint recorded (${ownerFp})`);
    }

    console.log("\nFTGP_FIRST_CLIENT_VERIFY=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
