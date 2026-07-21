# Search Stack Comparison

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1D-OPT-SRCH-001 |
| **Version** | 1.0.0 |
| **Status** | **COMPARISON · RELATIONAL FTS FIRST** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

```text
Commercial Event ↛ XP/Momentum/Mastery/Trust/Title/Prestige
Notification Failure ↛ Business-State / Progression / Entitlement
Spectator ↛ participant mutation
Reconnect ↛ duplicate contribution
Cache ≠ source of truth
Search must enforce authZ + privacy
Scanner fail-closed retained
Trust non-public non-numeric
Product Code BLOCKED
No production SLOs; use DRAFT PERFORMANCE TARGET / LOCAL SPIKE ONLY
Saudi: PLANNED CAPABILITY / OFFICIAL ACCESS NOT VERIFIED
```

## Options

| Option | Fit |
|--------|-----|
| PostgreSQL FTS | **Launch pattern** |
| Meilisearch | Deferred adapter |
| Elasticsearch | Deferred — ops cost |
| Client filter | Rejected — no authZ |

See ADR-ARC-031.
