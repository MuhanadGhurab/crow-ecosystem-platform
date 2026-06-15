# C2.2 — Preview database setup runbook

**Audience:** Product owner / platform operator  
**Prerequisite:** C2.2 engineering controls merged; dedicated Preview Supabase not yet provisioned

## Goal

Provision a **separate** Supabase Postgres instance for Vercel Preview deployments. Production and Preview must not share the same Supabase project ref.

## Steps

### 1. Create Preview Supabase project

1. In Supabase dashboard, create a new project (e.g. `crow-ecosystem-preview`).
2. Record the project ref (do not commit; store in password manager).
3. Confirm it differs from Production ref (C2.1 audit identified shared ref risk on hosted builds).

### 2. Configure connection strings

Obtain from Supabase:

- **Pooler** URL → `DATABASE_URL` (Preview Vercel env)
- **Direct** URL → `DIRECT_URL` (Preview Vercel env)

### 3. Compute fingerprint

```bash
# Local one-off (replace with Preview URLs; do not commit)
export DATABASE_URL="postgresql://..."
npx tsx -e "import { fingerprintDatabaseUrl } from './scripts/lib/database-fingerprint.ts'; console.log(fingerprintDatabaseUrl(process.env.DATABASE_URL!).targetHash)"
```

Set `EXPECTED_DATABASE_FINGERPRINT` on Vercel Preview to the printed `targetHash`.

### 4. Set Vercel Preview environment variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Preview pooler string |
| `DIRECT_URL` | Preview direct string |
| `DATABASE_ENVIRONMENT` | `preview` |
| `EXPECTED_DATABASE_FINGERPRINT` | Computed hash |

Do **not** set `ALLOW_DATABASE_MIGRATION` on Vercel — migrations are never run from builds.

### 5. Configure GitHub Environment `preview`

Add the same four values as Environment secrets for the controlled migration workflow.

### 6. Verify before first Preview deploy

```bash
npm run db:migrate:controlled -- --environment preview --check-only
```

Expect: fingerprint match, migrate status (likely pending C2 migration on fresh DB).

### 7. Apply C2 migration (only after PO authorization)

Use phrase `APPLY PREVIEW DATABASE MIGRATIONS` via:

- Local: `ALLOW_DATABASE_MIGRATION=true npm run db:migrate:controlled -- ...`
- GitHub: workflow_dispatch with `check_only: false`

### 8. Re-run C2.1 audit on isolated target

```bash
npm run c2-preview-readiness:audit
```

Confirm isolation classification no longer reports shared Production ref.

## First Preview deploy note

After removing build-time migrations, the first Preview deploy against a **new** Preview DB may require controlled migration **before** or immediately after app deploy if schema is behind application code.

## Non-goals

- Automatic Supabase provisioning from CI
- Copying Production data into Preview (use separate seed strategy if needed)
