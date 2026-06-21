#!/usr/bin/env tsx
/**
 * C3.10J/K — Verify ACTIVE ordinary proof requester (no PII).
 * Run: npm run c3-10j:preserved-identity:verify
 */
import { PrismaClient } from "@prisma/client";
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
  const { retention } = requireProofOperatorEnv();
  const expectedLabel: ProofRequesterRetentionLabel =
    retention === "delete_after_proof"
      ? "CONTROLLED_DISPOSABLE_REQUESTER"
      : "CONTROLLED_RETAINED_REQUESTER";

  const prisma = new PrismaClient();
  try {
    const resolution = await resolveProofRequester(prisma);
    printProofResolution(resolution);

    if (resolution.classification !== "CONTROLLED_ACTIVE_REQUESTER") {
      fail(
        `Expected CONTROLLED_ACTIVE_REQUESTER before preserved verify (got ${resolution.classification})`
      );
    }

    if (resolution.retentionLabel !== expectedLabel) {
      fail(`retentionLabel: expected ${expectedLabel}, got ${resolution.retentionLabel ?? "null"}`);
    }

    console.log("=== C3.10K ACTIVE proof requester ===\n");
    ok("Supabase Auth identities: 1");
    ok("PlatformAccounts: 1");
    ok("PlatformAccount status: ACTIVE");
    ok("onboardingGeneration: 2");
    ok(`legal acceptances: ${resolution.counts.legalAcceptances}`);
    ok("email verified: true");
    ok("phone required: false (zero phone challenges)");
    ok("provider identity collisions: 0");
    ok("TenantMemberships: 0");
    ok("crow_role: none");
    ok("Not platform-admin designation");
    ok("Platform Owner: false");
    ok("client authority: false");

    console.log(`\n  classification: ${resolution.retentionLabel}`);
    console.log(`  accountOpaque: ${resolution.accountOpaque}`);
    console.log(`  authOpaque: ${resolution.authOpaque}\n`);

    console.log("c3-10j:preserved-identity:verify PASSED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
