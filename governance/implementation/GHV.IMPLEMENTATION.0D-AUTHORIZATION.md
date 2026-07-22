# GHV.IMPLEMENTATION.0D — Authorization

| Field | Value |
|-------|-------|
| **Authorization ID** | GHV-IMP-AUTH-004 |
| **Authorized Gate** | GHV.IMPLEMENTATION.0D |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `0416e8f23fee4dd8efaacaa6a6ab5b64295ae66b` |

## Authorization Scope

```text
Crow personalization, Origin setup and adaptive onboarding state
```

## Authorized Screens

```text
ONB-001
IDN-001
IDN-002
IDN-003
ONB-002
ONB-003 HANDOFF ONLY
```

## Policies

| Policy | Value |
|--------|-------|
| Data | Synthetic only |
| Database | Disposable local PostgreSQL only |
| Providers | Mocks only |
| Deployment | **None** |
| Preview / Staging / Production | BLOCKED / BLOCKED / NOT AUTHORIZED |

## Activation formula (unchanged — prerequisite only)

```text
activation_complete =
  email_verified
  AND current_terms_accepted
  AND account_risk_status = acceptable
```

Mobile: **OPTIONAL ASSURANCE** — not part of the formula. Personalization and Origin are **post-activation**.

## Authorized data catalogues

* Personalization catalogue v0.1.0 — [IMPLEMENTATION-0D-PERSONALIZATION-CATALOGUE-PREFLIGHT.md](./IMPLEMENTATION-0D-PERSONALIZATION-CATALOGUE-PREFLIGHT.md)
* Origin field catalogue v0.1.0 — [GHURAVIA-ORIGIN-FIELD-CATALOGUE-v0.1.0.md](./GHURAVIA-ORIGIN-FIELD-CATALOGUE-v0.1.0.md)

## Preflight inputs

* [IMPLEMENTATION-0D-SCREEN-JOURNEY-PREFLIGHT.md](./IMPLEMENTATION-0D-SCREEN-JOURNEY-PREFLIGHT.md) — **PASS — PERSONALIZATION AND ORIGIN JOURNEY AUTHORITY RECONCILED**
* [IMPLEMENTATION-0D-ORIGIN-FIELD-AUTHORITY-PREFLIGHT.md](./IMPLEMENTATION-0D-ORIGIN-FIELD-AUTHORITY-PREFLIGHT.md) — **PASS — MINIMAL ORIGIN FIELD CATALOGUE v0.1.0 AUTHORIZED**
* [IMPLEMENTATION-0D-PERSONALIZATION-CATALOGUE-PREFLIGHT.md](./IMPLEMENTATION-0D-PERSONALIZATION-CATALOGUE-PREFLIGHT.md) — **PASS — FOUNDATION PERSONALIZATION CATALOGUE AUTHORIZED**

## Prohibited Scope

* Nest assessment / Nest result / Nest learning path (ONB-004+)
* Horizon / Route / eligibility / Flight Plan
* Wingprint Home / Privacy Settings / Titles & Crests Product Code (IDN-004..006)
* Real auth / email / SMS / payments / Evidence / Trust / Prestige / AI models
* New screen IDs · alias activation · Product / Learning / Progression / Architecture baseline changes
* Preview · Staging · Production · deployment · secrets in repo · merge to `main` · tags · force-push
* Origin unrestricted free text or prohibited identity fields
* Personalization producing XP / Mastery / Rank / Prestige / Trust / readiness

## Pre-code verdict

```text
PASS — LIMITED GHURAVIA PERSONALIZATION
AND ORIGIN SLICE AUTHORIZED
```
