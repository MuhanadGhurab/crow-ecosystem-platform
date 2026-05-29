import type { CompanyLinkStatus } from "@/lib/client-portal/client-profile-contract";

/** Human-readable link status — avoids duplicating "Linked via" in UI copy. */
export function formatCompanyLinkStatusLabel(status: CompanyLinkStatus): string {
  switch (status) {
    case "linked_via_submitted_by_user":
      return "Linked through your submitted request";
    case "linked_via_contact_email":
      return "Linked via your primary contact email";
    case "staff_preview":
      return "Staff preview (read-only)";
    case "not_linked":
      return "Not linked";
    default:
      return status;
  }
}
