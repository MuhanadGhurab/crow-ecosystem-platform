# Search Discovery Runtime Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1D-SRCH-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE · RELATIONAL FTS FIRST** |
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

## Principles

- Search must enforce authZ + privacy on every query.
- Trust and legal identity not indexed for public discovery.
- Relational FTS first; external provider via adapter later.

## Pipeline

Query → authZ filter → FTS → projection sanitize → results.

## Related

- ADR-ARC-031 · SPK-ARC-016 · SEARCH-STACK-COMPARISON.md
