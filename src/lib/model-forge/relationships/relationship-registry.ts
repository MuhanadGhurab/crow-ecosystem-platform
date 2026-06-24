import type { CatalogRelationshipRule, CatalogRelationshipRegistry } from "./relationship-types";

function rule(
  ruleKey: string,
  sourceType: CatalogRelationshipRule["sourceType"],
  targetType: CatalogRelationshipRule["targetType"],
  relationshipType: CatalogRelationshipRule["relationshipType"],
  description: string,
  rationale: string,
  opts: Partial<CatalogRelationshipRule> = {},
): CatalogRelationshipRule {
  return {
    ruleKey,
    version: opts.version ?? "1.0.0",
    status: opts.status ?? "CURRENT",
    sourceType,
    targetType,
    relationshipType,
    description,
    rationale,
    conditions: opts.conditions ?? [],
    cardinality: opts.cardinality ?? "ONE_TO_MANY",
    priority: opts.priority ?? 100,
    provenanceSource: opts.provenanceSource ?? "crow_catalog",
    implementationStatus: opts.implementationStatus ?? "CURRENT",
    authorityEffect: "NONE",
  };
}

export const CATALOG_RELATIONSHIP_RULES: readonly CatalogRelationshipRule[] = [
  rule("industry_contains_specialist_domain", "INDUSTRY", "SPECIALIST_DOMAIN", "CONTAINS", "Industry contains specialist domain", "User-selected industry scopes specialist domains"),
  rule("specialist_recommends_domain_pack", "SPECIALIST_DOMAIN", "DOMAIN_PACK", "DEPENDS_ON", "Specialist domain recommends domain pack", "Domain packs align to specialist domain catalog keys"),
  rule("domain_pack_contains_capability", "DOMAIN_PACK", "CAPABILITY", "CONTAINS", "Domain pack contains capability", "Capabilities listed on domain pack definition"),
  rule("domain_pack_recommends_department", "DOMAIN_PACK", "DEPARTMENT", "CONTAINS", "Domain pack recommends department", "Department keys from domain pack recommendedDepartmentKeys", { relationshipType: "CONTAINS" }),
  rule("domain_pack_recommends_entity", "DOMAIN_PACK", "ENTITY", "CONTAINS", "Domain pack recommends entity", "Entity keys from domain pack entity packs"),
  rule("organization_contains_department", "INDUSTRY", "DEPARTMENT", "CONTAINS", "Organization contains department", "Scale and domain pack derive department archetypes"),
  rule("department_owns_workflow", "DEPARTMENT", "WORKFLOW", "OWNS", "Department owns workflow", "departmentArchetype.workflowOwnership"),
  rule("department_owns_entity", "DEPARTMENT", "ENTITY", "OWNS", "Department owns entity", "departmentArchetype.entityOwnership"),
  rule("persona_participates_workflow", "WORK_PERSONA", "WORKFLOW", "PARTICIPATES_IN", "Persona participates in workflow", "workPersona.workflowParticipation"),
  rule("persona_coordinates_workflow", "WORK_PERSONA", "WORKFLOW", "COORDINATES", "Persona coordinates workflow", "workPersona.workflowPositions includes COORDINATOR"),
  rule("persona_reviews_workflow", "WORK_PERSONA", "WORKFLOW", "REVIEWS", "Persona reviews workflow", "workPersona.workflowPositions includes REVIEWER or APPROVER"),
  rule("persona_executes_workflow", "WORK_PERSONA", "WORKFLOW", "EXECUTES", "Persona executes workflow", "workPersona.workflowPositions includes EXECUTOR", { status: "PARTIAL" }),
  rule("workflow_contains_stage", "WORKFLOW", "WORKFLOW_STAGE", "CONTAINS", "Workflow contains stage", "workflowTemplate.states"),
  rule("workflow_consumes_entity", "WORKFLOW", "ENTITY", "CONSUMES", "Workflow consumes entity", "entityDefinition.relatedWorkflowKeys"),
  rule("workflow_produces_outcome", "WORKFLOW", "OUTCOME", "PRODUCES", "Workflow produces outcome", "Final workflow stage produces outcome"),
  rule("workflow_governs_outcome", "WORKFLOW", "OUTCOME", "GOVERNS", "Workflow governs outcome", "Outcome linked to workflow completion"),
  rule("workflow_measured_by_kpi", "WORKFLOW", "KPI", "MEASURED_BY", "Workflow measured by KPI", "workflowTemplate.kpiKeys"),
  rule("workflow_requires_evidence", "WORKFLOW", "EVIDENCE", "REQUIRES_EVIDENCE", "Workflow requires evidence", "workflowTemplate.evidenceRequirementKeys"),
  rule("workflow_produces_evidence", "WORKFLOW", "EVIDENCE", "PRODUCES", "Workflow produces evidence", "Evidence artifacts from workflow execution"),
  rule("workflow_protected_by_cybercrow", "WORKFLOW", "CYBERCROW_POLICY", "PROTECTED_BY", "Workflow protected by CyberCrow policy", "workflowTemplate.cyberCrowCheckKeys"),
  rule("persona_presented_through_sarea", "WORK_PERSONA", "SAREA_EXPERIENCE", "PRESENTED_THROUGH", "Persona presented through SAREA", "workPersona.recommendedSareaPatternKey"),
  rule("entity_protected_by_cybercrow", "ENTITY", "CYBERCROW_POLICY", "PROTECTED_BY", "Entity protected by CyberCrow policy", "entityDefinition.cyberCrowPolicyPackKeys"),
  rule("entity_integrates_with_integration", "ENTITY", "INTEGRATION", "INTEGRATES_WITH", "Entity integrates with external system", "Entity pack integration recommendations", { status: "PARTIAL" }),
  rule("workflow_integrates_with_integration", "WORKFLOW", "INTEGRATION", "INTEGRATES_WITH", "Workflow integrates with external system", "Workflow integration pack linkage"),
  rule("compliance_governs_entity", "COMPLIANCE_OVERLAY", "ENTITY", "GOVERNS", "Compliance overlay governs entity", "complianceOverlay.affectedEntityKeys"),
  rule("compliance_governs_workflow", "COMPLIANCE_OVERLAY", "WORKFLOW", "GOVERNS", "Compliance overlay governs workflow", "complianceOverlay.affectedWorkflowKeys"),
  rule("authority_governs_persona_position", "AUTHORITY_PROPOSAL", "WORK_PERSONA", "GOVERNS", "Authority proposal governs persona-workflow position", "authorityProposal advisory linkage", { status: "CURRENT" }),
  rule("composition_derives_work_persona", "COMPOSITION", "WORK_PERSONA", "DERIVES", "Composition derives work persona", "hybrid-composition persona resolution", { provenanceSource: "composition_rule" }),
  rule("composition_derives_workflow", "COMPOSITION", "WORKFLOW", "DERIVES", "Composition derives workflow template", "hybrid-composition workflow resolution"),
  rule("composition_derives_kpi", "COMPOSITION", "KPI", "DERIVES", "Composition derives KPI recommendation", "kpi-outcomes catalog"),
  rule("composition_derives_evidence", "COMPOSITION", "EVIDENCE", "DERIVES", "Composition derives evidence requirement", "workflow and compliance evidence rules"),
  rule("legacy_persona_default_workflow", "WORK_PERSONA", "WORKFLOW", "PARTICIPATES_IN", "Legacy default persona workflow link", "When workflowParticipation empty, first workflow used", { status: "LEGACY_COMPATIBILITY", priority: 50 }),
  rule("legacy_workflow_integration_slice", "WORKFLOW", "INTEGRATION", "INTEGRATES_WITH", "Legacy workflow integration slice", "First three workflows linked to integrations", { status: "LEGACY_COMPATIBILITY", priority: 40 }),
  rule("legacy_compliance_entity_slice", "COMPLIANCE_OVERLAY", "ENTITY", "GOVERNS", "Legacy compliance entity slice", "First five entities linked to compliance overlay", { status: "LEGACY_COMPATIBILITY", priority: 40 }),
] as const;

export const RELATIONSHIP_REGISTRY: CatalogRelationshipRegistry = {
  version: "1.0.0",
  rules: CATALOG_RELATIONSHIP_RULES,
};

export function getRelationshipRule(ruleKey: string): CatalogRelationshipRule | undefined {
  return CATALOG_RELATIONSHIP_RULES.find((r) => r.ruleKey === ruleKey);
}

export function listRelationshipRulesByFamily(
  sourceType: CatalogRelationshipRule["sourceType"],
  targetType?: CatalogRelationshipRule["targetType"],
): CatalogRelationshipRule[] {
  return CATALOG_RELATIONSHIP_RULES.filter(
    (r) => r.sourceType === sourceType && (!targetType || r.targetType === targetType),
  );
}
