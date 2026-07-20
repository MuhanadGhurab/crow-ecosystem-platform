# GHURAVIA Scope Baseline

| Field | Value |
|-------|-------|
| **Status** | LOCKED — Authoritative |
| **Version** | 1.0.0 |
| **Owner** | Muhanad Haitham Fouad Ghurab (RAVEN) |
| **Last updated** | 2026-07-20 |
| **Source Gate** | GHV.FOUNDATION.1A |
| **Related** | [PRODUCT-CONSTITUTION.md](../constitution/PRODUCT-CONSTITUTION.md) · [CAPABILITY-REGISTRY.md](../../product/CAPABILITY-REGISTRY.md) · [SCOPE-TRACEABILITY-MATRIX.md](../../product/SCOPE-TRACEABILITY-MATRIX.md) |

## 1. Baseline categories

| Category | Meaning |
|----------|---------|
| LOCKED | Accepted for governance baseline |
| CONDITIONALLY LOCKED | Accepted with explicit pending conditions |
| PENDING TECHNICAL VALIDATION | Direction set; vendor/implementation not chosen |
| PENDING EXTERNAL VALIDATION | Requires legal, commercial, or registry work |
| DEFERRED | Intentionally later |
| OUT OF SCOPE | Excluded from first controlled launch |

## 2. First controlled launch — in scope

### 2.1 Public and Onboarding

- Landing Page
- Account activation
- Crow personalization
- Origin
- The Nest
- Horizon selection
- Route selection
- Flight Plan

### 2.2 Learning

- Five-Horizon World Map
- Selected launch Routes
- Missions
- Assessments
- Evidence
- Flight Log
- One validated Cross-Wing Route
- One validated Secure Extension

Exact Route catalogues remain pending a dedicated Learning Gate. Cross-Wing and Secure Extension entries require Capability Atlas studies before publication.

### 2.3 Progression

- Flight XP
- Momentum
- Maturity
- Initial Mastery
- Crests
- Achievements
- Limited Leaderboards

Exact formulas remain pending `GHV.PROGRESSION.1`.

### 2.4 Adaptive Experience

- Flight State
- Save and Resume
- Adaptive Skyboard
- Basic recommendations
- Stalled-user recovery
- Eligibility and entitlement decisions

### 2.5 Commercial

- Open Flight
- Three paid plans (Flight Pass, Wing Pass, Expedition Pass)
- Monthly and annual billing
- Merit Access
- Refunds and grace states
- Invoices

Payment provider and final legal refund wording remain pending validation.

### 2.6 Community and Live

- Rookery foundation
- Structured posts and reactions
- Teams
- One controlled Repository experience
- Live Sky directory
- Participant and spectator foundations
- Moderation and reporting

No unrestricted private messaging in the initial controlled launch.

### 2.7 Platform Trust

- Authentication
- Authorization
- Audit
- Monitoring
- Privacy
- Backup
- Recovery
- Accessibility
- Arabic RTL
- English LTR
- Administration

## 3. Initial exclusions (OUT OF SCOPE for first controlled launch)

- Native mobile applications
- Unrestricted private messaging
- Open user-created public courses
- Full course marketplace
- Full recruitment marketplace
- University administration suite
- Enterprise training administration suite
- Formal accreditation as a launch dependency
- Large-scale unlimited cyber ranges
- Global production rollout
- Microservices
- Cryptocurrency
- NFTs
- Cash reward economy
- Full 3D metaverse
- Unlimited AI-generated learning content

## 4. Nest readiness rules (LOCKED)

| Result | Label | Rule |
|--------|-------|------|
| ≥ 70% | Ready to Fly | May skip The Nest; weaknesses become recommended reviews; no advanced Mastery awarded |
| 50%–69% | Guided Skip | May continue; targeted Micro-Missions inserted; advanced Routes keep their own prerequisites |
| < 50% | Nest Recommended | Nest becomes recommended active journey; advanced gated content unavailable until Nest completed or later readiness ≥ 50%; public exploration remains possible |

## 5. Commercial Access Plans (LOCKED pricing baseline)

| Plan | Monthly (incl. VAT) | Annual (incl. VAT) | Active Routes |
|------|---------------------|--------------------|---------------|
| Open Flight | Free | — | 1 |
| Flight Pass | SAR 50 | SAR 480 | 2 |
| Wing Pass | SAR 90 | SAR 864 | 3 |
| Expedition Pass | SAR 149 | SAR 1,430.40 | 5 |

- Annual discount baseline: **20%**
- Refund-policy baseline: **7 calendar days**, pending final legal wording
- Failed-payment grace baseline: **7 calendar days**
- Payment-provider budgeting assumption: **3% of transaction value + SAR 1** (planning assumption, not a contract)
- Payment-method acceptance targets: mada, Visa, Mastercard, Apple Pay, Google Pay, Samsung Pay where supported

## 6. Merit Access (LOCKED direction)

Merit may provide Mission Grant, Route Grant, Cross-Wing Grant, temporary Flight/Wing/Expedition Pass, or Prestige Access.

Merit may be earned through approved Evidence, Route completion, Horizon-Proven status, competitions, community contribution, projects, scholarships, partner sponsorship, and Prestige.

Merit expiration must preserve completed work and provide appropriate grace.

## 7. Cross-Wing and Secure Extension (CONDITIONALLY LOCKED)

Cross-Wing Access =

```text
Commercial Entitlement or Merit Grant
AND Required Mastery
AND Required Evidence
AND Integration Readiness
AND Applicable Trust Requirement
```

No Cross-Wing Route may be published without a real-world capability, mapped source Routes, prerequisites, integration Mission, capstone Evidence, assessment method, expert review, content-freshness requirements, and operational feasibility.

Exact catalogues: **pending dedicated Learning Gate**.

## 8. Architecture direction (PENDING TECHNICAL VALIDATION)

```text
Modular Monolith · API-First · Event-Aware · Responsive Web/PWA First
```

Candidates pending validation include Next.js, React, TypeScript, NestJS, Fastify, PostgreSQL, Prisma plus typed SQL, Redis, BullMQ, S3-compatible storage, WebSockets, Server-Sent Events, OpenTelemetry, Docker, and Infrastructure as Code.

**Not approved for initial architecture:** Microservices, Kubernetes, Kafka, Graph Database.

## 9. Conditional locks

| Item | Status | Condition |
|------|--------|-----------|
| Ages 15–17 activation | CONDITIONALLY LOCKED | Saudi legal validation |
| Domain / trademark use | PENDING EXTERNAL VALIDATION | Registry and legal search |
| Payment provider | PENDING TECHNICAL VALIDATION | Contract and capability proof |
| Identity provider (Keycloak candidate) | PENDING TECHNICAL VALIDATION | Technical Gate |
| Progression formulas | DEFERRED | GHV.PROGRESSION.1 |
| Cross-Wing catalogue | DEFERRED | Learning Gate + Capability Atlas |

## 10. Scope change rule

No Feature enters implementation without Pillar → Capability → Requirement → Test → Evidence traceability per [SCOPE-TRACEABILITY-MATRIX.md](../../product/SCOPE-TRACEABILITY-MATRIX.md) and [CHANGE-CONTROL-POLICY.md](../changes/CHANGE-CONTROL-POLICY.md).
