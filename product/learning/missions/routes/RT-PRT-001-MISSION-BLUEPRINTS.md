# RT-PRT-001 — Mission Blueprints (Defensive Security Operations)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-PRT-001 |
| **Version** | 1.0.0 |
| **Status** | MISSION BLUEPRINT — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Route** | [RT-PRT-001-DEFENSIVE-SECURITY-OPERATIONS.md](../../routes/architecture/RT-PRT-001-DEFENSIVE-SECURITY-OPERATIONS.md) |
| **Related** | [EVIDENCE-ANCHOR-REGISTRY.md](../../evidence/EVIDENCE-ANCHOR-REGISTRY.md) · [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [RT-PRT-001-EVIDENCE-RUBRICS.md](../../evidence/rubrics/RT-PRT-001-EVIDENCE-RUBRICS.md) · [RT-PRT-001-CAPSTONE-BLUEPRINT.md](../../capstones/RT-PRT-001-CAPSTONE-BLUEPRINT.md) |
| **Limitations** | Blueprints only — not LOCKED; no XP; no Product Code; **no offensive instructions**; synthetic lab datasets only |
| **Unresolved** | Scenario pack vendor/format; seed rotation ops; expert review; pilot; 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C Mission blueprints |

```text
MISSION BLUEPRINT — PENDING EXPERT REVIEW
Never final LOCKED in this Gate.
NO XP. Expert review: NOT RUN. Pilot: NOT RUN.
SCENARIO LABS ONLY — DEFENSIVE SECURITY ONLY.
NO weaponized exploits · NO credential theft · NO persistence · NO evasion · NO real unauthorized targets.
```

---

## Purpose

Define **14** Mission blueprints for RT-PRT-001 spanning ethics, assets/threats/controls, telemetry, detection, triage, investigation, timeline, containment/escalation, incident communication, Evidence handling, and ethics/legal — culminating in Capstone eligibility.

| Metric | Value |
|--------|------:|
| **Mission count** | **14** |
| **Evidence anchors** | EVD-01 · EVD-02 · EVD-03 |
| **Capstone** | RT-PRT-001-CAP-01 |

---

## Safety envelope (all Missions)

| Rule | Requirement |
|------|-------------|
| **Dataset** | Synthetic defensive scenario packs only (seeded alerts, sanitized logs, fictional orgs) |
| **Indicators** | Synthetic IOCs only; never claim live-target activity |
| **Prohibited content** | Weaponized exploits; credential theft how-to; persistence; evasion; unauthorized scanning; real victim data |
| **Ethics** | Lab safety brief + ethics attestation; **hard stop** on ethics gate fail |
| **Portfolio** | Lab-marked; sanitized; no doxxing |

---

## Mission index

| # | Mission ID | Stage | Title | Category | Evidence |
|---|------------|-------|-------|----------|----------|
| 1 | RT-PRT-001-STG-01-MSN-01 | STG-01 | SecOps orientation | ORIENTATION | — |
| 2 | RT-PRT-001-STG-01-MSN-02 | STG-01 | Ethics & legal boundaries | KNOWLEDGE | Ethics/legal foundation |
| 3 | RT-PRT-001-STG-01-MSN-03 | STG-01 | **Hard ethics gate** | ASSESSMENT | **Hard stop** if fail |
| 4 | RT-PRT-001-STG-02-MSN-01 | STG-02 | Asset inventory (scenario) | SCENARIO | Feeds framing |
| 5 | RT-PRT-001-STG-02-MSN-02 | STG-02 | Threats mapped to controls | DESIGN | Feeds framing |
| 6 | RT-PRT-001-STG-03-MSN-01 | STG-03 | Telemetry literacy | KNOWLEDGE | Supports EVD-01/03 |
| 7 | RT-PRT-001-STG-03-MSN-02 | STG-03 | Detection logic notes (lab) | LABORATORY | Supports EVD-03 |
| 8 | RT-PRT-001-STG-03-MSN-03 | STG-03 | Signal vs noise drill | ANALYSIS | Supports EVD-01 |
| 9 | RT-PRT-001-STG-04-MSN-01 | STG-04 | Alert triage write-up | SCENARIO | **EVD-01** |
| 10 | RT-PRT-001-STG-04-MSN-02 | STG-04 | Investigation playbook practice | TROUBLESHOOTING | Supports EVD-02/03 |
| 11 | RT-PRT-001-STG-04-MSN-03 | STG-04 | Investigation timeline | ANALYSIS | **EVD-02** |
| 12 | RT-PRT-001-STG-05-MSN-01 | STG-05 | Containment & escalation judgment | SCENARIO | Supports EVD-03 |
| 13 | RT-PRT-001-STG-05-MSN-02 | STG-05 | Incident communication brief | DOCUMENTATION | Supports EVD-03 |
| 14 | RT-PRT-001-STG-05-MSN-03 | STG-05 | Evidence handling & pack prep | EVIDENCE_PREPARATION | **EVD-03** → CAP |

### Stage assessment anchors (canonical ASM IDs)

| Assessment ID | Stage | Primary Mission(s) | Purpose |
|---------------|-------|--------------------|---------|
| **RT-PRT-001-STG-01-ASM-01** | STG-01 | MSN-03 Hard ethics gate | Ethics/legal hard stop |
| **RT-PRT-001-STG-02-ASM-01** | STG-02 | MSN-01 · MSN-02 | Asset/threat/control mapping check |
| **RT-PRT-001-STG-03-ASM-01** | STG-03 | MSN-02 · MSN-03 | Telemetry/detection practical check |
| **RT-PRT-001-STG-04-ASM-01** | STG-04 | MSN-01 · MSN-03 | Triage + timeline Evidence gate |
| **RT-PRT-001-STG-05-ASM-01** | STG-05 | MSN-01 · MSN-03 | Escalation + Evidence pack gate |

Numeric pass thresholds: **pending GHV.PROGRESSION.1**. Registry: [ASSESSMENT-ANCHOR-REGISTRY.md](../../assessments/ASSESSMENT-ANCHOR-REGISTRY.md).

---

## STG-01 — Defensive context & ethics

### RT-PRT-001-STG-01-MSN-01 — SecOps orientation

| Field | Content |
|-------|---------|
| **Category** | ORIENTATION |
| **Outcomes** | State defensive Route scope; distinguish SOC-adjacent scenario role from employment claim; name lab-only rules |
| **Inputs** | Route brief; lab safety one-pager; scenario org card (fictional) |
| **Learner tasks** | Complete orientation checklist; affirm sandbox boundaries; identify prohibited request classes |
| **Outputs** | Signed orientation checklist (identity-bound acknowledgment) |
| **Evidence** | Prerequisite for later EVD; not an Evidence anchor alone |
| **Remediation** | Re-read safety brief; reattempt checklist |
| **Safety** | No live systems; no offensive tooling |

### RT-PRT-001-STG-01-MSN-02 — Ethics & legal boundaries

| Field | Content |
|-------|---------|
| **Category** | KNOWLEDGE |
| **Outcomes** | Explain defensive vs offensive scope; state authorization and synthetic-data rules; refuse unsafe requests with rationale |
| **Inputs** | Ethics primer (Arabic-first narrative + English standard terms); legal/privacy note (lab policy — not legal advice) |
| **Learner tasks** | Annotate three vignettes: refuse, escalate, or proceed-in-lab; write short ethics/legal boundaries note |
| **Outputs** | Boundaries note with vignette decisions |
| **Evidence** | Feeds ethics attestation currency |
| **Remediation** | Guided vignette remediation; Nest privacy Micro-Mission if N-PRV gap |
| **Safety** | No real legal advice; no real victim examples |

### RT-PRT-001-STG-01-MSN-03 — Hard ethics gate

| Field | Content |
|-------|---------|
| **Category** | ASSESSMENT |
| **Gate type** | **HARD ETHICS GATE** — hard stop on fail |
| **Outcomes** | Demonstrate refusal of weaponized / unauthorized / credential-theft / persistence / evasion requests; affirm synthetic-lab-only posture |
| **Inputs** | Fixed item bank of safe/unsafe prompts (defensive framing); attestation form |
| **Learner tasks** | Pass ethics gate assessment; submit current ethics attestation |
| **Outputs** | Gate pass record + ethics attestation |
| **Pass rule** | Must pass before STG-02 unlock; fail → **REMEDIATION hard stop** (no Stage skip) |
| **Evidence** | Required for Capstone eligibility (`ethics attestation current`) |
| **Remediation** | Mandatory ethics remediation pack → retest; facilitator optional; **no XP path around gate** |
| **Safety** | Assessment itself contains **no** exploit how-to — only refusal scenarios |

```text
HARD ETHICS GATE
Fail = hard stop → REMEDIATION → retest.
No unlock of STG-02 without pass.
```

---

## STG-02 — Assets, threats & controls

### RT-PRT-001-STG-02-MSN-01 — Asset inventory (scenario)

| Field | Content |
|-------|---------|
| **Category** | SCENARIO |
| **Outcomes** | Inventory assets in a seeded scenario; classify criticality at foundation level; avoid overclaim |
| **Inputs** | Synthetic asset register excerpt; network/service cards (fictional) |
| **Learner tasks** | Complete asset inventory form; flag unknowns honestly |
| **Outputs** | Asset inventory table |
| **Evidence** | Feeds investigation framing |
| **Remediation** | Scenario retry with new seed; Nest scam Micro-Mission if overconfidence |
| **Safety** | Fictional org only |

### RT-PRT-001-STG-02-MSN-02 — Threats mapped to controls

| Field | Content |
|-------|---------|
| **Category** | DESIGN |
| **Outcomes** | Map plausible threats to proportionate controls; state residual risk without offensive TTPs |
| **Inputs** | Threat narrative cards (defensive language); control family glossary |
| **Learner tasks** | Produce threat→control map; note what is out of learner authority |
| **Outputs** | Threat–control map + residual note |
| **Evidence** | Feeds EVD-03 framing |
| **Remediation** | Proportionality worksheet |
| **Safety** | No exploit steps; no live targeting |

---

## STG-03 — Telemetry & detection

### RT-PRT-001-STG-03-MSN-01 — Telemetry literacy

| Field | Content |
|-------|---------|
| **Category** | KNOWLEDGE |
| **Outcomes** | Read provided telemetry fields; explain what a log/alert can and cannot prove |
| **Inputs** | Synthetic log samples; field glossary (retain English industry terms with Arabic gloss) |
| **Learner tasks** | Label fields; write “what this does/doesn’t tell us” notes |
| **Outputs** | Annotated telemetry worksheet |
| **Evidence** | Supports EVD-01 / EVD-03 |
| **Remediation** | Guided field drill |
| **Safety** | Synthetic logs only |

### RT-PRT-001-STG-03-MSN-02 — Detection logic notes (lab)

| Field | Content |
|-------|---------|
| **Category** | LABORATORY |
| **Outcomes** | Document detection logic notes for a lab rule (why alert fired; what evidence would refute) |
| **Inputs** | Seeded detection rule description; matching synthetic events |
| **Learner tasks** | Write detection logic note; propose false-positive checks (non-offensive) |
| **Outputs** | Detection logic note |
| **Evidence** | Supports EVD-03 |
| **Remediation** | New seed + guided detection drill |
| **Safety** | Vendor-neutral language; no mandatory enterprise SIEM |

### RT-PRT-001-STG-03-MSN-03 — Signal vs noise drill

| Field | Content |
|-------|---------|
| **Category** | ANALYSIS |
| **Outcomes** | Distinguish signal vs noise in a mixed alert set; justify prioritization without sensationalism |
| **Inputs** | Mixed synthetic alert queue (seed-bound) |
| **Learner tasks** | Rank alerts; separate noise candidates; document rationale |
| **Outputs** | Prioritized alert list with rationales |
| **Evidence** | Supports EVD-01 |
| **Remediation** | Facilitator review optional; retry with new seed |
| **Safety** | No live feeds |

---

## STG-04 — Triage & investigation

### RT-PRT-001-STG-04-MSN-01 — Alert triage write-up

| Field | Content |
|-------|---------|
| **Category** | SCENARIO |
| **Outcomes** | Prioritize alerts; separate FP/TP reasoning; produce proportionate triage write-up |
| **Inputs** | Scenario pack variant (unique seed); triage form template |
| **Learner tasks** | Complete triage form citing lab artifacts only |
| **Outputs** | Alert triage write-up |
| **Evidence** | **RT-PRT-001-EVD-01** |
| **Remediation** | Triage form remediation; optional facilitator review |
| **Safety** | Synthetic IOCs; no live-target claims |

### RT-PRT-001-STG-04-MSN-02 — Investigation playbook practice

| Field | Content |
|-------|---------|
| **Category** | TROUBLESHOOTING |
| **Outcomes** | Investigate with playbook discipline; record questions asked, sources checked, and open unknowns |
| **Inputs** | Defensive playbook template; seeded case packet |
| **Learner tasks** | Follow playbook steps; log actions and findings (defensive only) |
| **Outputs** | Investigation working notes |
| **Evidence** | Supports EVD-02 / EVD-03 |
| **Remediation** | Playbook checkpoint retry |
| **Safety** | No persistence/evasion content; no credential theft |

### RT-PRT-001-STG-04-MSN-03 — Investigation timeline

| Field | Content |
|-------|---------|
| **Category** | ANALYSIS |
| **Outcomes** | Build a complete, defensive investigation timeline with timestamps and sources |
| **Inputs** | Seeded event stream; timeline template |
| **Learner tasks** | Construct timeline; mark confidence / gaps |
| **Outputs** | Investigation timeline |
| **Evidence** | **RT-PRT-001-EVD-02** |
| **Remediation** | Completeness checklist remediation |
| **Integrity** | Unique seed; no live-target claims |

---

## STG-05 — Incident docs & escalation

### RT-PRT-001-STG-05-MSN-01 — Containment & escalation judgment

| Field | Content |
|-------|---------|
| **Category** | SCENARIO |
| **Outcomes** | Recommend proportionate containment options within lab authority; decide when to escalate; state what not to do |
| **Inputs** | Containment option cards (defensive, lab-scoped); escalation criteria sheet |
| **Learner tasks** | Choose containment/escalation path; justify proportionality |
| **Outputs** | Containment & escalation decision note |
| **Evidence** | Supports EVD-03 |
| **Remediation** | Proportionality remediation worksheet |
| **Safety** | Lab authority only; no unauthorized real-world actions |

### RT-PRT-001-STG-05-MSN-02 — Incident communication brief

| Field | Content |
|-------|---------|
| **Category** | DOCUMENTATION |
| **Outcomes** | Write a clear escalation / stakeholder brief without fear-mongering or overclaim |
| **Inputs** | Audience cards (manager / peer — scenario roles); communication template |
| **Learner tasks** | Draft brief; separate facts, hypotheses, and asks |
| **Outputs** | Incident communication / escalation brief |
| **Evidence** | Supports EVD-03 |
| **Remediation** | Report revision cycle |
| **Safety** | No real victim PII; sanitized language |

### RT-PRT-001-STG-05-MSN-03 — Evidence handling & pack prep

| Field | Content |
|-------|---------|
| **Category** | EVIDENCE_PREPARATION |
| **Outcomes** | Handle lab Evidence with integrity (seed citation, sanitization); assemble investigation report + ethics declaration pack |
| **Inputs** | Evidence handling checklist; report template; prior Mission artifacts |
| **Learner tasks** | Complete Evidence chain note; assemble EVD-03 pack; refresh ethics attestation |
| **Outputs** | Investigation report + escalation brief + ethics declaration |
| **Evidence** | **RT-PRT-001-EVD-03**; Capstone eligibility when EVD-01…03 accepted + ethics current |
| **Remediation** | Pack revision cycle |
| **Safety** | Synthetic IOCs only; public portfolio lab-marked |

---

## Capstone handoff

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-PRT-001-CAP-01** |
| **Eligibility** | STG-01…05 complete + EVD-01…03 accepted + ethics attestation current |
| **Blueprint** | [RT-PRT-001-CAPSTONE-BLUEPRINT.md](../../capstones/RT-PRT-001-CAPSTONE-BLUEPRINT.md) |
| **Concept** | Investigate synthetic defensive case → defensive briefing pack |

---

## Count verification

| Check | Result |
|-------|--------|
| Missions listed | **14** |
| Hard ethics gate | MSN-03 on STG-01 |
| EVD-01 / EVD-02 / EVD-03 mapped | Yes |
| Capstone position | RT-PRT-001-CAP-01 |
| Offensive content | **None** |
| XP / LOCKED / Expert / Pilot | None / Not LOCKED / NOT RUN / NOT RUN |
