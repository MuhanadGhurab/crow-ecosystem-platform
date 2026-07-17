import type { ImplementationRequestStatus } from "@/lib/types/platform";
import {
  mapPersistedStatusToIntakeQueueGroup,
  mapPersistedStatusToProductStatus,
  productStatusLabelForPersisted,
  REQUEST_INTAKE_QUEUE_GROUP_LABELS,
} from "@/lib/procrow/request-status-product-mapping";

/**
 * Maps persisted request status to ProCrow operator-queue vocabulary (advisory labels only).
 * Does not imply automation or lifecycle mutation.
 * CROW.REQUEST.2 — uses product-layer mapping for clearer intake language.
 */
export function requestStatusToOperatorQueueHint(status: ImplementationRequestStatus): string {
  const product = mapPersistedStatusToProductStatus(status);
  const group = mapPersistedStatusToIntakeQueueGroup(status);
  const groupLabel = REQUEST_INTAKE_QUEUE_GROUP_LABELS[group];

  switch (status) {
    case "DRAFT":
      return "Draft — client-side only (not submitted)";
    case "PENDING_REVIEW":
      return `${groupLabel} · product: ${productStatusLabelForPersisted(status)} (DB: PENDING_REVIEW)`;
    case "UNDER_DISCOVERY":
      return `${groupLabel} · product: ${product}`;
    case "BLUEPRINT_BUILD":
      return "Blueprint build";
    case "TENANT_PROVISIONING":
    case "SECURITY_INIT":
    case "SAREA_INIT":
      return "Tenant readiness (ProCrow-controlled)";
    case "GO_LIVE":
      return "Onboarding — go-live readiness";
    case "APPROVED":
      return "Closed — approved path";
    case "REJECTED":
      return "Declined — not progressing";
    case "CANCELLED":
      return "Closed — cancelled";
    default:
      return status;
  }
}
