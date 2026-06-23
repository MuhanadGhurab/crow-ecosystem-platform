#!/usr/bin/env tsx
/**
 * FTGP.0G — Audited first IMPLEMENTER grant execute (single grant).
 * Run: npm run ftgp-implementer-grant:execute
 */
import { createHash } from "node:crypto";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";

import {
  grantFtgpImplementerRole,
  countActiveImplementerAssignments,
  FTGP_IMPLEMENTER_GRANT_SOURCE,
} from "../src/lib/platform/ftgp-implementer-grant";
import {
  countActivePlatformAdminAssignments,
} from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  assertImplementerManifestPreflight,
  loadImplementerGrantManifest,
} from "./lib/ftgp-implementer-grant-manifest";
import {
  FTGP_IMPLEMENTER_GRANT_EXECUTE_PHRASE,
  validateFtgpImplementerGrantExecuteGates,
} from "./lib/ftgp-implementer-grant-execute-gates";
import { resolveImplementerGrantor } from "./lib/ftgp-implementer-grantor-resolution";
import { captureCloud1hDatabaseBaseline, printCloud1hBaseline } from "./lib/cloud-1h-database-baseline";

const MANIFEST_PATH = ".ftgp-implementer-grant-manifest";
const OPERATOR_ENV_PATH = ".env.ftgp-implementer-grant.operator";

