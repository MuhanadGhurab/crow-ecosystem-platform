# Industry & Department Template System

Industry packs are **configuration overlays** on the universal entity and process model — not separate products.

## IndustryTemplatePack

- id, industryKey, displayName, version
- terminologyOverlay (labels for entity types)
- starterProcessDefinitions (references, not runtime instances)
- departmentStarters

Types: `src/lib/crow-core/industries/`.

## Starter packs (conceptual)

| Pack | Focus |
|------|-------|
| Construction | Projects, sites, subcontractors |
| Logistics | Shipments, fleet, warehouses |
| Retail | Stores, SKUs, promotions |
| Music / Gaming | Releases, assets, campaigns |
| Freelancers | Engagements, deliverables |
| Software / Hardware | Sprints, BOM, releases |

## Rules

- Templates never bypass blueprint approval or RBAC
- Tenant selects pack during blueprint configuration (future C9)
- No industry-specific auth or billing in C0
