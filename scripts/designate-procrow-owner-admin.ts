#!/usr/bin/env tsx
/**
 * PROCROW.ADMIN.1 — Owner-admin designation (zero writes).
 * Run: npm run procrow-owner-admin:designate
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { EXPECTED_DATABASE_FINGERPRINT } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { resolveProcrowOwnerAdminDesignation } from "./lib/procrow-owner-admin-designation";
import {
  loadProcrowOwnerAdminOperatorConfig,
  PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT,
  PROCROW_OWNER_ADMIN_OPERATOR_ENV,
  redactEmailForReport,
} from "./lib/procrow-owner-admin-operator";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function stop(msg: string, code = 2): never {
  console.error(`\n${msg}\n`);
  process.exit(code);
}

async function main() {
  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-first-request.operator",
      PROCROW_OWNER_ADMIN_OPERATOR_ENV,
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });
  assertHostedVerificationTarget();

  console.log("\n=== PROCROW owner-admin designation (zero writes) ===\n");

  const operator = loadProcrowOwnerAdminOperatorConfig();
  if (!operator.emailNormalized) {
    stop(
      "MANUAL ACTION REQUIRED — ENTER THE PERSONAL GMAIL IN .env.procrow-owner-admin.operator"
    );
  }

  console.log(`  designated email: ${redactEmailForReport(operator.emailNormalized)}`);
  console.log(`  provider: ${operator.provider}`);
  console.log(`  transfer authorized: ${operator.transferAuthorized}`);

  const prisma = new PrismaClient();
  try {
    const designation = await resolveProcrowOwnerAdminDesignation(prisma, operator);

    const artifact = {
      targetFingerprint: designation.targetFingerprint,
      provider: designation.provider,
      accountStatus: designation.accountStatus,
      legalCurrent: designation.legalCurrent,
      emailVerified: designation.emailVerified,
      googleProviderPresent: designation.googleProviderPresent,
      currentAdminMatch: designation.currentAdminMatch,
      candidate07Collision: designation.candidate07Collision,
      retainedRequesterCollision: designation.retainedRequesterCollision,
      implementerCollision: designation.implementerCollision,
      currentAdminFingerprint: designation.currentAdminFingerprint,
      designationTimestamp: designation.designationTimestamp,
      integrityHash: designation.integrityHash,
      databaseFingerprint: EXPECTED_DATABASE_FINGERPRINT,
    };

    writeFileSync(
      join(process.cwd(), PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT),
      `${JSON.stringify(artifact, null, 2)}\n`,
      "utf8"
    );

    if (!designation.ok) {
      if (designation.refusal === "account_not_found") {
        stop(
          "MANUAL ACTION REQUIRED — SIGN IN NORMALLY WITH THE DESIGNATED GMAIL AND COMPLETE LEGAL ACCEPTANCE"
        );
      }
      if (designation.refusal === "candidate_07_collision") {
        stop("BLOCKED — DESIGNATED ACCOUNT COLLIDES WITH THE FTGP CLIENT OWNER OR RETAINED REQUESTER");
      }
      if (designation.refusal === "retained_requester_collision") {
        stop("BLOCKED — DESIGNATED ACCOUNT COLLIDES WITH THE FTGP CLIENT OWNER OR RETAINED REQUESTER");
      }
      stop(`PROCROW_OWNER_ADMIN_DESIGNATION=BLOCKED (${designation.refusal})`);
    }

    ok("PROCROW_OWNER_ADMIN_DESIGNATION_ZERO_WRITE=PASS");
    ok(`TARGET_GOOGLE_IDENTITY_UNIQUE=true`);
    ok(`TARGET_PLATFORM_ACCOUNT_UNIQUE=true`);
    ok(`TARGET_EMAIL_VERIFIED=${designation.emailVerified}`);
    ok(`target fingerprint=${designation.targetFingerprint}`);
    ok(`artifact=${PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT}`);
    console.log("\nPROCROW_OWNER_ADMIN_DESIGNATION=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
