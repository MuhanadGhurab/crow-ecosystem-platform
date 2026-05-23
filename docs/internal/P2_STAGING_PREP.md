# P2 — Staging preparation (deploy:check → live URL)

**Prerequisites (done):** P0 CI green · P1 MEEM E2E passed (real login + Postgres) · `npm run deploy:check` OK on local hybrid env.

**Goal:** A **staging URL** with hosted Postgres, real auth, `/api/health` `deployReady: true`, and optional MEEM lighthouse seed.

**Primary prod later:** Azure ([`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md)). **Staging interim:** Vercel + Supabase pooler (fastest path).

---

## Current local baseline (your machine)

| Check | Status |
|-------|--------|
| `deploy:check` (hybrid dev) | ✓ OK |
| `AUTH_DISABLED` | `false` |
| `USE_MOCK_DATA` | `false` |
| `DATABASE_URL` | localhost (dev only) |
| `NEXT_PUBLIC_SITE_URL` | **unset** — set on staging |
| Resend | configured |
| Stripe | optional (M8) |

**Vercel target:** `DEPLOY_TARGET=vercel npm run deploy:check` → warns localhost DB (expected until pooler URLs pasted).

**Azure target:** `DEPLOY_TARGET=azure npm run deploy:check` → blocks localhost DB (expected until Azure Postgres).

---

## P2 execution order

### 1. Supabase — staging database URLs

In Supabase Dashboard → **Project Settings → Database → Connection string**:

| Variable | Pooler | Port | Notes |
|----------|--------|------|--------|
| `DATABASE_URL` | **Transaction** | **6543** | Append `?pgbouncer=true` |
| `DIRECT_URL` | **Session** | **5432** | Used by `migrate deploy` on build |

Use the **same Supabase project** as auth (`NEXT_PUBLIC_SUPABASE_URL`) unless you intentionally split.

---

### 2. Vercel project

See [`VERCEL_CONNECT.md`](VERCEL_CONNECT.md).

1. Import `crow-ecosystem-platform` from GitHub.
2. Production branch: `main`.
3. Build command (already in `vercel.json`):

   `node scripts/vercel-build-guard.mjs && npm run db:generate && npm run db:migrate:deploy && npm run build`

4. **Do not** set `AUTH_DISABLED` or `USE_MOCK_DATA=true`.

---

### 3. Vercel environment variables (Production / Preview)

Copy template: [`.env.production.example`](../.env.production.example).

**Required**

| Variable | Staging value |
|----------|----------------|
| `DATABASE_URL` | Supabase transaction pooler (6543, `pgbouncer=true`) |
| `DIRECT_URL` | Supabase session pooler (5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server only) |
| `NEXT_PUBLIC_SITE_URL` | `https://[your-project].vercel.app` |

**Optional staging**

| Variable | When |
|----------|------|
| `TENANT_OPS_SEED` | `true` — demo ops data on new tenant provision |
| `RESEND_API_KEY` | Real pipeline email on staging |
| `PIPELINE_NOTIFY_EMAIL_OVERRIDE` | Your inbox for staging notifications |
| `AZURE_SSO_ENABLED` + tenant ID | Entra on staging URL |

**Never on staging/production**

- `AUTH_DISABLED=true`
- `USE_MOCK_DATA=true`

---

### 4. Pre-flight (local, before first deploy)

Use **`.env.staging`** (gitignored) — corrected pooler URLs, encoded password, no `pgbouncer` on `DIRECT_URL`.

```bash
npm run validate:vercel-env      # URL encoding + DIRECT_URL rules
npm run deploy:check:staging       # M7 readiness against hosted DB
npm run simulate:vercel-build:staging   # must pass build guard
```

Copy the same values into **Vercel → Environment Variables** (omit Stripe until M8).

---

### 5. First deploy

1. Push to `main` (CI must stay green).
2. Vercel → Deploy → watch build log:
   - ✓ `vercel-build-guard` (remote DB)
   - ✓ `db:migrate:deploy`
   - ✓ `next build`

If migrate fails on clean Supabase DB, use the same pattern as CI: one-time `npx prisma db push` on staging, then baseline migrations (see [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md)).

---

### 6. Post-deploy verification

```bash
# Replace with your Vercel URL
curl https://YOUR-APP.vercel.app/api/health
```

Expect:

```json
{
  "ok": true,
  "db": "ok",
  "auth": "configured",
  "deployReady": true,
  "migrationsApplied": 9,
  "mockData": false
}
```

**Seed staging lighthouse (once):**

```bash
# From your machine with staging DATABASE_URL in env (never commit)
npm run db:seed
npm run db:seed:meem
npm run db:seed:meem:ops
npm run sarea:meem-upgrade
```

**Grant platform admin on staging Supabase:**

```bash
USER_EMAIL=you@company.com CROW_ROLE=platform_admin npm run auth:bootstrap
```

**Remote smoke (optional):**

```bash
SMOKE_BASE_URL=https://YOUR-APP.vercel.app SMOKE_CHECK_HEALTH=1 npm run smoke:phase1
```

---

### 7. Entra (when SSO on staging)

1. Azure app registration → add redirect: `https://YOUR-APP.vercel.app/auth/callback`
2. Supabase Auth → URL configuration → site URL + redirect allowlist
3. See [`ENTRA_SSO.md`](ENTRA_SSO.md) § Production

---

### 8. MEEM on staging (repeat P1 browser pass)

| Surface | Path |
|---------|------|
| MEEM dashboard | `/meem-global/dashboard` |
| SAREA preview | `/sarea/preview` |
| CyberCrow | `/meem-global/cybercrow/dashboard` |
| Omar sign-off | [`customers/OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md`](customers/OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md) |

Share staging URL with Omar for M5 when ready.

---

## P2 checklist

| # | Task | Done |
|---|------|------|
| 1 | Supabase pooler URLs copied | [ ] |
| 2 | Vercel project linked to GitHub | [ ] |
| 3 | Production env vars set (no AUTH_DISABLED) | [ ] |
| 4 | `NEXT_PUBLIC_SITE_URL` = Vercel URL | [ ] |
| 5 | First deploy build green | [ ] |
| 6 | `GET /api/health` → `deployReady: true` | [ ] |
| 7 | `auth:bootstrap` platform admin | [ ] |
| 8 | MEEM seed on staging DB | [ ] |
| 9 | Browser spot-check (login + dashboard) | [ ] |
| 10 | Entra redirects (if SSO) | [ ] |

---

## After P2

| Track | Next |
|-------|------|
| **M7 production** | Azure App Service + Azure Postgres ([`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md)) |
| **M8 billing** | Stripe test keys + webhook URL on staging |
| **M5** | Omar SAREA sign-off on staging URL |

---

*May 2026 — P2 after P1 MEEM E2E closed.*
