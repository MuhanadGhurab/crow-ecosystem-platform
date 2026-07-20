# Launch Cross-Wing Study

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CXW-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [LEARNING-RESEARCH-METHODOLOGY.md](../research/LEARNING-RESEARCH-METHODOLOGY.md) · [CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md](../../../governance/cross-wing/CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md) · [ROUTE-CANDIDATE-REGISTER.md](../routes/ROUTE-CANDIDATE-REGISTER.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) |
| **Limitations** | Route candidates remain research-only; public role language may overstate workplace duties; Saudi strategic alignment is relevance assessment only — not endorsement; no employment, certification, or placement promises; Atlas publication and expert panels not yet executed |
| **Unresolved** | GHV.PROGRESSION.1 (Merit / Mastery thresholds affecting Cross-Wing access formula) · GHV.LEARNING.1B (Nest / Evidence architecture detail) · GHV.LEARNING.1C (Graph edges / Atlas drafts) · GHV.LEARNING.1D (final catalogue lock) |
| **Change history** | 1.0.0 — LEARNING.1A research baseline |

## Purpose

Assess Cross-Wing candidates for controlled launch. Select **one** recommended launch Cross-Wing with status **RECOMMENDED — NOT YET LOCKED**. Final lock is deferred to **GHV.LEARNING.1D**. Status in this Gate is never `LOCKED`.

## Cross-Wing definition (research baseline)

A Cross-Wing Route integrates meaningful capability from **two or more Horizons** into one real-world capability statement. It requires:

- Source Horizons and mapped source Routes (`RC-*`)
- Prerequisites / corequisites expressible on the Learning Graph
- An **Integration Mission** that forces combined practice (not sequential topic browsing)
- Capstone **Evidence** that demonstrates integration
- Capability Atlas fields before publication (DEC-015)

Title mashups without Atlas evidence are rejected per RISK-LRN-003.

## Access formula (unchanged)

```text
Cross-Wing Access =
Commercial Entitlement or Merit Grant
AND Required Mastery
AND Required Evidence
AND Integration Readiness
AND Applicable Trust Requirement
```

Exact Mastery / Evidence / Trust thresholds: **PENDING GHV.PROGRESSION.1** and **GHV.LEARNING.1B–1D**.

## Portfolio rule

Controlled launch targets **one** validated Cross-Wing Route (Scope Baseline §3.9). Broader catalogue: POST-LAUNCH PLANNED.

---

## Assessment method (score-ish)

Each candidate receives a qualitative **Integration Score** (0–100) using the methodology spirit (not a formal Route scorecard substitute):

| Band | Range | Meaning |
|------|-------|---------|
| Strong | 85–100 | Prefer for launch |
| Good | 75–84 | Strong alternative |
| Possible | 65–74 | Post-launch or further research |
| Weak | 50–64 | Defer |
| Reject | <50 | Do not pursue as Cross-Wing |

Criteria (informal weights): real-world integration clarity · Evidence feasibility · source Route readiness · lab/cost burden · Saudi + international relevance · ethics/safety · maintenance · expert-review need.

---

## Candidate inventory

| ID | Working title | Source Horizons | Integration Score | Recommendation |
|----|---------------|-----------------|-------------------|----------------|
| **CXW-001** | Secure Application Delivery | BUILD + PROTECT | **89** | **RECOMMENDED — NOT YET LOCKED** (launch) |
| CXW-002 | Cloud Operations with Observability & Reliability | OPERATE + ANALYZE | 82 | RECOMMENDED AS LAUNCH ALTERNATIVE |
| CXW-003 | Data Pipeline with Privacy Controls | ANALYZE + PROTECT | 78 | RECOMMENDED POST-LAUNCH |
| CXW-004 | Digital Transformation Delivery Studio | BUILD + LEAD | 74 | RESEARCH FURTHER / POST-LAUNCH |
| CXW-005 | SOC-informed Incident Response for IT Ops | OPERATE + PROTECT | 80 | RECOMMENDED AS LAUNCH ALTERNATIVE |
| CXW-006 | Cloud-Native Service Reliability Studio | OPERATE + BUILD | 76 | RECOMMENDED POST-LAUNCH |

