# Navigation Interaction Specification

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IX-NAV-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [NAVIGATION-MAP.md](../journeys/NAVIGATION-MAP.md) · [PAGE-COMPOSITION-SYSTEM.md](./PAGE-COMPOSITION-SYSTEM.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Deep-link URL scheme finalization — ARCHITECTURE.1 |
| **Change history** | 1.0.0 — PD.3 |

## Authoritative primary destinations

No new top-level item may be added in this Gate:

```text
Flight · World · Live · Rookery · Log · Wingprint
```

| Destination | Primary screens | Notes |
|-------------|-----------------|-------|
| Flight | SKY-001, LRN-* | Adaptive Skyboard home |
| World | WLD-001..003 | Map + Horizon + Graph |
| Live | LIV-001..006 | Directory-first |
| Rookery | COM-001..008 | No DMs |
| Log | Flight Log module / Evidence history (SKY-001 Log + LRN-005) | Nav target; not a separate registry family |
| Wingprint | IDN-004..006, PRG-*, TRU account exits | Identity + progression |

## Public navigation

Landing header: brand · language · Sign In (ACT-010) · Create Crow (ACT-001/002). Secondary: Story, Horizons, Safety, Plans, Legal.

## Authenticated navigation

- **Desktop:** rail with six destinations; context header shows Horizon/Route/Mission crumb when in learning.
- **Mobile:** bottom navigation with same six; overflow for Account/Plans.
- **Breadcrumbs:** World → Horizon → Route → Stage → Mission; omit when noise exceeds value (Mission Focus hides deep crumbs).

## Deep linking

Supported conceptually for: public landing sections; Route overview; Event detail; Evidence status; plan comparison. Unauthorized deep links redirect with Explainable Lock or Sign In.

## Browser back

Returns to previous meaningful context. Leaving Mission Focus with unsaved draft triggers preserve + status (Save/Sync spec). Payment return uses FLOW-013 return-to-origin.

## Interrupted flows

| Case | Behavior |
|------|----------|
| Onboarding interrupted | Resume last incomplete ACT/ONB/IDN |
| Mission interrupted | Resume exact Mission position via Continue Flight |
| Post-payment | Return to original Route/lock context |
| Expired event | Event Detail shows ended + Result/Replay if allowed |
| Permission redirect | Explainable Lock sheet; no silent empty page |
| Restricted account | Persistent banner + limited destinations |
| Terms outdated | TRU-002 before Skyboard |

## Admin

Separate shell; not in learner bottom/rail nav.
