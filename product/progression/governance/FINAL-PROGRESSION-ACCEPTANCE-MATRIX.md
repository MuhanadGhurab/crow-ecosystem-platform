# Final Progression Acceptance Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-ACC-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §24 |
| **Last updated** | 2026-07-21 |
| **IDs in matrix** | **24** |
| **Related** | [FINAL-FORMULA-VERSION-REGISTRY.md](./FINAL-FORMULA-VERSION-REGISTRY.md) · [../calibration/CALIBRATION-ACCEPTANCE-MATRIX.md](../calibration/CALIBRATION-ACCEPTANCE-MATRIX.md) |

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

## Allowed final design statuses

```text
LOCKED AS BASELINE
LOCKED WITH VALIDATION CONDITIONS
REJECTED
DEFERRED
```

---

## Matrix

Legend: **OK** = satisfied at design/synthetic layer · **Cond** = passed with conditions · **NR** = NOT RUN · **Blk** = BLOCKED

| # | ID | Ver | Arch | Det. sim | Synth cal | CFT | Red-team | Reversal | Explain | Privacy | Minor | Real-user | Tech | Impl | Final design status |
|---|----|-----|------|----------|-----------|-----|----------|----------|---------|---------|-------|-----------|------|------|---------------------|
| 1 | FRM-XP-001 | 0.1.1 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 2 | FRM-LVL-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 3 | FRM-MOM-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 4 | FRM-MOM-002 | 0.2.0 | OK | OK | Cond | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED WITH VALIDATION CONDITIONS** |
| 5 | FRM-MAT-001 | 0.2.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 6 | FRM-MST-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 7 | FRM-MST-002 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 8 | FRM-MST-003 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 9 | FRM-BRD-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 10 | POL-TRU-001 | 0.1.0 | OK | OK | Cond | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED WITH VALIDATION CONDITIONS** |
| 11 | TPL-TTL-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 12 | TPL-TTL-002 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 13 | FRM-PRS-001 | 0.1.0 | OK | OK | Cond | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED WITH VALIDATION CONDITIONS** |
| 14 | POL-PRS-001 | 0.1.0 | OK | OK | Cond | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED WITH VALIDATION CONDITIONS** |
| 15 | POL-ACH-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 16 | FRM-LDB-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 17 | FRM-LDB-002 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 18 | FRM-LDB-003 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 19 | FRM-LDB-004 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 20 | FRM-LDB-005 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 21 | FRM-LDB-006 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 22 | POL-POP-001 | 0.1.0 | OK | OK | Cond | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED WITH VALIDATION CONDITIONS** |
| 23 | POL-COR-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |
| 24 | POL-FRS-001 | 0.1.0 | OK | OK | OK | OK | OK | OK | OK | OK | OK | NR | NR | Blk | **LOCKED AS BASELINE** |

---

## Summary counts

| Status | Count |
|--------|------:|
| LOCKED AS BASELINE | **19** |
| LOCKED WITH VALIDATION CONDITIONS | **5** |
| Remaining REVISE AND RETEST | **0** |
| Rejected active formulas | **0** |
| Conflicting active versions | **0** |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §24 — final acceptance matrix |
