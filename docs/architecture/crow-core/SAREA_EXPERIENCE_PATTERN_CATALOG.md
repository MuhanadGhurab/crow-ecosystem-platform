# SAREA Experience Pattern Catalog

**Status:** CURRENT (pattern catalog); adaptive runtime PLANNED.

## Location

`src/lib/tenant-composition/sarea-pattern-catalog.ts`

## Rule

**SAREA never grants permissions.** Every pattern sets `grantsPermissions: false`.

## Patterns

`executive_command_center`, `operations_control_board`, `manager_work_queue`, `specialist_workspace`, `case_inbox`, `project_workspace`, `dispatch_console`, `field_task_mobile`, `technician_workbench`, `customer_portal`, `supplier_portal`, `contractor_portal`, `member_portal`, `compliance_cockpit`, `security_posture_console`, `analytics_workspace`, `guided_onboarding`, `simple_frontline_home`

Each pattern documents target role archetypes, navigation density, widgets, actions, mobile suitability, complexity, alerts, and accessibility notes.

The same authorized role may receive different presentation based on device, workflow state, experience level, and operational context.
