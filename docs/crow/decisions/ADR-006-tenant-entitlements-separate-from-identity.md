# ADR-006: Tenant Entitlements Are Separate from Identity and Membership

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | PLANNED — schema partial (GAP-007) |

## Context

Stripe subscription state could be mistaken for authorization or capability source.

## Decision

Entitlements are versioned, tenant-scoped, agreement-linked records **separate from** identity, membership, roles, and payment-provider IDs.

## Rationale

Enables capability changes, grace periods, and provider swaps without authority side effects.

## Alternatives rejected

- Stripe subscription metadata as role source
- Plan tier = admin access level

## Consequences

Future entitlement service must project into runtime availability without touching RBAC.

## Affected domains

Subscription, Runtime, Commercial

## Links

- [`07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md`](../07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md)
