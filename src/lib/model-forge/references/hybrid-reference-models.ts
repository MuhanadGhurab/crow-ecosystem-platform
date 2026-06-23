import type { HybridCompositionInput } from "../types";
import { composeEnterpriseModel } from "../composition/hybrid-composition";

export type HybridReferenceModel = {
  key: string;
  displayName: string;
  description: string;
  input: HybridCompositionInput;
};

export const HYBRID_REFERENCE_MODELS: readonly HybridReferenceModel[] = [
  {
    key: "gaming_live_services_studio",
    displayName: "Gaming live services studio",
    description: "SaaS + gaming + digital publishing hybrid.",
    input: {
      primaryIndustry: "technology_and_saas",
      secondaryIndustries: ["media_and_creative"],
      specialistDomains: ["gaming_and_esports", "digital_content_publishing"],
      organizationalOverlays: ["mid_market", "customer_membership"],
      scaleProfile: { preset: "GROWING_ORGANIZATION", dimensions: { workforceScale: 5, branchScale: 2, workflowVolume: 7, workflowComplexity: 6, approvalDepth: 4, externalActorVolume: 8, assetIntensity: 3, projectIntensity: 5, dataSensitivity: 6, regulatoryIntensity: 3, geographicDistribution: 5, automationMaturity: 6, fieldWorkforceIntensity: 2 }, displayName: "Growing", description: "Growing live services studio" },
      topologies: ["PRODUCT_TEAMS", "COMMAND_CENTER"],
      organizationSignals: { approval_complexity: "medium", subscription_model: true },
    },
  },
  {
    key: "legal_professional_services_firm",
    displayName: "Legal professional services firm",
    description: "Professional services + legal specialist domain.",
    input: {
      primaryIndustry: "professional_services",
      specialistDomains: ["legal_services"],
      organizationalOverlays: ["enterprise", "highly_regulated"],
      scaleProfile: { preset: "ENTERPRISE", dimensions: { workforceScale: 8, branchScale: 5, workflowVolume: 7, workflowComplexity: 7, approvalDepth: 7, externalActorVolume: 6, assetIntensity: 2, projectIntensity: 6, dataSensitivity: 9, regulatoryIntensity: 8, geographicDistribution: 6, automationMaturity: 5, fieldWorkforceIntensity: 2 }, displayName: "Enterprise", description: "Enterprise legal firm" },
      topologies: ["DEPARTMENTAL_HIERARCHY", "CASE_TEAMS"],
      organizationSignals: { approval_complexity: "high" },
    },
  },
  {
    key: "film_and_production_company",
    displayName: "Film and production company",
    description: "Media production with rights and crew workflows.",
    input: {
      primaryIndustry: "media_and_creative",
      specialistDomains: ["film_and_video_production", "music_and_audio_production"],
      organizationalOverlays: ["project_based", "vendor_heavy"],
      topologies: ["PROJECT_BASED"],
      organizationSignals: { approval_complexity: "medium" },
    },
  },
  {
    key: "construction_accommodation_operator",
    displayName: "Construction accommodation operator",
    description: "Construction + logistics + workforce accommodation.",
    input: {
      primaryIndustry: "construction_and_epc",
      secondaryIndustries: ["logistics_and_fleet", "hospitality_and_tourism"],
      specialistDomains: ["equipment_rental", "maintenance_services"],
      organizationalOverlays: ["field_workforce", "multi_branch", "project_based"],
      topologies: ["MISSION_TEAMS", "COMMAND_CENTER"],
      organizationSignals: { field_workforce: true, approval_complexity: "high" },
    },
  },
  {
    key: "fitness_coaching_commerce_platform",
    displayName: "Fitness coaching commerce platform",
    description: "Fitness + membership + coaching hybrid.",
    input: {
      primaryIndustry: "fitness_and_wellness",
      specialistDomains: ["membership_and_clubs", "beauty_and_personal_care"],
      organizationalOverlays: ["customer_membership", "multi_branch"],
      topologies: ["OUTCOME_PODS"],
      organizationSignals: { approval_complexity: "low" },
    },
  },
  {
    key: "creative_marketing_agency",
    displayName: "Creative marketing agency",
    description: "Agency + publishing + client delivery.",
    input: {
      primaryIndustry: "professional_services",
      secondaryIndustries: ["media_and_creative"],
      specialistDomains: ["marketing_and_creative_agency", "digital_content_publishing"],
      topologies: ["PROJECT_BASED", "MATRIX"],
      organizationSignals: { approval_complexity: "medium" },
    },
  },
  {
    key: "research_laboratory_operator",
    displayName: "Research laboratory operator",
    description: "Research ops with evidence custody.",
    input: {
      primaryIndustry: "healthcare_operations",
      specialistDomains: ["research_and_laboratory_operations"],
      organizationalOverlays: ["highly_regulated"],
      topologies: ["CASE_TEAMS"],
      organizationSignals: { regulatory_needs: "high", approval_complexity: "high" },
    },
  },
  {
    key: "equipment_rental_field_service",
    displayName: "Equipment rental field service",
    description: "Equipment rental with field dispatch.",
    input: {
      primaryIndustry: "construction_and_epc",
      specialistDomains: ["equipment_rental", "maintenance_services"],
      organizationalOverlays: ["field_workforce", "asset_heavy"],
      topologies: ["COMMAND_CENTER"],
      organizationSignals: { field_workforce: true },
    },
  },
  {
    key: "hospitality_events_membership_group",
    displayName: "Hospitality events membership group",
    description: "Hospitality + events + membership.",
    input: {
      primaryIndustry: "hospitality_and_tourism",
      secondaryIndustries: ["events_and_venues"],
      specialistDomains: ["membership_and_clubs"],
      organizationalOverlays: ["seasonal_workforce", "customer_membership"],
      topologies: ["SEASONAL_POP_UP"],
      organizationSignals: { approval_complexity: "medium" },
    },
  },
  {
    key: "technology_services_academy",
    displayName: "Technology services academy",
    description: "SaaS services + education delivery.",
    input: {
      primaryIndustry: "technology_and_saas",
      secondaryIndustries: ["education_and_training"],
      specialistDomains: ["digital_content_publishing"],
      organizationalOverlays: ["mid_market"],
      topologies: ["PRODUCT_TEAMS"],
      organizationSignals: { approval_complexity: "medium" },
    },
  },
] as const;

export function getHybridReferenceModel(key: string) {
  const ref = HYBRID_REFERENCE_MODELS.find((r) => r.key === key);
  if (!ref) return undefined;
  return { ...ref, draft: composeEnterpriseModel(ref.input) };
}
