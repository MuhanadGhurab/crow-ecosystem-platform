# Role–Capability Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RCM-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Access date** | 2026-07-21 |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [LEARNING-RESEARCH-METHODOLOGY.md](./LEARNING-RESEARCH-METHODOLOGY.md) · [RESEARCH-SOURCE-REGISTER.md](./RESEARCH-SOURCE-REGISTER.md) |
| **Supporting sources** | SRC-001 … SRC-020 (see register) |
| **Limitations** | Roles are research anchors, not job offers; public frameworks overstate requirements; certs listed as **REFERENCE ONLY**; Saudi relevance ≠ endorsement of GHURAVIA by Vision 2030 / NCA / SDAIA; tool lists age quickly |
| **Unresolved dependencies** | Final Route catalogue (LEARNING.1D); Nest prerequisite graph; lab environment standards; bilingual Evidence rubrics; employer interview validation |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A |

## Purpose

Map **example entry / early-career roles** to Horizon-aligned capabilities so Routes can be designed from evidence. This matrix does **not** lock Routes.

## Critical product rule

### One Route ≠ one role

A **Route** is a sequenced learning product (Stages → Missions → Evidence → Unlock). A **role** is a labour-market / framework research anchor.  

- One Route may serve **multiple** related roles (e.g. cloud fundamentals for SysOps and DevOps).  
- One role may require **multiple** Routes or a Cross-Wing path (e.g. Secure software = BUILD + PROTECT capabilities).  
- Nest foundations may precede any role-oriented Route.  
- **No employment promises** — completing Evidence never guarantees hiring, promotion, salary, or visa outcomes.

Strategic Saudi sources (SRC-010…SRC-015) inform **relevance**. They are **not endorsement**.

## Horizons covered

| Horizon | Role IDs in this baseline |
|---------|---------------------------|
| OPERATE | ROLE-001, ROLE-002, ROLE-010 |
| BUILD | ROLE-003, ROLE-004, ROLE-012 |
| ANALYZE | ROLE-005, ROLE-011 |
| PROTECT | ROLE-006, ROLE-007 |
| LEAD | ROLE-008, ROLE-009 |

Capability types (methodology): FOUNDATIONAL · OPERATIONAL · BUILDING · ANALYTICAL · SECURITY · GOVERNANCE · COLLABORATIVE · INTEGRATIVE · SPECIALIST

---

## ROLE-001 — Junior Cloud / SysOps

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-001 |
| **Name** | Junior Cloud / SysOps |
| **Maturity** | Entry / early career |
| **Horizon** | OPERATE |
| **Responsibilities** | Keep cloud or hybrid compute healthy; apply approved changes; escalate incidents; document runbooks |
| **Tasks** | Provision basic VMs/containers under guidance; monitor CPU/disk/network; rotate credentials per policy; apply patches in maintenance windows; file tickets with evidence |
| **Foundational knowledge** | OS processes & filesystems; TCP/IP basics; IAM shared-responsibility model; backup/restore concepts |
| **Skills** | CLI literacy; log triage; infra-as-code reading; cost-aware sizing; change discipline |
| **Tools (examples)** | Linux shell; cloud console/CLI (one provider first); monitoring dashboards; git; ticketing |
| **Evidence learners could produce** | Annotated runbook; IAM least-privilege lab write-up; monitoring alert → triage note; IaC “diff review” checklist |
| **Certs (REFERENCE ONLY)** | Cloud practitioner-level vendor certs; Linux essentials — **not required for Route lock** |
| **Saudi relevance** | High contextual demand via Cloud First Policy (SRC-015) and digital transformation employers (SRC-016); **not endorsement** |
| **International relevance** | High (hyperscaler ops patterns; SRC-006, SRC-009) |
| **Beginner accessibility** | Medium — needs Nest OS/network literacy first |
| **Ethics / safety** | No production access without supervision; never store secrets in Evidence; respect PDPL themes when labs use personal data (SRC-014) |
| **Cross-Wing links** | → ROLE-010 DevOps; → ROLE-007 Security (cloud hardening) |
| **Capability types** | FOUNDATIONAL · OPERATIONAL · COLLABORATIVE |
| **Supporting SRC IDs** | SRC-005, SRC-006, SRC-009, SRC-015, SRC-016 |

