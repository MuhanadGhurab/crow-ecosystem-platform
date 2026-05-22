# Crow Ecosystem — Engineering baseline

**Purpose:** Single entry point for frontend structure, backend patterns, environment variables, verification commands, and how to run the app with or without Postgres.

**Related docs:**

| Document | Use when… |
|----------|-----------|
| [`CORE_PRODUCT_FLOW.md`](CORE_PRODUCT_FLOW.md) | Commercial pipeline: Request → Discovery → Blueprint → Go-live |
| [`ROLES_AND_WORKFLOW.md`](ROLES_AND_WORKFLOW.md) | Roles, route guards, department ownership |
| [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) | **Recommended:** local Postgres + Supabase Auth only |
| [`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md) | Supabase paused, `AUTH_DISABLED`, local Postgres |
| [`LOCAL_POSTGRES_SETUP.md`](LOCAL_POSTGRES_SETUP.md) | pgAdmin, `crow_ecosystem`, local `db push` |
| [`PRISMA_DB_PUSH.md`](PRISMA_DB_PUSH.md) | `db push` vs migrate, scripts, expected output |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Tokens, entity themes, UI components |
| [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) | Optional Supabase project restore (not required for UI-only) |

---

## Verification (baseline gate)

Run from repo root (`d:\CYBERCROW`):

| Command | Purpose | Expected |
|---------|---------|----------|
| `npm run typecheck` | `tsc --noEmit` | Exit 0 |
| `npm run lint` | Next.js ESLint | Exit 0 |
| `npm run build` | Production build | Exit 0 (Prisma errors during SSG are OK if DB is paused) |
| `npx prisma validate` | Schema syntax | Exit 0 |
| `npx prisma generate` | Client generation | Exit 0 |
| `npm run db:push` | Sync schema → Postgres (`DIRECT_URL`) | “in sync” or “now in sync” |
| `npm run db:tables` | Count `public` tables | `public_table_count=74` (current schema) |

**Smoke after dev server:** `GET http://localhost:3000/api/health` → `{ ok, db, auth, mockData }`.

---

## npm scripts (reference)

| Script | What it does |
|--------|----------------|
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run db:validate` | `prisma validate` |
| `npm run db:push` | `prisma db push` — sync schema to DB (uses `DIRECT_URL`) |
| `npm run db:push:local` | Push to `localhost:5432/crow_ecosystem` (Windows; see `PRISMA_DB_PUSH.md`) |
| `npm run db:status` | `prisma migrate status` — migration history vs DB |
| `npm run db:tables` | Count tables in `public` schema |
| `npm run db:seed` | Seed demo data (`prisma/seed.ts`) |
| `npm run db:seed:meem` | MEEM lighthouse provision (`prisma/seed-meem.ts`) |
| `npm run db:seed:meem:ops` | MEEM ERP sample data (idempotent) |
| `npm run db:seed:tenant:ops` | Generic tenant ERP ops — `npm run db:seed:tenant:ops -- --tenant=<slug>` |
| `npm run db:generate` | `prisma generate` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:migrate:deploy` | `prisma migrate deploy` (production) |
| `npm run db:studio` | Prisma Studio |
| `npm run env:check` | Print DB/Supabase hosts (no secrets); hybrid sanity warnings |
| `npm run auth:bootstrap` | Create platform admin in Supabase Auth |
| `npm run smoke:phase1` | E2E pipeline smoke (needs live Postgres) |
| `npm run demo` | Free port 3000, start dev, open mock-req demo URL |
| `npm run demo:win` | Windows PowerShell launcher (`scripts/demo-session.ps1`) |
| `npm run demo:meem` | Opens MEEM lighthouse demo (`mock-req-meem`) |
| `npm run demo:stop` | Stop process listening on port 3000 |

---

## Demo session

One-command local demo with mock data and browser open. Port **3000** is the only app port; `npm run dev` and `npm run demo` both free it first (`scripts/free-port.mjs` via `predev` / demo script).

| Entry | Command | What opens |
|-------|---------|------------|
| **Cross-platform (recommended)** | `npm run demo` | `http://localhost:3000/admin/requests/mock-req-001` |
| **Windows native** | `npm run demo:win` or `.\scripts\demo-session.ps1` | Same demo URL |
| **Stop** | `npm run demo:stop` or Ctrl+C | Kills process on port 3000 |

**Requires in `.env`:** `AUTH_DISABLED=true`, `USE_MOCK_DATA=true` (launchers warn if missing).

**UI-only demo paths** (no End button): `/admin/requests/mock-req-001`, `/blueprints/mock-bp-001/overview`, and related mock routes documented below.

---

## Frontend baseline

### Stack

- **Next.js 15** App Router (`src/app/`)
- **React 19**, **TypeScript**, **Tailwind CSS 3**
- Fonts: Plus Jakarta Sans (body), Syne (display) in root `layout.tsx`

### App structure

| Area | Path prefix | Layout / guard |
|------|-------------|----------------|
| Public marketing | `(public)/`, `/login` | `src/app/(public)/layout.tsx` |
| Crow Admin | `/admin/*` | `requirePlatformStaff()` |
| Discovery | `/discovery/[requestId]/*` | Platform staff |
| Blueprint | `/blueprints/[blueprintId]/*` | Platform staff |
| SAREA Studio | `/sarea/*` | Platform staff |
| Tenant CEM | `/[tenant]/*` | `requireTenantAccess(slug)` |
| Tenant CyberCrow | `/[tenant]/cybercrow/*` | Same tenant guard |
| Auth routes | `/auth/*` | Callback / Entra / sign-out |

**Route builders:** `src/lib/routes.ts`  
**Route classification:** `src/lib/auth/route-protection.ts`  
**Middleware:** `src/middleware.ts` → Supabase session refresh

### Design tokens & entity themes

- Global tokens: `src/app/globals.css`, `tailwind.config.ts` (`cc-deep`, `cc-star`, glass cards, etc.)
- Entity color systems: `src/lib/entity-theme.ts` — **CEM** (cyan/teal), **CyberCrow** (violet), **SAREA** (rose/amber)
- Shells: `src/components/ui/area-shell.tsx` (admin, tenant, discovery, blueprint)

See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for full token and component tables.

### Mock pipeline & UI-only data

| File | Contents |
|------|----------|
| `src/lib/mock/pipeline.ts` | Demo implementation requests, pricing estimate, SAREA monthly SAR |
| `src/lib/mock/blueprint.ts` | Mock blueprint `mock-bp-001`, proposal token `mock-proposal-demo` |
| `src/lib/mock/discovery.ts` | Discovery context for `mock-req-002`, `mock-req-003` |
| `src/lib/mock/workspace-summary.ts` | CyberCrow dashboard / workspace stats when DB unavailable |
| `src/lib/mock/env.ts` | `isUseMockData()` — reads `USE_MOCK_DATA=true` |

**`USE_MOCK_DATA=true`** (in `.env`):

- Forces `/admin/requests` to show `MOCK_PIPELINE_REQUESTS`
- Forces `/admin/requests/mock-req-*` detail pages to use mock pricing + blueprint/discovery links
- `/blueprints/mock-bp-001/overview` and `/pricing` load full mock blueprint + `MOCK_PRICING_ESTIMATE`
- `/proposal/mock-proposal-demo` — client proposal (status SENT)
- `/discovery/mock-req-002/*` and `/discovery/mock-req-003/*` — read-only mock discovery profiles

Demo IDs: `mock-req-001` (queue entry), `mock-req-002` (discovery), `mock-req-003` (blueprint build), `mock-bp-001`, `mock-proposal-demo`.

**Lighthouse customer (MEEM Global):** `mock-req-meem` → `mock-bp-meem` → `/meem-global/dashboard` — see [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md). Launch: `npm run demo:meem`.

### UI-only commercial demo path

With `AUTH_DISABLED=true` and `USE_MOCK_DATA=true`:

1. **Queue** — `/admin/requests` → open **Al Noor Holdings** (`mock-req-001`) for lifecycle + pricing estimate.
2. **Discovery** (optional) — `/admin/requests/mock-req-002` → *Open discovery workspace* → steps through organization → summary handoff.
3. **Blueprint** — `/admin/requests/mock-req-003` → *Open blueprint overview* → sticky pricing rail → **Pricing** tab → client proposal link.
4. **Direct URLs** — `/blueprints/mock-bp-001/overview`, `/blueprints/mock-bp-001/pricing`, `/proposal/mock-proposal-demo`.

Discovery forms **do not persist** without Postgres; mocks are read-only for walkthrough.

Without the flag, admin requests still **fall back** to mocks on Prisma errors (catch path).

CyberCrow evidence/identity/sessions pages use `CybercrowMockConsole` (static UI shells).

### AUTH_DISABLED mode

```env
AUTH_DISABLED=true
AUTH_DEV_ROLE=client   # optional — default platform_admin
```

- Implemented in `src/lib/supabase/env.ts` (`isAuthDisabled()`)
- Middleware and guards return a synthetic dev user (`AUTH_DEV_ROLE`: `platform_admin`, `client`, `tenant_admin`, …)
- **Does not** satisfy Prisma — DB-backed pages still need Postgres or mocks
- Pair with `USE_MOCK_DATA=true` for admin pipeline UI without DB

**Client portal demo:** `AUTH_DISABLED=true` + `USE_MOCK_DATA=true` → open `/portal/requests` (lists `mock-req-001`) → detail lifecycle + reference code. Grant live client: `USER_EMAIL=you@co.com CROW_ROLE=client npm run auth:grant-client`.

Never enable in production.

### Run dev (frontend)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Backend baseline

### Data layer

- **Prisma 6** + **PostgreSQL** (`prisma/schema.prisma`)
- Client: `src/lib/db.ts` — runtime uses `DATABASE_URL` (PgBouncer pooler); transactions use `DIRECT_URL` when set
- Schema groups: implementation requests, discovery, blueprints, tenants, CEM, CyberCrow, SAREA (see schema comments)

### Auth

- **Supabase Auth** (`@supabase/ssr`) — session in middleware, server client in `src/lib/supabase/`
- Roles in JWT `app_metadata`: `crow_role`, `tenant_slugs` — see `src/lib/auth/roles.ts`
- Optional **Microsoft Entra** via `/auth/entra` — [`ENTRA_SSO.md`](ENTRA_SSO.md)

### API routes

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/api/health` | `{ ok, db, auth, mockData }` — public; baseline smoke (no login) |
| `POST` | `/api/implementation-requests` | Public intake (Zod-validated); persists when DB up |
| `GET` | `/auth/callback` | OAuth / magic link callback |
| `GET` | `/auth/entra` | Entra SSO start |
| `GET`/`POST` | `/auth/signout` | Sign out |

### Services layer

Business logic lives in **`src/lib/services/*.service.ts`** (Prisma access, no HTTP). Examples:

- `implementation-request.service.ts` — pipeline queue
- `discovery.service.ts`, `blueprint.service.ts` — delivery phases
- `commercial.service.ts`, `pricing.service.ts` — estimates & proposals
- `tenant.service.ts`, `cybercrow-tenant.service.ts`, `sarea.service.ts` — runtime engines

Server Actions: `src/lib/actions/*` (forms, mutations).  
Pure pricing math (no DB): `pricing.service.ts`.

### What needs DB vs mocks

| Needs live Postgres | Works UI-only (mocks / static) |
|-------------------|--------------------------------|
| `/admin/*` lists (except requests with `USE_MOCK_DATA` or catch fallback) | Public marketing, `/pricing`, `/request` form UI |
| `/discovery/*`, `/blueprints/*` (save/load live records) | `/admin/requests`, `/discovery/mock-req-*`, `/blueprints/mock-bp-001/*`, `/proposal/mock-proposal-demo` with `USE_MOCK_DATA` |
| `/[tenant]/*` workspaces | CyberCrow mock console pages |
| `POST /api/implementation-requests` persist | `pricing.service.ts` unit logic |
| `npm run db:seed`, `smoke:phase1` | `npm run typecheck`, `npm run build` (with DB warnings) |

---

## Environment variables

Copy `.env.example` → `.env`. Required for **full stack**:

| Variable | Required for | Notes |
|----------|--------------|-------|
| `DATABASE_URL` | Prisma runtime | Supabase transaction pooler `:6543` + `?pgbouncer=true` |
| `DIRECT_URL` | `db push` / migrate | Session/direct `:5432` |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth | Or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin scripts only | Never expose to browser |

**Optional (local dev):**

| Variable | Effect |
|----------|--------|
| `AUTH_DISABLED=true` | Skip login; synthetic platform admin |
| `USE_MOCK_DATA=true` | Force pipeline/pricing mocks |

Login errors with local Postgres + Supabase Auth: [`LOCAL_POSTGRES_SETUP.md#login-troubleshooting`](LOCAL_POSTGRES_SETUP.md#login-troubleshooting).
| `NEXT_PUBLIC_SITE_URL` | Notifications, links |
| Stripe / Entra | See comments in `.env.example` |
| Resend (`RESEND_API_KEY`) | **Deferred** — Phase Cloud; not required for local / MEEM demo |

### Notifications (pipeline email)

`src/lib/services/notification.service.ts` **always logs** every pipeline event to `platformNotification` (audit trail). Outbound email via [Resend](https://resend.com) is **deferred** until Phase Cloud / production-ready — not required for local or MEEM demo.

| Variable | Required | Effect |
|----------|----------|--------|
| `RESEND_API_KEY` | **Deferred** (production) | Without it: status `skipped`, `errorMessage` = `RESEND_API_KEY not configured` — **expected in dev** |
| `NOTIFICATION_FROM_EMAIL` | Optional | Defaults to `Crow Ecosystem <onboarding@resend.dev>` |
| `PLATFORM_NOTIFY_EMAIL` | Optional | Extra `request_received` copy to platform ops |

**Events:** `request_received`, `discovery_started`, `blueprint_ready`, `tenant_provisioned` — fired from `implementation-request.service` and `pipeline.service`.

**Admin UI:** `/admin/audit` — records all notification rows (including `skipped`) plus cross-tenant CyberCrow audit. Linked from `/admin/overview`. Skipped status does **not** mean the event failed to log.

**Local dev:** `skipped` rows are normal without `RESEND_API_KEY`; dev server logs `[notification] skipped …` to stdout. MEEM baseline: [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) § Audit & notifications.

Supabase free-tier **pause** is optional to fix — see [`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md) and [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md).

---

## Getting started

### A) UI-only (no Postgres)

1. `npm install`
2. Create `.env`:

```env
AUTH_DISABLED=true
USE_MOCK_DATA=true
# Placeholder URLs so Next.js starts (no real DB calls on mock paths)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crow_ecosystem?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/crow_ecosystem?schema=public"
NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
```

3. `npm run dev`
4. Open `/admin/requests`, `/admin/requests/mock-req-001`
5. `curl http://localhost:3000/api/health`

Public pages and pricing math work without a running database.

### B) Full stack (local Postgres)

1. Start PostgreSQL (e.g. Docker or local install)
2. `.env` with local URLs (see `.env.example` bottom section)
3. `npm run db:push` (see [`PRISMA_DB_PUSH.md`](PRISMA_DB_PUSH.md))
4. `npm run db:seed` (MEEM lighthouse: `npm run db:seed:meem` then `npm run db:seed:meem:ops`)
5. Configure Supabase Auth keys (or `AUTH_DISABLED=true` for data-only dev)
6. `npm run dev`
7. Optional: `npm run auth:bootstrap` then assign roles per [`PHASE2_AUTH.md`](PHASE2_AUTH.md)

**Tenant ERP ops (any slug):** `npm run db:seed:tenant:ops -- --tenant=<slug>`. After go-live provision, set `TENANT_OPS_SEED=true` in `.env` (dev/staging) to auto-enrich from blueprint — see [`ERP_ROADMAP.md`](ERP_ROADMAP.md) §8.

### B′) Full stack (Supabase Postgres + Auth)

1. Restore/unpause project in Supabase Dashboard (optional — not billed until you use it)
2. Copy `DATABASE_URL` / `DIRECT_URL` from Project Settings → Database
3. Copy API URL and anon key from Project Settings → API
4. `npm run db:push` (uses `DIRECT_URL` — see [`PRISMA_DB_PUSH.md`](PRISMA_DB_PUSH.md))
5. `npm run db:seed`
6. `npm run dev`

---

## Blockers observed (this baseline run)

- **Supabase Postgres unreachable** at build time (`Can't reach database server` on pooler host) — build still **succeeded**; restore project or use local Postgres for live data.
- **`next lint` deprecated** in Next.js 16 — migration to ESLint CLI optional later.

---

## Files touched for baseline

| File | Change |
|------|--------|
| `docs/BASELINE.md` | This document |
| `src/lib/mock/env.ts` | `isUseMockData()` |
| `src/app/api/health/route.ts` | Health smoke endpoint |
| `.env.example` | `USE_MOCK_DATA` documented |
| `src/app/admin/requests/page.tsx` | Wire `USE_MOCK_DATA` |
| `src/app/admin/requests/[requestId]/page.tsx` | Wire `USE_MOCK_DATA` |
| `src/app/blueprints/[blueprintId]/overview/page.tsx` | Wire `USE_MOCK_DATA` for pricing |
