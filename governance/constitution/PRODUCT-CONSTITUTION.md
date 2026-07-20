# GHURAVIA Product Constitution

| Field | Value |
|-------|-------|
| **Status** | LOCKED — Authoritative |
| **Version** | 1.0.0 |
| **Owner** | Muhanad Haitham Fouad Ghurab (RAVEN) |
| **Last updated** | 2026-07-20 |
| **Source Gate** | GHV.FOUNDATION.1A |
| **Related** | [SCOPE-BASELINE.md](../scope/SCOPE-BASELINE.md) · [DECISION-REGISTER.md](../decisions/DECISION-REGISTER.md) · [PROJECT_STATUS.md](../../PROJECT_STATUS.md) |

## 1. Product identity

**Product:** GHURAVIA — غُرافيا

**Founder:** Muhanad Haitham Fouad Ghurab

**Founder identity:** RAVEN — Responsive Adaptive Virtual Education Navigator

**Management method:** RAVEN DEVFLOW — Adaptive Hybrid Product Development

**Current stage:** Product Foundation and Governance

**Target:** Controlled Saudi public launch no later than December 31, 2029

**Code status:** PRODUCT CODE BLOCKED

## 2. Product definition (locked)

GHURAVIA is an adaptive social technology-learning world where users create a digital Crow identity, navigate structured learning Horizons, complete practical Missions, produce Evidence of capability, collaborate within a positive community and transform their progress into educational and professional value.

### GHURAVIA is not

- A generic video-course catalogue.
- An unrestricted social network.
- A pay-to-win learning platform.
- A ranking system based only on activity.
- A platform where payment grants competence.
- An AI-controlled assessment platform.
- A crowded static dashboard.
- A full metaverse at initial launch.

## 3. Product Pillars (locked)

Every future Feature must trace to at least one Pillar.

1. **Learning and Development**
2. **Verified Skills and Evidence**
3. **Identity and Progression**
4. **Positive Community and Collaboration**
5. **Professional Opportunity**
6. **Security, Privacy and Trust**

Commercial capabilities are **enabling** capabilities and are **not** a seventh learning Pillar.

## 4. Brand and regional architecture (locked)

| Concept | Meaning |
|---------|---------|
| GHURAVIA | The product and digital world |
| RAVEN | Founder identity and adaptive guidance methodology |
| `ghuravia.com` | Intended global experience |
| `ghuravia.sa` | Intended Saudi regional experience |

Domain availability and trademark ownership remain **externally unverified** (see [EXTERNAL-VALIDATION-REGISTER.md](../../docs/validation/EXTERNAL-VALIDATION-REGISTER.md)).

**Architectural direction:**

```text
One Core Platform — Multiple Regional Experiences
```

Meaning:

- One primary codebase.
- Shared foundational domains.
- Regional policy packs.
- Regional content packs.
- Localization.
- Feature flags.
- Future data or hosting separation where legally required.

## 5. Target audience (locked direction)

Approximate age **15 and above**, including digital beginners, students, technology graduates, IT and cybersecurity professionals, developers, AI/ML learners, data practitioners, cloud and DevOps practitioners, robotics and IoT builders, game developers, designers, project and product managers, GRC and risk practitioners, researchers, career changers, and experienced technical leaders.

### Legal condition

- Product direction is 15+.
- Legal activation for ages 15–17 remains **pending Saudi legal validation**.
- If the required model is not legally approved before launch, the first commercial release may temporarily launch as **18+**.

## 6. Authority separations (immutable)

```text
Payment controls access and capacity.
Learning eligibility controls readiness.
Evidence controls Mastery.
Trust controls social authority.
Prestige controls distinction.
```

```text
Visual Identity ≠ Knowledge
Knowledge ≠ Skill
Skill = Knowledge Proven Through Evidence
Prestige = Mastery + Trust + Impact
```

Money must never directly grant XP, Mastery, approved Evidence, exam results, leaderboard position, Trust, or Prestige.

## 7. Account assurance model (locked)

| Level | Name | Meaning |
|-------|------|---------|
| A0 | Claimed Account | Registration submitted; email not verified |
| A1 | Email Verified | Email verified and mandatory terms accepted |
| A2 | Strongly Authenticated | Passkey or approved MFA configured |
| A3 | Trusted Identity | Real identity verified through an approved process |

**Basic account activation requires:**

```text
email_verified = true
current_terms_accepted = true
account_risk_status = acceptable
```

Mobile verification is optional for ordinary learning and may be required for Team creation, Live Flight hosting, Mentorship, Evidence review, formal credentials, high-value competitions, sensitive recovery, selected Prestige authority, and institution or employer roles.

**Authentication direction:** Passkey-first; password plus TOTP supported; recovery codes supported; SMS is supporting, not the strongest factor; Keycloak is the first identity-provider **candidate**, pending technical validation.

## 8. Learning architecture (locked)

```text
World → Horizon → Route → Stage → Mission → Evidence → Unlock
```

**Foundational layer:** The Nest — Digital Foundations

**Horizons:**

| Horizon | Focus |
|---------|-------|
| OPERATE | Systems and Infrastructure |
| BUILD | Software and Digital Creation |
| ANALYZE | Data and Intelligence |
| PROTECT | Cybersecurity and Resilience |
| LEAD | Strategy, Risk and Governance |

Learning Graph edge types: `PREREQUISITE`, `COREQUISITE`, `RECOMMENDED`, `EQUIVALENT`, `BRIDGE`, `SECURE_EXTENSION`, `CONVERGENCE`, `UNLOCKS`, `EVIDENCE_FOR`, `REMEDIATES`.

Mandatory prerequisite edges must not form cycles.

These graphs remain logically separate: **Learning Graph**, **Progress Graph**, **Entitlement Graph**.

## 9. Experience model (locked)

Primary model: **Experience-Based User Experience (EBUX)**.

Authenticated primary navigation:

```text
Flight · World · Live · Rookery · Log · Wingprint
```

Hidden UI is not authorization. Recommendations do not override user choice. Core learning must continue if optional AI or recommendation services are degraded. State-changing decisions must be auditable.

## 10. Architecture direction (foundation-level)

```text
Modular Monolith · API-First · Event-Aware · Responsive Web/PWA First
```

Candidate stack remains **pending technical validation**. No Microservices, Kubernetes, Kafka, or Graph Database are approved for the initial architecture.

## 11. Claims discipline

GHURAVIA must **not** claim NCA approval, full compliance, ISO certification, Vision 2030 endorsement, or official affiliation with a Saudi government entity unless independently verified and authorized.

Preferred language: designed in alignment with; mapped to; informed by; pending legal validation; pending technical validation.

## 12. Change authority

All material changes follow [CHANGE-CONTROL-POLICY.md](../changes/CHANGE-CONTROL-POLICY.md). Product Code remains blocked until governance and technical validation Gates authorize it.
