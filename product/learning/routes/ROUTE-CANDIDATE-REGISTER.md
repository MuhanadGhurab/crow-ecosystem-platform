# Route Candidate Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ROUTE-REG-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [ROUTE-SELECTION-SCORECARD.md](./ROUTE-SELECTION-SCORECARD.md) · [DEFERRED-AND-REJECTED-ROUTES.md](./DEFERRED-AND-REJECTED-ROUTES.md) · [LEARNING-RESEARCH-METHODOLOGY.md](../research/LEARNING-RESEARCH-METHODOLOGY.md) |
| **Supporting sources** | SRC-* (plausible IDs pending full RESEARCH-SOURCE-REGISTER) |
| **Limitations** | Candidates are research constructs only; no Product Codes; no certification promises; final Route lock deferred to GHV.LEARNING.1D |
| **Unresolved** | Expert panel review; employer task validation; Arabic content pilot samples |
| **Change history** | 1.0.0 — GHV.LEARNING.1A candidate generation |

## Purpose

Register Horizon Route candidates for GHURAVIA launch research under gate **GHV.LEARNING.1A**. All candidates below are status **RESEARCHED**. Selection scoring lives in the scorecard; this register does **not** use status `LOCKED`.

## Portfolio context

Target shape (methodology): 4–6 complete launch Routes + 1 Cross-Wing + 1 Secure Extension (+ Nest separate). Product Codes are out of scope for 1A.

## Source ID legend (methodology-aligned, provisional)

| ID | Class | Anchor |
|----|-------|--------|
| SRC-001 | Tier 1 | NICE Workforce Framework for Cybersecurity (role/skill language) |
| SRC-002 | Tier 1 | Saudi Cybersecurity Workforce Framework (SCyWF) |
| SRC-003 | Tier 3 | Vision 2030 / Human Capability Development Program (HCDP) themes |
| SRC-004 | Tier 1/5 | OWASP application-security practice patterns |
| SRC-005 | Tier 1 | NIST Cybersecurity Framework (CSF) function language |
| SRC-006 | Tier 3 | SDAIA / national AI & data literacy guidance themes |
| SRC-007 | Tier 4 | Recurring employment patterns — cloud / IT operations |
| SRC-008 | Tier 4 | Recurring employment patterns — software / web delivery |
| SRC-009 | Tier 4 | Recurring employment patterns — data / analytics |
| SRC-010 | Tier 4 | Recurring employment patterns — security operations / IAM |
| SRC-011 | Tier 2 | Linux / networking foundational technology documentation patterns |
| SRC-012 | Tier 2 | Cloud provider foundational operations documentation patterns |
| SRC-013 | Tier 5 | ITIL / digital service management professional practice themes |
| SRC-014 | Tier 5 | Risk / governance professional practice themes (ISO-aligned language, non-cert) |
| SRC-015 | Tier 4 | Recurring employment patterns — endpoint / modern workplace support |

---

## OPERATE Horizon

### RC-OPR-001 — Cloud Systems Operations Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-OPR-001 |
| **Working title** | Cloud Systems Operations Foundations |
| **Horizon** | OPERATE |
| **Route type** | FOUNDATIONAL · OPERATIONAL |
| **Intended learner** | Early-career operators, career changers entering cloud/IT ops, Nest completers aiming at live systems work |
| **Capability statement** | Operate and observe foundational cloud workloads safely: provision within guardrails, monitor health, respond to common incidents, and document changes |
| **Real-world problems** | Broken deployments; noisy alerts; cost/ quota surprises; unclear runbooks; unsafe console changes |
| **Related roles** | Cloud operations associate · Junior SRE / platform ops · IT operations analyst (cloud) |
| **Prerequisites** | Nest digital literacy; basic networking & OS concepts |
| **Corequisites** | Optional: Linux command familiarity (RC-OPR-002 overlap encouraged, not required) |
| **Likely Stages (conceptual)** | Cloud landscape & shared responsibility · Identity & resource basics · Deploy & configure · Observe & alert · Incident & change hygiene · Ops evidence studio |
| **Mission categories** | Guided labs · Scenario triage · Runbook practice · Reflection evidence |
| **Expected Evidence** | Lab completion artifacts · Incident timeline notes · Change log sample · Short ops reflection |
| **Possible capstone** | Stabilize a multi-service sample environment under injected faults (guided) |
| **Tooling** | One primary cloud console (abstracted) · CLI basics · Monitoring dashboards (sandbox) |
| **Lab requirements** | Sandboxed cloud account or local emulator; time-boxed quotas |
| **Content-maintenance burden** | Med |
| **Operational cost** | Med |
| **Accessibility** | Keyboard-friendly labs; captions for demos; RTL-ready copy structure |
| **Safety** | No live production access; secrets never in Evidence; cost/quota guardrails |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — cloud ops demand aligns with digital transformation hiring patterns |
| **International relevance** | High — portable cloud operations fundamentals |
| **Cross-Wing potential** | Med — pairs with BUILD (delivery) and PROTECT (secure ops) |
| **Secure Extension potential** | High — cloud hardening / least-privilege ops extension |
| **Risks** | Vendor UI churn; cost overruns in labs; learners equating Route with certification |
| **Supporting source IDs** | SRC-001 · SRC-002 · SRC-007 · SRC-012 |
| **Status** | RESEARCHED (see scorecard for recommendation band) |

