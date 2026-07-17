# Crow RLS Rollout Plan

**Phase:** CLOUD.1B (plan only)  
**Status:** Not executed — staged after emergency containment and staging isolation (Wave 2–3).

---

## 1. Rollout order

| Phase | Action | Environment |
|-------|--------|-------------|
| **0 — Emergency** | Remove `public` from Data API exposed schemas OR disable Data API | Production (Dashboard) |
| **1 — Default privileges** | Apply `cloud_public_schema_default_privileges_hardening.sql` (separate PO approval) | Staging → Production |
| **2 — Batch REVOKE** | Revoke anon/authenticated on existing 97 RLS-disabled tables | Staging proof → Production |
| **3 — RLS policies** | Enable RLS + policies per access class | Staging → Production |
| **4 — Optional api schema** | Expose views/functions only where client read required | Staging → Production |

**Do not** enable broad policies for `UNKNOWN` tables until semantics are resolved.

---

## 2. Policy batches (by access class)

### Batch 0 — Immediate deny (no policy needed)

- `SERVER_ONLY`, `PROCROW_INTERNAL`, `CYBERCROW_INTERNAL`
- `platform_internal_role_assignments` (FTGP migration DDL)
- C3 tables (already RLS + REVOKE)

### Batch 1 — Tenant scoped

Tables: 53 `TENANT_SCOPED` entries (e.g. `tenants`, `tenant_memberships`, `tenant_finance_entries`).

Predicate pattern (staging design):

```text
tenant_id IN (SELECT tenant_id FROM tenant_memberships WHERE platform_account_id = auth.uid() …)
```

**Note:** Crow uses Supabase Auth UUID mapped to `platform_accounts` — policies must use server-verified identity bridge, not raw metadata. Prefer **no PostgREST** until bridge views exist.

### Batch 2 — Request owner

15 tables tied to `implementation_requests` / submitter ownership.

### Batch 3 — Client organization

4 tables — org membership predicate.

### Batch 4 — Authenticated self

8 C3/platform account tables — self-row access only if client-side read ever required (currently server-only).

### Batch 5 — Reference / public read

6 tables — optional anon read for marketing-safe reference data only.

---

## 3. Testing gates per batch

- `npm run cloud-data-api-dependency:audit` — zero new business dependencies
- `npm run cloud-rls-emergency:test` — fail-closed invariants
- Staging PostgREST probe — deny by default
- Tenant cross-access negative tests
- Request-owner boundary tests
- `/account` requester smoke

---

## 4. Dependencies

| Prerequisite | Reason |
|--------------|--------|
| Persistent staging DB (Wave 2) | Avoid policy experiments on Production Preview |
| Data API containment (Phase 0) | Reduce live exposure during REVOKE rollout |
| Backup / PITR evidence | Rollback for grant mistakes |
| FTGP migration fail-closed apply | Internal authority table must not inherit default grants |

---

## 5. Explicit boundary

CLOUD.1B **did not** create RLS policies or apply REVOKE on hosted Production. This document is the staged plan only.

---

## Related documents

- `CROW_RLS_ACCESS_MODEL.md`
- `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`
- `CROW_CLOUD_FEATURE_ENABLEMENT_MATRIX.md`
