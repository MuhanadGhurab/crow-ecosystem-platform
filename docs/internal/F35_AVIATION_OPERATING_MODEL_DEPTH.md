# F35 — Aviation operating model depth & Najm intake hardening

**Phase:** F35  
**Constraint:** No paid infrastructure · no production launch · no live payments · no external APIs · no schema changes  
**Status:** Passed (26 May 2026) — validation commands run locally

---

## 1. Objective

Make **Aviation** a first-class Crow operating model — reusable for discovery, org intelligence, blueprint readiness, SAREA personas, CyberCrow advisory posture, and **Najm-style organic intake** (F11 reference pattern). This is **operator-managed readiness**, not a production customer claim. **No Najm tenant** is provisioned in this phase.

---

## 2. Aviation audit (Part 1)

| Area | Strength before F35 | Gaps addressed |
|------|---------------------|----------------|
| **Sector template** | Thin OCC/MRO-focused model (5 depts, 5 roles, 4 workflows) | Deepened to 12 departments, 15 roles, 12 workflows, 6 approval chains |
| **Discovery guidance** | OCC/MRO jargon without station/service breadth | Full station ops, passenger service, maintenance, safety, procurement, workforce guidance |
| **Discovery JSON** | Legacy 5-dept pack; limited modules | Aligned to template; flight/airport systems as future readiness |
| **Blueprint / org intelligence** | Generic aviation notes | Blueprint notes for modules, Najm organic path, sector isolation |
| **Najm intake** | F11 payload + E2E exists | Explicit staging/synthetic wording; verify ties industry `aviation` |
| **SAREA** | Few template profiles | Ten SAREA profile hints; RBAC unchanged |
| **CyberCrow** | Two generic baselines | Ten aviation-specific baselines (service, safety, maintenance, supplier, access) |
| **Verification** | `request:e2e:dry` only (all sectors) | Added `npm run aviation:verify` (read-only) |
| **Public / hero** | Aviation chip already present | No Najm-as-customer or live-tenant claims |

**Najm-specific vs reusable**

| Najm-specific | Reusable across aviation tenants |
|---------------|----------------------------------|
| F11 payload `Najm Aviation Services`, reference `CROW-2026-ARAX9K` pattern | Department/role/workflow catalog |
| Organic E2E sign-off (F11) — no tenant provision | `AVIATION_RECOMMENDED_*` module exports |
| Synthetic contact email in payload | CyberCrow baseline library |
| | Discovery template `aviation.json` |

**Demo / staging only:** Najm naming in guidance (“organic intake on staging”) — not “trusted by Najm” or “live customer”.

**Leakage checks:** Aviation model excludes logistics dispatch/fleet, retail store/merchandising, and construction site/project/document-control department names. CEM recommendations exclude `logistics`, `warehouse`, and `inventory`.

---

## 3. Sector template (Part 2)

**Primary source:** `src/lib/org-intelligence/sector-template-data.ts` — `AVIATION` + catalog entry

**Exports:**

- `AVIATION_RECOMMENDED_CEM_MODULE_KEYS` — crm, sales, procurement, finance, hr, approvals, bi
- `AVIATION_RECOMMENDED_ERP_MODULE_KEYS` — same + `tasks`, `reports`
- `AVIATION_FUTURE_READINESS_KEYS` — flight ops, airport systems, maintenance system, IoT, passenger portal, live compliance integrations, advanced_bi (**not live**)

### Departments (12)

Executive Office · Aviation Operations · Ground Operations · Passenger / Customer Service · Maintenance Coordination · Safety / Compliance · Procurement / Supplier Management · Finance / Billing Coordination · HR / Workforce Scheduling · Quality / Service Assurance · IT / CyberCrow Security · Reporting / Analytics

### Roles (15)

Executive Viewer / Owner · Aviation Operations Manager · Ground Operations Coordinator · Customer Service Supervisor · Passenger Service Agent · Maintenance Coordinator · Safety / Compliance Officer · Procurement Specialist · Finance Coordinator · HR / Workforce Coordinator · Quality Reviewer · IT / Security Administrator · Analyst · Tenant Admin · CyberCrow Security Reviewer

### Workflows (12)

Service request intake · Passenger / customer issue escalation · Ground operation task assignment · Maintenance request review · Supplier request · Safety incident report · Quality / service review · Workforce / shift request · Access / role review · Finance / billing review · Monthly aviation operations report · CyberCrow incident review

### Approval chains (6)

Service request · Customer escalation · Maintenance request · Supplier request · Safety incident · Access review

---

## 4. Discovery guidance (Part 3)

**File:** `src/lib/discovery-intelligence/sector-guidance.ts` — `aviation` block

