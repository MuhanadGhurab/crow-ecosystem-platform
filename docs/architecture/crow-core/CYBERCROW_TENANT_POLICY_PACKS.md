# CyberCrow Tenant Policy Packs

**Status:** PARTIAL — pack catalog CURRENT; tenant entitlement wiring PLANNED.

## Location

`src/lib/tenant-composition/cybercrow-policy-catalog.ts`

## Rule

CyberCrow Shield, Sentinel, and Fortress are **tenant-scoped entitlement bundles**. They are not separate users, tenants, or autonomous SOC/SIEM systems.

## Packs

`baseline_identity_trust`, `privileged_access`, `financial_approval_protection`, `sensitive_hr_data`, `customer_data_protection`, `field_device_trust`, `vendor_access`, `contractor_access`, `external_portal_protection`, `high_risk_workflow_approval`, `audit_and_evidence`, `incident_escalation`, `data_export_control`, `branch_access_control`, `session_risk`

Each pack defines purpose, applicable capabilities, protected resources, trust signals, audit requirements, and recommended entitlement tier.

Platform-level CyberCrow remains ProCrow-managed; tenant posture is managed by authorized tenant security administrators.
