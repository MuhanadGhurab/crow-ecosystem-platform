# Provenance Completeness Contract

**Status:** CURRENT

## Requirement

`UNEXPLAINED_GENERATED_ITEM_COUNT=0` for every `compileEnterpriseBlueprintPreview()` output.

## Registration

`registerAllBlueprintProvenance()` — departments, capabilities, entities, personas, workflows, stages, outcomes, KPIs, evidence, authority, SAREA, CyberCrow, integrations, compliance.

## Validation

- `validateProvenanceIntegrity()`
- `calculateProvenanceCoverage()`

## Integrity gates

`PROVENANCE_TARGET_ERRORS=0`, `UNKNOWN_PROVENANCE_FALLBACKS=0`, acyclic chains.
