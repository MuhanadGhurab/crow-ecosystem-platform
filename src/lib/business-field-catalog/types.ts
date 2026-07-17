/** CROW.DISCOVERY.2B — universal client-facing business field taxonomy. */

export type BusinessFieldStatus = "ACTIVE" | "DEPRECATED" | "REVIEW";

export type BusinessFieldCrosswalk = {
  ssic?: string;
  isic?: string;
  naics?: string;
};

export type BusinessFieldDefinition = {
  key: string;
  displayNameEn: string;
  displayNameAr?: string;
  description: string;
  categoryKey: string;
  parentFieldKey: string | null;
  childActivityKeys: string[];
  aliasesEn: string[];
  aliasesAr: string[];
  misspellings: string[];
  searchKeywords: string[];
  exampleBusinesses: string[];
  businessPurposeHints: string[];
  relatedSpecialistDomainKeys: string[];
  relatedCapabilityKeys: string[];
  relatedIndustryArchetypeKey: string | null;
  crosswalk: BusinessFieldCrosswalk;
  regulatedNote?: string;
  status: BusinessFieldStatus;
};

export type BusinessFieldCategory = {
  key: string;
  displayNameEn: string;
  displayNameAr?: string;
  description: string;
  sortOrder: number;
};

export type BusinessFieldSearchResult = {
  field: BusinessFieldDefinition;
  category: BusinessFieldCategory;
  score: number;
  matchReason: string;
};

export type CustomFieldFallback = {
  customDescription: string;
  suggestedMatches: BusinessFieldSearchResult[];
  resolutionStatus: "CUSTOM_UNRESOLVED" | "CUSTOM_MATCHED";
  requiresProcrowReview: boolean;
};
