# SPK-ARC-011 — Result

| Field | Value |
|-------|-------|
| **Verdict** | **PASS** |
| **Environment** | Windows 10 · Node 24.15.0 · npm 11.12.1 |
| **Versions** | Node 24.15.0; FRM-XP-BAND@1.0.0 vs 2.0.0 synthetic |
| **ADR impact** | ADR-ARC-008 |
| **Reproducibility** | `npm test` — PASS |
| **Cleanup** | No node_modules committed · no DB files · no secrets |
| **Security** | No external calls · synthetic only |
| **Privacy** | No real user data |
| **Product Code** | Not introduced |

## Hypothesis

Standing records store formulaVersion; replay uses stored classifier, not latest.

## Actual

Automated `node:test` suite executed; all assertions green.

## Conditions

None blocking for derived core-stack decisions. Deeper RTL/a11y remain P1 (SPK-ARC-002/017).
