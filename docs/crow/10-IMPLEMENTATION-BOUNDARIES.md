# Implementation Boundaries

| Field | Value |
|-------|-------|
| **Title** | Implementation Boundaries |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | — |
| **Related decisions** | All ADRs in [`decisions/`](decisions/) |
| **Implementation state** | Active guardrails |

## Documentation-only milestone boundaries

Unless an explicit milestone authorizes otherwise, agents must **not**:

| Domain | Prohibited without authorization |
|--------|----------------------------------|
| Payments | Implement processing, connect provider, recurring billing |
| Database | Create entities, apply migrations on hosted Postgres |
| Auth | Modify authentication or authorization behavior |
| Membership | Modify tenant membership or provisioning |
| Request | Modify Request behavior or side effects |
| Discovery | Modify Discovery behavior |
| Blueprint | Modify Blueprint compilation or approval gates |
| ProCrow | Modify operator authority guards |
| Runtime | Modify CEM runtime behavior |
| CyberCrow | Modify authority enforcement |
| SAREA | Modify presentation-to-permission boundaries |
| CroAI | Implement runtime |
| Public | Create/change public pages, navigation, redirects |
| Story | Remove scroll-story experiment |
| Deploy | Production deploy, merge PR #10, push `main` |
| Hosted | Create business records, modify hosted data |
| Browser | Launch Chrome, Playwright, OAuth flows for certification |

## Always protected

- Payment ≠ authority coupling
- SAREA ≠ authority coupling
- CroAI ≠ authority coupling
- Tenant isolation
- Audit history integrity
- Controlled migration workflow for shared hosted database

## Shared database risk

Preview and Production may share hosted Postgres backend. All hosted mutations require controlled-migration workflow. See `docs/architecture/crow-core/c2/`.

## Certification environment

FTGP certification environment on Vercel — changes require explicit authorization. Live Production must remain unchanged unless owner authorizes promotion separately.

## Related documents

- [`AGENTS.md`](../../AGENTS.md)
- [`10-IMPLEMENTATION-BOUNDARIES.md`](10-IMPLEMENTATION-BOUNDARIES.md) — this document
- [`11-DEVELOPMENT-OPERATING-MODEL.md`](11-DEVELOPMENT-OPERATING-MODEL.md)
