/** ISIC Rev. 4 major sections mapped to Crow broad-category coverage (CROW.UAT.1). */

export type IsicMajorSection = {
  section: string;
  title: string;
  crowCategoryKeys: string[];
  clientPath: string;
};

export const ISIC_MAJOR_SECTIONS: readonly IsicMajorSection[] = [
  { section: "A", title: "Agriculture, forestry and fishing", crowCategoryKeys: ["agriculture_natural_resources"], clientPath: "Crop farming, livestock, fishing fields" },
  { section: "B", title: "Mining and quarrying", crowCategoryKeys: ["mining_industrial_services"], clientPath: "Mining operations field" },
  { section: "C", title: "Manufacturing", crowCategoryKeys: ["manufacturing_production"], clientPath: "Food, metal, electronics, textile manufacturing" },
  { section: "D", title: "Electricity, gas, steam and air conditioning supply", crowCategoryKeys: ["energy_utilities"], clientPath: "Renewable energy, utilities fields" },
  { section: "E", title: "Water supply; sewerage, waste management", crowCategoryKeys: ["energy_utilities", "other_specialist_services"], clientPath: "Water utility, waste recycling" },
  { section: "F", title: "Construction", crowCategoryKeys: ["construction_engineering"], clientPath: "General contracting, EPC, MEP, subcontracting" },
  { section: "G", title: "Wholesale and retail trade", crowCategoryKeys: ["wholesale_distribution", "retail_ecommerce"], clientPath: "Wholesale, import/export, retail, e-commerce" },
  { section: "H", title: "Transportation and storage", crowCategoryKeys: ["transport_logistics"], clientPath: "Freight, last-mile, warehouse, fleet" },
  { section: "I", title: "Accommodation and food service", crowCategoryKeys: ["hospitality_food"], clientPath: "Hotels, restaurants, cloud kitchen, catering" },
  { section: "J", title: "Information and communication", crowCategoryKeys: ["technology_software", "telecommunications", "media_publishing", "gaming_esports"], clientPath: "Software, telecom, media, gaming" },
  { section: "K", title: "Financial and insurance activities", crowCategoryKeys: ["financial_operations", "insurance_services"], clientPath: "Finance ops, fintech, insurance" },
  { section: "L", title: "Real estate activities", crowCategoryKeys: ["real_estate_property"], clientPath: "Property management, brokerage, short-stay" },
  { section: "M", title: "Professional, scientific and technical", crowCategoryKeys: ["professional_services", "legal_accounting", "marketing_creative", "research_laboratories"], clientPath: "Consulting, legal, accounting, labs, creative" },
  { section: "N", title: "Administrative and support services", crowCategoryKeys: ["facilities_cleaning", "security_services", "equipment_rental", "hr_recruitment_agency"], clientPath: "Cleaning, security, rental, staffing" },
  { section: "O", title: "Public administration", crowCategoryKeys: ["public_community_services"], clientPath: "Municipal contractor, community services" },
  { section: "P", title: "Education", crowCategoryKeys: ["education_training"], clientPath: "Training academy, school operations" },
  { section: "Q", title: "Human health and social work", crowCategoryKeys: ["healthcare_administration"], clientPath: "Clinic, dental, home healthcare, clinical lab" },
  { section: "R", title: "Arts, entertainment and recreation", crowCategoryKeys: ["events_entertainment", "fitness_wellness", "film_video_production", "music_audio"], clientPath: "Events, sports club, film, music" },
  { section: "S", title: "Other service activities", crowCategoryKeys: ["beauty_personal_care", "automotive_services", "other_specialist_services", "maintenance_field_services"], clientPath: "Salon, auto repair, car wash, repair services" },
  { section: "T", title: "Households as employers", crowCategoryKeys: ["other_specialist_services"], clientPath: "Custom unresolved field path" },
  { section: "U", title: "Extraterritorial organizations", crowCategoryKeys: ["other_specialist_services"], clientPath: "Custom unresolved field path" },
];

export function officialMajorSectionCoveragePercent(): number {
  const covered = ISIC_MAJOR_SECTIONS.filter((s) => s.crowCategoryKeys.length > 0).length;
  return Math.round((covered / ISIC_MAJOR_SECTIONS.length) * 100);
}
