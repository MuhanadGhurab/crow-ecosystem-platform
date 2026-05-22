# Phase test log

Automated and manual gate results for UI-only dev and phase demos.

## Run — 2026-05-22 (UI-only sprint)

**Environment**

| Variable | Value |
|----------|-------|
| `AUTH_DISABLED` | `true` |
| `USE_MOCK_DATA` | `true` |
| Dev URL | http://localhost:3000 |

**Part A — Clean dev**

| Step | Result | Notes |
|------|--------|-------|
| Port 3000 cleared | PASS | Windows `Get-NetTCPConnection` + `Stop-Process` |
| `npm run typecheck` | PASS | |
| `npm run build` | PASS | |
| `npm run dev` (background) | PASS | |
| `GET /api/health` | PASS | `{"ok":true,"db":"ok","auth":"disabled","mockData":true}` |

**Part B — Phase gates**

| Test | Result | Notes |
|------|--------|-------|
| `npm run test:routes` | PASS | 12 public routes → 200 |
| Phase 0: `typecheck` | PASS | |
| Phase 0: `lint` | PASS | |
| Phase 0: `build` | PASS | |
| Phase 0: `prisma validate` | PASS | |
| Phase 2: `/admin/requests/mock-req-001` | PASS | 200 |
| Phase 2: `/blueprints/mock-bp-001/overview` | PASS | 200 |
| Phase 2: `/blueprints/mock-bp-001/pricing` | PASS | 200 |
| Phase 2: `/proposal/mock-proposal-demo` | PASS | 200 |
| Phase 3: `/discovery/mock-req-002/organization` | PASS | 200 |
| Phase 3: `/discovery/mock-req-003/summary` | PASS | 200 |
| Phase 3: `/blueprints/mock-bp-001/identity` | PASS | 200 (new read-only tab) |
| Phase 3: `/blueprints/mock-bp-001/integrations` | PASS | 200 (new read-only tab) |
| `npm run smoke:phase1` | PASS | Live Postgres present; full E2E provision (~2 min). Not required for UI-only. |

**Part C — Implemented this pass (no Postgres required)**

- Discovery mock banner (`DiscoveryMockBanner`) + no-op discovery writes when `USE_MOCK_DATA`
- Blueprint `identity` / `integrations` tabs — read-only from mock discovery
- `cc-btn-primary` `focus-visible` ring
- Mock identity answers on discovery fixtures

---

## How to re-run

```powershell
# UI-only flags in .env
$env:AUTH_DISABLED='true'; $env:USE_MOCK_DATA='true'

npm run typecheck
npm run lint
npm run build
npx prisma validate
npm run dev

# Another terminal
npm run test:routes
curl http://localhost:3000/api/health
```

Demo paths: see [`BASELINE.md`](BASELINE.md) § UI-only commercial demo path.
