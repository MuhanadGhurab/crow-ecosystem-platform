# M6 — Auth hardening & SaaS prep

**Scope:** Production auth guard, repeatable Postgres baseline, smoke verification, Supabase `app_metadata` RBAC. **Out of scope:** MEEM full E2E ([`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md)), Vercel/Resend (M7).

**Related:** [`RBAC.md`](RBAC.md) · [`HYBRID_LOCAL_DB_SUPABASE_AUTH.md`](HYBRID_LOCAL_DB_SUPABASE_AUTH.md) · [`MILESTONES.md`](MILESTONES.md) M6

**Progress (~90%):** Production `AUTH_DISABLED` guard · `npm run gate:production-auth` + CI `production-gate` job · **DB-driven dept chips** (admin + portal) · **GitHub Actions `postgres-smoke`** (`db:seed` + `smoke:phase1` + `onboard:tenant` ci-acme).

---

## CI — Postgres smoke (GitHub Actions)

Workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

| Job | Steps |
|-----|--------|
| `verify` | `audit:src`, `typecheck`, `build` |
| `production-gate` | `npm run gate:production-auth` |
| `postgres-smoke` | Postgres 16 → `db:migrate:deploy` → `db:seed` → `smoke:phase1` → `onboard:tenant` (ci-acme) |

Env: `USE_MOCK_DATA=false`, `AUTH_DISABLED=true`, local `DATABASE_URL` to service.

**Local mirror:**

```bash
npm run db:migrate:deploy
npm run smoke:phase1
# Optional health (dev server required):
# SMOKE_CHECK_HEALTH=1 SMOKE_BASE_URL=http://localhost:3000 npm run smoke:phase1
```

---

## Production auth guard

> **Release order:** Ship the Phase 1 public styling pass (homepage Crow bento, marketing polish) before enabling a production deploy with auth enforced (`AUTH_DISABLED` unset/false).

`AUTH_DISABLED=true` is **rejected** when `NODE_ENV=production`:

- Server startup (`instrumentation.ts`)
- Middleware on every protected request
- `npm run env:check` exits non-zero

**Error (example):** `AUTH_DISABLED=true is not allowed when NODE_ENV=production. Remove AUTH_DISABLED or use a non-production NODE_ENV for UI-only demos.`

**Production checklist:** unset `AUTH_DISABLED` or set `AUTH_DISABLED=false`; configure Supabase Auth keys; use real `crow_role` in `app_metadata` (table below).

---

## Supabase `app_metadata` — platform roles

Set via Dashboard → Authentication → Users → user → **App Metadata** (or `npm run auth:grant-role` / `auth:grant-tenant`).

| `crow_role` | `tenant_slugs` | Access |
|-------------|----------------|--------|
| `platform_admin` | _(omit or `[]`)_ | Full `/admin/*`, all tenants, go-live |
| `sales` | _(omit)_ | `/admin/requests`, blueprint read; **no** audit, go-live, SAREA studio |
| `auditor_readonly` | `["meem-global", …]` | `/admin/audit`, blueprint read, tenant CyberCrow read-only |
| `client` | _(omit)_ | `/portal/*` only |
| `tenant_admin` | `["meem-global"]` | Full CEM + CyberCrow for listed slugs |
| `tenant_user` | `["meem-global"]` | Limited CEM writes (e.g. logistics view) |

**Example JSON (auditor on MEEM):**

```json
{
  "crow_role": "auditor_readonly",
  "tenant_slugs": ["meem-global"]
}
```

**CLI grants:**

```bash
USER_EMAIL=you@co.com CROW_ROLE=platform_admin npm run auth:bootstrap
USER_EMAIL=auditor@co.com CROW_ROLE=auditor_readonly npm run auth:grant-role
USER_EMAIL=auditor@co.com TENANT_SLUG=meem-global npm run auth:grant-tenant
```

---

## Migrate baseline (clean DB, no reset)

Use **`prisma migrate deploy`** — applies ordered SQL under `prisma/migrations/` without wiping data.

### 1. Fresh local Postgres database

```bash
# Create empty DB (example: crow_ecosystem) — see LOCAL_POSTGRES_SETUP.md
cp .env.example .env
# Set DATABASE_URL + DIRECT_URL to local Postgres
```

### 2. Apply migrations

```bash
npm run db:generate
npm run db:migrate:deploy
npm run db:status
```

Expected: all migrations **applied**, including:

| Migration | Focus |
|-----------|--------|
| `20260515150000_init_crow_ecosystem` | Core schema |
| `20260519120000_phase5_hr_crm_phase6_notifications` | HR/CRM, notifications |
| `20260519180000_phase7_commercial_proposal` | Commercial proposal |
| `20260522120000_client_portal_identity` | Portal identity |
| `20260522140000_phase5_tenant_sales` | Sales |
| `20260522150000_phase5_tenant_inventory` | Inventory |
| `20260522160000_phase5_tenant_warehouse` | Warehouse |
| `20260522170000_phase5_tenant_finance` | Finance |

**Do not** document or run `prisma migrate reset` on shared/staging DBs.

### 3. Seed MEEM lighthouse (optional)

```bash
npm run db:seed
npm run db:seed:meem
npm run db:seed:meem:ops
TENANT_SLUG=meem-global npm run cybercrow:backfill-seed
```

### 4. Verify

```bash
npm run env:check
npm run typecheck
npm run build
npm run smoke:phase1
```

`smoke:phase1` runs pipeline E2E against Postgres; optional `SMOKE_CHECK_HEALTH=1` hits `/api/health` when dev server is up.

---

## M6 shipped / open

| Item | Status |
|------|--------|
| `AUTH_DISABLED` blocked in production | Shipped |
| `smoke:phase1` + optional health preflight | Shipped |
| Migrate folder + deploy doc (this file) | Shipped |
| `app_metadata` RBAC table | Shipped |
| Dept chips DB-driven on all request surfaces | Shipped |
| Portal `/portal/requests` DeptChips | Shipped |
| MEEM path without `USE_MOCK_DATA` in CI | Open (MEEM seed optional in smoke) |
| `prisma migrate deploy` in CI/CD (M7) | Shipped in GitHub Actions |

---

*May 2026 — M6 first slice after M4 CyberCrow rehearsal.*
