# Local PostgreSQL setup (pgAdmin)

Use this guide when developing against a **local** Postgres instance instead of Supabase cloud Postgres. The app uses Prisma with `DATABASE_URL` and `DIRECT_URL` from `.env` (never commit `.env`).

**Recommended:** pair local Postgres with **Supabase Auth only** (login stays in Supabase; data stays local) — see **[`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md)**.

## Prerequisites

- PostgreSQL 15+ installed on Windows
- [pgAdmin 4](https://www.pgadmin.org/download/) installed
- Database password for the `postgres` superuser

### Start PostgreSQL on Windows

If connections fail with “connection refused”:

1. Open **Services** (`Win + R` → `services.msc`)
2. Find **postgresql-x64-&lt;version&gt;** (or `PostgreSQL`)
3. Set **Startup type** to Automatic (optional)
4. Click **Start**

Or in PowerShell (as Administrator), replace the service name with yours:

```powershell
Get-Service postgresql*
Start-Service postgresql-x64-16
```

Confirm the server listens on port 5432:

```powershell
Test-NetConnection -ComputerName localhost -Port 5432
```

## 1. Register server in pgAdmin

1. Open pgAdmin → **Servers** → right-click → **Register** → **Server…**
2. **General** tab  
   - **Name:** `Crow Local`
3. **Connection** tab  
   - **Host name/address:** `localhost`  
   - **Port:** `5432`  
   - **Maintenance database:** `postgres`  
   - **Username:** `postgres`  
   - **Password:** your local postgres password  
   - Enable **Save password**
4. Click **Save**

## 2. Create database `crow_ecosystem`

1. Expand **Crow Local** → **Databases**
2. If `crow_ecosystem` is missing: right-click **Databases** → **Create** → **Database…**
3. **Database:** `crow_ecosystem`  
4. **Owner:** `postgres` (default)  
5. Save

## 3. Configure the app

Copy `.env.example` to `.env` if needed, then set **local** URLs (both must point at the same database for `db push`):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/crow_ecosystem?schema=public"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/crow_ecosystem?schema=public"
```

Replace `YOUR_PASSWORD` with the same password used in pgAdmin.

Optional for UI-only work without Supabase auth:

```env
AUTH_DISABLED=true
```

## 4. Prisma `db push` (sync schema → Postgres)

**Full guide:** [`PRISMA_DB_PUSH.md`](PRISMA_DB_PUSH.md)

### What `db push` does here

- Reads **`prisma/schema.prisma`** (~74 models) and creates/updates tables in **`crow_ecosystem`**
- Uses **`DIRECT_URL`** (same host as `DATABASE_URL` for local — both `localhost:5432`)
- Does **not** insert demo rows — run **`npm run db:seed`** after push
- Unlocks Phase 3 persistence: discovery save, implementation requests, blueprints, `GET /api/health` → `"db":"ok"`

### `db push` vs migrations

| Command | When to use |
|---------|-------------|
| **`npm run db:push`** | Local dev — fastest way to match schema (this guide) |
| **`npm run db:migrate:deploy`** | Production/CI when you apply `prisma/migrations/*.sql` only |

`npm run db:status` may list migrations as “not applied” if you only ever used `db push`; tables can still be correct. See [`PRISMA_DB_PUSH.md`](PRISMA_DB_PUSH.md#db-push-vs-migrate-deploy).

### Option A — `.env` points at local (recommended)

Uncomment the **local** block in `.env` (from `.env.example`), then:

```bash
npm run db:validate
npm run db:generate
npm run db:push
npm run db:tables
npm run db:seed
```

**Expected `db push` output**

- Empty DB: `Your database is now in sync with your Prisma schema`
- Already synced: `The database is already in sync with the Prisma schema`
- Then: `public_table_count=74` from `npm run db:tables`

### Option B — push without changing `.env` (Windows)

If `.env` still has Supabase URLs, use the local-only script:

```powershell
$env:CROW_LOCAL_PG_PASSWORD = "your-postgres-password"
npm run db:push:local
npm run db:seed
```

### Optional MEEM lighthouse seed

```bash
npm run db:seed:meem
```

## 5. View tables in pgAdmin

After `prisma db push`:

1. **Crow Local** → **Databases** → **crow_ecosystem** → **Schemas** → **public** → **Tables**
2. Right-click a table (e.g. `implementation_requests`) → **View/Edit Data** → **All Rows**

You can also run **Prisma Studio**: `npm run db:studio`.

## 6. Verify connectivity

With the dev server running (`npm run dev`):

```bash
curl http://localhost:3000/api/health
```

Expect `"db":"ok"` when `DATABASE_URL` is set and Postgres is reachable.

## Login troubleshooting

Local Postgres (`npm run db:seed`, `npm run db:seed:meem`) seeds **Prisma data only**. Sign-in uses **Supabase Auth** (separate from `crow_ecosystem`). Prisma users are not login users.

### Symptoms

| Error on `/login` | Typical cause |
|-------------------|---------------|
| **Invalid login credentials** (email/password) | No matching user in Supabase Auth, or wrong password |
| **Sign-in could not be completed** (`?error=auth_callback`) | Microsoft OAuth failed (Azure provider off/misconfigured in Supabase, redirect URL missing, or code exchange failed) |
| **no Crow access** (`?error=no_role`) | User exists in Supabase but `app_metadata.crow_role` is missing |

Check `.env`: `AUTH_DISABLED` (must be exactly `true` to bypass), `AZURE_SSO_ENABLED`, and that `NEXT_PUBLIC_SUPABASE_URL` is your real project (`https://<ref>.supabase.co`), not the `[PROJECT_REF]` placeholder from `.env.example`.

### Path A — UI + local DB demo (no Supabase login)

Use when you want pgAdmin/MEEM data without creating Supabase users:

```env
AUTH_DISABLED=true
USE_MOCK_DATA=false
```

Keep `DATABASE_URL` / `DIRECT_URL` on local `crow_ecosystem`. Restart `npm run dev`. Middleware treats you as `platform_admin`; MEEM and Prisma routes keep working.

Optional: `USE_MOCK_DATA=true` for pipeline mock fallbacks (see [`BASELINE.md`](BASELINE.md)).

### Path B — Real Supabase email/password login

```env
AUTH_DISABLED=false
USE_MOCK_DATA=false
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Supabase Dashboard:** Authentication → Providers → **Email** enabled; URL configuration → Site URL `http://localhost:3000`, Redirect URLs include `http://localhost:3000/auth/callback`.

**Create platform admin** (PowerShell from repo root):

```powershell
$env:PLATFORM_ADMIN_EMAIL="admin@yourorg.com"
$env:PLATFORM_ADMIN_PASSWORD="choose-a-strong-password"
npm run auth:bootstrap
```

Sign in at `http://localhost:3000/login` with that email and password.

**Grant role to an existing user** (e.g. after Entra first sign-in):

```powershell
$env:USER_EMAIL="you@org.com"
$env:CROW_ROLE="platform_admin"
npm run auth:grant-role
```

Or update metadata only if the user already exists:

```powershell
$env:PLATFORM_ADMIN_EMAIL="you@org.com"
npm run auth:bootstrap
```

### Microsoft Entra (optional)

Requires Path B Supabase keys **plus** Azure provider configured in Supabase (client ID/secret live in Dashboard only — see [`ENTRA_SSO.md`](ENTRA_SSO.md)):

```env
AZURE_SSO_ENABLED=true
NEXT_PUBLIC_AZURE_TENANT_ID=your-directory-tenant-id
```

The login button is hidden unless `AZURE_SSO_ENABLED=true` and `NEXT_PUBLIC_AZURE_TENANT_ID` is set. If the button appears but sign-in fails, fix Supabase **Authentication → Providers → Azure** and redirect URLs before retrying.

To disable Entra locally:

```env
AZURE_SSO_ENABLED=false
```

## Related docs

- [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) — **Option B:** local DB + Supabase Auth (recommended)  
- [`PRISMA_DB_PUSH.md`](PRISMA_DB_PUSH.md) — `db push` vs migrate, commands, expected output  
- [`.env.example`](../.env.example) — Option B hybrid block vs full Supabase Postgres  
- [`docs/BASELINE.md`](BASELINE.md) — `AUTH_DISABLED`, `USE_MOCK_DATA`, dev without DB  
- [`docs/DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md) — UI-only mode when Postgres is off  
- [`docs/PHASE2_AUTH.md`](PHASE2_AUTH.md) — Supabase Auth bootstrap  
- [`docs/ENTRA_SSO.md`](ENTRA_SSO.md) — Azure provider in Supabase Dashboard
