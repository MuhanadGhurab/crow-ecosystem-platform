# Commercial and Payments

| Field | Value |
|-------|-------|
| **Title** | Commercial and Payments |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Provider-specific assumptions as canonical truth |
| **Related decisions** | [ADR-005](decisions/ADR-005-payment-status-does-not-grant-authority.md) |
| **Implementation state** | PLANNED domain model; Stripe scaffold PARTIAL (advisory only) |

## Provider independence

The commercial domain model is **provider-independent**. Stripe is one candidate adapter — not the authoritative commercial source of truth. See [`STRIPE_BILLING.md`](../internal/STRIPE_BILLING.md) for current scaffold (advisory, not live by default).

## Commercial instruments

1. Commercial Proposal
2. Implementation Commercial Agreement
3. Implementation Payment Schedule
4. Monthly Tenant Subscription Agreement
5. Optional CroAI Subscription Addendum
6. Invoices
7. Payment Records
8. Receipts
9. Credits or Adjustments
10. Renewal Records
11. Entitlement Records

## Commercial Proposal contents

May include: implementation scope, tenant-build scope, included capabilities, integrations, migration assumptions, trust scope, training, onboarding, timeline, monthly subscription, CroAI add-on, optional phases, exclusions.

## Implementation payment schedule

May contain: initial deposit, build milestone, readiness milestone, Go-Live balance. **Percentages and timing are configurable** — do not hard-code into canonical rules.

## Payment-status separation (locked)

```
Payment status ≠ Identity status ≠ Tenant membership ≠ Authorization
≠ Tenant ownership ≠ Administrative authority
```

**Successful payment must never automatically assign:** Tenant Owner, Tenant Admin, Platform Admin, ProCrow Operator, Workflow Approver, or any authoritative role.

**Failed payment must not:** delete tenant data silently, corrupt records, erase audit history, alter authoritative roles, or bypass legal/operational safeguards.

## Intended commercial-state model

| State | Notes |
|-------|-------|
| DRAFT | Not yet presented |
| PENDING_ACCEPTANCE | Awaiting client |
| ACCEPTED | Agreement signed |
| INITIAL_PAYMENT_DUE | Deposit or first tranche |
| INITIAL_PAYMENT_PARTIAL | Partial receipt |
| INITIAL_PAYMENT_COMPLETE | Initial tranche satisfied |
| ACTIVE | Subscription or engagement active |
| PAYMENT_DUE | Invoice outstanding |
| PAST_DUE | Overdue |
| GRACE_PERIOD | Limited access may continue per policy |
| RESTRICTED | Capability restriction per entitlement policy |
| SUSPENDED | Service suspended per policy |
| REINSTATED | Restored after suspension |
| CANCELLATION_PENDING | Notice period |
| CANCELLED | Ended by client |
| TERMINATED | Ended by Crow per agreement |

Subscription status may affect **service availability**. It must **never** grant or modify authority.

**Do not create database enums for these states in documentation milestones** — document transitions, guards, effects, and unresolved legal decisions for future implementation.

## Current implementation

| Item | Status |
|------|--------|
| `TenantSubscription`, `BillingRecord`, `SubscriptionPlan` | Schema exists |
| Stripe checkout/webhook | Scaffold — `src/lib/billing/`, `/api/billing/*` |
| Live billing enforcement | NOT implemented |
| Full commercial instrument model | PLANNED |
| Public Pay Now | NOT implemented |

## Related documents

- [`07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md`](07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md)
- [`F19_SAUDI_PAYMENT_ARCHITECTURE.md`](../internal/F19_SAUDI_PAYMENT_ARCHITECTURE.md)
- [`STRIPE_BILLING.md`](../internal/STRIPE_BILLING.md)
