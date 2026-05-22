# Crow Ecosystem — Architecture domains (01–10)

This document maps the **ten orchestration engines** to the current `src/` layout and states **future intent** for gradual refactors. It is descriptive, not a mandate to move files immediately.

**Team:** Muhanad implements platform + CyberCrow + CEM in this repo; MEEM (Omar) validates SAREA on customer tenants only — [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md).

**Canonical vision (founder diagram):** [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md) · **Execution:** [`PHASES.md`](PHASES.md) · [`MILESTONES.md`](MILESTONES.md)

| # | Domain | Role | Primary `src/` paths today | Future intent |
|---|--------|------|-----------------------------|---------------|
| 01 | Client Engagement | Intake, qualification, public narrative | `src/app/(public)/`, especially `request/`, marketing shells | Consolidate public journey, CMS hooks, and analytics |
| 02 | Discovery Engine | Structured organizational intelligence | `src/app/discovery/[requestId]/`, `src/app/admin/discovery/` | Richer validation UX, template libraries, exports |
| 03 | Enterprise Blueprint | Digital DNA & tenant definition | `src/app/blueprints/[blueprintId]/`, Prisma blueprint models | Versioning, diff, approval workflows |
| 04 | Pricing Intelligence | Plans, modules, commercial alignment | `src/app/(public)/pricing/`, subscription constants | Quote builder, approval gates, SAR bands |
| 05 | Tenant Provisioning | CEM tenant materialization | `src/app/admin/tenants/`, `src/app/[tenant]/` | Automated rollout checks, health dashboards |
| 06 | CyberCrow Security | Trust, RBAC, audit, compliance | `src/app/[tenant]/cybercrow/`, `src/app/(public)/security/` | Policy packs, SIEM hooks, continuous controls |
| 07 | SAREA Experience | Adaptive role UX | `src/app/sarea/`, SAREA-related tenant surfaces | Design system tokens, widget marketplace |
| 08 | Identity & Access | Sessions, roles, coherence | `src/app/[tenant]/cybercrow/identity/`, discovery identity steps | SSO, SCIM, privileged access patterns |
| 09 | CEM Operations | Core ERP-style execution | `src/app/[tenant]/*` operational modules | Deep vertical modules, localization |
| 10 | Enterprise Operations | Platform admin & governance | `src/app/admin/*` | Cross-tenant observability, billing ops |

Shared cross-cutting code today lives under `src/lib/`, `src/components/`, and `prisma/schema.prisma`. Constants such as `PLATFORM_ENGINES` in `src/lib/constants/platform.ts` mirror this list for UI and docs.