### RC-OPR-002 — Linux & Network Operations Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-OPR-002 |
| **Working title** | Linux & Network Operations Foundations |
| **Horizon** | OPERATE |
| **Route type** | FOUNDATIONAL · OPERATIONAL |
| **Intended learner** | Learners needing durable OS/network literacy before specialist Tracks |
| **Capability statement** | Administer Linux hosts and basic networks for troubleshooting: users/files, services, connectivity, and safe diagnosis |
| **Real-world problems** | “Service down” without diagnosis path; firewall/DNS confusion; permission mishaps; brittle SSH habits |
| **Related roles** | Systems administrator (junior) · Network operations associate · NOC / support engineer |
| **Prerequisites** | Nest; willingness to use terminal |
| **Corequisites** | Optional cloud ops (RC-OPR-001) for hybrid environments |
| **Likely Stages (conceptual)** | Linux mental model · Files users & processes · Networking essentials · Services & logs · Diagnose safely · Ops evidence studio |
| **Mission categories** | Terminal labs · Packet/path scenarios · Log reading · Troubleshooting write-ups |
| **Expected Evidence** | Command history summaries · Network diagram sketch · Root-cause note · Safety checklist |
| **Possible capstone** | Restore connectivity and service health on a broken lab topology |
| **Tooling** | Linux VM/container · Packet tools (lab) · SSH · Basic monitoring |
| **Lab requirements** | Isolated VMs; no outbound risky scanning |
| **Content-maintenance burden** | Low |
| **Operational cost** | Low–Med |
| **Accessibility** | Terminal alternatives with guided UI where possible; screen-reader notes for key flows |
| **Safety** | Lab-only networks; no offensive tooling; privilege escalation taught as risk awareness only |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — foundational for SOC/ops/IT pathways |
| **International relevance** | High |
| **Cross-Wing potential** | High — underpins BUILD, ANALYZE pipelines, PROTECT |
| **Secure Extension potential** | High — hardened Linux / network defense bridge |
| **Risks** | Perceived as “too classical”; depth creep into advanced admin |
| **Supporting source IDs** | SRC-001 · SRC-002 · SRC-011 · SRC-007 |
| **Status** | RESEARCHED (see scorecard) |

### RC-OPR-003 — Modern Workplace & Endpoint Operations

| Field | Content |
|-------|---------|
| **ID** | RC-OPR-003 |
| **Working title** | Modern Workplace & Endpoint Operations |
| **Horizon** | OPERATE |
| **Route type** | FOUNDATIONAL · OPERATIONAL |
| **Intended learner** | Service-desk to endpoint ops learners; workplace IT support pathways |
| **Capability statement** | Support modern workplace endpoints and identity-linked devices: join/manage, remediate common issues, escalate with evidence |
| **Real-world problems** | Device compliance failures; identity/device mismatch; patch fatigue; poor ticket quality |
| **Related roles** | Endpoint support specialist · Modern workplace associate · IT support engineer |
| **Prerequisites** | Nest; basic identity concepts |
| **Corequisites** | Identity security awareness (RC-PRT-002 synergy) |
| **Likely Stages (conceptual)** | Workplace stack overview · Identity & device trust · Endpoint lifecycle · Common remediations · Escalation quality · Ops evidence studio |
| **Mission categories** | Ticket simulations · Device policy labs · Communication practice · Evidence packs |
| **Expected Evidence** | Ticket write-up · Remediation steps log · Escalation brief · Learner reflection |
| **Possible capstone** | Resolve a multi-symptom endpoint/identity incident with clean handoff |
| **Tooling** | MDM/endpoint sandbox (abstracted) · Identity admin (lab) · Ticketing mock |
| **Lab requirements** | Managed lab tenants; synthetic users/devices |
| **Content-maintenance burden** | High |
| **Operational cost** | Med–High |
| **Accessibility** | Strong for non-CLI learners; mobile-friendly reading |
| **Safety** | No real employee data; privacy-preserving scenarios |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — large workplace digitization footprint |
| **International relevance** | Med–High — vendor stacks vary |
| **Cross-Wing potential** | Med — LEAD (service) · PROTECT (identity) |
| **Secure Extension potential** | Med — endpoint hardening extension |
| **Risks** | Vendor churn; console-specific content aging fast |
| **Supporting source IDs** | SRC-002 · SRC-003 · SRC-015 · SRC-010 |
| **Status** | RESEARCHED (see scorecard) |

