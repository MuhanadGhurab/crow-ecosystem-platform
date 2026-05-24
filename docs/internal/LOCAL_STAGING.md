# Local staging (default until Azure prod)

**Now:** App on **localhost:3000** · DB + auth on **Supabase** (project `wbwnsnd…`) · MEEM seeded.  
**Later:** **Azure** App Service + Azure PostgreSQL ([`AZURE_DEPLOY.md`](AZURE_DEPLOY.md)).  
**Skip for now:** Vercel, tunnels (optional for remote Omar).

---

## One-time Supabase Auth (localhost)

Project **wbwnsndcxrgyqwppurms** → **Authentication → URL configuration**:

| Field | Value |
|-------|--------|
| Site URL | `http://localhost:3000` |
| Redirect URLs | `http://localhost:3000/auth/callback` |

---

## Daily workflow

```powershell
cd D:\CYBERCROW
npm run staging:local
```

Alias for `staging:host:build` — uses **`.env.staging`** (hosted DB, not `.env` localhost Postgres).

| URL | Purpose |
|-----|---------|
| http://localhost:3000/login | Sign in |
| http://localhost:3000/meem-global/dashboard | MEEM lighthouse |
| http://localhost:3000/api/health | `deployReady: true` |

**Admin:** `mkkaweg4mer@gmail.com` / `Mkk@1123` · role `platform_admin`

Print MEEM + Omar URLs:

```powershell
npm run staging:runbook
```

---

## MEEM E2E + Omar sign-off

Use **staging IDs** (after `db:seed:meem` on Supabase):

| Flow | Path |
|------|------|
| Admin request | `/admin/requests/{requestId}` |
| Discovery experience | `/discovery/{requestId}/experience` |
| Blueprint SAREA | `/blueprints/{blueprintId}/sarea` |
| SAREA preview | `/sarea/preview` |
| Tenant dashboard | `/meem-global/dashboard` |
| CyberCrow | `/meem-global/cybercrow/dashboard` |
| Admin audit | `/admin/audit?category=logistics&tenant=meem-global` |

Omar checklist: [`customers/OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md`](customers/OMAR_SIGNOFF_DISCOVERY_BLUEPRINT_SAREA.md)

---

## Env files

| File | Use |
|------|-----|
| **`.env.staging`** | **Local host + Supabase cloud** (MEEM lighthouse, Omar) |
| `.env` | Dev hybrid: local Postgres + Supabase auth (different project) |
| `.env.production.example` | Azure prod template (future) |

**Important:** `npm run staging:*` loads **`.env.staging`**, not `.env`.

---

## Commands

| Script | Purpose |
|--------|---------|
| `npm run staging:local` | Build + start on :3000 |
| `npm run staging:host` | Start only (after build) |
| `npm run staging:ready` | DB + env preflight |
| `npm run staging:runbook` | Print localhost MEEM/Omar URLs |
| `npm run meem:ids` | Request/blueprint IDs (use `--env-file=.env.staging`) |

---

## Optional: remote browser (tunnel)

Only if Omar is not on your machine. Install [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) or fix npm TLS (`node --use-system-ca`), then `npm run staging:tunnel`. See [`STAGING_WITHOUT_VERCEL.md`](STAGING_WITHOUT_VERCEL.md).

---

## Roadmap

```
Local host + Supabase (now) → Azure prod (M7) — no Vercel required
```
