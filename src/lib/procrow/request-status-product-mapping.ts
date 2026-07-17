/**
 * CROW.REQUEST.2 / CROW.PROCROW.1 — product-layer status vocabulary.
 * No DB enum migration. Advisory labels for client/operator UX only.
 */

import type { ImplementationRequestStatus } from "@/lib/types/platform";
import type { ProcrowQualification } from "@/lib/procrow/procrow-qualification";

/** Product lifecycle language for Request Intake (not a Prisma enum). */
export type RequestProductStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "NEEDS_REVIEW"
  | "NEEDS_QUALIFICATION_REVIEW"
  | "NEEDS_MORE_INFORMATION"
  | "QUALIFICATION_REVIEW"
  | "QUALIFIED"
  | "QUALIFIED_FOR_DISCOVERY"
  | "DECLINED"
  | "CLOSED"
  | "CONVERTED_TO_DISCOVERY"
  | "IN_BLUEPRINT"
  | "TENANT_READINESS"
  | "CLOSED_APPROVED"
  | "CLOSED_CANCELLED";

export const REQUEST_PRODUCT_STATUS_LABELS: Record<RequestProductStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  NEEDS_REVIEW: "Needs review",
  NEEDS_QUALIFICATION_REVIEW: "Needs qualification review",
  NEEDS_MORE_INFORMATION: "Needs more information",
  QUALIFICATION_REVIEW: "Qualification review",
  QUALIFIED: "Qualified",
  QUALIFIED_FOR_DISCOVERY: "Qualified for Discovery",
  DECLINED: "Declined",
  CLOSED: "Closed",
  CONVERTED_TO_DISCOVERY: "Converted to Discovery",
  IN_BLUEPRINT: "Blueprint in progress",
  TENANT_READINESS: "Tenant readiness",
  CLOSED_APPROVED: "Closed — approved",
  CLOSED_CANCELLED: "Closed — cancelled",
};

/**
 * Map persisted DB status → primary product status (without qualification overlay).
 */
export function mapPersistedStatusToProductStatus(
  status: ImplementationRequestStatus,
): RequestProductStatus {
  switch (status) {
    case "DRAFT":
      return "DRAFT";
    case "PENDING_REVIEW":
      return "NEEDS_QUALIFICATION_REVIEW";
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
      return "NEEDS_QUALIFICATION_REVIEW";
  }
}

/**
 * Refine product status using optional brief qualification outcome (CROW.PROCROW.1).
 */
export function resolveEffectiveProductStatus(
  status: ImplementationRequestStatus,
  qualification?: ProcrowQualification | null,
): RequestProductStatus {
  if (status === "REJECTED" || status === "CANCELLED") {
    return mapPersistedStatusToProductStatus(status);
  }
  if (status === "UNDER_DISCOVERY") {
    return "CONVERTED_TO_DISCOVERY";
  }
  if (status === "PENDING_REVIEW" && qualification) {
    switch (qualification.outcome) {
      case "needs_more_information":
        return "NEEDS_MORE_INFORMATION";
      case "qualified_for_discovery":
        return "QUALIFIED_FOR_DISCOVERY";
      case "declined":
        return "DECLINED";
      case "needs_qualification_review":
        return "NEEDS_QUALIFICATION_REVIEW";
      default:
        return "NEEDS_QUALIFICATION_REVIEW";
    }
  }
  return mapPersistedStatusToProductStatus(status);
}

/** Operator-facing product stage for intake queue grouping (no mutation). */
export type RequestIntakeQueueGroup =
  | "submitted_needs_review"
  | "qualification_review"
  | "needs_more_information"
  | "qualified_for_discovery"
  | "ready_for_discovery"
  | "declined_or_closed"
  | "later_lifecycle";

export function mapPersistedStatusToIntakeQueueGroup(
  status: ImplementationRequestStatus,
  qualification?: ProcrowQualification | null,
): RequestIntakeQueueGroup {
  if (status === "UNDER_DISCOVERY") return "ready_for_discovery";
  if (status === "REJECTED" || status === "CANCELLED" || status === "APPROVED") {
    return "declined_or_closed";
  }
  if (status === "PENDING_REVIEW" || status === "DRAFT") {
    if (qualification?.outcome === "needs_more_information") return "needs_more_information";
    if (qualification?.outcome === "qualified_for_discovery") return "qualified_for_discovery";
    if (qualification?.outcome === "declined") return "declined_or_closed";
    return "submitted_needs_review";
  }
  return "later_lifecycle";
}

export const REQUEST_INTAKE_QUEUE_GROUP_LABELS: Record<RequestIntakeQueueGroup, string> = {
  submitted_needs_review: "Submitted — needs qualification review",
  qualification_review: "Qualification review",
  needs_more_information: "Needs more information",
  qualified_for_discovery: "Qualified for Discovery",
  ready_for_discovery: "Converted to Discovery",
  declined_or_closed: "Declined / closed",
  later_lifecycle: "Later lifecycle",
};

export function productStatusLabelForPersisted(
  status: ImplementationRequestStatus,
  qualification?: ProcrowQualification | null,
): string {
  return REQUEST_PRODUCT_STATUS_LABELS[resolveEffectiveProductStatus(status, qualification)];
}