---

## BUILD Horizon

### RC-BLD-001 — Web Application Delivery Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-BLD-001 |
| **Working title** | Web Application Delivery Foundations |
| **Horizon** | BUILD |
| **Route type** | FOUNDATIONAL · BUILDING |
| **Intended learner** | Aspiring web developers; builders who need shippable, evidence-backed delivery habits |
| **Capability statement** | Deliver a simple web application end-to-end: structure, basic interactivity, version control, and safe publish to a sandbox |
| **Real-world problems** | Tutorial sprawl without delivery; broken deploys; no repo hygiene; inaccessible UI; secrets in code |
| **Related roles** | Junior web developer · Frontend associate · Full-stack trainee |
| **Prerequisites** | Nest; basic HTML/CSS literacy or Nest bridge module |
| **Corequisites** | Optional automation basics (RC-BLD-002) |
| **Likely Stages (conceptual)** | Web delivery map · Markup & structure · Interactivity basics · Repo & collaboration · Deploy sandbox · Builder evidence studio |
| **Mission categories** | Build labs · Review checklists · Deploy Missions · Accessibility passes |
| **Expected Evidence** | Repo link (sandbox) · Deploy URL · Accessibility notes · Build retrospective |
| **Possible capstone** | Ship a small public-facing app meeting a defined acceptance checklist |
| **Tooling** | Modern web toolchain (one curated stack) · Git · Hosting sandbox |
| **Lab requirements** | Browser-based IDE or local setup guide; hosting credits capped |
| **Content-maintenance burden** | Med–High |
| **Operational cost** | Med |
| **Accessibility** | First-class: semantic HTML taught as Evidence criterion |
| **Safety** | No production customer data; dependency/security hygiene basics; no cert claims |
| **Arabic feasibility** | High (RTL UI patterns included) |
| **Saudi relevance** | High — digital product & SME web demand |
| **International relevance** | High |
| **Cross-Wing potential** | High — OPERATE (hosting) · PROTECT (OWASP basics) · ANALYZE (instrumentation) |
| **Secure Extension potential** | High — secure web delivery extension (OWASP-aligned) |
| **Risks** | Framework fashion cycles; over-scoping into fullstack specialist Track |
| **Supporting source IDs** | SRC-004 · SRC-008 · SRC-003 · SRC-001 |
| **Status** | RESEARCHED (see scorecard) |

### RC-BLD-002 — Automation & Scripting Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-BLD-002 |
| **Working title** | Automation & Scripting Foundations |
| **Horizon** | BUILD |
| **Route type** | FOUNDATIONAL · BUILDING · OPERATIONAL |
| **Intended learner** | Operators and builders who automate repetitive work safely |
| **Capability statement** | Write and run small scripts to automate repeatable tasks with logging, error handling, and safe secrets handling |
| **Real-world problems** | Manual toil; fragile copy-paste scripts; unlogged failures; credential leakage |
| **Related roles** | Automation junior · DevOps associate (entry) · Ops engineer with scripting |
| **Prerequisites** | Nest; basic CLI comfort |
| **Corequisites** | Linux/ops (RC-OPR-002) recommended |
| **Likely Stages (conceptual)** | Automation mindset · Language basics · Files & APIs · Errors & logging · Safe secrets · Automation evidence studio |
| **Mission categories** | Script labs · Refactor Missions · Failure injection · Peer review |
| **Expected Evidence** | Script repo · Run log · Failure handling note · Safety checklist |
| **Possible capstone** | Automate a multi-step lab workflow with idempotent-ish design and clear logs |
| **Tooling** | One primary scripting language · Local/sandbox runners · Mock APIs |
| **Lab requirements** | Compute sandbox; no privileged host access |
| **Content-maintenance burden** | Med |
| **Operational cost** | Low–Med |
| **Accessibility** | Clear typed examples; optional visual flow diagrams |
| **Safety** | Secrets policy; forbid destructive scripts on real systems |
| **Arabic feasibility** | Med–High (code remains English-dominant; explanations bilingual-ready) |
| **Saudi relevance** | High — ops automation demand across enterprises |
| **International relevance** | High |
| **Cross-Wing potential** | High — OPERATE · ANALYZE · PROTECT pipelines |
| **Secure Extension potential** | Med — secure automation / supply-chain hygiene |
| **Risks** | Language holy wars; scope creep into CI/CD platforms |
| **Supporting source IDs** | SRC-007 · SRC-008 · SRC-001 · SRC-012 |
| **Status** | RESEARCHED (see scorecard) |

