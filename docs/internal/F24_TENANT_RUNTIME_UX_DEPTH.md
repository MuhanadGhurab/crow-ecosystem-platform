# F24 — Tenant runtime UX depth (no paid infra)

**Date:** 25 May 2026  
**Status:** **PASSED**  
**Constraint:** Cost-controlled product depth only — no paid infrastructure, no production launch, no live payments, no schema changes.

**Related:** [`F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`](F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md) · [`PROJECT_STATUS.md`](PROJECT_STATUS.md)

---

## Objective

Make post-login tenant runtime (`/[tenant]/…`) more coherent, readable, and demo-useful without claiming full ERP depth or activating external paid services.

---

## Part 1 — Tenant runtime audit

| Route | Before F24 | After F24 |
|-------|------------|-----------|
| `/[tenant]/dashboard` | Strong (SAREA widgets, CyberCrow, MEEM hints) | + recommended next actions, runtime cross-link hub |
| `/[tenant]/modules` | Simple module list | Operational cards, stats, ERP links, advisory note |
| `/[tenant]/workflows` | Functional list | PageHeader, stat strip, clearer cards, CyberCrow/MEEM links |
| `/[tenant]/tasks` | Basic stats | Stat strip, EmptyState, audit hint, cross-links |
| `/[tenant]/departments` | Plain headings | PageHeader, stats, SAREA/RBAC note, cross-links |
| `/[tenant]/roles` | Plain list | RBAC framing, stats, cross-links |
| `/[tenant]/users` | Invite + role table | Stats, SAREA note, cross-links (identity unchanged) |
| `/[tenant]/reports` | MEEM hub only when `showMeemErpHub`; **others empty** | Non-MEEM tenants get **reporting readiness** panel (no fake charts) |
| `/[tenant]/settings` | Workspace links | Plan label, deferred-payment note, cross-links |
| `/[tenant]/settings/plan` | Already sufficient | Unchanged (advisory plan scope) |

**CEM / CyberCrow / SAREA navigation**

- New shared component `TenantRuntimeCrossLinks` on all audited runtime pages.
- CyberCrow link reflects initialize vs live posture.
- SAREA studio link is platform-scoped (`/sarea/overview`); tenant dashboard still hosts SAREA widgets.

**MEEM vs Rimal**

- MEEM: logistics advisory on modules; workflow OCR/AI links; MEEM reports hub retained when hub rules match.
- Rimal: construction module set validated — no logistics leakage (`tenant:verify:rimal`).

---

## Part 2–7 — Improvements delivered

### Dashboard

- `TenantRuntimeNextActions` — open tasks, workflows, users, CyberCrow init, plan/settings.
- `TenantRuntimeCrossLinks` — full runtime hub.

### Modules

- `TenantModulesOperationalGrid` — purpose copy, enabled status, workflow/task counts, ERP route when available.
- `TenantModulesAdvisoryNote` — logistics hint for MEEM-style stacks.
- Stat strip from `safeWorkspaceSummary`.

### Workflows & tasks

- Consistent enterprise headers and glass cards.
- Department/role connection via workflow names and user profiles (existing data).
- Links to tasks, logistics (MEEM), CyberCrow audit when initialized.

### Users / roles / departments

- Count summaries via stat strips.
- Clear RBAC and SAREA copy (preview does not elevate permissions).
- No new provisioning or IdP behavior.

### Reports

- `TenantReportsReadinessPanel` for non-MEEM-hub tenants: categories, data availability, CyberCrow risk link — **no fabricated charts**.

### Settings / plan

- Settings: `planLabel`, explicit “payments deferred per F23” note, cross-links.
- Plan page left as-is (already read-only advisory).

---

## Part 8 — MEEM / Rimal validation

| Command | Result |
|---------|--------|
| `npm run meem:ids:staging` | **PASS** — tenant `meem-global`, request GO_LIVE, blueprint IDs printed |
| `npm run tenant:verify:rimal` | **PASS** — construction modules, no logistics, SAREA personas, isolation vs MEEM |
| `npm run request:pipeline:verify` | **PASS** — MEEM + Rimal pipeline |

---

## Part 9 — Validation commands

| Command | Result | Notes |
|---------|--------|-------|
| `npm run typecheck` | **PASS** | After `rose` accent on stat strip |
| `npm run lint` | **PASS** | |
| `npm run build` | **PASS** | Next.js 15.5.18 |
| `npm run public:mirror-manifest` | **PASS** | 21 include paths |
| `npm run meem:ids:staging` | **PASS** | `.env.staging` |
| `npm run tenant:verify:rimal` | **PASS** | |
| `npm run request:pipeline:verify` | **PASS** | |
| `npm run simulate:vercel-build:staging` | **Skipped** | Optional; not required for F24 acceptance |

---

## Files changed (implementation)

**New**

- `src/lib/constants/tenant-module-purpose.ts`
- `src/components/tenant/tenant-runtime-cross-links.tsx`
- `src/components/tenant/tenant-runtime-next-actions.tsx`
- `src/components/tenant/tenant-runtime-stat-strip.tsx`
- `src/components/tenant/tenant-modules-operational-grid.tsx`
- `src/components/tenant/tenant-reports-readiness-panel.tsx`

**Updated**

- `src/app/[tenant]/dashboard/page.tsx`
- `src/app/[tenant]/modules/page.tsx`
- `src/app/[tenant]/workflows/page.tsx`
- `src/app/[tenant]/tasks/page.tsx`
- `src/app/[tenant]/departments/page.tsx`
- `src/app/[tenant]/roles/page.tsx`
- `src/app/[tenant]/users/page.tsx`
- `src/app/[tenant]/reports/page.tsx`
- `src/app/[tenant]/settings/page.tsx`

**Docs**

- `docs/internal/F24_TENANT_RUNTIME_UX_DEPTH.md` (this file)
- `docs/internal/PROJECT_STATUS.md`
- `docs/internal/MILESTONES.md`

---

## Deferred (explicit)

- Paid infra (Supabase prod project, Resend live, PSP, Entra prod)
- Production launch (F23 gate)
- Workflow builder / automation engine
- Full ERP transactional depth per module
- Fake analytics charts on reports
- Public marketing redesign
- Schema migrations

---

## F24 acceptance

| # | Criterion | Met |
|---|-----------|-----|
| 1 | Tenant runtime audit documented | Yes |
| 2 | Dashboard clearer / more useful | Yes |
| 3 | Modules page improved | Yes |
| 4 | Workflows/tasks clearer | Yes |
| 5 | Users/roles/departments clearer | Yes |
| 6 | Reports/settings improved | Yes |
| 7 | CEM/CyberCrow/SAREA navigation clearer | Yes |
| 8 | MEEM validation | Yes |
| 9 | Rimal validation | Yes |
| 10 | typecheck/lint/build | Yes |
| 11 | public mirror | Yes |
| 12 | No paid infra / forbidden scope | Yes |

**Decision:** **F24 PASSED**
