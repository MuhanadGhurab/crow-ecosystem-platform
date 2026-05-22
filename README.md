# Crow Ecosystem Platform

**Crow Ecosystem** is a multi-tenant adaptive enterprise operating platform.

**Golden rule:** Discovery understands Ã¢â€ â€™ Blueprint defines Ã¢â€ â€™ CEM runs Ã¢â€ â€™ CyberCrow protects Ã¢â€ â€™ SAREA adapts.

## Repository structure

```
CYBERCROW/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ src/                 # Next.js 15 app (see src/STRUCTURE.md)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ app/             # Routes: public, admin, discovery, blueprint, portal, [tenant]
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ components/      # public Ã‚Â· portal Ã‚Â· admin Ã‚Â· tenant Ã‚Â· discovery Ã‚Â· blueprint Ã‚Â· pipeline Ã‚Â· studio Ã‚Â· ui
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ lib/             # auth Ã‚Â· constants Ã‚Â· domains Ã‚Â· mock Ã‚Â· services
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ docs/                # Product & engineering docs (start: docs/README.md)
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ customers/       # Lighthouse demos (MEEM Global)
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ archive/         # Historical phase docs
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ scripts/             # dev, demo, auth grants, smoke
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ prisma/              # Schema & seeds
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ archive/HTML_proc/   # Legacy static prototype (reference only)
```

## Quick start

**UI-only (no Postgres):** copy `.env.example` Ã¢â€ â€™ `.env`, set `AUTH_DISABLED=true` and `USE_MOCK_DATA=true`, then [`docs/BASELINE.md`](docs/BASELINE.md) Ã‚Â§ A.

```bash
cp .env.example .env
npm install
npm run dev
```

| Demo | Command | Opens |
|------|---------|--------|
| Generic mock | `npm run demo` | `/admin/requests/mock-req-001` |
| **MEEM Global** | `npm run demo:meem` | `/admin/requests/mock-req-meem` |

**Lighthouse customer:** [MEEM Holding Logistics](docs/customers/MEEM_GLOBAL.md) Ã¢â‚¬â€ blueprint Ã¢â€ â€™ `/meem-global/dashboard`.

**Full stack:** configure `DATABASE_URL`, `DIRECT_URL`, Supabase keys Ã¢â€ â€™ `npx prisma db push` Ã¢â€ â€™ `npm run db:seed` Ã¢â€ â€™ [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).

## Stack

- Next.js 15 Ã‚Â· React 19 Ã‚Â· TypeScript Ã‚Â· Tailwind
- PostgreSQL (Supabase) Ã‚Â· Prisma
- Supabase Auth Ã‚Â· Microsoft Entra ID (optional)

## Status & roadmap

| Doc | Purpose |
|-----|---------|
| [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) | **% complete, blockers, next 5 actions** |
| [`docs/MILESTONES.md`](docs/MILESTONES.md) | **Delivery milestones** (M1-M8) |
| [`docs/PHASES.md`](docs/PHASES.md) | Phases 0-10 + MEEM + Cloud -> production |
| [`docs/PLATFORM_STATUS.md`](docs/PLATFORM_STATUS.md) | Routes & services inventory |
| [`docs/BASELINE.md`](docs/BASELINE.md) | Verify, env, mock paths |

## Useful commands

```bash
npm run typecheck && npm run build
npm run smoke:phase1      # E2E pipeline (needs Postgres)
npm run auth:grant-tenant # Link user to tenant slug
npm run demo:meem         # MEEM lighthouse demo
```


## GitHub

Private repo recommended for first push. Setup: [`docs/GITHUB_SETUP.md`](docs/GITHUB_SETUP.md). Roadmap milestones: [`docs/MILESTONES.md`](docs/MILESTONES.md).

**Lighthouse demo:** MEEM Global (`npm run demo:meem`) is the reference customer pipeline â€” not production multi-tenant data.

## Documentation

Full index: [`docs/README.md`](docs/README.md)

## Legacy prototype

Static HTML MVP: [`archive/HTML_proc/`](archive/HTML_proc/) Ã¢â‚¬â€ not connected to Supabase.

## Founder

Muhanad Ghurab Ã¢â‚¬â€ IT specialist with a cybersecurity focus.
