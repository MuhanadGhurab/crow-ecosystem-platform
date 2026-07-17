/** CROW.REQUEST.2 — client service request brief (advisory, non-provisioning). */

import type { ClientConfigurationMode } from "@/lib/client-enterprise-design/types";
import type { BusinessFieldResolutionStatus } from "@/lib/client-enterprise-design/types";
import type { ClientGrowthIntention, ClientTeamSizeRange } from "@/lib/business-field-catalog/team-scale";

export const CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION = "client-service-request-brief-v1.0.0" as const;

export type ClientServiceRequestBriefAuthority = {
  advisory: true;
  createsBlueprint: false;
  provisionsTenant: false;
  grantsAuthority: false;
  completesDiscovery: false;
};

export const CLIENT_SERVICE_REQUEST_BRIEF_AUTHORITY: ClientServiceRequestBriefAuthority = {
  advisory: true,
  createsBlueprint: false,
  provisionsTenant: false,
  grantsAuthority: false,
  completesDiscovery: false,
};

export type OrganizationContextKind =
  | "NEW_BUSINESS"
  | "EXISTING_ORGANIZATION"
  | "MODERNIZATION"
  | "NEW_DIVISION";

export type PreliminaryRequestRecommendation = {
  essentialCapabilities: string[];
  recommendedCapabilities: string[];
  coreResponsibilities: string[];
  workflowFamilies: string[];
  procrowReviewAreas: string[];
  summary: string;
};

export type ClientServiceRequestBrief = {
  schemaVersion: typeof CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION;
  idempotencyKey: string;
  submittedAt: string | null;
  primaryBusinessFieldKey: string | null;
  secondaryBusinessFieldKeys: string[];
  customFieldDescription: string | null;
  fieldResolutionStatus: BusinessFieldResolutionStatus | null;
  customFieldSuggestedMatches: string[];
  requiresProcrowFieldReview: boolean;
  primaryPurposeKey: string | null;
  secondaryPurposeKeys: string[];
  customPurposeDescription: string | null;
  currentTeamRange: ClientTeamSizeRange | null;
  growthIntention: ClientGrowthIntention | null;
  organizationContext: OrganizationContextKind | null;
  configurationMode: ClientConfigurationMode;
  plainLanguageGoal: string | null;
  letProcrowDecideTechnical: boolean;
  preliminaryRecommendation: PreliminaryRequestRecommendation | null;
  clientAcknowledgements: {
    understandsNoTenantProvisioning: boolean;
    understandsProcrowReview: boolean;
  };
  /** Immutable client statement captured at submission */
  originalClientStatement?: string | null;
  /** ProCrow internal field resolution — does not replace client statement */
  procrowFieldResolution?: ProcrowFieldResolution | null;
};

export type ClientServiceRequestBriefInput = Omit<
  ClientServiceRequestBrief,
  "schemaVersion" | "submittedAt" | "preliminaryRecommendation" | "originalClientStatement"
> & {
  preliminaryRecommendation?: PreliminaryRequestRecommendation | null;
};

export type ProcrowFieldResolution = {
  reviewedCanonicalFieldKey: string | null;
  reviewerNote: string | null;
  resolvedAt: string;
  resolvedByPlatformAccountId: string;
  originalClientDescription: string;
  suggestedCatalogMatches: string[];
};