---

## ROLE-002 — Network / IT Support Ops

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-002 |
| **Name** | Network / IT Support Ops |
| **Maturity** | Entry |
| **Horizon** | OPERATE |
| **Responsibilities** | First-line connectivity & endpoint support; maintain service desk quality; escalate correctly |
| **Tasks** | Diagnose DNS/DHCP/Wi-Fi issues; image/reset endpoints; apply access rights per policy; document resolutions; coordinate with network/security teams |
| **Foundational knowledge** | OSI/TCP model; directory identity basics; malware hygiene; SLA/priority concepts |
| **Skills** | Structured troubleshooting; clear user communication; remote support etiquette; inventory hygiene |
| **Tools (examples)** | Helpdesk platform; remote support; basic network utilities; MDM/endpoint console (vendor-agnostic concepts) |
| **Evidence learners could produce** | Troubleshooting decision tree; ticket quality rubric sample; network diagram of a lab LAN; phishing-report play |
| **Certs (REFERENCE ONLY)** | CompTIA-style Network+/ITF-level references; vendor networking associate — **reference only** |
| **Saudi relevance** | High ongoing demand in enterprises & public digital services (SRC-016); DigComp safety literacy (SRC-003) |
| **International relevance** | High (universal IT support pattern) |
| **Beginner accessibility** | High |
| **Ethics / safety** | Privacy of user data; no unauthorized scanning; respectful support language |
| **Cross-Wing links** | → ROLE-001 Cloud; → ROLE-006 SOC (escalation handoffs) |
| **Capability types** | FOUNDATIONAL · OPERATIONAL · COLLABORATIVE |
| **Supporting SRC IDs** | SRC-003, SRC-005, SRC-016, SRC-017 |

---

## ROLE-003 — Frontend / Web Developer

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-003 |
| **Name** | Frontend / Web Developer |
| **Maturity** | Entry / early career |
| **Horizon** | BUILD |
| **Responsibilities** | Implement accessible UI; integrate with APIs; maintain client-side quality |
| **Tasks** | Build responsive pages/components; consume REST/JSON; fix UI defects; write basic tests; collaborate via PRs |
| **Foundational knowledge** | HTML/CSS/JS platform model; HTTP status & CORS concepts; accessibility basics; version control |
| **Skills** | Component thinking; debugging DevTools; semantic markup; performance awareness |
| **Tools (examples)** | Browser DevTools; git; package manager; one modern UI framework (scoped in Route design) |
| **Evidence learners could produce** | Deployed static/SPA lab; accessibility checklist evidence; API-consuming UI demo; PR with review notes |
| **Certs (REFERENCE ONLY)** | Optional vendor frontend certificates — **reference only** |
| **Saudi relevance** | Medium–High (digital services & product teams; SRC-016); Vision human-capability context (SRC-010) |
| **International relevance** | High (SRC-008, SRC-007 for secure UI habits) |
| **Beginner accessibility** | High–Medium |
| **Ethics / safety** | No dark patterns; respect user privacy; avoid XSS via OWASP awareness (SRC-007) |
| **Cross-Wing links** | → ROLE-004 Backend; → ROLE-012 Secure software |
| **Capability types** | FOUNDATIONAL · BUILDING · COLLABORATIVE |
| **Supporting SRC IDs** | SRC-007, SRC-008, SRC-010, SRC-016 |

---

