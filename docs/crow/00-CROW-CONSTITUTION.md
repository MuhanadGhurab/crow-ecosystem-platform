# Crow Constitution

| Field | Value |
|-------|-------|
| **Title** | Crow Constitution |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Informal product descriptions; partial overlap with [`00-CROW-CORE-OVERVIEW.md`](../architecture/crow-core/00-CROW-CORE-OVERVIEW.md) (specialist reference retained) |
| **Related decisions** | [ADR-001](decisions/ADR-001-one-governed-design-to-runtime-service.md) |
| **Implementation state** | Product direction — partial implementation; see [`CURRENT-STATE.md`](CURRENT-STATE.md) |

## Canonical definition

**Crow is a governed design-to-runtime service** that transforms organizational intent into an approved **Operating Model**, an **Enterprise Blueprint**, and an **Operational Tenant** — then supports that tenant through recurring platform services, controlled evolution, and optional CroAI intelligence.

## Public promise

> Design how your organization should operate — then build the system around it.

**Supporting explanation:** Crow understands your purpose, people, responsibilities, workflows, and trust requirements, then turns them into an Enterprise Blueprint and an operational tenant.

## What Crow is not

Crow is **not**:

- merely an ERP package or module marketplace
- an instant AI organization generator
- disconnected consulting deliverables
- a generic SaaS application configurator

## Three connected outcomes

| Outcome | Role |
|---------|------|
| **Operating Model** | How the organization should operate — responsibilities, workflows, trust |
| **Enterprise Blueprint** | Reviewed organizational design source for tenant build |
| **Operational Tenant** | Configured runtime executing the approved blueprint |

## Service composition

Crow combines:

1. **Professional organizational design service** — Discovery, composition, review
2. **Governed software platform** — CEM, CyberCrow, SAREA, ProCrow
3. **Recurring operational service** — Subscription, maintenance, controlled evolution

## Entry paths (one service, two journeys)

| JourneyKind | Supports |
|-------------|----------|
| **NEW** (`BUILD NEW`) | Business idea, startup, new venture, new division, new operating unit |
| **TRANSFORM** (`TRANSFORM EXISTING`) | Existing business, modernization, workflow redesign, consolidation, restructuring |

`JourneyKind` and `OrganizationContext` (e.g. `NEW_BUSINESS`, `EXISTING_ORGANIZATION`, `MODERNIZATION`, `NEW_DIVISION`) are **separate fields** — never collapsed.

Passive public browsing must not create business records.

## Runtime engines

| Engine | Owns | Does not own |
|--------|------|--------------|
| **CEM** | Operational work — tasks, workflows, cases, approvals | Authorization |
| **CyberCrow** | Trust — identity assurance signals, audit, tenant isolation enforcement | Autonomous SOC; Shield/Sentinel/Fortress are entitlement bundles only |
| **SAREA** | Role-aware presentation and experience adaptation | **Permission grants** |
| **ProCrow** | Design-to-runtime governance — review, build, readiness, Go-Live | A fourth commercial customer product |

**ProCrow public definition:** *ProCrow is how Crow's intelligence becomes accountable.*

## Authority separations (locked)

```
Authentication ≠ Verification ≠ Identity ≠ Platform role ≠ Tenant membership
≠ Authorized tenant role ≠ Work Persona ≠ SAREA presentation ≠ Payment status ≠ CroAI access
```

External identity providers may authenticate. **Crow's authoritative data model owns authorization.**

## Lifecycle boundaries (locked)

- Request does not create a tenant
- Discovery does not grant authority
- Recommendations are not automatically final
- Blueprint requires review and approval before tenant build
- Commercial acceptance does not bypass readiness
- Payment does not grant authority
- Go-Live requires readiness approval
- SAREA never grants permissions
- CroAI never grants authority

## Traceability

Material changes must be traceable:

```
Discovery evidence → Blueprint version → Commercial impact → Approval
  → Tenant build → Readiness → Go-Live → Runtime → Continuous improvement
```

## Related documents

- [`02-CANONICAL-LIFECYCLE.md`](02-CANONICAL-LIFECYCLE.md)
- [`03-PORTALS-AND-OWNERSHIP.md`](03-PORTALS-AND-OWNERSHIP.md)
- [`04-IDENTITY-AUTHORITY-TRUST.md`](04-IDENTITY-AUTHORITY-TRUST.md)
- [`GLOSSARY.md`](GLOSSARY.md)
