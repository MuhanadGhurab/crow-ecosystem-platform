# RT-ANL-001 — Practical Data Analysis Foundations

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RT-ANL-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — LAUNCH RESERVE / LAUNCH RESERVE — CAPACITY CONDITIONAL |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](../../architecture/ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](../../architecture/STAGE-ARCHITECTURE-STANDARD.md) · [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [NEST-DEPENDENCY-MAP.md](../../nest/NEST-DEPENDENCY-MAP.md) · [LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md](../LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md) |
| **Source research** | RC-ANL-001 (GHV.LEARNING.1A) |
| **Limitations** | Working title; no Product Code; no XP formulas; **must NOT be committed launch** without capacity statement + Change Control |
| **Unresolved** | Capacity decision; Change Control record; Mission scripts (1C); 1D inclusion/exclusion |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B architecture (reserve) |

```text
ARCHITECTURE RECOMMENDED — LAUNCH RESERVE
LAUNCH RESERVE — CAPACITY CONDITIONAL

Must NOT be committed launch without:
  (1) Founder capacity confirmation (Nest + four P0 Routes + CXW + SEX not delayed)
  (2) Change Control note approving inclusion
Never final LOCKED in this Gate.
```

---

## Capacity & Change Control gate

| Rule | Requirement |
|------|-------------|
| **Launch commitment** | **Forbidden** until capacity + Change Control recorded |
| **If deferred** | POST-LAUNCH; keep data-literacy Micro-Missions inside Nest/LEAD as 1A noted |
| **Architecture purpose** | Ready-to-activate design if capacity appears — not a silent fifth P0 |

---

## Identity

| Field | Content |
|-------|---------|
| **Canonical ID** | **RT-ANL-001** |
| **Prior candidate ID** | RC-ANL-001 |
| **Working title** | Practical Data Analysis Foundations (reserve) |
| **Horizon** | HRZ-ANL (ANALYZE) |
| **Route type** | FOUNDATIONAL · ANALYTICAL · **LAUNCH RESERVE** |
| **Capability statement** | Answer practical questions with data: frame questions and sources, prepare and quality-check datasets, perform descriptive analysis, visualize with uncertainty awareness, and report decisions — using synthetic data and dual spreadsheet/notebook paths. |
| **Target learner** | Nest-ready learners with spreadsheet literacy; capacity-conditional launch audience |

---

## Entry / Exit

| Field | Content |
|-------|---------|
| **Entry** | Nest readiness **≥ 50% path** (Guided Skip + Micro-Missions) **or** Nest complete / Ready to Fly — Scope §3.5 **unchanged**. Spreadsheet literacy remains Route prerequisite. **Plus** Route must be capacity-activated via Change Control before learner enrolment as committed launch catalogue. |
| **Exit** | All five Stages complete **and** required Evidence accepted **and** Capstone eligible (`RT-ANL-001-CAP-01`) |
| **Prerequisites** | Nest (N-FIL · N-BRW · N-PRV · N-AIL · N-TSH · N-COL); spreadsheet literacy |
| **Corequisites** | None hard-required |
| **Recommended** | Bridge to RT-LED-001 for decision use; N-ACC · N-PWD reviews |

---

## Stage table (5 Stages)

| Stage ID | Title | Outcomes | Mission categories | Evidence contribution | Remediation | Next Unlock |
|----------|-------|----------|--------------------|----------------------|-------------|-------------|
| **RT-ANL-001-STG-01** | Questions & data | Frame an answerable question; identify data sources/limits; ethics/privacy note | ORIENTATION · KNOWLEDGE · DESIGN · DOCUMENTATION | Feeds Capstone question framing | Question rewrite; Nest AI/privacy Micro-Mission | Unlocks STG-02 |
| **RT-ANL-001-STG-02** | Quality & preparation | Profile quality issues; clean/prepare synthetic dataset; document prep steps | GUIDED_PRACTICE · LABORATORY · DOCUMENTATION · ASSESSMENT | Supports reproducibility Evidence | Prep-lab retry; dual-path (sheet/notebook) | Unlocks STG-03 |
| **RT-ANL-001-STG-03** | Descriptive analysis | Compute/describe distributions and comparisons appropriate to level; state assumptions | ANALYSIS · INDEPENDENT_PRACTICE · LABORATORY · DOCUMENTATION | Core analysis artifact | Method remediation worksheet | Unlocks STG-04 |
| **RT-ANL-001-STG-04** | Visualization & uncertainty | Produce charts with text descriptions; communicate uncertainty/limits; avoid overclaim | ANALYSIS · DESIGN · DOCUMENTATION · ASSESSMENT | Viz + uncertainty note | Chart revision; a11y text alt fix | Unlocks STG-05 |
| **RT-ANL-001-STG-05** | Decision reporting | Write decision-oriented report; reproducibility steps; Evidence pack + AI disclosure | DOCUMENTATION · EVIDENCE_PREPARATION · SCENARIO · ASSESSMENT | Decision report; Capstone eligibility | Pack revision cycle | Unlocks **RT-ANL-001-CAP-01** (only if Route capacity-activated) |

---

## Evidence anchors

| ID | Title | Artifact class | Stage contribution | Integrity | Review |
|----|-------|----------------|--------------------|-----------|--------|
| **RT-ANL-001-EVD-01** | Prepared dataset note | Cleaning/prep log + seed ID | STG-02 | Synthetic only; seed-bound | Reproducibility |
| **RT-ANL-001-EVD-02** | Analysis artifact | Notebook or spreadsheet analysis | STG-03 | Re-runnable steps; AI disclosure | Method quality |
| **RT-ANL-001-EVD-03** | Visualization pack | Charts + alt text + uncertainty | STG-04 | No real PII; overclaim check | Interpretation > decoration |
| **RT-ANL-001-EVD-04** | Decision report | Executive interpretation + limits | STG-01 · STG-05 | Scenario-specific insight | Decision usefulness |

---

## Capstone

| Field | Content |
|-------|---------|
| **Capstone ID** | **RT-ANL-001-CAP-01** |
| **Eligibility** | STG-01…05 complete + EVD-01…04 accepted **and** Route is capacity-activated |
| **Concept** | Answer a business question on synthetic data with reproducible steps (1A CAP-ANL concept) |
| **Output shape** | Prep note · analysis · viz+uncertainty · decision report |
| **Category** | CAPSTONE |

---

## Cross-Wing / Secure Extension links

| Link | Note |
|------|------|
| **BRG-ANL-LED** | Optional Bridge to RT-LED-001 (data-informed decisions) if both active |
| **SEX-003** | Secure Data Handling Extension is POST-LAUNCH alt — not duplicated here |
| **CXW** | Not required for this reserve Route Exit |

---

## Tooling

| Field | Content |
|-------|---------|
| **Primary classes** | BROWSER-ONLY · **LOCAL-SAFE** (spreadsheet/notebook) |
| **Vendor posture** | Tool-agnostic tasks; no paid BI suite hard deps; no GPU clusters |
| **Avoid** | Real personal datasets; Spark clusters at launch foundations |

---

## Safety

- Synthetic data only  
- Ban real personal datasets  
- Cap dataset size  
- AI disclosure mandatory on narrative analysis  

---

## Arabic-first

| Field | Content |
|-------|---------|
| **Feasibility** | High |
| **Notes** | Arabic-first interpretation coaching; retain English function/library names with glossary; dual sheet/notebook paths |

---

## Freshness

| Class | Areas |
|-------|-------|
| **Stable** | Question framing, data ethics, uncertainty communication |
| **Slow-changing** | Descriptive methods |
| **Fast** | Specific notebook UI — keep thin |

---

## Expert review

| Type | Need |
|------|------|
| Analytics practitioner | Scope vs overclaim |
| Privacy | Synthetic data policy |
| Arabic instructional | Interpretation language |
| Capacity reviewer (Founder) | Change Control before launch commit |

---

## Route-Proven (qualitative)

Proven when learners re-run analysis from their pack, interpretations respect uncertainty, and no real PII appears — **qualitative only**. Not proven as launch catalogue item until capacity + Change Control.

---

## Unresolved

1. **Capacity confirmation** (blocking for committed launch)  
2. **Change Control note** ID when/if included  
3. Mission scripts (1C)  
4. Whether reserve stays POST-LAUNCH with Nest Micro-Missions only  
5. 1D include/exclude decision  

---

## Stage review table (Gate §33)

| Stage ID | Outcomes clarity | Category fit | Evidence contribution | Remediation path | Unlock coherence | Safety | A11y | Integrity | Offline / tooling | Reviewer | Verdict |
|----------|------------------|--------------|----------------------|------------------|------------------|--------|------|-----------|-------------------|----------|---------|
| STG-01 | Clear | OK | Mapped | Defined | OK | Pass | Pass | Watch (AI) | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-02 | Clear | OK | EVD-01 | Defined | OK | Pass | Pass (dual path) | Pass | LOCAL-SAFE | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-03 | Clear | OK | EVD-02 | Defined | OK | Pass | Pass | Watch (AI) | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-04 | Clear | OK | EVD-03 | Defined | OK | Pass | Pass (alt text) | Pass | High | Founder (RAVEN) | **ARCHITECTURE OK** |
| STG-05 | Clear | OK | EVD-04 | Defined | OK | Pass | Pass | Watch (AI) | High | Founder (RAVEN) | **ARCHITECTURE OK** |

**§33 aggregate:** Stage count **5/5** · All Stages **ARCHITECTURE OK** · Route status remains **ARCHITECTURE RECOMMENDED — LAUNCH RESERVE / LAUNCH RESERVE — CAPACITY CONDITIONAL** (not LOCKED; not committed launch).
