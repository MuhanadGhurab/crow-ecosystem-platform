# Save Resume Sync Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1D-RT-SYNC-002 |
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

## 1. Authority

Server authoritative for: completion, eligibility, entitlement, Trust, progression.

## 2. Capability classes

See SAVE-RESUME-SYNC-OFFLINE-VALIDATION-PLAN.md (1A plan — unchanged).

## 3. Merge policy

| Conflict | Resolution |
|----------|------------|
| Draft vs server completion | Server wins |
| Multi-device draft | User prompt + explanation |
| Live Sky contribution | Idempotency key (SPK-ARC-015) |

## 4. Performance

**DRAFT PERFORMANCE TARGET LOCAL SPIKE ONLY** — no production SLO.

## Related

- ADR-ARC-028 · SPK-ARC-006
