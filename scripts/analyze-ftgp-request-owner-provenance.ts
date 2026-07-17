#!/usr/bin/env tsx
/**
 * FTGP.1C — Operator-only request owner provenance record (read-only).
 * Run: npm run ftgp-request-owner-provenance:analyze
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { resolveProofRequesterPlatformAccount } from "./lib/c3-proof-requester-resolution";
import {
  CANDIDATE_07_FINGERPRINT,
  CANDIDATE_07_LABEL,
  CANDIDATE_07_OWNER_FINGERPRINT,
  RETAINED_REQUESTER_FINGERPRINT,
  assessFtgpClientOwnerEligibility,
  ownerFingerprint,
  type OwnershipProvenanceClassification,
} from "./lib/ftgp-first-client-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

const OUTPUT = ".ftgp-request-owner-provenance.local.json";
const EXPECTED_REQUEST_ID_ENV = "FTGP_FIRST_REQUEST_ID";

function classifyProvenance(input: {
  hasSubmittedByUserId: boolean;
  ownerExists: boolean;
  ownerEligible: boolean;
  ownerInternal: boolean;
  ownerImplementer: boolean;
  ownerPlatformAdmin: boolean;
  duplicateAccountsForEmail: number;
  foreignProviderCollision: boolean;
  ownershipLinkConsistent: boolean;
}): OwnershipProvenanceClassification {
  if (input.ownerPlatformAdmin || input.ownerImplementer || input.ownerInternal) {
    return "INTERNAL_OPERATOR_COLLISION";
  }
  if (!input.hasSubmittedByUserId || !input.ownerExists) {
    return "INSUFFICIENT_OWNERSHIP_EVIDENCE";
  }
  if (input.foreignProviderCollision || input.duplicateAccountsForEmail > 1) {
    return "IDENTITY_CONVERGENCE_MISATTRIBUTION";
  }
  if (!input.ownerEligible) {
    return "INELIGIBLE_CLIENT_OWNER";
  }
  if (input.ownershipLinkConsistent) {
    return "LEGITIMATE_AUTHORITATIVE_OWNER";
  }
  return "INSUFFICIENT_OWNERSHIP_EVIDENCE";
}

async function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  const requestId = process.env[EXPECTED_REQUEST_ID_ENV]?.trim();
  if (!requestId) {
    throw new Error(`${EXPECTED_REQUEST_ID_ENV} required in .env.ftgp-first-request.operator`);
  }
  if (requestFingerprint(requestId) !== CANDIDATE_07_FINGERPRINT) {
    throw new Error("designated request is not Candidate 07");
  }

  const prisma = new PrismaClient();
  try {
    const request = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      include: {
        discoveryProfile: {
          select: {
            status: true,
            enterpriseBlueprint: { select: { proposalStatus: true, tenantId: true } },
          },
        },
        enterpriseBlueprint: { select: { proposalStatus: true, tenantId: true } },
        clientOrganizationRequestLinks: { select: { id: true } },
      },
    });
    if (!request) throw new Error("request not found");

    const owner = request.submittedByUserId
      ? await prisma.platformAccount.findFirst({
          where: { supabaseUserId: request.submittedByUserId },
          include: {
            providerIdentities: {
              select: { provider: true, emailVerified: true, providerUserId: true },
            },
          },
        })
      : null;

    const retained = await resolveProofRequesterPlatformAccount(prisma);
    const retainedFp = retained ? ownerFingerprint(retained.id) : null;

    const duplicateAccountsForEmail = owner
      ? await prisma.platformAccount.count({
          where: { emailNormalized: owner.emailNormalized },
        })
      : 0;

    let foreignProviderCollision = false;
    if (owner) {
      const googleIds = owner.providerIdentities
        .filter((p) => p.provider === "google")
        .map((p) => p.providerUserId);
      if (googleIds.length > 0) {
        const foreign = await prisma.platformProviderIdentity.count({
          where: {
            provider: "google",
            providerUserId: { in: googleIds },
            platformAccountId: { not: owner.id },
          },
        });
        foreignProviderCollision = foreign > 0;
      }
    }

    const eligibility = owner
      ? await assessFtgpClientOwnerEligibility(prisma, owner.id)
      : null;

    const auditEvidenceCount = await prisma.platformAccountAuditEvent.count({
      where: {
        platformAccountId: owner?.id,
        eventType: {
          in: [
            "registration_started",
            "account_activated",
            "legal_acceptance_recorded",
            "provider_identity_linked",
          ],
        },
      },
    });

    const ownershipLinkConsistent = Boolean(
      owner &&
        request.submittedByUserId &&
        owner.supabaseUserId === request.submittedByUserId
    );

    const classification = classifyProvenance({
      hasSubmittedByUserId: Boolean(request.submittedByUserId),
      ownerExists: Boolean(owner),
      ownerEligible: eligibility?.eligible ?? false,
      ownerInternal: (eligibility?.activeInternalRoleCount ?? 0) > 0,
      ownerImplementer: eligibility?.ownerImplementerCollision ?? false,
      ownerPlatformAdmin: eligibility?.ownerPlatformAdminCollision ?? false,
      duplicateAccountsForEmail,
      foreignProviderCollision,
      ownershipLinkConsistent,
    });

    const providerTypes = owner
      ? [...new Set(owner.providerIdentities.map((p) => p.provider))]
      : [];

    const output = {
      generatedAt: new Date().toISOString(),
      hostedDatabaseFingerprint: "0355c17692e2a90d",
      candidateLabel: CANDIDATE_07_LABEL,
      requestFingerprint: CANDIDATE_07_FINGERPRINT,
      ownerFingerprint: owner ? ownerFingerprint(owner.id) : "unknown",
      retainedRequesterFingerprint: retainedFp,
      requestOwnerDiffersFromRetainedFixture: Boolean(
        retained && owner && retained.id !== owner.id
      ),
      retainedRequesterOwnedRequestCount: retained
        ? await prisma.implementationRequest.count({
            where: { submittedByUserId: retained.supabaseUserId },
          })
        : 0,
      publicSafe: {
        candidateLabel: CANDIDATE_07_LABEL,
        requestFingerprint: CANDIDATE_07_FINGERPRINT,
        ownerFingerprint: owner ? ownerFingerprint(owner.id) : "unknown",
        requestStatus: request.status,
        requestCreatedAt: request.createdAt.toISOString(),
        ownerStatus: owner?.status ?? "unknown",
        ownerLegalState: eligibility?.legalCurrent ? "current" : "incomplete",
        ownerCreatedAt: owner?.createdAt.toISOString() ?? null,
        providerIdentityCount: owner?.providerIdentities.length ?? 0,
        providerTypes,
        verifiedProviderIdentity: eligibility?.verifiedProviderIdentity ?? false,
        activeInternalRoleCount: eligibility?.activeInternalRoleCount ?? 0,
        requestOwnershipCount: eligibility?.requestOwnershipCount ?? 0,
        clientOrganizationMemberCount: eligibility?.clientOrganizationMemberCount ?? 0,
        tenantMembershipCount: eligibility?.tenantMembershipCount ?? 0,
        duplicateAccountIndicator: duplicateAccountsForEmail > 1,
        identityConvergenceIndicator: foreignProviderCollision,
        ownershipAuditEvidenceCount: auditEvidenceCount,
        platformAccountMaterializedAfterRequest:
          Boolean(owner) && request.createdAt < owner.createdAt,
        ownershipLinkConsistent,
        submittedByUserIdPresent: Boolean(request.submittedByUserId),
        provenanceClassification: classification,
        clientOwnerEligible: eligibility?.eligible ?? false,
      },
      localOnly: {
        requestId,
        ownerPlatformAccountId: owner?.id ?? null,
        submittedByUserId: request.submittedByUserId,
        retainedRequesterAccountId: retained?.id ?? null,
      },
    };

    writeFileSync(join(process.cwd(), OUTPUT), JSON.stringify(output, null, 2) + "\n", "utf8");

    console.log(`\nWrote ${OUTPUT}`);
    console.log(`  CANDIDATE_07_OWNERSHIP_PROVENANCE=${classification}`);
    console.log(`  retained_requester_fingerprint=${retainedFp ?? "unknown"}`);
    console.log(`  owner_fingerprint=${owner ? ownerFingerprint(owner.id) : "unknown"}`);
    console.log(
      `  REQUEST_OWNER_COLLISION_WITH_RETAINED_FIXTURE=${output.requestOwnerDiffersFromRetainedFixture}`
    );
    console.log(`  CANDIDATE_07_OWNER_CLIENT_ELIGIBLE=${eligibility?.eligible ? "PASS" : "BLOCKED"}`);
    console.log("\nPASS — FTGP REQUEST OWNER PROVENANCE ANALYSIS\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
