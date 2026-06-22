import type { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

export type DedicatedPlatformAdminTargetStatus =
  | "READY"
  | "MISSING"
  | "AMBIGUOUS";

export type DedicatedPlatformAdminTarget = {
  status: DedicatedPlatformAdminTargetStatus;
  platformAccountId: string | null;
  opaqueRef: string | null;
  candidateCount: number;
};

function opaqueRef(stableId: string): string {
  return createHash("sha256")
    .update(`cloud-1h-platform-admin-target:${stableId}`)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Identify a dedicated Platform Admin bootstrap target (not requester, not IMPLEMENTER candidate).
 * Returns immutable PlatformAccount.id only — never email.
 */
export async function resolveDedicatedPlatformAdminTarget(
  prisma: PrismaClient,
  excludeAccountIds: string[]
): Promise<DedicatedPlatformAdminTarget> {
  const exclude = new Set(excludeAccountIds.filter(Boolean));

  const accounts = await prisma.platformAccount.findMany({
    where: {
      status: "ACTIVE",
      onboardingGeneration: { gte: 2 },
      emailVerifiedAt: { not: null },
    },
    select: { id: true, supabaseUserId: true },
    take: 100,
  });

  const eligible: string[] = [];

  for (const account of accounts) {
    if (exclude.has(account.id)) continue;

    const [requests, clientMembers, tenantMemberships, internalRoles, legalCount, providerCount] =
      await Promise.all([
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
        prisma.accountLegalAcceptance.count({
          where: { platformAccountId: account.id },
        }),
        prisma.platformProviderIdentity.count({
          where: { platformAccountId: account.id },
        }),
      ]);

    if (
      requests === 0 &&
      clientMembers === 0 &&
      tenantMemberships === 0 &&
      internalRoles === 0 &&
      legalCount >= 3 &&
      providerCount >= 1
    ) {
      eligible.push(account.id);
    }
  }

  if (eligible.length === 0) {
    return {
      status: "MISSING",
      platformAccountId: null,
      opaqueRef: null,
      candidateCount: 0,
    };
  }

  if (eligible.length > 1) {
    return {
      status: "AMBIGUOUS",
      platformAccountId: null,
      opaqueRef: null,
      candidateCount: eligible.length,
    };
  }

  const id = eligible[0]!;
  return {
    status: "READY",
    platformAccountId: id,
    opaqueRef: opaqueRef(id),
    candidateCount: 1,
  };
}
