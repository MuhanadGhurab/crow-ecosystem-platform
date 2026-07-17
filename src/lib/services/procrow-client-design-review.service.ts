import "@/lib/server-only-guard";

import { listIndustryArchetypes } from "@/lib/tenant-composition/registry";
import { listSpecialistDomains } from "@/lib/model-forge/specialist-domains";
import { getBusinessPurpose } from "@/lib/client-enterprise-design/purposes/business-purpose-catalog";
import { projectSnapshotSummary } from "@/lib/client-enterprise-design/projection/client-projections";
import { loadClientEnterpriseDesignDraft } from "@/lib/client-enterprise-design/persistence/client-design-discovery.service";
import { draftToInput } from "@/lib/client-enterprise-design/persistence/constants";
import { composeClientEnterpriseDesign } from "@/lib/client-enterprise-design/recommendations/compose-client-enterprise-design";

export async function buildProCrowClientDesignReviewSnapshot(requestId: string) {
  const { draft } = await loadClientEnterpriseDesignDraft(requestId);
  if (!draft.primaryIndustry && draft.businessPurposes.length === 0) {
    return null;
  }
  const snapshot =
    draft.recommendationSnapshot ?? composeClientEnterpriseDesign(draftToInput(draft));
  const industry = listIndustryArchetypes().find((i) => i.key === draft.primaryIndustry);
  const domains = draft.specialistDomains
    .map((k) => listSpecialistDomains().find((d) => d.key === k))
    .filter(Boolean);
  const purposes = draft.businessPurposes
    .map((k) => getBusinessPurpose(k))
    .filter(Boolean);

  return {
    draft,
    snapshot,
    projection: projectSnapshotSummary(snapshot),
    clientSelections: {
      field: industry?.displayName ?? draft.primaryIndustry,
      domains: domains.map((d) => d!.displayName),
      purposes: purposes.map((p) => p!.displayName),
      primaryPurpose: draft.primaryPurposeKey
        ? getBusinessPurpose(draft.primaryPurposeKey)?.displayName ?? draft.primaryPurposeKey
        : null,
      currentScale: draft.currentScale,
      targetScale: draft.targetScale,
      operatingPriority: draft.operatingPriority,
      selectedVariant: draft.selectedModelVariant,
      capabilities: draft.selectedCapabilities,
      clientNotes: draft.clientNotes,
      customizations: draft.customizations,
      warnings: snapshot.warnings,
      unresolvedDecisions: draft.unresolvedDecisions,
    },
    crowRecommendations: {
      recommendedVariant: snapshot.recommendedVariant,
      recommendedCapabilities: snapshot.recommendedCapabilities,
      recommendedPersonas: snapshot.recommendedPersonaKeys,
      leanModel: snapshot.leanModel,
      provenanceCount: snapshot.provenance.length,
    },
  };
}
