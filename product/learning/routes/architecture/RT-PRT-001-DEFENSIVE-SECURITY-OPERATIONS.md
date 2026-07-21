# RT-PRT-001 — Defensive Security Operations Foundations

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RT-PRT-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](../../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](../../architecture/STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [NEST-DEPENDENCY-MAP.md](../../nest/NEST-DEPENDENCY-MAP.md) · [LAUNCH-CROSS-WING-STUDY.md](../../cross-wing/LAUNCH-CROSS-WING-STUDY.md) |
| **Source research** | RC-PRT-001 (GHV.LEARNING.1A) |
| **Limitations** | Working title; no Product Code; no XP formulas; **no offensive instructions**; scenario labs only |
| **Unresolved** | Scenario pack vendor/format; Mission scripts (1C); 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B architecture |

```text
ARCHITECTURE RECOMMENDED — PENDING 1D LOCK
Never final LOCKED in this Gate.
NO OFFENSIVE INSTRUCTIONS — SCENARIO LABS ONLY.
```

---

## Identity

| Field | Content |
|-------|---------|
| **Canonical ID** | **RT-PRT-001** |
| **Prior candidate ID** | RC-PRT-001 |
| **Working title** | Defensive Security Operations Foundations |
| **Horizon** | HRZ-PRT (PROTECT) |
| **Route type** | FOUNDATIONAL · DEFENSIVE |
| **Capability statement** | Detect, triage, investigate, and document common security events ethically using provided scenario labs: establish defensive context and ethics, map assets/threats/controls at a foundation level, use telemetry for detection, perform triage and investigation, and produce incident documentation with escalation — without offensive exploitation content. |
| **Target learner** | Learners after Nest aiming at junior defensive / SOC-adjacent pathways (scenario roles only) |

---

## Entry / Exit

| Field | Content |
|-------|---------|
| **Entry** | Nest readiness **≥ 50% path** (Guided Skip; Micro-Missions **mandatory** on N-SCM / N-PWD / N-PRV gaps) **or** Nest complete / Ready to Fly — Scope §3.5 **unchanged**. Lab safety brief required. |
| **Exit** | All five Stages complete **and** required Evidence accepted **and** Capstone eligible (`RT-PRT-001-CAP-01`) |
| **Prerequisites** | Nest safety/privacy (N-PWD · N-SCM · N-PRV · N-BRW · N-NET · N-TSH · N-AIL); networking/OS basics remain Route-level (not waived by Nest skip) |
| **Corequisites** | None hard-required |
| **Recommended** | RT-OPR-001 observability Bridge; RT-OPR-002 Linux/network concepts |

---

## Stage table (5 Stages)

| Stage ID | Title | Outcomes | Mission categories | Evidence contribution | Remediation | Next Unlock |
|----------|-------|----------|--------------------|----------------------|-------------|-------------|
| **RT-PRT-001-STG-01** | Defensive context & ethics | State defensive scope; complete ethics declaration; refuse unsafe requests; know lab-only rules | ORIENTATION · KNOWLEDGE · ASSESSMENT · DOCUMENTATION | Ethics attestation required for later EVD | **Hard stop** on ethics fail → REMEDIATION | Unlocks STG-02 |
| **RT-PRT-001-STG-02** | Assets, threats & controls | Inventory assets in scenario; map threats to controls at foundation level; avoid overclaim | KNOWLEDGE · SCENARIO · DESIGN · DOCUMENTATION | Feeds investigation framing | Scenario retry; Nest scam Micro-Mission | Unlocks STG-03 |
| **RT-PRT-001-STG-03** | Telemetry & detection | Read provided telemetry; distinguish signal vs noise; document detection logic notes (lab) | KNOWLEDGE · SCENARIO · ANALYSIS · LABORATORY | Supports EVD-01 / EVD-03 | Guided detection drill; new seed | Unlocks STG-04 |
| **RT-PRT-001-STG-04** | Triage & investigation | Prioritize alerts; investigate with playbook discipline; separate FP/TP reasoning | SCENARIO · TROUBLESHOOTING · INDEPENDENT_PRACTICE · ANALYSIS | **EVD-01** triage · **EVD-02** timeline | Triage form remediation; facilitator review optional | Unlocks STG-05 |
| **RT-PRT-001-STG-05** | Incident docs & escalation | Write escalation brief; complete investigation report; prepare Evidence pack | DOCUMENTATION · EVIDENCE_PREPARATION · ASSESSMENT · SCENARIO | **EVD-03** investigation report; Capstone eligibility | Report revision cycle | Unlocks **RT-PRT-001-CAP-01**; CXW-001 selected Stage *source readiness* |

---

## Evidence anchors

| ID | Title | Artifact class | Stage contribution | Integrity | Review |
|----|-------|----------------|--------------------|-----------|--------|
| **RT-PRT-001-EVD-01** | Triage Evidence | Alert triage write-up | STG-04 | Seeded scenario variant; cite lab artifacts | Rubric: prioritization + proportionality |
| **RT-PRT-001-EVD-02** | Timeline Evidence | Investigation timeline | STG-04 · STG-05 | Unique seed; no live-target claims | Completeness + defensiveness |
| **RT-PRT-001-EVD-03** | Investigation report | Report + escalation brief + ethics | STG-03 · STG-05 | Synthetic IOCs only; sanitized | Defensive reasoning quality |

---

## Capstone

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-PRT-001-CAP-01** |
| **Eligibility** | STG-01…05 complete + EVD-01…03 accepted + ethics attestation current |
| **Concept** | Defensive briefing from scenario pack (CAP-PRT-001) — no full instructions; **no offensive content** |
| **Output shape** | Triage report · timeline · investigation/briefing · ethics declaration |
| **Category** | CAPSTONE |

---

## Cross-Wing / Secure Extension links

| Link | Note |
|------|------|
| **CXW-001** | Selected RT-PRT-001 Stages feed Secure Application Delivery prerequisites. Host Route remains defensive foundations — not the Integration Mission itself. |
| **SEX-001** | Not a substitute for this PROTECT Route; SEX attaches to OPERATE |
| **Safety rule** | No offensive instructions anywhere in Stages/Missions/Evidence guidance |

---

## Tooling

| Field | Content |
|-------|---------|
| **Primary classes** | CONTAINERIZED scenario packs · BROWSER-ONLY case sims · optional HUMAN-FACILITATED review |
| **Vendor posture** | Vendor-neutral triage language; no mandatory enterprise SIEM at launch |
| **Avoid** | Live Internet attack labs; specialized full SOC platforms as hard launch deps; offensive tooling images |

---

## Safety

```text
SCENARIO LABS ONLY
NO OFFENSIVE INSTRUCTIONS
NO LIVE THIRD-PARTY TARGETS
SYNTHETIC INDICATORS ONLY
```

- Ethics gate before labs  
- No doxxing / real victim data  
- Egress controls on lab images  
- Public portfolio: lab-marked, sanitized  

---

## Arabic-first

| Field | Content |
|-------|---------|
| **Feasibility** | High |
| **Notes** | Arabic-first defensive narratives; retain English detection terms where industry-standard; structured forms for triage |

---

## Freshness

| Class | Areas |
|-------|-------|
| **Stable** | Ethics, triage method, escalation quality |
| **Slow-changing** | Control families, asset inventory method |
| **Fast** | Specific TTP examples — keep thin; foundations stable |

---

## Expert review

| Type | Need |
|------|------|
| Defensive SecOps SME | Scenario quality + no-offensive audit |
| Ethics/safety | Hard-stop remediation design |
| Arabic instructional | Sensitive terminology |
| Legal/privacy liaison (as needed) | Synthetic data policy |

---

## Route-Proven (qualitative)

Proven when learners produce triage/timeline/report packs that stay defensive, cite scenario seeds, and never introduce offensive how-to — **qualitative only**.

---

## Unresolved

1. Scenario pack format and seed rotation ops  
2. Optional facilitator capacity for Live Sky (not required for Exit)  
3. Mission scripts (1C)  
4. PROGRESSION.1 Trust interaction for security Evidence  
5. 1D lock  

---

## Stage review table (Gate §33)

| Stage ID | Outcomes clarity | Category fit | Evidence contribution | Remediation path | Unlock coherence | Safety | A11y | Integrity | Offline / tooling | Reviewer | Verdict |
|----------|------------------|--------------|----------------------|------------------|------------------|--------|------|-----------|-------------------|----------|---------|
| STG-01 | Clear | OK | Ethics gate | Hard-stop REMEDIATION | OK | Pass | Pass | Pass | High offline | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-02 | Clear | OK | Mapped | Defined | OK | Pass | Pass | Pass | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-03 | Clear | OK | Mapped | Defined | OK | Pass | Watch (telemetry UI) | Pass | Med (packs) | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-04 | Clear | OK | EVD-01/02 | Defined | OK | Pass | Pass (forms) | Pass | Med | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-05 | Clear | OK | EVD-03 | Defined | OK | Pass | Pass | Pass | High docs | Founder (RAVEN) | **ARCHITECTURE OK** |

**§33 aggregate:** Stage count **5/5** · All Stages **ARCHITECTURE OK** · Route status **ARCHITECTURE RECOMMENDED — PENDING 1D LOCK** (not LOCKED).
