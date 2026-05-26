# G8 — Tasks / Approvals engine depth (no paid infra)

**Status:** Passed (26 May 2026)  
**Constraint:** No paid infrastructure, no schema changes, no BPMN/RPA/autonomous workflow/AI assignment/compliance automation claims.

---

## Objective

Deepen Tasks and Workflows as the cross-module coordination engine for operator-guided task readiness, advisory approval paths, workflow-to-task linkage, CyberCrow evidence posture, and SAREA experience guidance.

---

## Part 1 — Audit (before G8)

| Area | Finding |
|------|---------|
| `/[tenant]/tasks` | Task board with status groups, ops stat strip, cross-links; no module approval map or readiness hub |
| `/[tenant]/workflows` | Workflow list with ops intel overlays; MEEM OCR links labeled demo; no approval-chain advisory section |
| Catalog | Tasks/workflows entries thin vs G2–G7 modules; dependencies not listing all ERP hubs |
| Data | Real task/workflow rows via Prisma; `getCemOperationsSnapshot` provides counts and workflow intel |
| Module hubs | G2–G7 readiness panels already link to tasks/workflows |
| CyberCrow / SAREA | Light catalog hints only; no dedicated engine-level posture block |

---

## Part 2 — Catalog refinement

`erp-module-catalog.ts`:

- **Tasks / Approvals** (`erpKey: tasks`, `cemModuleKey: approvals`) — expanded purpose, users, workflows, approval needs, dependencies (all deepened ERP modules + workflows + cybercrow), `futureOnlyCapabilities` (BPMN, RPA, autonomous approvals, AI assignment, etc.)
- **Workflows** — expanded as platform foundation with advisory approval-chain language; dependencies include tasks, departments, roles, users, reports, cybercrow

---

## Part 3 — Tasks page UX

`src/app/[tenant]/tasks/page.tsx`:

- `TaskApprovalOperationsReadinessPanel` (`focus="tasks"`) with task engine summary, status distribution, workflow linkage, module approval map, engine workflows, CyberCrow/SAREA, KPI signals, sector note, recommended actions
- Updated page description — honest operator-guided language
- Existing task groups and MEEM samples unchanged

---

## Part 4 — Workflows / approval readiness

`src/app/[tenant]/workflows/page.tsx`:

- Same readiness panel with `focus="workflows"` (emphasizes workflow-to-task linkage and approval readiness)
- Updated descriptions — advisory approval paths, no BPM builder claims
- MEEM OCR/AI logistics links remain **demo-only**

---

## Part 5 — Cross-module task/approval map

`src/lib/constants/task-approval-engine-depth.ts`:

- `MODULE_TASK_APPROVAL_MAP` — HR, Finance, CRM, Sales, Procurement, Inventory, Warehouse, Logistics, Reports
- `TASK_APPROVAL_RECOMMENDED_WORKFLOWS` — 8 engine-level templates
- `TASK_APPROVAL_ENGINE_WORKFLOW_KEYWORDS` for matching tenant data

Filtered by enabled ERP module keys in `getTaskApprovalEngineReadinessSnapshot`.

---

## Part 6 — CyberCrow posture

`TASK_APPROVAL_CYBERCROW_RISKS` and `TASK_APPROVAL_CYBERCROW_EVIDENCE` in constants + panel — assignment records, approval trails, handoffs, workflow history. Advisory only; links to evidence/audit/GRC when initialized.

---

## Part 7 — SAREA experience model

`TASK_APPROVAL_SAREA_PERSONAS` (10 personas) — executive through CyberCrow reviewer. Panel links to `/sarea/role-mapping` and `/sarea/preview`. RBAC vs SAREA reminder in copy.

---

## Part 8 — Reports / KPI readiness

`TASK_APPROVAL_REPORT_KPI_SIGNALS` surfaced as chips in panel; link to Reports hub. No fabricated charts.

Snapshot exposes: task counts, open/completed, unassigned, workflow coverage, matched workflows.

---

## Part 9 — Module page linkage

G2–G7 module readiness panels already include tasks/workflows cross-links. No additional banners added (avoid noise).

---

## Part 10 — Sector relevance

`TASK_APPROVAL_SECTOR_NOTES` for logistics, retail, construction, aviation, healthcare — public-safe advisory copy in panel when sector resolves.

---

## Part 11 — Verification

| Command | Purpose |
|---------|---------|
| `npm run tasks-approvals:verify` | G8-specific catalog, constants, service, panel, pages, forbidden-claim scan, doc |
| `npm run erp:verify` | Broader ERP catalog integrity |

---

## Validation (26 May 2026)

- `npm run mock:verify` — pass
- `npm run typecheck` — pass
- `npm run lint` — pass
- `npm run build` — pass
- `npm run public:mirror-manifest` — pass
- `npm run erp:verify` — pass
- `npm run tasks-approvals:verify` — pass

---

## Remaining gaps

- No SLA/due-date engine; due dates on tasks not emphasized unless present in data
- No enforced approval chains or delegation rules
- Visual workflow designer remains future-only
- Bulk approve and external notification integrations out of scope

---

## Recommended next

**G9 — Reports / BI readiness layer** — executive KPI roll-ups, module signal aggregation, and honest BI maturity without autonomous analytics claims.
