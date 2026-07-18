# Crow Gap Ledger

| Field | Value |
|-------|-------|
| **Title** | Design–Implementation Gap Ledger |
| **Status** | CANONICAL |
| **Authority** | CROW.GOVERNANCE.1 reconciliation |
| **Last reviewed** | 2026-07-18 (CROW.DEVFLOW.4) |
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
| **Intended state** | Option E: Vercel gate + GitHub protection + deploy guard + owner phrases |
| **Current state** | Guard on `main` @ `f97a835`. Ignored Build Step + unauthorized skip proven. GitHub `main` protected. Authorized deploy procedure **owner-accepted** (CROW.GAP015.ACCEPT.1). Live domain still `dpl_QeDhnxz…`. Intentional Production still requires separate `CROW.PRODUCTION.DEPLOY` |
| **Severity** | Medium (mitigated) |
| **Security/authority impact** | Controlled — Option E live; Production builds SHA-bound; Instant Promote separate |
| **Dependency** | None for mitigation; actual deploys need `CROW.PRODUCTION.DEPLOY` |
| **Proposed milestone** | None — mitigated; optional Option B later |
| **Owner decision required** | None for GAP-015 mitigation; use `CROW.PRODUCTION.DEPLOY` for any real Production build |
| **Tracking** | Issue [#15](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/15) · [`milestones/CROW-GAP015-ACCEPT-1.md`](milestones/CROW-GAP015-ACCEPT-1.md) · [`gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md`](gaps/GAP-015-AUTHORIZED-PRODUCTION-DEPLOY-PROCEDURE.md) |
| **Status** | **Mitigated** — does **not** authorize any Production deploy by itself |

## GAP-004 — Preview/Production database isolation

| Field | Value |
|-------|-------|
| **Domain** | Database / Operations / Commercialization |
| **Intended state** | Isolated Preview and Production Postgres backends **before commercial production** |
| **Current state** | Isolation **not proven**. **Reclassified (CROW.DEVFLOW.1):** future commercialization / production-readiness gate — **not** an alpha-dev blocker under demo-data rules. **GAP-004A** standing fail-closed mitigation remains. Known Production ref `wbwnsndcxrgyqwppurms` |
| **Severity** | **High** for commercial go-live; **does not block** alpha/demo development |
| **Security/authority impact** | Blocks commercial Production claims, real customer data, production-safe hosted persistence, official tenant go-live — until proven or separately authorized |
| **Dependency** | GAP-004A standing mitigation; Alpha Mode docs [`development/CROW-ALPHA-DEVELOPMENT-MODE.md`](development/CROW-ALPHA-DEVELOPMENT-MODE.md) |
| **Proposed milestone** | Future isolation at commercialization; alpha demo persistence after DEVFLOW.4 guard |
| **Owner decision required** | When to fund/prove isolation for commercial Production; until then Alpha Mode risk accepted |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) · [`milestones/CROW-DEVFLOW-1.md`](milestones/CROW-DEVFLOW-1.md) · [`gaps/GAP-004-DB-ISOLATION-PLAN.md`](gaps/GAP-004-DB-ISOLATION-PLAN.md) |
| **Status** | **Open — future commercial / production-readiness gate** (isolation unproven; alpha/demo allowed under policy) |

## GAP-004A — Preview DB-disabled safety mode

