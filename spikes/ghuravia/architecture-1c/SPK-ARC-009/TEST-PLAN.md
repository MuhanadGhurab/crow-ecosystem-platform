# SPK-ARC-009 — Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Approve Evidence | Capability `MASTERED`; `ledgerContainsObjectBody=false` |
| 2 | Multiple capabilities | Independent mastery per capability |
| 3 | Revoke one Evidence | Only affected capability recalculated |
| 4 | Restore revoked | Mastery restored for affected capability |
| 5 | Duplicate approve | Idempotent response |
