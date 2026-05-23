# Vercel — connect this repo (staging / interim prod)

**Repo:** `MuhanadGhurab/crow-ecosystem-platform`  
**Full matrix:** [`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md) · **P2 checklist:** [`P2_STAGING_PREP.md`](P2_STAGING_PREP.md)

---

## Step 1 — Import project

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository.
2. Select **crow-ecosystem-platform**.
3. Framework: **Next.js** (auto).
4. Root: `.`
5. Do **not** override build/install unless debugging — `vercel.json` already sets:

   - `installCommand`: `npm ci`
   - `buildCommand`: `node scripts/vercel-build-guard.mjs && npm run db:generate && npm run db:migrate:deploy && npm run build`

**Node.js:** `package.json` → `"engines": { "node": "24.x" }` (matches CI and `.nvmrc`). Set Vercel **Project Settings → General → Node.js Version** to **24.x** so it aligns with the repo.

---

## Step 2 — Environment variables

Settings → Environment Variables → **Production** (and Preview if desired).

Paste from [`.env.production.example`](../.env.production.example). Minimum:

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Supabase → Database → **Transaction pooler** :6543 + `?pgbouncer=true` |
| `DIRECT_URL` | Supabase → **Session pooler** :5432 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role (secret) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` after first deploy |

**Build guard:** `scripts/vercel-build-guard.mjs` **rejects localhost** `DATABASE_URL` — Vercel cannot reach your PC.

---

## Step 3 — Deploy

1. Deploy from `main` (or push to trigger).
2. Copy deployment URL → set `NEXT_PUBLIC_SITE_URL` → redeploy if first deploy had placeholder.

---

## Step 4 — Verify

```bash
curl https://YOUR-APP.vercel.app/api/health
```

Then seed MEEM on staging DB (from local machine with staging `DATABASE_URL`):

```bash
npm run db:seed && npm run db:seed:meem && npm run db:seed:meem:ops
USER_EMAIL=you@example.com CROW_ROLE=platform_admin npm run auth:bootstrap
```

---

## Troubleshooting

| Build error | Fix |
|-------------|-----|
| **`Can't reach database server at localhost:5432`** | **Vercel `DATABASE_URL` is your local PC URL.** Replace with Supabase pooler URLs from `.env.staging` — not `crow_ecosystem@localhost`. |
| Build runs `npm run db:generate && ...` without `vercel-build-guard` | Vercel **Project Settings → Build** may override `vercel.json`. Clear override or use latest `main` with guard in `buildCommand`. |
| `DATABASE_URL points at localhost` | Replace with Supabase pooler URLs in Vercel env |
| `DATABASE_URL is not set` | Add env vars; redeploy |
| Migrate P3018 / missing tables | One-time `db push` on staging or fix init migration — see CI `db push` pattern |
| `AUTH_DISABLED` in production | Remove from Vercel env |
| OAuth redirect mismatch | Set `NEXT_PUBLIC_SITE_URL` + Supabase redirect allowlist |

---

*Referenced by `vercel-build-guard.mjs` and `M7_CLOUD_DEPLOY.md`.*
