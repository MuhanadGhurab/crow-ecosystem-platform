# Activation Localization

| Field           | Value                 |
| --------------- | --------------------- |
| **Document ID** | GHV-DOC-ACT-L10N-001  |
| **Gate**        | GHV.IMPLEMENTATION.0C |
| **Keys**        | **88**                |

## Locales

| Locale | Role                               |
| ------ | ---------------------------------- |
| `ar`   | **Default** — document `dir="rtl"` |
| `en`   | Parity via header language switch  |

## Catalogue layout

| File                                    | Purpose                     |
| --------------------------------------- | --------------------------- |
| `apps/web/lib/localization/messages.ts` | `MESSAGE_KEYS` (88) · types |
| `apps/web/lib/localization/ar.ts`       | Arabic strings              |
| `apps/web/lib/localization/en.ts`       | English strings             |
| `apps/web/lib/localization/format.ts`   | Locale-aware formatting     |
| `apps/web/lib/locale-context.tsx`       | Client locale provider      |

## Rules

- Every key in `MESSAGE_KEYS` must exist in both `ar` and `en`.
- UI copy comes from the catalogue only — no hard-coded user-facing strings in activation/onboarding-entry screens.
- API errors map by `ErrorCategory` to catalogue keys (`errValidation`, `errConflict`, …) — never surface raw `Error.message`.
- Verification tokens and correlation IDs use LTR islands inside RTL shell where needed.

## Validation

- Unit tests: `apps/web/test/localization.test.ts`
- CI: localization parity checks as part of `npm run ci`

## Screens covered

```text
ACT-003 · ACT-011 · ACT-005 · ACT-013 · ACT-012 · ACT-006 · ACT-007 · ONB-001
```

Expert and user Arabic validation remain **NOT RUN** — see [IMPLEMENTATION-0C-ARABIC-UX-REVIEW.md](../../governance/implementation/IMPLEMENTATION-0C-ARABIC-UX-REVIEW.md).
