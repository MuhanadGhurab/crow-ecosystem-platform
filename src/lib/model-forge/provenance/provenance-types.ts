export type ProvenanceSource =
  | "USER_SELECTION"
  | "INDUSTRY_ARCHETYPE"
  | "SPECIALIST_DOMAIN"
  | "DOMAIN_PACK"
  | "ORGANIZATIONAL_OVERLAY"
  | "SCALE_PROFILE"
  | "TOPOLOGY"
  | "CAPABILITY_DEPENDENCY"
  | "WORKFLOW_RULE"
  | "PERSONA_RULE"
  | "ENTITY_RULE"
  | "COMPLIANCE_RULE"
  | "SECURITY_RULE"
  | "INTEGRATION_RULE"
  | "LEGACY_ADAPTER"
  | "REFERENCE_MODEL"
  | "CATALOG_ENTRY";

export type RecommendationStrength =
  | "REQUIRED"
  | "STRONGLY_RECOMMENDED"
  | "RECOMMENDED"
  | "OPTIONAL"
  | "INFORMATIONAL";

export type ProvenanceTarget = {
  kind: string;
  key: string;
  path: string;
};

export type ProvenanceRule = {
  ruleId: string;
  description: string;
};

export type ProvenanceRecord = {
  id: string;
  target: ProvenanceTarget;
  recommendation: string;
  reason: string;
  sources: readonly ProvenanceSource[];
  catalogRefs: readonly string[];
  userInputs: readonly string[];
  rules: readonly ProvenanceRule[];
  strength: RecommendationStrength;
  unresolved: boolean;
  advisory: true;
};

export type ProvenanceChain = {
  targetPath: string;
  records: readonly ProvenanceRecord[];
  upstreamPaths: readonly string[];
  downstreamPaths: readonly string[];
};

export const PROVENANCE_ENGINE_VERSION = "1.0.0";
