import type { ImplementationRequestStatus } from "@/lib/types/platform";

export const REQUEST_STATUS_LABELS: Record<ImplementationRequestStatus, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending review",
  UNDER_DISCOVERY: "Under discovery",
  BLUEPRINT_BUILD: "Blueprint build",
  TENANT_PROVISIONING: "Tenant provisioning",
  SECURITY_INIT: "Security init",
  SAREA_INIT: "SAREA init",
  GO_LIVE: "Go live",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export const REQUEST_STATUS_STYLES: Record<ImplementationRequestStatus, string> = {
  DRAFT: "bg-slate-500/10 text-slate-300",
  PENDING_REVIEW: "bg-amber-500/10 text-amber-300",
  UNDER_DISCOVERY: "bg-cyan-500/10 text-cyan-300",
  BLUEPRINT_BUILD: "bg-violet-500/10 text-violet-300",
  TENANT_PROVISIONING: "bg-blue-500/10 text-blue-300",
  SECURITY_INIT: "bg-teal-500/10 text-teal-300",
  SAREA_INIT: "bg-teal-500/10 text-teal-300",
  GO_LIVE: "bg-green-500/10 text-green-300",
  APPROVED: "bg-green-500/10 text-green-300",
  REJECTED: "bg-red-500/10 text-red-300",
  CANCELLED: "bg-slate-500/10 text-slate-400",
};
