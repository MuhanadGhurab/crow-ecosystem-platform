# Enterprise Graph Completeness

**Status:** CURRENT (MODEL.3)

## Purpose

`analyzeOperatingGraphCompleteness()` and `auditGraphNodeTypeCoverage()` explain which enterprise layers are present, partial, or absent in the operating graph for a given composition.

## Node types (17)

| Type | Builder | Edges | Inspector | Filter | Validation | Scenario diff |
|------|---------|-------|-----------|--------|------------|---------------|
| INDUSTRY | yes | yes | yes | yes | yes | yes |
| SPECIALIST_DOMAIN | yes | yes | yes | yes | yes | yes |
| DOMAIN_PACK | yes | yes | yes | yes | yes | partial |
| DEPARTMENT | yes | yes | yes | yes | yes | yes |
| CAPABILITY | yes | yes | yes | yes | yes | partial |
| ENTITY | yes | yes | yes | yes | yes | partial |
| WORK_PERSONA | yes | yes | yes | yes | yes | yes |
| WORKFLOW | yes | yes | yes | yes | yes | yes |
| WORKFLOW_STAGE | yes | yes | yes | yes | yes | partial |
| OUTCOME | yes | yes | yes | yes | yes | partial |
| KPI | yes | yes | yes | yes | yes | partial |
| EVIDENCE | yes | yes | yes | yes | yes | partial |
| AUTHORITY_PROPOSAL | yes | yes | yes | yes | yes | partial |
| SAREA_EXPERIENCE | yes | yes | yes | yes | yes | partial |
| CYBERCROW_POLICY | yes | yes | yes | yes | yes | partial |
| INTEGRATION | yes | yes | yes | yes | yes | partial |
| COMPLIANCE_OVERLAY | yes | yes | yes | yes | yes | partial |

## Layer statuses

`COMPLETE` · `PARTIAL` · `UNRESOLVED` · `NOT_APPLICABLE` · `BLOCKED`

Absent layers return explicit reasons: `not selected`, `not recommended`, `unresolved dependency`, `catalog mapping unavailable`, `filtered by scenario`.

## Implementation

- `src/lib/model-forge/graph/operating-graph.ts` — `buildOperatingGraph()`, `filterGraphByLayerPreset()`
- `src/lib/model-forge/graph/graph-sources.ts` — catalog resolution
- `src/lib/model-forge/graph/graph-completeness.ts` — completeness analysis

## Not in scope

Runtime tenant graph materialization, persistent Blueprint rows, or authority application.
