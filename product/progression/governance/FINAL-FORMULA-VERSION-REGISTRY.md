# Final Formula Version Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-FVR-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §9 |
| **Source commits** | 1A `d285a0b` · 1B `12e4c46` · 1C `9ce3e1e` |
| **Last updated** | 2026-07-21 |
| **Registered IDs** | **24** (exactly one active version each) |
| **Related** | [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../formulas/FORMULA-REVISION-LOG.md](../formulas/FORMULA-REVISION-LOG.md) · [FINAL-PROGRESSION-ACCEPTANCE-MATRIX.md](./FINAL-PROGRESSION-ACCEPTANCE-MATRIX.md) |

```text
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE
INTERNAL SYNTHETIC CALIBRATION COMPLETE

REAL-USER CALIBRATION: NOT RUN
USABILITY VALIDATION: NOT RUN
TECHNICAL VALIDATION: NOT RUN
PRODUCTION CALIBRATION: NOT RUN
IMPLEMENTATION: BLOCKED
PRODUCTION READINESS: BLOCKED
```

## Purpose

Lock the final candidate formula/policy/template versions for the GHURAVIA Progression Design Baseline v1.0.0. Versions and equations are those already set under GHV.PROGRESSION.1C — **no equation or threshold changes** in 1D.

---

## Final version table

| ID | Final version | Prior | Output changed (1C) | Revision reason | Revision Log | Synthetic calibration | Real-user | Technical | Design status |
|----|---------------|-------|---------------------|-----------------|--------------|------------------------|-----------|-----------|---------------|
| FRM-XP-001 | **0.1.1** | 0.1.0 | Clarification only | Evidence XP once-per-approval | FORMULA-REVISION-LOG | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-LVL-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-MOM-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-MOM-002 | **0.2.0** | 0.1.0 | Yes (buffer) | Alt B ±2 promotion buffer | FORMULA-REVISION-LOG | PASSED WITH CONDITIONS | NOT RUN | NOT RUN | **LOCKED WITH VALIDATION CONDITIONS** |
| FRM-MAT-001 | **0.2.0** | 0.1.0 | Yes (contexts/skip) | Mission/Stage contexts; governed Rank skip | FORMULA-REVISION-LOG | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-MST-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-MST-002 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-MST-003 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-BRD-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| POL-TRU-001 | **0.1.0** | 0.1.0 | No | Soft watch → conditions | — | PASSED WITH CONDITIONS | NOT RUN | NOT RUN | **LOCKED WITH VALIDATION CONDITIONS** |
| TPL-TTL-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| TPL-TTL-002 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-PRS-001 | **0.1.0** | 0.1.0 | No | Soft watch → conditions | — | PASSED WITH CONDITIONS | NOT RUN | NOT RUN | **LOCKED WITH VALIDATION CONDITIONS** |
| POL-PRS-001 | **0.1.0** | 0.1.0 | No | Soft watch → conditions | — | PASSED WITH CONDITIONS | NOT RUN | NOT RUN | **LOCKED WITH VALIDATION CONDITIONS** |
| POL-ACH-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-LDB-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-LDB-002 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-LDB-003 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-LDB-004 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-LDB-005 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| FRM-LDB-006 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| POL-POP-001 | **0.1.0** | 0.1.0 | No | Soft watch → conditions | — | PASSED WITH CONDITIONS | NOT RUN | NOT RUN | **LOCKED WITH VALIDATION CONDITIONS** |
| POL-COR-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |
| POL-FRS-001 | **0.1.0** | 0.1.0 | No | — | — | PASSED | NOT RUN | NOT RUN | LOCKED AS BASELINE |

---

## Conditions register (5 IDs)

| ID | Validation condition retained |
|----|-------------------------------|
| **FRM-MOM-002** | Monitor league band transitions in real pilot; keep ±2 buffer; do not equalize leagues |
| **POL-TRU-001** | Calibrate time windows / false-restriction risk with Cohort E discipline; no public numeric Trust |
| **FRM-PRS-001** | Ascendant soft watch; Apex/Obsidian = 0 in ordinary first-year launch-realistic; no cosmetic threshold hike |
| **POL-PRS-001** | Validate panel staffing / quorum feasibility before production authority workflows |
| **POL-POP-001** | Validate population band cuts before authoritative public boards |

---

## Active-version rule

Every active ID has **exactly one** active version. Conflicting active versions: **0**. Rejected active formulas: **0**. REVISE AND RETEST: **0**.

Authoritative formula documents remain under `product/progression/formulas/` — this registry does not duplicate equations.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D — lock final candidate versions (unchanged from 1C) |
