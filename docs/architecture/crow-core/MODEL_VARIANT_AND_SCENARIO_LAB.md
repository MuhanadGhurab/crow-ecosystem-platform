# Model Variant and Scenario Lab

**Status:** CURRENT

## Variants

`OperatingModelVariant` — `src/lib/model-forge/variants/scenario-comparison.ts`

Keys: MICRO, GROWING, ENTERPRISE, CENTRALIZED, DISTRIBUTED, DEPARTMENTAL, OUTCOME_POD, COMMAND_CENTER, HIGH_REGULATION, AUTOMATION_FORWARD.

Variants reference shared base composition; differences are advisory only. No database persistence.

## Comparison

`compareOperatingModelVariants()` returns deterministic diffs: added, removed, merged, split, expanded, reduced, unchanged.

UI: Scenario Compare mode in Model Forge with `StudioScenarioDiff`.
