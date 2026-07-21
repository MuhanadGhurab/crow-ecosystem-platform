# Progression Unlock Boundary

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-ULK-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SYSTEM-SEPARATION.md](./PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-INVARIANTS.md](./PROGRESSION-INVARIANTS.md) · [MERIT-PROGRESSION-BOUNDARY.md](./MERIT-PROGRESSION-BOUNDARY.md) · [PROGRESSION-SOURCE-AUTHORITY.md](./PROGRESSION-SOURCE-AUTHORITY.md) · [../../learning/architecture/LEARNING-UNLOCK-REGISTRY.md](../../learning/architecture/LEARNING-UNLOCK-REGISTRY.md) · [../../learning/architecture/LEARNING-ELIGIBILITY-OVERLAY.md](../../learning/architecture/LEARNING-ELIGIBILITY-OVERLAY.md) · [../../../governance/constitution/PRODUCT-CONSTITUTION.md](../../../governance/constitution/PRODUCT-CONSTITUTION.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: define progression unlock boundary |

---

## Purpose

Separate **progression-triggered eligibility** from **final access grants**. Progression may make a learner *eligible to be considered* for certain experiences. Progression must not silently grant commercial, administrative, identity, employment, or infrastructure privileges.

Learning Unlocks remain defined in the Learning Unlock Registry. This document defines the **boundary** between progression standing and access outcomes.

---

## What progression may trigger eligibility for

Exact total: **10** eligibility families.

Progression standing (and related Trust/Mastery records) may trigger **eligibility** for:

1. **New visual evolution** — Crow / UI evolution presentation.
2. **Crest display** — right to show awarded Crests.
3. **Leaderboard participation** — entry into allowed boards (subject to age/privacy/Trust).
4. **Route-Proven display** — presentation of Proven standing when qualitative conditions are met (numeric thresholds PENDING).
5. **Cross-Wing review eligibility** — consideration for Cross-Wing pathways that require Mastery/Trust gates.
6. **Professional Title review** — nomination/application for Title review.
7. **Prestige nomination** — consideration for Prestige review.
8. **Mentoring or reviewer application** — application eligibility, not automatic appointment.
9. **Selected Merit review** — consideration for Merit Grants (entitlement outcomes; see Merit boundary).
10. **Advanced community responsibility** — moderated responsibility roles within Rookery/Live Sky policy.

Eligibility is not award. Review, Trust, and contextual conditions may still deny.

---

## What progression must NOT directly grant

Exact total: **7** prohibited direct grants.

Progression systems must **not** directly grant:

1. **Paid subscription** — Access Plan entitlement remains commercial or Merit entitlement, never XP/Mastery “payment.”
2. **Unrestricted social authority** — no unbounded messaging, moderation superpowers, or ungoverned influence.
3. **Administrator access** — platform admin roles are operational assignments, not progression prizes.
4. **Identity assurance** — A0–A3 assurance upgrades follow identity policy, not Rank farming.
5. **Database or infrastructure privileges** — no ops/DB rights from Prestige, Titles, or XP.
6. **Automatic employment status** — Professional Titles ≠ employment guarantee.
7. **Formal accreditation** — external accreditation remains POST-LAUNCH / CONDITIONAL and outside progression auto-grant.

---

## Final access decision stack

Final access decisions remain the conjunction of:

```text
Authentication
+ Authorization
+ Commercial Entitlement
+ Learning Eligibility
+ Trust Eligibility
+ Contextual Conditions
```

Exact total: **6** conjuncts.

| Conjunct | Controls |
|----------|----------|
| Authentication | Who the actor is (session/identity proof as required) |
| Authorization | Role/permission checks for the action |
| Commercial Entitlement | Access Plan / Merit Grant capacity and feature rights |
| Learning Eligibility | Readiness, prerequisites, Explainable Locks from Learning Graph |
| Trust Eligibility | Integrity and community reliability gates |
| Contextual Conditions | Age, region, Feature Flags, Live Sky boarding rules, review queues, etc. |

Progression meters inform **Learning Eligibility**, **Trust Eligibility**, and some **Contextual Conditions**. They do not replace Authentication, Authorization, or Commercial Entitlement.

---

## Explainable Locks alignment

When a user is blocked, reasons must distinguish at least:

- Missing commercial entitlement (Access Plan / Merit)
- Missing learning readiness / prerequisite
- Missing Trust eligibility
- Missing progression eligibility for a review pathway
- Contextual restriction (age, region, feature flag)

Hidden UI must never substitute for Authorization (Constitution).

---

## Interaction with Learning Unlocks

| Concern | Authority |
|---------|-----------|
| Pedagogical Unlock events (`ULK-*`) | Learning Unlock Registry |
| Progression eligibility for Proven / Title / Prestige / Merit review | This boundary + system architectures |
| Numeric thresholds on Unlocks | FORMULA PENDING (1B+) |
| Route-Proven qualitative conditions | Learning Design Baseline (unchanged) |

Progression must not invent new Route IDs or rewrite Learning Unlock semantics.

---

## Sensitive decisions

| Decision type | Progression may… | Progression must not… |
|---------------|-------------------|------------------------|
| Visual / Crest | Grant display eligibility | Imply Mastery |
| Leaderboard | Allow participation | Sell placement |
| Proven display | Reflect Evidence-backed standing | Treat completion as Proven |
| Title / Prestige | Open review eligibility | Auto-award from XP/payment |
| Mentoring / reviewer | Open application | Auto-appoint |
| Merit | Open consideration | Approve Evidence or sell skill |
| Admin / infra / employment / accreditation | — | Grant anything |

---

## Exact totals

| Item | Exact total |
|------|------------:|
| Eligibility families progression may trigger | **10** |
| Prohibited direct grants | **7** |
| Final access conjuncts | **6** |
