#!/usr/bin/env tsx
/**
 * FTGP.1C — Verify designated FTGP client owner eligibility (read-only).
 * Run: npm run ftgp-first-client-owner:verify
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveProofRequesterPlatformAccount } from "./lib/c3-proof-requester-resolution";
import { resolveFtgpFirstClientDesignation } from "./lib/ftgp-first-client-designation";
import {
  CANDIDATE_07_OWNER_FINGERPRINT,
  FTGP_FIRST_CLIENT_ENV,
  RETAINED_REQUESTER_FINGERPRINT,
  assessFtgpClientOwnerEligibility,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import {
  FTGP_FIRST_CLIENT_OPERATOR_ENV,
  loadFtgpFirstClientOperatorConfig,
} from "./lib/ftgp-first-client-operator";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nCANDIDATE_07_OWNER_CLIENT_ELIGIBLE=BLOCKED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

async function main() {
  if (!existsSync(join(process.cwd(), FTGP_FIRST_CLIENT_ENV))) {
    blocked(`${FTGP_FIRST_CLIENT_ENV} missing`);
  }

  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
      FTGP_FIRST_CLIENT_OPERATOR_ENV,
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP first client owner verify (read-only) ===\n");

  const operator = loadFtgpFirstClientOperatorConfig();
  let clientAccountId = resolveDesignatedFirstClientAccountId();

  const prisma = new PrismaClient();
  try {
    const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
    if (!requestId) blocked("FTGP_FIRST_REQUEST_ID not set");

    if (operator.emailNormalized) {
      console.log(`  CLIENT_SELECTION_MODE=EMAIL_DESIGNATION`);
      const designation = await resolveFtgpFirstClientDesignation(prisma, {
        ...operator,
        transferAuthorized: false,
      });
      if (!designation.ok || !designation.targetPlatformAccountId) {
        blocked(designation.refusal ?? "email designation failed");
      }
      clientAccountId = designation.targetPlatformAccountId;
      console.log(`  owner_fingerprint=${designation.targetFingerprint}`);
    } else {
      if (!clientAccountId) {
        const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
        clientAccountId = owner?.id ?? null;
      }
      if (!clientAccountId) {
        blocked("FTGP_FIRST_CLIENT_EMAIL or FTGP_FIRST_CLIENT_ACCOUNT_ID required");
      }
      console.log(`  CLIENT_SELECTION_MODE=REQUEST_OWNER_AUTHORITATIVE`);
      const fp = ownerFingerprint(clientAccountId);
      console.log(`  owner_fingerprint=${fp}`);
    }

    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    if (!owner) blocked("request owner PlatformAccount not resolved");
    if (owner.id !== clientAccountId) {
      blocked("designated client does not match request owner");
    }
    ok("DESIGNATED_CLIENT_MATCHES_REQUEST_OWNER=true");

    const retained = await resolveProofRequesterPlatformAccount(prisma);
    const retainedFp = retained ? ownerFingerprint(retained.id) : "unknown";
    console.log(`  retained_requester_fingerprint=${retainedFp}`);
    console.log(
      `  REQUEST_OWNER_COLLISION_WITH_RETAINED_FIXTURE=${Boolean(retained && retained.id !== owner.id)}`
    );
    if (retainedFp === RETAINED_REQUESTER_FINGERPRINT) {
      ok("retained requester fixture fingerprint preserved");
    }

    const eligibility = await assessFtgpClientOwnerEligibility(prisma, clientAccountId);
    if (!eligibility.eligible) {
      blocked(eligibility.refusal ?? "ineligible");
    }

    ok("PlatformAccount exists");
    ok("status = ACTIVE");
    ok("mandatory legal acceptance = current");
    ok("verified provider identity exists");
    ok(`active internal roles = ${eligibility.activeInternalRoleCount}`);
    ok(`request ownership count = ${eligibility.requestOwnershipCount}`);

    console.log(
      `  OWNER_PLATFORM_ADMIN_COLLISION=${eligibility.ownerPlatformAdminCollision}`
    );
    console.log(`  OWNER_IMPLEMENTER_COLLISION=${eligibility.ownerImplementerCollision}`);
    console.log(`  OWNER_TENANT_COLLISION=${eligibility.ownerTenantCollision}`);

    if (eligibility.ownerPlatformAdminCollision) blocked("platform admin collision");
    if (eligibility.ownerImplementerCollision) blocked("implementer collision");
    if (eligibility.ownerTenantCollision) blocked("tenant collision");

    console.log("\nCANDIDATE_07_OWNER_CLIENT_ELIGIBLE=PASS");
    console.log("\nPASS — FTGP FIRST CLIENT OWNER VERIFIED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
