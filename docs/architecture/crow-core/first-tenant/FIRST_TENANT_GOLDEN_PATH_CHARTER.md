# First Tenant Golden Path — Phase Charter

**Branch:** `feat/first-tenant-golden-path`  
**Integration base:** `feat/c2-2-database-isolation-migration-control` (post C3 merge)  
**Status:** Charter only — tenant provisioning not started

## Purpose

Define the controlled lifecycle for Crow’s **first real tenant** on the shared hosted backend, starting from the **certified retained requester** without automatically granting client role, tenant membership, or tenant-admin authority.

## Constitutional constraints

- Retained requester remains `ACTIVE_GOOGLE_REQUESTER` / `CONTROLLED_RETAINED_REQUESTER` until explicit assignment gates pass.
- No automatic `crow_role`, Client Portal authority, TenantMembership, or ProCrow access from registration or onboarding alone.
- Hosted Legal **v1.0** remains current; Legal **v1.1** publication gates stay closed until separately authorized.
- No Production deploy or `main` integration without operator authorization.
- Database mutations on shared hosted Postgres follow C2 controlled-migration workflow only.

## Golden Path lifecycle

```
Requester
  → Implementation Request
  → ProCrow Review
  → Discovery
  → Enterprise Blueprint
  → Pricing Intelligence
  → Client Approval
  → Tenant Build
  → Explicit Tenant Admin Assignment
  → CyberCrow Security Init
  → SAREA Init
  → Go-Live
```

Each stage requires traceability evidence and human approval before the next stage opens.

## Stage definitions (initial)

| Stage | Outcome | Authority gate |
|-------|---------|----------------|
| **Requester** | Certified platform account with legal v1.0 acceptance; no tenant scope | C3 retention (complete) |
| **Implementation Request** | Structured intake linked to platform account | Requester submit + validation |
| **ProCrow Review** | Operator accepts/rejects intake | Platform console operator |
| **Discovery** | Evidence captured under request | ProCrow-approved scope |
| **Enterprise Blueprint** | Versioned blueprint with commercial slices | Blueprint approval |
| **Pricing Intelligence** | Advisory ROI/pricing artifacts | Finance/product review |
| **Client Approval** | Client-side acceptance of commercial terms | Explicit client sign-off |
| **Tenant Build** | Tenant runtime provisioned from approved blueprint | Controlled migration + build workflow |
| **Explicit Tenant Admin Assignment** | Named tenant admin membership created | Operator assignment only |
| **CyberCrow Security Init** | Baseline signals and evidence expectations seeded | Security operator review |
| **SAREA Init** | Experience mappings composed (no permission grants) | ProCrow configuration release |
| **Go-Live** | Tenant runtime active under approved blueprint version | Go/no-go operator decision |

## Explicit non-goals (this phase)

- Auto-promoting the retained requester to client or tenant admin.
- Publishing Legal v1.1.
- Merging integration branches to `main` or promoting Production.
- Live Saudi government integrations.
- Autonomous AI approval of commercial or security changes.

## Entry criteria for implementation work

1. C3 closed on integration branch with post-merge verifier suite green.
2. Retained requester verification passing (`c3-10j:preserved-identity:verify`).
3. Operator assigns first-tenant scope (organization name, blueprint seed, admin candidate).
4. Preview/staging evidence path defined before any shared-database tenant mutation.

## Related documents

- `docs/architecture/crow-core/c3/30-C3-ACCOUNT-REGISTRATION-VERIFICATION.md`
- `docs/architecture/crow-core/c2/C2_2_CONTROLLED_MIGRATION_DELIVERY.md`
- `docs/architecture/crow-core/02-ENTERPRISE-BLUEPRINT-COMMERCIAL-INTELLIGENCE.md`
- `docs/architecture/crow-core/13-CURRENT-TO-TARGET-TRANSITION-MAP.md`
