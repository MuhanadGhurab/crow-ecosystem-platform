# SPK-ARC-008 — Result

| Field | Value |
|-------|-------|
| **Verdict** | **PASS** |
| **Environment** | Windows 10 · Node 24.x · node:test |
| **ADR impact** | ADR-ARC-021 pipeline ACCEPTED; provider DEFERRED |
| **Reproducibility** | `npm run test:008` — PASS |
| **Security** | Fail-closed enforced even when failOpen flag set |
| **Product Code** | Not introduced |

## Hypothesis

Synthetic scanner proves fail-closed release gate.

## Actual

Outage path returns `releaseAllowed=false`. Malware and secret markers block release.

## Conditions

Production AV vendor not selected. Detection rates not benchmarked.
