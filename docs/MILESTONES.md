# CYBERCROW — delivery milestones

**Purpose:** Executive milestone map aligned with [`PHASES.md`](PHASES.md) and [`ERP_ROADMAP.md`](ERP_ROADMAP.md). Percentages are **honest** — not marked 100% without rehearsal or production evidence.

**Status detail:** [`PROJECT_STATUS.md`](PROJECT_STATUS.md) · **Team:** [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md)

---

## Milestone index

| ID | Milestone | Phases / backlog | Owner | % | Status |
|----|-----------|------------------|-------|---|--------|
| **M1** | Platform foundation | 0, 1, 2, 7b | Muhanad | **100%** | Done |
| **M2** | MEEM lighthouse pipeline | MEEM, 3, 4 (+ RBAC) | Muhanad · MEEM (Omar) E2E sign-off | **~88%** | Live rehearsal pending |
| **M3** | Modular ERP chain | 5, E1–E9 | Muhanad | **~92%** | Done for MEEM demo |
| **M4** | CyberCrow operations | 6, E10 | Muhanad | **~70%** | In progress |
| **M5** | MEEM SAREA acceptance | 7, E11 | **MEEM (Omar)** · Muhanad (hooks) | **~25%** | Customer acceptance — not Crow dev |
| **M6** | Auth hardening & SaaS prep | 8, 9 | Muhanad | **~30%** | Auditor role shipped; migrate/E2E open |
| **M7** | Cloud & production | Cloud, Resend | Muhanad | **~5%** | Documented; deploy deferred |
| **M8** | Paid customer / full MEEM ERP | Post-revenue | Product | **deferred** | Until paying / SaaS commitment |

---

## M1 — Platform foundation

**Scope:** Docs baseline, design system, commercial pipeline UI, unified identity + client portal.

| Evidence | |
|----------|--|
| `npm run typecheck`, `lint`, `build` | [`BASELINE.md`](BASELINE.md) |
| Public routes + `/request` wizard | Phase 1–2 exit criteria |
| `/portal/requests`, Entra story | Phase 7b |

---

## M2 — MEEM lighthouse pipeline

**Scope:** Blueprint → discovery → readiness → go-live → `meem-global` tenant; RBAC matrix + MEEM role seed.

| Done | Open |
|------|------|
| `prisma/seed-meem.ts`, `db:seed:meem:ops` | Live E2E pass — [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) |
| Readiness + `pipeline.service` | `/admin/audit` checklist #12 rehearsed on live DB |
| [`RBAC.md`](RBAC.md), permissions + middleware | MEEM (Omar) SAREA persona acceptance (M5) |

---

## M3 — Modular ERP chain

**Scope:** Registry, tenant-ops seed, de-MEEM-gate, finance/reports, procurement, MEEM module keys (E1–E9).

| Done | Open |
|------|------|
| `erp-module-registry`, `tenant-ops-seed.service` | E11 SAREA ERP nav profiles (Muhanad config → Omar accepts) |
| Finance, reports, procurement routes + data | E12 retail/healthcare packs |
| MEEM sales/inventory/warehouse/logistics chain | E14 recorded demo in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) |

**Verification:** typecheck, build, seeds, `verify-logistics-audit` green.

---

## M4 — CyberCrow operations

**Scope:** Logistics audit (E10), data-backed tenant dashboard, GRC summary, auditor read-only UI, platform `/admin/audit` strip.

| Done | Open |
|------|------|
| E10 logistics → `cybercrowAuditLog` | Entra ops narrative on tenant settings + login |
| `/[tenant]/cybercrow/grc` data-backed | GRC bulk / deeper NCA control mapping |
| `auditor_readonly` + tenant CyberCrow paths | Platform risk widgets beyond MEEM counts |

---

## M5 — MEEM SAREA acceptance

**Scope:** Persona/layout/nav validation on `meem-global` dashboard — **customer-side**.

**Owner:** MEEM (Omar). **Crow:** Muhanad ships `/sarea/*` studio + `sarea-runtime.service` seeds.

See [`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md) · [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) flow #8.

---

## M6 — Auth hardening & SaaS prep

**Scope:** Production auth checklist, Postgres without mocks, migrate baseline.

| Done | Open |
|------|------|
| `auditor_readonly` crow_role (overlap M4) | Dept chips fully DB-driven on requests |
| Client role + portal | `AUTH_DISABLED` blocked in production checklist |
| MEEM permission seed | `smoke:phase1` on clean DB; MEEM without `USE_MOCK_DATA` |

---

## M7 — Cloud & production

**Scope:** Vercel, Supabase prod, Entra prod redirects, Resend, `prisma migrate deploy` in CI.

**Deferred by design** until first paying customer or explicit go-live date. Notification **logging** works; **send** requires `RESEND_API_KEY` ([`PHASES.md`](PHASES.md) § Phase Cloud).

---

## M8 — Paid customer / full MEEM ERP

**Deferred** until revenue / SaaS commitment. MEEM “full ERP” depth (multi-entity, production integrations) is **not** the current Crow sprint — lighthouse demo proves modular chain only.

---

## Recommended track — Muhanad (implementation)

1. **Close M4** — Entra settings/login ops copy; rehearse GRC + auditor paths on live MEEM seed.  
2. **Close M2** — Run [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) once on live Postgres; confirm `/admin/audit` logistics filter + notifications.  
3. **M6** — `smoke:phase1`, migrate baseline PR, production auth checklist.  
4. **M7** — Phase Cloud env matrix when customer date is set.  
5. **Hand off M5** — Omar SAREA acceptance checklist; Muhanad only adjusts runtime from feedback.

---

## Cross-references

| Topic | Document |
|-------|----------|
| Phase checkboxes | [`PHASES.md`](PHASES.md) |
| ERP backlog E1–E14 | [`ERP_ROADMAP.md`](ERP_ROADMAP.md) |
| MEEM demo | [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) |
| Go-live order | [`GO_LIVE_PIPELINE.md`](GO_LIVE_PIPELINE.md) |

---

*May 2026 — milestone map after E1–E10 ERP backlog and Phase 6 CyberCrow slice.*
