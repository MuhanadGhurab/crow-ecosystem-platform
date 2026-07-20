# Progression Presentation — Separation Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-FLOW-PRG-PRESENT-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-WIREFRAMES.md](./PROGRESSION-WIREFRAMES.md) · Constitution §6 · Scope §3.12 · DEC-022/026/027 · [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) PRG-* · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) |
| **Scope** | CORE FOUNDATION (separation) · CONTROLLED LAUNCH (surfaces) |
| **Unresolved** | Exact formulas, thresholds, season math — **PENDING GHV.PROGRESSION.1** |
| **Change history** | 1.0.0 — PD.3 |

Screens: PRG-001 Progression Overview · PRG-002 Momentum League · PRG-003 Mastery Board · PRG-004 Achievements · PRG-005 Leaderboards Limited · PRG-006 Prestige View.

---

## Purpose

Lock how GHURAVIA **presents** progression so learners never confuse independent systems. This document is presentation law for wireframes — **not** scoring formulas.

> Exact formulas: **PENDING GHV.PROGRESSION.1**. Do not invent XP curves, Momentum season math, Mastery rubrics, or Prestige eligibility equations in UI copy.

---

## Separation law (authoritative)

```text
XP ≠ Mastery ≠ Momentum ≠ Trust ≠ subscription ≠ Prestige
```

| System | Controls / means | Must never be sold as |
|--------|------------------|------------------------|
| **Flight XP** | Activity / learning engagement signal | Skill, Mastery, exam result, Prestige |
| **Momentum** | Seasonal participation rhythm | Permanent Skill or paid rank |
| **Maturity Rank** | Journey maturity band (surface) | Purchased competence |
| **Route Mastery** | Evidence-backed capability on a Route | Payment, watch time alone, XP alone |
| **Breadth** | Cross-Route span (surface at launch) | Instant mastery pack |
| **Trust Standing** | Safety / community standing | Pay-to-trust |
| **Professional Titles** | Opportunity surface (launch surface) | Bought title-as-skill |
| **Prestige Classes** | Distinction (names locked; depth pending) | Pay-to-Prestige |
| **Access Plan / subscription** | Entitlement capacity | XP, Mastery, Evidence approval, Trust, Prestige, leaderboard position |
| **Crests / Achievements** | Marks of milestones | Proof of Mastery by themselves |

Constitution reminders for UI:

- Completion ≠ Mastery  
- Evidence controls Mastery  
- Prestige controls distinction  
- Money must never directly grant XP, Mastery, approved Evidence, exam results, leaderboard position, Trust, or Prestige  

---

## Prestige Class names (authoritative only)

At CONTROLLED LAUNCH, Prestige **surface** may show names and eligibility visibility. Names only:

1. **Ascendant Raven**  
2. **Apex Raven**  
3. **Obsidian Raven**  

No other Prestige Class names in wireframes. No scoring formulas, point tables, or “% to next Prestige” invented numbers until PROGRESSION.1.

---

## How each screen should speak

| Screen | Speaks about | Must not imply |
|--------|--------------|----------------|
| PRG-001 Overview | Independent meters side-by-side with plain definitions | One unified “power score” |
| PRG-002 Momentum League | Seasonal Momentum only | Lifetime Skill ladder for sale |
| PRG-003 Mastery Board | Route Mastery via Evidence | XP bar = Mastery |
| PRG-004 Achievements | Crests / achievement list | Achievement = Route Mastery |
| PRG-005 Leaderboards Limited | Policy-limited boards | Global engagement-max ranking; pay-to-climb |
| PRG-006 Prestige View | Class names + pending eligibility | Buy Prestige; fake progress % |

---

## Presentation patterns (ASCII)

### Independent meters (PRG-001)

```text
┌────────────────────────────────────────────────────────────┐
│ Your progression · systems are separate                    │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ Flight XP    │ Momentum     │ Maturity     │ Trust         │
│ (activity)   │ (season)     │ (journey)    │ (standing)    │
│ value TBD*   │ value TBD*   │ band TBD*    │ state         │
├──────────────┴──────────────┴──────────────┴───────────────┤
│ Route Mastery → PRG-003   Achievements → PRG-004           │
│ Prestige → PRG-006 (names)  Limited boards → PRG-005       │
│ Access Plan: shown as entitlement — not a skill meter      │
│ * Numeric formulas PENDING GHV.PROGRESSION.1               │
└────────────────────────────────────────────────────────────┘
```

### Anti-confusion callout (reuse anywhere)

```text
┌────────────────────────────────────────────┐
│ XP tracks activity.                        │
│ Mastery follows approved Evidence.         │
│ Momentum is seasonal rhythm.               │
│ Trust is safety standing.                  │
│ Subscription is access capacity.           │
│ Prestige is distinction — not for sale.    │
└────────────────────────────────────────────┘
```

---

## Commercial adjacency

Upgrade CTAs (PAY-*) may appear near Capacity locks — **never** inside Mastery celebration as “buy Mastery,” never on Prestige View as purchase, never as Trust restore via payment.

Merit Grants may grant **capacity / Prestige Access** without buying competence (DEC-024) — label Merit vs purchase clearly when shown.

---

## What progression presentation must never do

- Merge systems into one score or single progress ring that hides independence.  
- Show fabricated formulas or fake “points to Prestige.”  
- Use engagement-max leaderboards as the primary identity.  
- Equate subscription tier with Crow Skill or Prestige Class.  
- Invent Prestige names beyond Ascendant / Apex / Obsidian Raven.  

---

## Traceability

| Cap / Decision | Presentation |
|----------------|--------------|
| CAP-PRG-001..009 | Independent surfaces PRG-* |
| DEC-022 Separate systems | PRG-001 layout |
| DEC-026 Anti-pay-to-win | Copy + CTA placement |
| DEC-027 Prestige names | PRG-006 |
| GHV.PROGRESSION.1 | Formulas still pending |
