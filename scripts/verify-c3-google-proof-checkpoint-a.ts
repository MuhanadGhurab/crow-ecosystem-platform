/**
 * C3.10V — Checkpoint A: post-OAuth pre-legal authoritative state (read-only).
 * Run after operator reaches /auth/resolving: npm run c3-google-proof-checkpoint-a:verify
 */
import { PrismaClient } from "@prisma/client";
import { EMAIL_VERIFICATION_SOURCES } from "../src/lib/account/verification-sources";
import {
  collectGoogleProofCheckpointEvidence,
  isPendingLegalCheckpointStatus,
  printCheckpointEvidence,
} from "./lib/c3-google-proof-checkpoint";

function fail(reason: string): never {
  console.error(`\nFAILED — CHECKPOINT A: NEW GOOGLE USER RECONCILIATION OR IDENTITY BINDING DEFECT`);
  console.error(`  reason: ${reason}\n`);
  process.exit(1);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const evidence = await collectGoogleProofCheckpointEvidence(prisma);
    printCheckpointEvidence("C3.10V Checkpoint A (pre-legal)", evidence);

    if (!evidence.googleIdentityPresent) {
      fail("Supabase Google identity not present");
    }
    if (evidence.platformAccountCount !== 1) {
      fail(`Expected PlatformAccounts=1, got ${evidence.platformAccountCount}`);
    }
    if (evidence.profileCount !== 1) {
      fail(`Expected profiles=1, got ${evidence.profileCount}`);
    }
    if (
      !isPendingLegalCheckpointStatus(
        evidence.platformAccountStatus,
        evidence.currentMandatoryLegalCount,
        evidence.emailVerificationSource
      )
    ) {
      fail(
        `PlatformAccount status not pending legal (status=${evidence.platformAccountStatus ?? "null"})`
      );
    }
    if (evidence.onboardingGeneration !== 2) {
      fail(`Expected onboardingGeneration=2, got ${evidence.onboardingGeneration ?? "null"}`);
    }
    if (evidence.emailVerificationSource !== EMAIL_VERIFICATION_SOURCES.GOOGLE_OAUTH_VERIFIED) {
      fail(
        `Expected emailVerificationSource=GOOGLE_OAUTH_VERIFIED, got ${evidence.emailVerificationSource ?? "null"}`
      );
    }
    if (evidence.currentMandatoryLegalCount !== 0) {
      fail(`Expected current mandatory legal acceptances=0, got ${evidence.currentMandatoryLegalCount}`);
    }
    if (evidence.crowRolePresent) {
      fail("crow_role must not be present");
    }
    if (evidence.tenantMembershipCount !== 0) {
      fail(`Expected TenantMemberships=0, got ${evidence.tenantMembershipCount}`);
    }
    if (evidence.emailChallengeCount !== 0) {
      fail(`Expected email challenges=0, got ${evidence.emailChallengeCount}`);
    }
    if (evidence.phoneChallengeCount !== 0) {
      fail(`Expected phone challenges=0, got ${evidence.phoneChallengeCount}`);
    }

    console.log(
      "PASS — CHECKPOINT A: NEW GOOGLE USER RECONCILED TO ONE PENDING-LEGAL REQUESTER\n"
    );
    console.log(
      `  Record verifier fingerprint for browser binding: ${evidence.identityFingerprint}\n`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});
