/**
 * C3.10V — Checkpoint C: post-legal activation authoritative state (read-only).
 * Run after operator accepts legal documents and reaches /account:
 * npm run c3-google-proof-checkpoint-c:verify
 */
import { PrismaClient } from "@prisma/client";
import { EMAIL_VERIFICATION_SOURCES } from "../../src/lib/account/verification-sources";
import {
  collectGoogleProofCheckpointEvidence,
  printCheckpointEvidence,
} from "./lib/c3-google-proof-checkpoint";

function fail(reason: string): never {
  console.error(`\nFAILED — CHECKPOINT C: NEW RETAINED REQUESTER LEGAL OR ACTIVATION DEFECT`);
  console.error(`  reason: ${reason}\n`);
  process.exit(1);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const evidence = await collectGoogleProofCheckpointEvidence(prisma);
    printCheckpointEvidence("C3.10V Checkpoint C (post-legal)", evidence);

    if (evidence.platformAccountCount !== 1) {
      fail(`Expected PlatformAccounts=1, got ${evidence.platformAccountCount}`);
    }
    if (evidence.platformAccountStatus !== "ACTIVE") {
      fail(`Expected PlatformAccount status=ACTIVE, got ${evidence.platformAccountStatus ?? "null"}`);
    }
    if (evidence.onboardingGeneration !== 2) {
      fail(`Expected onboardingGeneration=2, got ${evidence.onboardingGeneration ?? "null"}`);
    }
    if (!evidence.currentTermsAccepted) {
      fail("Current Terms of Service acceptance missing");
    }
    if (!evidence.currentPrivacyAccepted) {
      fail("Current Privacy Notice acceptance missing");
    }
    if (!evidence.currentAupAccepted) {
      fail("Current Acceptable Use Policy acceptance missing");
    }
    if (evidence.currentMandatoryLegalCount !== 3) {
      fail(
        `Expected current mandatory legal count=3, got ${evidence.currentMandatoryLegalCount}`
      );
    }
    if (evidence.emailVerificationSource !== EMAIL_VERIFICATION_SOURCES.GOOGLE_OAUTH_VERIFIED) {
      fail(
        `Expected emailVerificationSource=GOOGLE_OAUTH_VERIFIED, got ${evidence.emailVerificationSource ?? "null"}`
      );
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
      "PASS — CHECKPOINT C: NEW RETAINED REQUESTER LEGAL EVIDENCE AND ACTIVATION PERSISTED\n"
    );
    console.log(`  Retained requester fingerprint: ${evidence.identityFingerprint}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  fail(err instanceof Error ? err.message : String(err));
});
