# Formula Version Comparison — 1B → 1C

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-FVC-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **IDs compared** | **24** |
| **Limitations** | Comparison of candidate versions · **NOT production calibrated** · **synthetic only** |

## Purpose

Record every registered ID’s version movement from the 1B baseline (`0.1.0`) through 1C calibration judgment.

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Status legend

| Status string | Meaning |
|---------------|---------|
| UNCHANGED | Same version; numerics untouched |
| CLARIFICATION | Definition / explainability clarification without magnitude retune |
| BUFFER / HYSTERESIS | Transition rule added; band floors kept |
| — | No row |

---

## Comparison table (all 24 IDs)

| # | ID | 1B version | 1C version | Change summary | Finding / principle | Calibration status |
|---|----|------------|------------|----------------|---------------------|--------------------|
| 1 | FRM-XP-001 | 0.1.0 | **0.1.1** | Evidence XP **once-per-approval** clarification; XP ≠ Skill | CAL-FND-005 · CAL-PR-10 · CAL-PR-11 | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 2 | FRM-LVL-001 | 0.1.0 | 0.1.0 | None | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 3 | FRM-MOM-001 | 0.1.0 | 0.1.0 | Weekly components unchanged; monitored with MOM-002 | CAL-FND-002 | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 4 | FRM-MOM-002 | 0.1.0 | **0.2.0** | **Alternative B** promotion buffer **±2**; keep best-6 / 8w; floors unchanged | CAL-FND-002 · CAL-PR-09 | CALIBRATION RECOMMENDED — ADVANCE TO 1D **WITH CONDITIONS** |
| 5 | FRM-MAT-001 | 0.1.0 | **0.2.0** | Mission/Stage **learning contexts**; governed Rank skip; Fledgling reachable; not forced population | CAL-FND-001 · CAL-PR-10 · CAL-PR-12 · CAL-PR-13 | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 6 | FRM-MST-001 | 0.1.0 | 0.1.0 | Floors unchanged (Cohort A density interpreted, not retuned) | CAL-FND-003 · CAL-PR-06 | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 7 | FRM-MST-002 | 0.1.0 | 0.1.0 | None | CAL-FND-003 | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 8 | FRM-MST-003 | 0.1.0 | 0.1.0 | None | CAL-FND-003 | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 9 | FRM-BRD-001 | 0.1.0 | 0.1.0 | None | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 10 | POL-TRU-001 | 0.1.0 | 0.1.0 | Time windows remain candidates; monitor false-restriction risk | Handoff watch | CALIBRATION RECOMMENDED — ADVANCE TO 1D **WITH CONDITIONS** |
| 11 | TPL-TTL-001 | 0.1.0 | 0.1.0 | None | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 12 | TPL-TTL-002 | 0.1.0 | 0.1.0 | None | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 13 | FRM-PRS-001 | 0.1.0 | 0.1.0 | PEI weights unchanged; Ascendant soft watch; no cosmetic hike | CAL-FND-004 · CAL-PR-14 | CALIBRATION RECOMMENDED — ADVANCE TO 1D **WITH CONDITIONS** |
| 14 | POL-PRS-001 | 0.1.0 | 0.1.0 | Quorum / panel staffing remain candidates | CAL-FND-004 | CALIBRATION RECOMMENDED — ADVANCE TO 1D **WITH CONDITIONS** |
| 15 | POL-ACH-001 | 0.1.0 | 0.1.0 | None | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 16 | FRM-LDB-001 | 0.1.0 | 0.1.0 | Opt-in UX watch | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 17 | FRM-LDB-002 | 0.1.0 | 0.1.0 | Provisional UX; league buffer interaction watch | CAL-FND-002 | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 18 | FRM-LDB-003 | 0.1.0 | 0.1.0 | Reviewer bias watch | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 19 | FRM-LDB-004 | 0.1.0 | 0.1.0 | Event norms watch | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 20 | FRM-LDB-005 | 0.1.0 | 0.1.0 | CXW scarcity watch | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 21 | FRM-LDB-006 | 0.1.0 | 0.1.0 | Sanitization watch | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 22 | POL-POP-001 | 0.1.0 | 0.1.0 | Population band cuts remain candidates | Handoff watch | CALIBRATION RECOMMENDED — ADVANCE TO 1D **WITH CONDITIONS** |
| 23 | POL-COR-001 | 0.1.0 | 0.1.0 | None | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |
| 24 | POL-FRS-001 | 0.1.0 | 0.1.0 | Freshness windows remain candidates | — | CALIBRATION RECOMMENDED — ADVANCE TO 1D |

## Counts

| Class | Count |
|-------|------:|
| Version bumps in 1C | **3** (MAT 0.2.0, MOM-002 0.2.0, XP 0.1.1) |
| Unchanged version | **21** |
| ADVANCE TO 1D (unconditional in matrix sense) | see acceptance matrix |
| ADVANCE TO 1D WITH CONDITIONS | MOM-002, PRS pair, TRU, POP (and related watches) |

## Documents owning bumped formulas

| ID | Document |
|----|----------|
| FRM-XP-001 | [../formulas/FLIGHT-XP-FORMULA.md](../formulas/FLIGHT-XP-FORMULA.md) |
| FRM-MOM-002 | [../formulas/MOMENTUM-FORMULA.md](../formulas/MOMENTUM-FORMULA.md) |
| FRM-MAT-001 | [../formulas/MATURITY-FORMULA.md](../formulas/MATURITY-FORMULA.md) |
| Registry | [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) |
| Revision log | [../formulas/FORMULA-REVISION-LOG.md](../formulas/FORMULA-REVISION-LOG.md) |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial 24-ID comparison table for GHV.PROGRESSION.1C |
