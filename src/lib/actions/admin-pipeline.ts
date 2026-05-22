"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireActionPlatformStaff } from "@/lib/auth/action-guard";
import { routes } from "@/lib/routes";
import {
  getImplementationRequest,
  rejectImplementationRequest,
} from "@/lib/services/implementation-request.service";
import { startDiscovery } from "@/lib/services/pipeline.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export async function adminStartDiscovery(requestId: string) {
  await requireActionPlatformStaff();
  const request = await getImplementationRequest(requestId);
  if (!request) {
    throw new Error("Request not found");
  }
  if (request.status !== "PENDING_REVIEW") {
    throw new Error(`Cannot start discovery from status ${request.status}`);
  }

  await startDiscovery(requestId);

  revalidatePath(routes.admin.requests);
  revalidatePath(routes.admin.request(requestId));
  redirect(routes.discovery(requestId).organization);
}

export async function adminRejectRequest(requestId: string, reason?: string) {
  await requireActionPlatformStaff();
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
};
