import type { ClientServiceRequestBrief, ClientServiceRequestBriefInput } from "./types";
import { CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION } from "./types";
import { parseProcrowQualification } from "@/lib/procrow/procrow-qualification";

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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
    return {
      ...parsed,
      journeyKind:
        parsed.journeyKind === "NEW" || parsed.journeyKind === "TRANSFORM"
          ? parsed.journeyKind
          : null,
      procrowQualification: parseProcrowQualification(parsed.procrowQualification),
    };
  } catch {
    return null;
  }
}

export function isModernServiceRequest(notes: string | null | undefined): boolean {
  return Boolean(parseRequestBriefFromNotes(notes));
}

/** True when brief marks request qualified for Discovery handoff (no server deps). */
export function briefIsQualifiedForDiscovery(notes: string | null | undefined): boolean {
  const brief = parseRequestBriefFromNotes(notes);
  return brief?.procrowQualification?.outcome === "qualified_for_discovery";
}

export function buildDefaultRequestBrief(
  partial: Partial<ClientServiceRequestBriefInput> = {},
): ClientServiceRequestBrief {
  return {
    schemaVersion: CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION,
    idempotencyKey: partial.idempotencyKey ?? newIdempotencyKey(),
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
    journeyKind: partial.journeyKind ?? null,
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
