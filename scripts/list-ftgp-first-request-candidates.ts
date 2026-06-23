#!/usr/bin/env tsx
/**
 * FTGP.1A — Operator-only first-request candidate matrix (read-only).
 * Run: npm run ftgp-first-request-candidates:list
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../src/lib/legal/legal-acceptance.service";
import { FTGP_PROCROW_REVIEW_FROM_STATUS } from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveProofRequesterPlatformAccount } from "./lib/c3-proof-requester-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

const OUTPUT = ".ftgp-first-request-candidates.local.json";

type CandidateRow = {
  requestId: string;
  operatorLabel: string;
  requestFingerprint: string;
  ownerAccountFingerprint: string;
  ownerLifecycleState: string;
  ownerLegalState: "current" | "incomplete" | "unknown";
  requestStatus: string;
  submittedAt: string;
  clientOrganizationLinkCount: number;
  tenantLinkCount: number;
  discoveryLinkCount: number;
  blueprintLinkCount: number;
  pricingProposalLinkCount: number;
  archivedOrCancelled: boolean;
  firstFtgpEligibility: "eligible" | "rejected";
  rejectionReason: string | null;
};

function operatorLabel(index: number): string {
  return `FTGP-REQUEST-CANDIDATE-${String(index + 1).padStart(2, "0")}`;
}

function ownerFingerprint(accountId: string): string {
  return createHash("sha256").update(`ftgp-owner:${accountId}`).digest("hex").slice(0, 16);
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";
  const prisma = new PrismaClient();
  try {
    const requesterAccount = await resolveProofRequesterPlatformAccount(prisma);
    const requesterSupabaseUserId = requesterAccount?.supabaseUserId ?? null;
    if (!requesterSupabaseUserId) {
      throw new Error("retained proof requester could not be resolved");
    }

    const requests = await prisma.implementationRequest.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        discoveryProfile: {
          include: {
            enterpriseBlueprint: { select: { id: true, proposalStatus: true, tenantId: true } },
          },
        },
        enterpriseBlueprint: { select: { id: true, proposalStatus: true, tenantId: true } },
        clientOrganizationRequestLinks: { select: { id: true } },
      },
    });

    const rows: CandidateRow[] = [];
    let eligibleCount = 0;

    for (let i = 0; i < requests.length; i++) {
      const req = requests[i]!;
      const rejectionReasons: string[] = [];

      let ownerAccountFingerprint = "unknown";
      let ownerLifecycleState = "unknown";
      let ownerLegalState: CandidateRow["ownerLegalState"] = "unknown";

      if (!req.submittedByUserId) {
        rejectionReasons.push("no authoritative owner (submittedByUserId)");
      } else if (req.submittedByUserId !== requesterSupabaseUserId) {
        rejectionReasons.push("owner is not retained requester");
      }

      if (req.submittedByUserId) {
        const owner = await prisma.platformAccount.findFirst({
          where: { supabaseUserId: req.submittedByUserId },
          select: { id: true, status: true },
        });
        if (!owner) {
          rejectionReasons.push("owner PlatformAccount missing");
        } else {
          ownerAccountFingerprint = ownerFingerprint(owner.id);
          ownerLifecycleState = owner.status;
          if (owner.status !== "ACTIVE") rejectionReasons.push("owner not ACTIVE");
          const legalOk = await hasMandatoryLegalAcceptanceComplete(owner.id, locale);
          ownerLegalState = legalOk ? "current" : "incomplete";
          if (!legalOk) rejectionReasons.push("owner legal incomplete");
        }
      }

      if (req.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
        rejectionReasons.push(`status=${req.status} (expected ${FTGP_PROCROW_REVIEW_FROM_STATUS})`);
      }
      if (req.status === "REJECTED" || req.status === "CANCELLED") {
        rejectionReasons.push("archived or cancelled");
      }

      const blueprint = req.enterpriseBlueprint ?? req.discoveryProfile?.enterpriseBlueprint;
      if (blueprint?.tenantId) rejectionReasons.push("tenant linked");
      if (req.discoveryProfile?.status === "COMPLETED") {
        rejectionReasons.push("discovery completed");
      }
      if (blueprint && blueprint.proposalStatus !== "DRAFT") {
        rejectionReasons.push(`proposal status=${blueprint.proposalStatus}`);
      }

      const tenantMemberships = req.submittedByUserId
        ? await prisma.tenantMembership.count({
            where: { supabaseUserId: req.submittedByUserId },
          })
        : 0;
      if (tenantMemberships > 0) rejectionReasons.push("owner has tenant membership");

      const eligible = rejectionReasons.length === 0;
      if (eligible) eligibleCount += 1;

      rows.push({
        requestId: req.id,
        operatorLabel: operatorLabel(i),
        requestFingerprint: requestFingerprint(req.id),
        ownerAccountFingerprint,
        ownerLifecycleState,
        ownerLegalState,
        requestStatus: req.status,
        submittedAt: req.createdAt.toISOString(),
        clientOrganizationLinkCount: req.clientOrganizationRequestLinks.length,
        tenantLinkCount: blueprint?.tenantId ? 1 : 0,
        discoveryLinkCount: req.discoveryProfile ? 1 : 0,
        blueprintLinkCount: blueprint ? 1 : 0,
        pricingProposalLinkCount:
          blueprint && blueprint.proposalStatus !== "DRAFT" ? 1 : 0,
        archivedOrCancelled: req.status === "REJECTED" || req.status === "CANCELLED",
        firstFtgpEligibility: eligible ? "eligible" : "rejected",
        rejectionReason: eligible ? null : rejectionReasons.join("; "),
      });
    }

    const statusDistribution: Record<string, number> = {};
    for (const req of requests) {
      statusDistribution[req.status] = (statusDistribution[req.status] ?? 0) + 1;
    }

    const output = {
      generatedAt: new Date().toISOString(),
      hostedDatabaseFingerprint: "0355c17692e2a90d",
      requestCount: requests.length,
      eligibleFirstRequestCount: eligibleCount,
      statusDistribution,
      selectionMode: "EXPLICIT_IMMUTABLE_REQUEST_ID",
      candidates: rows.map(({ requestId: _id, ...rest }) => rest),
      localOnlyRequestIds: rows.map((r) => r.requestId),
    };

    writeFileSync(join(process.cwd(), OUTPUT), JSON.stringify(output, null, 2) + "\n", "utf8");

    console.log(`\nWrote ${OUTPUT}`);
    console.log(`  request_count=${requests.length}`);
    console.log(`  ELIGIBLE_FIRST_REQUEST_COUNT=${eligibleCount}`);
    for (const row of rows.filter((r) => r.firstFtgpEligibility === "eligible")) {
      console.log(`  ${row.operatorLabel} fingerprint=${row.requestFingerprint}`);
    }
    console.log("\nPASS — FTGP FIRST REQUEST CANDIDATE MATRIX\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
