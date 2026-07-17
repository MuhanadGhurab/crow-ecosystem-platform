# Canonical Lifecycle

| Field | Value |
|-------|-------|
| **Title** | Canonical Lifecycle |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | Competing lifecycle summaries in portal docs (link here instead) |
| **Related decisions** | [ADR-003](decisions/ADR-003-separate-request-discovery-blueprint-tenant-runtime-domains.md) |
| **Implementation state** | Stages exist at varying maturity — see [`CURRENT-STATE.md`](CURRENT-STATE.md) |

All homepage, Client Portal, ProCrow, commercial, tenant-build, runtime, and reporting projections **derive from** this lifecycle. Projections must not become competing definitions.

## Canonical lifecycle

```
Explore Crow
→ Choose Build New or Transform Existing
→ Create Account
→ Verify Email
→ Verify Mobile Phone
→ Accept Required Legal Terms
→ Submit Request
→ ProCrow Qualification
→ Discovery
→ Operating-Model Composition
→ Enterprise Blueprint Draft
→ ProCrow Review
→ Client Review
→ Blueprint Scope Freeze
→ Commercial Proposal
→ Commercial Agreement Acceptance
→ Initial Payment
→ Tenant Build
→ Readiness and Onboarding
→ Go-Live Approval
→ Go-Live
→ Monthly Tenant Subscription
→ Runtime
→ Continuous Improvement
```

## Stage authority notes

| Stage | Grants authority? |
|-------|-------------------|
| Create Account | No |
| Verify Email / Phone | Account control only — not membership or roles |
| Submit Request | No tenant, no client ownership |
| Discovery | No elevated authority |
| Blueprint Draft / Review | No runtime authority |
| Commercial Agreement / Payment | **No** roles or membership |
| Tenant Build | Membership and roles per approved blueprint + operator gates |
| Go-Live | Operational access per readiness approval |
| Runtime | Per authorized tenant role and Work Persona context |

## Public projections (derived, not canonical)

### Homepage simplified projection

```
Understand → Map → Design → Review → Build → Operate
```

### Detailed public gates

```
Request → Discovery → Blueprint → Build → Runtime
```

These are **presentational shortenings** of the canonical lifecycle.

## FTGP alignment

The First Tenant Golden Path charter (`docs/architecture/crow-core/first-tenant/`) aligns to this lifecycle with explicit operator gates. FTGP stage names may differ slightly but must map to canonical stages.

## Related documents

- [`00-CROW-CONSTITUTION.md`](00-CROW-CONSTITUTION.md)
- [`03-PORTALS-AND-OWNERSHIP.md`](03-PORTALS-AND-OWNERSHIP.md)
- [`FIRST_TENANT_GOLDEN_PATH_CHARTER.md`](../architecture/crow-core/first-tenant/FIRST_TENANT_GOLDEN_PATH_CHARTER.md)
