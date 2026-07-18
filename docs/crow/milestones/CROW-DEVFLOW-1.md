# CROW.DEVFLOW.1 — Alpha Development Mode and Fast Review Workflow

| Field | Value |
|-------|-------|
| **Status** | **Complete** — strategy / policy / plan only |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `208983e` (LOCAL-FIRST.ACCEPT.1 tip) |
| **Final HEAD** | `d6fa695` |
| **Owner decision** | Crow Alpha Development Mode — fast review; GAP-004 = future commercial gate |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) · Issue [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **main** | `f97a835` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · archive only |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Purpose

Define how Crow moves fast during development without pretending it is commercial production-ready.

## Source documents

- [`../development/CROW-ALPHA-DEVELOPMENT-MODE.md`](../development/CROW-ALPHA-DEVELOPMENT-MODE.md)
- [`../development/FAST-REVIEW-WORKFLOW.md`](../development/FAST-REVIEW-WORKFLOW.md)
- [`../development/DEMO-DATA-POLICY.md`](../development/DEMO-DATA-POLICY.md)
- [`../gaps/GAP-004-DB-ISOLATION-PLAN.md`](../gaps/GAP-004-DB-ISOLATION-PLAN.md)
- [`../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md)

## In scope

- Runtime classification (production-grade · alpha · demo sandbox · local-first · commercial production)
- Demo data policy
- Environment strategy for Alpha Mode
- GAP-004 reclassification as future commercialization gate
- GAP-004A adjustment **plan** (controlled alpha demo backend — implement later)
- Fast review workflow
- Safety boundaries
- Recommended next milestones (DEVFLOW.2+ / Discovery tracks / demo seed / review checklist)

## Out of scope (this milestone)

- Product feature implementation
- Alpha banner UI code (→ DEVFLOW.2)
- Enabling shared demo backend writes (→ DEVFLOW.3)
- Migrations / hosted business writes
- Production deploy / `main` push / PR #10 merge
- Blueprint generation / payment / tenant go-live / CroAI
- Vercel or GitHub protection settings changes

## Decisions recorded

1. Crow is currently **alpha development + demo sandbox**, not commercial production.
2. Existing Supabase may be treated as **demo/dev sandbox** conceptually; production-grade isolation remains future work.
3. Vercel Preview / live review URLs are the **fast review channel**.
4. GAP-004 **does not block** alpha/demo development under demo-data rules; it **does block** commercial production, real customer data, hosted production persistence claims, and official tenant go-live.
5. GAP-004A fail-closed Preview DB guard remains until controlled Alpha Demo Backend Mode is owner-authorized and implemented.
6. GAP-015 Production deploy guard and `main` protection remain useful.

## Recommended next milestones

| ID | Intent |
|----|--------|
| **A. CROW.DEVFLOW.2** | Alpha banner + runtime classification helpers — **recommended immediate next** |
| B. CROW.DEVFLOW.3 | Controlled alpha demo backend mode (env flags + selected demo writes) |
| C. CROW.DISCOVERY.TRACKS.1 | Client/operator track unification (local-first) |
| D. CROW.DEMO.1 | Seed fake demo organizations (local / demo-only) |
| E. CROW.REVIEW.1 | Friend/tester feedback checklist |

## Outcome counters

```
ALPHA_DEVELOPMENT_MODE_DEFINED_COUNT=1
GAP004_RECLASSIFIED_AS_FUTURE_PRODUCTION_GATE_COUNT=1
REAL_CUSTOMER_DATA_ALLOWED_COUNT=0
COMMERCIAL_PRODUCTION_CLAIM_COUNT=0
PRODUCTION_DEPLOYMENT_COUNT=0
UNAUTHORIZED_MIGRATION_COUNT=0
HOSTED_BUSINESS_WRITE_COUNT=0
MAIN_PUSH_COUNT=0
PR10_MERGED_COUNT=0
BLUEPRINT_GENERATION_ALLOWED_COUNT=0
PAYMENT_ENABLED_COUNT=0
CROAI_PRODUCTION_ACTION_ENABLED_COUNT=0
```

## Final verdict

**READY — CROW ALPHA DEVELOPMENT MODE AND FAST REVIEW WORKFLOW PREPARED**
