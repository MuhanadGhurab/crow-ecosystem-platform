# CROW.DEVFLOW.4 — Alpha Demo Backend Runtime Gate and Demo-Write Guard

| Field | Value |
|-------|-------|
| **Status** | **Complete** — gate + write guard implemented; domain persistence **not** wired; mode **not** app-enabled |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `73213b0` (CROW.DEVFLOW.3 tip) |
| **Final HEAD** | `5aab93c` |
| **Owner decision** | Implement only runtime gate + reusable demo-write guard; do not wire domain persistence |
| **Prior** | CROW.DEVFLOW.3 (plan) |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) · Issue [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **main** | `f97a835` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · archive only |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Purpose

Create a safe reusable guard layer so future DEVFLOW slices can call it **before** allowing demo-only hosted actions — without enabling Request/Discovery/ProCrow/feedback persistence yet.

## Delivered

| Artifact | Role |
|----------|------|
| `src/lib/runtime/alpha-demo-backend-mode.ts` | Runtime gate (`evaluateAlphaDemoBackendMode`, status helpers) |
| `src/lib/runtime/alpha-demo-write-guard.ts` | Allowlist + `evaluateAlphaDemoWriteGuard` / `assertAlphaDemoWriteAllowed` |
| `src/lib/runtime/alpha-demo-backend-guard.test.ts` | 22 fail-closed certification cases |
| `npm run alpha-demo-backend-guard:test` | Test script |
| Docs updates | Mode / guard plan / CURRENT-STATE / GAP-LEDGER / START-HERE / roadmap |

## Activation (still opt-in)

Enabled only when **all** hold and no blockers:

1. `CROW_RUNTIME_MODE=alpha_development`
2. `CROW_DATA_CLASSIFICATION=demo_only`
3. `ALLOW_SHARED_DEMO_BACKEND=true`

Blocked by: real-customer flag, commercial production mode, production-sensitive / real_customer classification, payment enabled, Blueprint Complete flag, tenant go-live flags. Missing any required condition → **fail closed**. Default (no `ALLOW_SHARED_DEMO_BACKEND`) → **disabled**.

## Explicit non-goals (this milestone)

- Request / Discovery / ProCrow / feedback persistence wiring
- Prisma write calls / hosted business writes
- Migrations / schema changes
- Loosening Preview DB-disabled globally
- Enabling demo backend in app paths
- Production / `main` / PR #10 / Blueprint / payment / tenant / CroAI
- Vercel / GitHub protection / secrets

## Outcome counters

```
FAILED_REQUIRED_GATE_COUNT=0
SKIPPED_REQUIRED_GATE_COUNT=0
LINT_WARNING_COUNT=0
LOCAL_PRODUCTION_BUILD=PASS
ALPHA_DEMO_BACKEND_RUNTIME_GATE_IMPLEMENTED_COUNT=1
DEMO_WRITE_GUARD_IMPLEMENTED_COUNT=1
ALPHA_DEMO_BACKEND_DOMAIN_PERSISTENCE_WIRED_COUNT=0
ALPHA_DEMO_BACKEND_ENABLED_IN_APP_COUNT=0
HOSTED_BUSINESS_WRITE_COUNT=0
UNAUTHORIZED_MIGRATION_COUNT=0
REAL_CUSTOMER_DATA_ALLOWED_COUNT=0
COMMERCIAL_PRODUCTION_CLAIM_COUNT=0
PRODUCTION_DEPLOYMENT_COUNT=0
PRODUCTION_DOMAIN_CHANGED_COUNT=0
INSTANT_PROMOTE_COUNT=0
PRODUCTION_ENV_CHANGED_COUNT=0
MAIN_PUSH_COUNT=0
PR10_MERGED_COUNT=0
BLUEPRINT_GENERATION_ALLOWED_COUNT=0
PAYMENT_ENABLED_COUNT=0
CROAI_PRODUCTION_ACTION_ENABLED_COUNT=0
SECRET_COMMITTED_COUNT=0
PRISMA_WRITE_CALL_ADDED_COUNT=0
DATABASE_CONNECTION_ATTEMPTED_BY_GUARD_TEST_COUNT=0
```

## Recommended next milestone

**CROW.DEVFLOW.5** (or named persistence slice) — wire limited allowlisted demo persistence behind the guard (owner-gated; still no Blueprint/payment/tenant).

## Final verdict

**READY — ALPHA DEMO BACKEND RUNTIME GATE AND DEMO-WRITE GUARD IMPLEMENTED**