Covers: aviation service type and station count, passenger/customer service and escalation, ground operations, maintenance coordination, safety incident reporting, supplier/procurement, workforce/shift coordination, approval chains, reporting, CyberCrow evidence examples, honest Najm organic/staging note.

---

## 5. Blueprint readiness (Part 4)

Blueprint notes include: recommended live modules, future readiness keys, org intelligence accept path, Najm organic path without auto-tenant, sector confirmation to avoid logistics/retail/construction leakage. Idempotent blueprint behavior unchanged (F9). Tenants are not created automatically on accept.

---

## 6. SAREA persona model (Part 5)

**Template hints (10 profiles):** executive operations health, aviation operations control board, ground operations task board, customer service escalation queue, passenger service agent workspace, maintenance coordination, safety/quality evidence, analyst reporting, tenant admin, CyberCrow security.

SAREA shapes experience only; RBAC still controls access.

| Persona | Experience focus |
|---------|------------------|
| Executive / owner | Operations health, safety open items, service risk posture |
| Aviation operations manager | Workflows, service tasks, exceptions |
| Ground operations coordinator | Assigned operational tasks, shift handover |
| Customer service supervisor | Escalations and service requests |
| Passenger service agent | Intake and follow-up (mobile-first) |
| Maintenance coordinator | Maintenance requests and review items |
| Safety / quality reviewer | Incidents, inspections, evidence |
| Analyst | Reporting and readiness gaps |
| Tenant admin | Users, roles, mappings |
| CyberCrow security reviewer | Access review and incident evidence |

---

## 7. CyberCrow posture (Part 6)

**Baselines (10):** unauthorized role/access change, service request manipulation, safety underreporting, maintenance request gaps, passenger/customer data exposure, supplier approval abuse, workforce/shift misuse, service escalation audit gaps, privileged admin misuse, branch/station access anomalies.

**Evidence readiness (advisory):** service request trail, customer escalation record, ground operation task trail, maintenance request record, safety incident report, quality/service review record, supplier approval trail, access review, monthly operations report.

**Not claimed:** live SIEM, unattended automated approvals as live, regulatory certification, guaranteed compliance, autonomous AI.

---

## 8. Najm organic intake hardening (Part 7)

| Check | Result |
|-------|--------|
| Aviation sector guidance exists | `sector-guidance.ts` + `aviation.json` |
| Organic path discovery → blueprint | Blueprint notes + F11 E2E pattern |
| No tenant implied unless provisioned | Blueprint + F11 scope unchanged |
| No production/customer claim | Synthetic F11 payload notes; forbidden-claim verify |
| `f11-najm-payload.json` industry | `aviation` |
| No Najm tenant provisioned in F35 | Read-only verification only |

---

## 9. Verification (Part 8)

| Command | Purpose |
|---------|---------|
| `npm run aviation:verify` | Read-only template, modules, Najm payload, guidance claims, leakage |
| `npm run request:e2e:dry` | All sector discovery JSON packs including aviation |
| `npm run mock:verify` | Mock shape integrity |
| `npm run request:pipeline:verify` | Pipeline copy includes aviation guidance |

Optional operator commands (not required for F35 pass): `npm run db:seed:sectors`, F11 browser E2E on staging.

---

## 10. Public wording (Part 9)

Hero **Aviation** chip unchanged. No new public customer, Najm-as-customer, compliance certification, or live-tenant claims. Internal/docs use “validated operating model”, “staging/demo validated”, “aviation operating model readiness”.

---

## 11. Validation results (Part 10)

Run on 26 May 2026:

| Command | Result |
|---------|--------|
| `npm run aviation:verify` | PASSED |
| `npm run mock:verify` | PASSED |
| `npm run typecheck` | PASSED |
| `npm run lint` | PASSED |
| `npm run build` | PASSED |
| `npm run public:mirror-manifest` | PASSED |
| `npm run request:e2e:dry` | PASSED |
| `npm run request:pipeline:verify` | PASSED |

---

## 12. Deferred items

| Item | Reason |
|------|--------|
| Dedicated Najm staging tenant | Out of scope — F11 validates organic path without provision |
| Flight operations / airport system integrations | Future readiness keys only |
| Live compliance integrations | Future readiness only |
| Automatic tenant creation from blueprint | Out of scope (F9 idempotent accept only) |
| Production launch / paid infra | F23 deferred gate |

---

## 13. F35 decision

**PASSED** — All acceptance criteria met: documented audit, deepened template, discovery and blueprint guidance, SAREA and CyberCrow models, Najm intake assumptions validated via read-only scripts, validation green, no forbidden scope added.
