# GHURAVIA Product Code Bootstrap Baseline v0.1.0

| Field | Value |
|-------|-------|
| **Baseline** | **GHURAVIA Product Code Bootstrap Baseline v0.1.0** |
| **Status** | **ACTIVE — LIMITED FOUNDATION PRODUCT CODE AUTHORIZED AND CREATED** |
| **Gate** | GHV.IMPLEMENTATION.0A |
| **Authorization** | GHV-IMP-AUTH-001 |
| **Date** | 2026-07-21 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `d74ab043ff1c855f2b61e883d5b157f8db2d9d56` |

## Source baselines

- Product Definition LOCKED
- Master Screen Registry 92 ACTIVE · 7 shells · 0 aliases
- Learning Design Baseline v1.0.0 LOCKED
- Progression Design Baseline v1.0.0 LOCKED
- Architecture Design Baseline v1.0.0 LOCKED
- Implementation Entry Validation Baseline v0.1.0 READY WITH CONDITIONS

## Runtime versions

| Component | Version | Source |
|-----------|---------|--------|
| Node | 24.15.0 | Validation.1B + engines |
| npm | 11.12.1 | Validation.1B + engines |
| Next.js | 16.2.10 | Validation.1B / ADR-ARC-002 |
| React | 19.2.8 | Validation.1B / ADR-ARC-002 |
| Drizzle ORM | 0.45.2 | Validation.1B / ADR-ARC-006 |
| postgres.js | 3.4.x | Implementation selection |
| TypeScript | 6.0.3 | Compatibility pin (Validation.1B preferred 7.0.2; Next types) |
| Zod | 4.x | Implementation selection |

## Authorized packages

```text
apps/web
packages/config
packages/contracts
packages/domain
packages/data
packages/provider-mocks
packages/testing
workers/background
```

## Database / migration

- Records: activation_aggregates, audit_events, outbox_events
- Personal data fields: **none**
- Migration: `packages/data/drizzle/0000_foundation.sql`
- Local-only guard: enforced
- External / Preview / Production DB: **rejected / unused**

## Providers

Mocks only: identity, email-delivery, observability.

## Restrictions

```text
Data: synthetic only
Providers: mocks only
Preview: BLOCKED
Staging: BLOCKED
Production: NOT AUTHORIZED
Deployment: PROHIBITED
```

## Known limitations

- TypeScript 6.0.3 compatibility pin vs Validation.1B 7.0.2 candidate
- No real provider sandboxes
- No Preview infrastructure
- Foundation slice only — not full activation UX or 92 screens

## Next Gate

```text
GHV.IMPLEMENTATION.0B
FOUNDATION RUNTIME AND ACTIVATION VERTICAL SLICE
ELIGIBLE TO START · NOT STARTED
```

## Change authority

Architecture deviations require Controlled Architecture Change. Expanding Product Code Scope requires a later Implementation Gate. Enabling Preview/Production requires explicit authorization Gates.
