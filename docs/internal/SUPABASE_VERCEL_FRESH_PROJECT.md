# Fresh Supabase via Vercel integration (unified cloud)

Use this when you **Create** Supabase from Vercel → **Storage → Install Supabase** and want **one** Supabase project for **Auth + Postgres** on production (replacing the old ref `qnujbwfztmrmsvkugvot`).

**Keep local dev as Option B?** You can still use local `crow_ecosystem` for data and only point Supabase env vars at the **new** project for login. Production on Vercel uses the integration’s pooler URLs for both.

---

## Phase 1 — Create on Vercel

1. Vercel → **crow-ecosystem-platform** → **Storage** → **Install Supabase**.
2. Region: e.g. **Europe Central (Zurich)** (match what you picked).
3. Plan: **Free** → **Create**.
4. Wait until the integration finishes and env vars appear on the Vercel project.

Write down the **new project ref** (subdomain before `.supabase.co`):

```text
NEW_REF=________________________
```

Find it: Vercel → **Storage** → your Supabase store → **Open in Supabase**, or Supabase Dashboard URL  
`https://supabase.com/dashboard/project/<NEW_REF>`.

---

## Phase 2 — Verify Vercel env (auto-filled + fixes)

Vercel → **Settings → Environment Variables → Production**. Confirm or set:

| Variable | Expected |
|----------|----------|
| `DATABASE_URL` | `...pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `...pooler.supabase.com:5432/postgres` (integration may name this differently — add if missing) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<NEW_REF>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or publishable | From new project API keys |
| `SUPABASE_SERVICE_ROLE_KEY` | From new project (secret) |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-app>.vercel.app` |
| `AZURE_SSO_ENABLED` | `true` |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | Same Azure directory as before |

**Remove** if present: `AUTH_DISABLED`, `USE_MOCK_DATA`.

**Password in URL:** encode `@` as `%40`.

**Do not** leave `localhost` in `DATABASE_URL` / `DIRECT_URL` on Vercel.

If `DIRECT_URL` is missing after integration, copy **Session pooler** from Supabase → **Project Settings → Database → Connection string**.

---

## Phase 3 — Update local `.env` (auth at minimum)

Copy from Vercel (or Supabase Dashboard → **API**) into `D:\CYBERCROW\.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<NEW_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<new publishable or anon key>
SUPABASE_SERVICE_ROLE_KEY=<new service role secret>

# Optional: keep local Postgres for dev data (Option B)
DATABASE_URL="postgresql://postgres:%401123@localhost:5432/crow_ecosystem?schema=public"
DIRECT_URL="postgresql://postgres:%401123@localhost:5432/crow_ecosystem?schema=public"
```

To develop against **cloud** Postgres locally instead, set `DATABASE_URL` / `DIRECT_URL` to the same pooler strings as Vercel (6543 + 5432).

Run:

```powershell
npm run env:check
```

---

## Phase 4 — Microsoft Entra (Azure)

Same Azure app registration; **add** the new Supabase callback (keep or remove old ref as you prefer).

| Where | URL |
|-------|-----|
| Azure → App registration → **Web redirect URI** | `https://<NEW_REF>.supabase.co/auth/v1/callback` |

Supabase (**new** project) → **Authentication → Providers → Azure**:

- Re-enter **Client ID** and **Secret** (from Azure; same app is fine).

Supabase → **Authentication → URL configuration**:

```text
http://localhost:3000/auth/callback
http://localhost:3002/auth/callback
https://<your-vercel-app>.vercel.app/auth/callback
```

Site URL (dev): `http://localhost:3000`

Details: [`ENTRA_SSO.md`](ENTRA_SSO.md)

---

## Phase 5 — Database on the new project

After first Vercel deploy (or from your PC with cloud URLs):

```powershell
# Optional: test full Vercel build chain against new DB
$env:SIM_DATABASE_URL="<transaction pooler URI>"
$env:SIM_DIRECT_URL="<session pooler URI>"
npm run simulate:vercel-build

# Seed production DB once (use cloud URLs in SIM_* or temporary .env)
npm run db:seed
npm run db:seed:meem
npm run auth:bootstrap
```

Users and roles from the **old** Supabase project are **not** migrated automatically — bootstrap admin again on the new project.

---

## Phase 6 — Deploy & verify

1. Push latest repo (migrate baseline, `prisma.config.ts`, build guard):

   ```powershell
   git add prisma.config.ts scripts/ package.json package-lock.json docs/
   git commit -m "chore: Prisma config and Vercel/Supabase deploy tooling"
   git push
   ```

2. Vercel → **Redeploy** (Production).

3. Open `https://<your-app>.vercel.app/api/health` → expect:

   ```json
   { "ok": true, "db": "ok", "auth": "configured", "deployReady": true }
   ```

4. Sign in at `/login` (email or Microsoft).

---

## Phase 7 — Cleanup (optional)

| Item | Action |
|------|--------|
| Old Supabase `qnujbwfztmrmsvkugvot` | Pause/delete when no longer needed |
| Docs with old ref | Update `scripts/print-vercel-env-template.ps1` `-ProjectRef` |
| Archive Entra doc | Copy [`archive/ENTRA_SSO_SETUP_qnujbwfztmrmsvkugvot.md`](archive/ENTRA_SSO_SETUP_qnujbwfztmrmsvkugvot.md) pattern for `<NEW_REF>` |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Login works, DB errors on Vercel | `DATABASE_URL` / `DIRECT_URL` not from **new** project |
| Entra fails | Azure redirect must be **new** `https://<NEW_REF>.supabase.co/auth/v1/callback` |
| Build `localhost` | Remove local URLs from Vercel env |
| P3005 on build | `migrate-deploy.mjs` baselines after `db push`; or empty new DB runs migrations cleanly |

---

## Related

- [`VERCEL_CONNECT.md`](VERCEL_CONNECT.md) — manual pooler paste (same project ref)
- [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) — local DB + Supabase auth only
- [`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md)
