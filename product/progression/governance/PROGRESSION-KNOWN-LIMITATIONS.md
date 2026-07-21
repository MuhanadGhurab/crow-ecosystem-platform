# Progression Known Limitations

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-LIM-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §28 |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-BASELINE-MANIFEST.md](./PROGRESSION-BASELINE-MANIFEST.md) · [REAL-USER-PROGRESSION-VALIDATION-PLAN.md](./REAL-USER-PROGRESSION-VALIDATION-PLAN.md) · [PROGRESSION-TECHNICAL-VALIDATION-PLAN.md](./PROGRESSION-TECHNICAL-VALIDATION-PLAN.md) · Risk Register · Assumption Register |

```text
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE
≠ PRODUCTION CALIBRATED ≠ USER VALIDATED ≠ TECHNICALLY VALIDATED
≠ PRODUCTION READY ≠ IMPLEMENTED ≠ BIAS FREE ≠ FULLY FAIR

INTERNAL SYNTHETIC CALIBRATION COMPLETE
REAL-USER CALIBRATION: NOT RUN
USABILITY VALIDATION: NOT RUN
TECHNICAL VALIDATION: NOT RUN
PRODUCTION CALIBRATION: NOT RUN
IMPLEMENTATION: BLOCKED
PRODUCTION READINESS: BLOCKED
```

## Purpose

Record known limitations that remain true after Progression Design Baseline lock. These limitations **must remain visible** and must not be overwritten by “LOCKED” language.

---

## Known limitations (Gate §28 minimum set)

| # | Limitation | Status |
|---|------------|--------|
| 1 | Synthetic calibration only | **synthetic only** |
| 2 | Real-user calibration not run | **NOT RUN** |
| 3 | Usability tests not run | **NOT RUN** |
| 4 | Technical validation not run | **NOT RUN** |
| 5 | Runtime not implemented | **IMPLEMENTATION BLOCKED** |
| 6 | Formula storage not implemented | **NO SCHEMA** |
| 7 | Trust policy not operationally tested | **NOT RUN** |
| 8 | Moderation workflow unvalidated | **NOT RUN** |
| 9 | Prestige panels not staffed | Validation debt |
| 10 | Title catalogue deferred (full production catalogue) | Deferred depth |
| 11 | Real distributions unknown | Synthetic only |
| 12 | Small-community behavior unknown | Unknown |
| 13 | Arabic explanations not user-tested | **NOT RUN** |
| 14 | Accessibility outcomes not user-tested | **NOT RUN** |
| 15 | Minor activation legally conditional | Conditional / legal |
| 16 | Live Sky scoring unvalidated | Technical / ops debt |
| 17 | Reviewer consistency unvalidated | **NOT RUN** |
| 18 | Anomaly detection not designed | Not designed |
| 19 | Recalculation performance unknown | Unknown |
| 20 | Formula migrations unvalidated | **NOT RUN** |

### Additional retained conditions

* FRM-MOM-002 · POL-TRU-001 · FRM-PRS-001 · POL-PRS-001 · POL-POP-001 remain **LOCKED WITH VALIDATION CONDITIONS**.
* Cross-baseline screen-count defect (90 vs 92) is external debt — see [CROSS-BASELINE-SCREEN-COUNT-DEFECT.md](./CROSS-BASELINE-SCREEN-COUNT-DEFECT.md).
* Learning Design Baseline v1.0.0 is unchanged and out of scope for progression formula edits.

## Visibility rule

These limitations remain authoritative after 1D lock. Closing a limitation requires evidence (real-user report, tech validation Gate, staffing proof, legal clearance) and register updates — not status-label inflation.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §28 — known limitations lock |
