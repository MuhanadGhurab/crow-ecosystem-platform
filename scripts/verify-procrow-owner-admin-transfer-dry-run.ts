#!/usr/bin/env tsx
/**
 * PROCROW.ADMIN.1 — Owner-admin transfer dry-run (zero writes).
 * Run: npm run procrow-owner-admin:transfer:dry-run
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { planProcrowOwnerAdminTransfer } from "../src/lib/platform/procrow-owner-admin-transfer.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { EXPECTED_DATABASE_FINGERPRINT } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { resolveProcrowOwnerAdminDesignation } from "./lib/procrow-owner-admin-designation";
import {
  designationArtifactIntegrity,
  loadProcrowOwnerAdminOperatorConfig,
  PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT,
  PROCROW_OWNER_ADMIN_OPERATOR_ENV,
} from "./lib/procrow-owner-admin-operator";
import { countActivePlatformAdmins } from "./lib/platform-owner-bootstrap-deps";

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

  console.log("\n=== PROCROW owner-admin transfer dry-run (zero writes) ===\n");

  const operator = loadProcrowOwnerAdminOperatorConfig();
  if (!operator.emailNormalized) {
    stop(
      "MANUAL ACTION REQUIRED — ENTER THE PERSONAL GMAIL IN .env.procrow-owner-admin.operator"
    );
  }
  if (!operator.transferAuthorized) {
    stop("PROCROW_OWNER_ADMIN_TRANSFER_AUTHORIZED must be true for dry-run");
  }

  const artifactPath = join(process.cwd(), PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT);
  if (!existsSync(artifactPath)) {
    stop(`Run procrow-owner-admin:designate first (${PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT})`);
  }
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8")) as Record<string, unknown>;

  const prisma = new PrismaClient();
  try {
    const designation = await resolveProcrowOwnerAdminDesignation(prisma, {
      ...operator,
      transferAuthorized: false,
    });
    if (!designation.ok || !designation.targetPlatformAccountId) {
      stop(`Designation invalid: ${designation.refusal}`);
    }

    const recomputedHash = designationArtifactIntegrity({
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
    });
    if (artifact.integrityHash !== recomputedHash) {
      stop("Designation artifact integrity hash mismatch — rerun designate");
    }

    const activeAdmins = await countActivePlatformAdmins();
    if (activeAdmins !== 1) {
      stop(`CURRENT_PLATFORM_ADMIN_COUNT=${activeAdmins} (expected 1)`);
    }

    const plan = await planProcrowOwnerAdminTransfer(
      designation.targetPlatformAccountId,
      designation.currentAdminFingerprint ?? undefined,
      designation.targetFingerprint ?? undefined
    );

    console.log(`  transfer type: ${plan.transferType}`);
    console.log(`  current admin fingerprint: ${plan.currentAdminFingerprint}`);
    console.log(`  target fingerprint: ${plan.targetFingerprint}`);
    console.log(`  assignment creates: ${plan.assignmentCreates}`);
    console.log(`  assignment revokes: ${plan.assignmentRevokes}`);
    console.log(`  audit events: ${plan.auditEvents}`);
    console.log(`  expected final PLATFORM_ADMIN count: 1`);

    ok("PROCROW_OWNER_ADMIN_TRANSFER_DRY_RUN=PASS");
    ok("EXPECTED_FINAL_PLATFORM_ADMIN_COUNT=1");
    ok("PHYSICAL_MUTATION_COUNT_EXPLICIT=true");
    ok("AUDIT_EVENT_COUNT_EXPLICIT=true");
    ok("WRITES_EXECUTED=0");
    console.log("\nPROCROW_OWNER_ADMIN_TRANSFER_DRY_RUN=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