function fail(msg: string): never {
  console.error(`\nFTGP_IMPLEMENTER_GRANT_EXECUTE=FAILED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function runGate(script: string): void {
  execSync(`npm run ${script}`, {
    stdio: "inherit",
    shell: process.platform === "win32",
    timeout: 600_000,
    env: process.env,
  });
}

function assignmentFingerprint(id: string): string {
  return createHash("sha256").update(`ftgp-implementer-assignment:${id}`).digest("hex").slice(0, 16);
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

  console.log("\n=== FTGP IMPLEMENTER grant execute (audited) ===\n");

  const targetAccountId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() || null;
  if (!targetAccountId) fail("FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID required");

  const manifest = loadImplementerGrantManifest();

  const prisma = new PrismaClient();
  let grantorAccountId: string;
  try {
    const grantor = await resolveImplementerGrantor(prisma);
    if (!grantor) fail("verified Platform Admin grantor not found");
    grantorAccountId = grantor.platformAccountId;
  } finally {
    await prisma.$disconnect();
  }

  assertImplementerManifestPreflight(manifest, targetAccountId, grantorAccountId);

  if (process.env.FTGP_IMPLEMENTER_GRANT_EXECUTE_AUTHORIZED !== "true") {
    fail("FTGP_IMPLEMENTER_GRANT_EXECUTE_AUTHORIZED must be true for this task");
  }

  console.log("\n=== Preflight verifiers ===\n");
  runGate("ftgp-implementer-target:verify");
  runGate("ftgp-implementer-grant:dry-run");
  runGate("ftgp-implementer-grant:audit");

  process.env.FTGP_IMPLEMENTER_GRANT_EXECUTE_PHRASE = FTGP_IMPLEMENTER_GRANT_EXECUTE_PHRASE;
  process.env.FTGP_IMPLEMENTER_GRANT_CORRELATION_ID = manifest.correlationId;
  process.env.FTGP_IMPLEMENTER_GRANTOR_ACCOUNT_ID = grantorAccountId;

  const gate = validateFtgpImplementerGrantExecuteGates({
    targetAccountId,
    grantorAccountId,
    correlationId: manifest.correlationId,
    manifestCorrelationId: manifest.correlationId,
    operatorAuthorizationFlag: true,
  });
  if (!gate.allowed) fail(gate.message);
  ok("execute gates satisfied");

  const prisma2 = new PrismaClient();
  try {
    const preBaseline = await captureCloud1hDatabaseBaseline(prisma2);
    printCloud1hBaseline(preBaseline, "Pre-grant baseline");

    if (preBaseline.internalRoleAssignments !== 1) {
      fail(`expected 1 active internal assignment before grant, got ${preBaseline.internalRoleAssignments}`);
    }

    const activeAdminsBefore = await countActivePlatformAdminAssignments();
    const activeImplementersBefore = await countActiveImplementerAssignments();
    if (activeAdminsBefore !== 1) fail(`ACTIVE_PLATFORM_ADMIN expected 1, got ${activeAdminsBefore}`);
    if (activeImplementersBefore !== 0) {
      fail(`ACTIVE_IMPLEMENTER expected 0, got ${activeImplementersBefore}`);
    }

    const existingGrant = await prisma2.platformInternalRoleAssignment.findFirst({
      where: {
        platformAccountId: targetAccountId,
        role: "IMPLEMENTER",
        grantCorrelationId: manifest.correlationId,
      },
    });
    if (existingGrant?.status === "ACTIVE") {
      const idempotent = await grantFtgpImplementerRole({
        targetPlatformAccountId: targetAccountId,
        grantorPlatformAccountId: grantorAccountId,
        correlationId: manifest.correlationId,
      });
      console.log("\n=== Idempotent re-entry (grant already completed) ===\n");
      console.log(`  assignment_fingerprint=${assignmentFingerprint(idempotent.assignmentId)}`);
      console.log("\nFTGP_IMPLEMENTER_GRANT_EXECUTE=PASS (idempotent)\n");
      return;
    }

    console.log("\n=== Executing audited IMPLEMENTER grant ===\n");

    const result = await grantFtgpImplementerRole({
      targetPlatformAccountId: targetAccountId,
      grantorPlatformAccountId: grantorAccountId,
      correlationId: manifest.correlationId,
      reason: process.env.FTGP_IMPLEMENTER_GRANT_REASON?.trim(),
    });

    ok(`assignment created (idempotent=${result.idempotent})`);
    console.log(`  assignment_fingerprint=${assignmentFingerprint(result.assignmentId)}`);
    console.log(`  role=${result.role}`);
    console.log(`  source=${FTGP_IMPLEMENTER_GRANT_SOURCE}`);
    console.log(`  correlation_id=${manifest.correlationId}`);

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma2);
    printCloud1hBaseline(postBaseline, "Post-grant baseline");

    const activeAdmins = await countActivePlatformAdminAssignments();
    const activeImplementers = await countActiveImplementerAssignments();
    if (activeAdmins !== 1) fail(`ACTIVE_PLATFORM_ADMIN_COUNT expected 1, got ${activeAdmins}`);
    if (activeImplementers !== 1) fail(`ACTIVE_IMPLEMENTER_COUNT expected 1, got ${activeImplementers}`);
    if (postBaseline.internalRoleAssignments !== 2) {
      fail(`active internal assignments expected 2, got ${postBaseline.internalRoleAssignments}`);
    }

    const assignment = await prisma2.platformInternalRoleAssignment.findFirst({
      where: {
        platformAccountId: targetAccountId,
        role: "IMPLEMENTER",
        status: "ACTIVE",
      },
    });
    if (!assignment) fail("active IMPLEMENTER assignment not found");
    if (assignment.grantCorrelationId !== manifest.correlationId) {
      fail("assignment correlation mismatch");
    }
    if (assignment.grantedByPlatformAccountId !== grantorAccountId) {
      fail("assignment grantor mismatch");
    }

    const grantAuditDelta =
      postBaseline.internalRoleGrantAuditEvents - preBaseline.internalRoleGrantAuditEvents;
    if (grantAuditDelta !== 1) fail(`IMPLEMENTER_GRANT_AUDIT_EVENT_DELTA expected 1, got ${grantAuditDelta}`);

    const unauthorizedRoles = await prisma2.platformInternalRoleAssignment.count({
      where: {
        status: "ACTIVE",
        role: { in: ["SALES", "AUDITOR_READONLY"] },
      },
    });
    if (unauthorizedRoles > 0) fail(`UNAUTHORIZED_INTERNAL_ASSIGNMENT_COUNT=${unauthorizedRoles}`);

    if (postBaseline.implementationRequests !== 7) fail("implementation_requests changed");
    if (postBaseline.tenantMemberships !== 3) fail("tenant_memberships changed");
    if (postBaseline.clientOrganizationMembers !== 0) fail("client_organization_members changed");

    console.log("\nIMPLEMENTER_ASSIGNMENT_CREATED=PASS");
    console.log("ACTIVE_IMPLEMENTER_COUNT=1");
    console.log("ACTIVE_PLATFORM_ADMIN_COUNT=1");
    console.log("UNAUTHORIZED_INTERNAL_ASSIGNMENT_COUNT=0");
    console.log("IMPLEMENTER_GRANT_AUDIT_EVENT_DELTA=1");
    console.log("IMPLEMENTER_GRANT_WRITES_EXECUTED=true");

    const manifestContent = readFileSync(join(process.cwd(), MANIFEST_PATH), "utf8");
    const updated = manifestContent
      .replace(/^Execution authorized:.*$/m, "Execution authorized: true")
      .replace(/^Grant executed:.*$/m, "Grant executed: true")
      .replace(/^Current active internal assignments:.*$/m, "Current active internal assignments: 2")
      .concat(
        [
          "",
          "Execution attempted: true",
          "Execution succeeded: true",
          "Assignment verified: true",
          "Audit event verified: true",
          "Active PLATFORM_ADMIN count: 1",
          "Active IMPLEMENTER count: 1",
          "Unauthorized assignment count: 0",
        ].join("\n") + "\n"
      );
    writeFileSync(join(process.cwd(), MANIFEST_PATH), updated, "utf8");

    const operatorLines = readFileSync(join(process.cwd(), OPERATOR_ENV_PATH), "utf8")
      .split("\n")
      .filter((line) => !line.startsWith("FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS="));
    operatorLines.push("FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS=2");
    if (!operatorLines.some((l) => l.startsWith("FTGP_IMPLEMENTER_GRANTOR_ACCOUNT_ID="))) {
      operatorLines.push(`FTGP_IMPLEMENTER_GRANTOR_ACCOUNT_ID=${grantorAccountId}`);
    }
    writeFileSync(join(process.cwd(), OPERATOR_ENV_PATH), operatorLines.join("\n") + "\n", "utf8");

    writeFileSync(
      join(process.cwd(), ".env.platform-bootstrap.operator"),
      readFileSync(join(process.cwd(), ".env.platform-bootstrap.operator"), "utf8").replace(
        /^FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS=.*$/m,
        "FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS=2"
      ),
      "utf8"
    );

    console.log("\nFTGP_IMPLEMENTER_GRANT_EXECUTE=PASS\n");
  } finally {
    await prisma2.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
