import type { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

export type Cloud1hCandidateResolution = {
  platformAccountId: string;
  opaqueRef: string;
};

function opaqueRef(stableId: string): string {
  return createHash("sha256")
    .update(`cloud-1h-candidate:${stableId}`)
    .digest("hex")
    .slice(0, 16);
}

/** Resolve pre-grant candidate operator (ACTIVE, legal current, zero ownership/memberships/roles). */
export async function resolveCloud1hCandidateOperator(
  prisma: PrismaClient,
  excludeAccountIds: string[]
): Promise<Cloud1hCandidateResolution | null> {
  const exclude = new Set(excludeAccountIds.filter(Boolean));

  const accounts = await prisma.platformAccount.findMany({
    where: { status: "ACTIVE", onboardingGeneration: { gte: 2 } },
    select: { id: true, supabaseUserId: true },
    take: 50,
  });

  for (const account of accounts) {
    if (exclude.has(account.id)) continue;

    const [requests, clientMembers, tenantMemberships, internalRoles, legalCount] =
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
      ]);

    if (
      requests === 0 &&
      clientMembers === 0 &&
      tenantMemberships === 0 &&
      internalRoles === 0 &&
      legalCount >= 3
    ) {
      return {
        platformAccountId: account.id,
        opaqueRef: opaqueRef(account.id),
      };
    }
  }

  return null;
}
