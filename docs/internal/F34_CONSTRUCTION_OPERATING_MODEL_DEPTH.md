# F34 — Construction operating model depth & Rimal hardening

**Phase:** F34  
**Constraint:** No paid infrastructure · no production launch · no live payments · no external APIs · no schema changes  
**Status:** Passed (26 May 2026) — validation commands run locally

---

## 1. Objective

Make **Construction** a first-class Crow operating model — reusable for discovery, org intelligence, blueprint readiness, SAREA personas, CyberCrow advisory posture, and the **Rimal** staging tenant (`rimal-construction`). This is **operator-managed readiness**, not a production customer claim.

---

## 2. Construction audit (Part 1)

| Area | Strength before F34 | Gaps addressed |
|------|---------------------|----------------|
| **Sector template** | Thin model (9 depts, 7 roles, 4 workflows) | Deepened to 12 departments, 16 roles, 16 workflows, 7 approval chains |
| **Discovery guidance** | Short anti-logistics bullets | Full project/site/procurement/HSE/document/cost guidance |
| **Discovery JSON** | Legacy equipment-focused depts; SAP/Procore as if live | Aligned to template; ERP/PMIS as future readiness |
| **Blueprint / org intelligence** | Generic construction notes | Blueprint notes for modules, Rimal staging, sector isolation |
| **Rimal seed** | `RIMAL_MODULE_KEYS` without logistics | Verified ⊆ construction CEM set; no logistics/warehouse |
| **SAREA** | Four template profiles; five preview personas on tenant | Ten SAREA profile hints; RBAC unchanged |
| **CyberCrow** | Two generic baselines | Construction-specific purchase, supplier, material, HSE, document, variation baselines |
| **Verification** | `tenant:verify:rimal` only | Added `npm run construction:verify` (read-only) |
| **Public / hero** | Construction chip already present | No customer or Rimal-as-customer claims |

**Rimal-specific vs reusable**

| Rimal-specific | Reusable across construction tenants |
|----------------|--------------------------------------|
| Tenant slug `rimal-construction`, reference `CROW-2026-RIMAL` | Department/role/workflow catalog |
| Staging seed `tenant:seed:rimal` | `CONSTRUCTION_RECOMMENDED_*` module exports |
| Five SAREA preview personas (shared keys with MEEM pattern) | CyberCrow baseline library |
| Module set without logistics stack | Discovery template `construction.json` |

**Demo / staging only:** Rimal naming in guidance (“staging tenant”) — not “live customer” or “trusted by Rimal”.

**Leakage checks:** Construction model excludes logistics dispatch/fleet department names and retail store/merchandising names. CEM recommendations exclude `logistics` and `warehouse` (materials use `inventory` only).

---

## 3. Sector template (Part 2)

**Primary source:** `src/lib/org-intelligence/sector-template-data.ts` — `CONSTRUCTION` + catalog entry

**Exports:**

- `CONSTRUCTION_RECOMMENDED_CEM_MODULE_KEYS` — procurement, inventory, finance, hr, crm, sales, approvals, bi
- `CONSTRUCTION_RECOMMENDED_ERP_MODULE_KEYS` — same + `tasks`, `reports`
- `CONSTRUCTION_FUTURE_READINESS_KEYS` — document management, BIM, equipment tracking, subcontractor portal, field mobile app, advanced scheduling (**not live**)

### Departments (12)

Executive Office · Project Management · Site Operations · Engineering / Technical Office · Procurement / Supplier Management · Materials / Inventory Control · Finance / Cost Control · HR / Workforce · Health, Safety & Environment · Quality Control · Document Control · IT & Security · CyberCrow Security

### Roles (16)

Executive / Owner · Project Manager · Site Manager · Site Engineer · Technical Office Engineer · Procurement Specialist · Materials Controller · Finance / Cost Controller · HR Coordinator · HSE Officer · Quality Inspector · Document Controller · IT / Security Administrator · Analyst · Tenant Admin · CyberCrow Security Reviewer

### Workflows (16)

Project kickoff · Site mobilization · Material request · Purchase request · Supplier approval · Material receiving · Site task assignment · Daily site report · HSE incident report · Quality inspection · Variation / change request · Document submission / approval · Cost review · Workforce request · Monthly project performance review · Access / role review

### Approval chains (7)

Material request · Purchase request · Supplier approval · Variation / change · Document approval · HSE incident · Access review

---

## 4. Discovery guidance (Part 3)

**File:** `src/lib/discovery-intelligence/sector-guidance.ts` — `construction` block

