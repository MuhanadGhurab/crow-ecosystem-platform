# Calibration Acceptance Matrix — All 24 IDs

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-ACC-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **IDs in matrix** | **24** |
| **Limitations** | Acceptance for advancement to 1D · **NOT production calibrated** · **synthetic only** |

## Allowed status values

```text
CALIBRATION RECOMMENDED — ADVANCE TO 1D
CALIBRATION RECOMMENDED — ADVANCE TO 1D WITH CONDITIONS
REVISE BEFORE 1D
REJECTED
```

```text
Package posture:
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

---

## Matrix

| # | ID | Version | Integrity | Fairness | Sensitivity | Explainability | Findings | Candidate status |
|---|----|---------|-----------|----------|-------------|----------------|----------|------------------|
| 1 | FRM-XP-001 | 0.1.1 | OK | OK | Watch | Clarified | CAL-FND-005 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 2 | FRM-LVL-001 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 3 | FRM-MOM-001 | 0.1.0 | OK | Watch | Watch | OK | CAL-FND-002/007 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 4 | FRM-MOM-002 | 0.2.0 | OK | Watch | High→Buffered | OK | CAL-FND-002/006 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D WITH CONDITIONS** |
| 5 | FRM-MAT-001 | 0.2.0 | OK | OK | Watch | Clarified | CAL-FND-001 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 6 | FRM-MST-001 | 0.1.0 | OK | OK | Watch | OK | CAL-FND-003 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 7 | FRM-MST-002 | 0.1.0 | OK | OK | Watch | OK | CAL-FND-003 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 8 | FRM-MST-003 | 0.1.0 | OK | OK | Watch | OK | CAL-FND-003 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 9 | FRM-BRD-001 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 10 | POL-TRU-001 | 0.1.0 | OK | Watch | Watch | OK | Handoff | **CALIBRATION RECOMMENDED — ADVANCE TO 1D WITH CONDITIONS** |
| 11 | TPL-TTL-001 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 12 | TPL-TTL-002 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 13 | FRM-PRS-001 | 0.1.0 | OK | Soft watch | Watch | OK | CAL-FND-004 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D WITH CONDITIONS** |
| 14 | POL-PRS-001 | 0.1.0 | OK | Soft watch | Watch | OK | CAL-FND-004 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D WITH CONDITIONS** |
| 15 | POL-ACH-001 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 16 | FRM-LDB-001 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 17 | FRM-LDB-002 | 0.1.0 | OK | Watch | Watch | OK | CAL-FND-002 | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 18 | FRM-LDB-003 | 0.1.0 | OK | Watch | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 19 | FRM-LDB-004 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 20 | FRM-LDB-005 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 21 | FRM-LDB-006 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 22 | POL-POP-001 | 0.1.0 | OK | Watch | Watch | OK | Handoff | **CALIBRATION RECOMMENDED — ADVANCE TO 1D WITH CONDITIONS** |
| 23 | POL-COR-001 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |
| 24 | POL-FRS-001 | 0.1.0 | OK | OK | Watch | OK | — | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** |

---

## Conditions register (WITH CONDITIONS rows)

| ID | Condition into 1D / pilot |
|----|---------------------------|
| **FRM-MOM-002** | Monitor league band transitions in real pilot; keep Alternative B ±2 buffer; do not equalize leagues; track label vs score stability |
| **POL-TRU-001** | Calibrate time windows / signal weights against false-restriction risk using Cohort E; no public numeric Trust |
| **FRM-PRS-001** | Monitor Ascendant nomination rate in Cohort B; no threshold hike solely to eliminate nominees; Apex/Obsidian remain 0 in ordinary first-year launch-realistic |
| **POL-PRS-001** | Validate panel staffing / quorum feasibility before production authority workflows |
| **POL-POP-001** | Validate leaderboard population band cuts with opt-in UX; no authoritative board on undersized populations |

---

## Summary counts

| Status | Count |
|--------|------:|
| CALIBRATION RECOMMENDED — ADVANCE TO 1D | **19** |
| CALIBRATION RECOMMENDED — ADVANCE TO 1D WITH CONDITIONS | **5** |
| REVISE BEFORE 1D | **0** |
| REJECTED | **0** |

## Package verdict line

```text
CALIBRATION RECOMMENDED — ADVANCE TO 1D
(with conditions on MOM-002, TRU, PRS, PRS policy, LDB population)
PENDING 1D
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial 24-ID calibration acceptance matrix |
