# Runtime Process Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1D-RT-PROC-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
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

## 1. Process model

| Mode | Role | Trigger |
|------|------|---------|
| **Web** | HTTP + RSC/Route Handlers | Default deployable |
| **Worker** | Outbox consumer / async jobs | `WORKER_MODE=true` |

One codebase, shared domain packages. Extraction to separate deploy when RUNTIME-CAPACITY-AND-SCALING-TRIGGERS fire.

## 2. Boundaries

- Web never performs fire-and-forget authoritative side effects (ADR-ARC-009).
- Worker inherits authZ context from job envelope.
- Cache ≠ source of truth for entitlement, progression, or Live Sky state.

## 3. Health

| Probe | Web | Worker |
|-------|-----|--------|
| Liveness | `/health/live` | worker heartbeat |
| Readiness | DB + outbox lag | queue depth |

## 4. Related

- ADR-ARC-024
- SPK-ARC-004 · SPK-ARC-022
