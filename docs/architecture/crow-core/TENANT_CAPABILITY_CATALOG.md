# Tenant Capability Catalog

**Status:** CURRENT (catalog + registry references); runtime CEM modules PARTIAL per capability.

## Location

`src/lib/tenant-composition/capability-catalog.ts`

## Groups

| Group | Example keys |
|-------|----------------|
| organization_workforce | `organization_structure`, `workforce_directory`, `employee_lifecycle` |
| customer_commercial | `crm`, `customer_portal`, `case_management` |
| projects_delivery | `project_management`, `work_orders`, `field_service` |
| supply_chain | `dispatch`, `fleet`, `inventory`, `procurement` |
| assets_facilities | `asset_registry`, `maintenance`, `facilities` |
| finance_ops | `budget_requests`, `invoice_workflow` (no banking claims) |
| governance | `audit`, `incident_management`, `safety_management` |
| communication | `documents`, `notifications` |
| intelligence | `analytics`, `workflow_automation` |

Each capability documents: purpose, core entities, typical workflows, recommended roles, SAREA patterns, security considerations, dependencies, industry relevance, and implementation status.

## Composition

Capabilities are selected by industry archetype, overlays, operator picks, and organization signals. Dependencies validated via `validateCapabilityDependencies`.
