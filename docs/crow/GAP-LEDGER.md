# Crow Gap Ledger

| Field | Value |
|-------|-------|
| **Title** | Design–Implementation Gap Ledger |
| **Status** | CANONICAL |
| **Authority** | CROW.GOVERNANCE.1 reconciliation |
| **Last reviewed** | 2026-07-18 (CROW.DISCOVERY.5) |
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
| **Current state** | PR #14 merged; `main` @ `e8cb812` has accepted public + safe `vercel.json`; auto deploy `dpl_8xT92…` accepted; live URL on `dpl_QeDhnxz…`; Production deployment policy documented ([`16-PRODUCTION-DEPLOYMENT-POLICY.md`](16-PRODUCTION-DEPLOYMENT-POLICY.md)) — Option C interim; Option B settings not applied |
| **Severity** | **Low** |
| **Security/authority impact** | Medium if `main` merges proceed without owner authorization while auto Production-target creation remains on |
| **Dependency** | Owner Option B settings decision; optional Instant Promote — [`CROW-PROD-POLICY-1.md`](milestones/CROW-PROD-POLICY-1.md) |
| **Proposed milestone** | CROW.PROD-POLICY.1 complete; CROW.PROD-POLICY.2 for settings application if authorized |
| **Owner decision required** | Apply Option B in Vercel? Instant Promote `dpl_8xT92…`? |
| **Status** | **Mitigated** — git + artifact + written policy; settings gate tracked in GAP-015 |

## GAP-015 — Production auto-deploy settings gate

| Field | Value |
|-------|-------|
| **Domain** | Operations / Release |
| **Intended state** | Main→Production auto-deploys disabled or gated (Option B), or explicitly retained under Option C discipline |
| **Current state** | Policy documents Option C interim; Vercel settings unchanged; merges to `main` still create Production-target artifacts |
| **Severity** | Medium |
| **Security/authority impact** | Medium — accidental Production-target creation without Instant Promote still creates operator confusion |
| **Dependency** | Owner authorization to change Vercel Git/Production settings |
| **Proposed milestone** | CROW.PROD-POLICY.2 (settings application only) |
| **Owner decision required** | Enable Option B settings? Keep Option C only? |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) |
| **Status** | **Open** |

## GAP-004 — Preview/Production database isolation

