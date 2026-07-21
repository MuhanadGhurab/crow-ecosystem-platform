# Technical Domain Catalogue

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-DOM |
| **Version** | 0.1.0 |
| **Status** | **VALIDATION PLAN** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §10 |
| **Last updated** | 2026-07-21 |
| **Limitations** | Conceptual ownership only · **NO database tables** · shapes are candidates · extraction triggers **DECISION PENDING** · Technical Validation **NOT RUN** |

```text
DOMAIN CATALOGUE — CANDIDATE BOUNDARIES
NO SCHEMA
NO IMPLEMENTATION
```

Likely implementation shape (global default): **modular monolith module** unless noted. Extraction only after stated trigger + spike evidence.

---

## DOM-PUB — Public Experience

| Field | Content |
|-------|---------|
| **Business responsibility** | Marketing/public screens; unauthenticated discovery |
| **Owned records** | Public content refs, SEO/landing config (conceptual) |
| **Emitted events** | `public.page_viewed` (telemetry) |
| **Consumed events** | Catalogue publish notices |
| **Sync deps** | CMS read models |
| **Async deps** | Analytics |
| **Sensitive decisions** | None transactional |
| **Security boundary** | Public edge |
| **Consistency** | Eventual ok |
| **Latency** | Perceived page speed |
| **Availability** | High for marketing; degrade static |
| **Expected scale** | Traffic spikes |
| **Shape** | Edge-renderable module |
| **Owner module** | `public-experience` |
| **Extraction trigger** | CDN/edge team split |
| **Validation questions** | Can public stay up if Nest is down? |

## DOM-IDN — Identity and Activation

| Field | Content |
|-------|---------|
| **Business responsibility** | Authn, activation formula, ACT-003/011/012/013/005/006 family |
| **Owned records** | Account identity, activation state, verification challenges |
| **Emitted** | `identity.activated`, `identity.verification_pending/result`, `identity.risk_accepted` |
| **Consumed** | Email/mobile provider results; terms version publish |
| **Sync deps** | Terms, risk acceptance |
| **Async deps** | Email/OTP providers |
| **Sensitive decisions** | Activation complete; recovery without losing gates |
| **Security boundary** | Authenticated + provider trust |
| **Consistency** | Strong for activation flags |
| **Latency** | Interactive |
| **Availability** | Critical |
| **Scale** | Sign-up bursts |
| **Shape** | Core module |
| **Owner module** | `identity-activation` |
| **Extraction trigger** | Multi-app SSO estate |
| **Validation questions** | Server-authoritative activation? Recovery preserves gates? (QAS-005/006) |

## DOM-AAC — Account and Assurance

| Field | Content |
|-------|---------|
| **Business responsibility** | Profile assurance, Crow identity linkage, assurance levels |
| **Owned records** | Assurance flags, Crow public profile core |
| **Emitted/Consumed** | Assurance upgraded; consumes activation |
| **Sync/Async** | Identity sync; optional future gov ID async |
| **Sensitive decisions** | Assurance upgrades |
| **Security / Consistency** | Strong · PII-minimized public view |
| **Latency / Availability / Scale** | Interactive · High · Steady |
| **Shape / Module** | Adjacent to identity · `account-assurance` |
| **Extraction trigger** | Separate CRM/KYC system |
| **Validation questions** | Public Crow vs private identity split? (QAS-019) |

## DOM-ONB — Adaptive Onboarding

| Field | Content |
|-------|---------|
| **Business responsibility** | Post-activation onboarding paths and explainable locks |
| **Owned records** | Onboarding progress, lock reasons |
| **Events** | Emits step completed; consumes activation & entitlement |
| **Deps** | Nest entry; Learning catalogue |
| **Sensitive decisions** | Lock/unlock explanations |
| **Security / Consistency** | User-scoped · Strong for locks |
| **Latency / Availability / Scale** | Interactive · High · Launch cohort |
| **Shape / Module** | `adaptive-onboarding` |
| **Extraction trigger** | Rare |
| **Validation questions** | Locks map to screens without silent dead-ends? |

## DOM-NST — The Nest

