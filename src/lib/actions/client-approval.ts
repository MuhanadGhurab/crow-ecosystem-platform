"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { getCrowAuth, isClient, isPlatformStaff } from "@/lib/auth/roles";
import type { ClientApprovalResult } from "@/lib/client-portal/client-approval-contract";
import { routes } from "@/lib/routes";
import { approveClientProposalScope } from "@/lib/services/client-approval.service";

async function requireClientApprovalActor(): Promise<import("@supabase/supabase-js").User> {
  const user = await requireAuth();
  const { role } = getCrowAuth(user);
  if (!isClient(role) && !isPlatformStaff(role)) {
    throw new Error("Client portal access required");
  }
  return user;
}

export async function approveClientProposalScopeAction(
  proposalId: string
): Promise<ClientApprovalResult> {
  const user = await requireClientApprovalActor();
  const result = await approveClientProposalScope(user, proposalId);

  if (result.ok) {
    revalidatePath(routes.client.proposal(proposalId));
    revalidatePath(routes.client.proposals);
    revalidatePath(routes.client.blueprint(proposalId));
    revalidatePath(routes.client.onboarding);
    if (result.procrowCounterpartRoute.startsWith("/admin/requests/")) {
      const requestId = result.procrowCounterpartRoute.replace("/admin/requests/", "");
      revalidatePath(routes.client.request(requestId));
      revalidatePath(routes.admin.request(requestId));
      revalidatePath(routes.admin.requests);
      revalidatePath(routes.admin.overview);
    }
  }

  return result;
}