### RC-BLD-003 — Mobile App Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-BLD-003 |
| **Working title** | Mobile App Foundations |
| **Horizon** | BUILD |
| **Route type** | FOUNDATIONAL · BUILDING · SPECIALIST-leaning |
| **Intended learner** | Learners targeting mobile product building |
| **Capability statement** | Build and run a simple mobile app in a managed lab: UI basics, navigation, local data, and store-like packaging concepts (no store submission required) |
| **Real-world problems** | Device fragmentation; heavy toolchains; slow feedback loops; store policy confusion |
| **Related roles** | Junior mobile developer · Cross-platform app trainee |
| **Prerequisites** | Nest; programming basics or RC-BLD-001 preferred |
| **Corequisites** | Web delivery foundations recommended |
| **Likely Stages (conceptual)** | Mobile landscape · UI & navigation · Local state · Device services (lab) · Build & package · Mobile evidence studio |
| **Mission categories** | Emulator labs · UI Missions · Debug scenarios · Release checklist (simulated) |
| **Expected Evidence** | Project archive · Emulator demo recording · Checklist · Reflection |
| **Possible capstone** | Deliver a small multi-screen app meeting acceptance criteria in emulator |
| **Tooling** | Mobile IDE · Emulators/simulators · Optional device farm |
| **Lab requirements** | High: emulators, images, possible physical devices; significant CI/agent cost |
| **Content-maintenance burden** | High |
| **Operational cost** | High |
| **Accessibility** | Platform a11y APIs taught; heavier setup barrier |
| **Safety** | No real PII on devices; no unpaid store claims |
| **Arabic feasibility** | Med (RTL mobile patterns needed; tooling English-heavy) |
| **Saudi relevance** | Med–High — consumer app market growth |
| **International relevance** | High |
| **Cross-Wing potential** | Med — PROTECT (mobile threat awareness) |
| **Secure Extension potential** | Med — mobile secure coding extension |
| **Risks** | Lab cost; OS release churn; inequitable device access |
| **Supporting source IDs** | SRC-008 · SRC-004 · SRC-003 |
| **Status** | RESEARCHED (see scorecard) |

---

## ANALYZE Horizon

### RC-ANL-001 — Practical Data Analysis Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-ANL-001 |
| **Working title** | Practical Data Analysis Foundations |
| **Horizon** | ANALYZE |
| **Route type** | FOUNDATIONAL · ANALYTICAL |
| **Intended learner** | Analysts-in-training; operators/builders needing evidence-based decisions |
| **Capability statement** | Turn tabular data into trustworthy insights: clean, explore, visualize, and communicate limitations |
| **Real-world problems** | Spreadsheet chaos; misleading charts; missing lineage; overconfident conclusions |
| **Related roles** | Junior data analyst · Business analyst (data-leaning) · Operations analyst |
| **Prerequisites** | Nest; spreadsheet literacy |
| **Corequisites** | Optional scripting (RC-BLD-002) for scale |
| **Likely Stages (conceptual)** | Questions before queries · Data hygiene · Exploration · Visualization ethics · Narrative & limits · Analysis evidence studio |
| **Mission categories** | Dataset labs · Chart critiques · Briefing Missions · Peer challenge |
| **Expected Evidence** | Cleaned dataset note · Visuals · Insight brief with caveats · Ethics reflection |
| **Possible capstone** | Answer a stakeholder question with a reproducible analysis pack |
| **Tooling** | Spreadsheet + one analysis notebook environment · Charting library |
| **Lab requirements** | Curated public/synthetic datasets; notebook compute soft limits |
| **Content-maintenance burden** | Med |
| **Operational cost** | Low–Med |
| **Accessibility** | Alt text for charts; color-safe palettes required |
| **Safety** | Synthetic/sensitive-data rules; no biometric misuse |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — data-driven public/private transformation |
| **International relevance** | High |
| **Cross-Wing potential** | High — OPERATE metrics · BUILD instrumentation · LEAD reporting |
| **Secure Extension potential** | Med — privacy-preserving analytics extension |
| **Risks** | Tool fashion (BI vendors); shallow “dashboard tourism” |
| **Supporting source IDs** | SRC-006 · SRC-009 · SRC-003 · SRC-001 |
| **Status** | RESEARCHED (see scorecard) |

