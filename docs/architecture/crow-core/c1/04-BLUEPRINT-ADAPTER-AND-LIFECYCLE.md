# 04 — Blueprint Adapter and Lifecycle

## Adapter

**File:** `src/lib/crow-core/blueprint-studio/blueprint-adapter.ts`

Maps `EnterpriseBlueprintDetail` (from `blueprint.service`) → `EnterpriseBlueprintDocument`:

- Six slices: organizational, operational, securityTrust, experience, integrations, commercial
- Composite lifecycle via `mapToBlueprintLifecycleState()`
- Status mapping: `BlueprintStatus` + `ProposalStatus` + request state

## Lifecycle service

**File:** `blueprint-lifecycle.ts`

| C1 state | Source |
|----------|--------|
| `DISCOVERY_DRAFT` | Request under discovery |
| `BLUEPRINT_DRAFT` | `DRAFT` |
| `INTERNAL_REVIEW` | `IN_REVIEW` + proposal `DRAFT` |
| `CLIENT_REVIEW` | `IN_REVIEW` + proposal `SENT` |
| `CHANGES_REQUESTED` | `DECLINED` or client notes |
| `APPROVED` | `APPROVED` + timestamps |

No Prisma enum changes in C1.

## Loader

**File:** `src/lib/server/blueprint-studio-load.ts`

Server-side context: document, lifecycle, readiness, versions (fixture/in-memory), traceability timeline.

## Meem reference

When `isMeemReferenceBlueprint(blueprintId)` or fixture mode, loads `fixtures/meem-global-reference.ts` with **Reference assumptions — not client-validated** labels.
