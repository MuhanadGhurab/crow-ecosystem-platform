# Enterprise Operating Graph

**Status:** CURRENT

## Types

`EnterpriseOperatingGraph`, `EnterpriseGraphNode`, `EnterpriseGraphEdge` — `src/lib/model-forge/domain-types.ts`

## Builder

`buildOperatingGraph()`, `validateOperatingGraph()`, `filterGraph()` — `src/lib/model-forge/graph/operating-graph.ts`

## Node types (17)

INDUSTRY, SPECIALIST_DOMAIN, DOMAIN_PACK, DEPARTMENT, CAPABILITY, ENTITY, WORK_PERSONA, WORKFLOW, WORKFLOW_STAGE, OUTCOME, KPI, EVIDENCE, AUTHORITY_PROPOSAL, SAREA_EXPERIENCE, CYBERCROW_POLICY, INTEGRATION, COMPLIANCE_OVERLAY

## Edge types (19)

CONTAINS, OWNS, PARTICIPATES_IN, COORDINATES, EXECUTES, REVIEWS, APPROVES, ESCALATES_TO, PRODUCES, CONSUMES, GOVERNS, MEASURED_BY, REQUIRES_EVIDENCE, PROTECTED_BY, PRESENTED_THROUGH, INTEGRATES_WITH, DEPENDS_ON, CONFLICTS_WITH

## Properties

- Deterministic for identical composition input
- All edges include reason, provenance, `advisory: true`
- Validation severities: INFO, RECOMMENDATION, WARNING, BLOCKING_DRAFT_ERROR

## Visual canvas

`StudioGraphCanvas` — SVG-based, no heavy graph library.
