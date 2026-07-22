# Activation Accessibility

| Field           | Value                 |
| --------------- | --------------------- |
| **Document ID** | GHV-DOC-ACT-A11Y-001  |
| **Gate**        | GHV.IMPLEMENTATION.0C |

## Technical measures (implemented)

| Measure       | Application                                                           |
| ------------- | --------------------------------------------------------------------- |
| Skip link     | Bypass to main content                                                |
| Landmarks     | Header · main · footer structure                                      |
| Forms         | Explicit labels · checkbox associations · disabled submit until valid |
| Errors        | Error summary receives focus on validation failure                    |
| Status        | `role="status"` / polite announcements for loading and success        |
| Keyboard      | Full activation flow operable without pointer (e2e verified)          |
| RTL           | Arabic default layout; LTR islands for codes/tokens                   |
| Motion        | `prefers-reduced-motion` respected                                    |
| Zoom / reflow | Responsive shell; no loss of function at 200% zoom                    |

## Automated testing (dev-only)

| Tool                   | Threshold                                   |
| ---------------------- | ------------------------------------------- |
| `@axe-core/playwright` | Critical + Serious violations **must be 0** |
| `@playwright/test`     | Keyboard flow ACT-003 → ONB-001             |

Spec: `apps/web/e2e/activation-flow.spec.ts`. Packages are **devDependencies** only.

Screens scanned: ACT-003 · ACT-011 · ACT-005 · ACT-013 · ACT-012 · ACT-006 · ACT-007 · ONB-001 routes.

## Manual validation status

```text
Assistive-Technology User Validation: NOT RUN
Gate: NON-BLOCKING
Controlled Launch: BLOCKER until executed
```

Governance record: [IMPLEMENTATION-0C-ACCESSIBILITY-REVIEW.md](../../governance/implementation/IMPLEMENTATION-0C-ACCESSIBILITY-REVIEW.md).

## Related

- [ACTIVATION-UX.md](./ACTIVATION-UX.md)
- [ACTIVATION-UX-STATE-MATRIX.md](./ACTIVATION-UX-STATE-MATRIX.md)
