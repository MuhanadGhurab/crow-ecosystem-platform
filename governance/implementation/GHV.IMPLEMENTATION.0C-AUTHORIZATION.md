# GHV.IMPLEMENTATION.0C — Authorization

| Field | Value |
|-------|-------|
| **Authorization ID** | GHV-IMP-AUTH-003 |
| **Authorized Gate** | GHV.IMPLEMENTATION.0C |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `2f66902f741f5b24c350460c9de13af0b113a9c2` |

## Authorization Scope

```text
Activation UX, accessibility and onboarding-entry handoff hardening
```

## Authorized existing screens

```text
ACT-003 · ACT-011 · ACT-005 · ACT-013 · ACT-012 · ACT-006
```

## Authorized handoff screens (exact inventory IDs)

```text
ACT-007 — thin optional mobile now/later (no ACT-008 OTP; no real SMS)
ONB-001 — onboarding-entry handoff only (no IDN/ONB-002 forms)
```

## Policies

| Policy | Value |
|--------|-------|
| Data | Synthetic only |
| Database | Disposable local PostgreSQL only |
| Providers | Mocks only |
| Deployment | **None** |
| Preview / Staging / Production | BLOCKED / BLOCKED / NOT AUTHORIZED |

## Activation formula (unchanged)

```text
activation_complete =
  email_verified
  AND current_terms_accepted
  AND account_risk_status = acceptable
```

Mobile: **OPTIONAL ASSURANCE** — not part of the formula.

## Prohibited Scope

* Complete onboarding · origin persistence · Horizon · Nest assessment
* Real auth / email / SMS / payments / Evidence / Trust / Prestige
* New screen IDs · alias activation · Product / Learning / Progression / Architecture changes
* Preview · Production · deployment · secrets in repo · merge to `main`

## Preflight inputs

* [IMPLEMENTATION-0C-BASELINE-PREFLIGHT.md](./IMPLEMENTATION-0C-BASELINE-PREFLIGHT.md) — **PASS**
* [IMPLEMENTATION-0C-ONBOARDING-ENTRY-PREFLIGHT.md](./IMPLEMENTATION-0C-ONBOARDING-ENTRY-PREFLIGHT.md) — **PASS WITH CONDITIONS**

## Pre-code verdict

```text
PASS — LIMITED GHURAVIA ACTIVATION UX HARDENING AUTHORIZED
```