## ROLE-004 — Backend / API Developer

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-004 |
| **Name** | Backend / API Developer |
| **Maturity** | Entry / early career |
| **Horizon** | BUILD |
| **Responsibilities** | Design and implement service APIs; persist data safely; observe service health |
| **Tasks** | Implement CRUD endpoints; validate input; authenticate/authorize basic flows; write unit tests; read logs/metrics |
| **Foundational knowledge** | HTTP APIs; data modelling; authn/authz basics; transactional thinking |
| **Skills** | Python or equivalent server language (SRC-008); SQL basics; debugging; API documentation |
| **Tools (examples)** | Language runtime; API client; relational DB; git; container runtime (intro) |
| **Evidence learners could produce** | Documented OpenAPI-style lab API; auth demo write-up; test report; threat notes against OWASP classes |
| **Certs (REFERENCE ONLY)** | Language/vendor associate certs — **reference only** |
| **Saudi relevance** | High in digital product & fintech employers (SRC-016); PDPL awareness for personal data APIs (SRC-014) |
| **International relevance** | High |
| **Beginner accessibility** | Medium |
| **Ethics / safety** | Least privilege; no secret leakage; lawful data handling themes |
| **Cross-Wing links** | → ROLE-003 Frontend; → ROLE-011 Data Engineer; → ROLE-012 Secure software |
| **Capability types** | FOUNDATIONAL · BUILDING · SECURITY |
| **Supporting SRC IDs** | SRC-007, SRC-008, SRC-014, SRC-016 |

---

## ROLE-005 — Data Analyst

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-005 |
| **Name** | Data Analyst |
| **Maturity** | Entry / early career |
| **Horizon** | ANALYZE |
| **Responsibilities** | Turn data into trustworthy insights for decisions; communicate limitations |
| **Tasks** | Clean tabular data; write SQL queries; build dashboards; document metric definitions; flag data-quality issues |
| **Foundational knowledge** | Descriptive stats; joins & grain; bias/quality; chart literacy |
| **Skills** | SQL; spreadsheet/advanced tables; dashboard storytelling; reproducible notebooks (intro) |
| **Tools (examples)** | SQL client; BI tool (vendor-agnostic concepts); Python/pandas intro optional |
| **Evidence learners could produce** | Metric dictionary; dashboard + insight memo; data-quality report; ethics note on personal data |
| **Certs (REFERENCE ONLY)** | Vendor analytics / SQL certificates — **reference only** |
| **Saudi relevance** | High contextual (SDAIA data & AI skills ambition SRC-012; HCDP SRC-010); **not endorsement** |
| **International relevance** | High (WEF analytical skill demand SRC-017) |
| **Beginner accessibility** | Medium |
| **Ethics / safety** | PDPL themes; avoid misleading visuals; no deanonymization attempts |
| **Cross-Wing links** | → ROLE-011 Data Engineer; → ROLE-009 GRC (reporting controls) |
| **Capability types** | FOUNDATIONAL · ANALYTICAL · COLLABORATIVE |
| **Supporting SRC IDs** | SRC-003, SRC-008, SRC-010, SRC-012, SRC-014, SRC-017 |

---

## ROLE-006 — Junior SOC Analyst

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-006 |
| **Name** | Junior SOC Analyst |
| **Maturity** | Entry |
| **Horizon** | PROTECT |
| **Responsibilities** | Triage alerts; follow playbooks; escalate true positives; maintain case notes |
| **Tasks** | Monitor SIEM queues; enrich IOCs; distinguish false positives; escalate with context; participate in post-incident lessons |
| **Foundational knowledge** | CIA triad; common log sources; malware vs misconfig; escalation matrix; NICE/SCyWF defensive role language (summary) |
| **Skills** | Alert triage; timeline construction; clear incident writing; basic network forensics literacy |
| **Tools (examples)** | SIEM console (lab); ticket/IR platform; threat-intel lookup (public); ATT&CK as vocabulary (SRC-020) |
| **Evidence learners could produce** | Triage case file; playbook adherence checklist; false-positive analysis; ATT&CK mapping of a lab scenario |
| **Certs (REFERENCE ONLY)** | Entry cyber certs (e.g. Security+/SSCP-class references) — **reference only; no exam content** |
| **Saudi relevance** | High (SCyWF protection/defense category context SRC-011; workforce gap narratives SRC-018); **not endorsement** |
| **International relevance** | High (NICE PD/IN adjacency SRC-001; CSF Detect/Respond SRC-002) |
| **Beginner accessibility** | Medium — Nest cyber hygiene first; supervised labs only |
| **Ethics / safety** | Defensive scope only; no unauthorized access; careful handling of sensitive logs |
| **Cross-Wing links** | → ROLE-007 Security Engineer; → ROLE-002 Support (escalation) |
| **Capability types** | FOUNDATIONAL · OPERATIONAL · SECURITY · ANALYTICAL |
| **Supporting SRC IDs** | SRC-001, SRC-002, SRC-011, SRC-018, SRC-020 |

