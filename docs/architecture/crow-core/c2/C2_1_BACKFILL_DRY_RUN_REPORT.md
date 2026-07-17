# C2.1 — Backfill dry-run report (Preview)

**Command:** `npm run c2-preview-readiness:audit` (includes embedded dry-run via `runBlueprintPersistenceBackfill({ dryRun: true })`)  
**Never run:** backfill in apply mode against Preview without explicit PO authorization.

---

## Summary

| Metric | Value |
|--------|-------|
| dryRun | true |
| processed | 5 |
| wouldCreate | 2 |
| skipped | 0 |
| unresolvedTenant | 3 |

---

## Provenance

Dry-run would create version 1 rows with **`LEGACY_IMPORT`** provenance only. No approvals are invented. Approved snapshots are not auto-created.

---

## Unresolved tenant ownership

Three blueprint IDs could not resolve `tenantId` (masked):

- `cmpl…zmmf`
- `cmpl…3ll5`
- `cmpq…p2ag`

**Root cause:** All five hosted `EnterpriseBlueprint` rows have `tenantId = null`. Resolver could not infer tenant from request/org linkage for three records.

---

## Safe imports (would-create)

Two records would receive initial draft version 1 in dry-run (tenant resolved).

---

## Idempotency

- Dry-run does not write.
- Records with existing versions would be skipped (`skipped_existing`); current `versionRowCount` is 0 on hosted DB.
- Re-running dry-run is safe.

---

## Before any apply-mode backfill

1. Fix `tenantId` on legacy blueprints (manual or approved data migration).
2. Re-run dry-run until `unresolvedTenant === 0` or PO accepts explicit skip list.
3. Obtain authorization separate from C2 DDL apply if schema already present.

---

## Gate alignment

| Requirement | Status |
|-------------|--------|
| Dry-run only in C2.1 | PASS |
| No invented approvals | PASS |
| Unresolved skip path | PASS — excluded from apply |
| Tenant risk | **FAIL** — 60% unresolved |