### RC-ANL-002 — Data Engineering Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-ANL-002 |
| **Working title** | Data Engineering Foundations |
| **Horizon** | ANALYZE |
| **Route type** | FOUNDATIONAL label / advanced practice in reality · ANALYTICAL |
| **Intended learner** | Learners with prior analysis/scripting readiness aiming at pipelines |
| **Capability statement** | Design simple reliable data pipelines: ingest, transform, validate, and schedule with observable failures |
| **Real-world problems** | Broken ETL; silent data quality failures; undocumented schemas; fragile schedules |
| **Related roles** | Junior data engineer · Analytics engineer (entry) |
| **Prerequisites** | Strong: RC-ANL-001 + scripting; SQL comfort |
| **Corequisites** | Cloud ops familiarity |
| **Likely Stages (conceptual)** | Pipeline mental model · Storage & formats · Transform & tests · Orchestration basics · Observability · Data eng evidence studio |
| **Mission categories** | Pipeline labs · Data quality Missions · Failure drills · Architecture sketches |
| **Expected Evidence** | Pipeline repo · Quality report · Runbook · Failure postmortem |
| **Possible capstone** | End-to-end mini-pipeline with tests and alerting on synthetic data |
| **Tooling** | Warehouse/lakehouse sandbox · Orchestrator (lab) · SQL + transform tool |
| **Lab requirements** | Non-trivial cloud/data services; higher cost |
| **Content-maintenance burden** | High |
| **Operational cost** | High |
| **Accessibility** | Steeper cognitive load; needs Nest+ prior Routes |
| **Safety** | No production data mirrors; PII scrubbing taught |
| **Arabic feasibility** | Med (terminology density) |
| **Saudi relevance** | High — national data platforms & enterprise analytics |
| **International relevance** | High |
| **Cross-Wing potential** | High — OPERATE · BUILD · PROTECT (data security) |
| **Secure Extension potential** | High — secure data pipelines |
| **Risks** | Too advanced for launch foundations; premature specialization |
| **Supporting source IDs** | SRC-009 · SRC-006 · SRC-012 · SRC-001 |
| **Status** | RESEARCHED (see scorecard) |

### RC-ANL-003 — Responsible AI Literacy & Applied Analytics

| Field | Content |
|-------|---------|
| **ID** | RC-ANL-003 |
| **Working title** | Responsible AI Literacy & Applied Analytics |
| **Horizon** | ANALYZE |
| **Route type** | FOUNDATIONAL · ANALYTICAL · GOVERNANCE-aware |
| **Intended learner** | Broad professionals needing AI literacy with applied, non-hype analytics use |
| **Capability statement** | Use AI-assisted analytics responsibly: prompt with care, validate outputs, document limits, and apply basic risk controls |
| **Real-world problems** | Hallucinated “insights”; shadow AI; policy gaps; overtrust of model output |
| **Related roles** | AI-aware analyst · Digital professional upskilling · Risk-aware product roles (entry) |
| **Prerequisites** | Nest; RC-ANL-001 recommended |
| **Corequisites** | Organizational policy awareness modules |
| **Likely Stages (conceptual)** | AI landscape without hype · Prompt & verify · Bias & harm patterns · Applied analytics with AI · Governance basics · Responsible evidence studio |
| **Mission categories** | Critique Missions · Verification labs · Policy scenarios · Applied briefings |
| **Expected Evidence** | Verification log · Risk note · Policy-aligned use case · Ethics reflection |
| **Possible capstone** | Deliver an AI-assisted analysis with full human verification trail |
| **Tooling** | Approved AI assistant (sandbox) · Analysis tools · Evaluation rubrics |
| **Lab requirements** | Rate-limited model access; logging of prompts where policy allows |
| **Content-maintenance burden** | High |
| **Operational cost** | Med |
| **Accessibility** | Plain-language first; avoid jargon walls |
| **Safety** | Critical: misuse, privacy, deepfake, overclaim bans; no certification promises |
| **Arabic feasibility** | Med (model quality variance; bilingual evaluation needed) |
| **Saudi relevance** | High — SDAIA-aligned literacy themes; national AI agenda |
| **International relevance** | High — rapidly shifting norms |
| **Cross-Wing potential** | High — all Horizons |
| **Secure Extension potential** | High — secure/responsible AI extension |
| **Risks** | Freshness volatility; marketing pressure; ethics theater without Evidence depth |
| **Supporting source IDs** | SRC-006 · SRC-003 · SRC-009 · SRC-014 |
| **Status** | RESEARCHED (see scorecard) |

