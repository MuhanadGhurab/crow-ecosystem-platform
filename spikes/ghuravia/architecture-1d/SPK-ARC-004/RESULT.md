# SPK-ARC-004 — Result

| Field | Value |
|-------|-------|
| **Verdict** | **PASS** |
| **Environment** | Local · Node harness · 2026-07-21 |
| **ADR impact** | ADR-ARC-024
| **Reproducibility** | See commands.txt |
| **Cleanup** | Temp artifacts only |
| **Security** | No external calls · synthetic only |
| **Privacy** | No real user data |
| **Product Code** | Not introduced |

## Hypothesis

All 92 governed screens map to exactly one shell route with zero aliases.

## Actual

Automated assertions green per TEST-PLAN.md.

## Conditions

Provider/host validation remains deferred where ADR specifies adapter lock.
