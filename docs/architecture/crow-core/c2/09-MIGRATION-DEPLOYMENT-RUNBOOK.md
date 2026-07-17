# C2 — Migration deployment runbook (document only)

> **Not executed in C2.** Apply only after Preview review and explicit operator approval.

## Preview

1. Verify backup/recovery posture
2. Review migration SQL (`20260614120000_blueprint_versioning_traceability`)
3. Apply migration to Preview database
4. `npx prisma migrate status`
5. Dry-run backfill; review unresolved tenants
6. Limited `--apply` backfill if approved
7. Operator smoke: Studio load/save, approval read-only, tenant isolation
8. Compare legacy vs C2 reads

## Production

1. Approved change record
2. Verified backup
3. Migration checksum review
4. Additive apply only
5. Health checks
6. Dry-run backfill
7. Batched `--apply` with monitoring
8. Rollback/forward-fix decision documented

## Rollback

Do not drop new tables in panic. Forward-fix preferred; document data reconciliation if partial backfill occurred.
