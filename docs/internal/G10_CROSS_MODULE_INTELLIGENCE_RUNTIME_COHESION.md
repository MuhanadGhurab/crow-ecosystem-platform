# G10 — Cross-module intelligence & runtime cohesion (no paid infra)

**Status:** Passed (26 May 2026) — rule-based, operator-guided; not autonomous AI, predictive analytics, live automation, or certified compliance.

**Scope:** Make Crow read as a **connected enterprise runtime** by describing how enabled modules relate, where handoffs are strong or weak, how tasks/workflows and Reports/BI tie in, and how CyberCrow evidence and SAREA experience coverage fit — **without** new persistence, external APIs, paid analytics, or schema changes.

---

## 1. Cross-module audit (post G2–G9)

### Strong links (implemented signals)

| Area | Signal |
|------|--------|
| **Module catalog & integration map** | `erp-module-catalog.ts`, `erp-module-integration-map.ts` — dependencies and edges documented; `npm run erp:verify`. |
| **Per-module depth (G2–G8)** | HR, Finance, CRM/Sales, Procurement, Inventory/Warehouse, Logistics, Tasks/Approvals — each has readiness constants + services + verify scripts. |
| **Reports / BI hub (G9)** | Executive roll-ups, sector notes, CyberCrow/SAREA reporting posture — `getReportsBiReadinessSnapshot`; `npm run reports:verify`. |
| **Runtime cohesion (G10)** | Reuses G9 snapshot + enablement + integration edges — `getRuntimeCohesionSnapshot`; `npm run runtime:verify`. |

### Advisory-only links

- Cohesion **status bands** (`healthy` / `needs_review` / `limited_data` / `not_enabled`) are **advisory** roll-ups from existing readiness data, not scores or guarantees.
- **SAREA** is always treated as available for experience mapping in handoff rules; actual persona materialization still comes from studio + tenant data (G9 SAREA signals).
- **CyberCrow** “live” vs “pending” follows **initialized** posture from workspace/BI snapshot — not a certification.

### Enabled but isolated patterns (documented weak links)

Examples encoded in `COHESION_CHAINS` weak-link copy:

- CRM without Sales (or inverse) — fragmented commercial narrative.
- Procurement without Inventory — spend without stock companion.
- Roles without Tasks — coordination without approval queue surface.
- Reports / BI disabled — no shared executive surface for chains that expect `bi` CEM key.

### Evidence vs task/workflow coverage

- **Control** and **Trust** chains reference CyberCrow initialization; evidence narrative stays **placeholder** until initialized (no fake audit claims).
- Task/workflow coverage is inferred from G9 roll-up `tasks_approvals` + CEM module keys `approvals`, `workflows`.

### Safe aggregation

- **Single BI fetch** per page load via `getReportsBiReadinessSnapshot` inside `getRuntimeCohesionSnapshot`.
- **No new DB writes**; no circular imports from UI back into services beyond established patterns.

### Gaps without schema changes

- No live cross-module transactional joins — cohesion is **descriptive** and route-linked.
- No automated remediation or workflow execution.

---

## 2. Cohesion model

**File:** `src/lib/constants/cross-module-cohesion.ts`

| Chain key | Label | Intent |
|-----------|-------|--------|
| `commercial` | Commercial chain | CRM → Sales → Finance → Reports |
| `supply_chain` | Supply chain | Procurement → Inventory → Warehouse → Logistics → Finance → Reports |
| `workforce` | Workforce chain | HR → Users → Roles → SAREA → Tasks |
| `control` | Control chain | Tasks / Approvals → Workflows → CyberCrow evidence → Reports |
| `experience` | Experience chain | Roles → SAREA profiles → navigation/widgets/preview |
| `trust` | Trust chain | Audit posture → Evidence → GRC → Risk → Reports (advisory) |

Each definition includes: purpose, `cemKeysForCoverage`, `relatedRollupIds` (G9), `requiredHandoffs`, CyberCrow evidence examples, SAREA implications, report KPI signals, weak-link indicators, recommended operator actions, optional `requiresCybercrowInitialized`.

---

## 3. Runtime cohesion service

**File:** `src/lib/services/runtime-cohesion.service.ts`

