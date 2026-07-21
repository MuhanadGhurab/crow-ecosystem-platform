# Progression Baseline Status Model

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-STS-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §10 |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-BASELINE-MANIFEST.md](./PROGRESSION-BASELINE-MANIFEST.md) · [FINAL-PROGRESSION-ACCEPTANCE-MATRIX.md](./FINAL-PROGRESSION-ACCEPTANCE-MATRIX.md) |

## Purpose

Separate **design status** from **calibration**, **technical**, **implementation**, and **production readiness** dimensions so `LOCKED` cannot be misread as production-ready or implemented.

```text
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE
INTERNAL SYNTHETIC CALIBRATION COMPLETE

LOCKED does NOT mean:
BIAS FREE | FULLY FAIR | USER VALIDATED | PRODUCTION CALIBRATED
TECHNICALLY VALIDATED | PRODUCTION READY | IMPLEMENTED
```

---

## Design Status (authoritative)

| Status | Meaning |
|--------|---------|
| `LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE` | Design baseline locked under GHV.PROGRESSION.1D (unconditional lock language for IDs without open conditions) |
| `LOCKED WITH VALIDATION CONDITIONS` | Design locked; named validation conditions remain open for real-user / ops debt |
| `DEFERRED` | Intentionally postponed |
| `REJECTED` | Explicitly rejected |
| `SUPERSEDED` | Replaced by a later versioned baseline |

Use portfolio short forms in matrices: **LOCKED AS BASELINE** / **LOCKED WITH VALIDATION CONDITIONS**.

---

## Internal Synthetic Calibration

| Status | Meaning |
|--------|---------|
| `PASSED` | Synthetic integrity / fairness / calibration package accepted |
| `PASSED WITH CONDITIONS` | Synthetic PASS with retained monitoring / staffing / population conditions |
| `NOT APPLICABLE` | Construct not subject to synthetic calibration |

**Portfolio after 1D:** INTERNAL SYNTHETIC CALIBRATION COMPLETE (with conditions on MOM-002 · TRU · PRS · POP).

---

## Real-User Calibration

| Status | Allowed values |
|--------|----------------|
| Default after 1D | **`NOT RUN`** |
| Other | `IN PROGRESS` · `PASSED` · `FAILED` |

---

## Usability Validation

| Status | Allowed values |
|--------|----------------|
| Default after 1D | **`NOT RUN`** |
| Other | `IN PROGRESS` · `PASSED` · `FAILED` |

---

## Technical Validation

| Status | Allowed values |
|--------|----------------|
| Default after 1D | **`NOT RUN`** |
| Other | `IN PROGRESS` · `PASSED` · `FAILED` |

No schema, runtime, or Product Code is authorized by design lock.

---

## Implementation

| Status | Allowed values |
|--------|----------------|
| Default after 1D | **`BLOCKED`** |
| Other | `PLANNED` · `IN PROGRESS` · `IMPLEMENTED` |

---

## Production Readiness

| Status | Allowed values |
|--------|----------------|
| Default after 1D | **`BLOCKED`** |
| Other | `CONDITIONAL` · `READY` |

Conditional formula locks must **not** be weakened into unconditional production PASS language.

---

## Production Calibration

| Status | Default after 1D |
|--------|------------------|
| Production Calibration | **`NOT RUN`** |

---

## Post-1D portfolio defaults

| Dimension | Value |
|-----------|-------|
| Design | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE (5 IDs WITH VALIDATION CONDITIONS) |
| Internal synthetic calibration | COMPLETE |
| Real-user calibration | NOT RUN |
| Usability validation | NOT RUN |
| Technical validation | NOT RUN |
| Production calibration | NOT RUN |
| Implementation | BLOCKED |
| Production readiness | BLOCKED |

## Rules

1. Never combine design lock and production readiness into one ambiguous label.
2. Conditions travel with the ID until closed by evidence + Change Request / Gate.
3. Forbidden claim language: BIAS FREE · FULLY FAIR · USER VALIDATED · PRODUCTION CALIBRATED · TECHNICALLY VALIDATED · PRODUCTION READY · IMPLEMENTED.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §10 — status model lock |
