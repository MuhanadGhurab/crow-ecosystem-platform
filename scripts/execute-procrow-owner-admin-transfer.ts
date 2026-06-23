#!/usr/bin/env tsx
/**
 * PROCROW.ADMIN.1 — Execute atomic owner-admin transfer.
 * Run: npm run procrow-owner-admin:transfer:execute
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";

import {
  executeProcrowOwnerAdminTransfer,
  planProcrowOwnerAdminTransfer,
} from "../src/lib/platform/procrow-owner-admin-transfer.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { EXPECTED_DATABASE_FINGERPRINT } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import { resolveProcrowOwnerAdminDesignation } from "./lib/procrow-owner-admin-designation";
import {
  designationArtifactIntegrity,
  loadProcrowOwnerAdminOperatorConfig,
  PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT,
  PROCROW_OWNER_ADMIN_OPERATOR_ENV,
  verifyDesignationArtifactIntegrity,
} from "./lib/procrow-owner-admin-operator";
import { countActivePlatformAdmins } from "./lib/platform-owner-bootstrap-deps";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function stop(msg: string): never {
  console.error(`\n${msg}\n`);
  process.exit(2);
}

function assertCleanFeatureBranch() {
  const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();
  if (branch !== "feat/first-tenant-golden-path") {
    stop(`Expected branch feat/first-tenant-golden-path, got ${branch}`);
  }
  const status = execSync("git status --porcelain", { encoding: "utf8" }).trim();
  if (status) {
    stop("Working tree must be clean before execute");
  }
}

async function main() {
  assertCleanFeatureBranch();

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

  console.log("\n=== PROCROW owner-admin transfer execute ===\n");

  const operator = loadProcrowOwnerAdminOperatorConfig();
  if (!operator.emailNormalized) {
    stop(
      "MANUAL ACTION REQUIRED — ENTER THE PERSONAL GMAIL IN .env.procrow-owner-admin.operator"
    );
  }
  if (!operator.transferAuthorized) {
    stop("PROCROW_OWNER_ADMIN_TRANSFER_AUTHORIZED must be true for execute");
  }

  const artifactPath = join(process.cwd(), PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT);
  if (!existsSync(artifactPath)) {
    stop(`Designation artifact missing: ${PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT}`);
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

    if (!verifyDesignationArtifactIntegrity(artifact)) {
      stop("Designation artifact integrity hash mismatch");
    }

    if (artifact.targetFingerprint !== designation.targetFingerprint) {
      stop("Designation artifact target fingerprint stale");
    }

    const activeAdmins = await countActivePlatformAdmins();
    if (activeAdmins !== 1) {
      stop(`CURRENT_PLATFORM_ADMIN_COUNT=${activeAdmins}`);
    }

    const plan = await planProcrowOwnerAdminTransfer(
      designation.targetPlatformAccountId,
      designation.currentAdminFingerprint ?? undefined,
      designation.targetFingerprint ?? undefined
    );

    const result = await executeProcrowOwnerAdminTransfer(
      designation.targetPlatformAccountId,
      designation.currentAdminFingerprint ?? undefined,
      designation.targetFingerprint ?? undefined
    );

    const postAdmins = await countActivePlatformAdmins();
    if (postAdmins !== 1) {
      stop(`FAILED — TRANSFER LEFT ZERO OR MULTIPLE ACTIVE PLATFORM ADMINS (${postAdmins})`);
    }

    ok(`transfer type=${result.transferType}`);
    ok(`PROCROW_OWNER_ADMIN_TRANSFER_ATOMIC=true`);
    ok(`AUTH_METADATA_CHANGED=false`);
    console.log("\nPROCROW_OWNER_ADMIN_TRANSFER_EXECUTE=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
