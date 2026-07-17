import type { ClientEnterpriseDesignDraft, ClientEnterpriseDesignInput } from "../types";
import { CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION } from "../types";
import { composeClientEnterpriseDesign } from "../recommendations/compose-client-enterprise-design";

export const CLIENT_ENTERPRISE_DESIGN_SECTION = "client_enterprise_design" as const;
export const CLIENT_ENTERPRISE_DESIGN_QUESTION_VERSION = "client-enterprise-design-v1.0.0" as const;

export const CLIENT_DESIGN_ANSWER_KEYS = {
  draftSnapshot: "v1.draft_snapshot",
  designStatus: "v1.design_status",
  submittedAt: "v1.submitted_at",
  snapshotHash: "v1.snapshot_hash",
} as const;

export function emptyClientEnterpriseDesignDraft(requestId: string): ClientEnterpriseDesignDraft {
  return {
    designVersion: CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION,
    requestId,
    status: "DRAFT",
    primaryIndustry: null,
    secondaryIndustries: [],
    specialistDomains: [],
    businessPurposes: [],
    primaryPurposeKey: null,
    currentScale: "SMALL_TEAM",
    targetScale: "GROWING_ORGANIZATION",
    scaleDimensions: {},
    operatingPriority: "LEAN_RESPONSIBLE",
    selectedCapabilities: [],
    selectedDomainPacks: [],
    organizationalPreferences: {},
    workforceConstraints: [],
    automationPreferences: [],
    riskPreferences: [],
    selectedModelVariant: "STARTER",
    customizations: [],
    unresolvedDecisions: [],
    clientNotes: null,
    configurationMode: "RECOMMEND_EVERYTHING",
    primaryBusinessFieldKey: null,
    secondaryBusinessFieldKeys: [],
    customFieldDescription: null,
    fieldResolutionStatus: null,
    customFieldSuggestedMatches: [],
    requiresProcrowFieldReview: false,
    teamSizeRange: null,
    growthIntention: null,
    customPurposeDescription: null,
    letProcrowDecideTechnical: false,
    recommendationSnapshot: null,
    updatedAt: null,
    submittedAt: null,
  };
}

export function draftFromInput(
  requestId: string,
  input: ClientEnterpriseDesignInput,
  status: ClientEnterpriseDesignDraft["status"] = "DRAFT",
): ClientEnterpriseDesignDraft {
  const snapshot = composeClientEnterpriseDesign(input);
  return {
    designVersion: CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION,
    requestId,
    status,
    primaryIndustry: input.primaryIndustry,
    secondaryIndustries: input.secondaryIndustries,
    specialistDomains: input.specialistDomains,
    businessPurposes: input.businessPurposes,
    primaryPurposeKey: input.primaryPurposeKey,
    currentScale: input.currentScale,
    targetScale: input.targetScale,
    scaleDimensions: input.scaleDimensions,
    operatingPriority: input.operatingPriority,
    selectedCapabilities: input.selectedCapabilities,
    selectedDomainPacks: [],
    organizationalPreferences: input.organizationalPreferences ?? {},
    workforceConstraints: input.workforceConstraints ?? [],
    automationPreferences: input.automationPreferences ?? [],
    riskPreferences: input.riskPreferences ?? [],
    selectedModelVariant: input.selectedModelVariant,
    customizations: input.customizations ?? [],
    unresolvedDecisions: snapshot.unresolvedDecisions,
    clientNotes: null,
    configurationMode: input.configurationMode ?? "RECOMMEND_EVERYTHING",
    primaryBusinessFieldKey: input.primaryBusinessFieldKey ?? null,
    secondaryBusinessFieldKeys: input.secondaryBusinessFieldKeys ?? [],
    customFieldDescription: input.customFieldDescription ?? null,
    fieldResolutionStatus: input.fieldResolutionStatus ?? null,
    customFieldSuggestedMatches: [],
    requiresProcrowFieldReview: false,
    teamSizeRange: input.teamSizeRange ?? null,
    growthIntention: input.growthIntention ?? null,
    customPurposeDescription: input.customPurposeDescription ?? null,
    letProcrowDecideTechnical: input.letProcrowDecideTechnical ?? false,
    recommendationSnapshot: snapshot,
    updatedAt: new Date().toISOString(),
    submittedAt: status === "SUBMITTED" ? new Date().toISOString() : null,
  };
}

export function sanitizeDraftForPersistence(draft: ClientEnterpriseDesignDraft): ClientEnterpriseDesignDraft {
  const clone = structuredClone(draft);
  delete (clone as { actorPlatformAccountId?: string }).actorPlatformAccountId;
  delete (clone as { supabaseUserId?: string }).supabaseUserId;
  delete (clone as { email?: string }).email;
  return clone;
}

export function normalizeClientEnterpriseDesignDraft(
  draft: ClientEnterpriseDesignDraft,
): ClientEnterpriseDesignDraft {
  const base = emptyClientEnterpriseDesignDraft(draft.requestId);
  return {
    ...base,
    ...draft,
    designVersion: CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION,
    secondaryIndustries: draft.secondaryIndustries ?? [],
    secondaryBusinessFieldKeys: draft.secondaryBusinessFieldKeys ?? [],
    customFieldSuggestedMatches: draft.customFieldSuggestedMatches ?? [],
    configurationMode: draft.configurationMode ?? "RECOMMEND_EVERYTHING",
    letProcrowDecideTechnical: draft.letProcrowDecideTechnical ?? false,
    requiresProcrowFieldReview: draft.requiresProcrowFieldReview ?? false,
  };
}

export function draftToInput(draft: ClientEnterpriseDesignDraft): ClientEnterpriseDesignInput {
  return {
    primaryIndustry: draft.primaryIndustry,
    secondaryIndustries: draft.secondaryIndustries,
    specialistDomains: draft.specialistDomains,
    businessPurposes: draft.businessPurposes,
    primaryPurposeKey: draft.primaryPurposeKey,
    currentScale: draft.currentScale,
    targetScale: draft.targetScale,
    scaleDimensions: draft.scaleDimensions,
    operatingPriority: draft.operatingPriority,
    selectedCapabilities: draft.selectedCapabilities,
    organizationalPreferences: draft.organizationalPreferences,
    workforceConstraints: draft.workforceConstraints,
    automationPreferences: draft.automationPreferences,
    riskPreferences: draft.riskPreferences,
    selectedModelVariant: draft.selectedModelVariant,
    customizations: draft.customizations,
    configurationMode: draft.configurationMode,
    primaryBusinessFieldKey: draft.primaryBusinessFieldKey,
    secondaryBusinessFieldKeys: draft.secondaryBusinessFieldKeys,
    customFieldDescription: draft.customFieldDescription,
    fieldResolutionStatus: draft.fieldResolutionStatus,
    teamSizeRange: draft.teamSizeRange,
    growthIntention: draft.growthIntention,
    customPurposeDescription: draft.customPurposeDescription,
    letProcrowDecideTechnical: draft.letProcrowDecideTechnical,
  };
}
