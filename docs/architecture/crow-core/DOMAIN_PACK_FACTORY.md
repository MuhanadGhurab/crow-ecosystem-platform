# Domain Pack Factory

**Status:** CURRENT (advisory composition layer)

## Purpose

Domain Packs are composable operating-domain definitions for Model Forge. They do not provision tenants, grant permissions, or persist to Supabase.

## Core type

`DomainPackDefinition` — see `src/lib/model-forge/domain-types.ts`

Required flags:

- `authoritative: false`
- `grantsPermissions: false`
- `provisionsTenant: false`

## Factory functions

| Function | Location |
|----------|----------|
| `composeDomainPack()` | `domain-packs/domain-pack-factory.ts` |
| `validateDomainPack()` | same |
| `resolveDomainPackDependencies()` | same |
| `compareDomainPacks()` | same |

## Catalog

`DOMAIN_PACK_CATALOG` — sample packs: bookkeeping office, esports operations, legal practice, logistics fulfillment.

## Boundaries

- Advisory recommendations only
- Human blueprint approval required before any tenant build
- No hosted writes from Model Forge
