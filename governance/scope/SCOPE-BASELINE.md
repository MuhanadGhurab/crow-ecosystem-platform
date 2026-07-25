# GHURAVIA Scope Baseline

| Field | Value |
|-------|-------|
| **Document ID** | GHV-SCOPE-001 |
| **Version** | 1.1.0 |
| **Status** | LOCKED — FOUNDATION SCOPE BASELINE · **AMENDED 2026-07-25 (MATERIAL · APPROVE NOW)** |
| **Owner** | Muhanad Haitham Fouad Ghurab (RAVEN) |
| **Source Gate** | GHV.FOUNDATION.1B · amendment GHV.IMPLEMENTATION.0F |
| **Effective date** | 2026-07-21 |
| **Related** | [PRODUCT-CONSTITUTION.md](../constitution/PRODUCT-CONSTITUTION.md) · [SCOPE-CHANGE-IMPACT-MODEL.md](./SCOPE-CHANGE-IMPACT-MODEL.md) · [CAPABILITY-REGISTRY.md](../../product/CAPABILITY-REGISTRY.md) · [AUTHORITATIVE-SOURCE-MAP.md](../releases/AUTHORITATIVE-SOURCE-MAP.md) |

Product definition and Pillars: see Constitution (do not redefine here).

Pricing table: authoritative in this document §7.19 (Commercial Baseline summarizes and links).

---

## 1. Scope classification system

Every Scope item uses exactly one status:

| Status | Meaning |
|--------|---------|
| **CORE FOUNDATION** | Required in architecture and governance from the beginning, even if full UI appears later |
| **CONTROLLED LAUNCH** | Required for the Saudi controlled public launch by 31 December 2029 |
| **POST-LAUNCH PLANNED** | Approved direction; not required for first launch |
| **CONDITIONAL** | Approved only if a defined legal, commercial, safety, or technical condition passes |
| **PENDING TECHNICAL VALIDATION** | Cannot finalize until a technical Spike provides evidence |
| **PENDING EXTERNAL VALIDATION** | Requires lawyer, accountant, trademark specialist, provider, or regulator-related evidence |
| **DEFERRED** | Useful but intentionally unscheduled |
| **OUT OF SCOPE** | Not part of the active product baseline |
| **REJECTED** | Evaluated and intentionally refused |

---

## 2. Minimum Lovable Governed World

The first controlled Saudi launch must feel like a real GHURAVIA world, not a technical demo.

A user must be able to:

1. Discover the world.
2. Create and activate an account.
3. Create a Crow Identity.
4. Complete or skip The Nest appropriately.
5. Choose a Horizon.
6. Understand advanced possibilities.
7. Choose an available Route.
8. Review a Flight Plan.
9. Complete learning Missions.
10. Submit Evidence.
11. Receive initial Mastery and rewards.
12. See Wings Claimed.
13. Return through an adaptive Skyboard.
14. View progress in Your Wings and Flight Log.
15. Participate in a safe community experience.
16. Participate in or spectate one Live Sky experience.
17. Use Open Flight or a paid plan.
18. Receive or understand Merit Access.
19. Recover saved work.
20. Manage account, privacy, and subscription safely.

If one of these outcomes is absent, the launch is **not** a complete GHURAVIA vertical experience.

---

## 3. Capability groups

### 3.1 Product Identity and Governance — CORE FOUNDATION

GHURAVIA identity; RAVEN identity and method; Product Pillars; Product Constitution; Scope governance; Decision management; Risk management; Change Control; Gate management; evidence-based release reporting; Vision 2030 strategic alignment statement (non-affiliation).

### 3.2 Public Experience — CONTROLLED LAUNCH

Landing Page; Public World Preview; Public Horizon Preview; Public Live Sky; Access Plan information; Sign In; Create Account.

### 3.3 Identity and Account Assurance

