# Controlled Alpha Demo Backend Mode

| Field | Value |
|-------|-------|
| **Title** | Controlled Alpha Demo Backend Mode — definition |
| **Status** | CANONICAL plan (not implemented) |
| **Authority** | Owner decision — CROW.DEVFLOW.3 |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-DEVFLOW-3.md`](../milestones/CROW-DEVFLOW-3.md) |
| **Guard plan** | [`ALPHA-DEMO-BACKEND-GUARD-PLAN.md`](ALPHA-DEMO-BACKEND-GUARD-PLAN.md) |
| **Related** | [`CROW-ALPHA-DEVELOPMENT-MODE.md`](CROW-ALPHA-DEVELOPMENT-MODE.md) · [`DEMO-DATA-POLICY.md`](DEMO-DATA-POLICY.md) · [`../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md) |

## Purpose

Define how Crow may later allow **selected demo/backend actions** during Alpha Development while using the existing Supabase project as a **demo/dev sandbox** — without claiming production-safe isolation (GAP-004) or commercial Production.

**This document is plan only.** Runtime guards are **not** loosened in CROW.DEVFLOW.3. `ALPHA_DEMO_BACKEND_ENABLED_COUNT=0`.

## Definitions

| Term | Meaning |
|------|---------|
| **alpha demo backend** | Explicitly flagged mode where selected hosted writes may store **demo/test** records only |
| **demo-only hosted actions** | Narrow allowlist of create/update operations on clearly marked demo records |
| **blocked production actions** | Anything that implies commercial Production, real customers, payment, tenant go-live, or official Blueprint |
| **demo data** | Fake or disposable org/user/workflow/evidence content per [`DEMO-DATA-POLICY.md`](DEMO-DATA-POLICY.md) |
| **real customer data** | Data of a real commercial customer or prospect treated as production truth — **forbidden** |
| **production-sensitive data** | Credentials, real PII as production records, live payment instruments — **forbidden** |
| **commercial production** | Customer-safe, isolation-proven, authority-complete Production — **not** current Crow |

## Required env flags

| Flag | Required value | Role |
|------|----------------|------|
| `CROW_RUNTIME_MODE` | `alpha_development` | Runtime is Alpha, not commercial Production |
| `CROW_DATA_CLASSIFICATION` | `demo_only` | Only demo/test data allowed |
| `ALLOW_SHARED_DEMO_BACKEND` | `true` | Owner-explicit opt-in to shared demo backend writes |

### Optional / recommended

| Flag | Recommended | Role |
|------|-------------|------|
| `CROW_DEMO_BACKEND_SCOPE` | `limited` | Scope of allowlisted actions |
| `CROW_DEMO_BACKEND_WRITE_MODE` | `demo_only` | Write classifier |
| `CROW_ALLOW_REAL_CUSTOMER_DATA` | unset or `false` | Must **not** be `true` |

Also remain disabled (unset / not authorized):

- `CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE`
- Payment live keys / checkout enablement
- Tenant go-live / provisioning authority flags

## Activation rule (all must be true)

Demo backend writes may be allowed **only when all** of the following hold:

1. `CROW_RUNTIME_MODE=alpha_development`
2. `CROW_DATA_CLASSIFICATION=demo_only`
3. `ALLOW_SHARED_DEMO_BACKEND=true`
4. `CROW_ALLOW_REAL_CUSTOMER_DATA` is **not** `true`
5. Payment runtime is disabled
6. Blueprint generation / Complete override is disabled
7. Tenant go-live / official provisioning is disabled
8. Runtime is **not** claiming commercial Production
9. Action is on the **allowlist** (see below)
10. Record will carry **demo markers** (see marking plan)

**If any condition is missing → fail closed** (no demo write).

Default today (GAP-004A): Preview DB-disabled remains fail-closed until a future implementation milestone enables this mode with owner authorization.

## Allowed demo actions (proposed allowlist)

All must be clearly demo/test:

| Action | Notes |
|--------|-------|
| Create fake demo request | Fake org / journey labels only |
| Save demo Discovery draft | Answers / local-first migration to hosted demo draft |
| Update demo Discovery answer | Same request · demo markers required |
| Save demo ProCrow note | Operator notes · demo only |
| Save demo feedback | Friend/tester feedback records |
| Create demo-only review package | Inert handoff / modeling package — **not** official Blueprint |

## Forbidden actions (always)

Even when demo backend flags are set:

| Forbidden | Why |
|-----------|-----|
| Real customer data | Demo policy |
| Sensitive personal/customer production data | Safety |
| Payment / live checkout | Commercial gate |
| Tenant go-live / official runtime provisioning | Authority |
| Official Blueprint generation | Authority |
| `completeDiscovery` official path | Quarantined |
| Production deployment | GAP-015 / deploy policy |
| Migrations unless separately authorized | Safety |
| CroAI production actions | Constitution |
| Membership / role authority elevation | Authority |
| Env secret dumping | Secrets policy |
| Claiming GAP-004 isolation proven | Truth |

## Demo data marking plan (future — no schema migration in DEVFLOW.3)

Future demo records should carry explicit markers, for example:

```json
{
  "dataClassification": "demo_only",
  "runtimeMode": "alpha_development",
  "isDemo": true,
  "demoOwner": "owner_or_tester_id_or_label",
  "sourceEnvironment": "preview_or_local",
  "notProduction": true
}
```

### Migration-free options (preferred first)

| Approach | When |
|----------|------|
| JSON / notes fields on existing Request / Discovery / brief objects | Prefer for early slices — no Prisma migration |
| Naming conventions (`DEMO-` prefix on display names) | Supplement markers, not replace them |
| Dedicated columns / enums | Only after owner-authorized migration |

**Do not** implement schema changes in DEVFLOW.3.

## UI warning plan

Surfaces that perform or confirm demo writes should show:

- “Demo sandbox data”
- “Not production”
- “Do not enter real customer or sensitive data”
- “This action saves demo/test data only”
- “Official Blueprint generation is disabled”

Coexists with:

- `CrowAlphaRuntimeBanner` (classification)
- `PreviewDbDisabledNotice` (when Preview DB still disabled)

## Relationship to GAP-004 / GAP-004A

| Gap | Effect of this plan |
|-----|---------------------|
| GAP-004 | Still **future commercial gate** — demo backend ≠ isolation proven |
| GAP-004A | Default fail-closed remains until **implementation** + owner enablement; this plan documents how an explicit opt-in may later coexist |

## Counters (this plan milestone)

```
CONTROLLED_ALPHA_DEMO_BACKEND_PLAN_COUNT=1
ALPHA_DEMO_BACKEND_ENABLED_COUNT=0
HOSTED_BUSINESS_WRITE_COUNT=0
REAL_CUSTOMER_DATA_ALLOWED_COUNT=0
BLUEPRINT_GENERATION_ALLOWED_COUNT=0
PAYMENT_ENABLED_COUNT=0
```
