# RT-LED-001 — Technology Delivery & Risk Foundations

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RT-LED-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](../../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](../../architecture/STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [NEST-DEPENDENCY-MAP.md](../../nest/NEST-DEPENDENCY-MAP.md) · [ROLE-AND-TITLE-BOUNDARIES.md](../../research/ROLE-AND-TITLE-BOUNDARIES.md) |
| **Source research** | RC-LED-001 (GHV.LEARNING.1A) |
| **Limitations** | Working title; no Product Code; no XP formulas; **no senior PM / senior manager title claim** |
| **Unresolved** | Scenario org pack library; Mission scripts (1C); 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B architecture |

```text
ARCHITECTURE RECOMMENDED — PENDING 1D LOCK
Never final LOCKED in this Gate.
No senior PM / senior manager title claim.
```

---

## Identity

| Field | Content |
|-------|---------|
| **Canonical ID** | **RT-LED-001** |
| **Prior candidate ID** | RC-LED-001 |
| **Working title** | Technology Delivery & Risk Foundations |
| **Horizon** | HRZ-LED (LEAD) |
| **Route type** | FOUNDATIONAL · DELIVERY · RISK LITERACY |
| **Capability statement** | Plan, prioritize, and communicate technical delivery with basic risk literacy: clarify outcomes and stakeholders, define scope and plan, manage priorities and dependencies, identify risks and controls, and produce reporting, decisions, and lessons — as a **delivery coordinator** scenario role, **not** a senior PM title. |
| **Target learner** | Learners with Nest collaboration readiness; recommended exposure to at least one technical Route in progress or complete |

---

## Entry / Exit

| Field | Content |
|-------|---------|
| **Entry** | Nest readiness **≥ 50% path** (Guided Skip + Micro-Missions on N-COL / N-PRV / N-AIL gaps) **or** Nest complete / Ready to Fly — Scope §3.5 **unchanged**. |
| **Exit** | All five Stages complete **and** required Evidence accepted **and** Capstone eligible (`RT-LED-001-CAP-01`) |
| **Prerequisites** | Nest collaboration/privacy/AI literacy (N-COL · N-PRV · N-AIL · N-BRW · N-TSH · N-IDN) |
| **Corequisites** | None hard-required |
| **Recommended** | Experience in another technical Route (`RECOMMENDED` graph edge — not waived by Nest skip); N-ACC · N-FIL reviews |

---

## Stage table (5 Stages)

| Stage ID | Title | Outcomes | Mission categories | Evidence contribution | Remediation | Next Unlock |
|----------|-------|----------|--------------------|----------------------|-------------|-------------|
| **RT-LED-001-STG-01** | Outcomes & stakeholders | Write outcome statements; map stakeholders; set communication expectations without seniority inflation | ORIENTATION · KNOWLEDGE · SCENARIO · DOCUMENTATION | Feeds **EVD-01** brief | Scenario rewrite; Nest collaboration Micro-Mission | Unlocks STG-02 |
| **RT-LED-001-STG-02** | Scope & plan | Define in/out scope; draft delivery plan under constraints; produce RACI-lite | DESIGN · SCENARIO · GUIDED_PRACTICE · DOCUMENTATION | **EVD-02** plan | Constraint-pack retry | Unlocks STG-03 |
| **RT-LED-001-STG-03** | Priorities & dependencies | Prioritize under forced trade-offs; map dependencies; record rejected alternatives | SCENARIO · ANALYSIS · DESIGN · INDEPENDENT_PRACTICE | Supports EVD-02 / EVD-04 | Trade-off remediation worksheet | Unlocks STG-04 |
| **RT-LED-001-STG-04** | Risks & controls | Build risk register excerpt; propose proportionate controls; state residual risk | SCENARIO · ANALYSIS · DOCUMENTATION · ASSESSMENT | **EVD-03** risk register | Risk quality remediation | Unlocks STG-05 |
| **RT-LED-001-STG-05** | Reporting, decisions & lessons | Write decision record; stakeholder report; lessons note; Evidence pack | DOCUMENTATION · EVIDENCE_PREPARATION · SCENARIO · ASSESSMENT | **EVD-04** decision record; Capstone eligibility | Pack revision; AI-disclosure fix | Unlocks **RT-LED-001-CAP-01** |

---

## Evidence anchors

| ID | Title | Artifact class | Stage contribution | Integrity | Review |
|----|-------|----------------|--------------------|-----------|--------|
| **RT-LED-001-EVD-01** | Stakeholder / outcome brief | Brief memo | STG-01 | Scenario-specific; no senior-title language | Clarity + realism |
| **RT-LED-001-EVD-02** | Delivery plan | Plan + RACI-lite | STG-02 · STG-03 | Forced constraints cited | Constraint fidelity |
| **RT-LED-001-EVD-03** | Risk register | Register excerpt + residual risk | STG-04 | Numbers/constraints unique to pack | Risk quality (not eloquence) |
| **RT-LED-001-EVD-04** | Decision record | Decision log + lessons | STG-03 · STG-05 | Show rejected alternatives; AI disclosure | Decision quality |

---

## Capstone

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-LED-001-CAP-01** |
| **Eligibility** | STG-01…05 complete + EVD-01…04 accepted |
| **Concept** | Constrained change delivery plan (CAP-LED-001) — scenario role: delivery coordinator **not** senior PM |
| **Output shape** | Plan · risk register · decision record · stakeholder note |
| **Category** | CAPSTONE |

---

## Cross-Wing / Secure Extension links

| Link | Note |
|------|------|
| **CXW / SEX** | No hard attach required for launch Exit |
| **BRG-ANL-LED** | If RT-ANL-001 launches later, data-informed decision Bridge is optional |
| **Title boundary** | Completing this Route does **not** grant senior PM / Programme Manager / Director titles |

---

## Tooling

| Field | Content |
|-------|---------|
| **Primary classes** | **BROWSER-ONLY** templates · optional HUMAN-FACILITATED critique |
| **Vendor posture** | No PMI/cert vendor lock; internal/OSS templates |
| **Avoid** | Heavy paid project-tool seat requirements as hard deps |

---

## Safety

- Fictional organizations and stakeholders  
- No real confidential employer data  
- No seniority inflation in learner-facing grants  
- High AI-prose risk → require rejected alternatives + disclosure  

---

## Arabic-first

| Field | Content |
|-------|---------|
| **Feasibility** | High |
| **Notes** | Arabic-first delivery/risk narratives; retain selective English governance terms with glossaries; mobile-friendly reading |

---

## Freshness

| Class | Areas |
|-------|-------|
| **Stable** | Stakeholder mapping, risk register method, decision records |
| **Slow-changing** | Dependency/prioritization patterns |
| **Fast** | Tool screenshots — avoid; keep method-first |

---

## Expert review

| Type | Need |
|------|------|
| Delivery/risk practitioner | Scenario realism without senior-title creep |
| Role-boundary reviewer | Title language audit |
| Arabic instructional | Governance glossary |
| Integrity reviewer | Anti-AI-only Evidence checks |

---

## Route-Proven (qualitative)

Proven when briefs/plans/registers/decisions are constraint-faithful, residual risk is honest, and language stays free of senior PM claims — **qualitative only**.

---

## Unresolved

1. Scenario pack library size for launch  
2. Optional Live Sky critique facilitation capacity  
3. Mission scripts (1C)  
4. Interaction with PROGRESSION.1 Professional Titles  
5. 1D lock  

---

## Stage review table (Gate §33)

| Stage ID | Outcomes clarity | Category fit | Evidence contribution | Remediation path | Unlock coherence | Safety | A11y | Integrity | Offline / tooling | Reviewer | Verdict |
|----------|------------------|--------------|----------------------|------------------|------------------|--------|------|-----------|-------------------|----------|---------|
| STG-01 | Clear | OK | EVD-01 | Defined | OK | Pass | Pass | Watch (AI) | High offline | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-02 | Clear | OK | EVD-02 | Defined | OK | Pass | Pass | Pass | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-03 | Clear | OK | Mapped | Defined | OK | Pass | Pass | Watch (AI) | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-04 | Clear | OK | EVD-03 | Defined | OK | Pass | Pass | Pass | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-05 | Clear | OK | EVD-04 | Defined | OK | Pass | Pass | Watch (AI) | High | Founder (RAVEN) | **ARCHITECTURE OK** |

**§33 aggregate:** Stage count **5/5** · All Stages **ARCHITECTURE OK** · Route status **ARCHITECTURE RECOMMENDED — PENDING 1D LOCK** (not LOCKED).