| Slice | Classification |
|-------|----------------|
| Policy and architectural foundations (A0–A3, activation rules) | CORE FOUNDATION |
| Launch user capabilities (create, email verify, terms, optional mobile, passkeys/TOTP/recovery direction, session, recovery, privacy, export/deletion) | CONTROLLED LAUNCH |
| Trusted external identity integrations | POST-LAUNCH PLANNED or CONDITIONAL |

Basic activation (authoritative): `email_verified` + `current_terms_accepted` + `account_risk_status = acceptable`. Passkey-first; Keycloak is a **candidate** (PENDING TECHNICAL VALIDATION).

### 3.4 Crow Identity and Wingprint — CONTROLLED LAUNCH

Username; display name; Crow avatar; habitat; character style; colors; Crests; cultural accessories; titles; privacy; identity evolution.

Advanced cosmetic marketplaces / broad partner packs: **POST-LAUNCH PLANNED**.

### 3.5 The Nest — CONTROLLED LAUNCH

Digital Foundations curriculum; Start / Review / Test choices; readiness assessment; bands:

| Result | Label | Rule |
|--------|-------|------|
| ≥ 70% | Ready to Fly | May skip Nest; weaknesses → recommended reviews; no advanced Mastery from skip alone |
| 50%–69% | Guided Skip | May continue; Micro-Missions inserted; advanced Routes keep prerequisites |
| < 50% | Nest Recommended | Nest recommended active journey; advanced gated content unavailable until Nest done or readiness ≥ 50%; public exploration allowed |

### 3.6 Horizons

| Item | Classification |
|------|----------------|
| Horizon framework (OPERATE, BUILD, ANALYZE, PROTECT, LEAD) | CORE FOUNDATION |
| Five-Horizon World Map representation at launch | CONTROLLED LAUNCH |
| Unbuilt future Routes | POST-LAUNCH PLANNED |

### 3.7 Learning Architecture

Hierarchy: World → Horizon → Route → Stage → Mission → Evidence → Unlock.

| Item | Classification |
|------|----------------|
| Learning Graph model, typed edges, cycle prevention, content lifecycle governance | CORE FOUNDATION |
| Launch learning execution | CONTROLLED LAUNCH |

Typed edges include: `PREREQUISITE`, `COREQUISITE`, `RECOMMENDED`, `EQUIVALENT`, `BRIDGE`, `SECURE_EXTENSION`, `CONVERGENCE`, `UNLOCKS`, `EVIDENCE_FOR`, `REMEDIATES`. Learning / Progress / Entitlement graphs remain separate.

### 3.8 Launch Learning Catalogue

Minimum vertical-slice outcomes (exact Route **names** not selected in this Gate):

1. The Nest.
2. At least one complete OPERATE Route.
3. At least one complete BUILD or ANALYZE Route.
4. At least one complete PROTECT Route.
5. At least one LEAD foundation Route.
6. One validated Cross-Wing Route.
7. One validated Secure Extension.
8. One individual capstone.
9. One Team or Live Sky learning experience.
10. One professional Evidence output.

Exact Route selection: **PENDING GHV.LEARNING.1**.

### 3.9 Cross-Wing Routes

| Item | Classification |
|------|----------------|
| Cross-Wing model + Capability Atlas requirements | CORE FOUNDATION |
| One launch Cross-Wing Route | CONTROLLED LAUNCH |
| Exact catalogue | PENDING TECHNICAL VALIDATION (GHV.LEARNING.1) |
| Broad catalogue | POST-LAUNCH PLANNED |

Access formula:

```text
Cross-Wing Access =
Commercial Entitlement or Merit Grant
AND Required Mastery
AND Required Evidence
AND Integration Readiness
AND Applicable Trust Requirement
```

### 3.10 Secure Extensions

| Item | Classification |
|------|----------------|
| Model | CORE FOUNDATION |
| One launch Secure Extension | CONTROLLED LAUNCH |
| Full catalogue | POST-LAUNCH PLANNED |

### 3.11 Mission and Evidence — CONTROLLED LAUNCH

Mission Workspace; content types; assessments; labs; projects; teamwork; Evidence draft/submit; automated checks; human review; revision; approval; revocation; integrity checks.

