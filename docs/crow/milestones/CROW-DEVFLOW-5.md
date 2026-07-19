# CROW.DEVFLOW.5 — Controlled Demo Feedback Hosted Write Pilot

| Field | Value |
|-------|-------|
| **Status** | **Complete** — hosted demo feedback pilot implemented (migration-free) |
| **Date** | 2026-07-19 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Starting HEAD** | `e9ca4ff` (CROW.DEVFLOW.4 tip) |
| **Final HEAD** | _(pin after docs)_ |
| **Owner decision** | Implement first controlled alpha demo hosted write — **demo feedback only** |
| **Prior** | CROW.DEVFLOW.4 (runtime gate + write guard) |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **main** | `f97a835` (unchanged) |
| **PR #10** | OPEN · DRAFT · CONFLICTING · archive only |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Persistence audit

| Question | Result |
|----------|--------|
| Dedicated Feedback model? | **No** |
| Client review feedback path? | Exists — **tied to Request lifecycle** → unsafe to reuse for alpha demo |
| Migration-free store? | **Yes** — `PlatformNotification` + JSON `metadata` |
| Schema change required? | **No** |
| Mixing risk with Requests? | Mitigated — distinct `eventType=alpha_demo_feedback`; excluded from ProCrow notification inbox |

**Decision gate:** all conditions met → proceed with guarded hosted write.

## Delivered

| Artifact | Role |
|----------|------|
| `src/lib/demo-feedback/*` | Contract + validation |
| `src/lib/runtime/alpha-demo-db-access.ts` | Narrow Prisma escape hatch (feedback-only) |
| `src/lib/services/demo-feedback.service.ts` | Guarded persist to `PlatformNotification` |
| `src/lib/actions/demo-feedback.ts` | Server action |
| `/alpha-feedback` + banner link | UI |
| `npm run demo-feedback-pilot:test` | 16 safety cases |
| [`../development/DEMO-FEEDBACK-PILOT.md`](../development/DEMO-FEEDBACK-PILOT.md) | Pilot doc |

## Explicit non-goals

Request / Discovery / ProCrow note / Blueprint persistence · schema/migrations · Production · `main` · PR #10 · payment · tenant · CroAI · admin inbox UI (deferred)

## Enablement (Preview)

Set on the Preview environment (not committed):

- `CROW_RUNTIME_MODE=alpha_development`
- `CROW_DATA_CLASSIFICATION=demo_only`
- `ALLOW_SHARED_DEMO_BACKEND=true`

Without these flags, UI works but hosted write **fail-closed**.

## Counters

```
DEMO_FEEDBACK_PILOT_AUDITED_COUNT=1
DEMO_FEEDBACK_HOSTED_WRITE_IMPLEMENTED_COUNT=1
DEMO_FEEDBACK_HOSTED_WRITE_BLOCKED_COUNT=0
ALPHA_DEMO_BACKEND_RUNTIME_GATE_USED_COUNT=1
DEMO_WRITE_GUARD_USED_COUNT=1
DEMO_ONLY_HOSTED_WRITE_COUNT=1
HOSTED_BUSINESS_WRITE_COUNT=0
PRISMA_SCHEMA_CHANGED_COUNT=0
REQUEST_PERSISTENCE_ENABLED_BY_DEVFLOW5_COUNT=0
DISCOVERY_PERSISTENCE_ENABLED_BY_DEVFLOW5_COUNT=0
```

## Recommended next

Optional admin read-only demo-feedback list · or next allowlisted demo persistence (request/discovery) behind same guards.

## Final verdict

**READY — CONTROLLED DEMO FEEDBACK HOSTED WRITE PILOT IMPLEMENTED**
