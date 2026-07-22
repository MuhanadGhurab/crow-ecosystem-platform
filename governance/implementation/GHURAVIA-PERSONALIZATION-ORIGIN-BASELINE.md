# GHURAVIA Personalization, Origin and Adaptive Onboarding State Baseline

| Field | Value |
|-------|-------|
| **Baseline** | GHURAVIA Personalization, Origin and Adaptive Onboarding State Baseline **v0.4.0** |
| **Status** | **ACTIVE WITH CONDITIONS — PERSONALIZATION AND ORIGIN VERTICAL SLICE COMPLETE WITH NON-BLOCKING CONDITIONS** |
| **Source Gates** | GHV.IMPLEMENTATION.0D · GHV.IMPLEMENTATION.0D-CLOSURE-01 |
| **Authorization** | GHV-IMP-AUTH-004 |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |

## Gate references

| Item | Value |
|------|-------|
| Starting HEAD (pre-0D) | `0416e8f23fee4dd8efaacaa6a6ab5b64295ae66b` |
| Implementation HEAD | `21e4553323f4d4f8c35c68b1f43a807e4f5ba82b` |
| Pre-Closure final docs HEAD | `3515dde656bf4ca979e2c5b4ecd3df51a4feb433` |
| Closure HEAD | *(recorded in GHV.IMPLEMENTATION.0D-CLOSURE-01.md after push)* |

## Authorized screens (six)

```text
ONB-001 — Personalize Entry
IDN-001 — Crow Personalize (+ Review)
IDN-002 — Habitat Select
IDN-003 — Character Select
ONB-002 — Set Origin
ONB-003 — Nest Intro (HANDOFF ONLY)
```

## Paths

### Guided

```text
ONB-001 → IDN-001 Crow → IDN-002 Habitat → IDN-003 Character → IDN-001 Review → ONB-002 → ONB-003
```

### Quick-start

```text
ONB-001 → BEGIN_QUICK_START defaults → IDN-001 Review → ONB-002 → ONB-003
```

## Catalogues

| Catalogue | Version | Status |
|-----------|---------|--------|
| Foundation personalization | `0.1.0` | Authorized foundation options · **not** final artwork · **not** Production-ready |
| Origin field catalogue | `v0.1.0` | Minimal optional categories only |

Origin categories (only):

```text
Broad Region Context
Experience / Background Context
Initial Goals Context
Review-Later Preference
```

## Persistence model

- Aggregate table: `onboarding_aggregates` (FK to `activation_aggregates`)
- Migration: `packages/data/drizzle/0002_onboarding_personalization_origin.sql`
- Reuses: command receipts · audit events · outbox events · idempotency · optimistic concurrency · database guards
- Command / query services: `OnboardingCommandService` (`packages/data`) · domain `packages/domain/src/onboarding.ts`

## Idempotency and concurrency

- Idempotency-Key required on every command
- Replay returns original safe result without duplicate audit/outbox/receipts
- Optimistic `expectedVersion` conflicts return CONFLICT (409)
- Catalogue-version and Origin-schema conflicts are distinct categories

## Route guards and resume

Server-authoritative guards (`requireOnboardingScreenAccess`):

```text
ONB-001: Activated account required
IDN-001: Guided or quick-start begun
IDN-002: Valid Crow basics or quick-start defaults
IDN-003: Valid habitat or quick-start defaults
ONB-002: Minimum personalization complete
ONB-003: Origin COMPLETE or governed REVIEW_LATER
```

Client redirects are convenience only. Resume uses `resolveResumeScreen` / accessible screens from server state.

## Privacy classification (summary)

| Data class | Classification |
|------------|----------------|
| Wingprint setup during onboarding | PRIVATE DURING ONBOARDING |
| Origin responses | PRIVATE ONBOARDING CONTEXT |
| Public Origin | PROHIBITED |
| Origin in Trust / Progression / entitlement / general telemetry | PROHIBITED |

Audit and outbox carry **metadata only** (action, field category, catalogue version, prior/resulting status, actor, authority, reason, correlation id). See IMPLEMENTATION-0D-DATA-CLASSIFICATION.md.

## Browser and accessibility evidence

| Metric | Count |
|--------|------:|
| Mandatory scenarios | **22 / 22** |
| Accessibility states | **12 / 12** |
| Activation regression | **25 / 25** |

## Dependency conditions

```text
Critical: 0
High runtime-reachable: 0
Blocking: 0
Moderate retained: ADV-001 · ADV-002
sharp: 0.35.3
```

## Restrictions

```text
Providers: MOCKS ONLY
Database: Disposable local PostgreSQL only (CI: ephemeral service container)
Preview / Staging: BLOCKED
Production: NOT AUTHORIZED
Deployment: PROHIBITED
AI models: NOT CALLED
```

## Known limitations (non-blocking)

- Assistive-technology user validation NOT RUN
- Native-Arabic expert/user validation NOT RUN
- Legal/privacy copy review OPEN
- Foundation catalogue is provisional (not final artwork)
- Preview / Controlled Launch remain blocked

## Next Gate

```text
GHV.IMPLEMENTATION.0E
THE NEST INTRO AND READINESS DECISION VERTICAL SLICE
ELIGIBLE TO START · NOT STARTED
```

## Explicit non-claims

```text
Personalization ≠ Skill · Origin ≠ Trust · Origin ≠ Readiness
Origin ≠ Learning decision · Origin ≠ Horizon recommendation
No Nest assessment · No Wingprint Home · No Progression · No Trust scoring
Catalogue is NOT final artwork · NOT Production-ready
```