Covers: project and site counts, project types, procurement/subcontractor process, material receiving, site tasks and daily reporting, HSE and quality, document approvals, variations, workforce, cost reporting, CyberCrow evidence examples, honest Rimal staging note.

---

## 5. Blueprint readiness (Part 4)

Blueprint notes include: recommended live modules, future readiness keys, org intelligence accept path, Rimal staging alignment without logistics stack, sector confirmation to avoid logistics/retail leakage. Idempotent blueprint behavior unchanged (F9). Tenants are not created automatically on accept.

---

## 6. SAREA persona model (Part 5)

**Template hints (10 profiles):** executive, project manager, site manager, site engineer, procurement, materials controller, HSE/quality reviewer, analyst, tenant admin, CyberCrow security.

**Tenant preview personas (unchanged keys):** five keys in `SAREA_PREVIEW_PERSONA_KEYS` — materialized for Rimal via `npm run tenant:verify:rimal` when staging DB is available.

SAREA shapes experience only; RBAC still controls access.

---

## 7. CyberCrow posture (Part 6)

**Baselines (13):** unauthorized purchase, supplier approval abuse, material receiving fraud, material adjustment abuse, document approval gap, HSE underreport, quality gap, site access anomaly, role change abuse, variation abuse, project data exposure, site access (advisory), vendor trust (advisory).

**Evidence readiness (advisory):** material request approval trail, purchase request review, supplier approval evidence, material receiving record, HSE incident report, quality inspection record, document approval trail, variation approval, access review, monthly project report.

**Not claimed:** live SIEM, autonomous AI, regulatory certification.

---

## 8. Rimal hardening (Part 7)

| Check | Result |
|-------|--------|
| Rimal remains construction-focused | `organization.industry` and org intelligence `construction` — `tenant:verify:rimal` |
| No logistics module on Rimal | Verify script rejects enabled `logistics` |
| Rimal modules ⊆ construction recommendations | `construction:verify` |
| Five SAREA personas tenant-backed | `tenant:verify:rimal` (staging DB) |
| CyberCrow audit logs present | `tenant:verify:rimal` |
| CEM departments/roles/workflows | `tenant:verify:rimal` |
| No destructive reset in F34 | Read-only verification only |

**Note:** Rimal staging enables `sales`, `finance`, `procurement`, `hr`, `tasks`, `reports`, `crm` — not `inventory` in the constant set (materials readiness via template without requiring inventory on the demo tenant).

---

## 9. Verification (Part 8)

| Command | Purpose |
|---------|---------|
| `npm run construction:verify` | Read-only template, modules, Rimal alignment, guidance claims, leakage |
| `npm run tenant:verify:rimal` | Staging tenant isolation, SAREA, CEM, CyberCrow (DB read) |
| `npm run mock:verify` | Mock shape includes construction-scoped Rimal modules |
| `npm run request:pipeline:verify` | Pipeline copy includes construction guidance |

Optional operator commands (not required for F34 pass): `npm run db:seed:sectors`, `npm run sarea:meem-verify` (MEEM cross-check only).

---

## 10. Public wording (Part 9)

Hero **Construction** chip unchanged. No new public customer, compliance, or live-tenant claims. Internal/docs use “validated operating model”, “staging/demo validated”, “project operations readiness”.

---

## 11. Validation results (Part 10)

Run on 26 May 2026:

| Command | Result |
|---------|--------|
| `npm run construction:verify` | PASSED |
| `npm run mock:verify` | PASSED |
| `npm run typecheck` | PASSED |
| `npm run lint` | PASSED |
| `npm run build` | PASSED |
| `npm run public:mirror-manifest` | PASSED |
| `npm run tenant:verify:rimal` | PASSED (staging DB) |
| `npm run request:pipeline:verify` | PASSED |

---

## 12. Deferred items

| Item | Reason |
|------|--------|
| Live `inventory` on Rimal tenant | Optional; template recommends for materials readiness; Rimal set stays lean |
| Document management / BIM modules | Future readiness keys only |
| `apply-plan-depth` construction trim keys | Not required; construction uses default plan limits |
| Automatic tenant creation from blueprint | Out of scope (F9 idempotent accept only) |
| Production launch / paid infra | F23 deferred gate |

---

## 13. F34 decision

**PASSED** — All acceptance criteria met: documented audit, deepened template, discovery and blueprint guidance, SAREA and CyberCrow models, Rimal assumptions validated via read-only scripts, validation green, no forbidden scope added.
