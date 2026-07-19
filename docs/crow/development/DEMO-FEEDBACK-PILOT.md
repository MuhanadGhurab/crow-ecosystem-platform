# Demo Feedback Pilot

| Field | Value |
|-------|-------|
| **Title** | Controlled Alpha Demo Feedback — hosted write pilot |
| **Status** | CANONICAL — implemented (CROW.DEVFLOW.5) |
| **Authority** | Owner decision — CROW.DEVFLOW.5 |
| **Date** | 2026-07-19 |
| **Milestone** | [`../milestones/CROW-DEVFLOW-5.md`](../milestones/CROW-DEVFLOW-5.md) |
| **Guards** | [`CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md`](CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md) · DEVFLOW.4 gate/guard |

## Purpose

Let owner/friends/testers on Vercel Preview submit **demo/test** feedback without treating it as a client Request, Discovery session, or commercial Production record.

## Storage path (migration-free)

| Item | Value |
|------|-------|
| Table | `platform_notifications` (`PlatformNotification`) |
| Event type | `alpha_demo_feedback` |
| Recipient | `demo-feedback@internal.crow` (internal marker; not mail delivery) |
| Markers | Stored in JSON `metadata` |
| Inbox | **Excluded** from default ProCrow notification inbox queries |

## Guards (required before write)

1. `evaluateAlphaDemoBackendMode()` / write-guard `demo_feedback_save`
2. Required markers: `isDemo` · `demo_only` · `alpha_development` · `notProduction`
3. Narrow Prisma escape hatch (`withAlphaDemoAllowlistedPrismaWrite`) — **only** `demo_feedback_save`
4. Normal `prisma` proxy remains Preview DB-disabled fail-closed

## UI

- Route: `/alpha-feedback` (public)
- Banner link: “Send demo feedback”
- Warning: *Demo feedback only. Not production. Do not enter real customer or sensitive data.*

## Enablement

Requires Preview/local env:

```
CROW_RUNTIME_MODE=alpha_development
CROW_DATA_CLASSIFICATION=demo_only
ALLOW_SHARED_DEMO_BACKEND=true
```

Default (flags unset): form available; hosted write **blocked**.

## Non-claims

- Does **not** prove GAP-004 isolation
- Does **not** authorize Request/Discovery/Blueprint/tenant/payment/CroAI
- Does **not** change Production deploy policy
- Admin operator list UI **deferred**

## Tests

`npm run demo-feedback-pilot:test`