---

## ROLE-007 — Security Engineer (entry)

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-007 |
| **Name** | Security Engineer (entry) |
| **Maturity** | Early career |
| **Horizon** | PROTECT |
| **Responsibilities** | Implement and verify security controls; support hardening; assist vulnerability remediation |
| **Tasks** | Baseline hardening checklists; review IAM configs; track vuln remediation; support secure SDLC gates; map controls to outcomes language |
| **Foundational knowledge** | CSF outcomes (SRC-002); OWASP classes (SRC-007); identity fundamentals; vulnerability lifecycle |
| **Skills** | Config review; risk communication; basic scripting for hygiene checks; evidence packaging for audits |
| **Tools (examples)** | Vulnerability scanner (lab); CSPM/IAM console concepts; git secrets scanning intro |
| **Evidence learners could produce** | Hardening baseline report; vuln remediation tracker; control-to-outcome mapping sheet (names only for ECC/CCC — SRC-013) |
| **Certs (REFERENCE ONLY)** | Associate security engineering / cloud security certs — **reference only** |
| **Saudi relevance** | High (SCyWF; ECC/CCC **names** as organizational context SRC-013); **not endorsement** |
| **International relevance** | High (NICE DD/PD adjacency SRC-001) |
| **Beginner accessibility** | Medium–Low without Nest + coding/ops foundations |
| **Ethics / safety** | Authorized testing only; responsible disclosure norms; no real-world exploit payloads in learner Evidence |
| **Cross-Wing links** | → ROLE-012 Secure software; → ROLE-001 Cloud; → ROLE-009 GRC |
| **Capability types** | SECURITY · OPERATIONAL · INTEGRATIVE |
| **Supporting SRC IDs** | SRC-001, SRC-002, SRC-007, SRC-011, SRC-013 |

---

## ROLE-008 — IT Project Coordinator

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-008 |
| **Name** | IT Project Coordinator |
| **Maturity** | Entry / early career |
| **Horizon** | LEAD |
| **Responsibilities** | Coordinate delivery rituals; track risks/issues; keep stakeholders informed |
| **Tasks** | Maintain RAID log; schedule ceremonies; track milestones; prepare status packs; chase dependencies |
| **Foundational knowledge** | Scope/schedule/risk/stakeholder themes (SRC-004 reference only); agile/waterfall literacy; change control |
| **Skills** | Facilitation; written status clarity; dependency mapping; conflict surfacing |
| **Tools (examples)** | Work tracker; docs/wiki; simple Gantt or board; meeting notes templates |
| **Evidence learners could produce** | Project charter lite; RAID log sample; stakeholder map; retrospective notes |
| **Certs (REFERENCE ONLY)** | CAPM/PMI-ACP/PRINCE2 Foundation-class references — **reference only; no proprietary content copied** |
| **Saudi relevance** | High in transformation programs (SRC-010, SRC-016) |
| **International relevance** | High |
| **Beginner accessibility** | High |
| **Ethics / safety** | Honest status (no greenwashing); respect confidentiality of programme data |
| **Cross-Wing links** | → ROLE-009 GRC; → any delivery Route as collaborative layer |
| **Capability types** | GOVERNANCE · COLLABORATIVE · FOUNDATIONAL |
| **Supporting SRC IDs** | SRC-004, SRC-005, SRC-010, SRC-016 |

---

