# CROW.DEVFLOW.3 — Controlled Alpha Demo Backend Mode Plan

| Field | Value |
|-------|-------|
| **Status** | **Complete** — plan only (backend mode **not** enabled) |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `7bf54bc` (CROW.DEVFLOW.PORTABLE.1 tip) |
| **Owner decision** | Plan controlled Alpha Demo Backend Mode; do not implement yet |
| **Prior** | CROW.DEVFLOW.1 · DEVFLOW.2 · DEVFLOW.PORTABLE.1 |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) · Issue [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **main** | `f97a835` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · archive only |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Purpose

Design how Crow may later allow selected **demo-only** hosted actions on the shared Supabase demo/dev sandbox during Alpha Development — without commercial Production claims, real customer data, payment, tenant go-live, or official Blueprint generation.

## Delivered (docs only)

| Doc | Role |
|-----|------|
| [`../development/CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md`](../development/CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md) | Mode definition, flags, activation, allow/forbid, marking, UI |
| [`../development/ALPHA-DEMO-BACKEND-GUARD-PLAN.md`](../development/ALPHA-DEMO-BACKEND-GUARD-PLAN.md) | Guard adjustment, tests, phases, DEVFLOW.4 recommendation |

## Explicit non-goals (this milestone)

- Implement backend mode / loosen runtime guards
- Enable hosted persistence / domain writes
- Migrations / hosted business writes
- Production deploy / `main` / PR #10
- Blueprint / `completeDiscovery` / payment / tenant / CroAI
- Vercel / GitHub protection changes
- Committing secrets

## Key decisions recorded

1. Activation requires **all** of: `alpha_development` · `demo_only` · `ALLOW_SHARED_DEMO_BACKEND=true` · real-customer flag not true · payment/Blueprint/tenant-go-live disabled.
2. Missing any condition → **fail closed**.
3. Allowlist is limited (demo request / Discovery draft / notes / feedback / inert review package).
4. Demo markers required on future records (prefer migration-free JSON first).
5. GAP-004 remains future commercial gate; GAP-004A default fail-closed remains until implementation + owner enablement.
6. First implementation slice: **CROW.DEVFLOW.4** (gate + demo-write guard only — no domain persistence yet).

## Outcome counters

```
CONTROLLED_ALPHA_DEMO_BACKEND_PLAN_COUNT=1
ALPHA_DEMO_BACKEND_ENABLED_COUNT=0
HOSTED_BUSINESS_WRITE_COUNT=0
UNAUTHORIZED_MIGRATION_COUNT=0
REAL_CUSTOMER_DATA_ALLOWED_COUNT=0
COMMERCIAL_PRODUCTION_CLAIM_COUNT=0
PRODUCTION_DEPLOYMENT_COUNT=0
MAIN_PUSH_COUNT=0
PR10_MERGED_COUNT=0
BLUEPRINT_GENERATION_ALLOWED_COUNT=0
PAYMENT_ENABLED_COUNT=0
CROAI_PRODUCTION_ACTION_ENABLED_COUNT=0
SECRET_COMMITTED_COUNT=0
```

## Recommended next milestone

**CROW.DEVFLOW.4** — implement alpha demo backend runtime gate and demo-write guard (no domain persistence wiring yet).

## Final verdict

**READY — CONTROLLED ALPHA DEMO BACKEND MODE PLAN PREPARED**
