# Tenant Composition Architecture

**Status:** PARTIAL — registry and Tenant Studio preview are CURRENT; full runtime provisioning is PLANNED.

## Purpose

Crow supports many tenant types through **composition**, not industry-specific application forks.

```text
Tenant Blueprint =
  Industry Archetype
+ Organizational Overlays
+ Capability Packs
+ Workflow Packs
+ Role Archetypes
+ Permission Bundles
+ Entity Packs (PLANNED)
+ CyberCrow Policy Packs
+ SAREA Experience Packs
+ Integration Requirements (PLANNED)
```

## Canonical types

| Type | Module | Status |
|------|--------|--------|
| `IndustryArchetype` | `industry-archetype-catalog.ts` | CURRENT |
| `CapabilityDefinition` | `capability-catalog.ts` | CURRENT |
| `WorkflowPattern` | `workflow-pattern-catalog.ts` | CURRENT |
| `RoleArchetype` / `JobFamily` | `role-job-catalog.ts` | CURRENT |
| `PermissionBundle` | `permission-bundle-catalog.ts` | CURRENT |
| `SareaExperiencePattern` | `sarea-pattern-catalog.ts` | CURRENT |
| `CyberCrowPolicyPack` | `cybercrow-policy-catalog.ts` | CURRENT |
| `OrganizationalOverlay` | `industry-archetype-catalog.ts` | CURRENT |
| `TenantBlueprintComposition` | `registry.ts` | CURRENT |

Each catalog entry includes: stable `key`, `displayName`, `description`, `status`, `version`, `provenance`, and relationship fields.

## Core rules

1. **Industry is advisory** — suggests capabilities and patterns; never grants permissions.
2. **Job title ≠ permission** — `JobDefinition` entries set `grantsPermissions: false`.
3. **SAREA consumes authority** — patterns set `grantsPermissions: false`.
4. **CyberCrow is tenant-scoped** — policy packs are entitlements, not users or tenants.
5. **No platform roles in tenant bundles** — `FORBIDDEN_PLATFORM_BUNDLE_KEYS` enforced in tests.

## Registry API

```typescript
composeTenantBlueprint({
  industryArchetype,
  overlays,
  selectedCapabilities,
  organizationSignals,
})
```

Location: `src/lib/tenant-composition/registry.ts`

## Discovery contract

Discovery signals map to recommendations only (`discovery-integration.ts`). Pipeline:

`Discovery signal → recommendation → Blueprint review → approval → future tenant build`

## Evolution from legacy

Existing `sector-catalog.ts` and `sector-template-data.ts` remain for FTGP and marketing. New archetypes extend the model without deleting proven templates.

## Audit marker

`TENANT_EXPANSION_CURRENT_STATE_AUDITED=PASS`
