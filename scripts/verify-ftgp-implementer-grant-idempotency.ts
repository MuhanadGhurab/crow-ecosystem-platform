#!/usr/bin/env tsx
/**
 * FTGP.0G — IMPLEMENTER grant idempotency check (read-only grant path, no second write).
 */
import { PrismaClient } from "@prisma/client";

import {
  grantFtgpImplementerRole,
  countActiveImplementerAssignments,
} from "../src/lib/platform/ftgp-implementer-grant";
import { countActivePlatformAdminAssignments } from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import { loadImplementerGrantManifest } from "./lib/ftgp-implementer-grant-manifest";
import { resolveImplementerGrantor } from "./lib/ftgp-implementer-grantor-resolution";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";

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

  console.log("\n=== FTGP IMPLEMENTER grant idempotency verify ===\n");

  const targetAccountId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() || null;
  if (!targetAccountId) {
    console.error("target account ID missing");
    process.exit(2);
  }

  const manifest = loadImplementerGrantManifest();
  const prisma = new PrismaClient();
  try {
    const grantor = await resolveImplementerGrantor(prisma);
    if (!grantor) {
      console.error("grantor not found");
      process.exit(2);
    }

    const beforeAdmins = await countActivePlatformAdminAssignments();
    const beforeImplementers = await countActiveImplementerAssignments();
    const beforeGrantEvents = await prisma.platformAccountAuditEvent.count({
      where: { eventType: "platform_internal_role_granted" },
    });

    const result = await grantFtgpImplementerRole({
      targetPlatformAccountId: targetAccountId,
      grantorPlatformAccountId: grantor.platformAccountId,
      correlationId: manifest.correlationId,
    });

    const afterAdmins = await countActivePlatformAdminAssignments();
    const afterImplementers = await countActiveImplementerAssignments();
    const afterGrantEvents = await prisma.platformAccountAuditEvent.count({
      where: { eventType: "platform_internal_role_granted" },
    });

    if (!result.idempotent) {
      console.error("expected idempotent=true on second invocation");
      process.exit(2);
    }
    if (afterAdmins !== beforeAdmins || afterAdmins !== 1) {
      console.error(`PLATFORM_ADMIN count drift: before=${beforeAdmins} after=${afterAdmins}`);
      process.exit(2);
    }
    if (afterImplementers !== beforeImplementers || afterImplementers !== 1) {
      console.error(`IMPLEMENTER count drift: before=${beforeImplementers} after=${afterImplementers}`);
      process.exit(2);
    }
    if (afterGrantEvents !== beforeGrantEvents) {
      console.error("idempotent call created duplicate audit event");
      process.exit(2);
    }

    const duplicateActive = await prisma.platformInternalRoleAssignment.count({
      where: {
        platformAccountId: targetAccountId,
        role: "IMPLEMENTER",
        status: "ACTIVE",
      },
    });
    if (duplicateActive !== 1) {
      console.error(`DUPLICATE_ACTIVE_IMPLEMENTER_ASSIGNMENTS=${duplicateActive}`);
      process.exit(2);
    }

    console.log("  IMPLEMENTER_GRANT_IDEMPOTENCY=PASS");
    console.log("  EXPECTED_SECOND_EXECUTION_DELTA=0");
    console.log("  DUPLICATE_ACTIVE_IMPLEMENTER_ASSIGNMENTS=0");
    console.log("\nPASS — FTGP IMPLEMENTER GRANT IDEMPOTENCY\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
