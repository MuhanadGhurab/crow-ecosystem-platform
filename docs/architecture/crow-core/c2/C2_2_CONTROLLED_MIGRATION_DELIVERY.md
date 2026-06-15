# C2.2 — Controlled migration delivery

**Purpose:** Replace implicit Vercel-build migrations with explicit, fingerprint-verified operator workflows.

## CLI wrapper

```bash
npm run db:migrate:controlled -- --environment preview --check-only
npm run db:migrate:controlled -- --environment preview --confirm "APPLY PREVIEW DATABASE MIGRATIONS"
npm run db:migrate:controlled -- --environment production --confirm "APPLY PRODUCTION DATABASE MIGRATIONS"
```

Implementation: `scripts/run-controlled-migration.ts`

### Guards (all must pass for apply)

| Check | Failure mode |
|-------|----------------|
| `--environment` required | Exit 1 |
| `EXPECTED_DATABASE_FINGERPRINT` set | Exit 1 |
| Fingerprint matches live `DATABASE_URL` | Exit 1 |
| `--confirm` matches environment phrase | Exit 1 |
| Preview phrase on production target (or vice versa) | Exit 1 |
| `ALLOW_DATABASE_MIGRATION=true` for apply | Exit 1 |

### Confirmation phrases

| Environment | Exact phrase |
|-------------|--------------|
| `preview` | `APPLY PREVIEW DATABASE MIGRATIONS` |
| `production` | `APPLY PRODUCTION DATABASE MIGRATIONS` |

Phrases are defined in `scripts/lib/database-environment.ts` as `CONTROLLED_MIGRATION_PHRASES`.

### Modes

- **`--check-only`:** Runs `prisma migrate status` only. Never deploys.
- **Apply (default when not check-only):** Status → `migrate deploy` via `scripts/migrate-deploy.mjs` → status again.

### Optional

- `--expected-migration <folder>` — asserts migration name appears in status output

## GitHub Actions workflow

File: `.github/workflows/database-migrate.yml`

- Trigger: **`workflow_dispatch` only** (no push/PR)
- Inputs: `environment`, `confirmation_phrase`, `check_only` (default `true`), optional `expected_migration_name`
- Concurrency: one run per environment
- Uses GitHub Environment `preview` or `production` for secrets

### Required GitHub Environment secrets (operator-configured)

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Pooler URL for target environment |
| `DIRECT_URL` | Direct connection for migrations |
| `EXPECTED_DATABASE_FINGERPRINT` | Must match fingerprint of URLs above |

### Protection rules (recommended)

- Required reviewers for `production` environment
- `preview` environment: at least one operator approval before apply (`check_only: false`)

## What is NOT automated

- Supabase project creation
- Vercel environment variable changes
- Backfill `--apply`
- Migration rollback or `migrate resolve`

## Local simulation

Vercel build simulation (`npm run simulate:vercel-build`) no longer runs migrations — aligned with production Vercel behavior after C2.2.

## Verifier

```bash
npm run c2-database-isolation:verify
```
