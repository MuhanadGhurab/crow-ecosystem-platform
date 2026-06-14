# C1 — Blueprint Persistence Migration Proposal (Path C)

**Status:** Proposal only — **no migration executed in C1.**  
**Requires:** Explicit product approval before `prisma migrate`.

## Proposed tables

### `BlueprintVersion`

Immutable approved snapshots and draft lineage.

| Field | Type | Notes |
|-------|------|-------|
| `id` | cuid | PK |
| `blueprintId` | FK → `EnterpriseBlueprint` | Tenant-scoped via blueprint |
| `versionLabel` | string | e.g. `v3.0.0-draft`, `v2.1.0-approved` |
| `parentVersionId` | FK self nullable | Lineage chain |
| `status` | enum | `draft`, `pending_review`, `approved`, `superseded`, `archived` |
| `contentHash` | string | SHA-256 of normalized snapshot |
| `snapshotJson` | Json | Normalized `EnterpriseBlueprintDocument` + commercial |
| `createdByActorId` | string | Actor ref |
| `approvedAt` | DateTime? | |
| `createdAt` / `updatedAt` | DateTime | |

**Indexes:** `(blueprintId, status)`, `(blueprintId, versionLabel)` unique.

### `BlueprintTraceEvent`

Append-only traceability log.

| Field | Type | Notes |
|-------|------|-------|
| `id` | cuid | |
| `blueprintId` | FK | |
| `versionId` | FK nullable | |
| `stage` | string | `TraceabilityChainStage` |
| `actorType` / `actorId` | string | Non-human flagged |
| `summary` | string | |
| `payloadJson` | Json? | |
| `timestamp` | DateTime | |

**Index:** `(blueprintId, timestamp)`.

### `BlueprintCommercialSnapshot`

ROI assumptions and SOW sections at a version point.

| Field | Type | Notes |
|-------|------|-------|
| `id` | cuid | |
| `versionId` | FK → `BlueprintVersion` | 1:1 or 1:n per scenario |
| `roiModelJson` | Json | `RoiModel` |
| `sowDraftJson` | Json | `SowDraft` |
| `scenario` | enum? | CONSERVATIVE / BASE / OPTIMISTIC for ROI |
| `createdAt` | DateTime | |

## Tenant isolation

- All queries scoped via `EnterpriseBlueprint` → `Tenant` / `requestId`
- No cross-tenant version reads; RLS or service-layer checks mirror existing blueprint permissions

## Rollback strategy

1. Deploy schema with nullable FKs; backfill current `EnterpriseBlueprint.version` as single `BlueprintVersion` row per blueprint
2. Enable Studio writes to `BlueprintVersion` behind feature flag
3. Rollback: drop new tables; adapter continues Path A read-only

## C1 scope without migration

- Version/diff/hash services use `BlueprintVersionSnapshot` in memory + fixtures
- Meem reference fixture under `src/lib/crow-core/blueprint-studio/fixtures/`
- Live blueprints: adapter reads current DB state as “current draft”

## Approval checklist

- [ ] Product approves immutable version history requirement
- [ ] Security reviews tenant isolation on new tables
- [ ] Ops approves migration window and backfill plan
- [ ] Client approval hash evidence linked to `BlueprintVersion.contentHash`
