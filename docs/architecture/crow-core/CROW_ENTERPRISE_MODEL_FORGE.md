# Crow Enterprise Model Forge

**Status:** CURRENT — draft composition and UI; runtime compilation PLANNED

## Purpose

Transform CROW.TENANT.1 vocabulary into an **enterprise-model invention system** producing explainable, non-authoritative `EnterpriseModelDraft` artifacts.

```text
Field vocabulary + specialist domains + scale + topology + Work Personas
+ workflow network + KPI/audit/evidence + SAREA + CyberCrow
= Executable Enterprise Model Draft (advisory)
```

## Location

`src/lib/model-forge/` — composition via `composeEnterpriseModel()`

## ProCrow route

`/admin/model-forge` — PLATFORM_ADMIN only

## Rules

- No tenant provisioning
- No permission grants (`AuthorityProposal.authoritative: false`)
- No hosted writes
- Platform roles never in proposals
