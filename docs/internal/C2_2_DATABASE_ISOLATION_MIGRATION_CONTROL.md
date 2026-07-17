# C2.2 — Database isolation & migration control (internal gate)

**Branch:** `feat/c2-2-database-isolation-migration-control`  
**Stack:** PR #3 C0 → #4 C1 → #5 C1.1 → #6 C2 → #7 C2.1 → (pending) C2.2  
**Date:** 15 Jun 2026

## Gate decision

**CONDITIONAL PASS — BUILD MIGRATION REMOVED, EXTERNAL ISOLATION PENDING**

Engineering controls are in place. Full pass requires dedicated Preview Supabase + fingerprint-verified env configuration by product owner.

## What C2.2 delivers

| Control | Artifact |
|---------|----------|
| No migrate on Vercel build | `vercel.json`, `simulate-vercel-build.mjs` |
| Fingerprint + environment model | `scripts/lib/database-environment.ts` |
| Controlled migration CLI | `scripts/run-controlled-migration.ts`, `db:migrate:controlled` |
| GitHub workflow (dispatch only) | `.github/workflows/database-migrate.yml` |
| C2 mutation fail-closed guard | `c2-database-mutation-guard.ts`, `blueprint-action-guard.ts` |
| Health warnings (non-fatal) | `/api/health` `databaseEnvironmentWarnings` |
| Verifier | `npm run c2-database-isolation:verify` |

## Forbidden in C2.2

| Action | Status |
|--------|--------|
| New Prisma migration files | Not added |
| Edit C2 migration SQL | Not changed |
| Hosted `migrate deploy` during implementation | Not run |
| Backfill `--apply` | Not run |
| Vercel/Production env changes | PO external |
| C2 production write activation | Not in scope |
| M4D / PR #2 changes | Out of scope |

## Validation commands

```bash
npm run c2-database-isolation:verify
npm run c2-preview-readiness:verify
npm run c2-blueprint-runtime:verify
npm run c1-migration-gate:verify
```

## External actions (PO)

1. Provision dedicated Preview Supabase (separate from Production `wbwnsndcxrgyqwppurms`)
2. Set Preview `DATABASE_URL`, `DIRECT_URL`, `DATABASE_ENVIRONMENT=preview`, `EXPECTED_DATABASE_FINGERPRINT` on Vercel Preview
3. Configure GitHub Environment secrets for `preview` / `production`
4. Resolve 3 legacy blueprint tenant ownership records
5. Authorize Preview controlled migration only after fingerprint verification

## Documentation index

- [C2_2_DATABASE_ENVIRONMENT_ISOLATION.md](../architecture/crow-core/c2/C2_2_DATABASE_ENVIRONMENT_ISOLATION.md)
- [C2_2_CONTROLLED_MIGRATION_DELIVERY.md](../architecture/crow-core/c2/C2_2_CONTROLLED_MIGRATION_DELIVERY.md)
- [C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md](../architecture/crow-core/c2/C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md)
- [C2_2_SHARED_DATABASE_INCIDENT_RECORD.md](../architecture/crow-core/c2/C2_2_SHARED_DATABASE_INCIDENT_RECORD.md)
- [C2_2_LEGACY_BLUEPRINT_OWNERSHIP_RESOLUTION.md](../architecture/crow-core/c2/C2_2_LEGACY_BLUEPRINT_OWNERSHIP_RESOLUTION.md)
- [C2_2_CI_MIGRATION_HYGIENE.md](../architecture/crow-core/c2/C2_2_CI_MIGRATION_HYGIENE.md)

## Upgrade path from C2.1

C2.1 remains **BLOCKED — PREVIEW/PRODUCTION DATABASE ISOLATION NOT PROVEN** as historical audit outcome. C2.2 does not reverse that finding; it implements controls so future Preview deploys cannot silently migrate Production.
