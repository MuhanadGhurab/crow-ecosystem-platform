# H1 — Demo rehearsal playbook (10–15 minutes)

**Audience:** Internal demo, portfolio walkthrough, interview reviewer.  
**Mode:** Staging / mock / portfolio — **no production**, **no paid infra**, **no live payments**.

Use this script in order. Pause on any step if the environment is cold — fallbacks are inline.

---

## 1) Homepage story — `/`

| | |
|---|---|
| **Route** | `/` |
| **Talk track** | Crow is a **CEM + CyberCrow + SAREA** stack: discovery and blueprint shape the model; tenant runtime is modular ERP depth with advisory readiness, not a finished ERP replacement. |
| **Proof point** | Hero, how-it-works, engines, lifecycle strip; Discovery/Blueprint cards with **staging-first** copy. |
| **Do not claim** | Production go-live, live customers, autonomous AI, compliance certification, live billing. |
| **Fallback** | If auth/session odd, stay on public routes only; mention RC1 staging validation doc. |

---

## 2) Industries catalog — `/industries`

| | |
|---|---|
| **Route** | `/industries` |
| **Talk track** | Five **modeled** sector operating packs — templates for discovery/blueprint, not exhaustive market coverage. |
| **Proof point** | Sector cards, consistent badges, link into request flow. |
| **Do not claim** | Sixth sector live, sector-specific production SLAs, regulated certification. |
| **Fallback** | Summarize from homepage sector section if `/industries` is slow. |

---

## 3) Request flow — `/request`

| | |
|---|---|
| **Route** | `/request` |
| **Talk track** | Intake is **advisory** — shapes discovery payload; estimates are indicative, not quotes. |
| **Proof point** | Industry selector + preview language (honest staging). |
| **Do not claim** | Auto-provisioning, SLA, pricing guarantee, instant tenant. |
| **Fallback** | Walk fields without submit; reference `npm run sector:verify` for catalog integrity. |

---

## 4) Admin overview — `/admin/overview`

| | |
|---|---|
| **Route** | `/admin/overview` |
| **Talk track** | CEM Command Center: pipeline counts, platform health, **advisory** subscription/notifications — operator clarity strip explains staging. |
| **Proof point** | Stat strip, pipeline links, CyberCrow/SAREA strips. |
| **Do not claim** | SCIM shipped, billing enforcement, digest email automation, production tenant health. |
| **Fallback** | Mock-backed counts; say “advisory snapshot” explicitly. |

---

## 5) Request → Discovery → Blueprint path

| | |
|---|---|
| **Routes** | `/admin/requests` → discovery `[requestId]` → blueprint `[blueprintId]` (as demo data allows) |
| **Talk track** | Operator triages intake → discovery deepens org model → blueprint packages go-live readiness **without** auto-deploy. |
| **Proof point** | Admin requests table, discovery nav, blueprint overview. |
| **Do not claim** | Idempotent prod provision, customer data migration complete. |
| **Fallback** | Single screenshot path from `docs/public` or F13 notes if live data thin. |

---

## 6) Tenant dashboard — `/[tenant]/dashboard`

| | |
|---|---|
| **Route** | e.g. `/meem/dashboard` or your lighthouse tenant |
| **Talk track** | Command center for **enabled modules** + runtime cohesion panel (rule-based hints). |
| **Proof point** | Cohesion card, cross-links toward modules / CyberCrow / Reports. |
| **Do not claim** | Predictive AI, live automation, cross-tenant analytics. |
| **Fallback** | Read-only tour of layout with empty cohesion “healthy baseline” message. |

---

## 7) ERP module runtime example — `/[tenant]/hr` (or finance)

| | |
|---|---|
| **Route** | `/[tenant]/hr` **or** `/[tenant]/finance` |
| **Talk track** | One **readiness hub** pattern: scope, cross-module links, CyberCrow/SAREA hints, `*:verify` discipline. |
| **Proof point** | Readiness panel + banners; same pattern exists on other modules. |
| **Do not claim** | Payroll, live GL, warehouse robotics. |
| **Fallback** | Use modules page to show catalog without deep tenant. |

---

## 8) Tasks / Approvals glue — `/[tenant]/tasks`, `/[tenant]/workflows`

