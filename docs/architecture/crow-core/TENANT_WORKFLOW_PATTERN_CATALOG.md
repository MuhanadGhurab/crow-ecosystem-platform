# Tenant Workflow Pattern Catalog

**Status:** CURRENT (pattern definitions); workflow runtime PLANNED per pattern.

## Location

`src/lib/tenant-composition/workflow-pattern-catalog.ts`

## Primitives

`submit`, `review`, `approve`, `reject`, `return_for_revision`, `assign`, `schedule`, `dispatch`, `accept`, `start`, `pause`, `complete`, `inspect`, `verify`, `escalate`, `sign_off`, `invoice`, `close`, `cancel`, `archive`

## Patterns

| Key | Use |
|-----|-----|
| `request_and_approval` | Generic approvals |
| `case_resolution` | Service cases |
| `project_delivery` | Project lifecycle |
| `work_order_execution` | Field/shop execution |
| `dispatch_and_delivery` | Logistics dispatch (PARTIAL — legacy proven) |
| `procure_to_receive` | Procurement |
| `hire_to_onboard` | HR onboarding |
| `incident_to_resolution` | Incidents |
| `inspection_to_corrective_action` | Inspections |
| `contract_review_and_approval` | Contracts |
| `customer_onboarding` | Customer setup |
| `member_enrollment` | Membership |
| `booking_to_service_completion` | Appointments |

Each pattern defines actors, states, transitions, required permission bundles, evidence, escalation, audit events, SAREA hints, and CyberCrow trust checks.
