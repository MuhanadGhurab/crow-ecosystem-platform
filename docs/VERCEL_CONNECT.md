# Connect Crow Ecosystem to Vercel

**Repo:** https://github.com/MuhanadGhurab/crow-ecosystem-platform  
**Project ref (Supabase Auth):** `qnujbwfztmrmsvkugvot` (from your `.env`)

Vercel cannot use `localhost` Postgres. For production you need **Supabase Postgres pooler URLs** (recommended) or another hosted database.

---

## Step 1 — Supabase database URLs (required for Vercel build)

Your dev setup is **Option B hybrid** (local DB + Supabase Auth). For Vercel, add **hosted Postgres** from the **same** Supabase project:

1. Open https://supabase.com/dashboard → project **qnujbwfztmrmsvkugvot**
2. **Project Settings → Database → Connection string**
3. Copy **Transaction pooler** (port **6543**, `?pgbouncer=true`) → Vercel `DATABASE_URL`
4. Copy **Session pooler** (port **5432**) → Vercel `DIRECT_URL`

Use the **password** from Database settings (not your local `@1123` unless you set the same on Supabase).

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

Vercel → Project → **Settings → Environment Variables → Production**

| Variable | Where to get value |
|----------|-------------------|
| `DATABASE_URL` | Supabase transaction pooler (6543 + `pgbouncer=true`) |
| `DIRECT_URL` | Supabase session pooler (5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qnujbwfztmrmsvkugvot.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard → API → anon **or** use your publishable key as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → API → service_role (server only) |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (after first deploy) |
| `AZURE_SSO_ENABLED` | `true` (if using Entra) |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | From your `.env` / Azure portal |

**Do not set on Production:**

- `AUTH_DISABLED` (must be unset or `false`)
- `USE_MOCK_DATA` (must be unset or `false`)

Optional staging only: `TENANT_OPS_SEED=true`

Template (no secrets): [`.env.production.example`](../.env.production.example)

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
| Build fails at `migrate deploy` | Set `DATABASE_URL` + `DIRECT_URL` on Vercel; check Supabase password |
| `db: unreachable` on health | Pooler URL wrong or IP banned — use Supabase pooler not localhost |
| Auth callback error | `NEXT_PUBLIC_SITE_URL` + Supabase redirect URL must match |
| `AUTH_DISABLED` in production | Remove var; app blocks prod + auth disabled |

---

## Related

- [`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md)
- [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) — keep local dev as-is
