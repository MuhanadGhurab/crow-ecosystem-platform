# Catalog Relationship Rule Registry

**Status:** CURRENT (MODEL.4)

## Types

`CatalogRelationshipRule`, `CatalogRelationshipRegistry` — `src/lib/model-forge/relationships/`

## Rules

34 governed relationship rules with `authorityEffect: NONE`, version, status, rationale, and conditions.

Legacy compatibility rules are explicit (`LEGACY_COMPATIBILITY` status).

## Validation

- `validateCatalogRelationshipRules()` — registry integrity
- `validateResolvedRelationships(graph)` — edge `rule:` provenance references

## Graph integration

`buildOperatingGraph()` edges use `provenance: rule:<ruleKey>`.