## ROLE-009 — Risk / GRC Junior

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-009 |
| **Name** | Risk / GRC Junior |
| **Maturity** | Entry / early career |
| **Horizon** | LEAD (governance emphasis; interfaces PROTECT) |
| **Responsibilities** | Support policy awareness, risk registers, and control evidence collection |
| **Tasks** | Draft risk entries; map controls to frameworks at **name/outcome** level; gather audit evidence packages; track exceptions |
| **Foundational knowledge** | Risk likelihood/impact; CSF Govern function themes (SRC-002); privacy themes (SRC-014); national control **names** (SRC-013) |
| **Skills** | Precise writing; evidence traceability; stakeholder interviewing; issue tracking |
| **Tools (examples)** | GRC/register spreadsheet; policy wiki; evidence vault (lab) |
| **Evidence learners could produce** | Mini risk register; control mapping table (framework names only); audit evidence index; exception request draft |
| **Certs (REFERENCE ONLY)** | Entry GRC/audit awareness certs — **reference only** |
| **Saudi relevance** | High contextual (ECC/CCC names; PDPL; SCyWF GRCL category) — **not endorsement** |
| **International relevance** | High (CSF 2.0 Govern) |
| **Beginner accessibility** | Medium |
| **Ethics / safety** | No fabrication of compliance evidence; clear limitation statements |
| **Cross-Wing links** | → ROLE-007 Security Engineer; → ROLE-008 Project Coordinator |
| **Capability types** | GOVERNANCE · ANALYTICAL · COLLABORATIVE · SECURITY |
| **Supporting SRC IDs** | SRC-002, SRC-011, SRC-013, SRC-014, SRC-018 |

---

## ROLE-010 — DevOps Associate

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-010 |
| **Name** | DevOps Associate |
| **Maturity** | Early career |
| **Horizon** | OPERATE (primary) · BUILD (secondary) — **Cross-Wing candidate** |
| **Responsibilities** | Automate build/deploy/observe loops; improve feedback speed safely |
| **Tasks** | Maintain CI pipelines; containerize simple apps; manage env configs; add basic observability; participate in blameless reviews |
| **Foundational knowledge** | Git branching; CI/CD stages; containers vs VMs; progressive delivery concepts |
| **Skills** | Pipeline authoring (intro); Dockerfile literacy; infra-as-code reading; incident learning |
| **Tools (examples)** | git + CI system; container runtime; Kubernetes concepts (SRC-009); observability stack intro |
| **Evidence learners could produce** | Working pipeline demo; containerized sample app; deployment runbook; failure postmortem lite |
| **Certs (REFERENCE ONLY)** | Kubernetes/app delivery associate certs — **reference only** |
| **Saudi relevance** | Medium–High (cloud transformation SRC-015/016); community signals SRC-019 supplementary |
| **International relevance** | High |
| **Beginner accessibility** | Medium–Low (needs ROLE-001/004 foundations) |
| **Ethics / safety** | No secrets in repos; change windows; production blast-radius awareness |
| **Cross-Wing links** | Explicit Cross-Wing: OPERATE × BUILD; → ROLE-012 Secure software (supply chain) |
| **Capability types** | OPERATIONAL · BUILDING · INTEGRATIVE · COLLABORATIVE |
| **Supporting SRC IDs** | SRC-006, SRC-008, SRC-009, SRC-015, SRC-016, SRC-019 |

---

## ROLE-011 — Data Engineer Junior

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-011 |
| **Name** | Data Engineer Junior |
| **Maturity** | Early career |
| **Horizon** | ANALYZE (primary) · BUILD (secondary) |
| **Responsibilities** | Build reliable data pipelines; ensure schemas & quality gates |
| **Tasks** | Ingest batch data; transform/clean; publish curated tables; monitor pipeline failures; document lineage lite |
| **Foundational knowledge** | Relational modelling; ETL vs ELT; idempotency; data contracts intro |
| **Skills** | SQL + Python scripting; scheduling basics; testing data assumptions |
| **Tools (examples)** | Warehouse/lake concepts; orchestration intro; git; cloud storage |
| **Evidence learners could produce** | Pipeline diagram + code lab; data contract stub; quality test suite; failure alert note |
| **Certs (REFERENCE ONLY)** | Cloud data-engineer associate tracks — **reference only** |
| **Saudi relevance** | High contextual (SDAIA strategy skills pillar SRC-012); **not endorsement** |
| **International relevance** | High |
| **Beginner accessibility** | Medium–Low |
| **Ethics / safety** | Minimize PII; retention discipline; PDPL themes (SRC-014) |
| **Cross-Wing links** | → ROLE-005 Analyst; → ROLE-004 Backend |
| **Capability types** | BUILDING · ANALYTICAL · OPERATIONAL · FOUNDATIONAL |
| **Supporting SRC IDs** | SRC-006, SRC-008, SRC-012, SRC-014, SRC-016 |