| Field | Content |
|-------|---------|
| **Business responsibility** | Home shell orchestration of learner status |
| **Owned records** | Nest layout preferences (light) |
| **Events** | Consumes progression, entitlement, notifications summaries |
| **Deps** | Many read-only aggregates |
| **Sensitive decisions** | None authoritative |
| **Security / Consistency** | Authz to self · Read-mostly eventual |
| **Latency / Availability / Scale** | Critical UX · High · All learners |
| **Shape / Module** | BFF/aggregator in monolith · `nest` |
| **Extraction trigger** | Extreme read scale |
| **Validation questions** | Nest usable when search/notifications degraded? |

## DOM-CAT — Learning Catalogue

| Field | Content |
|-------|---------|
| **Business responsibility** | Publishable learning inventory |
| **Owned records** | Courses/routes/mission definitions (logical) |
| **Events** | `catalogue.published/retired` |
| **Deps** | CMS; Graph |
| **Sensitive decisions** | Publish/retire |
| **Security / Consistency** | Content-op roles · Strong publish |
| **Latency / Availability / Scale** | Read-heavy · High · Catalogue size growth |
| **Shape / Module** | `learning-catalogue` |
| **Extraction trigger** | Multi-brand catalogue |
| **Validation questions** | Versioned publish without breaking in-flight missions? |

## DOM-GRA — Learning Graph

| Field | Content |
|-------|---------|
| **Business responsibility** | Conceptual progress nodes/edges (no false awards) |
| **Owned records** | Graph nodes/edges versions |
| **Events** | Consumes Evidence acceptance; emits eligibility signals |
| **Deps** | Evidence, Assessment, Progression |
| **Sensitive decisions** | Eligibility edges |
| **Security / Consistency** | Strong for award-impacting edges |
| **Latency / Availability / Scale** | Mixed · High integrity · Graph growth |
| **Shape / Module** | `learning-graph` |
| **Extraction trigger** | Dedicated graph engine need |
| **Validation questions** | Conceptual graph ≠ premature schema lock? |

## DOM-MSN — Mission Runtime

| Field | Content |
|-------|---------|
| **Business responsibility** | Active mission session, save/resume |
| **Owned records** | Mission attempt state, checkpoints |
| **Events** | `mission.started/resumed/completed` |
| **Deps** | Catalogue, Evidence upload hooks |
| **Sensitive decisions** | Accepted checkpoint validity |
| **Security / Consistency** | User-scoped · Strong for progress checkpoints |
| **Latency / Availability / Scale** | Interactive · High · Concurrent missions |
| **Shape / Module** | `mission-runtime` |
| **Extraction trigger** | Isolated realtime workers |
| **Validation questions** | Resume without losing accepted progress? (QAS-001) |

## DOM-ASM — Assessment

| Field | Content |
|-------|---------|
| **Business responsibility** | Assessment attempts and scoring rules |
| **Owned records** | Attempt results (logical) |
| **Events** | Emits scored outcomes; consumed by Evidence/Progression gates |
| **Deps** | Mission runtime |
| **Sensitive decisions** | Pass/fail impacting awards |
| **Security / Consistency** | Anti-cheat posture · Strong |
| **Latency / Availability / Scale** | Interactive · High · Peak cohorts |
| **Shape / Module** | `assessment` |
| **Extraction trigger** | Specialized proctoring |
| **Validation questions** | Idempotent submit? |

## DOM-EVD — Evidence

| Field | Content |
|-------|---------|
| **Business responsibility** | Evidence artifacts, quarantine, acceptance linkage |
| **Owned records** | Evidence items, scan/review state refs |
| **Events** | `evidence.uploaded/accepted/revoked` |
| **Deps** | Object storage, scanner, Review |
| **Sensitive decisions** | Accept/revoke |
| **Security / Consistency** | High · Strong for accept/revoke |
| **Latency / Availability / Scale** | Upload-bound · High · Large objects |
| **Shape / Module** | `evidence` + storage adapter |
| **Extraction trigger** | Media pipeline scale |
| **Validation questions** | Failed upload retry non-duplicating? (QAS-002) Revocation scoped? (QAS-003) |

## DOM-REV — Review and Appeals

| Field | Content |
|-------|---------|
| **Business responsibility** | Human review queues and appeals |
| **Owned records** | Review decisions, appeal cases |
| **Events** | Emits review outcomes; consumes evidence submissions |
| **Deps** | Evidence, Trust |
| **Sensitive decisions** | Accept/reject/appeal |
| **Security / Consistency** | Role-gated · Strong + audit |
| **Latency / Availability / Scale** | Human SLA · Ops-critical · Queue depth |
| **Shape / Module** | `review-appeals` |
| **Extraction trigger** | Outsourced review center |
| **Validation questions** | Dual-control for high-impact accepts? |

