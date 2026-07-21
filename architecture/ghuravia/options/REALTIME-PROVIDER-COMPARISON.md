# Realtime Provider Comparison

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1D-OPT-RT-001 |
| **Version** | 1.0.0 |
| **Status** | **COMPARISON · DECISION DEFERRED** |
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

| Option | Pros | Cons |
|--------|------|------|
| Ably | Managed, global | Cost |
| Pusher | Simple SDK | Vendor lock |
| Socket.io self | Control | Ops |
| SSE + polling fallback | Simple | Latency |

**Architecture stance:** Adapter locked; provider **DEFERRED** (ADR-ARC-030).

## Non-claims

No vendor selected. No production SLO.
