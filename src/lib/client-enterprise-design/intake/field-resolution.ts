import { getBusinessField } from "@/lib/business-field-catalog/fields";
import type { ClientEnterpriseDesignDraft } from "../types";

/** Maps universal business field selection to legacy industry archetype for recommendations. */
export function resolveIndustryFromBusinessField(fieldKey: string | null): string | null {
  if (!fieldKey) return null;
  const field = getBusinessField(fieldKey);
  return field?.relatedIndustryArchetypeKey ?? null;
}

export function applyBusinessFieldToDraft(
  draft: ClientEnterpriseDesignDraft,
  fieldKey: string,
  asSecondary = false,
): Partial<ClientEnterpriseDesignDraft> {
  const field = getBusinessField(fieldKey);
  const archetype = field?.relatedIndustryArchetypeKey ?? null;
  if (asSecondary) {
    const secondaryFields = [...new Set([...draft.secondaryBusinessFieldKeys, fieldKey])];
    const secondaryIndustries = archetype
      ? [...new Set([...draft.secondaryIndustries, archetype])]
      : draft.secondaryIndustries;
    return {
      secondaryBusinessFieldKeys: secondaryFields,
      secondaryIndustries,
      specialistDomains: field
        ? [...new Set([...draft.specialistDomains, ...field.relatedSpecialistDomainKeys])]
        : draft.specialistDomains,
    };
  }
  return {
    primaryBusinessFieldKey: fieldKey,
    primaryIndustry: archetype ?? draft.primaryIndustry,
    fieldResolutionStatus: "CATALOG_MATCH",
    requiresProcrowFieldReview: false,
    customFieldDescription: null,
    specialistDomains: field
      ? [...new Set([...draft.specialistDomains, ...field.relatedSpecialistDomainKeys])]
      : draft.specialistDomains,
  };
}

export function applyCustomFieldFallback(
  draft: ClientEnterpriseDesignDraft,
  description: string,
  suggestedMatchKeys: string[],
): Partial<ClientEnterpriseDesignDraft> {
  return {
    customFieldDescription: description,
    fieldResolutionStatus: "CUSTOM_UNRESOLVED",
    customFieldSuggestedMatches: suggestedMatchKeys,
    requiresProcrowFieldReview: true,
    primaryBusinessFieldKey: null,
  };
}

export const CLIENT_FRIENDLY_CAPABILITY_LABELS: Record<string, string> = {
  crm: "Customer management",
  project_management: "Projects and work delivery",
  invoice_workflow: "Finance operations",
  workforce_directory: "People and workforce",
  inventory: "Inventory",
  procurement: "Procurement",
  asset_registry: "Assets",
  booking_scheduling: "Bookings",
  case_management: "Case management",
  documents: "Documents",
  request_and_approval: "Approvals",
  reporting: "Reporting",
  work_orders: "Field operations",
  automation: "Automation",
};

export function friendlyCapabilityLabel(key: string): string {
  return CLIENT_FRIENDLY_CAPABILITY_LABELS[key] ?? key.replace(/_/g, " ");
}
