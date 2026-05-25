import type { ImplementationRequestStatus } from "@/lib/types/platform";

/** Operator-facing lifecycle bucket (F10) — maps from existing request/blueprint state only. */
export type OperatorLifecycleBucket =
  | "pending_review"
  | "discovery_in_progress"
  | "blueprint_pending"
  | "ready_go_live"
  | "tenant_live"
  | "needs_review";

export const OPERATOR_BUCKET_LABELS: Record<OperatorLifecycleBucket, string> = {
  pending_review: "Pending review",
  discovery_in_progress: "Discovery in progress",
  blueprint_pending: "Blueprint pending",
  ready_go_live: "Ready for go-live",
  tenant_live: "Tenant live",
  needs_review: "Needs review",
};

export const OPERATOR_BUCKET_STYLES: Record<OperatorLifecycleBucket, string> = {
  pending_review: "bg-amber-500/10 text-amber-200 border-amber-500/25",
  discovery_in_progress: "bg-cyan-500/10 text-cyan-200 border-cyan-500/25",
  blueprint_pending: "bg-violet-500/10 text-violet-200 border-violet-500/25",
  ready_go_live: "bg-teal-500/10 text-teal-200 border-teal-500/25",
  tenant_live: "bg-green-500/10 text-green-200 border-green-500/25",
  needs_review: "bg-rose-500/10 text-rose-200 border-rose-500/25",
};

export const OPERATOR_BUCKET_PHASE_MEANING: Record<OperatorLifecycleBucket, string> = {
  pending_review: "Intake received — platform staff reviews scope, plan, and modules before discovery.",
  discovery_in_progress: "Discovery workspace is active — org model, modules, security, and experience are being captured.",
  blueprint_pending: "Discovery is advancing toward blueprint — commercial blueprint may still be in draft or review.",
  ready_go_live: "Blueprint is linked — operator reviews readiness and runs explicit go-live provision.",
  tenant_live: "Tenant workspace is provisioned — hand off to CEM, CyberCrow, and SAREA operators.",
  needs_review: "Request is outside the happy path (rejected, cancelled, or blocked) — manual triage required.",
};

export type OperatorPipelineInput = {
  status: ImplementationRequestStatus;
  hasDiscoveryProfile: boolean;
  hasBlueprint: boolean;
  hasTenant: boolean;
};

export function resolveOperatorLifecycleBucket(input: OperatorPipelineInput): OperatorLifecycleBucket {
  const { status, hasDiscoveryProfile, hasBlueprint, hasTenant } = input;

  if (status === "REJECTED" || status === "CANCELLED") {
    return "needs_review";
  }

  if (hasTenant || status === "GO_LIVE") {
    return "tenant_live";
  }

  if (
    hasBlueprint &&
    (status === "BLUEPRINT_BUILD" ||
      status === "TENANT_PROVISIONING" ||
      status === "SECURITY_INIT" ||
      status === "SAREA_INIT")
  ) {
    return "ready_go_live";
  }

  if (hasBlueprint || status === "BLUEPRINT_BUILD") {
    return "blueprint_pending";
  }

  if (status === "UNDER_DISCOVERY" || (hasDiscoveryProfile && status !== "PENDING_REVIEW")) {
    return "discovery_in_progress";
  }

  if (status === "PENDING_REVIEW" || status === "DRAFT" || status === "APPROVED") {
    return "pending_review";
  }

  return "needs_review";
}

export function operatorNextAction(input: OperatorPipelineInput & {
  requestId: string;
  blueprintId: string | null;
  tenantSlug: string | null;
}): { label: string; hint: string } {
  const bucket = resolveOperatorLifecycleBucket(input);

  switch (bucket) {
    case "pending_review":
      return {
        label: "Start discovery",
        hint: "Open request detail and start discovery from the pipeline actions panel.",
      };
    case "discovery_in_progress":
      return {
        label: "Complete discovery → blueprint",
        hint: "Finish discovery summary and create or refresh the enterprise blueprint.",
      };
    case "blueprint_pending":
      return {
        label: "Review blueprint & pricing",
        hint: "Open blueprint overview and pricing before readiness review.",
      };
    case "ready_go_live":
      return {
        label: "Readiness → go live",
        hint: "Confirm readiness checks, then provision tenant from the go-live workspace.",
      };
    case "tenant_live":
      return {
        label: "Open tenant workspace",
        hint: "Hand off to tenant dashboard, CyberCrow, and SAREA studio as needed.",
      };
    case "needs_review":
    default:
      return {
        label: "Triage request",
        hint: "Review status, notes, and discovery gate warnings before advancing.",
      };
  }
}

export function operatorAdvisoryWarnings(input: OperatorPipelineInput): string[] {
  const warnings: string[] = [];
  const bucket = resolveOperatorLifecycleBucket(input);

  if (input.status === "PENDING_REVIEW" && input.hasDiscoveryProfile) {
    warnings.push("Discovery profile exists while request is still pending review.");
  }
  if (bucket === "ready_go_live" && !input.hasBlueprint) {
    warnings.push("Marked ready for go-live but no blueprint is linked.");
  }
  if (bucket === "blueprint_pending" && input.status === "UNDER_DISCOVERY" && input.hasBlueprint) {
    warnings.push("Blueprint exists while discovery is still in progress — confirm refresh intent.");
  }
  if (
    input.hasTenant &&
    input.status !== "GO_LIVE" &&
    input.status !== "TENANT_PROVISIONING" &&
    input.status !== "SECURITY_INIT" &&
    input.status !== "SAREA_INIT"
  ) {
    warnings.push("Tenant is linked but request status has not reached go-live states.");
  }

  return warnings;
}

/** Human label for admin badges (F10) — prefer operator bucket over raw enum. */
export function operatorHumanStatusLabel(input: OperatorPipelineInput): string {
  return OPERATOR_BUCKET_LABELS[resolveOperatorLifecycleBucket(input)];
}
