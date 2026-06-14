# C2 — Security verification

## Threat model alignment (C1.1)

| Control | C2 implementation |
|---------|---------------------|
| Tenant isolation | Tenant-scoped repos + `requireTenantBlueprintScope` |
| Authorization bypass | Explicit blueprint actions; SAREA excluded |
| Client data leak | Server-side `projectClientSafeBlueprint` + tests |
| Approval forgery | Hash + revision bind on approve |
| AI overreach | AI cannot approve; trace marks AI involvement |
| Snapshot bomb | 2 MB max, depth/array limits |
| Cross-tenant refs | Service validation on writes |

## Verifiers

- `npm run c2-blueprint-runtime:verify`
- `npm run c1-migration-gate:verify` (C2-aware baseline)
- Unit tests: snapshot validation, hash, projection

## C2 security gates before Preview migration

All acceptance criteria in C2 spec §28 must pass on isolated DB + full regression suite.
