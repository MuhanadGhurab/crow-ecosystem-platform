/**
 * C3.10L / C3.10V — Pre-OAuth Google identity inspection (no PII).
 * Run: npm run c3-google-proof-identity:verify
 */
import { PrismaClient } from "@prisma/client";
import {
  printGoogleProofResolution,
  resolveGoogleProofIdentity,
  type GoogleProofIdentityResolution,
} from "./lib/c3-google-proof-identity-resolution";

function assertZeroCensus(resolution: GoogleProofIdentityResolution): void {
  const { counts, state } = resolution;
  const zeros: Array<[string, number]> = [
    ["supabaseAuthUsers", counts.supabaseAuthUsers],
    ["platformAccounts", counts.platformAccounts],
    ["profiles", counts.profiles],
    ["legalAcceptances", counts.legalAcceptances],
    ["googleProviderIdentities", counts.googleProviderIdentities],
    ["tenantMemberships", counts.tenantMemberships],
    ["emailChallenges", counts.emailChallenges],
    ["phoneChallenges", counts.phoneChallenges],
    ["clientRequests", counts.clientRequests],
    ["operationalOwnershipRefs", counts.operationalOwnershipRefs],
  ];
  for (const [label, value] of zeros) {
    if (value !== 0) {
      throw new Error(`Pre-OAuth census: expected ${label}=0, got ${value}`);
    }
  }
  if (state.crowRole) {
    throw new Error("Pre-OAuth census: crow_role must be none");
  }
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const resolution = await resolveGoogleProofIdentity(prisma);
    printGoogleProofResolution(resolution);

    if (!resolution.mayProceed) {
      console.error(
        `STOP — Google proof identity classification ${resolution.classification} is not eligible for OAuth proof`
      );
      process.exit(1);
    }

    if (resolution.classification === "NO_EXISTING_IDENTITY") {
      assertZeroCensus(resolution);
      if (resolution.retentionPolicy !== "retain_after_proof") {
        console.warn(
          "  ⚠ C3_PROOF_ACCOUNT_RETENTION is not retain_after_proof — new requester may be cleaned up after proof"
        );
      }
      console.log(
        "PASS — NEW GOOGLE PROOF EMAIL HAS NO EXISTING CROW IDENTITY (NO_EXISTING_IDENTITY)\n"
      );
      return;
    }

    console.log("PASS — Google proof identity eligible for controlled OAuth journey\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
