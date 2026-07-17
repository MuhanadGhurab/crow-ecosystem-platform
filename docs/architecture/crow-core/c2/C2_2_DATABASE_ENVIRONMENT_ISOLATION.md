# C2.2 — Database environment isolation

**Gate:** C2.2 Database Isolation & Migration Control  
**Branch:** `feat/c2-2-database-isolation-migration-control` (stacked on C2.1)  
**Status:** Engineering controls implemented; external Preview DB provisioning pending

## Problem statement

C2.1 proved that Vercel Preview builds could target the same Supabase project as Production because `vercel.json` ran `npm run db:migrate:deploy` on every build. C2.2 removes migrations from application builds and introduces fingerprint-verified, phrase-gated controlled delivery.

## Environment model

| Variable | Purpose | Set where |
|----------|---------|-----------|
| `VERCEL_ENV` | Vercel-native app environment (`production`, `preview`, `development`) | Vercel (automatic) |
| `APP_ENVIRONMENT` | Explicit override when not on Vercel | Local / CI |
| `DATABASE_ENVIRONMENT` | Logical DB tier: `production`, `preview`, `local`, `ci` | Vercel env + GitHub Environment |
| `EXPECTED_DATABASE_FINGERPRINT` | 16-char SHA-256 prefix of stable target identity | Secrets only |
| `ALLOW_DATABASE_MIGRATION` | Must be `true` for apply mode in controlled wrapper | GitHub workflow apply step only |

### App vs database alignment

On Vercel:

- `VERCEL_ENV=preview` requires `DATABASE_ENVIRONMENT=preview`
- `VERCEL_ENV=production` requires `DATABASE_ENVIRONMENT=production`

Mismatch causes C2 blueprint **mutations** to fail closed via `assertC2DatabaseEnvironmentSafe()`.

## Fingerprint contract

Implemented in `scripts/lib/database-fingerprint.ts`:

- Stable inputs: host, database name, schema, port
- Excluded: username, password, query tokens beyond schema
- `EXPECTED_DATABASE_FINGERPRINT` must equal `targetHash` before any controlled migration or C2 mutation on a DB with C2 tables

Operator display uses `maskDatabaseTarget()` — no credentials in logs.

## Build safety

`vercel.json` buildCommand:

```text
node scripts/vercel-build-guard.mjs && npm run db:generate && npm run build
```

No `db:migrate:deploy`, `db push`, backfill, or seed in the build chain.

## Runtime guard

When `enterprise_blueprint_versions` exists:

- Non-read blueprint actions call `assertC2DatabaseEnvironmentSafe()` in `blueprint-action-guard.ts`
- Read actions (list, internal read, client read, compare, trace) are not blocked
- `/api/health` may surface non-fatal `databaseEnvironmentWarnings` when misconfigured

## Acceptance decision

**CONDITIONAL PASS — BUILD MIGRATION REMOVED, EXTERNAL ISOLATION PENDING**

Full pass requires:

1. Dedicated Preview Supabase project (separate ref from Production)
2. Preview Vercel env vars with matching fingerprint
3. Successful `npm run db:migrate:controlled -- --environment preview --check-only` against Preview target
4. Resolution of 3 legacy blueprint tenant ownership records before backfill authorization

## Related documents

- [C2_2_CONTROLLED_MIGRATION_DELIVERY.md](./C2_2_CONTROLLED_MIGRATION_DELIVERY.md)
- [C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md](./C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md)
- [C2_2_SHARED_DATABASE_INCIDENT_RECORD.md](./C2_2_SHARED_DATABASE_INCIDENT_RECORD.md)
- [C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md](./C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md)
- [C2_1_PREVIEW_MIGRATION_READINESS.md](./C2_1_PREVIEW_MIGRATION_READINESS.md)
