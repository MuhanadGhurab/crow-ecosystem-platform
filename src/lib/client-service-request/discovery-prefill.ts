import type { ClientEnterpriseDesignDraft } from "@/lib/client-enterprise-design/types";
import { CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION } from "@/lib/client-enterprise-design/types";
import { emptyClientEnterpriseDesignDraft } from "@/lib/client-enterprise-design/persistence/constants";
import { applyBusinessFieldToDraft } from "@/lib/client-enterprise-design/intake/field-resolution";
import { teamSizeToCurrentScale, growthToTargetScale } from "@/lib/business-field-catalog/team-scale";
import type { ClientServiceRequestBrief } from "./types";
import { parseRequestBriefFromNotes } from "./constants";

export function parseRequestBriefFromRequest(notes: string | null): ClientServiceRequestBrief | null {
  return parseRequestBriefFromNotes(notes);
}

export function prefillDesignDraftFromRequestBrief(
  requestId: string,
  brief: ClientServiceRequestBrief,
  existing: ClientEnterpriseDesignDraft,
): ClientEnterpriseDesignDraft {
  const hasExisting =
    existing.primaryBusinessFieldKey ||
    existing.primaryIndustry ||
    existing.customFieldDescription ||
    existing.businessPurposes.length > 0;
  if (hasExisting) return existing;

  let draft = emptyClientEnterpriseDesignDraft(requestId);
  if (brief.primaryBusinessFieldKey) {
    draft = { ...draft, ...applyBusinessFieldToDraft(draft, brief.primaryBusinessFieldKey) };
    for (const key of brief.secondaryBusinessFieldKeys) {
      draft = { ...draft, ...applyBusinessFieldToDraft(draft, key, true) };
    }
  } else if (brief.customFieldDescription) {
    draft = {
      ...draft,
      customFieldDescription: brief.customFieldDescription,
      fieldResolutionStatus: brief.fieldResolutionStatus ?? "CUSTOM_UNRESOLVED",
      customFieldSuggestedMatches: brief.customFieldSuggestedMatches,
      requiresProcrowFieldReview: brief.requiresProcrowFieldReview,
    };
  }

  const purposes = brief.primaryPurposeKey
    ? [brief.primaryPurposeKey, ...brief.secondaryPurposeKeys]
    : brief.customPurposeDescription
      ? ["custom_purpose"]
      : [];

  return {
    ...draft,
    designVersion: CLIENT_ENTERPRISE_DESIGN_SCHEMA_VERSION,
    businessPurposes: purposes,
    primaryPurposeKey: brief.primaryPurposeKey ?? (brief.customPurposeDescription ? "custom_purpose" : null),
    customPurposeDescription: brief.customPurposeDescription,
    teamSizeRange: brief.currentTeamRange,
    growthIntention: brief.growthIntention,
    currentScale: teamSizeToCurrentScale(brief.currentTeamRange),
    targetScale: growthToTargetScale(brief.growthIntention),
    configurationMode: brief.configurationMode,
    letProcrowDecideTechnical: brief.letProcrowDecideTechnical,
    clientNotes: brief.plainLanguageGoal,
    organizationalPreferences: {
      ...draft.organizationalPreferences,
      prefilledFromRequestBrief: true,
    },
  };
}

export function requestBriefProvidedLabel(draft: ClientEnterpriseDesignDraft): boolean {
  return draft.organizationalPreferences?.prefilledFromRequestBrief === true;
}
