# Crow Provenance Engine

**Status:** CURRENT (MODEL.3 preview)

## Types

`ProvenanceRecord`, `ProvenanceSource`, `ProvenanceRule`, `ProvenanceTarget`, `ProvenanceChain` — `src/lib/model-forge/provenance/provenance-types.ts`

## Sources

`USER_SELECTION`, `INDUSTRY_ARCHETYPE`, `SPECIALIST_DOMAIN`, `DOMAIN_PACK`, `ORGANIZATIONAL_OVERLAY`, `SCALE_PROFILE`, `TOPOLOGY`, `CAPABILITY_DEPENDENCY`, `WORKFLOW_RULE`, `PERSONA_RULE`, `ENTITY_RULE`, `COMPLIANCE_RULE`, `SECURITY_RULE`, `INTEGRATION_RULE`, `LEGACY_ADAPTER`, `REFERENCE_MODEL`

## Recommendation strength

`REQUIRED` · `STRONGLY_RECOMMENDED` · `RECOMMENDED` · `OPTIONAL` · `INFORMATIONAL`

No AI confidence percentages.

## API

- `createProvenanceRecord()` / `registerProvenance` during graph and compiler passes
- `getProvenanceForNode()` / `getProvenanceForBlueprintPath()`
- `traceRecommendationUpstream()` / `traceRecommendationDownstream()`
- `buildProvenanceChain()` for UI drawer

Registry is in-memory per compile/graph build; cleared at each `compileEnterpriseBlueprintPreview()` when appropriate.

## UI

`StudioProvenanceDrawer` — recommendation, sources, rules, dependencies, advisory status. No authority application actions.

## Limits

Catalog-only references may cite themselves. Full provenance for every generated persona/workflow item is **PARTIAL** — capabilities and graph nodes are primary coverage in MODEL.3.