## DOM-FLG — Flight Log

| Field | Content |
|-------|---------|
| **Business responsibility** | Learner-facing history of flights/activities |
| **Owned records** | Log projections |
| **Events** | Consumes mission/progression events |
| **Deps** | Mission, Progression |
| **Sensitive decisions** | None authoritative |
| **Security / Consistency** | Self-read · Eventual projection |
| **Latency / Availability / Scale** | Read · Medium-High · History growth → paginate |
| **Shape / Module** | `flight-log` projection |
| **Extraction trigger** | Analytics warehouse |
| **Validation questions** | Projection lag explained to user? |

## DOM-PRG — Progression

| Field | Content |
|-------|---------|
| **Business responsibility** | XP, Momentum, maturity, formula-versioned ledger effects |
| **Owned records** | Progression events, derived state, formula version stamps |
| **Events** | Consumes evidence/mission; emits progression applied |
| **Deps** | Evidence, Graph, Achievements |
| **Sensitive decisions** | Award application; recalculation scope |
| **Security / Consistency** | Integrity-critical · Strong + idempotent |
| **Latency / Availability / Scale** | Near-real-time · High integrity · Event volume |
| **Shape / Module** | `progression-ledger` |
| **Extraction trigger** | Extreme write scale after evidence |
| **Validation questions** | Duplicate event safe? (QAS-004) Formula version reproducibility? (QAS-013) |

## DOM-ACH — Achievements and Crests

| Field | Content |
|-------|---------|
| **Business responsibility** | Achievement/Crest grants from governed rules |
| **Owned records** | Achievement instances |
| **Events** | Consumes progression/evidence; emits grants |
| **Deps** | Progression (no payment path) |
| **Sensitive decisions** | Grant/revoke |
| **Security / Consistency** | Strong · audited revoke |
| **Latency / Availability / Scale** | Near-real-time · High · Catalogue of crests |
| **Shape / Module** | `achievements` |
| **Extraction trigger** | Rare |
| **Validation questions** | Payment cannot grant? |

## DOM-LDR — Leaderboards

| Field | Content |
|-------|---------|
| **Business responsibility** | Ranked views under fairness rules |
| **Owned records** | Board snapshots |
| **Events** | Consumes progression; schedule rebuilds |
| **Deps** | Progression |
| **Sensitive decisions** | Board eligibility |
| **Security / Consistency** | Eventual snapshots ok if versioned |
| **Latency / Availability / Scale** | Soft-real-time · Degrade ok · Hot reads |
| **Shape / Module** | `leaderboards` |
| **Extraction trigger** | Read fanout |
| **Validation questions** | Pay-to-win excluded from ranking inputs? |

## DOM-COM — Community / Rookery

| Field | Content |
|-------|---------|
| **Business responsibility** | Community spaces and contribution surfaces |
| **Owned records** | Posts/threads (logical), membership |
| **Events** | Community activity; consumed by moderation |
| **Deps** | Identity, Moderation |
| **Sensitive decisions** | Publish visibility |
| **Security / Consistency** | Authz + abuse controls · Causal per thread |
| **Latency / Availability / Scale** | Interactive · Medium-High · Social spikes |
| **Shape / Module** | `rookery` |
| **Extraction trigger** | Social platform scale |
| **Validation questions** | Minors’ public exposure limits? |

## DOM-MOD — Moderation and Trust

| Field | Content |
|-------|---------|
| **Business responsibility** | Restrictions, trust states, appeals handoff |
| **Owned records** | Restriction records, trust flags |
| **Events** | `trust.restricted/released`; consumes reports |
| **Deps** | Community, Review, Admin |
| **Sensitive decisions** | Restrict/release |
| **Security / Consistency** | Privileged · Strong + explainable user view |
| **Latency / Availability / Scale** | Ops · High integrity · Incident bursts |
| **Shape / Module** | `moderation-trust` |
| **Extraction trigger** | Safety org split |
| **Validation questions** | Restriction explained and appealable without leaking internals? (QAS-012) |

## DOM-SKY — Live Sky

