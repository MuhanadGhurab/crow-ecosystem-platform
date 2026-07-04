# Tenant Subscription and Entitlements

| Field | Value |
|-------|-------|
| **Title** | Tenant Subscription and Entitlements |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | — |
| **Related decisions** | [ADR-006](decisions/ADR-006-tenant-entitlements-separate-from-identity.md) |
| **Implementation state** | PLANNED — basic subscription schema PARTIAL |

## Separation principle

**Tenant entitlements are separate from:**

- Payment-provider state (Stripe subscription IDs, webhook events)
- Identity and membership
- Authorization roles

Payment providers may **report** payment events. They must **not** become the authoritative source for Crow authorization or tenant identity.

## Entitlements may determine

- Enabled capabilities
- User, location, or usage allowances
- Integration access
- Support level
- CyberCrow control bundle (Shield / Sentinel / Fortress)
- CroAI availability and usage allowance
- Storage or processing limits
- Reporting features
- Lifecycle service level

## Entitlement change requirements

Entitlement changes must be:

- Versioned and auditable
- Tenant-scoped
- Linked to an agreement or approved exception
- Separate from identity and membership
- Projected safely into runtime availability

## Monthly agreement fields (intended)

Agreement version, effective date, subscription start, billing cycle, monthly amount, term, renewal method, included services, limits, support level, integrations, due date, currency, tax representation, failed-payment handling, grace period, restriction/suspension/reinstatement rules, cancellation, data export, retention obligations, price-change process, client acceptance evidence.

## CroAI subscription separation

CroAI subscription status should remain separately controllable from the main tenant subscription. CroAI suspension should not automatically suspend the core operational tenant.

## Current implementation

| Item | Status | Evidence |
|------|--------|----------|
| `SubscriptionPlan`, `TenantSubscription` | Schema | `prisma/schema.prisma` |
| Stripe fields on subscription | Scaffold | `stripeCustomerId`, etc. |
| Entitlement versioning model | PLANNED | — |
| Billing enforcement | NOT live | [`STRIPE_BILLING.md`](../internal/STRIPE_BILLING.md) |
| `RequestedSubscriptionPlan` on Request | PARTIAL | Intake only |

## Related documents

- [`06-COMMERCIAL-AND-PAYMENTS.md`](06-COMMERCIAL-AND-PAYMENTS.md)
- [`08-CROAI-CONSTITUTION.md`](08-CROAI-CONSTITUTION.md)
- [`CYBERCROW_TENANT_POLICY_PACKS.md`](../architecture/crow-core/CYBERCROW_TENANT_POLICY_PACKS.md)