---

## PROTECT Horizon

### RC-PRT-001 — Defensive Security Operations Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-PRT-001 |
| **Working title** | Defensive Security Operations Foundations |
| **Horizon** | PROTECT |
| **Route type** | FOUNDATIONAL · SECURITY · OPERATIONAL |
| **Intended learner** | Aspiring defenders; career changers entering SecOps with Nest readiness |
| **Capability statement** | Perform foundational defensive operations: triage alerts, investigate with playbooks, escalate clearly, and preserve Evidence integrity |
| **Real-world problems** | Alert fatigue; weak triage notes; missed escalation; unsafe “curiosity scanning” |
| **Related roles** | SOC analyst (tier-1 style) · Security operations associate · Blue-team trainee |
| **Prerequisites** | Nest; networking/OS basics (RC-OPR-002 strongly recommended) |
| **Corequisites** | Identity foundations (RC-PRT-002) beneficial |
| **Likely Stages (conceptual)** | Defender mindset · Telemetry & alerts · Triage practice · Investigation playbooks · Escalation & reporting · Defense evidence studio |
| **Mission categories** | SIEM-lite labs · Scenario investigations · Tabletop · Write-up Missions |
| **Expected Evidence** | Triage tickets · Investigation timeline · IOC handling note (lab) · Ethics/safety attestation |
| **Possible capstone** | Investigate a multi-stage lab incident and produce a defensible report |
| **Tooling** | Lab SIEM / detection console · Packet/log samples · Ticketing mock |
| **Lab requirements** | Isolated cyber range or log replay; no live internet attack surfaces |
| **Content-maintenance burden** | Med–High |
| **Operational cost** | Med |
| **Accessibility** | Structured playbooks help cognitive load; captions for demos |
| **Safety** | Defense-only; no offensive exploitation labs in this Route; legal/ethical boundaries explicit |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — SCyWF / national cyber workforce priority |
| **International relevance** | High — NICE-aligned defensive language |
| **Cross-Wing potential** | High — OPERATE · ANALYZE · LEAD risk |
| **Secure Extension potential** | Native Horizon; extends into detection engineering later |
| **Risks** | Glamorized hacking culture; content aging of TTPs; lab misuse |
| **Supporting source IDs** | SRC-001 · SRC-002 · SRC-005 · SRC-010 |
| **Status** | RESEARCHED (see scorecard) |

### RC-PRT-002 — Identity & Access Security Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-PRT-002 |
| **Working title** | Identity & Access Security Foundations |
| **Horizon** | PROTECT |
| **Route type** | FOUNDATIONAL · SECURITY |
| **Intended learner** | Defenders and operators focusing on IAM as control plane |
| **Capability statement** | Implement and review foundational identity controls: authentication factors, least privilege patterns, access reviews, and common identity-attack recognition (defensive) |
| **Real-world problems** | Over-privileged accounts; weak MFA hygiene; orphaned access; phishing-driven account takeover |
| **Related roles** | IAM analyst (junior) · Security analyst (identity) · IT security associate |
| **Prerequisites** | Nest; basic directory/cloud identity concepts |
| **Corequisites** | Workplace ops (RC-OPR-003) and SecOps (RC-PRT-001) |
| **Likely Stages (conceptual)** | Identity as control plane · AuthN & MFA · Authorization & roles · Lifecycle & reviews · Attack patterns (defense) · IAM evidence studio |
| **Mission categories** | Policy labs · Access review Missions · Phishing defense scenarios · Design critiques |
| **Expected Evidence** | Access matrix · Review record · Hardening checklist · Incident note (identity) |
| **Possible capstone** | Remediate a lab identity posture and document residual risk |
| **Tooling** | Identity provider sandbox · Conditional access lab · Directory lab |
| **Lab requirements** | Managed IdP tenant; synthetic identities |
| **Content-maintenance burden** | Med |
| **Operational cost** | Med |
| **Accessibility** | Conceptual diagrams; reduced reliance on dense CLI |
| **Safety** | No real credential harvesting practice; social-engineering labs are defensive recognition only |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — Zero Trust / identity-first programs common |
| **International relevance** | High |
| **Cross-Wing potential** | High — OPERATE workplace · LEAD governance |
| **Secure Extension potential** | High — privileged access / Zero Trust extension |
| **Risks** | Vendor-specific console drift; oversimplifying Zero Trust |
| **Supporting source IDs** | SRC-001 · SRC-002 · SRC-005 · SRC-010 |
| **Status** | RESEARCHED (see scorecard) |

