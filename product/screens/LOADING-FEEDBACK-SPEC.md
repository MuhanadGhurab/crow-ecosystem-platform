# Loading and Feedback Spec

| Field | Value |
|-------|-------|
| **Status** | LOCKED AT LOW FIDELITY |
| **Version** | 1.1.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Related** | [INTERACTION-GRAMMAR.md](../interactions/INTERACTION-GRAMMAR.md) · [SAVE-SYNC-OFFLINE-INTERACTION.md](../interactions/SAVE-SYNC-OFFLINE-INTERACTION.md) |

## Principles

- Prefer skeleton or inline progress over blocking full-page spinners for Skyboard modules.
- Blocking loaders only for irreversible commits (payment, Evidence submit, terms accept).
- Feedback must distinguish network failure, authorization denial, and validation errors.
- Success feedback is brief; persistent state updates via Flight Log / Skyboard.
- **No screen may appear frozen after a valid user action** — show immediate response (optimistic UI, progress, or disabled+busy).

## Behavior matrix

| Situation | Pattern |
|-----------|---------|
| Immediate response | Button busy state within 100ms conceptual; keep context |
| Delayed response | Inline progress or skeleton in affected region |
| Skeleton | Skyboard modules, feeds, directories |
| Progress indicator | Uploads, long assessments, lab startup |
| Background processing | Banner or Log entry; do not block entire app |
| Long-running review | Evidence Status persistent; email optional later |
| Realtime reconnect | Live Sky connection chip + reconnect CTA |
| Payment processing | Blocking on PAY-002/003 only; result screen mandatory |
| Evidence upload | Per-file progress; cancel; malware-scan pending label |
| Laboratory startup | Explicit “starting environment” with timeout + retry |
| World Map loading | Progressive tiles/list fallback on mobile |
| Degraded AI / RAVEN | Hide advisory module; Continue Flight + Log remain |

## Change history

- 1.1.0 — PD.3 matrix + anti-freeze rule
- 1.0.0 — FOUNDATION.1A
