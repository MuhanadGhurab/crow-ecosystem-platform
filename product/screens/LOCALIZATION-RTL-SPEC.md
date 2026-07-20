# Localization and RTL Spec

| Field | Value |
|-------|-------|
| **Status** | LOCKED AT LOW FIDELITY |
| **Version** | 1.1.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Related** | [FORM-INTERACTION-RULES.md](../interactions/FORM-INTERACTION-RULES.md) |

## Languages in first controlled launch

- Arabic — RTL
- English — LTR

## Rules

- Arabic-first, international-ready.
- Layout mirrors for RTL; icons and chevrons flip where directional.
- Numbers, currency (SAR), and dates follow locale rules pending final formatting Gate.
- Regional policy packs may alter legal copy without forking Product Code prematurely.
- **Mixed technical text:** code, IP addresses, commands, and file paths remain LTR islands inside RTL layouts.
- Form labels follow UI direction; user-entered mixed content may use bidirectional isolation.
- Wireframes must validate both Arabic RTL and English LTR compositions (PD.3 checklist).

## Change history

- 1.1.0 — PD.3 technical LTR islands
- 1.0.0 — FOUNDATION.1A
