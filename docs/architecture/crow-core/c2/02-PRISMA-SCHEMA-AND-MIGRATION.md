# C2 — Prisma schema and migration

## Migration

- **Directory:** `prisma/migrations/20260614120000_blueprint_versioning_traceability/`
- **Baseline before C2:** 13 migrations
- **After C2:** 14 migrations

## Additive rules

The migration may create tables, indexes, foreign keys, nullable transitional columns, and partial unique indexes. It must not `DROP` or `RENAME` legacy objects.

## Partial unique indexes (SQL)

Enforced in migration SQL (Prisma cannot express partial uniques directly):

- `enterprise_blueprint_versions_one_active_draft` — one `BLUEPRINT_DRAFT` per blueprint
- `enterprise_blueprint_versions_one_current_approved` — one `currentApproved` per blueprint

Service-layer checks supplement race windows.

## Identity vs version

`EnterpriseBlueprint` retains legacy operational children and transitional fields. Mutable document content moves to `EnterpriseBlueprintVersion.content` (validated JSON envelope) with `contentHash` and `revision`.

## Verification

- `npx prisma format` / `validate` / `generate`
- Isolated DB `migrate deploy` (local/CI only — not hosted Preview/Production in C2)