| Field | Content |
|-------|---------|
| **Business responsibility** | Live sessions, participant vs spectator |
| **Owned records** | Session, participation credits |
| **Events** | Join/leave/reconnect; contribution credited once |
| **Deps** | Realtime transport (1D), Progression eligibility |
| **Sensitive decisions** | Contribution credit |
| **Security / Consistency** | Authz roles · Idempotent credit |
| **Latency / Availability / Scale** | Realtime · Session-critical · Spectator fanout |
| **Shape / Module** | `live-sky` (+ future realtime worker) |
| **Extraction trigger** | Concurrent session hard limits |
| **Validation questions** | Reconnect without duplicate credit? (QAS-008) Spectator load isolation? (QAS-009) |

## DOM-NTF — Notifications

| Field | Content |
|-------|---------|
| **Business responsibility** | Outbound notification orchestration |
| **Owned records** | Notification intents/delivery status |
| **Events** | Consumes domain events; emits delivery attempts |
| **Deps** | Notification provider |
| **Sensitive decisions** | None altering source state |
| **Security / Consistency** | User prefs · At-least-once delivery with dedupe |
| **Latency / Availability / Scale** | Soft · Degrade · Bursty |
| **Shape / Module** | `notifications` |
| **Extraction trigger** | High volume fanout |
| **Validation questions** | Failed notify leaves business state intact? (QAS-018) |

## DOM-SEA — Search and Discovery

| Field | Content |
|-------|---------|
| **Business responsibility** | Search indexes for catalogue/community |
| **Owned records** | Index projections |
| **Events** | Consumes publish/update events |
| **Deps** | Catalogue, Community |
| **Sensitive decisions** | Ranking signals (non-pay-to-win) |
| **Security / Consistency** | Eventual · ACL-filtered hits |
| **Latency / Availability / Scale** | Soft · Degrade · Index size |
| **Shape / Module** | `search` adapter |
| **Extraction trigger** | Dedicated search cluster |
| **Validation questions** | Core journey without search? (QAS-017) |

## DOM-PLN — Commercial Plans

| Field | Content |
|-------|---------|
| **Business responsibility** | Plan catalogue and pricing presentation |
| **Owned records** | Plan definitions |
| **Events** | Plan published |
| **Deps** | Entitlements, Payments |
| **Sensitive decisions** | Plan changes |
| **Security / Consistency** | Finance roles · Strong publish |
| **Latency / Availability / Scale** | Read · High · Small cardinality |
| **Shape / Module** | `commercial-plans` |
| **Extraction trigger** | Multi-region catalog |
| **Validation questions** | Plan change doesn’t mutate progression? |

## DOM-ENT — Entitlements

| Field | Content |
|-------|---------|
| **Business responsibility** | Access rights from purchase or Merit |
| **Owned records** | Entitlement grants/windows |
| **Events** | Consumes payment/merit; emits entitlement changed |
| **Deps** | Payments, Merit, Nest gates |
| **Sensitive decisions** | Grant/revoke access |
| **Security / Consistency** | Strong · never writes XP |
| **Latency / Availability / Scale** | Interactive · High · All users |
| **Shape / Module** | `entitlements` |
| **Extraction trigger** | Multi-product entitlement bus |
| **Validation questions** | Webhook delay reconciled without progression side effects? (QAS-007) |

## DOM-MER — Merit Grants

| Field | Content |
|-------|---------|
| **Business responsibility** | Non-purchase access grants |
| **Owned records** | Merit grant records |
| **Events** | Emits merit granted; consumed by entitlements |
| **Deps** | Admin/Finance policy |
| **Sensitive decisions** | Grant issuance |
| **Security / Consistency** | Privileged + audit · Strong |
| **Latency / Availability / Scale** | Ops · Medium · Low volume |
| **Shape / Module** | `merit-grants` |
| **Extraction trigger** | Rare |
| **Validation questions** | Merit ≠ progression currency? |

## DOM-PAY — Payments and Invoices

| Field | Content |
|-------|---------|
| **Business responsibility** | Checkout, invoices, webhook ingestion |
| **Owned records** | Payment intents, invoice refs |
| **Events** | Provider webhooks → entitlement reconcile |
| **Deps** | Payment provider, Entitlements |
| **Sensitive decisions** | Paid recognition |
| **Security / Consistency** | Signature verify · Idempotent · Strong for paid flag |
| **Latency / Availability / Scale** | Provider-bound · Commercial-critical · Spiky |
| **Shape / Module** | `payments` adapter |
| **Extraction trigger** | Multi-processor |
| **Validation questions** | Duplicate webhooks safe? |

