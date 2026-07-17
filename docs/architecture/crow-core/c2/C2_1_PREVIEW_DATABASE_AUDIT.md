# C2.1 — Preview database audit (read-only)

**Mode:** READ_ONLY — no `migrate deploy`, `db push`, `migrate resolve`, seeds, or backfill `--apply`.  
**Script:** `npm run c2-preview-readiness:audit` (requires `.env.staging`; clears shell `DATABASE_URL` override first).  
**Evidence file:** `docs/architecture/crow-core/c2/.c21-preview-audit-evidence.json` (gitignored; masked only).

---

## Target fingerprint

| Attribute | Value |
|-----------|--------|
| auditedAt | 2026-06-15T13:30:43.641Z |
| provider | supabase |
| maskedHost | aws***.com |
| maskedDatabase | po***es |
| schema | public |
| supabaseProjectRef | wbwnsndcxrgyqwppurms |
| targetHash | 0355c17692e2a90d |
| environmentClassification | shared_staging_production_risk |
| hostedMutation | false |

---

## Isolation (Agent A)

| Classification | SHARED_OR_POSSIBLY_SHARED |
|----------------|---------------------------|
| knownProductionSupabaseRef | wbwnsndcxrgyqwppurms |
| note | DATABASE_URL targets the documented production/staging Supabase project; Preview and Production likely share one Postgres unless Vercel Preview env uses a different URL. |

---

## Migration history (Agent B)

| Field | Value |
|-------|--------|
| classification | **C2_ALREADY_APPLIED** |
| appliedCount | 14 |
| repoExpectedCount | 14 |
| c2Present | true |
| failedCount | 0 |
| rolledBackCount | 2 |
| missingFromRepo | [] |
| extraNotInRepo | [] |

**Interpretation:** History is **aligned** with the repository (including migration #14 C2). C2 is **already recorded as applied** on this database—likely via Vercel Preview build `db:migrate:deploy`, not via C2.1.

Two rolled-back migration records exist; none are in failed state blocking deploy.

**Do not** run `prisma migrate resolve` in C2.1.

---

## Schema drift (Agent C)

### Pre-C2 tables

| Table | Present |
|-------|---------|
| enterprise_blueprints | yes |
| client_organization_request_links | yes |
| tenants | yes |
| _prisma_migrations | yes |

**`client_organization_request_links`:** Present in Preview. Not a C2 blocker; not absent due to history drift.

### C2 tables (post-migration objects)

All expected C2 tables present: `enterprise_blueprint_versions`, `blueprint_approvals`, `blueprint_trace_events`, `blueprint_change_requests`, `blueprint_configuration_proposals`, `roi_assumptions`, `roi_assumption_revisions`, `roi_snapshots`, `sow_documents`, `sow_versions`, `sow_sections`.

**c2TablesPresent:** true  
**versionRowCount:** 0 (schema applied; no backfill yet)

---

## Blueprint data (Agent D)

| Metric | Count |
|--------|-------|
| enterpriseBlueprintCount | 5 |
| missingTenantIdCount | 5 |
| invalidTenantRefCount | 0 |
| versionRowCount | 0 |

**proposalStatusDistribution:**

| Status | Count |
|--------|-------|
| CLIENT_APPROVED | 4 |
| DECLINED | 1 |

No client row content exported. Sample blueprint IDs in backfill report are masked (`cmpl…zmmf` style).

---

## SQL compatibility note (Agent F)

Schema objects from C2 exist on Preview; migration was applied successfully in the past. Remaining risk is **operational** (shared DB, tenant data), not missing DDL.

See [C2_1_PREVIEW_MIGRATION_READINESS.md](./C2_1_PREVIEW_MIGRATION_READINESS.md) for SQL review summary (additive-only; unchanged from C2 verifier).
