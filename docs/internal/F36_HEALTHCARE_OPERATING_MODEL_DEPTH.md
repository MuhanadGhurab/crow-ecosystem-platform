# F36 — Healthcare operating model depth & privacy/safety readiness

**Phase:** F36  
**Constraint:** No paid infrastructure · no production launch · no live payments · no external APIs · no schema changes  
**Status:** Passed (26 May 2026) — validation commands run locally

---

## 1. Objective

Make **Healthcare** a first-class Crow operating model — reusable for discovery, org intelligence, blueprint readiness, SAREA personas, and CyberCrow **privacy/evidence** advisory posture. This is **clinic/healthcare operations readiness**, not an EMR/EHR, clinical decision tool, certified compliance product, or live patient-data platform. **No public hero chip** added in F36 (model must stay wording-safe).

---

## 2. Healthcare audit (Part 1)

| Area | Strength before F36 | Gaps addressed |
|------|---------------------|----------------|
| **Sector template** | Thin model (6 depts, 3 roles, 2 workflows; HIPAA on compliance role) | Deepened to 14 departments, 17 roles, 13 workflows, 6 approval chains |
| **Discovery guidance** | Limited facility/service breadth | Facility type, branches, patient service, appointments, workforce, supplies, safety, privacy, reporting, CyberCrow |
| **Discovery JSON** | Legacy clinical admission pack; `ncaAlignment: "aligned"`; extra modules | Aligned to template; `readiness_notes_only`; EMR/clinical boundary in notes |
| **Blueprint / org intelligence** | Generic healthcare notes | Blueprint notes for modules, privacy/safety, sector isolation |
| **SAREA** | Few template profiles | Thirteen SAREA profile hints; RBAC unchanged |
| **CyberCrow** | Two generic baselines | Ten healthcare-specific baselines (access, patient data, appointments, safety, supplier, billing, audit) |
| **Verification** | `request:e2e:dry` only (all sectors) | Added `npm run healthcare:verify` (read-only) |
| **Public / hero** | No healthcare chip (intentional) | Unchanged — no hospital-as-customer or certification claims |

**Must remain future-only**

| Future readiness | Not live in F36 |
|------------------|-----------------|
| EMR/EHR integration | `HEALTHCARE_FUTURE_READINESS_KEYS` |
| Appointment / pharmacy / lab / insurance systems | Same |
| Patient portal, clinical decision support, medical device IoT | Same |
| Advanced healthcare compliance automation | Same |

**Leakage checks:** Healthcare model excludes logistics dispatch/fleet/warehouse, retail store/merchandising, construction site/project/document-control, and aviation ground/passenger/aviation-ops department names. CEM recommendations exclude `logistics`, `warehouse`, and `inventory`.

---

## 3. Sector template (Part 2)

**Primary source:** `src/lib/org-intelligence/sector-template-data.ts` — `HEALTHCARE` + catalog entry

**Exports:**

- `HEALTHCARE_RECOMMENDED_CEM_MODULE_KEYS` — crm, sales, procurement, finance, hr, approvals, bi
- `HEALTHCARE_RECOMMENDED_ERP_MODULE_KEYS` — same + `tasks`, `reports`
- `HEALTHCARE_FUTURE_READINESS_KEYS` — emr_ehr, appointment_system, pharmacy_system, insurance, patient_portal, lab_system, clinical_decision_support, medical_device_iot, advanced_healthcare_compliance_automation (**not live**)

### Departments (14)

Executive Office · Clinic / Healthcare Operations · Patient Services · Appointment / Front Desk Coordination · Medical Staff Coordination · Nursing / Care Coordination · Pharmacy / Supplies Readiness · Procurement / Supplier Management · Finance / Billing Coordination · HR / Workforce · Quality / Patient Safety · Privacy / Compliance · IT / CyberCrow Security · Reporting / Analytics

### Roles (17)

Executive Viewer / Owner · Healthcare Operations Manager · Clinic Manager · Front Desk Coordinator · Patient Service Agent · Medical Staff Coordinator · Nursing Coordinator · Pharmacy / Supplies Coordinator · Procurement Specialist · Finance Coordinator · HR Coordinator · Quality / Safety Reviewer · Privacy / Compliance Reviewer · IT / Security Administrator · Analyst · Tenant Admin · CyberCrow Security Reviewer

### Workflows (13)

Patient service request intake · Appointment request coordination · Patient issue escalation · Staff schedule / workforce request · Supplies request · Supplier purchase request · Incident / safety report · Quality review · Privacy access review · Billing / finance review · Role / access change review · Monthly healthcare operations report · CyberCrow incident review

### Approval chains (6)

Patient service · Appointment · Supplies · Supplier · Safety incident · Access review

---

## 4. Discovery guidance (Part 3)

**File:** `src/lib/discovery-intelligence/sector-guidance.ts` — `healthcare` block

