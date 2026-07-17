# C2.2 — Shared database incident record

**Classification:** Change-control / process incident (not a data breach notification)  
**Discovered:** C2.1 Preview migration readiness audit (Jun 2026)  
**Status:** Mitigated in code (C2.2); infrastructure isolation pending

## Summary

Vercel Preview application builds executed `npm run db:migrate:deploy` as part of `vercel.json` `buildCommand`. When Preview and Production shared the same `DATABASE_URL` / Supabase project, schema migrations (including C2 blueprint versioning) could apply against Production during Preview builds.

## What happened

| Fact | Detail |
|------|--------|
| Build pipeline | `vercel.json` included `db:migrate:deploy` before `build` |
| Isolation | C2.1 read-only audit: masked fingerprint consistent with shared Production/Staging Supabase ref |
| C2 migration on hosted DB | Already present (`20260614120000_blueprint_versioning_traceability`) — likely via prior Vercel builds |
| C2.1 hosted mutation | **None** — audit and dry-run only |
| Data exfiltration | Not indicated — issue is wrong-environment schema application |

## Impact

- Preview could not be treated as an isolated migration target
- C2.1 gate decision: **BLOCKED — PREVIEW/PRODUCTION DATABASE ISOLATION NOT PROVEN**
- Backfill and Preview apply remain unauthorized until isolation + ownership resolution

## Remediation (C2.2)

1. Remove `db:migrate:deploy` from Vercel `buildCommand`
2. Align `simulate-vercel-build.mjs` with production build steps
3. Introduce `run-controlled-migration.ts` with fingerprint + phrase guards
4. Add `workflow_dispatch` GitHub workflow for operator-controlled apply
5. Fail closed on C2 blueprint mutations when app/DB environment or fingerprint mismatches

## Forward fix (external)

1. Provision dedicated Preview Supabase project
2. Point Vercel Preview env vars at Preview DB only
3. Run controlled migration on Preview after PO authorization
4. Do **not** roll back C2 schema on shared DB — structures remain; isolation is forward-fix

## References

- [C2_1_PREVIEW_MIGRATION_READINESS.md](./C2_1_PREVIEW_MIGRATION_READINESS.md)
- [C2_1_PREVIEW_DATABASE_AUDIT.md](./C2_1_PREVIEW_DATABASE_AUDIT.md)
- [C2_2_DATABASE_ENVIRONMENT_ISOLATION.md](./C2_2_DATABASE_ENVIRONMENT_ISOLATION.md)
