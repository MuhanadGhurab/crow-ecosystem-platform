# G2 — HR module depth (no paid infra)

**Status:** Passed (26 May 2026)  
**Constraint:** Operational workforce readiness only — no payroll, HRMS, or compliance certification claims.

---

## Part 1 — HR module audit

### Routes inspected

| Route | Current role | Data |
|-------|----------------|------|
| `/[tenant]/hr` | Workforce readiness hub + employee CRUD | `HrEmployee` (Prisma), readiness snapshot |
| `/[tenant]/users` | Profiles + RBAC assignments | Real profiles, roles |
| `/[tenant]/roles` | Role definitions | Real roles + assignment counts |
| `/[tenant]/departments` | Org structure | Departments, branches |
| `/[tenant]/tasks` | Task operations | Real tasks |
| `/[tenant]/workflows` | Workflow definitions | Real workflows |
| `/[tenant]/reports` | Reporting hub | Workspace summary |
| `/[tenant]/settings` | Tenant settings | Config |
| `/sarea/role-mapping` | SAREA persona mapping | Studio |
| `/[tenant]/cybercrow/*` | Advisory GRC/evidence/audit | CyberCrow init flag |

### Real vs placeholder

- **Real:** `HrEmployee` records, tenant profiles, roles, departments, workflows, tasks, SAREA profile count, CyberCrow initialized flag.
- **Advisory / recommended:** HR workflow patterns (onboarding, access review) when not matched in DB; sector workforce notes; evidence examples.
- **Not in scope:** Payroll, attendance hardware, benefits, government integrations, automated IAM.

### Connections

- **Users/Roles/Departments:** HR readiness aggregates counts and gaps; employee email can match profile email (no FK).
- **SAREA:** Role → experience profile mapping; personas documented on HR hub.
- **CyberCrow:** Identity/access risks and evidence readiness; links to GRC, evidence, audit logs.
- **CEM ops:** `getCemOperationsSnapshot` for role assignment coverage.

### Gaps before G2

- HR page was employee list only — no workforce readiness summary.
- Weak catalog wording (`operational_list` only).
- No cross-links from users/roles/departments back to HR posture.

---

## Part 2 — Catalog refinement

Updated `src/lib/constants/erp-module-catalog.ts` HR entry:

- Purpose: workforce operational readiness (not HRMS).
- Dependencies: `departments`, `roles`, `users`, `tasks`, `reports`, `cybercrow`.
- `implementationStatus`: `workflow_linked` (readiness + workflow keyword matching).
- Expanded workflows, report signals, CyberCrow/SAREA hints.
- `futureDepth` explicitly marks payroll as future-only / out of scope.

---

## Part 3 — HR page UX

`src/app/[tenant]/hr/page.tsx` now includes:

- Page header with honest scope statement.
- `TenantRuntimeStatStrip` (readiness, profiles, employees, roles, departments, SAREA).
- `HrWorkforceReadinessPanel` (summary, actions, onboarding/offboarding, workflows, CyberCrow, SAREA, KPIs, sector note).
- Employee records section (existing forms preserved).
- `TenantRuntimeCrossLinks` with `current="hr"`.

---

## Part 4 — Users / roles / departments linkage

`HrOrgLinkageBanner` on:

- `users` — warns on profiles without roles.
- `roles` — warns on unassigned roles.
- `departments` — warns on departments without profiles.

RBAC and SAREA separation reiterated; links to HR hub, SAREA mapping, CyberCrow audit.

---

## Part 5 — Workflow / task readiness

`src/lib/constants/hr-module-depth.ts` — eight recommended workflows.  
`src/lib/services/hr-readiness.service.ts` matches tenant workflow names and task titles by keyword; marks status `found` | `partial` | `recommended`.

---

## Part 6 — CyberCrow HR posture

Constants: `HR_CYBERCROW_RISKS`, `HR_CYBERCROW_EVIDENCE`.  
Panel section on HR page with advisory wording and deep links to GRC, evidence, audit logs.

---

## Part 7 — SAREA HR experience model

`HR_SAREA_PERSONAS` — seven personas (Executive, HR Manager, Department Manager, Frontline, Analyst, Tenant Admin, CyberCrow Reviewer).  
Displayed on HR hub with link to SAREA role mapping.

---

## Part 8 — Reports / KPI readiness

`HR_REPORT_KPI_SIGNALS` listed on HR hub; counts surfaced in readiness snapshot (no fake charts).

---

## Part 9 — Sector relevance

`HR_SECTOR_WORKFORCE_NOTES` for logistics, retail, construction, aviation, healthcare — shown when tenant industry resolves to a modeled sector.

---

## Part 10 — Verification

| Command | Purpose |
|---------|---------|
| `npm run hr:verify` | G2 HR depth checks |
| `npm run erp:verify` | Catalog still valid after HR entry update |

Script: `scripts/verify-hr-module-depth.ts`

---

## Remaining gaps

- No FK between `HrEmployee` and `Profile` (email match only).
- HR workflows are recommendations unless tenant seeds matching workflow/task names.
- No dedicated HR report charts — signals only.
- MEEM HR hub remains industry-gated (unchanged).

---

## Recommended G3

**G3 — Finance module depth** — same pattern: catalog refinement, tenant finance hub depth, CyberCrow/SAREA linkage, sector notes, `finance:verify`.
