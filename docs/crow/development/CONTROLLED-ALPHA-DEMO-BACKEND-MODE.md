# Controlled Alpha Demo Backend Mode

| Field | Value |
|-------|-------|
| **Title** | Controlled Alpha Demo Backend Mode — definition |
| **Status** | CANONICAL — gate/guard **implemented** (CROW.DEVFLOW.4); domain persistence **not** wired; app enablement **off** by default |
| **Authority** | Owner decision — CROW.DEVFLOW.3 (plan) · CROW.DEVFLOW.4 (gate/guard) |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-DEVFLOW-4.md`](../milestones/CROW-DEVFLOW-4.md) · plan [`../milestones/CROW-DEVFLOW-3.md`](../milestones/CROW-DEVFLOW-3.md) |
| **Guard plan** | [`ALPHA-DEMO-BACKEND-GUARD-PLAN.md`](ALPHA-DEMO-BACKEND-GUARD-PLAN.md) |
| **Related** | [`CROW-ALPHA-DEVELOPMENT-MODE.md`](CROW-ALPHA-DEVELOPMENT-MODE.md) · [`DEMO-DATA-POLICY.md`](DEMO-DATA-POLICY.md) · [`../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md) |

## Purpose

Define how Crow may allow **selected demo/backend actions** during Alpha Development while using the existing Supabase project as a **demo/dev sandbox** — without claiming production-safe isolation (GAP-004) or commercial Production.

**CROW.DEVFLOW.4** implemented the runtime gate + demo-write guard. Domain persistence is **not** wired. Preview DB-disabled (GAP-004A) is **not** loosened globally. Mode remains disabled unless all activation flags are set. `ALPHA_DEMO_BACKEND_ENABLED_IN_APP_COUNT=0`.

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

Default today (GAP-004A): Preview DB-disabled remains fail-closed for general Prisma/DB access. DEVFLOW.5 adds a **narrow** escape hatch for `demo_feedback_save` only after the write guard passes.

### Implemented helpers (CROW.DEVFLOW.4–5)

| Module | API |
|--------|-----|
| `src/lib/runtime/alpha-demo-backend-mode.ts` | Runtime gate |
| `src/lib/runtime/alpha-demo-write-guard.ts` | Allowlist + markers |
| `src/lib/runtime/alpha-demo-db-access.ts` | Narrow Prisma escape (`demo_feedback_save` only) |
| `src/lib/services/demo-feedback.service.ts` | Guarded demo feedback persist |
| Tests | `alpha-demo-backend-guard:test` · `demo-feedback-pilot:test` |

## Allowed demo actions (typed allowlist)

All must be clearly demo/test:

| Action | Status |
|--------|--------|
| `demo_feedback_save` | **Implemented** (DEVFLOW.5) |
| `demo_request_create` | Allowlisted only — not wired |
| `demo_discovery_draft_save` / `demo_discovery_answer_save` | Allowlisted only — not wired |
| `demo_procrow_note_save` | Allowlisted only — not wired |
| `demo_review_package_create` | Allowlisted only — not wired |

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

## Demo data marking plan (markers validated by guard; no schema migration in DEVFLOW.4)

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

**Do not** implement schema changes in DEVFLOW.4. Persistence wiring is a future slice.

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
| GAP-004A | Default fail-closed for general DB; DEVFLOW.5 narrow escape for demo feedback only when flags set |

## Counters (post DEVFLOW.5)

```
CONTROLLED_ALPHA_DEMO_BACKEND_PLAN_COUNT=1
ALPHA_DEMO_BACKEND_RUNTIME_GATE_IMPLEMENTED_COUNT=1
DEMO_WRITE_GUARD_IMPLEMENTED_COUNT=1
DEMO_FEEDBACK_HOSTED_WRITE_IMPLEMENTED_COUNT=1
DEMO_ONLY_HOSTED_WRITE_COUNT=1
ALPHA_DEMO_BACKEND_DOMAIN_PERSISTENCE_WIRED_COUNT=0
REQUEST_PERSISTENCE_ENABLED_BY_DEVFLOW5_COUNT=0
DISCOVERY_PERSISTENCE_ENABLED_BY_DEVFLOW5_COUNT=0
HOSTED_BUSINESS_WRITE_COUNT=0
REAL_CUSTOMER_DATA_ALLOWED_COUNT=0
BLUEPRINT_GENERATION_ALLOWED_COUNT=0
PAYMENT_ENABLED_COUNT=0
```
