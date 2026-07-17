import { getBusinessField } from "@/lib/business-field-catalog/fields";
import { teamSizeToCurrentScale, growthToTargetScale } from "@/lib/business-field-catalog/team-scale";
import { resolveIndustryFromBusinessField } from "@/lib/client-enterprise-design/intake/field-resolution";
import { friendlyCapabilityLabel } from "@/lib/client-enterprise-design/intake/field-resolution";
import { composeClientEnterpriseDesign } from "@/lib/client-enterprise-design/recommendations/compose-client-enterprise-design";
import { getBusinessPurpose } from "@/lib/client-enterprise-design/purposes/business-purpose-catalog";
import type { ClientServiceRequestBriefInput, PreliminaryRequestRecommendation } from "./types";
import { buildDefaultRequestBrief } from "./constants";

export function buildPreliminaryRequestRecommendation(
  input: ClientServiceRequestBriefInput,
): PreliminaryRequestRecommendation {
  const industry = resolveIndustryFromBusinessField(input.primaryBusinessFieldKey);
  const purposes = input.primaryPurposeKey
    ? [input.primaryPurposeKey, ...input.secondaryPurposeKeys]
    : input.customPurposeDescription
      ? ["custom_purpose"]
      : [];

  const snapshot = composeClientEnterpriseDesign({
    primaryIndustry: industry,
    secondaryIndustries: [],
    specialistDomains: [],
    businessPurposes: purposes,
    primaryPurposeKey: input.primaryPurposeKey ?? (input.customPurposeDescription ? "custom_purpose" : null),
    currentScale: teamSizeToCurrentScale(input.currentTeamRange),
    targetScale: growthToTargetScale(input.growthIntention),
    scaleDimensions: {},
    operatingPriority: "LEAN_RESPONSIBLE",
    selectedCapabilities: [],
    selectedModelVariant: "STARTER",
    configurationMode: input.configurationMode,
    primaryBusinessFieldKey: input.primaryBusinessFieldKey,
    letProcrowDecideTechnical: input.letProcrowDecideTechnical,
  });

  const essential = snapshot.recommendedCapabilities.slice(0, 4);
  const recommended = snapshot.recommendedCapabilities.slice(4, 8);
  const purposeLabel = input.primaryPurposeKey
    ? (getBusinessPurpose(input.primaryPurposeKey)?.displayName ?? input.primaryPurposeKey)
    : input.customPurposeDescription;

  const fieldLabel =
    (input.primaryBusinessFieldKey && getBusinessField(input.primaryBusinessFieldKey)?.displayNameEn) ||
    input.customFieldDescription ||
    "Your business";

  const procrowReviewAreas: string[] = [];
  if (input.requiresProcrowFieldReview) procrowReviewAreas.push("Business field classification");
  if (input.letProcrowDecideTechnical) {
    procrowReviewAreas.push("Security controls", "Integrations", "Workflow topology");
  }
  if (input.configurationMode === "EXPERT_CONFIGURATION") {
    procrowReviewAreas.push("Advanced configuration preferences");
  }

  return {
    essentialCapabilities: essential.map(friendlyCapabilityLabel),
    recommendedCapabilities: recommended.map(friendlyCapabilityLabel),
    coreResponsibilities: snapshot.recommendedPersonaKeys.slice(0, 4).map((k) => k.replace(/_/g, " ")),
    workflowFamilies: snapshot.workflowSummaries.slice(0, 3).map((w) => w.displayName),
    procrowReviewAreas,
    summary: `For ${fieldLabel} focused on ${purposeLabel}, Crow suggests starting with ${essential.map(friendlyCapabilityLabel).join(", ") || "core operations"}. ProCrow will verify during Discovery.`,
  };
}

export function finalizeRequestBrief(input: ClientServiceRequestBriefInput) {
  const recommendation = buildPreliminaryRequestRecommendation(input);
  return buildDefaultRequestBrief({ ...input, preliminaryRecommendation: recommendation });
}

export function deriveOrganizationName(brief: ClientServiceRequestBriefInput): string {
  if (brief.primaryBusinessFieldKey) {
    const field = getBusinessField(brief.primaryBusinessFieldKey);
    if (field) return field.displayNameEn;
  }
  if (brief.customFieldDescription) {
    return brief.customFieldDescription.slice(0, 120).trim();
  }
  return "Service request";
}
