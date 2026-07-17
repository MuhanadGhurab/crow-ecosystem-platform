# Crow Gap Ledger

| Field | Value |
|-------|-------|
| **Title** | Design–Implementation Gap Ledger |
| **Status** | CANONICAL |
| **Authority** | CROW.GOVERNANCE.1 reconciliation |
| **Last reviewed** | 2026-07-17 (CROW.PUBLIC.RECON.3) |
| **Supersedes** | — |
| **Related decisions** | — |
| **Implementation state** | Living document |

## GAP-001 — Commercial domain vs Stripe scaffold

| Field | Value |
|-------|-------|
| **Domain** | Commercial / Payments |
| **Intended state** | Provider-independent commercial instruments and state machine per [`06-COMMERCIAL-AND-PAYMENTS.md`](06-COMMERCIAL-AND-PAYMENTS.md) |
| **Current state** | `TenantSubscription` with Stripe IDs; checkout/webhook scaffold; no full instrument model |
| **Severity** | Medium |
| **Security/authority impact** | Low if payment≠authority preserved (currently preserved in code policy) |
| **Dependency** | CROW.COMMERCIAL.* milestones |
| **Proposed milestone** | CROW.COMMERCIAL.1 |
| **Owner decision required** | Payment provider priority (Stripe vs Saudi PSP) |
| **Status** | Open |

## GAP-002 — CroAI constitution vs implementation

| Field | Value |
|-------|-------|
| **Domain** | CroAI |
| **Intended state** | Tenant-scoped advisory intelligence per [`08-CROAI-CONSTITUTION.md`](08-CROAI-CONSTITUTION.md) |
| **Current state** | No CroAI runtime; C0 "Crow Intelligence" concept only |
| **Severity** | Low (planned capability) |
| **Security/authority impact** | None until implementation |
| **Dependency** | Runtime maturity, entitlement model |
| **Proposed milestone** | CROW.CROAI.1 |
| **Owner decision required** | AI provider selection (deferred) |
| **Status** | Open |

## GAP-003 — Approved public experience vs Production homepage

| Field | Value |
|-------|-------|
| **Domain** | Public experience |
| **Intended state** | Seven-section approved structure per [`09-PUBLIC-EXPERIENCE.md`](09-PUBLIC-EXPERIENCE.md) |
| **Current state** | **DEPLOYED to Production** (CROW.PUBLIC.PROD, `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz`, 2026-07-07) |
| **Severity** | Resolved on Production |
| **Security/authority impact** | Public browse on Production matches certification; client-process gates unchanged |
| **Dependency** | — |
| **Proposed milestone** | — |
| **Owner decision required** | — |
| **Status** | **Closed** — Production serves accepted experience |

## GAP-011 — Public experience Production promotion

| Field | Value |
|-------|-------|
| **Domain** | Public experience / Operations |
| **Intended state** | Production serves the owner-accepted semi-dark public experience (CROW.PUBLIC.9) |
| **Current state** | **Deployed** — Production `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` from `33e48f5` (2026-07-07) |
| **Severity** | Resolved |
| **Security/authority impact** | UI/static promotion only; no migration or hosted writes |
| **Dependency** | PR #10 merge remains separate |
| **Proposed milestone** | — |
| **Owner decision required** | — |
| **Status** | **Closed** |

## GAP-012 — Production vs `main` branch reconciliation

