# Technical Decision Acceptance Matrix

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

```text
Remaining RETURN TO SPIKE: 0
Conflicting ADRs: 0
Product Code: BLOCKED
```

| Decision area | Evidence basis | Outcome |
|---------------|----------------|---------|
| Platform shape | SPK-ARC-001,021 | ACCEPTED |
| Frontend stack | SPK-ARC-001 | ACCEPTED WITH CONDITIONS |
| Backend stack | SPK-ARC-001,003,010 | ACCEPTED WITH CONDITIONS |
| Interaction model | SPK-ARC-003,010,011 | ACCEPTED |
| Primary datastore | SPK-ARC-005,010,011 | ACCEPTED |
| Data access | SPK-ARC-005,010,011 | ACCEPTED WITH CONDITIONS |
| Learning Graph representation | SPK-ARC-005 | ACCEPTED |
| Progression ledger pattern | SPK-ARC-010,011 | ACCEPTED |
| Jobs and event publication | SPK-ARC-010,021 | ACCEPTED |
| Cache boundary | Integrity-first boundary review | ACCEPTED |
| Testing toolchain | 6/6 reproducible spike passes | ACCEPTED |
| Language and type safety | Cross-spike TypeScript harness success | ACCEPTED |