---

## ROLE-012 — Secure Software Engineer

| Field | Value |
|-------|-------|
| **Role ID** | ROLE-012 |
| **Name** | Secure Software Engineer |
| **Maturity** | Early career |
| **Horizon** | BUILD (primary) · PROTECT (secondary) — **Cross-Wing / Secure Extension candidate** |
| **Responsibilities** | Deliver features with security requirements embedded; reduce common vuln classes |
| **Tasks** | Threat-note user stories; apply secure coding checklists; fix OWASP-class issues; review dependencies; support security tests |
| **Foundational knowledge** | OWASP Top 10 (SRC-007); authn/authz; secrets management; secure SDLC gates |
| **Skills** | Secure coding patterns; code review for security; dependency hygiene; clear risk write-ups |
| **Tools (examples)** | SAST/secret scanners (lab); dependency audit; API security test client |
| **Evidence learners could produce** | Before/after vuln fix demo; threat notes on a feature; dependency audit report; secure checklist sign-off |
| **Certs (REFERENCE ONLY)** | Secure coding / CSSLP-class references — **reference only; no proprietary content** |
| **Saudi relevance** | Medium–High (application security demand SRC-016; SCyWF development-adjacent categories SRC-011); **not endorsement** |
| **International relevance** | High (NICE DD adjacency SRC-001) |
| **Beginner accessibility** | Low without prior BUILD foundations |
| **Ethics / safety** | Defensive fixes only; no live exploit kits; responsible disclosure |
| **Cross-Wing links** | Secure Extension pattern: BUILD capability secured by PROTECT practices; → ROLE-007 |
| **Capability types** | BUILDING · SECURITY · INTEGRATIVE · SPECIALIST |
| **Supporting SRC IDs** | SRC-001, SRC-007, SRC-008, SRC-011, SRC-016 |

---

## Matrix index

| Role ID | Name | Horizon | Maturity | Cross-Wing? |
|---------|------|---------|----------|-------------|
| ROLE-001 | Junior Cloud / SysOps | OPERATE | Entry | Partial → DevOps/Sec |
| ROLE-002 | Network / IT Support Ops | OPERATE | Entry | Escalation links |
| ROLE-003 | Frontend / Web Developer | BUILD | Entry | → Secure software |
| ROLE-004 | Backend / API Developer | BUILD | Entry | → Secure software / Data |
| ROLE-005 | Data Analyst | ANALYZE | Entry | → Data eng / GRC |
| ROLE-006 | Junior SOC Analyst | PROTECT | Entry | → Sec eng |
| ROLE-007 | Security Engineer (entry) | PROTECT | Early | → GRC / Cloud |
| ROLE-008 | IT Project Coordinator | LEAD | Entry | Delivery overlay |
| ROLE-009 | Risk / GRC Junior | LEAD | Entry | ↔ PROTECT |
| ROLE-010 | DevOps Associate | OPERATE (+BUILD) | Early | **Yes** |
| ROLE-011 | Data Engineer Junior | ANALYZE (+BUILD) | Early | Partial |
| ROLE-012 | Secure Software Engineer | BUILD (+PROTECT) | Early | **Yes / Secure Extension** |

**Role count:** 12  
**Horizons represented:** OPERATE · BUILD · ANALYZE · PROTECT · LEAD (all)

## How Routes should use this matrix

1. Select **capabilities**, not job titles, when drafting Route Outcomes.  
2. Cite **≥3 SRC IDs** (≥1 Tier 1–3 authoritative/contextual) per methodology.  
3. Keep certifications in learner UI as **optional references**, never as unlock requirements unless separately decided.  
4. State explicitly in learner-facing copy: Routes build evidence of capability — **they are not employment offers**.  
5. Saudi strategic alignment remains **contextual relevance, not endorsement**.

## Review triggers

- NICE / SCyWF edition changes  
- Major OWASP Top 10 revision  
- PDPL implementing-rule updates  
- Founder decision to expand beyond 4–6 launch Routes (portfolio shape target in methodology)
