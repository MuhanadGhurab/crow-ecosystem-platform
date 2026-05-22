# Team ownership — Crow Ecosystem Platform

**Purpose:** Single source of truth for who owns which layers of the product. Prevents scope drift (e.g. treating Omar as a Crow engineer or assigning MEEM SAREA acceptance to the CYBERCROW repo).

**Related:** [`ROLES_AND_WORKFLOW.md`](ROLES_AND_WORKFLOW.md) (route matrix), [`PHASES.md`](PHASES.md) (delivery phases), [`MILESTONES.md`](MILESTONES.md) (M1–M8).

---

## Muhanad — platform architect & full-stack owner

Muhanad is the **primary architect and full-stack owner** of the Crow Ecosystem Platform and **CyberCrow** product in this repository.

| Area | Ownership |
|------|-----------|
| Overall platform architecture | ● |
| Prisma schema & PostgreSQL | ● |
| APIs & server actions | ● |
| Discovery Engine | ● |
| Enterprise Blueprint Engine | ● |
| CEM runtime (tenant ops, modules, HR/CRM, structure) | ● |
| CyberCrow security orchestration | ● |
| Provisioning pipeline & go-live lifecycle | ● |
| Lifecycle orchestration (`pipeline.service`, request status) | ● |
| Integrations (discovery → blueprint → tenant) | ● |
| Tenant logic, isolation, workspace services | ● |
| Platform services (`/admin/*`, commercial, pricing) | ● |
| Backend ↔ frontend integration (data on real routes) | ● |
| Infrastructure direction (Supabase, Entra, Vercel, env matrix) | ● |
| Broker / cloud / security narrative (auditor UI, GRC data) | ● |

**Delivers:** the ecosystem **intelligence and orchestration** — Request → Discovery → Blueprint → Go-live → live tenant with three engines; CyberCrow runtime and platform audit surfaces.

---

## Omar — MEEM Holding (customer SAREA liaison)

**Omar is not on the CYBERCROW development team.** He works **inside MEEM Holding** and supports **MEEM Global** as their **SAREA experience owner** on the **customer side**.

| Area | Ownership |
|------|-----------|
| Persona validation (executive, ops, HR, logistics, frontline) | ● (MEEM acceptance) |
| Adaptive dashboard expectations vs discovery brief | ● |
| MEEM demo sign-off for layout/nav/widget density | ● |
| Workshop feedback on `/meem-global/dashboard` | ● |

**Does not own:** this repo’s Prisma schema, provision pipeline, `/admin/*`, CyberCrow GRC logic, `auditor_readonly` wiring, or implementation tasks in `PHASES.md` owner columns.

**Crow delivers for Omar to validate:** SAREA runtime/config, seeded personas, platform hooks (`/sarea/*` studio, blueprint SAREA tab). Omar validates **how MEEM roles should feel**; Muhanad ships **runtime and data**.

See [`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md) for MEEM-side acceptance criteria (not Crow engineer scope).

---

## Quick routing for tasks

| If the task is about… | Owner |
|------------------------|--------|
| Readiness gate, go-live, `pipeline.service` | Muhanad |
| MEEM seed, `prisma/seed-meem.ts`, `db:seed:meem:ops`, tenant slug | Muhanad |
| SAREA persona acceptance on MEEM dashboard | Omar (MEEM) · Muhanad (platform hooks) |
| Entra, Supabase auth metadata, `crow_role` | Muhanad |
| CyberCrow dashboard, auditor UI, `/admin/audit` | Muhanad |
| SAREA studio **implementation** in Crow codebase | Muhanad (platform); Omar reviews MEEM UX only |

---

## Persona naming (avoid confusion)

| Name in workshops | Meaning |
|-------------------|---------|
| **Omar (MEEM)** | MEEM Holding — SAREA / customer experience liaison — **this document** |
| **Muhanad (Crow)** | Platform + CyberCrow implementer in **this repo** |
| **Client sponsor** | Submits `/request`; not Omar |

---

*Updated May 2026 — team model correction (Omar = MEEM customer SAREA, not Crow dev).*
