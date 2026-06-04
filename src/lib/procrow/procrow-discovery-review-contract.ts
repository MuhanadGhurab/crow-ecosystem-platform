/**
 * L6 — ProCrow review workflow for client-led discovery (steps 6–7).
 * Status persisted in DiscoveryAnswer `client_discovery/*` — no schema migration.
 */

import type {
  ClientDiscoveryIndustryTemplate,
  ClientDiscoveryStageTemplate,
  ClientDiscoveryStatus,
  ClientDiscoveryStep,
} from "@/lib/client-portal/client-discovery-contract";

export type ProCrowDiscoveryReviewStatus = ClientDiscoveryStatus;

/** Review terminal state — persisted in `client_discovery/status`. */
export const PROCROW_DISCOVERY_ACCEPTED_STATUS = "accepted_into_blueprint" as const;

export type ProCrowDiscoveryReviewDecision =
  | "start_review"
  | "request_changes"
  | "accept_into_blueprint";

export const PROCROW_DISCOVERY_REVIEW_EVENT_TYPES = {
  clientSubmitted: "client_discovery_submitted",
  changesRequested: "procrow_discovery_changes_requested",
  acceptedIntoBlueprint: "procrow_discovery_accepted",
} as const;

/** Sections ProCrow may request the client to revise. */
export const PROCROW_DISCOVERY_CHANGE_SECTION_ALLOWLIST: readonly ClientDiscoveryStep[] = [
  "company_size",
  "industry_template",
  "company_stage",
  "departments",
  "roles",
  "modules",
  "workflows",
  "security",
  "sarea",
] as const;

export type ProCrowDiscoveryChangeRequest = {
  message: string;
  requestedSections: ClientDiscoveryStep[];
  requestedAt: string;
  requestedBy: string | null;
};

export type ProCrowDiscoveryBlueprintInputReadiness = {
  ready: boolean;
  missingSections: ClientDiscoveryStep[];
  detail: string;
};

export type ProCrowDiscoveryReviewSnapshot = {
  requestId: string;
  companyName: string;
  clientName: string | null;
  clientEmail: string | null;
  referenceCode: string;
  status: ProCrowDiscoveryReviewStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewerName: string | null;
  industryTemplate: ClientDiscoveryIndustryTemplate | string | null;
  companyStageTemplate: ClientDiscoveryStageTemplate | null;
  employeeBand: string | null;
  selectedModules: string[];
  departments: string[];
  roles: string[];
  workflows: string[];
  securityPreference: string | null;
  sareaPreference: string | null;
  clientNotes: string | null;
  missingSections: ClientDiscoveryStep[];
  recommendedOperatorActions: string[];
  blueprintInputReadiness: ProCrowDiscoveryBlueprintInputReadiness;
  changeRequest: ProCrowDiscoveryChangeRequest | null;
  acceptedAt: string | null;
  acceptedBy: string | null;
  blueprintId: string | null;
  hasBlueprintDraft: boolean;
};

export const PROCROW_DISCOVERY_ACCEPT_DISCLAIMER =
  "Accepting discovery means it becomes official blueprint input. It does not approve proposal, activate payment, or prepare tenant runtime." as const;

export const PROCROW_DISCOVERY_CLIENT_ACCEPTED_MESSAGE =
  "Discovery accepted into blueprint. ProCrow is preparing proposal and blueprint review." as const;

export const PROCROW_DISCOVERY_CLIENT_CHANGES_PREFIX =
  "ProCrow requested changes to your discovery." as const;

export const MAX_PROCROW_DISCOVERY_CHANGE_MESSAGE_LENGTH = 2000;

export function canStartProCrowDiscoveryReview(
  snapshot: ProCrowDiscoveryReviewSnapshot
): boolean {
  return snapshot.status === "submitted_for_procrow_review";
}

export function canRequestProCrowDiscoveryChanges(
  snapshot: ProCrowDiscoveryReviewSnapshot
): boolean {
  return (
    snapshot.status === "submitted_for_procrow_review" ||
    snapshot.status === "procrow_reviewing"
  );
}

export function canAcceptDiscoveryIntoBlueprint(
  snapshot: ProCrowDiscoveryReviewSnapshot
): boolean {
  return (
    (snapshot.status === "submitted_for_procrow_review" ||
      snapshot.status === "procrow_reviewing") &&
    snapshot.blueprintInputReadiness.ready
  );
}
