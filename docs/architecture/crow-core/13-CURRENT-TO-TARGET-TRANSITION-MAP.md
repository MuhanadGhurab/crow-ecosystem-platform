# Current-to-Target Transition Map

A–G audit synthesis: classify existing capabilities against Crow Core C0 target layers. **Document only** — no runtime changes in C0.

## Decision legend

| Decision | Meaning |
|----------|---------|
| KEEP | Aligns with target; minor doc/contract alignment only |
| REFACTOR | Correct direction; needs UX or structure work |
| REFRAME | Rename/reposition without deleting capability |
| RETIRE | Remove or hide after migration window |
| MERGE | Consolidate duplicate surfaces |
| SPLIT | Separate concerns into distinct layers |
| DUPLICATE | Two implementations of same intent |
| UNKNOWN | Needs product decision |

## Target foundation layers

Public Website → Client Portal → Enterprise Blueprint → ProCrow → Business Portal → CEM → CyberCrow / SAREA / Intelligence / Gateway

---

## Transition table (representative audit)

| Capability | Current route / files | Owner | Target layer | Decision | Risk | Phase |
|------------|----------------------|-------|--------------|----------|------|-------|
| Public marketing | `/`, `/pricing`, `/modules` | public | Public Website | KEEP | Low | — |
| Workspace selector | `/access`, `/login` | auth | Identity chain | KEEP | Low | — |
| Client portal shell | `/client/*` | client | Client Portal | REFACTOR | Med | C1 |
| Client discovery | `/client/discovery` | client | Blueprint intake | MERGE | Med | C1 |
| Public discovery | `/discovery` | public/client | Discovery evidence | MERGE | High | C1 |
| Admin discovery | `/admin/discovery` | procrow | ProCrow review | MERGE | Med | L6/C1 |
| Blueprint public | `/blueprints` | public | Blueprint (read) | REFRAME | Low | C1 |
| Blueprint client | `/client/blueprints` | client | Blueprint commercial | KEEP | Low | C1 |
| Blueprint admin | `/admin/blueprints` | procrow | ProCrow governance | KEEP | Med | C1 |
| ProCrow admin | `/admin/*` | procrow | ProCrow | REFACTOR | Med | C2 |
| Architecture Lab | `/admin/architecture-lab` | procrow | Reference prototype | KEEP | Low | C0 |
| Tenant runtime | `/[tenant]/*` | business | Business Portal / CEM | REFACTOR | High | C3–C5 |
| Tenant invite | `/tenant-invite/[token]` | invite | Workforce activation | KEEP | Med | M4 |
| SAREA studio | `/sarea/*` | sarea | Experience orchestration (design) | SPLIT | High | C5 |
| Tenant SAREA runtime | `/[tenant]` nav/widgets | business | SAREA (runtime) | REFACTOR | High | C5 |
| CyberCrow tenant | `/[tenant]/cybercrow` | cybercrow | CyberCrow control plane | KEEP | Med | C6 |
| CEM workflows | Prisma `Workflow`, tasks | business | Process fabric | REFACTOR | High | C3 |
| Task / approvals | `task-approval-engine-depth` | business | Decision service | REFACTOR | Med | C4 |
| Route ownership | `crow-route-ownership.ts` | platform | Governance doc | KEEP | Low | C0 |
| UX principles | `crow-ux-principles.ts` | platform | Experience system | KEEP | Low | C0 |
| Simplified lifecycle (13) | `crow-simplified-lifecycle.ts` | platform | Process (marketing) | REFRAME | Low | C3 |
| Universal lifecycle (22) | `crow-core/process` | platform | Process fabric | KEEP | Low | C0 |
| Portal access contract | `portal-access-contract.ts` | platform | Security constitution | KEEP | Low | C0 |
| SAREA mapping contract | `sarea-experience-mapping-contract.ts` | sarea | SAREA doc 07 | KEEP | Low | C0 |
| CEM operating model | `cem-operating-model-contract.ts` | cem | Process fabric | KEEP | Med | C3 |
| ProCrow control tower | `procrow-control-tower-contract.ts` | procrow | ProCrow | KEEP | Low | C0 |
| Domain modules 01–10 | `src/lib/domains/*` | business | Entity model | REFACTOR | Med | C2 |
| ERP module pages | `/[tenant]/modules/*` | business | Industry templates | REFACTOR | Med | C9 |
| Equal-weight card grids | Various tenant/admin pages | business | Experience anti-pattern | REFACTOR | Med | UX slices |
| `EnterpriseBlueprint` vs `Blueprint` | `prisma/schema.prisma` | data | Blueprint versioning | MERGE | High | C1 |
| Discovery* models | Prisma | data | Traceability source | KEEP | Med | C2 |
| Payments / Stripe | Scaffold only | platform | Out of C0 scope | UNKNOWN | High | — |
| Government / Nafath | Docs only | platform | Integration layer doc 12 | KEEP | Low | C10 |

---

## Overlap hotspots (document only)

1. **Discovery** — three route families (`/discovery`, `/client/.../discovery`, `/admin/discovery`) → target single evidence pipeline with role-specific views.
2. **Blueprint** — three route families plus dual Prisma concepts → target `BlueprintVersion` contract with ProCrow governance.
3. **SAREA** — studio (`/sarea/*`) vs tenant-composed UI → target design-time vs runtime split (doc 07).
4. **Lifecycle** — 13-step marketing lifecycle vs 22-stage process fabric → REFRAME; map in C3.

---

## Recommended vertical slices (post-C0)

| Slice | Focus |
|-------|-------|
| C1 | Blueprint versioning + ROI/SOW drafts |
| C2 | Traceability service |
| C3 | Process fabric ↔ Prisma Workflow |
| C4 | Approval/Decision extraction |
| C5 | SAREA runtime composer |
| C6 | CyberCrow signal router |
| C7 | AI capability registry |
| C8 | Tenant resilience guards |
| C9 | Industry template packs |
| C10 | Saudi integration adapters (flagged) |

---

## Audit method (A–G)

- **A:** Route inventory (`src/app/**/page.tsx`), ~110 pages
- **B:** Blueprint/commercial types + Prisma Discovery/Blueprint shapes
- **C:** Entities + CEM/workflow contracts
- **D:** CyberCrow + security dimensions
- **E:** SAREA constitutional contract
- **F:** AI, industries, integrations (contracts only)
- **G:** Experience patterns + Architecture Lab prototype