| Field | Value |
|-------|-------|
| **Domain** | Database / Operations |
| **Intended state** | Isolated Preview and Production Postgres backends |
| **Current state** | **CROW.GAP004.1 audit+plan prepared.** Engineering: build-time migrate removed (C2.2). Isolation **not proven** — historical C2.1 shared ref `wbwnsndcxrgyqwppurms`; shared-backend mode still documented for Preview work |
| **Severity** | **High** |
| **Security/authority impact** | Medium–High — Preview/runtime/operator writes can hit Production while shared; migrate-on-build mitigated |
| **Dependency** | Dedicated Preview Supabase provisioning + Vercel Preview env bind (owner dashboard) |
| **Proposed milestone** | Owner executes Phase 1–4 of [`gaps/GAP-004-DB-ISOLATION-PLAN.md`](gaps/GAP-004-DB-ISOLATION-PLAN.md); then re-certify |
| **Owner decision required** | Provision Preview DB; bind Preview env; end shared as normal; authorize Preview controlled migrate after proof |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) · [`milestones/CROW-GAP004-1.md`](milestones/CROW-GAP004-1.md) · [`gaps/GAP-004-DB-ISOLATION-AUDIT.md`](gaps/GAP-004-DB-ISOLATION-AUDIT.md) |
| **Status** | **Open / blocked** — audit complete; isolation implementation pending |

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
| **Current state** | **Mitigated in CROW.REQUEST.2** — `journeyKind` persisted on request brief notes JSON; wizard captures NEW/TRANSFORM; no migration |
| **Severity** | Low |
| **Security/authority impact** | None |
| **Dependency** | — |
| **Proposed milestone** | CROW.REQUEST.2 |
| **Owner decision required** | No |
| **Tracking** | Issue [#17](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/17) · [`milestones/CROW-REQUEST-2.md`](milestones/CROW-REQUEST-2.md) |
| **Status** | **Mitigated** |

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
| **Current state** | **CROW.PM.2 executed** — labels, Phase 0–12 milestones, Project #2, seed Issues #15–#24; Project **views** still manual UI residual |
| **Severity** | Low (process) |
| **Security/authority impact** | None |
| **Dependency** | Owner creates suggested views in Project UI |
| **Proposed milestone** | CROW.PM.2 (complete); views = owner residual |
| **Owner decision required** | Create suggested Project views; triage #15/#16 |
| **Status** | **Mitigated** — core system created; views pending |

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

## GAP-016 — ProCrow qualification persistence vs product vocabulary

| Field | Value |
|-------|-------|
| **Domain** | ProCrow / Request |
| **Intended state** | Full product qualification vocabulary available to operators and clients |
| **Current state** | **Mitigated locally in CROW.PROCROW.1** — outcomes in brief `procrowQualification`; DB enum unchanged; Discovery gated. **CROW.PROCROW.1A** pushed to origin @ `cecd450` |
| **Severity** | Low |
| **Security/authority impact** | None when product-layer only (current) |
| **Dependency** | Optional future enum migration (not preferred) |
| **Proposed milestone** | CROW.PROCROW.1 (local complete) · CROW.PROCROW.1A (pushed); hosted certify after GAP-004 |
| **Owner decision required** | Whether to ever migrate DB enums vs keep product-layer mapping |
| **Tracking** | Issue [#19](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/19) · [`milestones/CROW-PROCROW-1.md`](milestones/CROW-PROCROW-1.md) · [`milestones/CROW-PROCROW-1A.md`](milestones/CROW-PROCROW-1A.md) |
| **Status** | **Mitigated** (local-first · origin-baselined); hosted certify deferred |

## GAP-017 — Discovery field depth vs dual sparse intake paths

| Field | Value |
|-------|-------|
| **Domain** | Discovery / Operating Model |
| **Intended state** | Adaptive enterprise field system (layers L1–L10) with progressive disclosure, Blueprint mapping, ProCrow review |
| **Current state** | Architecture @ `e90fcda`. **CROW.DISCOVERY.2–6** local-first through Blueprint handoff package (`readyForBlueprintHandoff` possible; draft/generation still blocked). Still open: Stages 4–7 field depth, dual client tracks, hosted persistence, owner-authorized Blueprint drafting |
| **Severity** | Medium |
| **Security/authority impact** | Low if authority non-claims preserved (D0–D6 tests; `readyForBlueprintDraft` / `blueprintGenerationAllowed` false) |
| **Dependency** | GAP-004 before hosted certify / migrations; owner gate before Blueprint drafting |
| **Proposed milestone** | Future Blueprint drafting (owner-gated) · Stages 4–7 depth · client-track unify |
| **Owner decision required** | Accept D0–D6 local-first (MVP-CERT.1 wording); hosted persistence after GAP-004; client-track unify; when to allow Blueprint drafting / complete override |
| **Tracking** | Issue [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) · [`milestones/CROW-DISCOVERY-MVP-CERT-1.md`](milestones/CROW-DISCOVERY-MVP-CERT-1.md) · [`discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md) |
| **Status** | **Partial** — D0–D6 local-first implemented + cert package prepared; owner acceptance / hosted / depth / drafting remain |

## GAP-018 — PR #10 breadth vs safe merge to main

| Field | Value |
|-------|-------|
| **Domain** | Delivery / Release |
| **Intended state** | FTGP work lands via small, reviewable PRs; `main` stays Production-safe |
| **Current state** | **Owner accepted CROW.PR10.2** — PR #10 is draft archive/reference; Option D+B slice rules baselined. Conflicts remain unresolved by design. No GitHub Issue yet — tracked here until owner requests one |
| **Severity** | High if someone merges monolith; **policy mitigates** |
| **Security/authority impact** | High if merged wholesale; low while DRAFT archive discipline holds |
| **Dependency** | Slice execution; GAP-004 before hosted/runtime; GAP-015 for Production auto-deploy |
| **Proposed milestone** | Slice execution (Discovery D0–D2 done; next D3 / GAP-004 / GAP-015, …) |
| **Owner decision required** | Next slice to authorize; optional GitHub Issue for GAP-018 / CROW.PR10.1 |
| **Tracking** | PR [#10](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/10) · [`milestones/CROW-PR10-2.md`](milestones/CROW-PR10-2.md) · [`pr10/PR10-ARCHIVE-AND-SLICE-RULE.md`](pr10/PR10-ARCHIVE-AND-SLICE-RULE.md) · ledger only (no Issue yet) |
| **Status** | **Mitigated (policy)** — archive + slice rule accepted; Discovery D0–D6 slices executed; further slices / GAP-004 pending |
