/** Representative natural-language queries for search relevance tests (CROW.UAT.1). */

export type SearchRelevanceFixture = {
  query: string;
  expectedTopKeys: string[];
  mustNotDominate?: string[];
};

export const SEARCH_RELEVANCE_FIXTURES: readonly SearchRelevanceFixture[] = [
  { query: "online shop", expectedTopKeys: ["ecommerce_online_retail", "marketplace_seller"] },
  { query: "Instagram store", expectedTopKeys: ["ecommerce_online_retail", "marketplace_seller"] },
  { query: "coffee shop", expectedTopKeys: ["restaurant_food_service", "cloud_kitchen"] },
  { query: "restaurant", expectedTopKeys: ["restaurant_food_service"], mustNotDominate: ["retail_store"] },
  { query: "cloud kitchen", expectedTopKeys: ["cloud_kitchen", "restaurant_food_service"] },
  { query: "construction contractor", expectedTopKeys: ["general_contracting", "trade_subcontracting"] },
  { query: "subcontractor", expectedTopKeys: ["trade_subcontracting", "general_contracting"] },
  { query: "equipment rental", expectedTopKeys: ["heavy_equipment_rental", "vehicle_rental"] },
  { query: "law office", expectedTopKeys: ["legal_practice"] },
  { query: "accounting office", expectedTopKeys: ["accounting_audit"] },
  { query: "software company", expectedTopKeys: ["software_saas"] },
  { query: "cyber security company", expectedTopKeys: ["cybersecurity_mssp"] },
  { query: "IT support", expectedTopKeys: ["it_managed_services"] },
  { query: "gaming studio", expectedTopKeys: ["game_development"], mustNotDominate: ["retail_store", "software_saas"] },
  { query: "esports company", expectedTopKeys: ["esports_organization", "game_development"] },
  { query: "content creator", expectedTopKeys: ["content_creator_influencer", "digital_content_media"] },
  { query: "music studio", expectedTopKeys: ["music_recording"] },
  { query: "event organizer", expectedTopKeys: ["event_management"] },
  { query: "travel agency", expectedTopKeys: ["travel_agency"] },
  { query: "Umrah services", expectedTopKeys: ["hajj_umrah_services", "travel_agency"] },
  { query: "clinic", expectedTopKeys: ["clinic_healthcare_ops"], mustNotDominate: ["retail_store"] },
  { query: "dental clinic", expectedTopKeys: ["dental_practice"] },
  { query: "laboratory", expectedTopKeys: ["clinical_laboratory", "research_laboratory"] },
  { query: "pharmacy", expectedTopKeys: ["pharmacy_retail"] },
  { query: "gym", expectedTopKeys: ["gym_fitness_center"] },
  { query: "personal trainer", expectedTopKeys: ["personal_training_coaching", "gym_fitness_center"] },
  { query: "beauty salon", expectedTopKeys: ["hair_salon", "beauty_clinic"] },
  { query: "car wash", expectedTopKeys: ["car_wash_detailing"] },
  { query: "car rental", expectedTopKeys: ["vehicle_rental"] },
  { query: "delivery company", expectedTopKeys: ["last_mile_delivery", "freight_logistics"] },
  { query: "warehouse", expectedTopKeys: ["warehouse_fulfillment", "freight_logistics"] },
  { query: "property management", expectedTopKeys: ["property_management"] },
  { query: "cleaning company", expectedTopKeys: ["commercial_cleaning"] },
  { query: "maintenance company", expectedTopKeys: ["facilities_maintenance", "facilities_management"] },
  { query: "charity", expectedTopKeys: ["nonprofit_ngo"] },
  { query: "training center", expectedTopKeys: ["training_academy"] },
  { query: "مقاول", expectedTopKeys: ["general_contracting"] },
  { query: "مطعم", expectedTopKeys: ["restaurant_food_service"] },
  { query: "متجر إلكتروني", expectedTopKeys: ["ecommerce_online_retail"] },
  { query: "game stuido", expectedTopKeys: ["game_development"], mustNotDominate: ["retail_store"] },
];
