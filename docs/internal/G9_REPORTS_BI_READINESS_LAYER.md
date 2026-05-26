# G9 — Reports / BI readiness layer (no paid infra)

**Status:** Passed (26 May 2026)  
**Constraint:** No paid infrastructure, no schema changes, no external BI/warehouse/AI forecasting/certified reporting.

---

## Objective

Deepen Reports / BI as Crow’s executive and operational visibility layer — cross-module readiness roll-ups, CyberCrow evidence posture, SAREA experience posture, and advisory KPI signals — without a data warehouse, live analytics pipeline, or predictive engine.

---

## Part 1 — Audit (before G9)

| Area | Finding |
|------|---------|
| Route `/[tenant]/reports` | Existing MEEM and non-MEEM paths; KPI summary via `getReportsKpiSummary`; CEM ops snapshot; module snapshot for MEEM |
| Data | Real: enabled modules, workspace summary, KPI categories from CEM/reports service, SAREA health detail, optional G2–G8 readiness snapshots when modules on |
| Catalog | Reports entry present but thin on cross-module dependencies and honest future-only scope |
| CyberCrow | Evidence/GRC/risk routes exist; not summarized on reports hub |
| SAREA | `/sarea/overview`, role-mapping; tenant health via `getTenantSareaHealthDetail` |
| Tasks/workflows | G8 readiness service exists; not rolled into reports executive view |
| Gap | No central `reports-bi-readiness` aggregation; no executive rollup model; panel was generic readiness only |

**Honesty:** All reporting remains **readiness and visibility** — not certified compliance, not live financial statements, not AI forecasts.

---

## Part 2 — Catalog refinement

`erp-module-catalog.ts` Reports / BI (`erpKey: "reports"`, `cemModuleKey: "bi"`) updated to:

- Purpose: executive and operational visibility across enabled modules
- Dependencies: hr, finance, crm, sales, procurement, inventory, warehouse, logistics, tasks, workflows, cybercrow, sarea (+ reports self-reference where applicable)
- `implementationStatus: "evidence_report_linked"`
- Report signals, CyberCrow risks, SAREA hints, sector relevance
- `futureOnlyCapabilities`: data warehouse, external BI, live pipelines, AI forecasting, certified/legal reports, autonomous executive decisions

---

## Part 3 — Reports page UX

`src/app/[tenant]/reports/page.tsx`:

- Parallel fetch: `getReportsBiReadinessSnapshot` alongside existing KPI/CEM/MEEM data
- `ReportsBiOperationsReadinessPanel` on MEEM and non-MEEM paths
- Page description references reporting readiness and executive roll-ups (no chart/trend overclaims)

`src/components/tenant/reports/reports-bi-operations-readiness-panel.tsx`:

- Executive readiness summary and stat strip
- Executive roll-up list (rule-based status: healthy / needs review / limited data / not enabled)
- Cross-module KPI category cards from existing `ReportsKpiSummary`
- Task/workflow readiness section when tasks module enabled
- CyberCrow reporting posture (evidence readiness, advisory)
- SAREA experience posture (profile coverage, mapping)
- Recommended report workflows (not live automation)
- Sector relevance note
- Next recommended actions

No fabricated charts, revenue trends, compliance scores, or forecasts.

---

## Part 4 — Cross-module reporting signals

`src/lib/services/reports-bi-readiness.service.ts`:

- `getReportsBiReadinessSnapshot(tenantId, enabledModuleKeys, industry?)`
- Aggregates: `getReportsKpiSummary`, `getCemOperationsSnapshot`, `safeWorkspaceSummary`, `getTenantSareaHealthDetail`
- Conditional G2–G8 snapshots when modules enabled (HR, Finance, CRM, Sales, Procurement, Inventory, Warehouse, Logistics, Tasks)
- Builds `executiveRollup[]` from `EXECUTIVE_ROLLUP_CATEGORIES` with advisory status mapping
- Overall readiness level/label/detail + `recommendedActions`
- Avoids circular imports; no DB-heavy build paths

Constants: `src/lib/constants/reports-bi-readiness-depth.ts`

---

## Part 5 — Executive rollup model

Nine categories (People/HR, Commercial, Finance, Procurement, Supply chain, Logistics, Tasks/approvals, CyberCrow, SAREA):

| Status | Meaning |
|--------|---------|
| `healthy` | Module enabled and operational readiness level |
| `needs_review` | Module enabled but building/structure gaps |
| `limited_data` | Enabled but thin signals |
| `not_enabled` | Module off |

Each item: title, explanation, route key, next action, related module keys. **No fake numeric scores.**

---

## Part 6 — CyberCrow reporting posture

Panel and catalog summarize:

- Evidence readiness and open gaps (advisory)
- GRC/control readiness context
- Risk signal readiness (operator-reviewed)
- Linkage to CyberCrow dashboard, evidence, GRC, risk routes

**Not claimed:** certified audit, SIEM analytics, autonomous detection, guaranteed risk scoring.

---

## Part 7 — SAREA reporting posture

Panel summarizes:

- Profile/persona coverage counts from tenant SAREA health
- Role/profile mapping readiness
- Tenant-backed vs fallback advisory state
- Reminder: RBAC controls access; SAREA controls experience

---

## Part 8 — Reporting workflow readiness

`REPORTS_BI_RECOMMENDED_WORKFLOWS` (9+ templates): monthly executive review, module health, finance, procurement, inventory/warehouse, logistics, CyberCrow evidence, SAREA role experience, access/role report review.

Displayed as **recommended** workflows — matched against tenant workflows where possible; not automated scheduling.

---

## Part 9 — Sector relevance

`REPORTS_BI_SECTOR_NOTES` for logistics, retail, construction, aviation, healthcare — advisory, public-safe wording on what reporting readiness highlights per sector.

---

## Part 10 — Module page linkage

G2–G8 operations readiness panels already link to `r.reports` when the reports module is enabled (`TenantRuntimeCrossLinks`). No additional banners added in G9 to avoid noise.

---

## Part 11 — Verification

| Command | Purpose |
|---------|---------|
| `npm run reports:verify` | G9 reports/BI depth checks |
| `npm run erp:verify` | ERP catalog integrity |

Script: `scripts/verify-reports-bi-readiness.ts`

Checks: catalog entry, dependencies, executive rollup categories, CyberCrow/SAREA sections, forbidden overclaim phrases in user-facing copy, G9 doc presence.

---

## Validation (26 May 2026)

Run and record in PR/commit notes:

- `npm run mock:verify`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run public:mirror-manifest`
- `npm run erp:verify`
- `npm run reports:verify`

---

## Remaining gaps

- No dedicated BI warehouse or scheduled report jobs (by design)
- KPI charts remain category cards, not time-series analytics
- Executive rollup is rule-based on module readiness levels, not financial actuals
- MEEM-specific report tiles unchanged; G9 panel sits alongside

---

## Recommended next

**G10 — Cross-module intelligence & runtime cohesion** — unify signals across modules, discovery, and runtime without new paid infra.
