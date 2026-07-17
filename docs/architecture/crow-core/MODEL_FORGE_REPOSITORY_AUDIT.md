# Model Forge Repository Audit

**Milestone:** CROW.MODEL.1 Phase A  
**Status:** CURRENT — audit complete; no destructive changes executed

## Markers

```text
CROW_MODEL_1_BASELINE=PASS
MODEL_FORGE_SOURCE_OF_TRUTH_AUDITED=PASS
MODEL_FORGE_CANONICAL_BOUNDARY=PASS
BROAD_REPOSITORY_MOVE_EXECUTED=false
DESTRUCTIVE_CHANGES_EXECUTED=false
```

## Canonical boundaries

| Domain | Path | Status |
|--------|------|--------|
| Tenant composition (CROW.TENANT.1) | `src/lib/tenant-composition/` | KEEP |
| Model Forge (CROW.MODEL.1) | `src/lib/model-forge/` | KEEP |
| Authoritative RBAC | `src/lib/auth/permissions.ts` | KEEP |
| Legacy sector catalog | `src/lib/constants/sector-catalog.ts` | LEGACY-COMPATIBILITY |
| MEEM/Rimal fixtures | `src/lib/constants/meem.ts`, `prisma/seed-*.ts` | REFERENCE_FIXTURE |

## Duplication summary

Parallel definitions exist for industries, modules/capabilities, roles, workflows, SAREA, and CyberCrow. New catalogs are **advisory**; runtime authority remains in auth services and tenant membership tables.

See `model-forge-refoundation-manifest.json` for machine-readable classification.

## Hard-coded legacy (not removed this milestone)

| Finding | Classification |
|---------|----------------|
| `isLogisticsIndustry()` | MOVE_TO_REGISTRY |
| MEEM/Rimal tenant slugs | REFERENCE_FIXTURE |
| Logistics-default enrichment | TEMPORARY |
| `showMeemErpHub` branching | SAFE_COMPATIBILITY |

## Policy

No broad folder moves, deletions, or renames in CROW.MODEL.1. Evolution uses compatibility exports (`tenant-composition/index.ts` re-exports specialist domains from `model-forge`).
