# Alpha Demo Backend Guard Plan

| Field | Value |
|-------|-------|
| **Title** | Guard adjustment + test + phase plan for Alpha Demo Backend |
| **Status** | CANONICAL — Phase A/B **implemented** (CROW.DEVFLOW.4); Phase C+ not started |
| **Authority** | Owner decision — CROW.DEVFLOW.3 (plan) · CROW.DEVFLOW.4 (gate/guard) |
| **Date** | 2026-07-18 |
| **Mode definition** | [`CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md`](CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md) |
| **Milestone** | [`../milestones/CROW-DEVFLOW-4.md`](../milestones/CROW-DEVFLOW-4.md) |
| **Current guards** | `preview-db-safety.ts` · `crow-runtime-mode.ts` · `alpha-demo-backend-mode.ts` · `alpha-demo-write-guard.ts` |

## Current behavior

| Guard | Behavior |
|-------|----------|
| GAP-004A Preview DB-disabled | Vercel Preview + isolation unproven → **fail closed** (no DB read/write) — **unchanged** by DEVFLOW.4 |
| Runtime mode helpers | Default `alpha_development` + `demo_only`; `realCustomerDataAllowed=false` |
| Alpha demo backend gate | **Implemented** — disabled unless `ALLOW_SHARED_DEMO_BACKEND=true` + alpha + demo_only + no blockers |
| Demo write guard | **Implemented** — allowlist + markers; no domain wiring |
| Alpha banner | Visible classification notice |
| Blueprint Complete | Quarantined / off |
| Production deploy | GAP-015 guard + owner phrase |

## Implemented helpers (DEVFLOW.4)

| Helper | Behavior |
|--------|----------|
| `isAlphaDemoBackendModeEnabled()` | True only when activation rule is fully satisfied |
| `evaluateAlphaDemoBackendMode()` | Fail-closed decision + reasons |
| `getAlphaDemoBackendModeStatus()` | Redacted status (no secrets) |
| `evaluateAlphaDemoWriteGuard(action, markers, context?)` | Allowlist + markers + mode |
| `assertAlphaDemoWriteAllowed(...)` | Throws `AlphaDemoWriteBlockedError` unless allowed |

Script: `npm run alpha-demo-backend-guard:test` (22 cases).

### Interaction with `preview-db-safety`

| Case | Behavior |
|------|----------|
| Preview + isolation unproven + demo flags **unset** | Keep DB-disabled fail-closed |
| Preview + isolation unproven + demo flags **set** | Gate/guard may evaluate `allowed`; **Prisma/DB still blocked** until a future persistence slice + owner authorization |
| `VERCEL_ENV=production` | Never treat as demo bypass for Production deploy |
| Local | Same gate/guard; prefer local Postgres for any future writes |

## Test coverage (implemented)

| # | Case | Expected |
|---|------|----------|
| 1 | Disabled by default | `isAlphaDemoBackendModeEnabled() === false` |
| 2 | All required flags | Enabled |
| 3–9 | Missing shared flag / real customer / commercial / production-sensitive / payment / Blueprint / tenant | Blocked |
| 10–19 | Markers + allowlist + forbidden actions | Pass/block as specified |
| 20–22 | No secrets / no DB / no Prisma import | Pass |

Existing `preview-db-safety` + `crow-runtime-mode` tests must still PASS.

## Implementation phases

| Phase | Work | Status |
|-------|------|--------|
| **A** | Runtime gate | **Done** — DEVFLOW.4 |
| **B** | Demo write guard | **Done** — DEVFLOW.4 |
| **C** | Limited demo request/Discovery persistence (migration-free JSON markers preferred) | **Not started** — needs owner gate |
| **D** | UI warnings on demo write surfaces | With or after C |
| **E** | Tests / certification | Gate/guard certified; persistence TBD |
| **F** | Owner acceptance of enabled demo backend | Explicit phrase still required |

## Recommended next slice

Wire limited allowlisted demo persistence **behind** the guard (still no Blueprint/payment/tenant; still respect Preview DB-disabled until explicitly authorized).

## Non-claims

- DEVFLOW.4 does **not** enable hosted domain persistence
- DEVFLOW.4 does **not** prove GAP-004 isolation
- DEVFLOW.4 does **not** authorize Production deploy or `main` merge
- DEVFLOW.4 does **not** authorize official Blueprint generation
