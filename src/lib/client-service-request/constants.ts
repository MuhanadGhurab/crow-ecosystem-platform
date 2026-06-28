import { randomUUID } from "node:crypto";

import type { ClientServiceRequestBrief, ClientServiceRequestBriefInput } from "./types";
import { CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION } from "./types";

export const REQUEST_BRIEF_NOTES_MARKER = "__CROW_REQUEST_BRIEF_v1__";

export function serializeRequestBriefToNotes(brief: ClientServiceRequestBrief): string {
  return `${REQUEST_BRIEF_NOTES_MARKER}\n${JSON.stringify(brief)}`;
}

export function parseRequestBriefFromNotes(notes: string | null | undefined): ClientServiceRequestBrief | null {
  if (!notes?.includes(REQUEST_BRIEF_NOTES_MARKER)) return null;
  const jsonStart = notes.indexOf("{");
  if (jsonStart < 0) return null;
  try {
    const parsed = JSON.parse(notes.slice(jsonStart)) as ClientServiceRequestBrief;
    if (parsed.schemaVersion !== CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isModernServiceRequest(notes: string | null | undefined): boolean {
  return Boolean(parseRequestBriefFromNotes(notes));
}

export function buildDefaultRequestBrief(
  partial: Partial<ClientServiceRequestBriefInput> = {},
): ClientServiceRequestBrief {
  return {
    schemaVersion: CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION,
    idempotencyKey: partial.idempotencyKey ?? randomUUID(),
    submittedAt: null,
    primaryBusinessFieldKey: partial.primaryBusinessFieldKey ?? null,
    secondaryBusinessFieldKeys: partial.secondaryBusinessFieldKeys ?? [],
    customFieldDescription: partial.customFieldDescription ?? null,
    fieldResolutionStatus: partial.fieldResolutionStatus ?? null,
    customFieldSuggestedMatches: partial.customFieldSuggestedMatches ?? [],
    requiresProcrowFieldReview: partial.requiresProcrowFieldReview ?? false,
    primaryPurposeKey: partial.primaryPurposeKey ?? null,
    secondaryPurposeKeys: partial.secondaryPurposeKeys ?? [],
    customPurposeDescription: partial.customPurposeDescription ?? null,
    currentTeamRange: partial.currentTeamRange ?? null,
    growthIntention: partial.growthIntention ?? null,
    organizationContext: partial.organizationContext ?? null,
    configurationMode: partial.configurationMode ?? "RECOMMEND_EVERYTHING",
    plainLanguageGoal: partial.plainLanguageGoal ?? null,
    letProcrowDecideTechnical: partial.letProcrowDecideTechnical ?? true,
    preliminaryRecommendation: partial.preliminaryRecommendation ?? null,
    clientAcknowledgements: partial.clientAcknowledgements ?? {
      understandsNoTenantProvisioning: false,
      understandsProcrowReview: false,
    },
  };
}

export function markBriefSubmitted(brief: ClientServiceRequestBrief): ClientServiceRequestBrief {
  return {
    ...brief,
    submittedAt: new Date().toISOString(),
    originalClientStatement: brief.originalClientStatement ?? buildOriginalClientStatement(brief),
  };
}

export function buildOriginalClientStatement(brief: ClientServiceRequestBrief): string {
  const parts = [
    brief.plainLanguageGoal,
    brief.customFieldDescription,
    brief.customPurposeDescription,
  ].filter(Boolean);
  return parts.join(" · ") || "Service request submitted.";
}
