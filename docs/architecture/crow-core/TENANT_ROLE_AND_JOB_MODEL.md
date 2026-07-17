# Tenant Role and Job Model

**Status:** CURRENT (catalog); authoritative tenant RBAC assignment PLANNED at build time.

## Location

`src/lib/tenant-composition/role-job-catalog.ts`

## Distinction

| Concept | Grants permissions? |
|---------|---------------------|
| Job definition (title) | **No** — organizational identity |
| Role archetype | **No** — reusable access pattern suggestion |
| Permission assignment | **Yes** — authoritative tenant-scoped grant |

## Role archetypes

`executive`, `tenant_administrator`, `department_manager`, `approver`, `supervisor`, `specialist`, `coordinator`, `analyst`, `dispatcher`, `field_worker`, `technician`, `driver`, `sales_representative`, `hr_specialist`, `finance_specialist`, `procurement_specialist`, `security_administrator`, `auditor`, `contractor`, `supplier`, `customer`, `member`, `guest`

## Job families

`executive_leadership`, `operations`, `human_resources`, `finance`, `sales_and_commercial`, `procurement`, `supply_chain`, `project_delivery`, `engineering`, `field_operations`, `customer_service`, `technology`, `cybersecurity`, `governance_and_risk`, `quality_and_safety`, `facilities`, `creative_and_media`, `education_and_training`, `healthcare_operations`, `hospitality`

Sample job definitions (`operations_manager`, `dispatcher`) demonstrate title-to-archetype mapping without permission grants.
