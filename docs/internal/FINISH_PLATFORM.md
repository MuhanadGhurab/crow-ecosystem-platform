# Finish the platform (local-first)

**Goal:** Ship a complete, demo-ready Crow Ecosystem on **your machine** before Azure production or optional Vercel.

**Deferred until platform is done:** M7 Azure deploy · Vercel env · Resend · Stripe · M8 second customer.

**Team split:** **Muhanad** — everything below except M5. **Omar (MEEM)** — SAREA acceptance only ([`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md)).

---

## Definition of “platform finished”

| Gate | Evidence |
|------|----------|
| **Build** | `npm run typecheck` · `npm run build` green |
| **Data** | Local Postgres seeded — `db:seed` · `db:seed:meem` · `db:seed:meem:ops` |
| **Migrations** | `npm run db:status` → up to date |
| **Pipeline** | MEEM live E2E pass — [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) |
| **CyberCrow** | M4 rehearsal pass — [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) |
| **Auth** | Real login (`AUTH_DISABLED=false`), RBAC spot-checks in E2E |
| **Smoke** | `npm run smoke:phase1` green |
| **CI** | GitHub `verify` + `postgres-smoke` green on `main` |
| **Notifications** | `RESEND_API_KEY` set · `/admin/audit` shows **`sent`** (not skipped) — [`RESEND_SETUP.md`](RESEND_SETUP.md) |

Not required for “platform finished”: live cloud URL, Omar SAREA sign-off, paid billing.

---

## Your daily env

```env
AUTH_DISABLED=false
USE_MOCK_DATA=false
# DATABASE_URL / DIRECT_URL → localhost crow_ecosystem
# Supabase + Entra keys → your auth project
```

```powershell
cd D:\CYBERCROW
npm run dev
# → http://localhost:3000
```

---

## Execution order (Muhanad)

### Week 1 — Prove the lighthouse (M2 + M4)

| # | Task | Doc / command |
|---|------|----------------|
| 1 | Commit & push pending tooling (`prisma.config.ts`, migrate baseline, docs) | `git status` |
| 2 | Fresh seed | `npm run db:seed` → `db:seed:meem` → `db:seed:meem:ops` |
| 2b | **Resend** | Done — `RESEND_API_KEY` + emails to `mkkaweg4mer@gmail.com` |
| 3 | **MEEM live E2E** (~20 min) | [**Done**] [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) |
| 4 | **M4 CyberCrow rehearsal** (~10 min) | `npm run rehearsal:m4` + [`M4_CYBERCROW_REHEARSAL.md`](M4_CYBERCROW_REHEARSAL.md) |
| 5 | Fix any failures from 3–4 | Bugs only — no new ERP modules |

### Week 2 — Harden (M6 + Phase 9)

| # | Task | Doc / command |
|---|------|----------------|
| 5b | **Resend** — API key + inbox override | [`RESEND_SETUP.md`](RESEND_SETUP.md) · `npm run test:resend` |
| 6 | `npm run smoke:phase1` on clean local DB | [`M6_AUTH_SAAS.md`](M6_AUTH_SAAS.md) |
| 7 | Confirm CI green | Push → GitHub Actions `verify` + `postgres-smoke` |
| 8 | Entra dev path smoke | `/login` → Microsoft → `/auth/callback` |
| 9 | Optional: dept chips on any remaining request UIs | [`PHASES.md`](PHASES.md) Phase 8 |

### Parallel — Customer (not blocking “platform done”)

| # | Task | Owner |
|---|------|--------|
| — | Share SAREA checklist with Omar | [`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md) · M5 |

### Later — Full Azure (M7, when you’re ready)

**Not now** — no Azure bill until you create Postgres + App Service. When go-live:

| # | Task | Doc |
|---|------|-----|
| — | Azure App Service + PostgreSQL | [`AZURE_DEPLOY.md`](AZURE_DEPLOY.md) |
| — | Entra prod redirects on Azure URL | [`ENTRA_SSO.md`](ENTRA_SSO.md) |

---

## What’s already done (don’t redo)

- M1 Platform foundation — **100%**
- M3 ERP E1–E9 — **~92%** (MEEM demo chain)
- M4 CyberCrow E10, GRC, auditor, logistics audit — **100%**
- Client portal + Entra integration — Phase 7b
- RBAC matrix + MEEM role seeds — [`RBAC.md`](RBAC.md)
- Production auth guard (`AUTH_DISABLED` blocked in prod)
- CI postgres-smoke job

---

## Open backlog (post-platform, revenue-gated)

| Item | When |
|------|------|
| E11–E14 ERP depth, retail/healthcare packs | After MEEM revenue / second customer |
| M8 Stripe + `onboard:tenant` on staging | M8 |
| Resend live email | Azure go-live or customer date |
| Homepage case studies / CMS | Phase 1 polish |
| Vercel interim URL | Optional anytime — not primary |

---

## Quick verification (run anytime)

```powershell
npm run typecheck
npm run build
npm run db:status
npm run env:check
npm run smoke:phase1
```

---

## Related

- [`PROJECT_STATUS.md`](PROJECT_STATUS.md) — % and blockers
- [`MILESTONES.md`](MILESTONES.md) — M1–M8 map
- [`PHASES.md`](PHASES.md) — full phase checklist
- [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) — lighthouse script