- **Inputs:** `tenantId`, enabled CEM `moduleKey` list, industry, tenant slug.
- **Sources:** `getReportsBiReadinessSnapshot`, `COHESION_CHAINS`, `ERP_MODULE_INTEGRATION_EDGES` (edge coverage hint).
- **Outputs:** `overallStatus`, per-chain statuses, module dependency gaps, handoff gaps (including `cybercrow` as “enabled” when CyberCrow is **initialized**), evidence/SAREA gap strings, deduped recommended actions, `relatedRoutes`, BI label echo.
- **Admin helper:** `summarizeRuntimeCohesionForAdmin`.

---

## 4. Tenant dashboard cohesion panel

**Component:** `src/components/tenant/runtime-cohesion-panel.tsx`  
**Wiring:** `src/app/[tenant]/dashboard/page.tsx` — compact overall status, chain grid, weak links, next steps, deep links (Reports, Tasks, Workflows, CyberCrow, Modules, SAREA role mapping).

---

## 5. Modules page cohesion view

**Component:** `src/components/tenant/tenant-modules-runtime-cohesion-section.tsx`  
**Wiring:** `src/app/[tenant]/modules/page.tsx` — chains, missing companions, handoff gaps, links to Reports, Tasks, Workflows, CyberCrow, SAREA studio. **Does not** change enablement logic.

---

## 6. Admin tenant cohesion view

**Component:** `src/components/admin/admin-runtime-cohesion-summary.tsx`  
**Wiring:** `src/app/admin/tenants/[tenantId]/page.tsx` (overview tab) — operator headline, weak chains, evidence/SAREA hints, suggested actions, links to tenant dashboard/modules/reports. **Read-only** — no tenant mutation.

---

## 7. CyberCrow cohesion posture (cross-module)

**Advisory examples** (not certification):

- Commercial / procurement approval evidence when workflows touch privileged actions.
- Logistics exception evidence when sign-off is required.
- HR access review evidence for sensitive directory changes.
- Task approval trails referenced in monthly reporting evidence packs (when BI + tasks in scope).
- GRC checklist progress as **operator** snapshots — not “compliant” outcomes.

---

## 8. SAREA cohesion posture (cross-module)

- **RBAC** (CEM) governs what users *may* do; **SAREA** governs *density* and layout of experience.
- Personas: executive cross-module health widgets; operations managers workflow chain visibility; frontline task slices; analysts readiness/gaps; CyberCrow reviewers trust widgets; tenant admins role/profile mapping in studio.

---

## 9. Verification

**Script:** `scripts/verify-runtime-cohesion.ts`  
**Command:** `npm run runtime:verify`

Checks: six chains; valid `cemModuleKey` references; valid executive rollup ids; required files and dashboard/modules/admin wiring; reuse of G9 BI snapshot; forbidden overclaim phrases absent from cohesion-facing copy; this document exists.

**Also run:** `npm run erp:verify`, `npm run reports:verify`, `npm run tasks-approvals:verify`.

Forbidden-phrase checks in `runtime:verify` scan **user-facing** cohesion UI and admin tenant wiring only — not `cross-module-cohesion.ts`, which intentionally enumerates phrases to avoid.

---

## 10. Remaining gaps & recommended next arc

| Gap | Notes |
|-----|-------|
| No live data fabric | Cohesion remains narrative + route-linked until product invests in deeper telemetry (would need schema/API scope). |
| Trust chain vs CyberCrow module | Handoffs treat CyberCrow as “enabled” when **initialized**, not as a toggleable CEM module row. |

**Recommended next:**

- **H1** — Product polish and demo rehearsal after G-series closure, **or**
- **G11** — Module runtime refinement backlog (incremental UX and copy hardening without new infra).

---

## Acceptance (G10)

| # | Criterion |
|---|-----------|
| 1 | Cross-module audit documented (this file §1). |
| 2 | Cohesion model in `cross-module-cohesion.ts`. |
| 3 | Runtime service in `runtime-cohesion.service.ts`. |
| 4 | Dashboard panel wired. |
| 5 | Modules page cohesion section wired. |
| 6 | Admin tenant overview cohesion summary wired. |
| 7 | CyberCrow posture copy in model + docs §7. |
| 8 | SAREA posture copy in model + docs §8. |
| 9 | `runtime:verify` script + npm script. |
| 10 | Validation suite per project norms (see CI / local `npm run` list). |
| 11 | No paid infra / forbidden scope in this phase. |
| 12 | No AI/autonomous/compliance overclaims in cohesion-facing strings. |

**Decision:** **G10 PASSED.**