---

## CXW-001 — Secure Application Delivery

| Field | Content |
|-------|---------|
| **ID** | CXW-001 |
| **Working title** | Secure Application Delivery |
| **Source Horizons** | BUILD · PROTECT |
| **Source Routes** | [RC-BLD-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Web Application Delivery Foundations · [RC-PRT-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Defensive Security Operations Foundations · supporting: [RC-PRT-002](../routes/ROUTE-CANDIDATE-REGISTER.md) Identity & Access Security Foundations (recommended corequisite slice) · [RC-BLD-002](../routes/ROUTE-CANDIDATE-REGISTER.md) Automation & Scripting Foundations (optional parallel) |
| **Integrated capability** | Deliver a web application change safely: build/test, threat-aware design, basic secure config, vulnerability hygiene, and handoff evidence — without claiming full AppSec engineer mastery |
| **Capability type** | INTEGRATIVE · BUILDING · SECURITY |
| **Related roles (illustrative, not employment claims)** | Junior developer with secure delivery duties · DevOps / platform junior contributing to release gates · IT specialist supporting application change windows · security-aware delivery collaborator |
| **Sequential deps** | Nest readiness → BUILD foundation Stages on RC-BLD-001 → selected PROTECT Stages on RC-PRT-001 (secure SDLC / vuln triage concepts) → Cross-Wing Stages → Integration Mission → Capstone Evidence |
| **Parallel deps** | IAM awareness from RC-PRT-002 may run as COREQUISITE / RECOMMENDED graph edges; scripting from RC-BLD-002 as RECOMMENDED |
| **Integration Mission concept** | Ship a small app feature in a controlled lab: implement change, run static/basic dynamic checks, remediate a seeded finding, document residual risk, produce release notes + Evidence pack |
| **Capstone Evidence** | Approved Evidence bundle: repo/lab artifact + threat notes + remediated finding log + secure delivery checklist + short reflection on trade-offs |
| **Tools (examples, not vendor lock)** | Git · local/container app stack · OWASP-oriented checklists · SAST/DAST or dependency scan in free/open tiers · issue tracker template |
| **Ethics / security** | No live attack against third parties; lab-only targets; no credential harvesting; clear misuse boundaries; honesty about residual risk |
| **Saudi relevance** | High — digital service delivery and secure software practices align with national digital / cybersecurity skill directions (relevance only; not endorsement) |
| **International relevance** | High — secure SDLC and release hygiene are recurring employer task patterns globally |
| **Expert-review needs** | Application security practitioner + delivery engineer; Arabic content QA if localized |
| **Cost** | Medium (labs + review capacity) |
| **Maintenance** | Medium–High (tool UIs and vuln patterns drift; treat as Slow-Changing Practice + Fast-Changing Technology slices) |
| **Integration Score** | **89 (Strong)** |
| **Status** | **RECOMMENDED — NOT YET LOCKED** |

### Why recommend CXW-001 for launch

1. Clear real-world capability (secure delivery), not a title mashup.  
2. Maps cleanly to likely launch Routes RC-BLD-001 and RC-PRT-001.  
3. Practical Evidence without requiring a full PROTECT Route redo.  
4. Strong Saudi + international task clarity.  
5. Fits Scope minimum: one Cross-Wing that demonstrates Bridges between Horizons.

### Risks

- Over-scoping into full AppSec / red-team content.  
- Tool churn inflating maintenance.  
- Learners skipping BUILD depth and treating Cross-Wing as a badge shortcut (mitigate via Mastery + Evidence gates — PENDING PROGRESSION.1).

---

## CXW-002 — Cloud Operations with Observability & Reliability

| Field | Content |
|-------|---------|
| **ID** | CXW-002 |
| **Working title** | Cloud Operations with Observability & Reliability |
| **Source Horizons** | OPERATE · ANALYZE |
| **Source Routes** | [RC-OPR-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Cloud Systems Operations Foundations · [RC-ANL-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Practical Data Analysis Foundations · optional: [RC-OPR-002](../routes/ROUTE-CANDIDATE-REGISTER.md) Linux & Network Operations Foundations |
| **Integrated capability** | Operate a cloud service with basic reliability practices: health signals, simple metrics/logs interpretation, incident notes, and improvement backlog |
| **Capability type** | INTEGRATIVE · OPERATIONAL · ANALYTICAL |
| **Related roles** | Cloud / platform junior · SRE-adjacent ops · IT ops with monitoring duties |
| **Sequential deps** | RC-OPR-001 core Stages → analytics literacy Stages from RC-ANL-001 → Integration Mission |
| **Parallel deps** | Linux/network foundations RECOMMENDED for deeper troubleshooting |
| **Integration Mission concept** | Given a failing lab service: collect signals, hypothesize cause, restore within runbook bounds, produce observability dashboard notes + post-incident Evidence |
| **Capstone Evidence** | Runbook excerpt · signal interpretation notes · restored service proof · reliability improvement proposal |
| **Tools** | Managed cloud free tier · metrics/logs stack · alerting rules · diagramming |
| **Ethics / security** | Lab isolation; no production tenant access; careful secret handling in labs |
| **Saudi relevance** | High — cloud adoption and digital infrastructure operations |
| **International relevance** | High — observability/reliability are mainstream ops expectations |
| **Expert-review needs** | Cloud ops + observability practitioner |
| **Cost** | Medium–High (cloud lab spend) |
| **Maintenance** | Medium–High (vendor console drift) |
| **Integration Score** | **82 (Good)** |
| **Status** | RECOMMENDED AS LAUNCH ALTERNATIVE |

**Note:** Strong alternative if BUILD+PROTECT capacity slips; higher ongoing lab cost than CXW-001.

---

## CXW-003 — Data Pipeline with Privacy Controls

| Field | Content |
|-------|---------|
| **ID** | CXW-003 |
| **Working title** | Data Pipeline with Privacy Controls |
| **Source Horizons** | ANALYZE · PROTECT |
| **Source Routes** | [RC-ANL-002](../routes/ROUTE-CANDIDATE-REGISTER.md) Data Engineering Foundations · [RC-PRT-002](../routes/ROUTE-CANDIDATE-REGISTER.md) Identity & Access Security Foundations · privacy/control concepts from PROTECT catalogue · supporting [RC-ANL-001](../routes/ROUTE-CANDIDATE-REGISTER.md) |
| **Integrated capability** | Build or operate a simple pipeline with access controls, minimization, and privacy-aware handling of sample datasets |
| **Capability type** | INTEGRATIVE · ANALYTICAL · SECURITY |
| **Related roles** | Data engineer junior · analytics engineer · privacy-aware data ops collaborator |
| **Sequential deps** | Analysis foundations → data engineering Stages → identity/privacy controls → Integration Mission |
| **Parallel deps** | PROTECT identity Stages as COREQUISITE for access design |
| **Integration Mission concept** | Ingest → transform → serve a dataset with role-based access, retention note, and privacy impact checklist |
| **Capstone Evidence** | Pipeline artifact · access matrix · privacy checklist · incident/abuse scenario response note |
| **Tools** | Lightweight ETL · warehouse/lab DB · IAM stubs · synthetic data only |
| **Ethics / security** | Synthetic/public data only; no real PII; disclose limitations of privacy controls taught |
| **Saudi relevance** | High — data governance and privacy expectations in digital programs (relevance only) |
| **International relevance** | High — privacy-by-design in data work is common |
| **Expert-review needs** | Data engineering + privacy/compliance advisor (external validation later) |
| **Cost** | Medium–High |
| **Maintenance** | Medium (pipeline tools + regulatory language freshness) |
| **Integration Score** | **78 (Good)** |
| **Status** | RECOMMENDED POST-LAUNCH |

**Note:** Depends on RC-ANL-002, which is likely deferred as too advanced for first launch Routes — weakens launch readiness.

---

## CXW-004 — Digital Transformation Delivery Studio

| Field | Content |
|-------|---------|
| **ID** | CXW-004 |
| **Working title** | Digital Transformation Delivery Studio |
| **Source Horizons** | BUILD · LEAD |
| **Source Routes** | [RC-BLD-001](../routes/ROUTE-CANDIDATE-REGISTER.md) · [RC-LED-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Technology Delivery & Risk Foundations · optional [RC-LED-002](../routes/ROUTE-CANDIDATE-REGISTER.md) Digital Service Management Foundations |
| **Integrated capability** | Plan and deliver a small digital change with stakeholder notes, risk register slice, and working increment |
| **Capability type** | INTEGRATIVE · BUILDING · GOVERNANCE · COLLABORATIVE |
| **Related roles** | Delivery analyst · junior PM / coordinator · technologist leading a small initiative |
| **Sequential deps** | Delivery/risk foundations → BUILD delivery Stages → studio Integration Mission |
| **Parallel deps** | Service management concepts RECOMMENDED |
| **Integration Mission concept** | Scoped transformation mini-project: backlog, risk notes, demoable increment, stakeholder Evidence pack |
| **Capstone Evidence** | Charter-lite · risk log · demo recording/notes · retrospective |
| **Tools** | Project board · docs · lightweight app/automation demo |
| **Ethics / security** | Avoid overclaiming transformation outcomes; no consulting promises |
| **Saudi relevance** | High — transformation language is common in public/private programs (relevance only) |
| **International relevance** | Medium–High — delivery + tech change is universal; “transformation” wording varies |
| **Expert-review needs** | Delivery lead + technical coach; risk of vague content without Atlas discipline |
| **Cost** | Medium |
| **Maintenance** | Medium |
| **Integration Score** | **74 (Possible)** |
| **Status** | RESEARCH FURTHER / POST-LAUNCH |

**Note:** Higher risk of title-driven design; keep only if Integration Mission stays concrete.

---

## CXW-005 — SOC-informed Incident Response for IT Ops

| Field | Content |
|-------|---------|
| **ID** | CXW-005 |
| **Working title** | SOC-informed Incident Response for IT Ops |
| **Source Horizons** | OPERATE · PROTECT |
| **Source Routes** | [RC-OPR-001](../routes/ROUTE-CANDIDATE-REGISTER.md) and/or [RC-OPR-002](../routes/ROUTE-CANDIDATE-REGISTER.md) · [RC-PRT-001](../routes/ROUTE-CANDIDATE-REGISTER.md) Defensive Security Operations Foundations · optional [RC-PRT-003](../routes/ROUTE-CANDIDATE-REGISTER.md) Secure Network Defense Foundations |
| **Integrated capability** | Respond to common IT incidents with SOC-aware hygiene: detect/triage basics, contain within policy, escalate, document |
| **Capability type** | INTEGRATIVE · OPERATIONAL · SECURITY |
| **Related roles** | IT operations · helpdesk escalation · junior SOC collaborator · sysadmin with IR duties |
| **Sequential deps** | Ops foundations → defensive security Stages → IR Integration Mission |
| **Parallel deps** | Network defense RECOMMENDED for containment scenarios |
| **Integration Mission concept** | Tabletop + lab: phishing/malware/availability incident; execute playbook steps; produce timeline + Evidence |
| **Capstone Evidence** | Incident timeline · containment actions · escalation note · lessons learned |
| **Tools** | SIEM/lite lab or log samples · ticketing · isolated VMs |
| **Ethics / security** | Lab-only malware samples; strict isolation; no offensive tooling beyond approved IR utilities |
| **Saudi relevance** | High — SOC and critical infrastructure awareness themes |
| **International relevance** | High — IR is a durable ops/security skill |
| **Expert-review needs** | SOC/IR practitioner; safety review mandatory |
| **Cost** | Medium–High (lab isolation + review) |
| **Maintenance** | Medium–High (TTP freshness) |
| **Integration Score** | **80 (Good)** |
| **Status** | RECOMMENDED AS LAUNCH ALTERNATIVE |

**Note:** Excellent Bridge story, but safety/lab burden and PROTECT overlap make it a secondary launch pick versus CXW-001.

---

## CXW-006 — Cloud-Native Service Reliability Studio (optional)

| Field | Content |
|-------|---------|
| **ID** | CXW-006 |
| **Working title** | Cloud-Native Service Reliability Studio |
| **Source Horizons** | OPERATE · BUILD |
| **Source Routes** | [RC-OPR-001](../routes/ROUTE-CANDIDATE-REGISTER.md) · [RC-BLD-001](../routes/ROUTE-CANDIDATE-REGISTER.md) · optional [RC-BLD-002](../routes/ROUTE-CANDIDATE-REGISTER.md) |
| **Integrated capability** | Deploy and operate a small service with CI basics, health checks, and rollback notes |
| **Capability type** | INTEGRATIVE · OPERATIONAL · BUILDING |
| **Related roles** | Platform junior · full-stack with ops duties · DevOps beginner |
| **Sequential deps** | BUILD delivery + OPERATE cloud Stages → Integration Mission |
| **Parallel deps** | Scripting RECOMMENDED |
| **Integration Mission concept** | Containerized service: pipeline, deploy to lab, break/fix, rollback, Evidence pack |
| **Capstone Evidence** | Pipeline config · deploy proof · rollback drill notes |
| **Tools** | Containers · CI · cloud free tier |
| **Ethics / security** | Lab quotas; secret hygiene; no production access |
| **Saudi relevance** | High — cloud-native delivery demand |
| **International relevance** | High |
| **Expert-review needs** | Platform/DevOps coach |
| **Cost** | Medium–High |
| **Maintenance** | High (tooling churn) |
| **Integration Score** | **76 (Good)** |
| **Status** | RECOMMENDED POST-LAUNCH |

**Note:** Complements CXW-001; defer to avoid two BUILD-heavy Cross-Wings at launch.

---

## Launch recommendation

| Decision | Value |
|----------|-------|
| **Selected launch Cross-Wing** | **CXW-001 Secure Application Delivery** |
| **Status** | **RECOMMENDED — NOT YET LOCKED** |
| **Not selected for launch (now)** | CXW-002, CXW-005 as alternatives · CXW-003, CXW-004, CXW-006 post-launch / further research |
| **Atlas** | Required before publication — use [CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md](../../../governance/cross-wing/CROSS-WING-CAPABILITY-ATLAS-TEMPLATE.md) |
| **Final lock Gate** | GHV.LEARNING.1D |
| **Never in this document** | Status `LOCKED` |

### Recommendation conditions (must clear before 1D)

1. Source Routes RC-BLD-001 and RC-PRT-001 remain in launch portfolio (or equivalent Strong replacements).  
2. Integration Mission + Capstone Evidence designs pass expert review.  
3. Lab safety and cost model approved for controlled launch.  
4. Graph edges (`BRIDGE`, `PREREQUISITE`, `COREQUISITE`, `CONVERGENCE`) drafted in LEARNING.1C.  
5. Access formula thresholds resolved via PROGRESSION.1 + LEARNING.1B.

---

## Explicit non-claims

- No Product Code in this Gate.  
- No certification, employer, or government endorsement claims.  
- No employment, salary, or placement promises.  
- Saudi / Vision / national-framework mentions are **relevance assessments only**.

---

## Next Gates

| Gate | Expected Cross-Wing work |
|------|--------------------------|
| GHV.LEARNING.1B | Evidence types and assessment method for CXW-001 |
| GHV.LEARNING.1C | Atlas draft + graph edges |
| GHV.LEARNING.1D | Lock or replace recommendation; never earlier |
| GHV.PROGRESSION.1 | Mastery / Merit / Trust thresholds for access formula |
