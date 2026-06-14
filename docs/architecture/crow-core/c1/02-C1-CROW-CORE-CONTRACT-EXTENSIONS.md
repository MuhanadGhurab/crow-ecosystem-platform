# 02 — C1 Crow Core Contract Extensions

C1 **extends** C0 contracts in `src/lib/crow-core/` — no parallel type systems.

## `blueprint/index.ts`

- `BlueprintLifecycleState` — C1 view-model states (10+ values)
- `BlueprintVersionSnapshot`, `BlueprintVersionDiff`, `BlueprintReadinessReport`
- `BlueprintDiffImpact` — `NONE` | `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`

## `commercial/index.ts`

- `SOW_SECTION_KEYS` — 22 deterministic SOW sections
- `RoiScenario` — `CONSERVATIVE` | `BASE` | `OPTIMISTIC`
- `RoiCalculation`, `RoiResult`, `RoiConfidence`, `RoiValidationResult`

## `traceability/index.ts`

- `BlueprintTraceEvent`, `BlueprintTraceTimeline`
- `TRACEABILITY_CHAIN_STAGES` includes `blueprint_version`

## `common.ts`

Reuses `ActorRef`, `ApprovalStatus`, `VersionLabel` — no new actor model.

## Rules

- crow-core modules remain **persistence-neutral** (no `@prisma/client`)
- Adapter lives in `blueprint-studio/` and may import `blueprint.service` types only at the repository boundary
