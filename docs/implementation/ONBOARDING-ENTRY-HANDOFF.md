# Onboarding Entry Handoff

| Field           | Value                                                                       |
| --------------- | --------------------------------------------------------------------------- |
| **Document ID** | GHV-DOC-ONB-ENTRY-001                                                       |
| **Gate**        | GHV.IMPLEMENTATION.0C                                                       |
| **Next Gate**   | GHV.IMPLEMENTATION.0D — Origin Setup and Adaptive Onboarding Vertical Slice |

## Governed handoff path

```text
ACT-006 (complete) → ACT-007 (optional mobile) → ONB-001 (entry handoff)
```

| Screen  | Route                         | 0C implementation                                                          |
| ------- | ----------------------------- | -------------------------------------------------------------------------- |
| ACT-007 | `/activation/mobile-optional` | Thin optional — verify later or skip; **no ACT-008 OTP** · **no real SMS** |
| ONB-001 | `/onboarding/entry`           | Handoff-only — activation confirmed, local notice, deferred CTA            |

## Prerequisites

| Screen  | Required state                                        |
| ------- | ----------------------------------------------------- |
| ACT-007 | `ACTIVATED` (formula complete)                        |
| ONB-001 | `ACTIVATED` · reached via ACT-007 continue/skip/later |

Skip on ACT-007 must **not** punish or block onboarding entry.

## Explicitly not in 0C

- IDN-001…003 personalization forms
- ONB-002 Set Your Origin persistence
- Nest / Horizon / route selection
- Any origin-profile database writes

Registry journey after ONB-001 (IDN → ONB-002…) is **documented only** until 0D.

## Authority

Preflight: [IMPLEMENTATION-0C-ONBOARDING-ENTRY-PREFLIGHT.md](../../governance/implementation/IMPLEMENTATION-0C-ONBOARDING-ENTRY-PREFLIGHT.md) — **PASS WITH CONDITIONS**.

Route guards: `canAccessScreen` in `apps/web/lib/activation-routes.ts`.

## Related

- [ACTIVATION-UX.md](./ACTIVATION-UX.md)
- [GHURAVIA-ACTIVATION-UX-BASELINE.md](../../governance/implementation/GHURAVIA-ACTIVATION-UX-BASELINE.md)
