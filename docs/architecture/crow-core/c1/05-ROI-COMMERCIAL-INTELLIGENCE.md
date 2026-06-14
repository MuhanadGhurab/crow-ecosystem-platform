# 05 — ROI Commercial Intelligence

**Package:** `src/lib/crow-core/commercial-intelligence/`

Pure TypeScript — no Prisma, no UI imports.

## Modules

| File | Role |
|------|------|
| `roi-scenarios.ts` | CONSERVATIVE / BASE / OPTIMISTIC presets |
| `roi-calculator.ts` | Deterministic formulas per scenario |
| `roi-validation.ts` | Missing assumptions, units, currency guards |
| `advisory-labels.ts` | Shared advisory disclaimer constant |

## Outputs

`RoiResult` includes:

- `calculations[]` with formula inputs and assumption IDs
- `confidence` level
- `advisoryFooter` on every output (mandatory)

## Validation rules

- Unapproved or missing assumptions → blocking issues in `RoiValidationResult`
- No invented client-validated numbers in calculator

## Studio integration

ROI tab renders scenarios from document + `RoiModel`; warnings surface when validation fails.