Advanced external assessor / accredited Evidence: **POST-LAUNCH PLANNED** or **CONDITIONAL**.

### 3.12 Progression

| Item | Classification |
|------|----------------|
| Separation architecture (XP ≠ Mastery ≠ Prestige, etc.) | CORE FOUNDATION |
| Flight XP, Momentum, Maturity, initial Mastery, Crests, Achievements, limited Leaderboards | CONTROLLED LAUNCH |
| Breadth / Prestige / professional-title **surface** (names + eligibility visibility) | CONTROLLED LAUNCH |
| Breadth / Prestige / professional-title **full depth** (economy, formulas, title systems) | POST-LAUNCH PLANNED |

Exact formulas: **PENDING GHV.PROGRESSION.1**.

Prestige Class names (authoritative): Ascendant Raven · Apex Raven · Obsidian Raven.

### 3.13 Adaptive Experience (EBUX)

| Item | Classification |
|------|----------------|
| State and decision architecture | CORE FOUNDATION |
| Adaptive Skyboard and resume behavior | CONTROLLED LAUNCH |
| Advanced AI-driven guidance | POST-LAUNCH PLANNED or CONDITIONAL |

### 3.14 Save, Sync and Recovery — CORE FOUNDATION + CONTROLLED LAUNCH

Server-authoritative progress; client drafts; versions; autosave; Offline Draft; Syncing; conflict detection; recovery points; backups; restore testing.

Exact offline depth: **PENDING TECHNICAL VALIDATION**.

### 3.15 Skyboard — CONTROLLED LAUNCH

Continue Your Flight · Your Wings · Live Sky · The Rookery · Flight Log · RAVEN Guidance.

Advanced visualization: **POST-LAUNCH PLANNED**.

### 3.16 Community

| Item | Classification |
|------|----------------|
| Safe Rookery foundation (structured posts, reactions, Route spaces, Teams, one Repository space, collaboration requests, reporting, appeals, Trust, moderation) | CONTROLLED LAUNCH |
| Unrestricted private messaging | OUT OF SCOPE |
| Broad open social-network features | OUT OF SCOPE |
| Advanced partner communities | POST-LAUNCH PLANNED |

### 3.17 Live Sky

| Item | Classification |
|------|----------------|
| Directory, detail, boarding, participant + spectator foundations, results, moderation; one controlled experience | CONTROLLED LAUNCH |
| Large-scale tournament platform | POST-LAUNCH PLANNED |
| Large unlimited cyber ranges | OUT OF SCOPE for initial launch |

### 3.18 Commercial Platform

| Item | Classification |
|------|----------------|
| Commercial policy (anti-pay-to-win; entitlement vs Mastery) | CORE FOUNDATION |
| Saudi launch billing and subscription capabilities | CONTROLLED LAUNCH |
| Institutional pricing | POST-LAUNCH PLANNED |
| Exact payment provider | PENDING TECHNICAL VALIDATION |
| Tax and legal wording | PENDING EXTERNAL VALIDATION |

### 3.19 Saudi Price Baseline (authoritative)

| Plan | Monthly including VAT | Annual including VAT | Concurrent Routes |
|------|----------------------:|---------------------:|------------------:|
| Open Flight | Free | Free | 1 |
| Flight Pass | SAR 50 | SAR 480 | 2 |
| Wing Pass | SAR 90 | SAR 864 | 3 |
| Expedition Pass | SAR 149 | SAR 1,430.40 | 5 |

Also: annual discount baseline **20%**; refund baseline **7 calendar days** (pending legal wording); failed-payment grace **7 calendar days**; provider planning fee **3% + SAR 1** (assumption, not contract); payment-method targets: mada, Visa, Mastercard, Apple Pay, Google Pay, Samsung Pay where supported.

These are launch **planning baselines**, not provider or legal conclusions.

### 3.20 Merit Access — CONTROLLED LAUNCH

