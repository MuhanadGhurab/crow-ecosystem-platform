# Crow Gap Ledger

| Field | Value |
|-------|-------|
| **Title** | Design–Implementation Gap Ledger |
| **Status** | CANONICAL |
| **Authority** | CROW.GOVERNANCE.1 reconciliation |
| **Last reviewed** | 2026-07-04 |
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

## GAP-003 — Approved public homepage vs current homepage

| Field | Value |
|-------|-------|
| **Domain** | Public experience |
| **Intended state** | Seven-section approved structure per [`09-PUBLIC-EXPERIENCE.md`](09-PUBLIC-EXPERIENCE.md) |
| **Current state** | CROW.PUBLIC.2 — bright canonical surface on **feature branch** at `/` and canonical routes; certification deployed; **Production `/` unchanged** |
| **Severity** | Low on branch; Medium until Production promotion |
| **Security/authority impact** | None — static representative data; journey handoff is URL-only |
| **Dependency** | Owner visual acceptance (CROW.PUBLIC.2) |
| **Proposed milestone** | CROW.PUBLIC.PROD — Production promotion (explicit authorization only) |
| **Owner decision required** | Visual acceptance of full public redesign on certification |
| **Status** | Partial — implemented on branch; awaiting owner acceptance |

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
