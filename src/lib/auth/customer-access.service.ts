import "server-only";

import { prisma } from "@/lib/db";
import {
  hasAuthoritativeCustomerPortalAccess,
  type CustomerAccessEvidence,
} from "@/lib/auth/authority-boundaries";

const ACTIVE_ORG_MEMBER_STATUSES = ["active", "verified"] as const;

export async function gatherCustomerAccessEvidence(
  supabaseUserId: string
): Promise<CustomerAccessEvidence> {
  const [submittedRequestCount, activeOrganizationMembershipCount] = await Promise.all([
    prisma.implementationRequest.count({
      where: { submittedByUserId: supabaseUserId },
    }),
    prisma.clientOrganizationMember.count({
      where: {
        supabaseUserId,
        status: { in: [...ACTIVE_ORG_MEMBER_STATUSES] },
      },
    }),
  ]);

  return { submittedRequestCount, activeOrganizationMembershipCount };
}

export async function hasAuthoritativeCustomerPortalAccessForUser(
  supabaseUserId: string
): Promise<boolean> {
  const evidence = await gatherCustomerAccessEvidence(supabaseUserId);
  return hasAuthoritativeCustomerPortalAccess(evidence);
}

/** Request-scoped customer access — ownership or verified org membership for linked request. */
export async function clientCanAccessRequestAuthoritative(
  supabaseUserId: string,
  requestId: string
): Promise<boolean> {
  const owned = await prisma.implementationRequest.findFirst({
    where: { id: requestId, submittedByUserId: supabaseUserId },
    select: { id: true },
  });
  if (owned) return true;

  const orgLink = await prisma.clientOrganizationRequestLink.findFirst({
    where: { requestId },
    select: { organizationId: true },
  });
  if (!orgLink) return false;

  const member = await prisma.clientOrganizationMember.findFirst({
    where: {
      organizationId: orgLink.organizationId,
      supabaseUserId,
      status: { in: [...ACTIVE_ORG_MEMBER_STATUSES] },
    },
    select: { id: true },
  });
  return Boolean(member);
}

export async function listAuthoritativeClientRequestIds(
  supabaseUserId: string
): Promise<string[]> {
  const [byUser, orgMembers] = await Promise.all([
    prisma.implementationRequest.findMany({
      where: { submittedByUserId: supabaseUserId },
      select: { id: true },
    }),
    prisma.clientOrganizationMember.findMany({
      where: {
        supabaseUserId,
        status: { in: [...ACTIVE_ORG_MEMBER_STATUSES] },
      },
      select: {
        organization: {
          select: {
            requestLinks: { select: { requestId: true } },
          },
        },
      },
    }),
  ]);

  const ids = new Set<string>(byUser.map((row) => row.id));
  for (const member of orgMembers) {
    for (const link of member.organization.requestLinks) {
      ids.add(link.requestId);
    }
  }
  return [...ids];
}
