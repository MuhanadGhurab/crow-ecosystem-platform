# Motion and Accessibility Spec

| Field | Value |
|-------|-------|
| **Status** | LOCKED AT LOW FIDELITY |
| **Version** | 1.1.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Related** | [WIREFRAME-REVIEW-CHECKLIST.md](../wireframes/WIREFRAME-REVIEW-CHECKLIST.md) |

## Principles

- Motion supports hierarchy and presence; never required for understanding.
- Respect reduced-motion preferences.
- Accessibility is in first controlled launch scope (WCAG-oriented practice; certification not claimed).
- Focus order, labels, and contrast are mandatory for activation and learning flows.

## Wireframe-level requirements (PD.3)

| Requirement | Rule |
|-------------|------|
| Keyboard path | Every primary action reachable without pointer |
| Focus order | Matches reading order; traps only in modals with escape |
| Text labels | Icons alone insufficient |
| Contrast | Note required; final tokens later |
| Non-color state | Locks/errors use text + icon, not color alone |
| Screen reader | Identify headings, landmarks, live regions for sync/Live |
| Live updates | Accessible announcement strategy for status changes |
| Errors | Identify affected field (forms) |

## Change history

- 1.1.0 — PD.3 wireframe a11y checklist hooks
- 1.0.0 — FOUNDATION.1A
