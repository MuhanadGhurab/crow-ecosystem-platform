# Mock Mode Guide

Operator-friendly quick guide for safe demo/mock workflows.

---

## What `USE_MOCK_DATA` does

When `USE_MOCK_DATA=true`, key surfaces can use mock datasets instead of live DB-backed tenant/request chains.  
This supports portfolio demos and local exploration without paid infra.

---

## Core mock files

- `src/lib/mock/env.ts`
- `src/lib/mock/pipeline.ts`
- `src/lib/mock/discovery.ts`
- `src/lib/mock/blueprint.ts`
- `src/lib/mock/meem-global.ts`

Deep design and audit details:
- `F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`

---

## MEEM mock vs live MEEM

- Mock mode can serve MEEM-like demo data for fast walkthroughs.
- Staging/live verification scripts still resolve real IDs from environment-specific data.
- Do not mix public demo claims with live tenant identifiers.

---

## Rimal and Najm expectations

- Rimal remains construction-scoped (no logistics leakage).
- Najm flow is validated via organic request checks (dry/staging-safe scripts).
- Mock mode should support demos without implying full production automation.

---

## Run integrity check

```powershell
Set-Location D:\CYBERCROW
npm run mock:verify
```

This catches:
- missing required mock/support files
- import resolution issues
- request -> discovery -> blueprint chain drift

---

## Avoid mock shape drift

- Keep mock objects aligned with Prisma include shapes used by pages/services.
- Prefer explicit `null` for missing relations.
- Avoid broad `any` casts.
- Re-run:

```powershell
npm run mock:verify
npm run typecheck
```

---

## What mock mode must not claim

- No live production behavior guarantees
- No live payments
- No certification/compliance claims from demo-only data
- No hidden external API dependencies
