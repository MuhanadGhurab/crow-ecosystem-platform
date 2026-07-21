# RT-ANL-001 — Reserve Mission Blueprints (Practical Data Analysis)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-ANL-001 |
| **Version** | 1.0.0 |
| **Status** | RESERVE BLUEPRINT — LAUNCH RESERVE — CAPACITY CONDITIONAL |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Route** | [RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md](../../routes/architecture/RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md) |
| **Related** | [EVIDENCE-ANCHOR-REGISTRY.md](../../evidence/EVIDENCE-ANCHOR-REGISTRY.md) · [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [RT-ANL-001-EVIDENCE-RUBRICS.md](../../evidence/rubrics/RT-ANL-001-EVIDENCE-RUBRICS.md) · [RT-ANL-001-RESERVE-CAPSTONE-BLUEPRINT.md](../../capstones/RT-ANL-001-RESERVE-CAPSTONE-BLUEPRINT.md) |
| **Limitations** | **Exactly 8** representative Missions — not a committed launch catalogue; no XP; no Product Code; not LOCKED |
| **Unresolved** | Capacity confirmation; Change Control note ID; expert review; pilot; 1D include/exclude |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C reserve Mission blueprints |

```text
╔══════════════════════════════════════════════════════════════╗
║  LAUNCH RESERVE — CAPACITY CONDITIONAL                       ║
║  STATUS: RESERVE BLUEPRINT                                   ║
║  Must NOT enrol as committed launch without:                 ║
║    (1) Founder capacity confirmation                         ║
║    (2) Change Control approving inclusion                    ║
║  NO XP. Expert: NOT RUN. Pilot: NOT RUN. Never LOCKED here.  ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Purpose

Provide **exactly eight** representative Mission blueprints so RT-ANL-001 is ready-to-activate if capacity appears. These cover question framing, dataset/sources, quality, cleaning, descriptive analysis, visualization, uncertainty, and insight/decision — with Evidence EVD-01…04 and Capstone position.

| Metric | Value |
|--------|------:|
| **Mission count** | **8** (representative; not full expansion) |
| **Evidence anchors** | EVD-01 · EVD-02 · EVD-03 · EVD-04 |
| **Capstone** | RT-ANL-001-CAP-01 (capacity-gated) |
| **Launch posture** | **LAUNCH RESERVE — CAPACITY CONDITIONAL** |

---

## Capacity gate

| Rule | Requirement |
|------|-------------|
| **Committed launch enrolment** | **Forbidden** until capacity + Change Control recorded |
| **Architecture purpose** | Ready-to-activate design — not a silent fifth P0 |
| **If deferred** | Keep data-literacy Micro-Missions in Nest/LEAD; Route stays POST-LAUNCH option |

---

## Safety & integrity envelope

| Rule | Requirement |
|------|-------------|
| **Data** | Synthetic datasets only; ban real personal datasets |
| **Size** | Cap dataset size per pack |
| **Reproducibility** | Seed ID required on prep Evidence |
| **AI** | Disclosure mandatory on narrative analysis |
| **A11y** | Charts require alt text / text descriptions |

---

## Mission index (exactly 8)

| # | Mission ID | Stage | Title | Category | Evidence |
|---|------------|-------|-------|----------|----------|
| 1 | RT-ANL-001-STG-01-MSN-01 | STG-01 | Answerable questions & ethics note | ORIENTATION · DESIGN | Feeds EVD-04 / Capstone |
| 2 | RT-ANL-001-STG-01-MSN-02 | STG-01 | Dataset sources & limits | KNOWLEDGE | Feeds EVD-01 |
| 3 | RT-ANL-001-STG-02-MSN-01 | STG-02 | Data quality profiling | ASSESSMENT | Feeds EVD-01 |
| 4 | RT-ANL-001-STG-02-MSN-02 | STG-02 | Cleaning & preparation log | LABORATORY | **EVD-01** |
| 5 | RT-ANL-001-STG-03-MSN-01 | STG-03 | Descriptive analysis | ANALYSIS | **EVD-02** |
| 6 | RT-ANL-001-STG-04-MSN-01 | STG-04 | Visualization with alt text | DESIGN | Feeds EVD-03 |
| 7 | RT-ANL-001-STG-04-MSN-02 | STG-04 | Uncertainty & limits communication | DOCUMENTATION | **EVD-03** |
| 8 | RT-ANL-001-STG-05-MSN-01 | STG-05 | Insight & decision report | EVIDENCE_PREPARATION | **EVD-04** → CAP |

---

## Representative Missions

### RT-ANL-001-STG-01-MSN-01 — Answerable questions & ethics note

| Field | Content |
|-------|---------|
| **Category** | ORIENTATION · DESIGN |
| **Outcomes** | Frame an answerable question; write ethics/privacy note for synthetic analysis |
| **Inputs** | Scenario decision context; question template |
| **Learner tasks** | Write primary question + sub-questions; state non-questions; privacy note |
| **Outputs** | Question framing + ethics note |
| **Evidence** | Feeds Capstone question framing / EVD-04 |
| **Remediation** | Question rewrite; Nest AI/privacy Micro-Mission |
| **Reserve note** | Activates only if Route capacity-approved |

### RT-ANL-001-STG-01-MSN-02 — Dataset sources & limits

| Field | Content |
|-------|---------|
| **Category** | KNOWLEDGE |
| **Outcomes** | Identify data sources and limits for the scenario dataset |
| **Inputs** | Dataset catalogue card (synthetic); source/limit template |
| **Learner tasks** | Document source, grain, coverage gaps, and what cannot be inferred |
| **Outputs** | Sources & limits note |
| **Evidence** | Feeds EVD-01 |
| **Remediation** | Guided source worksheet |

### RT-ANL-001-STG-02-MSN-01 — Data quality profiling

| Field | Content |
|-------|---------|
| **Category** | ASSESSMENT |
| **Outcomes** | Profile quality issues (missingness, duplicates, type errors) without overcleaning |
| **Inputs** | Synthetic “dirty” dataset seed; quality checklist |
| **Learner tasks** | Produce quality profile; prioritize fixes |
| **Outputs** | Quality profile |
| **Evidence** | Feeds EVD-01 |
| **Remediation** | Prep-lab retry |
| **Tooling** | Dual path: spreadsheet **or** notebook |

### RT-ANL-001-STG-02-MSN-02 — Cleaning & preparation log

| Field | Content |
|-------|---------|
| **Category** | LABORATORY |
| **Outcomes** | Clean/prepare synthetic dataset; document reproducible prep steps with seed ID |
| **Inputs** | Seeded dirty dataset; prep log template |
| **Learner tasks** | Apply prep steps; record seed ID and decisions |
| **Outputs** | Prepared dataset note (cleaning/prep log + seed ID) |
| **Evidence** | **RT-ANL-001-EVD-01** |
| **Remediation** | Dual-path retry (sheet/notebook) |
| **Integrity** | Synthetic only; seed-bound |

### RT-ANL-001-STG-03-MSN-01 — Descriptive analysis

| Field | Content |
|-------|---------|
| **Category** | ANALYSIS |
| **Outcomes** | Compute/describe distributions and comparisons appropriate to foundation level; state assumptions |
| **Inputs** | Prepared dataset; analysis template |
| **Learner tasks** | Run descriptive analysis; document assumptions and AI disclosure |
| **Outputs** | Analysis artifact (notebook **or** spreadsheet) |
| **Evidence** | **RT-ANL-001-EVD-02** |
| **Remediation** | Method remediation worksheet |
| **Integrity** | Re-runnable steps required |

### RT-ANL-001-STG-04-MSN-01 — Visualization with alt text

| Field | Content |
|-------|---------|
| **Category** | DESIGN |
| **Outcomes** | Produce charts with text descriptions suitable for accessibility |
| **Inputs** | Analysis outputs; viz checklist |
| **Learner tasks** | Create charts; write alt text / plain-language descriptions |
| **Outputs** | Chart set + alt text |
| **Evidence** | Feeds EVD-03 |
| **Remediation** | Chart revision; a11y text alt fix |

### RT-ANL-001-STG-04-MSN-02 — Uncertainty & limits communication

| Field | Content |
|-------|---------|
| **Category** | DOCUMENTATION |
| **Outcomes** | Communicate uncertainty and limits; avoid overclaim |
| **Inputs** | Viz pack; uncertainty prompt card |
| **Learner tasks** | Write uncertainty note tied to charts; list non-claims |
| **Outputs** | Visualization pack (charts + alt text + uncertainty) |
| **Evidence** | **RT-ANL-001-EVD-03** |
| **Remediation** | Overclaim remediation rewrite |
| **Integrity** | No real PII; interpretation > decoration |

### RT-ANL-001-STG-05-MSN-01 — Insight & decision report

| Field | Content |
|-------|---------|
| **Category** | EVIDENCE_PREPARATION · SCENARIO |
| **Outcomes** | Write decision-oriented report with reproducibility steps and AI disclosure |
| **Inputs** | Prior EVD artifacts; decision report template |
| **Learner tasks** | Assemble executive interpretation + limits; list re-run steps; disclose AI |
| **Outputs** | Decision report |
| **Evidence** | **RT-ANL-001-EVD-04**; Capstone eligibility **only if** Route capacity-activated |
| **Remediation** | Pack revision cycle |

---

## Capstone handoff (reserve)

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-ANL-001-CAP-01** |
| **Eligibility** | STG-01…05 complete + EVD-01…04 accepted **and** Route capacity-activated |
| **Blueprint** | [RT-ANL-001-RESERVE-CAPSTONE-BLUEPRINT.md](../../capstones/RT-ANL-001-RESERVE-CAPSTONE-BLUEPRINT.md) |
| **Concept** | Reproducible analysis + decision brief on synthetic data |

```text
LAUNCH RESERVE — CAPACITY CONDITIONAL
Capstone enrolment forbidden until capacity + Change Control.
```

---

## Count verification

| Check | Result |
|-------|--------|
| Missions listed | **8** (exact) |
| Topics covered | Questions · dataset · quality · cleaning · descriptive analysis · viz · uncertainty · insight/decision |
| EVD-01…04 mapped | Yes |
| Capstone position | RT-ANL-001-CAP-01 (capacity-gated) |
| Status banner | **LAUNCH RESERVE — CAPACITY CONDITIONAL** |
| XP / LOCKED / Expert / Pilot | None / Not LOCKED / NOT RUN / NOT RUN |
