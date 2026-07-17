/** Official classification crosswalk metadata — codes are metadata, not client labels. */
export const TAXONOMY_SOURCES = {
  ssic: {
    name: "Saudi National Classification for Economic Activities (SSIC)",
    version: "SSIC Rev. 4 (2024)",
    jurisdiction: "Saudi Arabia",
    role: "primary jurisdictional backbone",
  },
  isic: {
    name: "United Nations International Standard Industrial Classification (ISIC)",
    version: "ISIC Rev. 4",
    role: "international activity crosswalk",
  },
  naics: {
    name: "North American Industry Classification System (NAICS)",
    version: "NAICS 2022",
    role: "secondary English synonym crosswalk",
  },
} as const;

export type CrosswalkEntry = {
  fieldKey: string;
  ssic?: string;
  isic?: string;
  naics?: string;
  mappingMethod: "direct" | "approximate" | "parent_roll_up";
  notes?: string;
};

/** Representative crosswalk entries — full catalog inherits per-field crosswalk in definitions. */
export const CROSSWALK_REGISTRY: readonly CrosswalkEntry[] = [
  { fieldKey: "crop_farming", ssic: "0111", isic: "0111", naics: "111140", mappingMethod: "direct" },
  { fieldKey: "general_contracting", ssic: "4100", isic: "4100", naics: "236220", mappingMethod: "direct" },
  { fieldKey: "freight_logistics", ssic: "4923", isic: "4923", naics: "484121", mappingMethod: "direct" },
  { fieldKey: "restaurant_food_service", ssic: "5610", isic: "5610", naics: "722511", mappingMethod: "direct" },
  { fieldKey: "software_saas", ssic: "6201", isic: "6201", naics: "511210", mappingMethod: "direct" },
  { fieldKey: "cybersecurity_mssp", ssic: "6202", isic: "6202", naics: "541512", mappingMethod: "approximate" },
  { fieldKey: "management_consulting", ssic: "7020", isic: "7020", naics: "541611", mappingMethod: "direct" },
  { fieldKey: "legal_practice", ssic: "6910", isic: "6910", naics: "541110", mappingMethod: "direct" },
  { fieldKey: "accounting_audit", ssic: "6920", isic: "6920", naics: "541211", mappingMethod: "direct" },
  { fieldKey: "clinic_healthcare_ops", ssic: "8610", isic: "8610", naics: "621111", mappingMethod: "direct" },
  { fieldKey: "hotel_hospitality", ssic: "5510", isic: "5510", naics: "721110", mappingMethod: "direct" },
  { fieldKey: "retail_store", ssic: "4711", isic: "4711", naics: "445110", mappingMethod: "direct" },
  { fieldKey: "ecommerce_online_retail", ssic: "4791", isic: "4791", naics: "454110", mappingMethod: "approximate" },
  { fieldKey: "film_production", ssic: "5911", isic: "5911", naics: "512110", mappingMethod: "direct" },
  { fieldKey: "event_management", ssic: "8230", isic: "8230", naics: "561920", mappingMethod: "direct" },
];

export function getCrosswalkForField(fieldKey: string): CrosswalkEntry | undefined {
  return CROSSWALK_REGISTRY.find((e) => e.fieldKey === fieldKey);
}
