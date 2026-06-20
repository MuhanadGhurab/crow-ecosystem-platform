#!/usr/bin/env npx tsx
/**
 * C3.8 — Identity reset dry-run manifest (read-only census).
 * Defaults to dry-run; never deletes data.
 */
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";

import { PrismaClient } from "@prisma/client";

import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./lib/database-fingerprint";
import { FORBIDDEN_HOSTED_SUPABASE_REFS } from "./lib/local-database-safety";

const EXECUTE_PHRASE = process.env.IDENTITY_RESET_EXECUTE_PHRASE ?? "";
const MODE = process.argv.includes("--execute") ? "execute" : "plan";
const BACKUP_CHECKSUM = process.env.IDENTITY_RESET_BACKUP_CHECKSUM?.trim() ?? "";

type Classification =
  | "SAFE_TO_HARD_DELETE_TEST_IDENTITY"
  | "DEACTIVATE_AND_ARCHIVE"
  | "TRANSFER_OWNERSHIP_THEN_DELETE"
  | "KEEP_SYSTEM_OWNER"
  | "MANUAL_REVIEW_REQUIRED";

function redactCount(label: string, count: number): string {
  return `${label}: ${count}`;
}

async function main() {
  if (MODE === "execute") {
    console.error("identity-reset:execute is not authorized in C3.8.");
    console.error("Set IDENTITY_RESET_EXECUTE_PHRASE to the product-owner GO phrase in a later phase.");
    process.exit(1);
  }

  if (process.env.VERCEL === "1") {
    console.error("Refusing identity reset tooling on Vercel build/runtime.");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL ?? "";
  const fp = fingerprintDatabaseUrl(dbUrl);
  if (fp.supabaseProjectRef && FORBIDDEN_HOSTED_SUPABASE_REFS.has(fp.supabaseProjectRef)) {
    console.error("Refusing census against documented Preview/Production Supabase ref.");
    process.exit(1);
  }

  if (!BACKUP_CHECKSUM) {
    console.warn("WARN: IDENTITY_RESET_BACKUP_CHECKSUM not set — dry-run only, no reset authorization.");
  }

  const prisma = new PrismaClient();

  try {
    const [
      platformAccounts,
      profiles,
      emailChallenges,
      phoneChallenges,
      legalAcceptances,
      auditEvents,
      providerIdentities,
    ] = await Promise.all([
      prisma.platformAccount.count(),
      prisma.platformAccountProfile.count(),
      prisma.emailVerificationChallenge.count(),
      prisma.phoneVerificationChallenge.count(),
      prisma.accountLegalAcceptance.count(),
      prisma.platformAccountAuditEvent.count(),
      prisma.platformProviderIdentity.count(),
    ]);

    const statusBreakdown = await prisma.platformAccount.groupBy({
      by: ["status"],
      _count: { _id: true },
    });

    const generationBreakdown = await prisma.platformAccount.groupBy({
      by: ["onboardingGeneration"],
      _count: { _id: true },
    });

    const manifest = {
      mode: "dry-run",
      database: maskDatabaseTarget(dbUrl),
      backupChecksumProvided: Boolean(BACKUP_CHECKSUM),
      executePhraseProvided: Boolean(EXECUTE_PHRASE),
      crowIdentity: {
        platformAccounts,
        profiles,
        emailVerificationChallenges: emailChallenges,
        phoneVerificationChallenges: phoneChallenges,
        legalAcceptances,
        auditEvents,
        providerIdentities,
        statusBreakdown: statusBreakdown.map((r) => ({
          status: r.status,
          count: r._count._id,
        })),
        generationBreakdown: generationBreakdown.map((r) => ({
          generation: r.onboardingGeneration,
          count: r._count._id,
        })),
      },
      classificationSummary: {
        SAFE_TO_HARD_DELETE_TEST_IDENTITY: 0,
        DEACTIVATE_AND_ARCHIVE: platformAccounts,
        TRANSFER_OWNERSHIP_THEN_DELETE: 0,
        KEEP_SYSTEM_OWNER: 0,
        MANUAL_REVIEW_REQUIRED: 0,
      } satisfies Record<Classification, number>,
      notes: [
        "No emails, phones, tokens, or OTP values included.",
        "Supabase Auth census requires SUPABASE_SERVICE_ROLE_KEY — run auth:list-users separately.",
        "Storage ownership blockers require manual Supabase Storage audit.",
        "Classification counts are conservative until operator review.",
      ],
    };

    const serialized = JSON.stringify(manifest, null, 2);
    const digest = createHash("sha256").update(serialized).digest("hex");

    console.log(serialized);
    console.error(`\nmanifest_sha256=${digest}`);
    console.error(redactCount("platform_accounts", platformAccounts));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
