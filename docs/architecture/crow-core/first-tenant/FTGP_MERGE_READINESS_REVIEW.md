# FTGP Merge Readiness Review

**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Base:** `main` @ `a5620c3`  
**Feature HEAD:** see branch tip after FTGP.1A commits  
**Commits ahead of `main`:** 182 (+ FTGP.1A)  
**Draft PR:** created on push (source `feat/first-tenant-golden-path` → `main`)

---

## Executive summary

The feature branch delivers FTGP foundation work: C3 legal and identity convergence, authoritative internal-role model, Data API containment, controlled dual migration apply, protected Preview activation, first Platform Admin bootstrap, and first IMPLEMENTER grant. FTGP.1A adds request lifecycle readiness (candidate inventory, boundary verification, ProCrow review transition service, zero-write dry-run) without mutating hosted business state.

**Merge status:** Draft PR only — **do not merge** until a separate Production deployment and rollback plan is approved.

```text
DO NOT MERGE UNTIL A SEPARATE PRODUCTION DEPLOYMENT AND ROLLBACK PLAN IS APPROVED.
```

---

## Production-trigger risk

| Check | Result |
|-------|--------|
| Vercel Production branch | `main` |
| Merge to `main` would trigger Production deployment | yes |
| Production alias | `https://crow-ecosystem-platform.vercel.app` → `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` |
| FTGP feature code in Production | false |
| `AUTOMATIC_DATABASE_MIGRATION_ON_DEPLOY` | false (`vercel.json` / `vercel-build-guard.mjs`) |
| `AUTOMATIC_ROLE_MUTATION_ON_DEPLOY` | false |
| `MERGE_WOULD_REQUIRE_SEPARATE_PRODUCTION_AUTHORIZATION` | true |

Protected Preview: `dpl_28xNJNkpdHPX7qyUVZXZqKupQEq2` (Vercel Deployment Protection active).

---

## Feature-branch diff classification

Compared `origin/main...HEAD` (~673 paths, additive FTGP/C3/cloud foundation).

| Category | Representative paths |
|----------|---------------------|
| Application runtime | `src/app/**`, `src/components/**`, middleware, route handlers |
| Authentication and authority | `src/lib/auth/**`, `authority-boundaries`, internal-role services |
| Prisma schema and migrations | `prisma/schema.prisma`, `prisma/migrations/202606*`, `20260621120000_ftgp_*` |
| Controlled database tooling | `scripts/controlled-migration-apply.mjs`, `cloud-1e` verifiers |
| Cloud containment tooling | `scripts/verify-cloud-data-api-containment.ts`, preview protection |
| Tests and verifiers | `ftgp-*`, `c3-*`, `cloud-*` scripts and `*.test.ts` |
| Documentation | `docs/architecture/**`, `docs/internal/**` |
| Operator-only ignored artifacts | `.env.*.operator`, `.ftgp-*-manifest`, candidate matrices (not tracked) |

```text
UNEXPECTED_OR_UNRELATED_CHANGE_COUNT=0
SECRET_OR_OPERATOR_ARTIFACT_TRACKED=false
```

Tracked secrets scan: only `.env.migration.recovery.example` among operator-like names; live operator env files are gitignored.

---

## Verified phases on branch

| Phase | Status |
|-------|--------|
| C3 legal and identity convergence | complete |
| FTGP authority foundation | complete |
| Data API containment tooling | complete |
| Controlled dual migration apply | complete (23/0/0 per CLOUD.1E) |
| Protected Preview activation | complete |
| First Platform Admin bootstrap | complete (fingerprint `b3ee2ec185cf9893`) |
| First IMPLEMENTER grant | complete (fingerprint `f82bef0cddd75238`) |
| FTGP.1A request selection readiness | complete (designation pending) |

Required commits present:

- `9fe9619` — test(auth): verify authoritative IMPLEMENTER grant
- `e5fccb9` — docs(first-tenant): record first IMPLEMENTER grant

---

## FTGP.1A readiness snapshot

See [FTGP_1A_REQUEST_SELECTION_AND_REVIEW_READINESS.md](./FTGP_1A_REQUEST_SELECTION_AND_REVIEW_READINESS.md).

```text
ELIGIBLE_FIRST_REQUEST_COUNT=1
FTGP-REQUEST-CANDIDATE-07 (fingerprint 9439dd8cc806696e)
EXPLICIT_REQUEST_DESIGNATED=false
PROCROW_REVIEW_TRANSITION_DRY_RUN=BLOCKED
```

---

## Draft PR description themes

- Additive legal lifecycle schema (C3)
- Authoritative `PlatformInternalRoleAssignment` model
- Audited Platform Admin and IMPLEMENTER grants (database-sourced authority)
- Metadata-only authority denial
- Requester / customer / tenant separation
- Data API containment (public schema removed from PostgREST exposure)
- Protected Preview on shared Production Supabase backend
- No tenant provisioning yet
- No Legal v1.1 publication
- No Production authorization in this phase

---

## Recommended merge path (not executed)

1. Operator designates first request (`FTGP-REQUEST-CANDIDATE-07`).
2. Dry-run passes with zero writes.
3. Stakeholders approve Production deployment + rollback plan.
4. Merge Draft PR to `main` under separate authorization.
5. Monitor Production deployment; FTGP request transition remains a distinct authorization.
