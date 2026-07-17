#!/usr/bin/env tsx
/**
 * FTGP.0F.4 — Audited first Platform Admin bootstrap execute (single grant).
 * Run: npm run ftgp-platform-admin-bootstrap:execute
 */
import { createHash } from "node:crypto";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

import { PrismaClient } from "@prisma/client";

import {
  PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV,
} from "../src/lib/platform/platform-internal-role-bootstrap";
import {
  grantInitialPlatformAdminBootstrap,
  countActivePlatformAdminAssignments,
  INITIAL_PLATFORM_ADMIN_BOOTSTRAP_REASON,
  INITIAL_PLATFORM_ADMIN_BOOTSTRAP_SOURCE,
} from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  assertManifestPreflight,
  loadBootstrapManifest,
  EXPECTED_MANIFEST_CORRELATION_ID,
} from "./lib/ftgp-platform-admin-bootstrap-manifest";
import {
  PLATFORM_INTERNAL_ROLE_BOOTSTRAP_EXECUTE_PHRASE,
  validateFtgpPlatformAdminBootstrapExecuteGates,
} from "./lib/ftgp-platform-admin-bootstrap-execute-gates";
import { captureCloud1hDatabaseBaseline, printCloud1hBaseline } from "./lib/cloud-1h-database-baseline";

const MANIFEST_PATH = ".ftgp-platform-admin-bootstrap-manifest";

