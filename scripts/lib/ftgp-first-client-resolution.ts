import { createHash } from "node:crypto";

import type { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../../src/lib/legal/legal-acceptance.service";
import { resolveProofRequesterPlatformAccount } from "./c3-proof-requester-resolution";

export const FTGP_FIRST_CLIENT_ENV = ".env.ftgp-first-client.operator";
export const FTGP_FIRST_REQUEST_ENV = ".env.ftgp-first-request.operator";

export const CANDIDATE_07_LABEL = "FTGP-REQUEST-CANDIDATE-07";
export const CANDIDATE_07_FINGERPRINT = "9439dd8cc806696e";
export const CANDIDATE_07_OWNER_FINGERPRINT = "876863fe8c15c5c3";
export const RETAINED_REQUESTER_FINGERPRINT = "faf26007ce4a55b9";

export type OwnershipProvenanceClassification =
  | "LEGITIMATE_AUTHORITATIVE_OWNER"
  | "IDENTITY_CONVERGENCE_MISATTRIBUTION"
  | "INTERNAL_OPERATOR_COLLISION"
  | "INELIGIBLE_CLIENT_OWNER"
  | "INSUFFICIENT_OWNERSHIP_EVIDENCE";

export function ownerFingerprint(platformAccountId: string): string {
  return createHash("sha256")
    .update(`ftgp-owner:${platformAccountId}`)
    .digest("hex")
    .slice(0, 16);
}

export function resolveDesignatedFirstClientAccountId(): string | null {
  return process.env.FTGP_FIRST_CLIENT_ACCOUNT_ID?.trim() || null;
}

export async function resolveRequestOwnerPlatformAccount(
  prisma: PrismaClient,
  requestId: string
): Promise<{
  id: string;
  supabaseUserId: string;
  status: string;
  emailNormalized: string;
  createdAt: Date;
  onboardingGeneration: number;
} | null> {
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: { submittedByUserId: true },
  });
  if (!request?.submittedByUserId) return null;
  return prisma.platformAccount.findFirst({
    where: { supabaseUserId: request.submittedByUserId },
    select: {
      id: true,
      supabaseUserId: true,
      status: true,
      emailNormalized: true,
      createdAt: true,
      onboardingGeneration: true,
    },
  });
}

export type FtgpClientOwnerEligibility = {
  eligible: boolean;
  refusal: string | null;
  ownerPlatformAdminCollision: boolean;
  ownerImplementerCollision: boolean;
  ownerTenantCollision: boolean;
  ownerRetainedFixtureCollision: boolean;
  activeInternalRoleCount: number;
  requestOwnershipCount: number;
  clientOrganizationMemberCount: number;
  tenantMembershipCount: number;
  legalCurrent: boolean;
  verifiedProviderIdentity: boolean;
};

export async function assessFtgpClientOwnerEligibility(
  prisma: PrismaClient,
  ownerAccountId: string
): Promise<FtgpClientOwnerEligibility> {
  const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";
  const platformAdminId =
    process.env.PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID?.trim() || null;
  const implementerId = process.env.FTGP_IMPLEMENTER_TARGET_ACCOUNT_ID?.trim() || null;

  const account = await prisma.platformAccount.findUnique({
    where: { id: ownerAccountId },
    select: {
      id: true,
      status: true,
      supabaseUserId: true,
      providerIdentities: { select: { provider: true, emailVerified: true } },
    },
  });
  if (!account) {
    return {
      eligible: false,
      refusal: "owner_missing",
      ownerPlatformAdminCollision: false,
      ownerImplementerCollision: false,
      ownerTenantCollision: false,
      ownerRetainedFixtureCollision: false,
      activeInternalRoleCount: 0,
      requestOwnershipCount: 0,
      clientOrganizationMemberCount: 0,
      tenantMembershipCount: 0,
      legalCurrent: false,
      verifiedProviderIdentity: false,
    };
  }

  const retained = await resolveProofRequesterPlatformAccount(prisma);
  const ownerRetainedFixtureCollision = Boolean(
    retained && retained.id === ownerAccountId
  );
  const ownerPlatformAdminCollision = Boolean(
    platformAdminId && platformAdminId === ownerAccountId
  );
  const ownerImplementerCollision = Boolean(
    implementerId && implementerId === ownerAccountId
  );

  const [
    activeInternalRoleCount,
    requestOwnershipCount,
    clientOrganizationMemberCount,
    tenantMembershipCount,
    legalCurrent,
  ] = await Promise.all([
    prisma.platformInternalRoleAssignment.count({
      where: { platformAccountId: ownerAccountId, status: "ACTIVE" },
    }),
    prisma.implementationRequest.count({
      where: { submittedByUserId: account.supabaseUserId },
    }),
    prisma.clientOrganizationMember.count({
      where: { supabaseUserId: account.supabaseUserId },
    }),
    prisma.tenantMembership.count({
      where: { supabaseUserId: account.supabaseUserId },
    }),
    hasMandatoryLegalAcceptanceComplete(ownerAccountId, locale),
  ]);

  const verifiedProviderIdentity = account.providerIdentities.some(
    (p) => p.emailVerified
  );
  const ownerTenantCollision = tenantMembershipCount > 0;

  let refusal: string | null = null;
  if (account.status !== "ACTIVE") refusal = "owner_not_active";
  else if (!legalCurrent) refusal = "owner_legal_incomplete";
  else if (!verifiedProviderIdentity) refusal = "owner_provider_unverified";
  else if (activeInternalRoleCount > 0) refusal = "owner_has_internal_role";
  else if (ownerPlatformAdminCollision) refusal = "owner_is_platform_admin";
  else if (ownerImplementerCollision) refusal = "owner_is_implementer";
  else if (ownerTenantCollision) refusal = "owner_has_tenant_membership";
  else if (requestOwnershipCount < 1) refusal = "owner_has_no_requests";

  return {
    eligible: refusal === null,
    refusal,
    ownerPlatformAdminCollision,
    ownerImplementerCollision,
    ownerTenantCollision,
    ownerRetainedFixtureCollision,
    activeInternalRoleCount,
    requestOwnershipCount,
    clientOrganizationMemberCount,
    tenantMembershipCount,
    legalCurrent,
    verifiedProviderIdentity,
  };
}
