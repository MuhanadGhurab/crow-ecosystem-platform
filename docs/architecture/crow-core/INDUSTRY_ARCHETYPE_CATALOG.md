# Industry Archetype Catalog

**Status:** CURRENT (16 archetypes); legacy 5-sector catalog preserved separately.

## Location

`src/lib/tenant-composition/industry-archetype-catalog.ts`

## Archetypes

| Key | Notes |
|-----|-------|
| `logistics_and_fleet` | PARTIAL — FTGP lighthouse lineage |
| `construction_and_epc` | Project + field workforce |
| `retail_and_commerce` | Multi-branch retail |
| `manufacturing_and_industrial` | Production + maintenance |
| `professional_services` | Engagement delivery |
| `property_and_facilities` | FM operator model |
| `hospitality_and_tourism` | Guest services |
| `healthcare_operations` | **Ops only** — no clinical records |
| `education_and_training` | Programs and cohorts |
| `events_and_venues` | Venue operations |
| `media_and_creative` | Production pipelines |
| `fitness_and_wellness` | Membership ops |
| `technology_and_saas` | Customer success |
| `food_service` | Kitchen + delivery |
| `nonprofit_and_associations` | Programs + membership |
| `holding_group` | Multi-entity governance |

## Organizational overlays

`startup`, `small_business`, `mid_market`, `enterprise`, `multi_branch`, `holding_group`, `franchise`, `project_based`, `field_workforce`, `highly_regulated`, `seasonal_workforce`, `customer_membership`, `vendor_heavy`, `asset_heavy`

Example: `construction_and_epc` + `enterprise` + `multi_branch` + `field_workforce` yields different recommendations than `construction_and_epc` + `small_business`.

## Legacy mapping

Discovery `mapDiscoverySignalsToCompositionInput` maps legacy sector keys (`logistics`, `retail`, etc.) to archetype keys.
