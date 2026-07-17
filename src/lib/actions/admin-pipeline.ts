"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActionRequestReview } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import { briefIsQualifiedForDiscovery } from "@/lib/client-service-request/constants";
import {
  getImplementationRequest,
  rejectImplementationRequest,
} from "@/lib/services/implementation-request.service";
import { startDiscovery } from "@/lib/services/pipeline.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export async function adminStartDiscovery(requestId: string) {
  await requireActionRequestReview();
  const request = await getImplementationRequest(requestId);
  if (!request) {
    throw new Error("Request not found");
  }
  if (request.status !== "PENDING_REVIEW") {
    throw new Error(`Cannot start discovery from status ${request.status}`);
  }
  if (!briefIsQualifiedForDiscovery(request.notes)) {
    throw new Error(
      "Discovery handoff requires ProCrow qualification outcome “Qualified for Discovery”. Record qualification first — this does not create a tenant or Blueprint.",
    );
  }

  await startDiscovery(requestId);

  revalidatePath(routes.admin.requests);
  revalidatePath(routes.admin.request(requestId));
  redirect(routes.discovery(requestId).organization);
}

export async function adminRejectRequest(requestId: string, reason?: string) {
  await requireActionRequestReview();
  const request = await getImplementationRequest(requestId);
  if (!request) {
    throw new Error("Request not found");
  }
  if (request.status !== "PENDING_REVIEW") {
    throw new Error(`Cannot reject from status ${request.status}`);
  }

  await rejectImplementationRequest(requestId, reason?.trim() || undefined);

  revalidatePath(routes.admin.requests);
  revalidatePath(routes.admin.request(requestId));
}

export type RequestAdminActionsState = {
  requestId: string;
  status: ImplementationRequestStatus;
  blueprintId: string | null;
  tenantSlug: string | null;
  /** CROW.PROCROW.1 — Discovery start requires brief qualification outcome. */
  qualifiedForDiscovery?: boolean;
};