| Field | Value |
|-------|-------|
| **Domain** | Database / Operations / Preview safety |
| **Intended state** | When `VERCEL_ENV=preview` and isolation unproven: no DB read/write, no migrations, no hosted business mutations; public/local-first UI only |
| **Current state** | **Owner accepted** standing no-cost mitigation (CROW.GAP004A.ACCEPT.1) · ALT2 fail-closed implemented · **CROW.DEVFLOW.4** runtime gate + demo-write guard implemented · domain persistence **not** wired · Preview DB-disabled **unchanged** (`ALPHA_DEMO_BACKEND_ENABLED_IN_APP_COUNT=0`) |
| **Severity** | High (mitigation for GAP-004 under cost constraint) |
| **Security/authority impact** | Fail-closed on unsafe Preview — **accepted**; future alpha demo-backend must keep commercial gates blocked |
| **Dependency** | Owner acceptance 2026-07-18 · Alpha Mode [`development/CROW-ALPHA-DEVELOPMENT-MODE.md`](development/CROW-ALPHA-DEVELOPMENT-MODE.md) |
| **Proposed milestone** | Limited demo persistence (owner-gated) · optional ALT3/ALT4 · future isolation at commercialization |
| **Owner decision required** | Authorize persistence slice separately; do not treat gate alone as DB enablement |
| **Tracking** | Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) · [`milestones/CROW-DEVFLOW-4.md`](milestones/CROW-DEVFLOW-4.md) · [`development/CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md`](development/CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md) · [`gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md) |
| **Status** | **Accepted standing mitigation** — DEVFLOW.4 gate/guard ready; fail-closed DB until persistence slice · Issue #16 stays open |

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
| **Current state** | Architecture @ `e90fcda`. **CROW.DISCOVERY.2–7** local-first D0–D7 **owner-accepted**. Under **Alpha Mode**: local-first + Preview review continue. DEVFLOW.4 gate/guard ready; Discovery demo persistence **still future**. Production-safe hosted persistence still blocked (GAP-004 commercial gate) |
| **Severity** | Medium |
| **Security/authority impact** | Low if authority non-claims preserved (D0–D7 tests; `readyForBlueprintDraft` / `blueprintGenerationAllowed` false) |
| **Dependency** | GAP-004 before **commercial** hosted certify; owner-gated persistence slice before demo hosted writes; owner gate before Blueprint drafting |
| **Proposed milestone** | CROW.DISCOVERY.TRACKS.1 · demo persistence after DEVFLOW.4 guard · Blueprint drafting (owner-gated) |
| **Owner decision required** | Dual-track unify; when to enable demo-backend persistence vs commercial hosted; Blueprint drafting |
| **Tracking** | Issue [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) · [`milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md`](milestones/CROW-DISCOVERY-LOCAL-FIRST-ACCEPT-1.md) · [`discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md) |
| **Status** | **Partial** — local-first D0–D7 depth **accepted**; hosted / dual-track / drafting remain |

## GAP-018 — PR #10 breadth vs safe merge to main

| Field | Value |
|-------|-------|
| **Domain** | Delivery / Release |
| **Intended state** | FTGP work lands via small, reviewable PRs; `main` stays Production-safe |
| **Current state** | **Owner accepted CROW.PR10.2** — PR #10 is draft archive/reference; Option D+B slice rules baselined. Conflicts remain unresolved by design. No GitHub Issue yet — tracked here until owner requests one |
| **Severity** | High if someone merges monolith; **policy mitigates** |
| **Security/authority impact** | High if merged wholesale; low while DRAFT archive discipline holds |
| **Dependency** | Slice execution; GAP-004 before hosted/runtime; GAP-015 **Mitigated** (use `CROW.PRODUCTION.DEPLOY` for Production) |
| **Proposed milestone** | Slice execution (Discovery D0–D6 done; next GAP-004 / Blueprint gate / FTGP slices) |
| **Owner decision required** | Next slice to authorize; optional GitHub Issue for GAP-018 / CROW.PR10.1 |
| **Tracking** | PR [#10](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/10) · [`milestones/CROW-PR10-2.md`](milestones/CROW-PR10-2.md) · [`pr10/PR10-ARCHIVE-AND-SLICE-RULE.md`](pr10/PR10-ARCHIVE-AND-SLICE-RULE.md) · ledger only (no Issue yet) |
| **Status** | **Mitigated (policy)** — archive + slice rule accepted; Discovery D0–D6 slices executed; further slices / GAP-004 pending |
