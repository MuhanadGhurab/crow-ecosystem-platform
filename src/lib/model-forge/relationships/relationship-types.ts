import type { GraphEdgeType, GraphNodeType } from "../domain-types";

export type RelationshipRuleStatus =
  | "CURRENT"
  | "PARTIAL"
  | "PLANNED"
  | "DEPRECATED"
  | "LEGACY_COMPATIBILITY";

export type AuthorityEffect = "NONE";

export type CatalogRelationshipCondition = {
  key: string;
  description: string;
  expression: string;
};

export type CatalogRelationshipEffect = {
  key: string;
  description: string;
  blueprintPaths?: readonly string[];
};

export type CatalogRelationshipEvidence = {
  catalogRef: string;
  field?: string;
};

export type CatalogRelationshipRule = {
  ruleKey: string;
  version: string;
  status: RelationshipRuleStatus;
  sourceType: GraphNodeType | "COMPOSITION";
  targetType: GraphNodeType | "BLUEPRINT_SECTION";
  relationshipType: GraphEdgeType | "DERIVES";
  description: string;
  rationale: string;
  conditions: readonly CatalogRelationshipCondition[];
  cardinality: "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_MANY";
  priority: number;
  provenanceSource: string;
  implementationStatus: RelationshipRuleStatus;
  authorityEffect: AuthorityEffect;
};

export type CatalogRelationshipRegistry = {
  version: string;
  rules: readonly CatalogRelationshipRule[];
};

export type RelationshipValidationSeverity = "INFO" | "RECOMMENDATION" | "WARNING" | "BLOCKING_ERROR";

export type RelationshipValidationFinding = {
  severity: RelationshipValidationSeverity;
  code: string;
  message: string;
  ruleKey?: string;
};

export type ResolvedRelationship = {
  ruleKey: string;
  sourceId: string;
  targetId: string;
  relationshipType: GraphEdgeType;
  reason: string;
  provenance: string;
  advisory: true;
};
