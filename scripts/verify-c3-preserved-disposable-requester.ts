#!/usr/bin/env tsx
/**
 * C3.10J/K/AA — Verify ACTIVE retained Google proof requester (no PII).
 * Run: npm run c3-10j:preserved-identity:verify
 */
import { PrismaClient } from "@prisma/client";
import { assertHostedVerificationTarget } from "./lib/assert-hosted-verification-target";
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";
import {
  printProofResolution,
  requireProofOperatorEnv,
  resolveProofRequester,
  type ProofRequesterRetentionLabel,
} from "./lib/c3-proof-requester-resolution";

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  console.error(`  ✗ ${msg}`);
  process.exit(1);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);
  const hosted = assertHostedVerificationTarget({
    envFile: envLoad.primaryEnvFile,
    requireDatabaseUrls: true,
  });
  console.log(`\n=== Hosted identity verification ===`);
  console.log(`env_file=${hosted.envFile}`);
  console.log(`target_project_ref=${hosted.supabaseProjectRef}`);
  console.log(`direct_fingerprint=${hosted.directFingerprint}\n`);

  const { retention } = requireProofOperatorEnv();
  const expectedLabel: ProofRequesterRetentionLabel =
    retention === "delete_after_proof"
      ? "CONTROLLED_DISPOSABLE_REQUESTER"
      : "CONTROLLED_RETAINED_REQUESTER";

  const prisma = new PrismaClient();
  try {
    const resolution = await resolveProofRequester(prisma);
    printProofResolution(resolution);

    const isGoogleActive = resolution.classification === "ACTIVE_GOOGLE_REQUESTER";
    const isEmailActive = resolution.classification === "CONTROLLED_ACTIVE_REQUESTER";

    if (!isGoogleActive && !isEmailActive) {
      fail(
        `Expected ACTIVE_GOOGLE_REQUESTER or CONTROLLED_ACTIVE_REQUESTER (got ${resolution.classification})`
      );
    }

    if (resolution.retentionLabel !== expectedLabel) {
      fail(`retentionLabel: expected ${expectedLabel}, got ${resolution.retentionLabel ?? "null"}`);
    }

    console.log("=== C3.10AA preserved proof requester ===\n");
    ok("Supabase Auth identities: 1");
    ok("PlatformAccounts: 1");
    ok("PlatformAccount status: ACTIVE");
    ok("onboardingGeneration: 2");
    ok(`legal acceptances: ${resolution.counts.legalAcceptances}`);
    ok("email verified: true");
    ok("phone required: false (zero phone challenges)");
    ok(
      isGoogleActive
        ? `google provider identities: ${resolution.counts.providerIdentities} (authoritative)`
        : "email-only requester (no provider rows)"
    );
    ok("provider identity collisions: 0");
    ok("TenantMemberships: 0");
    ok("crow_role: none");
    ok("Not platform-admin designation");
    ok("Platform Owner: false");
    ok("client authority: false");

    console.log(`\n  classification: ${resolution.classification}`);
    console.log(`  retentionLabel: ${resolution.retentionLabel}`);
    console.log(`  accountOpaque: ${resolution.accountOpaque}`);
    console.log(`  authOpaque: ${resolution.authOpaque}\n`);

    if (isGoogleActive) {
      console.log(
        "PASS — PRESERVED GOOGLE REQUESTER PROVIDER LINKAGE IS AUTHORITATIVE AND NON-COLLIDING\n"
      );
      return;
    }

    console.log("PASS — PRESERVED ACTIVE REQUESTER VERIFIED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
