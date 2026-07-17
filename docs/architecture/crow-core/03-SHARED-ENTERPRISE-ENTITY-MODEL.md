# Shared Enterprise Entity Model

Crow uses a **document-relational** entity model: flat contracts with `EntityRef` links, tenant scope, and sensitivity labels.

## Entity domains

| Domain | Examples |
|--------|----------|
| Organization | Company, branch, cost center |
| People | Person, membership, role assignment |
| Commercial | Contract, package, invoice line |
| Operations | Process, work item, asset |
| Digital / Creative | Campaign, asset, deliverable |
| Security / Governance | Control, signal, evidence |
| Universal Work | Task, approval, handoff |

## Universal identity fields

- `EntityRef`: `{ domain, type, id, tenantId?, displayName? }`
- `TenantScopedId`: opaque tenant-bound identifier
- `Sensitivity`: `public` | `internal` | `confidential` | `restricted`
- `LifecycleState`: draft → active → suspended → archived
- `ExternalIdentifier`: government or ERP keys (never used alone for auth)

## Relationships

Entities link via IDs, not deep nesting. Cross-domain joins happen in process fabric or reporting layers.

## Existing anchors

Domain READMEs under `src/lib/domains/01-client-engagement` … `10-enterprise-operations` remain organizational anchors; Crow Core types formalize cross-domain references.

## Mapping to persistence

C0 contracts are persistence-neutral. Future C1+ phases will map `EntityRef` to Prisma models explicitly without breaking contract consumers.
