# Crow Service Model

| Field | Value |
|-------|-------|
| **Title** | Crow Service Model |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | — |
| **Related decisions** | [ADR-002](decisions/ADR-002-build-new-and-transform-entry-paths.md) |
| **Implementation state** | Phases A–C partially implemented; D–E planned |

Crow is commercially **one connected service** with distinct phases. Phases may have separate line items but must be presented as a unified engagement.

## Phase A — Discovery Engagement

**Produces:**

- Validated Request
- Discovery record
- Operating context and known constraints
- Initial recommendation scope

**Implementation:** PARTIAL — Request, Discovery models and routes exist; FTGP golden path in progress.

## Phase B — Enterprise Blueprint

**Produces:**

- Operating Model
- Responsibility Model, Work Persona Model, Workflow Model
- Capability Model, Information Model, Trust Model
- SAREA Experience Model, Integration Model
- Implementation Plan

**Implementation:** PARTIAL — Blueprint Studio, versioning (C2), review cycles; full commercial proposal workflow incomplete.

## Phase C — Tenant Build and Go-Live

**Produces:**

- Configured tenant (identity, membership, roles, Work Personas)
- Workflows, capabilities, CyberCrow controls, SAREA experiences
- Integrations, readiness evidence, onboarding, Go-Live

**Implementation:** PARTIAL — Demo tenants (MEEM, Rimal); controlled first-tenant path (FTGP) not complete.

## Phase D — Monthly Tenant Subscription

**Provides:**

- Continued tenant access and entitled capabilities
- Maintenance, support, monitoring
- Governed lifecycle operations
- Approved Blueprint evolution and controlled capability expansion

**Implementation:** PLANNED — `TenantSubscription` schema and Stripe scaffold exist; no live billing enforcement.

## Phase E — Optional CroAI Subscription

**Provides:**

- Tenant-scoped knowledge assistance, work summaries, workflow explanation
- Decision preparation, missing-evidence identification
- Authorized knowledge search, report generation
- Role-aware intelligence, attention and risk assistance

**Implementation:** PLANNED — no CroAI runtime in repository.

## Transform Existing variant

For **TRANSFORM** journeys, Phase B additionally supports:

- Current Operating Map
- Target Operating Blueprint
- Transition Blueprint

## Related documents

- [`02-CANONICAL-LIFECYCLE.md`](02-CANONICAL-LIFECYCLE.md)
- [`05-ENTERPRISE-BLUEPRINT.md`](05-ENTERPRISE-BLUEPRINT.md)
- [`06-COMMERCIAL-AND-PAYMENTS.md`](06-COMMERCIAL-AND-PAYMENTS.md)
- [`07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md`](07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md)
