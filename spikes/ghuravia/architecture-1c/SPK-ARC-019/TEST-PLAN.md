# SPK-ARC-019 — Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Append without reason/authority | Throw |
| 2 | Append with evidenceContent | Throw `EVIDENCE_CONTENT_PROHIBITED` |
| 3 | Break-glass without dual approver | Throw `DUAL_CONTROL_REQUIRED` |
| 4 | Break-glass with dual approver | `PRIVILEGED_CORRECTION` recorded |
| 5 | Reversal | `CORRECTION_REVERSAL` correlates to original |
