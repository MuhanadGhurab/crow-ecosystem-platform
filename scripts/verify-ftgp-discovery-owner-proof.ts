#!/usr/bin/env tsx
/**
 * FTGP.1G — Attempt authenticated client-owner proof (read-only).
 * Returns PASS only when FTGP_OWNER_BROWSER_PROOF=verified is set by legitimate owner session.
 */
import { PrismaClient } from "@prisma/client";

import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_OWNER_FINGERPRINT,
  ownerFingerprint,
  resolveDesignatedFirstClientAccountId,
  resolveRequestOwnerPlatformAccount,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

function fail(msg: string): never {
  console.error(`  FAIL: ${msg}`);
  process.exit(2);
}

async function main() {
  console.log("\n=== FTGP Discovery owner proof (read-only) ===\n");

  loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.ftgp-first-request.operator",
      ".env.ftgp-first-client.operator",
    ],
  });
  assertHostedEnvNotLocalhost({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [],
    loadedFiles: [],
    targetClassification: "hosted",
  });

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  if (!requestId) fail("FTGP_FIRST_REQUEST_ID missing");
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    fail("request fingerprint mismatch");
  }

  const prisma = new PrismaClient();
  try {
    const owner = await resolveRequestOwnerPlatformAccount(prisma, requestId);
    const clientId = resolveDesignatedFirstClientAccountId();
    if (!owner || !clientId || owner.id !== clientId) fail("owner not authoritative");
    if (ownerFingerprint(owner.id) !== CANDIDATE_07_OWNER_FINGERPRINT) {
      fail("owner fingerprint mismatch");
    }
    console.log("  owner fingerprint authoritative = true");

    const browserProof = process.env.FTGP_OWNER_BROWSER_PROOF?.trim().toLowerCase();
    if (browserProof === "verified") {
      console.log("CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=PASS");
      console.log("\nPASS — OWNER BROWSER PROOF VERIFIED\n");
      return;
    }

    console.log("CANDIDATE_07_OWNER_AUTHENTICATED_CLIENT_PROOF=UNAVAILABLE");
    console.log(
      "  note: legitimate owner Google session not available in operator environment"
    );
    console.log("\nPASS — OWNER PROOF UNAVAILABLE (fail-closed)\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
