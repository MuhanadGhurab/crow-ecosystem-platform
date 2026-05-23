# Azure — primary production path

**Status:** Target architecture (M7+) — **full Azure when you choose** (not required yet; no spend until you provision resources).  
**Local dev:** Unchanged — [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) (local Postgres + Supabase Auth + Entra)

Crow Ecosystem’s **production** home is **Microsoft Azure**, not Vercel-hosted Postgres. Vercel remains an **optional interim** public URL only ([`VERCEL_CONNECT.md`](VERCEL_CONNECT.md)).

---

## Target architecture

```text
┌─────────────────────────────────────────────────────────────┐
│  Azure (production)                                         │
│  ├─ App: App Service / Container Apps (Next.js 15)          │
│  ├─ Data: Azure Database for PostgreSQL (Flexible Server)   │
│  ├─ Identity: Microsoft Entra ID (already integrated)       │
│  ├─ Secrets: Key Vault / App Service application settings │
│  └─ Optional: Azure Front Door, App Insights, custom domain │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Developer machine (today)                                  │
│  ├─ Postgres: localhost crow_ecosystem (Prisma)             │
│  └─ Auth: Supabase Auth + Entra provider (same tenant)      │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Azure production | Local dev (now) |
|--------|------------------|-----------------|
| **App** | App Service (Node 20+) or container | `npm run dev` |
| **Postgres** | Azure Flexible Server connection string | `localhost:5432/crow_ecosystem` |
| **Sign-in** | Entra via Supabase Azure provider (or future native Entra) | Same Supabase project + Entra |
| **Migrations** | `npm run db:migrate:deploy` in release pipeline | `db:push` or `db:migrate:deploy` |

Prisma does not change — only **`DATABASE_URL`** / **`DIRECT_URL`** (and app URL) point at Azure instead of localhost.

---

## What to do now (local-first)

1. Keep **Option B** in `.env` — local DB + Supabase Auth keys.
2. **Ignore** Vercel production until you need a throwaway demo URL.
3. Do **not** provision a second Supabase database for Vercel unless you explicitly want that interim path.
4. Continue phases, MEEM seed, smoke on local Postgres.

**Commands (unchanged):**

```powershell
npm run db:push:local    # or db:push
npm run db:seed
npm run db:seed:meem
npm run dev
npm run smoke:phase1
```

---

## Azure go-live checklist (when ready)

### 1. PostgreSQL

1. Azure Portal → **Azure Database for PostgreSQL flexible server**.
2. Create DB (e.g. `crow_ecosystem` or use default `postgres` + `public` schema).
3. Firewall: allow Azure services + your dev IP for migrations.
4. Connection string → App Service settings:
   - `DATABASE_URL` — app runtime (often port 5432 with `?sslmode=require`)
   - `DIRECT_URL` — same host for Prisma migrate (no pooler required on Azure unless you add PgBouncer later)

Encode special characters in passwords (`@` → `%40`).

### 2. App hosting

1. **App Service** (Linux, Node 20) or **Container Apps** with Next.js `output: standalone` if you containerize later.
2. Deploy from GitHub Actions or `az webapp deploy` (zip / Oryx build).
3. Application settings (mirror [`.env.production.example`](../.env.production.example)):

| Setting | Notes |
|---------|--------|
| `DATABASE_URL` / `DIRECT_URL` | Azure Postgres |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Auth project (can stay current ref until you migrate auth) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Key Vault / app setting (secret) |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-app>.azurewebsites.net` or custom domain |
| `AZURE_SSO_ENABLED` | `true` |
| `NEXT_PUBLIC_AZURE_TENANT_ID` | Entra directory ID |

**Do not set:** `AUTH_DISABLED`, `USE_MOCK_DATA`.

### 3. Build / migrate in CI (GitHub Actions → Azure)

Typical release job:

```yaml
# Example shape — adapt to your workflow
- run: npm ci
- run: npm run db:generate
- run: npm run db:migrate:deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    DIRECT_URL: ${{ secrets.DIRECT_URL }}
- run: npm run build
# deploy .next / standalone artifact to App Service
```

Same scripts as local; secrets from Azure / GitHub.

### 4. Entra (production)

| Where | URL |
|-------|-----|
| Azure app registration → Web redirect | `https://<SUPABASE_REF>.supabase.co/auth/v1/callback` (while using Supabase Auth) |
| Supabase → Redirect URLs | `https://<your-azure-host>/auth/callback` |
| `NEXT_PUBLIC_SITE_URL` | Same Azure host |

Details: [`ENTRA_SSO.md`](ENTRA_SSO.md) § Production.

### 5. Verify

```text
GET https://<your-app>/api/health
→ { "ok": true, "db": "ok", "deployReady": true }
```

Then `npm run auth:bootstrap` (against prod Supabase) and optional `db:seed` / `db:seed:meem` against **Azure** Postgres once.

---

## Auth evolution (optional, later)

| Stage | Approach |
|-------|----------|
| **Now** | Supabase Auth + Entra provider (implemented) |
| **Later** | Entra-only sessions (drop Supabase Auth) — larger change; not required for Azure hosting |

Azure as **primary** means **compute + Postgres on Azure**. Supabase can remain **auth-only** until you choose to consolidate identity.

---

## Interim: Vercel (optional)

Use only for a quick public preview before Azure App Service is ready:

- [`VERCEL_CONNECT.md`](VERCEL_CONNECT.md)
- Requires **hosted** Postgres (Supabase pooler) — not localhost
- Not the long-term platform for Crow

---

## Related

- [`M7_CLOUD_DEPLOY.md`](M7_CLOUD_DEPLOY.md) — cloud env matrix (Vercel interim + shared migrate rules)
- [`ENTRA_SSO.md`](ENTRA_SSO.md)
- [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md)
- [`PRISMA_DB_PUSH.md`](PRISMA_DB_PUSH.md)
