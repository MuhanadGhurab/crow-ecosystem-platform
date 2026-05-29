# K1 — Tenant Runtime / CEM 10-minute demo playbook

**Audience:** Internal demo, portfolio review, operator walkthrough  
**Mode:** Staging / mock / portfolio — **no production**, **no paid infra**, **no live payments**

**Prerequisites:** [`TENANT_RUNTIME_DEMO_RUNBOOK.md`](TENANT_RUNTIME_DEMO_RUNBOOK.md) · Tenant access session · `npm run mock:verify` green

**Recommended tenant:** `meem-global` (MEEM lighthouse) · **Alternate:** `rimal-construction`

---

## Browser tabs (recommended)

Open before presenting (left → right):

1. `/meem-global/dashboard` (present tab)
2. `/meem-global/modules`
3. `/meem-global/departments`
4. `/meem-global/tasks`
5. `/meem-global/reports`
6. `/meem-global/hr`
7. `/meem-global/finance`
8. `/meem-global/procurement` or `/meem-global/logistics`
9. `/meem-global/cybercrow/dashboard`
10. `/sarea/overview`

Keep ProCrow (`/admin/*`) and Client Portal (`/client/*`) closed unless bridging from an end-to-end story.

---

## Script (10 minutes)

### 0:00–1:00 — Tenant Runtime definition

**Stay on:** `/meem-global/dashboard` (runtime hint + hero)

**Say:**  
“**Tenant Runtime / CEM** is where the company operates after ProCrow prepares the tenant. ProCrow governs readiness and go/no-go; **CEM runs daily operations** — modules, structure, tasks, workflows, and reports in one workspace. CyberCrow supervises trust posture; SAREA shapes role-based experience. **RBAC controls access**; SAREA controls how the UI feels.”

**Do not claim:** Production go-live, auto-provisioning, live billing, certified compliance, autonomous AI operations.

---

### 1:00–2:00 — Dashboard

**Scroll:** Runtime hint, tenant hero, SAREA widgets (if visible), CyberCrow connection, CEM operations, **runtime cohesion** panel, next actions, cross-links.

**Say:**  
“This is the company command center — enabled modules, open tasks, cohesion signals, and links into trust and experience layers. Cohesion is **rule-based guidance**, not predictive AI.”

**Fallback:** If widgets are sparse, read cohesion “healthy baseline” and stat strip counts.

---

### 2:00–3:00 — Modules

**Go to:** `/meem-global/modules`

**Say:**  
“Modules are **operational areas** enabled from blueprint — HR, finance, logistics, and so on. Depth varies by module; the grid shows readiness and cross-links. ProCrow prepared the runtime; **CEM operates** these areas.”

**Click:** One strong module card (HR or logistics).

**Do not claim:** One-click module activation, full ERP replacement, instant go-live.

---

### 3:00–4:00 — Org structure

**Go to:** `/meem-global/departments` → `/meem-global/roles` or `/meem-global/users` (pick two if time)

**Say:**  
“Departments, roles, and users are the **structure foundation** for workflows, RBAC, and SAREA profiles. This is tenant operations — not ProCrow admin.”

**Fallback:** Show departments only; mention roles/users from dashboard links.

---

### 4:00–5:00 — Tasks / workflows

**Go to:** `/meem-global/tasks` → `/meem-global/workflows`

**Say:**  
“Tasks and workflows are the **coordination layer** — linking modules, approvals, and evidence where configured. Operator-guided templates; **not** BPMN, RPA, or autonomous automation.”

**Point at:** Task approval readiness panel, workflow definitions (MEEM mock data is strong here).

---

### 5:00–6:00 — Reports / BI

**Go to:** `/meem-global/reports`

**Say:**  
“Reports are the **visibility layer** — executive roll-ups and module readiness signals. Advisory BI and KPI hints; **not** predictive analytics or a certified data warehouse.”

**Do not claim:** Live forecasting, guaranteed accuracy, external BI integration live.

---

### 6:00–8:00 — Core modules (pick 2–3)

**Recommended order:**

| Route | Talk track |
|-------|------------|
| `/meem-global/hr` | Workforce readiness hub — org linkage, employees, CyberCrow hints |
| `/meem-global/finance` | Finance readiness — plan advisory, cross-module links |
| `/meem-global/procurement` | Supply chain coordination — links to inventory/logistics |
| `/meem-global/logistics` | MEEM lighthouse — dispatch/readiness depth |
| `/meem-global/inventory` or `/warehouse` | Stock/warehouse readiness if data visible |

**Say:**  
“Each module is a **readiness and operations hub** — real depth where G-series invested; honest ‘advisory’ elsewhere.”

**Skip in short demos:** `/sales` if thin, `/crm` if redundant with sales story, `/settings/plan` unless asked about billing posture.

---

### 8:00–9:00 — CyberCrow + SAREA

**Go to:** `/meem-global/cybercrow/dashboard` → one of evidence / GRC / risk  
**Then:** `/sarea/overview` or `/sarea/role-mapping`

**Say:**  
“CyberCrow is **trust and security posture** on this tenant — evidence, GRC mapping, incidents, audit visibility. **Advisory**, not a SIEM or certification. SAREA is **experience orchestration** under the same tenant — navigation and widgets adapt by role; preview is staff-only and does not change RBAC.”

---

### 9:00–10:00 — Runtime cohesion close

**Return to:** `/meem-global/dashboard` — cohesion panel

**Say:**  
“Modules are **connected**, not isolated — commercial, supply chain, workforce, control, experience, and trust chains roll up here. ProCrow prepared and governs; **Tenant Runtime is where the company runs**.”

**Closing:** Offer H1 public story or J8 ProCrow story as bookends if audience needs full platform arc.

---

## What not to claim (entire demo)

- Production launch approved  
- Live checkout / subscription activation  
- Automatic tenant provisioning  
- Regulator-certified compliance  
- Autonomous AI SOC / workflow automation  
- Customer production references unless documented elsewhere  

---

## Fallbacks

| Issue | Action |
|-------|--------|
| Tenant 404 | Use `npm run meem:ids:staging` or seed docs; try `rimal-construction` |
| Empty tasks/workflows | Say MEEM mock mode enriches ops catalog; show readiness panels |
| CyberCrow not initialized | Show connection panel “pending init” — operator action in ProCrow |
| SAREA preview confusion | State “staff preview only — RBAC unchanged” |
