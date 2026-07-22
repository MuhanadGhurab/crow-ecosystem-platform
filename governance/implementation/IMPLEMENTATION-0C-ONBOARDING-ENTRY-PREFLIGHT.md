# Implementation 0C — Onboarding Entry Authority Preflight

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-ONB-ENTRY-001 |
| **Gate** | GHV.IMPLEMENTATION.0C |
| **Date** | 2026-07-22 |

## Authoritative sources reviewed

| Source | Finding |
|--------|---------|
| [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) | ACT-006 Continue → **ACT-007**; ACT-007 Verify/skip → **ONB-001**; ONB-001 Start → IDN-001 |
| [MASTER-USER-JOURNEY.md](../../product/journeys/MASTER-USER-JOURNEY.md) | ACT-006 → ACT-007 → Personalize → Set Your Origin… |
| [ACTIVATION-WIREFRAMES.md](../../product/wireframes/activation/ACTIVATION-WIREFRAMES.md) | Happy path … → ACT-006 → ACT-007 → ONB-001; Skip → ONB-001 |
| [ONBOARDING-WIREFRAMES.md](../../product/wireframes/onboarding/ONBOARDING-WIREFRAMES.md) | ACT-007 → ONB-001 → IDN → ONB-002 Set Origin |
| [CAPABILITY-REGISTRY.md](../../product/CAPABILITY-REGISTRY.md) | CAP-ONB-005 optional mobile; onboarding caps map to ONB/IDN |
| [SCOPE-BASELINE.md](../../governance/scope/SCOPE-BASELINE.md) | Optional mobile; activation formula unchanged |
| Product Constitution | No contradiction found for this handoff |

## Exact governed destinations

| Role | Screen ID | Name | Shell | Status |
|------|-----------|------|-------|--------|
| Post-activation (optional assurance) | **ACT-007** | Mobile Verify Now/Later | Activation | ACTIVE |
| Onboarding entry | **ONB-001** | Personalize Entry | Onboarding | ACTIVE |
| Set Your Origin (deferred) | ONB-002 | Set Origin | Onboarding | ACTIVE — **not in 0C Product Scope** |

## Routes (0C Product Code convention)

Following the 0B `/activation/...` pattern (screen IDs unchanged; paths are implementation mapping only):

| Screen | Route |
|--------|-------|
| ACT-007 | `/activation/mobile-optional` |
| ONB-001 | `/onboarding/entry` |

## Prerequisites

| Target | Required activation state |
|--------|---------------------------|
| ACT-007 | `ACTIVATED` (formula complete) |
| ONB-001 | `ACTIVATED` + reached via ACT-007 skip/later (or explicit continue) |

Mobile verification remains **OPTIONAL ASSURANCE** — not part of the activation formula. Skip must not punish or block learning/onboarding entry.

## Set Your Origin timing

* Does **not** begin immediately after ACT-006.
* ACT-007 intervenes (optional).
* ONB-001 precedes IDN personalization; **ONB-002** is Set Your Origin.
* No origin-profile persistence in 0C.
* No Horizon / Nest assessment in 0C.

## 0C boundary

**Inside 0C:**

* Harden ACT-003…ACT-006.
* Implement thin **ACT-007** (optional offer; skip → ONB-001; no ACT-008 OTP / no real SMS).
* Implement **ONB-001** as **handoff-only** (activation confirmed, local-only notice, CTA into future onboarding Gate — no IDN forms).

**Deferred to GHV.IMPLEMENTATION.0D:**

* IDN-001…003 Crow personalization forms
* ONB-002 Set Origin persistence
* Nest / Horizon / Route selection
* Complete onboarding

## Conflicts

```text
None — registry, journey, and wireframes agree:
ACT-006 → ACT-007 → ONB-001 → (deferred) IDN / ONB-002…
```

## Verdict

```text
PASS WITH CONDITIONS — HANDOFF TARGET IDENTIFIED,
FULL ONBOARDING IMPLEMENTATION DEFERRED

Exact onboarding entry: ONB-001 (/onboarding/entry)
Bridge screen: ACT-007 (/activation/mobile-optional)
Deferred: ONB-002+ and IDN Product Code → GHV.IMPLEMENTATION.0D
```
