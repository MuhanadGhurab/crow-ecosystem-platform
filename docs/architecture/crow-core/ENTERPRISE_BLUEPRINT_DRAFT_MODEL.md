# Enterprise Blueprint Draft Model

**Status:** CURRENT (preview IR)

## Type

`EnterpriseBlueprintDraft` — `src/lib/model-forge/blueprint/blueprint-types.ts`

## Sections

`metadata`, `executiveSummary`, `modelDNA`, `organization`, `departments`, `capabilities`, `entities`, `workPersonas`, `workflows`, `outcomes`, `kpis`, `evidence`, `authorityProposals`, `sareaExperiences`, `cyberCrowPolicies`, `integrations`, `complianceOverlays`, `scenarioProfile`, `unresolvedDecisions`, `warnings`, `validation`, `provenanceSummary`

## Required metadata

| Field | Preview value |
|-------|----------------|
| `advisory` | `true` |
| `authoritative` | `false` |
| `requiresHumanApproval` | `true` |
| `persistenceState` | `EPHEMERAL_PREVIEW` |
| `previewClassification` | `BLUEPRINT_PREVIEW` |

## Excluded from preview

Database IDs, Auth IDs, full emails, tokens, operator secrets, real user assignments, tenant memberships, platform roles that grant authority.

## Persistence

**PLANNED** for runtime Blueprint Engine. MODEL.3 uses sessionStorage handoff only — no Supabase writes.
