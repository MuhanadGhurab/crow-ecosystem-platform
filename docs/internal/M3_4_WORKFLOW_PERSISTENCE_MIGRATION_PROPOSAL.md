# M3.4B — Workflow Persistence Migration Proposal (NOT APPROVED)

> **Status:** Proposal only. No migration file created. Do not run `prisma migrate` until explicit operator approval.

## Why M3.4B might be needed later

PATH A (M3.4) stores cross-entity lineage in `Report.configJson` and infers workflow template linkage. For longer-running staging demos and operator audits, nullable foreign keys on the purchase request anchor would reduce inference and make ProCrow lineage panels more deterministic.

## Proposed changes (additive, non-destructive)

### `TenantPurchaseRequest` (nullable fields)

| Field | Type | Nullable | Index | Purpose |
|-------|------|----------|-------|---------|
| `workflowId` | String FK → `Workflow` | yes | yes | Link request to workflow template/instance |
| `primaryTaskId` | String FK → `Task` | yes | yes | Stable task anchor |
| `lineageReportId` | String FK → `Report` | yes | yes | Canonical report output row |

### No changes required (already sufficient)

- `Approval.entityType` / `entityId`
- `CybercrowAuditLog.entityType` / `entityId`
- `linkedFinanceRef` / `linkedInventoryRef` markers

## Backfill

- **Preferred:** none — new fields nullable; lineage backfill optional script reads existing `configJson` lineage and populates FKs for active demo tenants only.
- **Destructive:** no

## Rollout safety

1. Deploy additive migration in maintenance window (nullable columns only).
2. Update `updatePurchaseToStockLineage` to write FKs when present.
3. Persistence audit treats FK presence as `linked` instead of `inferred`.
4. Rollback: drop columns only if no dependent code shipped (or leave nullable unused).

## Remote DB impact

- Three nullable columns + indexes on `TenantPurchaseRequest` per tenant database.
- No data rewrite on existing rows.

## Verifier plan (post-approval)

- Extend `cem-workflow-persistence:verify` to assert FK fields exist in schema when `M3_4B_APPROVED` env flag documented in runbook.
- Run full CEM suite + `typecheck` + `build`.

## Operator approval checklist

- [ ] Written approval recorded (ticket / runbook entry)
- [ ] Backup / rollback posture confirmed
- [ ] Staging migrate dry-run
- [ ] Production migrate only after ProCrow Go/No-Go review