### RC-PRT-003 — Secure Network Defense Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-PRT-003 |
| **Working title** | Secure Network Defense Foundations |
| **Horizon** | PROTECT |
| **Route type** | FOUNDATIONAL · SECURITY · OPERATIONAL |
| **Intended learner** | Network-leaning defenders; ops staff securing paths and perimeters (modern sense) |
| **Capability statement** | Apply foundational network defense: segmentation concepts, firewall policy hygiene, detection of common network anomalies, and safe change practice |
| **Real-world problems** | Flat networks; any-any rules; blind spots; change-induced outages |
| **Related roles** | Network security associate · Security engineer (network entry) · NOC with security duties |
| **Prerequisites** | RC-OPR-002-level networking strongly preferred |
| **Corequisites** | SecOps fundamentals |
| **Likely Stages (conceptual)** | Network attack surface · Segmentation · Policy hygiene · Detection signals · Change & recovery · Network defense evidence studio |
| **Mission categories** | Topology labs · Policy review · Traffic anomaly scenarios · Change simulations |
| **Expected Evidence** | Network diagram · Policy diff rationale · Detection note · Change record |
| **Possible capstone** | Harden a lab network segment and prove detection of a known pattern |
| **Tooling** | Virtual network lab · Firewall simulator · Flow/log tools |
| **Lab requirements** | Isolated virtual networks; careful egress controls |
| **Content-maintenance burden** | Med |
| **Operational cost** | Med |
| **Accessibility** | Visual topology emphasis |
| **Safety** | No scanning of external networks; defense-only |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — critical infrastructure & enterprise network defense |
| **International relevance** | High |
| **Cross-Wing potential** | High — OPERATE networking |
| **Secure Extension potential** | Med–High — cloud network security extension |
| **Risks** | Overlap with RC-OPR-002; hardware lab expectations |
| **Supporting source IDs** | SRC-001 · SRC-002 · SRC-005 · SRC-011 |
| **Status** | RESEARCHED (see scorecard) |

---

## LEAD Horizon

### RC-LED-001 — Technology Delivery & Risk Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-LED-001 |
| **Working title** | Technology Delivery & Risk Foundations |
| **Horizon** | LEAD |
| **Route type** | FOUNDATIONAL · GOVERNANCE · COLLABORATIVE |
| **Intended learner** | Aspiring tech leads, delivery coordinators, IC→lead transitions |
| **Capability statement** | Coordinate technology delivery with explicit risk awareness: scope, priorities, stakeholder communication, and decision records |
| **Real-world problems** | Scope chaos; invisible risk; status theater; decisions without Evidence |
| **Related roles** | Delivery lead (associate) · Technical project coordinator · Team lead trainee |
| **Prerequisites** | Nest; experience in at least one other Horizon Route recommended |
| **Corequisites** | Domain Route from OPERATE/BUILD/PROTECT for grounding |
| **Likely Stages (conceptual)** | Delivery systems · Prioritization · Risk language · Stakeholder briefs · Decision records · Lead evidence studio |
| **Mission categories** | Case Missions · Risk registers (lite) · Briefing practice · Retrospectives |
| **Expected Evidence** | Delivery plan excerpt · Risk log · Stakeholder brief · Decision ADR-lite |
| **Possible capstone** | Lead a simulated delivery slice with risk tradeoffs documented |
| **Tooling** | Planning boards (lab) · Doc templates · Lightweight risk register |
| **Lab requirements** | Low compute; high facilitation/scenario quality |
| **Content-maintenance burden** | Low–Med |
| **Operational cost** | Low |
| **Accessibility** | Strong — narrative & templates; low tooling barrier |
| **Safety** | Avoid manipulative “soft skills” framing; no fake certification of management |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — HCDP / leadership capability themes; transformation programs |
| **International relevance** | High |
| **Cross-Wing potential** | Very High — designed to integrate other Horizons’ Evidence |
| **Secure Extension potential** | Med — secure delivery governance extension |
| **Risks** | Vague “leadership” content; weak Evidence if not scenario-bound |
| **Supporting source IDs** | SRC-003 · SRC-014 · SRC-013 · SRC-001 |
| **Status** | RESEARCHED (see scorecard) |