| Field | Value |
|-------|-------|
| **Domain** | Public experience / Operations |
| **Intended state** | `main` reflects Production public UI; safe deploy path from `main` |
| **Current state** | Draft PR [#14](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/14) open; Preview smoke passed; Production still feature-branch deploy (`33e48f5`); `main` @ `18237d1` still has legacy public until #14 merges |
| **Severity** | **High** until #14 merges and Production can safely come from `main` |
| **Security/authority impact** | Medium if FTGP merged without review; High if migrations run from legacy `main` build |
| **Dependency** | Owner merge authorization for #14 + separate Production auth — [`CROW-PUBLIC-RECON-3.md`](milestones/CROW-PUBLIC-RECON-3.md) |
| **Proposed milestone** | CROW.PUBLIC.RECON.3 complete (draft PR + smoke); merge/promote pending |
| **Owner decision required** | Preview UAT · merge #14 · Production promote separately |
| **Status** | **Open** — draft PR + Preview smoke green; not merged |

## GAP-004 — Preview/Production database isolation

| Field | Value |
|-------|-------|
| **Domain** | Database / Operations |
| **Intended state** | Isolated Preview and Production Postgres backends |
| **Current state** | C2.1 BLOCKED — fingerprint match on shared Supabase project |
| **Severity** | **High** |
| **Security/authority impact** | Medium — migration and data bleed risk |
| **Dependency** | Dedicated Preview Supabase provisioning |
| **Proposed milestone** | Infrastructure owner decision |
| **Owner decision required** | Provision separate Preview database |
| **Status** | Open — blocker |

## GAP-005 — First Tenant Golden Path completion

| Field | Value |
|-------|-------|
| **Domain** | Tenant / FTGP |
| **Intended state** | Full canonical lifecycle for first real tenant per charter |
| **Current state** | FTGP authority foundation, request review, discovery shell in progress on PR #10 branch |
| **Severity** | High |
| **Security/authority impact** | High — authority gates must hold |
| **Dependency** | GAP-004, platform admin bootstrap |
| **Proposed milestone** | FTGP continuation on `feat/first-tenant-golden-path` |
| **Owner decision required** | First client designation, merge PR #10 timing |
| **Status** | Open |

## GAP-006 — Runtime My-* workspace model

| Field | Value |
|-------|-------|
| **Domain** | Enterprise Runtime |
| **Intended state** | My Attention, My Work, My Decisions, My Evidence, My Outcomes |
| **Current state** | Module-centric tenant pages (HR, finance, CRM, etc.) |
| **Severity** | Medium |
| **Security/authority impact** | Low |
| **Dependency** | SAREA mapping, CEM handoff |
| **Proposed milestone** | CROW.RUNTIME.1 |
| **Owner decision required** | No |
| **Status** | Open |

## GAP-007 — Entitlement versioning model

| Field | Value |
|-------|-------|
| **Domain** | Subscription / Entitlements |
| **Intended state** | Versioned, auditable entitlements per [`07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md`](07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md) |
| **Current state** | `SubscriptionPlan` + `TenantSubscription` only |
| **Severity** | Medium |
| **Security/authority impact** | Medium — must not conflate with roles |
| **Dependency** | Commercial domain |
| **Proposed milestone** | CROW.SUBSCRIPTION.1 |
| **Owner decision required** | Entitlement schema design |
| **Status** | Open |

## GAP-008 — JourneyKind vs public entry paths

| Field | Value |
|-------|-------|
| **Domain** | Request / Public |
| **Intended state** | Explicit `JourneyKind` (NEW/TRANSFORM) separate from `OrganizationContext` |
| **Current state** | `OrganizationContext` in request types; `JourneyKind` in crow-story/public-v2 types — not unified in request wizard UI |
| **Severity** | Low |
| **Security/authority impact** | None |
| **Dependency** | Public v2, Request UX |
| **Proposed milestone** | CROW.REQUEST.1 |
| **Owner decision required** | No |
| **Status** | Open |

## GAP-009 — Milestone ledger as AI truth source

| Field | Value |
|-------|-------|
| **Domain** | Governance |
| **Intended state** | `docs/crow/` canonical layer is durable AI truth |
| **Current state** | `docs/internal/MILESTONES.md` has historical percentages and "passed" claims without current evidence |
| **Severity** | Medium |
| **Security/authority impact** | Low — AI confusion risk |
| **Dependency** | CROW.GOVERNANCE.1 (this milestone) |
| **Proposed milestone** | Resolved by canonical index; historical doc preserved |
| **Owner decision required** | No |
| **Status** | **Mitigated** — use `docs/crow/CURRENT-STATE.md` |

## GAP-010 — Saudi government integrations

| Field | Value |
|-------|-------|
| **Domain** | Identity / Integrations |
| **Intended state** | Nafath, Absher, GOSI where officially supported |
| **Current state** | Documented as planned only |
| **Severity** | Low |
| **Security/authority impact** | High when implemented — assurance only |
| **Dependency** | Official API availability, regulatory review |
| **Proposed milestone** | Future integration milestone |
| **Owner decision required** | Integration priority and official partnerships |
| **Status** | Open — deferred |

## GAP-013 — GitHub delivery system not yet applied

| Field | Value |
|-------|-------|
| **Domain** | Governance / Project management |
| **Intended state** | Labels, Projects views, and seed backlog per [`14-DELIVERY-BACKLOG-MODEL.md`](14-DELIVERY-BACKLOG-MODEL.md) and [`15-GITHUB-PROJECTS-SETUP-PLAN.md`](15-GITHUB-PROJECTS-SETUP-PLAN.md) |
| **Current state** | Canonical PM docs exist (CROW.PM.1); GitHub Issues/Projects/labels **not created** (by design) |
| **Severity** | Low (process) |
| **Security/authority impact** | None |
| **Dependency** | Owner authorization for CROW.PM.2 |
| **Proposed milestone** | CROW.PM.2 |
| **Owner decision required** | Approve labels, project visibility, and seed Issues |
| **Status** | Open — waiting on owner |

## GAP-014 — Portfolio repos require Crow-theme discipline

| Field | Value |
|-------|-------|
| **Domain** | Portfolio / Program focus |
| **Intended state** | Each public portfolio asset maps to a Crow proof theme or is explicitly deferred |
| **Current state** | Multiple public portfolio repos live (lab, mini projects, SecureSkies public, delivery office, GRC, resilience portfolio); private templates remain private |
| **Severity** | Low–Medium (attention fragmentation risk) |
| **Security/authority impact** | Privacy risk if private sources published |
| **Dependency** | Phase 12 packaging; owner ownership reviews for deferred ideas |
| **Proposed milestone** | Ongoing Kanban + CROW.PORTFOLIO.* when authorized |
| **Owner decision required** | Which deferred ideas (SecSky productization, robotics, desktop) stay deferred |
| **Status** | Open |
