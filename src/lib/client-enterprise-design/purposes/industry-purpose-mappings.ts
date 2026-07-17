import { listIndustryArchetypes } from "@/lib/tenant-composition/registry";
import { listSpecialistDomains } from "@/lib/model-forge/specialist-domains";
import { BUSINESS_PURPOSE_CATALOG, getBusinessPurpose } from "./business-purpose-catalog";

const INDUSTRY_PURPOSE_MAP: Record<string, string[]> = {
  logistics_and_fleet: ["operate_logistics", "run_field_services", "operate_assets"],
  construction_and_epc: ["deliver_projects", "manage_contractors", "run_field_services", "rent_equipment"],
  retail_and_commerce: ["sell_products", "operate_multi_branch_services", "run_customer_support"],
  manufacturing_and_industrial: ["manufacture_goods", "operate_assets", "operate_logistics"],
  professional_services: ["deliver_professional_services", "manage_cases", "deliver_projects"],
  property_and_facilities: ["manage_properties", "operate_assets", "run_field_services"],
  hospitality_and_tourism: ["manage_events", "manage_memberships", "run_customer_support"],
  healthcare_operations: ["manage_cases", "manage_research", "operate_multi_branch_services"],
  education_and_training: ["provide_training", "manage_memberships", "deliver_professional_services"],
  events_and_venues: ["manage_events", "run_field_services", "manage_contractors"],
  media_and_creative: ["produce_content", "deliver_professional_services", "manage_cases"],
  fitness_and_wellness: ["manage_memberships", "run_customer_support", "operate_multi_branch_services"],
  technology_and_saas: ["operate_live_services", "run_customer_support", "build_a_marketplace"],
  food_service: ["sell_products", "operate_logistics", "run_field_services"],
  nonprofit_and_associations: ["manage_memberships", "manage_events", "deliver_professional_services"],
  holding_group: ["operate_multi_branch_services", "deliver_professional_services", "manage_contractors"],
};

const DOMAIN_PURPOSE_MAP: Record<string, string[]> = {
  legal_services: ["manage_cases", "deliver_professional_services"],
  gaming_and_esports: ["operate_live_services", "run_customer_support", "manage_events"],
  film_and_video_production: ["produce_content", "deliver_projects"],
  music_and_audio_production: ["produce_content", "manage_cases"],
  architecture_and_design: ["deliver_professional_services", "deliver_projects"],
  marketing_and_creative_agency: ["produce_content", "deliver_professional_services"],
  recruitment_and_staffing: ["deliver_professional_services", "manage_cases"],
  equipment_rental: ["rent_equipment", "operate_assets", "run_field_services"],
  research_and_laboratory_operations: ["manage_research", "manage_cases"],
  agriculture_and_farming: ["operate_assets", "run_field_services", "manufacture_goods"],
  energy_and_utilities_operations: ["operate_assets", "manage_contractors", "run_field_services"],
  telecom_operations: ["operate_live_services", "run_customer_support"],
  aviation_and_airport_operations: ["operate_logistics", "run_field_services"],
  maritime_and_port_operations: ["operate_logistics", "operate_assets"],
  automotive_services: ["run_field_services", "sell_products"],
  beauty_and_personal_care: ["manage_memberships", "run_customer_support"],
  coworking_and_flexible_space: ["manage_properties", "manage_memberships"],
  property_brokerage: ["sell_products", "manage_cases"],
  maintenance_services: ["run_field_services", "operate_assets"],
  security_services: ["run_field_services", "manage_contractors"],
  cleaning_and_facility_services: ["run_field_services", "manage_properties"],
  membership_and_clubs: ["manage_memberships", "manage_events"],
  creator_and_talent_management: ["produce_content", "manage_cases"],
  digital_content_publishing: ["produce_content", "operate_live_services"],
  public_service_operations: ["manage_cases", "operate_multi_branch_services"],
};

export function recommendedPurposesForIndustry(industryKey: string): string[] {
  const mapped = INDUSTRY_PURPOSE_MAP[industryKey];
  if (mapped?.length) return mapped;
  return ["deliver_professional_services", "manage_cases", "operate_multi_branch_services"];
}

export function recommendedPurposesForSpecialistDomain(domainKey: string): string[] {
  const mapped = DOMAIN_PURPOSE_MAP[domainKey];
  if (mapped?.length) return mapped;
  const domain = listSpecialistDomains().find((d) => d.key === domainKey);
  if (!domain) return ["deliver_professional_services"];
  const fromIndustries = domain.applicableIndustryKeys.flatMap((k) => recommendedPurposesForIndustry(k));
  return [...new Set(fromIndustries)].slice(0, 4);
}

export function resolveRecommendedPurposes(input: {
  primaryIndustry: string | null;
  specialistDomains: string[];
}): string[] {
  const keys = new Set<string>();
  if (input.primaryIndustry) {
    for (const k of recommendedPurposesForIndustry(input.primaryIndustry)) keys.add(k);
  }
  for (const d of input.specialistDomains) {
    for (const k of recommendedPurposesForSpecialistDomain(d)) keys.add(k);
  }
  return [...keys];
}

export function purposesForFieldSelection(primaryIndustry: string | null, domains: string[]) {
  const keys = new Set<string>();
  if (primaryIndustry) {
    for (const k of recommendedPurposesForIndustry(primaryIndustry)) keys.add(k);
  }
  for (const d of domains) {
    for (const k of recommendedPurposesForSpecialistDomain(d)) keys.add(k);
  }
  return [...keys]
    .map((k) => getBusinessPurpose(k))
    .filter((p): p is NonNullable<ReturnType<typeof getBusinessPurpose>> => Boolean(p));
}

export function assertIndustryPurposeCoverage(): { industries: number; domains: number; gaps: string[] } {
  const gaps: string[] = [];
  for (const industry of listIndustryArchetypes()) {
    const purposes = recommendedPurposesForIndustry(industry.key);
    if (!purposes.length) gaps.push(`industry:${industry.key}`);
    for (const p of purposes) {
      if (!getBusinessPurpose(p)) gaps.push(`industry:${industry.key}:missing-purpose:${p}`);
    }
  }
  for (const domain of listSpecialistDomains()) {
    const purposes = recommendedPurposesForSpecialistDomain(domain.key);
    if (!purposes.length) gaps.push(`domain:${domain.key}`);
    for (const p of purposes) {
      if (!getBusinessPurpose(p)) gaps.push(`domain:${domain.key}:missing-purpose:${p}`);
    }
  }
  return {
    industries: listIndustryArchetypes().length,
    domains: listSpecialistDomains().length,
    gaps,
  };
}

export const BUSINESS_PURPOSE_FAMILY_COUNT = BUSINESS_PURPOSE_CATALOG.length;
