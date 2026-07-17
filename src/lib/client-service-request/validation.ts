import type { ClientServiceRequestBrief, ClientServiceRequestBriefInput } from "./types";
import { CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION } from "./types";

export function validateClientServiceRequestBrief(
  input: unknown,
): { ok: true; brief: ClientServiceRequestBriefInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!input || typeof input !== "object") return { ok: false, errors: ["brief must be an object"] };
  const b = input as Partial<ClientServiceRequestBrief>;

  const hasField =
    b.primaryBusinessFieldKey ||
    (b.customFieldDescription && b.customFieldDescription.trim().length >= 10);
  if (!hasField) errors.push("business field or custom description required");

  const hasPurpose = b.primaryPurposeKey || (b.customPurposeDescription && b.customPurposeDescription.trim().length >= 5);
  if (!hasPurpose) errors.push("business purpose required");

  if (!b.currentTeamRange) errors.push("current team range required");
  if (!b.growthIntention) errors.push("growth intention required");
  if (!b.configurationMode) errors.push("configuration mode required");
  if (!b.idempotencyKey || typeof b.idempotencyKey !== "string") errors.push("idempotencyKey required");

  if (!b.clientAcknowledgements?.understandsNoTenantProvisioning) {
    errors.push("must acknowledge request does not provision a tenant");
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    brief: {
      idempotencyKey: b.idempotencyKey!,
      primaryBusinessFieldKey: b.primaryBusinessFieldKey ?? null,
      secondaryBusinessFieldKeys: b.secondaryBusinessFieldKeys ?? [],
      customFieldDescription: b.customFieldDescription?.trim() || null,
      fieldResolutionStatus: b.fieldResolutionStatus ?? null,
      customFieldSuggestedMatches: b.customFieldSuggestedMatches ?? [],
      requiresProcrowFieldReview: b.requiresProcrowFieldReview ?? false,
      primaryPurposeKey: b.primaryPurposeKey ?? null,
      secondaryPurposeKeys: b.secondaryPurposeKeys ?? [],
      customPurposeDescription: b.customPurposeDescription?.trim() || null,
      currentTeamRange: b.currentTeamRange!,
      growthIntention: b.growthIntention!,
      organizationContext: b.organizationContext ?? null,
      configurationMode: b.configurationMode!,
      plainLanguageGoal: b.plainLanguageGoal?.trim() || null,
      letProcrowDecideTechnical: b.letProcrowDecideTechnical ?? true,
      clientAcknowledgements: b.clientAcknowledgements!,
    },
  };
}

export function sanitizeBriefForPersistence(brief: ClientServiceRequestBrief): ClientServiceRequestBrief {
  const clone = structuredClone(brief);
  delete (clone as { actorPlatformAccountId?: string }).actorPlatformAccountId;
  delete (clone as { email?: string }).email;
  return clone;
}

export function briefSchemaVersionOk(brief: ClientServiceRequestBrief): boolean {
  return brief.schemaVersion === CLIENT_SERVICE_REQUEST_BRIEF_SCHEMA_VERSION;
}
