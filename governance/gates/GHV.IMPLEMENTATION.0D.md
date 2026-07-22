# GHV.IMPLEMENTATION.0D — Origin Setup and Adaptive Onboarding Vertical Slice

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.IMPLEMENTATION.0D |
| **Title** | Origin Setup and Adaptive Onboarding Vertical Slice |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Authorization** | GHV-IMP-AUTH-004 |
| **Starting HEAD** | `0416e8f23fee4dd8efaacaa6a6ab5b64295ae66b` |
| **Implementation HEAD** | `21e4553323f4d4f8c35c68b1f43a807e4f5ba82b` |
| **Remote CI** | Actions `29900763663` · verify job `88860748408` · **success** |

## Verdict

```text
PARTIAL — GHURAVIA PERSONALIZATION,
ORIGIN SETUP AND ADAPTIVE ONBOARDING SLICE COMPLETE
WITH NON-BLOCKING IMPLEMENTATION CONDITIONS
```

## Scope completed

Authorized screens implemented:

```text
ONB-001 · IDN-001 · IDN-002 · IDN-003 · ONB-002 · ONB-003 (HANDOFF ONLY)
```

Paths: guided (A) and quick-start (B). Later-edit compatibility preserved without Wingprint Home.

## Preflights

| Document | Verdict |
|----------|---------|
| IMPLEMENTATION-0D-SCREEN-JOURNEY-PREFLIGHT.md | PASS — PERSONALIZATION AND ORIGIN JOURNEY AUTHORITY RECONCILED |
| IMPLEMENTATION-0D-ORIGIN-FIELD-AUTHORITY-PREFLIGHT.md | PASS — MINIMAL ORIGIN FIELD CATALOGUE v0.1.0 AUTHORIZED |
| IMPLEMENTATION-0D-PERSONALIZATION-CATALOGUE-PREFLIGHT.md | PASS — FOUNDATION PERSONALIZATION CATALOGUE AUTHORIZED |
| GHV.IMPLEMENTATION.0D-AUTHORIZATION.md | PASS — LIMITED GHURAVIA PERSONALIZATION AND ORIGIN SLICE AUTHORIZED |

## Evidence pointers

* [IMPLEMENTATION-0D-ACCEPTANCE-MATRIX.md](../implementation/IMPLEMENTATION-0D-ACCEPTANCE-MATRIX.md)
* [IMPLEMENTATION-0D-BROWSER-EVIDENCE-MATRIX.md](../implementation/IMPLEMENTATION-0D-BROWSER-EVIDENCE-MATRIX.md)
* Migration `packages/data/drizzle/0002_onboarding_personalization_origin.sql`
* Domain `packages/domain/src/onboarding.ts`
* Data `packages/data/src/onboarding.ts`
* E2E `apps/web/e2e/onboarding-flow.spec.ts` — 18/18 PASS
* Activation regression `apps/web/e2e/activation-flow.spec.ts` — 25/25 PASS

## Non-blocking conditions retained

```text
ADV-001 (esbuild via drizzle-kit) — Moderate · ACCEPT TEMPORARILY WITH OWNER
ADV-002 (PostCSS via Next.js) — Moderate · ACCEPT TEMPORARILY WITH OWNER
Assistive-Technology user validation — NOT RUN (Controlled Launch blocker)
Native Arabic expert/user validation — NOT RUN (Controlled Launch blocker)
Legal review of terms/risk/Origin copy — OPEN
```

## Predecessor verdicts preserved

```text
GHV.IMPLEMENTATION.0C: PARTIAL (unchanged)
GHV.IMPLEMENTATION.0C-CLOSURE-01: PARTIAL — AMENDED BY 0C-CLOSURE-02 (unchanged)
GHV.IMPLEMENTATION.0C-CLOSURE-02: PASS (unchanged)
```

## Next Gate

```text
GHV.IMPLEMENTATION.0E
THE NEST INTRO AND READINESS DECISION VERTICAL SLICE
ELIGIBLE AFTER 0D remote CI success on final HEAD
NOT STARTED IN THIS GATE
```

## Explicit non-claims

```text
No Preview · no Staging · no Production · no deployment
No Nest assessment · no Horizon · no Route · no eligibility
No real providers · no AI · no Trust scoring · no Progression from Origin/personalization
```
