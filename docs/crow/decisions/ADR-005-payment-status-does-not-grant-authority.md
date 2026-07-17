# ADR-005: Payment Status Does Not Grant Authority

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | Policy locked; Stripe scaffold must not violate |

## Context

Payment systems often auto-provision admin access on successful charge.

## Decision

Payment status **never** grants or modifies: Tenant Owner, Tenant Admin, Platform Admin, ProCrow Operator, Workflow Approver, or any authoritative role. Failed payment must not corrupt roles or audit history.

## Rationale

Commercial relationship ≠ operational authority. Segregation of duties and legal safeguards.

## Alternatives rejected

- Payment-triggered role assignment
- Subscription tier auto-maps to admin role

## Consequences

Billing webhooks may update subscription state only. Role assignment requires explicit operator gates.

## Affected domains

Commercial, Subscription, Auth, Tenant membership

## Links

- [`06-COMMERCIAL-AND-PAYMENTS.md`](../06-COMMERCIAL-AND-PAYMENTS.md)
- [`STRIPE_BILLING.md`](../../internal/STRIPE_BILLING.md)
