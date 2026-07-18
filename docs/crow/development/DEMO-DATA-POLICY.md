# Crow Demo Data Policy

| Field | Value |
|-------|-------|
| **Title** | Demo / test data policy (Alpha Development Mode) |
| **Status** | CANONICAL policy |
| **Authority** | Owner decision — CROW.DEVFLOW.1 |
| **Date** | 2026-07-18 |
| **Related** | [`CROW-ALPHA-DEVELOPMENT-MODE.md`](CROW-ALPHA-DEVELOPMENT-MODE.md) · [`FAST-REVIEW-WORKFLOW.md`](FAST-REVIEW-WORKFLOW.md) |

## Purpose

Allow fast alpha/demo development and friend/tester review while forbidding real customer and commercial-sensitive data.

## Allowed (demo / test)

| Allowed | Notes |
|---------|-------|
| Demo / test data | Clearly fake or disposable |
| Fake organizations | Invented names; no real client orgs |
| Fake users | Test accounts; no real customer identities as customers |
| Fake workflows | Synthetic process examples |
| Fake evidence references | Non-authoritative refs / placeholders only |
| Local-first Discovery drafts | Browser storage / fixtures |
| Seeded demo datasets (future CROW.DEMO.1) | Local or demo-only backend when authorized |

## Forbidden

| Forbidden | Notes |
|-----------|-------|
| Real customer data | Any data belonging to a real paying or prospective commercial customer treated as production truth |
| Sensitive production data | Credentials, PII of real people used as production records, production secrets in demos |
| Payment data | Card numbers, live Stripe customer objects for real charges, real invoices as commercial records |
| Official Blueprint outputs | Generated Enterprise Blueprints treated as approved commercial deliverables |
| Tenant go-live data | Real memberships / roles that imply operational tenant authority |
| Claiming demo sandbox = production-safe hosted persistence | GAP-004 future gate |

## Labeling rule

Anyone using a hosted alpha/demo URL must understand:

> Demo/test data only. Not production. Do not enter real customer or sensitive data.

(Visible banner planned in **CROW.DEVFLOW.2**.)

## Friend / tester guidance

- Treat the app as **alpha / demo**
- Use only fake org and person names
- Do not upload real contracts, employee lists, or customer PII
- Feedback is welcome; commercial Production claims are not

## Backend implication

Until controlled Alpha Demo Backend Mode is implemented (DEVFLOW.3):

- Prefer **local-first** and fail-closed Preview DB-disabled (GAP-004A) where still active
- Do not write hosted business data without explicit owner authorization for a demo/backend slice
- Existing Supabase may be conceptually classified as demo/dev sandbox — **writing** still requires a later authorized mode or explicit owner exception

## Counters (policy)

```
REAL_CUSTOMER_DATA_ALLOWED_COUNT=0
COMMERCIAL_PRODUCTION_CLAIM_COUNT=0
PAYMENT_ENABLED_COUNT=0
```
