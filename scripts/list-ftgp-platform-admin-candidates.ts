#!/usr/bin/env tsx
/**
 * FTGP.0F.1 — Operator-only Platform Admin candidate matrix (read-only, zero writes).
 * Run: npm run ftgp-platform-admin-candidates:list
 *
 * Writes `.ftgp-platform-admin-candidates.local.json` (gitignored).
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../src/lib/legal/legal-acceptance.service";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveCloud1hCandidateOperator } from "./lib/cloud-1h-candidate-resolution";
import { requireProofOperatorEnv } from "./lib/c3-proof-requester-resolution";

const OUTPUT_FILE = ".ftgp-platform-admin-candidates.local.json";

type CandidateRow = {
  platformAccountId: string;
  operatorLabel: string;
  accountStatus: string;
  legalAcceptance: "current" | "incomplete";
  providerIdentities: { count: number; providers: string[] };
  emailVerified: boolean;
  requestOwnershipCount: number;
  clientMembershipCount: number;
  tenantMembershipCount: number;
  activeInternalRoles: number;
  accountCreatedAt: string;
  eligibility: "eligible" | "rejected";
  rejectionReason: string | null;
  maskedEmail: string;
};

function operatorLabel(index: number): string {
  return `FTGP-PA-CANDIDATE-${String(index + 1).padStart(2, "0")}`;
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

function fingerprint(id: string): string {
  return createHash("sha256").update(`ftgp-pa-candidate:${id}`).digest("hex").slice(0, 16);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.preview.operator"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  const { preservedAccountId } = requireProofOperatorEnv();
  const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";

  const prisma = new PrismaClient();
  try {
    const excludeIds = new Set<string>();
    if (preservedAccountId) excludeIds.add(preservedAccountId);

    const implementerCandidate = await resolveCloud1hCandidateOperator(
      prisma,
      preservedAccountId ? [preservedAccountId] : []
    );
    if (implementerCandidate) excludeIds.add(implementerCandidate.platformAccountId);

    const accounts = await prisma.platformAccount.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        status: true,
        supabaseUserId: true,
        email: true,
        emailVerifiedAt: true,
        onboardingGeneration: true,
        createdAt: true,
        providerIdentities: {
          select: { provider: true, emailVerified: true },
        },
      },
    });

    const rows: CandidateRow[] = [];
    let eligibleCount = 0;
    let candidateIndex = 0;

    for (const account of accounts) {
      const rejectionReasons: string[] = [];

      if (excludeIds.has(account.id)) {
        if (account.id === preservedAccountId) {
          rejectionReasons.push("retained proof requester");
        } else {
          rejectionReasons.push("candidate IMPLEMENTER operator");
        }
      }

      if (account.status !== "ACTIVE") {
        rejectionReasons.push(`status=${account.status}`);
      }
      if (!account.emailVerifiedAt) {
        rejectionReasons.push("email not verified");
      }
      if (account.onboardingGeneration < 2) {
        rejectionReasons.push(`onboarding generation ${account.onboardingGeneration} < 2`);
      }

      const verifiedProviders = account.providerIdentities.filter((p) => p.emailVerified);
      if (account.providerIdentities.length < 1) {
        rejectionReasons.push("no provider identity");
      } else if (verifiedProviders.length < 1) {
        rejectionReasons.push("no verified provider identity");
      }

      const [
        requestOwnershipCount,
        clientMembershipCount,
        tenantMembershipCount,
        activeInternalRoles,
        legalComplete,
      ] = await Promise.all([
        prisma.implementationRequest.count({
          where: { submittedByUserId: account.supabaseUserId },
        }),
        prisma.clientOrganizationMember.count({
          where: { supabaseUserId: account.supabaseUserId },
        }),
        prisma.tenantMembership.count({
          where: { supabaseUserId: account.supabaseUserId },
        }),
        prisma.platformInternalRoleAssignment.count({
          where: { platformAccountId: account.id, status: "ACTIVE" },
        }),
        hasMandatoryLegalAcceptanceComplete(account.id, locale),
      ]);

      if (requestOwnershipCount > 0) rejectionReasons.push("has implementation request ownership");
      if (clientMembershipCount > 0) rejectionReasons.push("has client organization membership");
      if (tenantMembershipCount > 0) rejectionReasons.push("has tenant membership");
      if (activeInternalRoles > 0) rejectionReasons.push("has active internal role");
      if (!legalComplete) rejectionReasons.push("mandatory legal acceptance incomplete");

      const eligible = rejectionReasons.length === 0;
      if (eligible) eligibleCount += 1;

      rows.push({
        platformAccountId: account.id,
        operatorLabel: eligible ? operatorLabel(candidateIndex++) : `EXCLUDED-${fingerprint(account.id)}`,
        accountStatus: account.status,
        legalAcceptance: legalComplete ? "current" : "incomplete",
        providerIdentities: {
          count: account.providerIdentities.length,
          providers: account.providerIdentities.map((p) => String(p.provider)),
        },
        emailVerified: Boolean(account.emailVerifiedAt),
        requestOwnershipCount,
        clientMembershipCount,
        tenantMembershipCount,
        activeInternalRoles,
        accountCreatedAt: account.createdAt.toISOString(),
        eligibility: eligible ? "eligible" : "rejected",
        rejectionReason: eligible ? null : rejectionReasons.join("; "),
        maskedEmail: maskEmail(account.email),
      });
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      projectRef: "wbwnsndcxrgyqwppurms",
      targetSelectionMode: "EXPLICIT_IMMUTABLE_PLATFORM_ACCOUNT_ID",
      exclusions: {
        retainedRequesterAccountId: preservedAccountId,
        implementerCandidateAccountId: implementerCandidate?.platformAccountId ?? null,
      },
      eligibleCount,
      candidates: rows,
    };

    const outPath = join(process.cwd(), OUTPUT_FILE);
    writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

    console.log("\n=== FTGP Platform Admin candidate matrix (operator-only) ===\n");
    console.log(`  output=${OUTPUT_FILE}`);
    console.log(`  eligible_count=${eligibleCount}`);
    console.log(`  total_accounts=${rows.length}`);
    console.log(`  retained_requester_excluded=${Boolean(preservedAccountId)}`);
    console.log(
      `  implementer_candidate_excluded=${implementerCandidate?.platformAccountId ?? "none"}`
    );

    for (const row of rows.filter((r) => r.eligibility === "eligible")) {
      console.log(
        `\n  ${row.operatorLabel}: id=${row.platformAccountId} email=${row.maskedEmail} created=${row.accountCreatedAt}`
      );
    }

    console.log("\nPASS — candidate matrix written (read-only)\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
