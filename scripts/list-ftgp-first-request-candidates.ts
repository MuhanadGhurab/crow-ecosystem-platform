#!/usr/bin/env tsx
/**
 * FTGP.1C — Operator-only first-request candidate matrix (read-only).
 * Run: npm run ftgp-first-request-candidates:list
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { FTGP_PROCROW_REVIEW_FROM_STATUS } from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveProofRequesterPlatformAccount } from "./lib/c3-proof-requester-resolution";
import {
  assessFtgpClientOwnerEligibility,
  ownerFingerprint,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

const OUTPUT = ".ftgp-first-request-candidates.local.json";

type CandidateRow = {
  requestId: string;
  operatorLabel: string;
  requestFingerprint: string;
  ownerAccountFingerprint: string;
  ownerLifecycleState: string;
  ownerLegalState: "current" | "incomplete" | "unknown";
  ownerDiffersFromRetainedFixture: boolean;
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

  const prisma = new PrismaClient();
  try {
    const retained = await resolveProofRequesterPlatformAccount(prisma);

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
      let ownerDiffersFromRetainedFixture = false;

      if (!req.submittedByUserId) {
        rejectionReasons.push("no authoritative owner (submittedByUserId)");
      }

      let ownerId: string | null = null;
      if (req.submittedByUserId) {
        const owner = await prisma.platformAccount.findFirst({
          where: { supabaseUserId: req.submittedByUserId },
          select: { id: true, status: true },
        });
        if (!owner) {
          rejectionReasons.push("owner PlatformAccount missing");
        } else {
          ownerId = owner.id;
          ownerAccountFingerprint = ownerFingerprint(owner.id);
          ownerLifecycleState = owner.status;
          ownerDiffersFromRetainedFixture = Boolean(retained && retained.id !== owner.id);

          const eligibility = await assessFtgpClientOwnerEligibility(prisma, owner.id);
          ownerLegalState = eligibility.legalCurrent ? "current" : "incomplete";
          if (!eligibility.eligible) {
            rejectionReasons.push(eligibility.refusal ?? "owner ineligible");
          }
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

      const eligible = rejectionReasons.length === 0 && ownerId !== null;
      if (eligible) eligibleCount += 1;

      rows.push({
        requestId: req.id,
        operatorLabel: operatorLabel(i),
        requestFingerprint: requestFingerprint(req.id),
        ownerAccountFingerprint,
        ownerLifecycleState,
        ownerLegalState,
        ownerDiffersFromRetainedFixture,
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
      clientPolicy: "EXPLICIT_AUTHORITATIVE_OWNER",
      retainedRequesterFixtureDecoupled: true,
      statusDistribution,
      selectionMode: "EXPLICIT_IMMUTABLE_REQUEST_ID",
      candidates: rows.map(({ requestId: _id, ...rest }) => rest),
      localOnlyRequestIds: rows.map((r) => r.requestId),
    };

    writeFileSync(join(process.cwd(), OUTPUT), JSON.stringify(output, null, 2) + "\n", "utf8");

    console.log(`\nWrote ${OUTPUT}`);
    console.log(`  request_count=${requests.length}`);
    console.log(`  ELIGIBLE_FIRST_REQUEST_COUNT=${eligibleCount}`);
    console.log(`  FTGP_CLIENT_POLICY=EXPLICIT_AUTHORITATIVE_OWNER`);
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
