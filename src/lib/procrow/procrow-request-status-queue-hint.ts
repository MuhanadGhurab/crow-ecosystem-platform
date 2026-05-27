import type { ImplementationRequestStatus } from "@/lib/types/platform";

/**
 * Maps persisted request status to ProCrow operator-queue vocabulary (advisory labels only).
 * Does not imply automation or lifecycle mutation.
 */
export function requestStatusToOperatorQueueHint(status: ImplementationRequestStatus): string {
  switch (status) {
    case "DRAFT":
      return "Draft — client-side";
    case "PENDING_REVIEW":
      return "Intake — needs ProCrow review";
    case "UNDER_DISCOVERY":
      return "Discovery / blueprint prep";
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
    case "CANCELLED":
      return "Closed — not progressing";
    default:
      return status;
  }
}