## DOM-CMS — Content Management

| Field | Content |
|-------|---------|
| **Business responsibility** | Editorial workflow for publishable content |
| **Owned records** | Drafts, publish pipeline |
| **Events** | Publishes into Catalogue |
| **Deps** | Catalogue, Admin authz |
| **Sensitive decisions** | Publish |
| **Security / Consistency** | Role-gated · Strong publish |
| **Latency / Availability / Scale** | Ops · Medium · Editorial |
| **Shape / Module** | `cms` |
| **Extraction trigger** | Headless CMS adoption (still adapter) |
| **Validation questions** | Draft never leaks to learners? |

## DOM-ADM — Administration

| Field | Content |
|-------|---------|
| **Business responsibility** | Privileged configuration and corrections |
| **Owned records** | Admin actions (via Audit) |
| **Events** | Correction commands |
| **Deps** | All domains via governed APIs |
| **Sensitive decisions** | Corrections (QAS-020) |
| **Security / Consistency** | Highest privilege · Strong + reason codes |
| **Latency / Availability / Scale** | Ops · High integrity · Low volume |
| **Shape / Module** | `admin` |
| **Extraction trigger** | Separate admin app after boundary proof |
| **Validation questions** | Every correction audited? |

## DOM-SUP — Support

| Field | Content |
|-------|---------|
| **Business responsibility** | Assisted recovery tooling |
| **Owned records** | Support cases (logical) |
| **Events** | May trigger recovery flows; cannot silent-edit ledgers |
| **Deps** | Identity recovery, Audit |
| **Sensitive decisions** | Assisted actions with consent/policy |
| **Security / Consistency** | Support roles · Audited |
| **Latency / Availability / Scale** | Ops · Medium · Ticket volume |
| **Shape / Module** | `support` |
| **Extraction trigger** | External helpdesk |
| **Validation questions** | Support cannot bypass activation formula silently? |

## DOM-AUD — Audit

| Field | Content |
|-------|---------|
| **Business responsibility** | Immutable-ish audit trail for sensitive actions |
| **Owned records** | Audit entries |
| **Events** | Consumes privileged actions |
| **Deps** | Admin, Moderation, Finance, Review |
| **Sensitive decisions** | Tamper evidence |
| **Security / Consistency** | Append-oriented · Durability high |
| **Latency / Availability / Scale** | Write-behind ok · Critical for trust · Growth |
| **Shape / Module** | `audit` |
| **Extraction trigger** | Compliance store |
| **Validation questions** | Clock/source attribution enough for disputes? |

## DOM-OBS — Observability

| Field | Content |
|-------|---------|
| **Business responsibility** | Metrics/logs/traces for operability |
| **Owned records** | Telemetry streams (externalizable) |
| **Events** | N/A product |
| **Deps** | All modules emit |
| **Sensitive decisions** | PII scrubbing rules |
| **Security / Consistency** | Best-effort |
| **Latency / Availability / Scale** | Ops · Degrade · High cardinality risk |
| **Shape / Module** | `observability` hooks |
| **Extraction trigger** | Managed observability |
| **Validation questions** | Founder can diagnose activation/payment failures? |

## DOM-IGW — Integration Gateway

| Field | Content |
|-------|---------|
| **Business responsibility** | Provider adapters, webhook auth, substitution seams |
| **Owned records** | Provider delivery logs (logical) |
| **Events** | Normalized inbound/outbound integration events |
| **Deps** | All externals |
| **Sensitive decisions** | Accept/reject webhook authenticity |
| **Security / Consistency** | Untrusted ingress · Validate then forward |
| **Latency / Availability / Scale** | Provider-bound · Critical paths vary |
| **Shape / Module** | `integration-gateway` |
| **Extraction trigger** | Multi-service estate |
| **Validation questions** | Provider outage degrades gracefully? (QAS-015) |

---

## Cross-cutting notes

* **No DB tables** defined here; 1C owns conceptual data groups.
* **Entitlement ⊥ Progression** enforced across DOM-ENT/PAY vs DOM-PRG/ACH.
* **Activation screens** ACT-003/011/012/013/005/006 owned conceptually by DOM-IDN (+ terms/risk).
* Early distributed split of these domains is **REJECTED FOR LAUNCH** pending extraction triggers (see shape options).

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial Gate §10 domain catalogue |
