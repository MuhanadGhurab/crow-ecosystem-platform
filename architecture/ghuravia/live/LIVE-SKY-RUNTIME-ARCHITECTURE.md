# Live Sky Runtime Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1D-LIVE-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE · REALTIME PROVIDER DEFERRED** |
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

## Roles

| Role | Capabilities |
|------|--------------|
| Participant | Mutate contribution (authorized) |
| Spectator | Read-only — Spectator ↛ participant mutation |

## Realtime

Adapter locked; provider deferred (REALTIME-PROVIDER-ADAPTER.md).

## Reconnect

Reconnect ↛ duplicate contribution via idempotency keys (SPK-ARC-015).

## Related

- ADR-ARC-030 · LIVE-SKY-CHANNEL-MODEL.md
