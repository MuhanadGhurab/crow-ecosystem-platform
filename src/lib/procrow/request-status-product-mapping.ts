/**
 * CROW.REQUEST.2 — product-layer status vocabulary mapped to Prisma ImplementationRequestStatus.
 * No DB enum migration. Advisory labels for client/operator UX only.
 */

import type { ImplementationRequestStatus } from "@/lib/types/platform";

/** Product lifecycle language for Request Intake (not a Prisma enum). */
export type RequestProductStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "NEEDS_REVIEW"
  | "QUALIFICATION_REVIEW"
  | "QUALIFIED"
  | "DECLINED"
  | "CONVERTED_TO_DISCOVERY"
  | "IN_BLUEPRINT"
  | "TENANT_READINESS"
  | "CLOSED_APPROVED"
  | "CLOSED_CANCELLED";

export const REQUEST_PRODUCT_STATUS_LABELS: Record<RequestProductStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  NEEDS_REVIEW: "Needs review",
  QUALIFICATION_REVIEW: "Qualification review",
  QUALIFIED: "Qualified",
  DECLINED: "Declined",
  CONVERTED_TO_DISCOVERY: "Converted to Discovery",
  IN_BLUEPRINT: "Blueprint in progress",
  TENANT_READINESS: "Tenant readiness",
  CLOSED_APPROVED: "Closed — approved",
  CLOSED_CANCELLED: "Closed — cancelled",
};

/**
 * Map persisted DB status → primary product status.
 * PENDING_REVIEW covers SUBMITTED / NEEDS_REVIEW / QUALIFICATION_REVIEW in product language
 * (same DB row; UI may refine with queue stage).
 */
export function mapPersistedStatusToProductStatus(
  status: ImplementationRequestStatus,
): RequestProductStatus {
  switch (status) {
    case "DRAFT":
      return "DRAFT";
    case "PENDING_REVIEW":
      return "NEEDS_REVIEW";
    case "UNDER_DISCOVERY":
      return "CONVERTED_TO_DISCOVERY";
    case "BLUEPRINT_BUILD":
      return "IN_BLUEPRINT";
    case "TENANT_PROVISIONING":
    case "SECURITY_INIT":
    case "SAREA_INIT":
    case "GO_LIVE":
      return "TENANT_READINESS";
    case "APPROVED":
      return "CLOSED_APPROVED";
    case "REJECTED":
      return "DECLINED";
    case "CANCELLED":
      return "CLOSED_CANCELLED";
    default:
      return "NEEDS_REVIEW";
  }
}

/** Operator-facing product stage for intake queue grouping (no mutation). */
export type RequestIntakeQueueGroup =
  | "submitted_needs_review"
  | "qualification_review"
  | "ready_for_discovery"
  | "declined_or_closed"
  | "later_lifecycle";

export function mapPersistedStatusToIntakeQueueGroup(
  status: ImplementationRequestStatus,
): RequestIntakeQueueGroup {
  switch (status) {
    case "DRAFT":
    case "PENDING_REVIEW":
      return "submitted_needs_review";
    case "UNDER_DISCOVERY":
      return "ready_for_discovery";
    case "REJECTED":
    case "CANCELLED":
    case "APPROVED":
      return "declined_or_closed";
    default:
      return "later_lifecycle";
  }
}

export const REQUEST_INTAKE_QUEUE_GROUP_LABELS: Record<RequestIntakeQueueGroup, string> = {
  submitted_needs_review: "Submitted — needs review",
  qualification_review: "Qualification review",
  ready_for_discovery: "Ready for Discovery",
  declined_or_closed: "Declined / closed",
  later_lifecycle: "Later lifecycle",
};

export function productStatusLabelForPersisted(
  status: ImplementationRequestStatus,
): string {
  return REQUEST_PRODUCT_STATUS_LABELS[mapPersistedStatusToProductStatus(status)];
}
