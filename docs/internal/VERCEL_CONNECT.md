# Connect Crow Ecosystem to Vercel (optional interim)

**Primary production:** [**Azure**](AZURE_DEPLOY.md) — App Service + Azure PostgreSQL. Use this doc only for a **temporary** public URL before Azure is ready.

**Repo:** https://github.com/MuhanadGhurab/crow-ecosystem-platform  
**Project ref (Supabase Auth):** `qnujbwfztmrmsvkugvot` (from your `.env`) — or a **new** ref if you use Vercel Storage → Install Supabase

Vercel cannot use `localhost` Postgres. Interim deploys need **hosted** Postgres pooler URLs (or skip Vercel and stay local until Azure).

> **Fresh Supabase from Vercel Storage integration?** Follow [`SUPABASE_VERCEL_FRESH_PROJECT.md`](SUPABASE_VERCEL_FRESH_PROJECT.md) (new project ref, keys, Entra redirects, seed).

---

## Step 1 — Supabase database URLs (required for Vercel build)

Your dev setup is **Option B hybrid** (local Postgres `crow_ecosystem` + Supabase Auth). **Vercel must use Supabase hosted Postgres** from the **same** project (`qnujbwfztmrmsvkugvot`) — not `localhost`.

### Get the two URLs (Dashboard)

1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/qnujbwfztmrmsvkugvot/settings/database) → **Project Settings → Database**.
2. Under **Connection string**, choose **URI**.
3. Copy **Transaction pooler** → Vercel **`DATABASE_URL`**
   - Port **6543**
   - Must include **`?pgbouncer=true`** at the end
   - Host looks like `aws-0-<region>.pooler.supabase.com` (region must match your project — do not guess)
4. Copy **Session pooler** → Vercel **`DIRECT_URL`**
   - Port **5432**
   - Same host/region as above, no `pgbouncer=true`

### Password rules

| Rule | Why |
|------|-----|
| Use **Database password** from Supabase (reset under Database settings if unknown) | Not your local Postgres password unless you set the same on Supabase |
| Encode `@` in the password as **`%40`** in the URL | Prisma otherwise reports invalid URL / port (P1013) |
| Database name on Supabase is usually **`postgres`** in the URI | Local dev uses `crow_ecosystem`; hosted pooler strings end with `/postgres` |

**Example shape** (replace password and confirm region in Dashboard):

```text
DATABASE_URL=postgresql://postgres.qnujbwfztmrmsvkugvot:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.qnujbwfztmrmsvkugvot:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

Local template (no secrets): run `powershell scripts/print-vercel-env-template.ps1` and paste **`YOUR_DB_PASSWORD`** + fix **REGION** from the Dashboard strings.

> After first deploy, run seeds once from your machine against production URLs:
> `npx prisma migrate deploy` (if build migrate succeeded, skip) · `npm run db:seed` · optional `npm run db:seed:meem`

---

## Step 2 — Import project on Vercel (UI)

1. https://vercel.com/new
2. **Import Git Repository** → `MuhanadGhurab/crow-ecosystem-platform`
3. Framework: **Next.js** (auto)
4. Root directory: `.`
5. Build / Install: leave default — repo [`vercel.json`](../vercel.json) sets:
   - `installCommand`: `npm ci`
   - `buildCommand`: `npm run db:generate && npm run db:migrate:deploy && npm run build`

6. **Deploy** (first build may fail until env vars are set — normal)

---

## Step 3 — Environment variables (Production)

Vercel → your project → **Settings → Environment Variables**.

For each row: **Add New** → Name → Value → enable **Production** (and Preview if you want preview deploys) → **Save**.

| Variable | Value (source) |
|----------|----------------|
| `DATABASE_URL` | Supabase **Transaction pooler** URI (6543, `?pgbouncer=true`) — Step 1 |
| `DIRECT_URL` | Supabase **Session pooler** URI (5432) — Step 1 |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qnujbwfztmrmsvkugvot.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same as local `.env` publishable key **or** Dashboard → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Same as local `.env` secret key (server only) |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-vercel-app>.vercel.app` — set after first deploy, then redeploy |
| `AZURE_SSO_ENABLED` | `true` (if using Entra) |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | Same as local `.env` |

**Do not add on Production:** `AUTH_DISABLED`, `USE_MOCK_DATA` (leave unset).

Optional: `NODE_ENV` = `production` (Vercel often sets this automatically).

### After saving env vars

1. **Deployments** → latest deployment → **⋯** → **Redeploy** (must redeploy so build picks up new vars).
2. Build log should show pooler host (`pooler.supabase.com`), **not** `localhost:5432`.

Template file: [`.env.production.example`](../.env.production.example)

---

## Step 4 — Entra redirects (production)

After you know `NEXT_PUBLIC_SITE_URL`:

| Where | URL |
|-------|-----|
| Supabase → Auth → Redirect URLs | `https://<your-domain>/auth/callback` |
| Azure app registration | `https://qnujbwfztmrmsvkugvot.supabase.co/auth/v1/callback` (unchanged) |

See [`ENTRA_SSO.md`](ENTRA_SSO.md) § Production.

---

## Step 5 — Redeploy & verify

1. Vercel → **Deployments** → **Redeploy** latest (after env saved)
2. Open `https://<your-app>.vercel.app/api/health`

Expected:

```json
{
  "ok": true,
  "db": "ok",
  "auth": "configured",
  "mockData": false,
  "deployReady": true,
  "siteUrl": "https://..."
}
```

3. Local pre-flight (before changing env):

```powershell
cd D:\CYBERCROW
npm run deploy:check
```

---

## Step 6 — CLI (optional)

Install Vercel CLI for future deploys:

```powershell
npm i -g vercel
cd D:\CYBERCROW
vercel login
vercel link
vercel env pull .env.vercel.local
```

Add `.vercel/` to git (ignored). Never commit `.env.vercel.local`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Log shows `at "localhost:5432"` during build | **You pasted local `.env` on Vercel.** Replace `DATABASE_URL` / `DIRECT_URL` with **Supabase pooler** URLs (not `localhost`). |
| Build fails at `migrate deploy` with **P3005** | DB was created with `db push` (tables exist, no `_prisma_migrations`). Build auto-baselines when `implementation_requests` exists; or run `npm run db:migrate:baseline` locally against that DB, then redeploy. |
| Build fails at `migrate deploy` (other) | Set `DATABASE_URL` + `DIRECT_URL` on Vercel; check Supabase password; use session pooler for `DIRECT_URL` (5432) |
| `db: unreachable` on health | Pooler URL wrong or IP banned — use Supabase pooler not localhost |
| Auth callback error | `NEXT_PUBLIC_SITE_URL` + Supabase redirect URL must match |
| `AUTH_DISABLED` in production | Remove var; app blocks prod + auth disabled |

---

## Related

- [`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md)
- [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) — keep local dev as-is