function fail(msg: string): never {
  console.error(`\nFTGP_PLATFORM_ADMIN_BOOTSTRAP_EXECUTE=FAILED`);
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
  return createHash("sha256").update(`ftgp-pa-assignment:${id}`).digest("hex").slice(0, 16);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator", ".env.platform-bootstrap.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP Platform Admin bootstrap execute (audited) ===\n");

  const targetAccountId =
    process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;
  if (!targetAccountId) {
    fail("PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID required");
  }

  const manifest = loadBootstrapManifest();
  assertManifestPreflight(manifest, targetAccountId);

  if (process.env.FTGP_PLATFORM_ADMIN_BOOTSTRAP_EXECUTE_AUTHORIZED !== "true") {
    fail("FTGP_PLATFORM_ADMIN_BOOTSTRAP_EXECUTE_AUTHORIZED must be true for this task");
  }

  console.log("\n=== Preflight verifiers ===\n");
  runGate("ftgp-platform-admin-target:verify");
  runGate("ftgp-platform-admin-bootstrap:dry-run");
  runGate("ftgp-bootstrap-implementation:audit");

  process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.enabled] = "true";
  process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.targetAccountId] = targetAccountId;
  process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.correlationId] =
    EXPECTED_MANIFEST_CORRELATION_ID;
  process.env[PLATFORM_INTERNAL_ROLE_BOOTSTRAP_ENV.executePhrase] =
    PLATFORM_INTERNAL_ROLE_BOOTSTRAP_EXECUTE_PHRASE;

  const gateEnabled = validateFtgpPlatformAdminBootstrapExecuteGates({
    targetAccountId,
    correlationId: EXPECTED_MANIFEST_CORRELATION_ID,
    manifestCorrelationId: manifest.correlationId,
    operatorAuthorizationFlag: true,
  });
  if (!gateEnabled.allowed) {
    fail(gateEnabled.message);
  }
  ok("execute gates satisfied");

  const prisma = new PrismaClient();
  try {
    const preBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(preBaseline, "Pre-bootstrap baseline");

    if (preBaseline.internalRoleAssignments !== 0) {
      fail(`expected 0 active internal assignments before execute, got ${preBaseline.internalRoleAssignments}`);
    }
    if (preBaseline.implementationRequests !== 7) fail("implementation_requests baseline drift");
    if (preBaseline.tenantMemberships !== 3) fail("tenant_memberships baseline drift");

    const grantEventsForCorrelation = (
      await prisma.platformAccountAuditEvent.findMany({
        where: {
          platformAccountId: targetAccountId,
          eventType: "platform_internal_role_granted",
        },
      })
    ).filter((event) => {
      const meta = event.metadata as Record<string, unknown> | null;
      return meta?.grantCorrelationId === EXPECTED_MANIFEST_CORRELATION_ID;
    });
    if (grantEventsForCorrelation.length > 0) {
      const existing = await grantInitialPlatformAdminBootstrap({
        targetPlatformAccountId: targetAccountId,
        correlationId: EXPECTED_MANIFEST_CORRELATION_ID,
      });
      console.log("\n=== Idempotent re-entry (grant already completed) ===\n");
      console.log(`  assignment_fingerprint=${assignmentFingerprint(existing.assignmentId)}`);
      console.log(`  idempotent=${existing.idempotent}`);
      console.log("\nFTGP_PLATFORM_ADMIN_BOOTSTRAP_EXECUTE=PASS (idempotent)\n");
      return;
    }

    console.log("\n=== Executing audited bootstrap grant ===\n");

    const result = await grantInitialPlatformAdminBootstrap({
      targetPlatformAccountId: targetAccountId,
      correlationId: EXPECTED_MANIFEST_CORRELATION_ID,
      reason: INITIAL_PLATFORM_ADMIN_BOOTSTRAP_REASON,
    });

    ok(`assignment created (idempotent=${result.idempotent})`);
    console.log(`  assignment_fingerprint=${assignmentFingerprint(result.assignmentId)}`);
    console.log(`  role=${result.role}`);
    console.log(`  source=${INITIAL_PLATFORM_ADMIN_BOOTSTRAP_SOURCE}`);
    console.log(`  correlation_id=${EXPECTED_MANIFEST_CORRELATION_ID}`);

    const postBaseline = await captureCloud1hDatabaseBaseline(prisma);
    printCloud1hBaseline(postBaseline, "Post-bootstrap baseline");

    const activeAdmins = await countActivePlatformAdminAssignments();
    if (activeAdmins !== 1) fail(`ACTIVE_PLATFORM_ADMIN_COUNT expected 1, got ${activeAdmins}`);

    const assignment = await prisma.platformInternalRoleAssignment.findFirst({
      where: {
        platformAccountId: targetAccountId,
        role: "PLATFORM_ADMIN",
        status: "ACTIVE",
      },
    });
    if (!assignment) fail("active PLATFORM_ADMIN assignment not found for target");
    if (assignment.grantCorrelationId !== EXPECTED_MANIFEST_CORRELATION_ID) {
      fail("assignment correlation mismatch");
    }

    const grantAuditDelta =
      postBaseline.internalRoleGrantAuditEvents - preBaseline.internalRoleGrantAuditEvents;
    if (grantAuditDelta !== 1) {
      fail(`GRANT_AUDIT_EVENT_DELTA expected 1, got ${grantAuditDelta}`);
    }

    const grantEvents = (
      await prisma.platformAccountAuditEvent.findMany({
        where: {
          platformAccountId: targetAccountId,
          eventType: "platform_internal_role_granted",
        },
      })
    ).filter((event) => {
      const meta = event.metadata as Record<string, unknown> | null;
      return meta?.grantCorrelationId === EXPECTED_MANIFEST_CORRELATION_ID;
    });
    if (grantEvents.length !== 1) {
      fail(`expected exactly one grant audit event for correlation, got ${grantEvents.length}`);
    }

    const unauthorizedRoles = await prisma.platformInternalRoleAssignment.count({
      where: {
        status: "ACTIVE",
        role: { in: ["IMPLEMENTER", "SALES", "AUDITOR_READONLY"] },
      },
    });
    if (unauthorizedRoles > 0) {
      fail(`UNAUTHORIZED_INTERNAL_ASSIGNMENT_COUNT=${unauthorizedRoles}`);
    }

    if (postBaseline.implementationRequests !== 7) fail("implementation_requests changed");
    if (postBaseline.tenantMemberships !== 3) fail("tenant_memberships changed");
    if (postBaseline.clientOrganizationMembers !== 0) fail("client_organization_members changed");

    console.log("\nPLATFORM_ADMIN_ASSIGNMENT_CREATED=PASS");
    console.log("ACTIVE_PLATFORM_ADMIN_COUNT=1");
    console.log("UNAUTHORIZED_INTERNAL_ASSIGNMENT_COUNT=0");
    console.log("GRANT_AUDIT_EVENT_DELTA=1");
    console.log("BOOTSTRAP_WRITES_EXECUTED=true");

    const manifestContent = readFileSync(join(process.cwd(), MANIFEST_PATH), "utf8");
    const updated = manifestContent
      .replace(/^Execution authorized:.*$/m, "Execution authorized: true")
      .replace(/^Grant executed:.*$/m, "Grant executed: true")
      .replace(
        /^Current active internal assignments:.*$/m,
        "Current active internal assignments: 1"
      )
      .concat(
        [
          "",
          "Execution attempted: true",
          "Execution succeeded: true",
          "Assignment verified: true",
          "Audit event verified: true",
          "Active PLATFORM_ADMIN count: 1",
          "Unauthorized assignment count: 0",
        ].join("\n") + "\n"
      );
    writeFileSync(join(process.cwd(), MANIFEST_PATH), updated, "utf8");
    writeFileSync(
      join(process.cwd(), ".env.platform-bootstrap.operator"),
      [
        `PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID=${targetAccountId}`,
        "PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_PURPOSE=DEDICATED_CROW_PLATFORM_OWNER",
        "FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS=1",
      ].join("\n") + "\n",
      "utf8"
    );

    console.log("\nFTGP_PLATFORM_ADMIN_BOOTSTRAP_EXECUTE=PASS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
