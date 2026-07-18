/**
 * CROW.DISCOVERY.3 / D7 — typed MVP field metadata (Stages 1–7 local-first).
 * mapsToBlueprintSection is inert metadata only — never triggers Blueprint generation.
 */

import type { OrganizationContextKind } from "@/lib/client-service-request/types";
import type { RequestJourneyKind } from "@/lib/client-service-request/journey";
import type { DiscoveryMvpStageId } from "@/lib/discovery/discovery-mvp-boundaries";

export const DISCOVERY_MVP_D3_FIELD_VERSION = "discovery-mvp-d3-fields-v1" as const;

export type DiscoveryMvpFieldType =
  | "short_text"
  | "long_text"
  | "single_select"
  | "number"
  | "url";

export type DiscoveryMvpRequiredCondition =
  | "always"
  | "never"
  | "if_journey_NEW"
  | "if_journey_TRANSFORM"
  | "if_org_NEW_BUSINESS"
  | "if_org_NEW_DIVISION"
  | "if_org_EXISTING_ORGANIZATION"
  | "if_org_MODERNIZATION";

export type DiscoveryMvpJourneyApplicability = RequestJourneyKind | "BOTH";

export type DiscoveryMvpOrgApplicability = OrganizationContextKind[] | "ALL";

export type DiscoveryMvpRiskSensitivity = "low" | "medium" | "high";

export type DiscoveryMvpEvidenceRequirement =
  | "none"
  | "optional"
  | "recommended"
  | "required_later";

export type DiscoveryMvpProcrowReviewFlag =
  | "none"
  | "review"
  | "blocking_if_missing";

export type DiscoveryMvpFieldValidation = {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enum?: readonly string[];
  /** Evidence / refs: text or URL only — never file upload. */
  refsOnly?: boolean;
};

export type DiscoveryMvpFieldDefinition = {
  fieldKey: string;
  label: string;
  helperText: string;
  fieldType: DiscoveryMvpFieldType;
  stageId: DiscoveryMvpStageId;
  version: typeof DISCOVERY_MVP_D3_FIELD_VERSION;
  layer: string;
  category: string;
  requiredCondition: DiscoveryMvpRequiredCondition;
  journeyApplicability: DiscoveryMvpJourneyApplicability;
  organizationContextApplicability: DiscoveryMvpOrgApplicability;
  visibilityCondition: DiscoveryMvpRequiredCondition | "always";
  validation: DiscoveryMvpFieldValidation;
  /** Advisory OM mapping — enriched by D4 mapper. */
  mapsToOperatingModel: readonly string[];
  /** Inert Blueprint section id — must never generate Blueprint. */
  mapsToBlueprintSection: string;
  riskSensitivity: DiscoveryMvpRiskSensitivity;
  evidenceRequirement: DiscoveryMvpEvidenceRequirement;
  clientVisible: boolean;
  operatorVisible: boolean;
  procrowReviewFlag: DiscoveryMvpProcrowReviewFlag;
  options?: readonly { value: string; label: string }[];
};

export type DiscoveryMvpAnswerMap = Record<string, string | number | null | undefined>;

export type DiscoveryMvpAdaptiveContext = {
  journeyKind: RequestJourneyKind | null;
  organizationContext: OrganizationContextKind | null;
};

export type DiscoveryMvpStageProgress = {
  stageId: DiscoveryMvpStageId;
  visibleCount: number;
  answeredCount: number;
  requiredCount: number;
  missingRequiredKeys: string[];
};