Covers: facility type and branch count, patient/customer service and escalation, appointment/request process, staff scheduling, supplies/procurement, incident/safety reporting, privacy/access concerns, quality review, reporting needs, CyberCrow evidence examples. Business-friendly wording; **no medical advice**; does not imply EMR/EHR replacement. Explicit **do not claim** list for HIPAA, NPHIES, clinical certification, live patient-data guarantees, SIEM replacement, autonomous AI.

---

## 5. Blueprint readiness (Part 4)

Blueprint notes include: recommended live modules, future readiness keys, org intelligence accept path, privacy/safety readiness, sector confirmation to avoid logistics/retail/construction/aviation leakage. Idempotent blueprint behavior unchanged (F9). Tenants are not created automatically on accept.

---

## 6. SAREA persona model (Part 5)

**Template hints (13 profiles):** executive operations health, healthcare operations control board, clinic manager workspace, front desk / patient services queue, medical staff coordination, nursing / care coordination, pharmacy / supplies readiness, quality / safety evidence, privacy / compliance review, analyst reporting, tenant admin, CyberCrow security.

SAREA shapes experience only; RBAC still controls access.

| Persona | Experience focus |
|---------|------------------|
| Executive / owner | Operations health, safety open items, privacy posture (advisory) |
| Healthcare operations manager | Workflows, service tasks, exceptions |
| Clinic manager | Clinic backlog, staffing, supplies |
| Front desk / patient services | Intake, appointments, escalations |
| Medical staff coordinator | Staff requests and coverage |
| Nursing / care coordinator | Care coordination tasks |
| Supplies / pharmacy coordinator | Supplies requests and review |
| Quality / safety reviewer | Incidents, quality reviews, evidence |
| Privacy / compliance reviewer | Access reviews, policy alignment (advisory) |
| Analyst | Reporting and readiness gaps |
| Tenant admin | Users, roles, mappings |
| CyberCrow security reviewer | Access review and incident evidence |

---

## 7. CyberCrow posture (Part 6)

**Baselines (10):** unauthorized access to sensitive records · role/access change abuse · patient/customer data exposure · appointment/request manipulation · safety incident underreporting · supplier/procurement abuse · billing/finance review gaps · access audit gaps · privileged admin misuse · branch/location access anomalies

**Evidence readiness (advisory):** access review record · role change approval trail · patient service escalation record · appointment/request trail · incident/safety report · quality review record · supplier approval trail · finance/billing review · monthly operations report

**Not claimed:** HIPAA compliance · NPHIES integration · medical compliance certification · clinical safety certification · live patient-data protection guarantee · SIEM replacement · autonomous AI detection as live

**Language used:** privacy readiness · evidence readiness · advisory posture · operator-managed controls

---

## 8. Privacy / safety readiness (Part 7)

| Theme | F36 posture |
|-------|-------------|
| Patient data | No real patient data; blueprint notes segregate service/billing/HR datasets |
| Clinical systems | EMR/EHR, lab, pharmacy integrations are **future-only** keys |
| Medical advice | No clinical decision or treatment features |
| Compliance | `readiness_notes_only` in discovery JSON; privacy role uses advisory alignment wording |
| Safety | Incident/safety workflows for **operator evidence**, not certified clinical safety |

---

## 9. Verification (Part 8)

| Command | Purpose |
|---------|---------|
| `npm run healthcare:verify` | Read-only template, modules, future keys, guidance claims, sector leakage |
| `npm run request:e2e:dry` | All sector discovery JSON packs including healthcare |
| `npm run mock:verify` | Mock shape integrity |
| `npm run request:pipeline:verify` | Pipeline copy includes healthcare guidance |

Optional operator command (not required for F36 pass): `npm run db:seed:sectors` (idempotent; operator-approved).

---

## 10. Public wording (Part 9)

**No healthcare hero chip added** in F36. When added later, use **Healthcare operations** only. Do not say: hospitals as customers · live healthcare tenants · certified healthcare compliance · patient data platform · EMR/EHR replacement.

---

## 11. Validation results (Part 10)

Run on 26 May 2026:

| Command | Result |
|---------|--------|
| `npm run healthcare:verify` | PASSED |
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
| Public hero healthcare chip | Deferred until wording review complete |
| EMR/EHR / appointment / pharmacy / lab integrations | Future readiness keys only |
| Live HIPAA/NPHIES/certification claims | Forbidden — advisory only |
| Automatic tenant creation from blueprint | Out of scope (F9 idempotent accept only) |
| Production launch / paid infra | F23 deferred gate |

---

## 13. F36 decision

**PASSED** — All acceptance criteria met: documented audit, deepened template, discovery and blueprint guidance, SAREA and CyberCrow privacy/evidence models, read-only verification, validation green, no forbidden scope or medical/compliance overclaims added.