Mission / Route / Cross-Wing Grants; temporary plan Grants; Prestige Access; scholarship and partner-funded Access; preserve completed work + grace on expiry.

Exact Merit criteria: **PENDING GHV.PROGRESSION.1** and **GHV.LEARNING.1**.

### 3.21 Professional Value

| Item | Classification |
|------|----------------|
| Flight Log and Evidence portfolio | CONTROLLED LAUNCH |
| Accredited credentials | POST-LAUNCH PLANNED and CONDITIONAL |
| Full recruitment marketplace | OUT OF SCOPE for initial launch |
| Employer matching pilot | POST-LAUNCH PLANNED |

### 3.22 Administration — CONTROLLED LAUNCH

User, content, Learning Graph, Evidence queues, Live Sky admin, moderation, commercial admin, regional policies, Feature Flags, audit and observability — **essential launch administration only**.

### 3.23 Platform Trust — CORE FOUNDATION + CONTROLLED LAUNCH

Authentication; authorization; least privilege; encryption; audit; secure uploads; malware scanning; rate limiting; abuse controls; monitoring; incident response; backup; recovery; privacy; data classification; retention; regional policies; accessibility; localization.

Formal certification: **OUTSIDE CURRENT CLAIMS**.

---

## 4. Explicit launch non-requirements

Launch does **not** require:

- Native iOS or Android applications.
- Unrestricted DMs.
- Every future Route or Cross-Wing.
- Every future Prestige workflow.
- Formal accreditation.
- Full career marketplace.
- Enterprise or university administration suites.
- Global regional deployment.
- Microservices, Kubernetes, Kafka, Graph Database.
- Cryptocurrency, NFTs, cash rewards.
- 3D metaverse.
- Unlimited AI-generated curriculum.
- Unlimited cloud cyber ranges.

---

## 5. Architecture direction (PENDING TECHNICAL VALIDATION)

```text
Modular Monolith · API-First · Event-Aware · Responsive Web/PWA First
```

Candidates remain pending validation. Not approved for initial architecture: Microservices, Kubernetes, Kafka, Graph Database.

---

## 6. Founder-capacity constraint (WIP)

At any time:

- One primary implementation Capability.
- One supporting Capability.
- One Research Spike.

Do not schedule more than approximately **60–70%** of available founder capacity. Reserve the remainder for research, defects, rework, security, documentation, unexpected dependencies, and operational maintenance.

Any launch-scope addition must state what it **removes, delays, or replaces**.

---

## 7. Scope change rule

No Feature enters implementation without Pillar → Capability → Requirement → Test → Evidence traceability.

Material and Foundational changes require a Change Request and [SCOPE-CHANGE-IMPACT-MODEL.md](./SCOPE-CHANGE-IMPACT-MODEL.md).

---

## 8. Amendment — Living Mission / Crowprint Product Kernel (2026-07-25)

| Field | Value |
|-------|-------|
| **Change class** | MATERIAL SCOPE CHANGE |
| **Outcome** | APPROVE NOW |
| **Not** | Foundational Rebaseline |
| **Kernel** | [GHURAVIA-LIVING-MISSION-AND-CROWPRINT-PRODUCT-KERNEL.md](../../product/kernel/GHURAVIA-LIVING-MISSION-AND-CROWPRINT-PRODUCT-KERNEL.md) |
| **Auth** | GHV-IMP-AUTH-006 · GHV.IMPLEMENTATION.0F |

Adds CORE FOUNDATION (runtime alpha) Capabilities CAP-LRN-020..025 and CAP-IDN-007..008 for Living Mission engine, world-state, Evidence Signals, Crowprint, private Suggested Lineage, Echo Flight, Flight Log, and advisory Route recommendation — bounded to Black Signal alpha.

Unchanged: Product name · Six Pillars · audience · Horizons · learning hierarchy · Evidence-before-Mastery · Access ≠ Skill · Arabic-first · Constitution primacy.

Sequencing pauses (not cancellations): Analyze / Protect / Lead visual Lineage development · production Crow art.
