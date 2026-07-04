# Crow Glossary

| Field | Value |
|-------|-------|
| **Title** | Crow Glossary |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Duplicate inline definitions across architecture docs |
| **Implementation state** | Terms defined once here — link, do not repeat |

## Crow

A governed design-to-runtime service that transforms organizational intent into an Operating Model, Enterprise Blueprint, and Operational Tenant. See [`00-CROW-CONSTITUTION.md`](00-CROW-CONSTITUTION.md).

## Operating Model

The reviewed description of how an organization should operate — responsibilities, workflows, trust requirements, and capabilities. Produced through Discovery and Blueprint phases.

## Enterprise Blueprint

The reviewed organizational design source from which a tenant is built — not a module list. Requires approval before tenant build. See [`05-ENTERPRISE-BLUEPRINT.md`](05-ENTERPRISE-BLUEPRINT.md).

## Operational Tenant

A configured runtime instance executing an approved Blueprint — identity, membership, roles, Work Personas, workflows, CyberCrow controls, and SAREA experiences.

## Request

A structured client intake (`ImplementationRequest`) expressing organizational intent. Does **not** create a tenant or grant authority.

## Discovery

Evidence-gathering phase under an approved Request. Produces operating context and constraints. Does **not** grant elevated authority.

## JourneyKind

Public entry path classification: **NEW** (Build New) or **TRANSFORM** (Transform Existing). Separate from OrganizationContext.

## OrganizationContext

Detailed request context: `NEW_BUSINESS`, `NEW_DIVISION`, `EXISTING_ORGANIZATION`, `MODERNIZATION`. Never collapsed with JourneyKind.

## Work Persona

Explains what a person is responsible for in a specific operational context. **Not** an authorization grant.

## Authorized Role

A role in Crow's authoritative model (`Role`, `Permission`, `TenantMembership`) that defines what a user may do. Distinct from job title and Work Persona.

## CEM (Crow Enterprise Manager)

Operational work engine — tasks, cases, workflows, states, approvals, capabilities, outcomes. See [`00-CROW-CONSTITUTION.md`](00-CROW-CONSTITUTION.md).

## CyberCrow

Trust and security enforcement layer — identity trust, authorization, tenant isolation, audit, evidence. Shield/Sentinel/Fortress are entitlement bundles, not separate products.

## SAREA

Human experience orchestration — role-aware navigation and presentation. **Never grants permission.**

## ProCrow

Design-to-runtime governance portal — review, provenance, tenant build, readiness, Go-Live. *ProCrow is how Crow's intelligence becomes accountable.*

## CroAI

Optional tenant-scoped, permission-aware intelligence layer. Advisory by default. **Planned** — not implemented. See [`08-CROAI-CONSTITUTION.md`](08-CROAI-CONSTITUTION.md).

## Commercial Proposal

Document presenting implementation scope, timeline, subscription, and commercial terms for client acceptance.

## Implementation Agreement

Binding agreement for implementation scope and payment schedule following proposal acceptance.

## Tenant Subscription

Recurring monthly agreement for continued tenant access and entitled services. Payment status affects availability — **not** authority.

## Entitlement

Versioned, tenant-scoped record of enabled capabilities, limits, and service levels. Separate from identity, membership, and payment-provider state.

## Go-Live

Operator-approved transition from readiness to active operational runtime under an approved Blueprint version.

## Continuous Improvement

Governed post-Go-Live evolution — Blueprint revisions, workflow changes, capability expansion, subscription evolution.
