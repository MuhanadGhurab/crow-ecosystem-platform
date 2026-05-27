"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { getCrowAuth, isClient, isPlatformStaff } from "@/lib/auth/roles";
import type {
  ClientReviewNoteDraft,
  ClientReviewNoteSubmitResult,
} from "@/lib/client-portal/client-review-notes-contract";
import { routes } from "@/lib/routes";
import {
  requestClientProposalChanges,
  submitClientReviewNote,
} from "@/lib/services/client-review-notes.service";

async function requireClientReviewActor() {
  const user = await requireAuth();
  const { role } = getCrowAuth(user);
  if (!isClient(role) && !isPlatformStaff(role)) {
    throw new Error("Client portal access required");
  }
  return user;
}

function revalidateClientReviewPaths(input: {
  requestId: string;
  proposalId?: string | null;
  blueprintId?: string | null;
}) {
  revalidatePath(routes.client.request(input.requestId));
  revalidatePath(routes.client.onboarding);
  if (input.proposalId) {
    revalidatePath(routes.client.proposal(input.proposalId));
  }
  if (input.blueprintId) {
    revalidatePath(routes.client.blueprint(input.blueprintId));
  }
  revalidatePath(routes.client.proposals);
  revalidatePath(routes.admin.request(input.requestId));
  revalidatePath(routes.admin.requests);
  revalidatePath(routes.admin.overview);
}

export async function submitClientReviewNoteAction(
  draft: ClientReviewNoteDraft
): Promise<ClientReviewNoteSubmitResult> {
  const user = await requireClientReviewActor();
  const result = await submitClientReviewNote(user, draft);
  if (result.ok) {
    revalidateClientReviewPaths({
      requestId: draft.requestId,
      proposalId: draft.proposalId,
      blueprintId: draft.blueprintId,
    });
  }
  return result;
}

export async function requestClientProposalChangesAction(input: {
  requestId: string;
  proposalId?: string | null;
  blueprintId?: string | null;
  message: string;
  relatedSection?: string | null;
}): Promise<ClientReviewNoteSubmitResult> {
  const user = await requireClientReviewActor();
  const result = await requestClientProposalChanges(user, input);
  if (result.ok) {
    revalidateClientReviewPaths(input);
  }
  return result;
}
