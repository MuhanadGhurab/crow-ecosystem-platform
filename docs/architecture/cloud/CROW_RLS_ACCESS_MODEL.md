# Crow RLS Access Model

**Phase:** CLOUD.1B  
**Purpose:** Classify all live `public` tables for future RLS and grant design. **No policies applied in this task.**

---

## 1. Hosted posture (2026-06-21)

| Metric | Value |
|--------|------:|
| Live `public` tables (`pg_tables`) | **107** |
| RLS enabled, zero policies (C3 deny-by-default) | **10** |
| RLS disabled | **97** |
| Security Advisor `rls_disabled_in_public` (2026-06-18) | **97** |

The 107-table classification in `scripts/lib/cloud-table-classification.ts` covers every live hosted table. Pending `platform_internal_role_assignments` is documented separately in the FTGP migration (fail-closed DDL).

---

## 2. Access classes

| Class | Meaning | PostgREST default | Server (Prisma) |
|-------|---------|-------------------|-----------------|
| `SERVER_ONLY` | Internal authority / audit — no client API | Deny | Allow via app connection |
| `PROCROW_INTERNAL` | Platform operator data | Deny | Role-gated services |
| `CYBERCROW_INTERNAL` | SOC / security telemetry | Deny | Service-gated |
| `TENANT_SCOPED` | Tenant ERP runtime | Deny until tenant RLS | Membership predicate |
| `CLIENT_ORGANIZATION_SCOPED` | Client org portal | Deny until org RLS | Org membership |
| `REQUEST_OWNER` | Implementation request submitter | Deny until owner RLS | `submittedByUserId` |
| `AUTHENTICATED_SELF` | Platform account self rows | Deny (C3 REVOKE) | Account session |
| `REFERENCE_CONFIGURATION` | Plans, templates, sectors | Optional public read | Read-mostly |
| `PUBLIC_READ_ONLY` | Marketing-safe reference | Optional anon read | Server cache |
| `MIGRATION_INTERNAL` | `_prisma_migrations` | Deny | Operator only |
| `UNKNOWN` | Semantics unresolved | **Deny** | Review before expose |

---

## 3. Classification summary (107 tables)

| Class | Count |
|-------|------:|
| `TENANT_SCOPED` | 53 |
| `REQUEST_OWNER` | 15 |
| `CYBERCROW_INTERNAL` | 11 |
| `AUTHENTICATED_SELF` | 8 |
| `PROCROW_INTERNAL` | 8 |
| `REFERENCE_CONFIGURATION` | 5 |
| `CLIENT_ORGANIZATION_SCOPED` | 4 |
| `MIGRATION_INTERNAL` | 1 |
| `SERVER_ONLY` | 1 |
| `PUBLIC_READ_ONLY` | 1 |

Source of truth: `scripts/lib/cloud-table-classification.ts` (verified by `npm run cloud-data-api-dependency:audit`).

---

## 4. Security invariants

```text
platform_internal_role_assignments
→ anon: no access
→ authenticated: no direct access
→ browser metadata: no authority
→ trusted server/database service only
```

Authority resolution: `platform-internal-role.service.ts` via Prisma — never `supabase.from` or JWT `app_metadata` alone.

C3 legal/account tables: RLS enabled, grants revoked, **no policies** — intentional fail-closed for PostgREST.

---

## 5. Grant principle (target state)

```text
new public tables → no automatic anon/authenticated CRUD
new sequences     → no automatic anon/authenticated usage
new functions     → no automatic anon/authenticated execute
```

Proposed SQL: `proposed/cloud_public_schema_default_privileges_hardening.sql` — **not** in controlled pending inventory.

---

## 6. Long-term architecture

```text
private/internal schemas → not exposed

dedicated api schema
→ only intentionally exposed views/functions
→ explicit grants
→ RLS protected
```

---

## Related documents

- `CROW_RLS_ROLLOUT_PLAN.md`
- `CROW_DATA_API_DEPENDENCY_AUDIT.md`
- `CROW_SUPABASE_SECURITY_AUDIT.md`
