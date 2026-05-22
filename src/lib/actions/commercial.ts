"use server";

import { revalidatePath } from "next/cache";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import {
  approveProposalByToken,
  declineProposalByToken,
  sendCommercialProposal,
} from "@/lib/services/commercial.service";

export async function adminSendProposalAction(blueprintId: string) {
  await requireActionPlatformStaff();
  const blueprint = await sendCommercialProposal(blueprintId);
  revalidatePath(routes.blueprint(blueprintId).overview);
  revalidatePath(routes.admin.request(blueprint.requestId));
  return { token: blueprint.proposalToken };
}

export async function clientApproveProposalAction(token: string) {
  await approveProposalByToken(token);
}

export async function clientDeclineProposalAction(token: string) {
  await declineProposalByToken(token);
}
