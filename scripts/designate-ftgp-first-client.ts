#!/usr/bin/env tsx
/**
 * FTGP.CLIENT.1 — First-client designation (zero writes).
 * Run: npm run ftgp-first-client:designate
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { EXPECTED_DATABASE_FINGERPRINT } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { resolveFtgpFirstClientDesignation } from "./lib/ftgp-first-client-designation";
import {
  FTGP_FIRST_CLIENT_DESIGNATION_ARTIFACT,
  FTGP_FIRST_CLIENT_OPERATOR_ENV,
  loadFtgpFirstClientOperatorConfig,
  redactEmailForReport,
} from "./lib/ftgp-first-client-operator";

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

  console.log("\n=== FTGP first-client designation (zero writes) ===\n");

  const operator = loadFtgpFirstClientOperatorConfig();
  if (!operator.emailNormalized) {
    stop("READY — FIRST-CLIENT TOOLING PREPARED; ENTER THE CLIENT GMAIL TO CONTINUE");
  }

  console.log(`  designated email: ${redactEmailForReport(operator.emailNormalized)}`);
  console.log(`  provider: ${operator.provider}`);
  console.log(`  request fingerprint: ${operator.requestFingerprint}`);
  console.log(`  transfer authorized: ${operator.transferAuthorized}`);

  const prisma = new PrismaClient();
  try {
    const designation = await resolveFtgpFirstClientDesignation(prisma, operator);

    const artifact = {
      requestFingerprint: operator.requestFingerprint,
      targetFingerprint: designation.targetFingerprint,
      emailFingerprint: designation.emailFingerprint,
      provider: designation.provider,
      accountStatus: designation.accountStatus,
      legalCurrent: designation.legalCurrent,
      emailVerified: designation.emailVerified,
      googleProviderPresent: designation.googleProviderPresent,
      procrowAdminCollision: designation.procrowAdminCollision,
      implementerCollision: designation.implementerCollision,
      currentOwnerFingerprint: designation.currentOwnerFingerprint,
      designationTimestamp: designation.designationTimestamp,
      integrityHash: designation.integrityHash,
      databaseFingerprint: EXPECTED_DATABASE_FINGERPRINT,
    };

    writeFileSync(
      join(process.cwd(), FTGP_FIRST_CLIENT_DESIGNATION_ARTIFACT),
      `${JSON.stringify(artifact, null, 2)}\n`,
      "utf8"
    );

    console.log(`  classification: ${designation.classification}`);

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
      stop(`FTGP_FIRST_CLIENT_DESIGNATION=BLOCKED (${designation.refusal})`);
    }

    ok("FTGP_FIRST_CLIENT_DESIGNATION_ZERO_WRITE=PASS");
    ok("TARGET_GOOGLE_IDENTITY_UNIQUE=true");
    ok("TARGET_PLATFORM_ACCOUNT_UNIQUE=true");
    ok(`target fingerprint=${designation.targetFingerprint}`);
    ok(`artifact=${FTGP_FIRST_CLIENT_DESIGNATION_ARTIFACT}`);
    console.log("\nFTGP_FIRST_CLIENT_DESIGNATION=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