### RC-LED-002 — Digital Service Management Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-LED-002 |
| **Working title** | Digital Service Management Foundations |
| **Horizon** | LEAD |
| **Route type** | FOUNDATIONAL · GOVERNANCE · OPERATIONAL |
| **Intended learner** | Service owners / coordinators bridging ops and stakeholders |
| **Capability statement** | Manage digital services with foundational practices: request/incident/problem distinctions, SLAs as conversations, continual improvement Evidence |
| **Real-world problems** | Ticket ping-pong; SLA worship without outcomes; no problem management |
| **Related roles** | Service delivery associate · ITSM coordinator · Service owner trainee |
| **Prerequisites** | Nest; ops exposure helpful |
| **Corequisites** | RC-OPR-003 or RC-OPR-001 |
| **Likely Stages (conceptual)** | Service thinking · Request vs incident · Problem & known error · Continuity basics · Improvement cycles · Service evidence studio |
| **Mission categories** | Process scenarios · Metric critiques · Improvement Missions · Communication labs |
| **Expected Evidence** | Service definition · Incident/problem write-up · Improvement proposal · Stakeholder note |
| **Possible capstone** | Improve a failing lab service using measured before/after Evidence |
| **Tooling** | ITSM mock · Knowledge base templates |
| **Lab requirements** | Low–Med |
| **Content-maintenance burden** | Med |
| **Operational cost** | Low |
| **Accessibility** | High |
| **Safety** | Avoid proprietary ITIL certification promises; practice language only |
| **Arabic feasibility** | High |
| **Saudi relevance** | High — large service organizations & government digital services |
| **International relevance** | Med–High |
| **Cross-Wing potential** | High — OPERATE · LEAD |
| **Secure Extension potential** | Med — secure service operations |
| **Risks** | Framework dogma; overlap with OPERATE workplace Route |
| **Supporting source IDs** | SRC-013 · SRC-003 · SRC-015 · SRC-007 |
| **Status** | RESEARCHED (see scorecard) |

### RC-LED-003 — Cyber Risk Governance Foundations

| Field | Content |
|-------|---------|
| **ID** | RC-LED-003 |
| **Working title** | Cyber Risk Governance Foundations |
| **Horizon** | LEAD |
| **Route type** | FOUNDATIONAL · GOVERNANCE · SECURITY |
| **Intended learner** | Risk/governance-oriented learners bridging PROTECT and LEAD |
| **Capability statement** | Express cyber risk in business terms: identify assets, map controls at CSF-level functions, and produce governance-ready risk narratives |
| **Real-world problems** | Controls without risk context; audit theater; unclear ownership; duplicate PROTECT content |
| **Related roles** | GRC analyst (junior) · Risk coordinator · Compliance support (entry) |
| **Prerequisites** | Nest; PROTECT foundations strongly preferred |
| **Corequisites** | RC-PRT-001 / RC-LED-001 |
| **Likely Stages (conceptual)** | Risk vocabulary · Assets & impact · Control mapping (CSF-level) · Ownership & escalation · Reporting · Governance evidence studio |
| **Mission categories** | Risk workshops · Control mapping · Board-lite briefs · Case reviews |
| **Expected Evidence** | Risk register excerpt · Control map · Briefing deck notes · Decision log |
| **Possible capstone** | Produce a governance brief for a lab organization under constraint |
| **Tooling** | Templates · CSF-oriented worksheets · Scenario packs |
| **Lab requirements** | Low compute |
| **Content-maintenance burden** | Med |
| **Operational cost** | Low |
| **Accessibility** | High conceptually; jargon management required |
| **Safety** | No fake “compliance certification”; careful regulatory language |
| **Arabic feasibility** | Med–High |
| **Saudi relevance** | High — national cyber governance emphasis |
| **International relevance** | High |
| **Cross-Wing potential** | High — but overlaps PROTECT + LEAD launch slots |
| **Secure Extension potential** | Native adjacency to PROTECT |
| **Risks** | Catalogue duplication with RC-PRT-* and RC-LED-001; thin Evidence if not scenario-bound |
| **Supporting source IDs** | SRC-005 · SRC-002 · SRC-014 · SRC-003 |
| **Status** | RESEARCHED (see scorecard) |

---

## Register summary

| Horizon | Candidates | IDs |
|---------|------------|-----|
| OPERATE | 3 | RC-OPR-001 · RC-OPR-002 · RC-OPR-003 |
| BUILD | 3 | RC-BLD-001 · RC-BLD-002 · RC-BLD-003 |
| ANALYZE | 3 | RC-ANL-001 · RC-ANL-002 · RC-ANL-003 |
| PROTECT | 3 | RC-PRT-001 · RC-PRT-002 · RC-PRT-003 |
| LEAD | 3 | RC-LED-001 · RC-LED-002 · RC-LED-003 |
| **Total** | **15** | All status **RESEARCHED** |

**Explicit non-claims:** No Product Codes assigned. No Route status `LOCKED`. No certification promises. Recommendations are scorecard outcomes only — **RECOMMENDED — NOT YET LOCKED** where selected for launch discussion.
