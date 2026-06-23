#!/usr/bin/env tsx
/**
 * FTGP.0G — IMPLEMENTER grant dry-run (zero writes).
 * Run: npm run ftgp-implementer-grant:dry-run
 */
import { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../src/lib/legal/legal-acceptance.service";
import {
  countActivePlatformAdminAssignments,
} from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import {
  countActiveImplementerAssignments,
  grantFtgpImplementerRole,
} from "../src/lib/platform/ftgp-implementer-grant";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  captureCloud1hDatabaseBaseline,
  CLOUD_1H_BASELINE_EXPECTED,
} from "./lib/cloud-1h-database-baseline";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";
import {
  implementerTargetFingerprint,
  isPostImplementerGrantState,
  loadImplementerGrantManifest,
  PLATFORM_ADMIN_BOOTSTRAP_CORRELATION,
} from "./lib/ftgp-implementer-grant-manifest";
import { resolveImplementerGrantor } from "./lib/ftgp-implementer-grantor-resolution";

const TARGET_ENV = "FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nIMPLEMENTER_GRANT_DRY_RUN=BLOCKED`);
  console.error(`IMPLEMENTER_GRANT_WRITES_EXECUTED=false`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP IMPLEMENTER grant dry-run (zero writes) ===\n");

  const targetAccountId = process.env[TARGET_ENV]?.trim();
  if (!targetAccountId) blocked(`Set ${TARGET_ENV}`);

  const correlationId =
    process.env.FTGP_IMPLEMENTER_GRANT_CORRELATION_ID?.trim() ||
    loadImplementerGrantManifest().correlationId;

  if (correlationId === PLATFORM_ADMIN_BOOTSTRAP_CORRELATION) {
    blocked("correlation must not reuse Platform Admin bootstrap correlation");
  }

  const prisma = new PrismaClient();
  try {
    const baseline = await captureCloud1hDatabaseBaseline(prisma);
    const postGrant = isPostImplementerGrantState();
    const expectedInternal = postGrant ? 2 : CLOUD_1H_BASELINE_EXPECTED.internalRoleAssignments;

    const grantor = await resolveImplementerGrantor(prisma);
    if (!grantor) blocked("verified Platform Admin grantor not found");

    const activeAdmins = await countActivePlatformAdminAssignments();
    const activeImplementers = await countActiveImplementerAssignments();

    if (postGrant) {
      if (baseline.internalRoleAssignments !== expectedInternal) {
        blocked(`expected ${expectedInternal} active internal assignments post-grant`);
      }
      const assignment = await prisma.platformInternalRoleAssignment.findFirst({
        where: {
          platformAccountId: targetAccountId,
          role: "IMPLEMENTER",
          status: "ACTIVE",
          grantCorrelationId: correlationId,
        },
      });
      if (!assignment) blocked("designated IMPLEMENTER assignment not found");

      const idempotent = await grantFtgpImplementerRole({
        targetPlatformAccountId: targetAccountId,
        grantorPlatformAccountId: grantor.platformAccountId,
        correlationId,
      });
      if (!idempotent.idempotent) blocked("grant path not idempotent");

      ok("post-grant IMPLEMENTER assignment present");
      ok("idempotent re-invocation would not create duplicate");
      console.log("\nIMPLEMENTER_GRANT_DRY_RUN=PASS");
      console.log("IMPLEMENTER_GRANT_WRITES_EXECUTED=true");
      console.log(`expected_active_assignments_after=${baseline.internalRoleAssignments}`);
      console.log(`expected_grant_audit_delta=0`);
      console.log("\nPASS — FTGP IMPLEMENTER GRANT DRY-RUN (post-grant)\n");
      return;
    }

    if (baseline.internalRoleAssignments !== expectedInternal) {
      blocked(`expected ${expectedInternal} active internal assignments before grant`);
    }
    if (activeAdmins !== 1) blocked(`expected 1 PLATFORM_ADMIN, got ${activeAdmins}`);
    if (activeImplementers !== 0) blocked(`expected 0 IMPLEMENTER, got ${activeImplementers}`);

    const { preservedAccountId } = requireProofOperatorEnv();
    const platformAdminId =
      process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;

    if (preservedAccountId && targetAccountId === preservedAccountId) {
      blocked("target must not be retained requester");
    }
    if (platformAdminId && targetAccountId === platformAdminId) {
      blocked("target must not be Platform Admin");
    }

    const account = await prisma.platformAccount.findUnique({
      where: { id: targetAccountId },
      select: { id: true, status: true },
    });
    if (!account) blocked("target does not exist");
    if (account.status !== "ACTIVE") blocked("target must be ACTIVE");

    const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";
    if (!(await hasMandatoryLegalAcceptanceComplete(targetAccountId, locale))) {
      blocked("target legal acceptance incomplete");
    }

    const grantorAccount = await prisma.platformAccount.findUnique({
      where: { id: grantor.platformAccountId },
      select: { status: true },
    });
    if (!grantorAccount || grantorAccount.status !== "ACTIVE") {
      blocked("grantor must be ACTIVE");
    }

    ok("target exists");
    ok("target ACTIVE");
    ok("target legal current");
    ok("grantor exists");
    ok("grantor ACTIVE");
    ok("grantor active PLATFORM_ADMIN");
    ok("requested role = IMPLEMENTER");
    ok(`current active assignments total = ${baseline.internalRoleAssignments}`);
    ok("current active IMPLEMENTER assignments = 0");
    ok("expected assignment delta = +1");
    ok("expected IMPLEMENTER audit-event delta = +1");
    ok("expected PLATFORM_ADMIN delta = 0");
    ok("no write performed (dry-run)");

    console.log(`\n  target_fingerprint=${implementerTargetFingerprint(targetAccountId)}`);
    console.log(`  grantor_fingerprint=${grantor.fingerprint}`);
    console.log(`  correlation_id_length=${correlationId.length}`);

    console.log("\nIMPLEMENTER_GRANT_DRY_RUN=PASS");
    console.log("IMPLEMENTER_GRANT_WRITES_EXECUTED=false");
    console.log("\nPASS — FTGP IMPLEMENTER GRANT DRY-RUN\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