| | |
|---|---|
| **Routes** | `/[tenant]/tasks`, `/[tenant]/workflows` |
| **Talk track** | Coordination layer across modules — approval map and workflow linkage are **advisory**, not BPMN/RPA. |
| **Proof point** | Task-approval readiness panel; `npm run tasks-approvals:verify` in engineering story. |
| **Do not claim** | Autonomous approvals, AI task routing. |
| **Fallback** | Static empty state with “connect workflows in blueprint” copy. |

---

## 9) Reports / BI — `/[tenant]/reports`

| | |
|---|---|
| **Route** | `/[tenant]/reports` |
| **Talk track** | Executive and operational **visibility** layer — roll-ups and posture hints, not a data warehouse or certified reporting. |
| **Proof point** | Reports BI readiness panel; sector notes where applicable. |
| **Do not claim** | Embedded Tableau/PowerBI, AI forecasting, auditor sign-off. |
| **Fallback** | Show panel structure with advisory KPI placeholders. |

---

## 10) CyberCrow posture — `/[tenant]/cybercrow/dashboard` → evidence → risk

| | |
|---|---|
| **Routes** | `/[tenant]/cybercrow/dashboard` → `…/evidence` → `…/risk` (touch `security-events` if time) |
| **Talk track** | **Advisory** security operations lens — evidence catalog, GRC/risk language is explainability-first, not SIEM replacement. |
| **Proof point** | Dashboard strip, evidence tables/cards, risk framing copy. |
| **Do not claim** | Live detection, 24/7 SOC, compliance certification, autonomous response. |
| **Fallback** | Emphasize “catalog + posture hints” language on screen. |

---

## 11) SAREA experience adaptation — `/sarea/overview` → profiles → role-mapping → preview

| | |
|---|---|
| **Routes** | `/sarea/overview` → `/sarea/profiles` → `/sarea/role-mapping` → `/sarea/preview` |
| **Talk track** | SAREA is **experience adaptation** on top of RBAC — profiles and mapping change UI/navigation/widgets, not entitlements source of truth. |
| **Proof point** | Overview explainer, mapping table readability, preview attribution (tenant vs fallback). |
| **Do not claim** | Full IAM replacement, drag-drop builder shipped, production widget marketplace. |
| **Fallback** | Stay on overview + preview only if mapping data empty. |

---

## 12) Runtime cohesion — `/[tenant]/dashboard` + `/[tenant]/modules`

| | |
|---|---|
| **Routes** | Dashboard cohesion panel; `/[tenant]/modules` cohesion section |
| **Talk track** | G10 **rule-based** cohesion — dependency chains and handoff gaps as operator hints; shared hubs Tasks + Reports. |
| **Proof point** | `runtime:verify` in engineering narrative. |
| **Do not claim** | ML optimization, auto-remediation, cross-tenant benchmarks. |
| **Fallback** | Open modules page and read cohesion section headers only. |

---

## 13) Closing — portfolio / staging mature, production deferred

| | |
|---|---|
| **Talk track** | v0.30 portfolio baseline: **G1–G10** depth arc closed, **H1** polish + rehearsal documented. **F23** remains the production gate — needs client + budget; **no paid infra** in this demo lane. |
| **Proof point** | `PROJECT_WRAP_UP_V0_30.md`, `F23_PRODUCTION_LAUNCH_DEFERRED_GATE.md`, this playbook. |
| **Do not claim** | Revenue live, customer count, SOC2/HIPAA, “we ship production Monday.” |
| **Fallback** | End on explicit “staging rehearsal complete — next decision is commercial/infra.” |

---

## Quick timing map (≈12 min)

| Min | Step |
|-----|------|
| 0–2 | Homepage |
| 2–3 | Industries |
| 3–4 | Request |
| 4–5 | Admin overview |
| 5–7 | Requests / discovery / blueprint (abbreviated) |
| 7–8 | Tenant dashboard |
| 8–9 | One ERP hub |
| 9–10 | Tasks/workflows |
| 10–11 | Reports |
| 11–12 | CyberCrow + SAREA (abbreviated) |
| 12–13 | Cohesion + close |
