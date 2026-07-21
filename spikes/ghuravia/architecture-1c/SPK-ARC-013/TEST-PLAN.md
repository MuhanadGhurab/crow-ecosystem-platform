# SPK-ARC-013 — Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Set numeric trust score | Throw `NUMERIC_TRUST_PROHIBITED` |
| 2 | Public view after restriction | No `trust` or `score` fields |
| 3 | Overturn moderation case | Eligibility restored; `masteryUnchanged=true` |
| 4 | Moderator without private identity flag | `privateIdentity=null` |
