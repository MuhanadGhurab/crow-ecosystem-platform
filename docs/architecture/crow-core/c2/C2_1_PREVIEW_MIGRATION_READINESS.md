# C2.1 — Preview migration readiness

**Phase:** C2.1 Preview Migration Readiness Gate  
**Branch:** `feat/c2-1-preview-migration-readiness` (stacked on `feat/c2-blueprint-persistence-runtime`)  
**C2 migration:** `20260614120000_blueprint_versioning_traceability`  
**C2 PR:** [#6](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/6)  
**Audited at:** 2026-06-15 (read-only)  
**Evidence checksum:** `a326646cab7e6590`

---

## Executive summary

C2 **code and local verification** passed on branch `feat/c2-blueprint-persistence-runtime`. This gate inspects the **actual hosted database** bound to Preview/staging credentials.

The hosted target is **not ready** for a controlled, isolated Preview-only C2 apply. The C2 migration appears **already applied** on that database via the Vercel build pipeline (`db:migrate:deploy`). Preview and Production likely **share one Supabase Postgres** (`wbwnsndcxrgyqwppurms`). All five legacy `EnterpriseBlueprint` rows lack `tenantId`; backfill dry-run would create two version rows and leave three unresolved.

**C2.1 did not mutate any hosted database** (`hostedMutation: false`).

---

## Final C2.1 decision

**BLOCKED — PREVIEW/PRODUCTION DATABASE ISOLATION NOT PROVEN**

Secondary findings (documented; not the primary decision label):

- C2 migration already present on hosted target (`C2_ALREADY_APPLIED`).
- Tenant ownership risk: 5/5 blueprints missing `tenantId`; 3/5 unresolved in backfill dry-run.
- Migration history aligned with repo (14/14) but includes 2 rolled-back records.

---

## PR stack (precheck)

| PR | Branch | State |
|----|--------|-------|
| #3 | C0 | OPEN, MERGEABLE |
| #4 | C1 | OPEN, MERGEABLE |
| #5 | C1.1 | OPEN, MERGEABLE |
| #6 | C2 (`feat/c2-blueprint-persistence-runtime`) | OPEN, MERGEABLE — primary Vercel check SUCCESS on `crow-ecosystem-platform` |
| #2 | M4D | OPEN — **untouched by C2.1** |

---

## Preview deployment identity (Agent A)

| Field | Value |
|-------|--------|
| Vercel project (authoritative) | `crow-ecosystem-platform` |
| PR #6 head commit | `48e372f` |
| Preview URL pattern | `crow-ecosystem-platform-*.vercel.app` |
| Secondary project | `crow-ecosystem-platform-hsod` — FAILURE; **not authoritative** |
| Build hook | `vercel.json` runs `npm run db:migrate:deploy` on every Preview build |

Environment variables were **not** exported. Binding is inferred from:

- Documented staging/production Supabase ref `wbwnsndcxrgyqwppurms` in internal runbooks.
- Masked audit fingerprint matching that ref (pooler host + `postgres.wbwnsndcxrgyqwppurms` username pattern).

---

## Database target fingerprint

| Field | Masked value |
|-------|----------------|
| Provider | supabase |
| Host | `aws***.com` (pooler) |
| Database | `po***es` |
| Schema | `public` |
| Supabase project ref | `wbwnsndcxrgyqwppurms` |
| Target hash | `0355c17692e2a90d` |
| Classification | `shared_staging_production_risk` |

---

## Isolation result

| Result | **SHARED_OR_POSSIBLY_SHARED** |
|--------|-------------------------------|
| Known production ref | `wbwnsndcxrgyqwppurms` |
| Interpretation | Preview builds and Production likely use the same hosted Postgres unless Vercel Preview `DATABASE_URL` is changed to a dedicated database. |

**Stop-the-line:** Do not treat Preview apply as isolated until a separate Preview-only database is provisioned and bound in Vercel Preview environment variables.

---

## Gate checklist (§6)

| Check | Result |
|-------|--------|
| Preview isolated from Production | **FAIL** — shared ref |
| Target identity established | **PASS** — fingerprint above |
| C2 not already partially applied | **FAIL** — `c2Present: true` |
| Migration history compatible with deploy | **PASS** — 14 aligned; 2 rolled-back records noted |
| No failed migration blocks deploy | **PASS** — `failedCount: 0` |
| C2 SQL additive | **PASS** — C2 verifier (unchanged) |
| FK/index safe on current data | **PASS** — schema present; 0 version rows |
| Tenant ownership quantified | **PASS** — 5 missing `tenantId` |
| Backfill dry-run succeeds | **PARTIAL** — 2 would-create, 3 unresolved |
| Backfill invents no approvals | **PASS** — `LEGACY_IMPORT` only; dry-run |
| Client-safe / tenant-isolation tests green | **PASS** — local suite (see verification) |
| Rollback/forward-fix plan | **PASS** — runbook |
| Post-apply smoke plan | **PASS** — runbook |
| No hosted mutation during C2.1 | **PASS** |

---

## Terminology

Canonical persisted/code enum: **`LEGACY_IMPORT`** (schema, migration SQL, backfill service).  
C1-era docs used a non-canonical provenance label; C2.1 corrects documentation only — **no enum rename in C2.1**.

---

## Product-owner action required

1. **Provision an isolated Preview-only Postgres** (or confirm a dedicated Preview `DATABASE_URL` in Vercel Preview env only).
2. **Resolve tenant ownership** on legacy blueprints before backfill apply (manual linkage or data fix).
3. **Separate migration apply from Vercel build** for controlled gates, or accept that C2 is already on shared hosted DB via CI.
4. When isolated Preview is proven and data is resolved, issue explicit authorization: **`APPLY C2 MIGRATION TO PREVIEW`** (not required if migration already applied on that target — instead authorize **backfill apply** and smoke only).

---

## Related documents

- [C2_1_PREVIEW_DATABASE_AUDIT.md](./C2_1_PREVIEW_DATABASE_AUDIT.md)
- [C2_1_BACKFILL_DRY_RUN_REPORT.md](./C2_1_BACKFILL_DRY_RUN_REPORT.md)
- [C2_1_PREVIEW_APPLY_RUNBOOK.md](./C2_1_PREVIEW_APPLY_RUNBOOK.md)
- [C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md](./C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md)
- [C2_1_PREVIEW_MIGRATION_READINESS_GATE.md](../../internal/C2_1_PREVIEW_MIGRATION_READINESS_GATE.md)
