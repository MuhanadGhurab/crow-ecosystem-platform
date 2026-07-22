# Implementation 0C Arabic UX Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0C-AR-UX-001 |
| **Gate** | GHV.IMPLEMENTATION.0C |
| **Date** | 2026-07-22 |
| **Authorization** | GHV-IMP-AUTH-003 |
| **Branch** | `feat/ghuravia-foundation` |
| **Default locale** | Arabic (`ar`) |
| **Parity locale** | English (`en`) |
| **Catalogue size** | **88** keys (`apps/web/lib/localization/messages.ts`) |

## Review layers

| Layer | Method | Result |
|-------|--------|--------|
| Default Arabic shell | `dir="rtl"` · Arabic-first copy · progress labels | **PASS** (implementer) |
| English parity | Header switch · full catalogue mirror · unit tests | **PASS** |
| Technical RTL layout | Logical properties · LTR islands for tokens/codes · form alignment | **PARTIAL / COMPLETE** (implementer) |
| Localization validation | Key parity · format helpers · ErrorCategory mapping only | **PASS** |
| Native-Arabic expert review | Linguistic / cultural / legal copy review | **NOT RUN** |
| Arabic user validation | Task completion with Arabic-first users | **NOT RUN** |

## Screens reviewed (technical)

```text
ACT-003 · ACT-011 · ACT-005 · ACT-013 · ACT-012 · ACT-006 · ACT-007 · ONB-001
```

## NOT RUN — disposition

| Review | Gate effect | Controlled Launch effect |
|--------|-------------|-------------------------|
| Native-Arabic Expert Review | **NON-BLOCKING** | **BLOCKER** |
| Arabic User Validation | **NON-BLOCKING** | **BLOCKER** |

Technical RTL: implementer performed layout and copy-structure checks; does **not** substitute expert or user validation.

## Predecessor retention

| Predecessor | Verdict | Retained |
|-------------|---------|----------|
| GHV.IMPLEMENTATION.0B ACT RTL routes | **PASS** | Yes |
| GHV.IMPLEMENTATION.0C authorization | **PASS — LIMITED GHURAVIA ACTIVATION UX HARDENING AUTHORIZED** | Yes |

## Verdict

```text
PASS WITH CONDITIONS — ARABIC DEFAULT AND EN PARITY COMPLETE (88 KEYS);
NATIVE-ARABIC EXPERT AND ARABIC USER VALIDATION NOT RUN (NON-BLOCKING FOR 0C, BLOCKING FOR CONTROLLED LAUNCH);
TECHNICAL RTL: PARTIAL / COMPLETE AS PERFORMED BY IMPLEMENTER
```

Operator notes: [docs/implementation/ACTIVATION-LOCALIZATION.md](../../docs/implementation/ACTIVATION-LOCALIZATION.md)
