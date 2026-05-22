import { FULL_PLATFORM_LIFECYCLE } from "@/lib/constants/platform";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export const PIPELINE_LIFECYCLE_LABELS = FULL_PLATFORM_LIFECYCLE;

export function lifecycleIndexFromRequestStatus(status: ImplementationRequestStatus): number {
  switch (status) {
    case "DRAFT":
    case "PENDING_REVIEW":
      return 0;
    case "APPROVED":
      return 1;
    case "UNDER_DISCOVERY":
      return 2;
    case "BLUEPRINT_BUILD":
      return 3;
    case "TENANT_PROVISIONING":
      return 4;
    case "SECURITY_INIT":
      return 5;
    case "SAREA_INIT":
      return 6;
    case "GO_LIVE":
      return 7;
    case "REJECTED":
    case "CANCELLED":
      return -1;
    default:
      return 0;
  }
}
