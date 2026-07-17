/**
 * CROW.DISCOVERY.2 — product-layer Discovery status vocabulary.
 * No DB enum migration. Maps existing DiscoveryProfile + request status safely.
 */

import type { DiscoveryStatus } from "@prisma/client";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

/** Product Discovery lifecycle (not a Prisma enum). */
export type DiscoveryProductStatus =
  | "NOT_STARTED"
  | "READY_TO_START"
  | "IN_PROGRESS"
  | "NEEDS_MORE_INFORMATION"
  | "READY_FOR_REVIEW"
  | "READY_FOR_MODELING"
  | "CLOSED";

export const DISCOVERY_PRODUCT_STATUS_LABELS: Record<DiscoveryProductStatus, string> = {
  NOT_STARTED: "Not started",
  READY_TO_START: "Ready to start",
  IN_PROGRESS: "In progress",
  NEEDS_MORE_INFORMATION: "Needs more information",
  READY_FOR_REVIEW: "Ready for review",
  READY_FOR_MODELING: "Ready for modeling",
  CLOSED: "Closed",
};

export type DiscoveryProductStatusInput = {
  requestStatus: ImplementationRequestStatus;
  discoveryProfileStatus: DiscoveryStatus | null | undefined;
  /** Client discovery draft status string when present (client_discovery section). */
  clientDiscoveryDraftStatus?: string | null;
  /** ProCrow qualification already satisfied for handoff. */
  qualifiedForDiscovery?: boolean;
};

/**
 * Map persisted Discovery + request fields → product Discovery status (D1).
 * READY_FOR_MODELING is reserved for later D5 — never auto-set in D0–D2.
 */
export function resolveDiscoveryProductStatus(
  input: DiscoveryProductStatusInput,
): DiscoveryProductStatus {
  const { requestStatus, discoveryProfileStatus, clientDiscoveryDraftStatus, qualifiedForDiscovery } =
    input;

  if (requestStatus === "REJECTED" || requestStatus === "CANCELLED" || requestStatus === "APPROVED") {
    return "CLOSED";
  }

  if (
    requestStatus === "BLUEPRINT_BUILD" ||
    requestStatus === "TENANT_PROVISIONING" ||
    requestStatus === "SECURITY_INIT" ||
    requestStatus === "SAREA_INIT" ||
    requestStatus === "GO_LIVE"
  ) {
    return "CLOSED";
  }

  if (discoveryProfileStatus === "COMPLETED") {
    // Legacy complete path may exist; product language stays closed for D0–D2 success criteria.
    return "CLOSED";
  }

  const client = clientDiscoveryDraftStatus ?? "";
  if (client === "changes_requested") {
    return "NEEDS_MORE_INFORMATION";
  }
  if (client === "submitted_for_procrow_review" || client === "procrow_reviewing") {
    return "READY_FOR_REVIEW";
  }

  if (requestStatus === "UNDER_DISCOVERY" || discoveryProfileStatus === "IN_PROGRESS") {
    return "IN_PROGRESS";
  }

  if (requestStatus === "PENDING_REVIEW" && qualifiedForDiscovery) {
    return "READY_TO_START";
  }

  if (!discoveryProfileStatus) {
    return "NOT_STARTED";
  }

  return "NOT_STARTED";
}

export function discoveryProductStatusLabel(status: DiscoveryProductStatus): string {
  return DISCOVERY_PRODUCT_STATUS_LABELS[status];
}
