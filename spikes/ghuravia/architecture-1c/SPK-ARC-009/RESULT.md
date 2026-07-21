# SPK-ARC-009 — Result

| Field | Value |
|-------|-------|
| **Verdict** | **PASS** |
| **Environment** | Windows 10 · Node 24.x · node:test |
| **Reproducibility** | `npm run test:009` — PASS |
| **Product Code** | Not introduced |

## Hypothesis

Targeted recalc with opaque refs proves ledger separation.

## Actual

Revoke/restore recalculates only affected capabilities. Unrelated capabilities unchanged. Idempotent approve confirmed.

## Conditions

None blocking architecture acceptance.
