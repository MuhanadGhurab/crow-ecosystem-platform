# Saudi Government Integration Layer

Scope for **future** official integrations — **no live government APIs in C0**.

## Capability cards

Each integration is documented as `IntegrationCapability`:

- id, agency, capabilityType (`identity` | `commercial` | `compliance` | `sector`)
- constitutionalRules[]
- blueprintAssessmentFields[]

Types: `src/lib/crow-core/integrations/`, `SaudiGovIntegrationScope`.

## Constitutional rules

1. Government identity proves **who** — not **what they may do** in Crow
2. No Nafath → admin role mapping
3. No silent sync of membership from government directories
4. All integrations behind feature flags and blueprint approval
5. Evidence and audit trail required for every external call

## Blueprint assessment

Blueprint slices include fields for: required integrations, data residency notes, sector regulators, and identity assurance level — advisory until legal review.

## Non-implementation

C0 does **not** ship adapters, credentials, or production endpoints for government systems.
