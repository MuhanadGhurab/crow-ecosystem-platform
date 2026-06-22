#!/usr/bin/env tsx
/**
 * FTGP.0F.4 — Bootstrap idempotency check (read-only grant path, no second write).
 */
import { PrismaClient } from "@prisma/client";

import {
  grantInitialPlatformAdminBootstrap,
  countActivePlatformAdminAssignments,
} from "../src/lib/platform/platform-internal-role-bootstrap-grant";
import { EXPECTED_MANIFEST_CORRELATION_ID } from "./lib/ftgp-platform-admin-bootstrap-manifest";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator", ".env.platform-bootstrap.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP Platform Admin bootstrap idempotency verify ===\n");

  const targetAccountId =
    process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;
  if (!targetAccountId) {
    console.error("target account ID missing");
    process.exit(2);
  }

  const prisma = new PrismaClient();
  try {
    const beforeAdmins = await countActivePlatformAdminAssignments();
    const beforeGrantEvents = await prisma.platformAccountAuditEvent.count({
      where: { eventType: "platform_internal_role_granted" },
    });

    const result = await grantInitialPlatformAdminBootstrap({
      targetPlatformAccountId: targetAccountId,
      correlationId: EXPECTED_MANIFEST_CORRELATION_ID,
    });

    const afterAdmins = await countActivePlatformAdminAssignments();
    const afterGrantEvents = await prisma.platformAccountAuditEvent.count({
      where: { eventType: "platform_internal_role_granted" },
    });

    if (!result.idempotent) {
      console.error("expected idempotent=true on second invocation");
      process.exit(2);
    }
    if (afterAdmins !== beforeAdmins || afterAdmins !== 1) {
      console.error(`admin count drift: before=${beforeAdmins} after=${afterAdmins}`);
      process.exit(2);
    }
    if (afterGrantEvents !== beforeGrantEvents) {
      console.error("idempotent call created duplicate audit event");
      process.exit(2);
    }

    console.log("  PLATFORM_ADMIN_BOOTSTRAP_IDEMPOTENCY=PASS");
    console.log("  EXPECTED_SECOND_EXECUTION_DELTA=0");
    console.log("\nPASS — FTGP BOOTSTRAP IDEMPOTENCY\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
