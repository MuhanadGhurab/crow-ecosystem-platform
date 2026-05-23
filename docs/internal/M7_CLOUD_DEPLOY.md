# M7 — Cloud & production deploy

**Primary production target:** **Azure** (App Service + Azure PostgreSQL) — see [`AZURE_DEPLOY.md`](AZURE_DEPLOY.md).

**Interim optional path:** Vercel + hosted Postgres (often Supabase pooler) for a quick public URL before Azure is ready.

**Scope:** Production deploy patterns — env matrix, `migrate deploy` in CI/CD, Entra prod redirects. Resend optional until real email.

**Prerequisites:** M6 complete (`AUTH_DISABLED` blocked in production, `migrate deploy` tested locally, CI `postgres-smoke` green).

**Repo:** https://github.com/MuhanadGhurab/crow-ecosystem-platform

---

## Architecture choices

| Mode | When | `DATABASE_URL` | Auth |
|------|------|----------------|------|
| **Hybrid (dev)** | Local dev today | Local `crow_ecosystem` | Supabase Auth + Entra |
| **Azure (prod)** | **Primary** go-live | Azure Database for PostgreSQL | Supabase Auth + Entra (or Entra-only later) |
| **Vercel (interim)** | Optional preview | Supabase pooler or other hosted Postgres | Supabase Auth |

Keep **local Postgres** for development while Azure is the production data plane. Do not require a second cloud database for day-to-day work.

---

## Step 1 — Vercel project

**Walkthrough:** [`VERCEL_CONNECT.md`](VERCEL_CONNECT.md) (step-by-step for this repo).

1. https://vercel.com → **Add New Project** → import `crow-ecosystem-platform`.
2. Framework: **Next.js** (auto-detected).
3. Root directory: `.` (repo root).
4. Build command (from `vercel.json`): `npm run db:generate && npm run db:migrate:deploy && npm run build`
5. Install command: `npm ci`

**Do not** set `AUTH_DISABLED=true` on Production or Preview.

---

## Step 2 — Environment variables (Production)

Copy from [`.env.example`](../.env.example). Set in Vercel → Project → Settings → Environment Variables.

### Required

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Supabase **transaction** pooler, port **6543**, `?pgbouncer=true` |
| `DIRECT_URL` | Supabase **session** pooler, port **5432** (migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[ref].supabase.co` — no `/rest/v1/` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — grant-role scripts |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` or custom domain |
| `NODE_ENV` | `production` (Vercel sets automatically) |

### Auth / Entra (when ready)

| Variable | Notes |
|----------|--------|
| `AZURE_SSO_ENABLED` | `true` |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | Directory tenant ID |
| Supabase allowlist | `https://your-domain/auth/callback` |
| Azure redirect | `https://[ref].supabase.co/auth/v1/callback` |

See [`ENTRA_SSO.md`](ENTRA_SSO.md).

### Explicitly unset in production

| Variable | Why |
|----------|-----|
| `AUTH_DISABLED` | Blocked by `instrumentation.ts` if `true` |
| `USE_MOCK_DATA` | Must be `false` or unset for real demos |

### Optional (later)

| Variable | When |
|----------|------|
| `RESEND_API_KEY` | Real notification email |
| `NOTIFICATION_FROM_EMAIL` | With Resend |
| `TENANT_OPS_SEED` | Staging only — demo sample data on provision |
| Stripe keys | Phase 10 billing |

---

## Step 3 — Database on Supabase

1. Supabase Dashboard → **Database** → connection strings.
2. Paste pooler URLs into Vercel env (see table above).
3. One-time after first deploy (or in CI before app):

```bash
npm run db:migrate:deploy
npm run db:seed          # catalog only
# MEEM lighthouse (staging demo):
npm run db:seed:meem
npm run db:seed:meem:ops
```

4. Confirm health: `GET https://your-app.vercel.app/api/health` → `{ ok: true, db: "ok", deployReady: true, migrationsApplied: N, billingReady: bool }`.

---

## Step 4 — Supabase Auth (production)

1. Same project as production DB (recommended).
2. Grant yourself platform admin:

```bash
USER_EMAIL=you@company.com CROW_ROLE=platform_admin npm run auth:bootstrap
```

3. See [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md) for `sales`, `auditor_readonly`, `tenant_user` grants.

---

## Step 5 — GitHub ↔ Vercel

- Connect repo; deploy on push to `main` (default).
- CI already runs on `main`: `verify` + `postgres-smoke` ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)).
- After green CI, Vercel production deploy should succeed if env vars are set.

---

## Pre-flight (local)

```bash
npm run deploy:check
DEPLOY_TARGET=vercel npm run deploy:check
DEPLOY_TARGET=azure npm run deploy:check
npm run simulate:production-env
```

Validates required env without printing secrets. Fix blockers before pasting into Vercel.

---

## Step 6 — Post-deploy smoke

```bash
SMOKE_BASE_URL=https://your-app.vercel.app SMOKE_CHECK_HEALTH=1 npm run smoke:phase1
```

Requires production DB writable and auth not blocking server actions (use service paths only — smoke uses Prisma directly).

For MEEM rehearsal on staging: [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) (run when you approve full E2E).

---

## Staging vs production

| | Staging | Production |
|---|---------|------------|
| Vercel env | Preview + branch `develop` optional | Production |
| `TENANT_OPS_SEED` | `true` OK | `false` unless customer opts in |
| MEEM seed | `db:seed:meem` | Only for lighthouse demo tenant |
| Resend | Test domain | Verified domain |

---

## M7 checklist (track in PHASES)

- [ ] Vercel project linked to GitHub
- [ ] Production env matrix set (no `AUTH_DISABLED`)
- [ ] `migrate deploy` succeeds against Supabase
- [ ] `/api/health` green on Vercel URL
- [ ] Entra prod redirect URIs
- [ ] Custom domain (optional)
- [ ] `RESEND_API_KEY` when email required

---

## Related

| Doc | Use |
|-----|-----|
| [`GITHUB_SETUP.md`](GITHUB_SETUP.md) | Repo + CI |
| [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) | Local dev |
| [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) | Supabase project |
| [`MILESTONES.md`](MILESTONES.md) | M7 % |

*May 2026 — M7 foundation; deploy when customer go-live date is set.*
