import type { ImplementationRequestStatus } from "@/lib/types/platform";
import type { ClientPortalOnboardingStep, ClientPortalOnboardingStepStatus } from "./client-portal-contract";
import { routes } from "@/lib/routes";

function stepStatus(
  requestStatus: ImplementationRequestStatus,
  phase: "intake" | "discovery" | "blueprint" | "proposal" | "provision" | "golive"
): ClientPortalOnboardingStepStatus {
  const order: ImplementationRequestStatus[] = [
    "PENDING_REVIEW",
    "UNDER_DISCOVERY",
    "BLUEPRINT_BUILD",
    "TENANT_PROVISIONING",
    "SECURITY_INIT",
    "SAREA_INIT",
    "GO_LIVE",
    "APPROVED",
  ];
  const idx = order.indexOf(requestStatus);
  const phaseIdx = {
    intake: 0,
    discovery: 1,
    blueprint: 2,
    proposal: 2,
    provision: 3,
    golive: 6,
  }[phase];

  if (requestStatus === "REJECTED" || requestStatus === "CANCELLED") {
    return "blocked";
  }
  if (idx > phaseIdx) return "complete";
  if (idx === phaseIdx) return "in_progress";
  return "pending";
}

/** Rule-based onboarding timeline for a linked request (no automation claims). */
export function buildOnboardingStepsForRequest(
  requestId: string,
  requestStatus: ImplementationRequestStatus
): ClientPortalOnboardingStep[] {
  return [
    {
      key: "submit",
      label: "Request submitted",
      status: stepStatus(requestStatus, "intake"),
      owner: "client",
      description: "Your organization request is on file with ProCrow.",
      relatedRoute: routes.client.request(requestId),
    },
    {
      key: "discovery",
      label: "Discovery",
      status: stepStatus(requestStatus, "discovery"),
      owner: "shared",
      description: "ProCrow completes discovery with your team before blueprint build.",
      relatedRoute: null,
    },
    {
      key: "blueprint",
      label: "Blueprint & scope",
      status: stepStatus(requestStatus, "blueprint"),
      owner: "procrow",
      description: "Operating model, modules, and security baseline are defined in the blueprint.",
      relatedRoute: routes.client.blueprintByRequest(requestId),
    },
    {
      key: "proposal",
      label: "Commercial proposal",
      status: stepStatus(requestStatus, "proposal"),
      owner: "shared",
      description: "Review pricing and scope; approval requires verified Client Portal sign-in.",
      relatedRoute: routes.client.proposals,
    },
    {
      key: "provision",
      label: "Provisioning readiness",
      status: stepStatus(requestStatus, "provision"),
      owner: "procrow",
      description: "Tenant and security initialization are managed by ProCrow.",
      relatedRoute: routes.client.onboarding,
    },
    {
      key: "golive",
      label: "Go-live",
      status: stepStatus(requestStatus, "golive"),
      owner: "shared",
      description: "Launch coordination when blueprint and proposal are approved.",
      relatedRoute: routes.client.onboarding,
    },
  ];
}
