import "server-only";

import { listActiveInternalRolesForSupabaseUser } from "@/lib/auth/platform-internal-role.service";
import {
  resolveClientOnlyLifecycleDestinationFromRequests,
  type OwnedRequestLifecycleRow,
} from "@/lib/auth/client-only-lifecycle-routing";
import { prisma } from "@/lib/db";

export type { OwnedRequestLifecycleRow };

export { resolveClientOnlyLifecycleDestinationFromRequests };

export async function listOwnedRequestsForLifecycle(
  supabaseUserId: string
): Promise<OwnedRequestLifecycleRow[]> {
  return prisma.implementationRequest.findMany({
    where: { submittedByUserId: supabaseUserId },
    select: {
      id: true,
      status: true,
      discoveryProfile: { select: { status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function resolveClientOnlyLifecycleDestination(
  supabaseUserId: string
): Promise<string> {
  const requests = await listOwnedRequestsForLifecycle(supabaseUserId);
  return resolveClientOnlyLifecycleDestinationFromRequests(requests);
}

/**
 * Client-only scope: request ownership without internal platform roles or tenant runtime.
 * Used for direct lifecycle landing and /access bypass — not email or metadata.
 */
export async function isAuthoritativeClientOnlyScope(
  supabaseUserId: string
): Promise<boolean> {
  const [internalRoles, tenantCount, ownedRequestCount] = await Promise.all([
    listActiveInternalRolesForSupabaseUser(supabaseUserId),
    prisma.tenantMembership.count({ where: { supabaseUserId } }),
    prisma.implementationRequest.count({
      where: { submittedByUserId: supabaseUserId },
    }),
  ]);
  if (internalRoles.length > 0) return false;
  if (tenantCount > 0) return false;
  return ownedRequestCount > 0;
}
