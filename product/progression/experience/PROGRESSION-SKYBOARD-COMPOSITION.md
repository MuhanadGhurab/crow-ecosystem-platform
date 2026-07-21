# Progression Skyboard Composition

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SKY-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-EXPLAINABILITY.md](./PROGRESSION-EXPLAINABILITY.md) · [PROGRESSION-SCREEN-STATE-MAP.md](./PROGRESSION-SCREEN-STATE-MAP.md) · [../architecture/PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md](../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md) · [../../journeys/NAVIGATION-MAP.md](../../journeys/NAVIGATION-MAP.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §32 · Adaptive Skyboard decisions · Explainability Architecture |
| **Unresolved formula dependencies** | Celebration thresholds and ranking of module priority → **1B / UX gates** |
| **Unresolved technical dependencies** | Skyboard module Product Code → later technical gates |
| **Privacy classification** | User-facing; minor-safe composition required |
| **Decision sensitivity** | MEDIUM–HIGH for Trust, Prestige, Title modules |
| **Appealability** | Trust / Prestige / Title modules must link to review/appeal when relevant |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Skyboard Progression Composition |

---

## Purpose

Define **when** Adaptive Skyboard may surface progression signals, and the composition rules that keep learning action primary, celebrations proportionate, and commercial prompts out of progression celebration.

```text
STATUS: ARCHITECTURE RECOMMENDED
Do not show all progression systems simultaneously
Next meaningful learning action remains primary
No Product Code · No UI implementation
```

---

## Permitted Skyboard progression signals

Exact total locked in this section: **11** signal types.

The Adaptive Skyboard **may** show:

| Signal | When appropriate (architecture) |
|--------|----------------------------------|
| XP increase | After validated activity recognition — low interrupt priority |
| Momentum change | Season-relevant consistency update |
| Maturity progress | Meaningful journey-maturity advancement |
| Evidence-approved Mastery | After Evidence / assessment approval — stronger feedback |
| Route-Proven | When Route-Proven standing updates |
| Breadth opportunity | When a legitimate next Breadth path opens |
| Trust-required action | When the learner must act on a Trust restriction or requirement — persistent clarity |
| Title-review eligibility | When eligible for Title review — not casual gamification |
| Prestige nomination | Nomination / eligibility only — human review framing |
| Crest or Achievement | When an Achievement / Crest unlocks |
| Leaderboard result | When policy allows and learner has not opted out; may be provisional |

---

## Composition rules

Exact total locked in this section: **9** rules.

### S1 — Not all systems simultaneous

Do not display all progression systems on Skyboard at once. Composition selects a small set of relevant signals. System separation must remain visible in copy and module choice.

### S2 — Next learning action is primary

The primary Skyboard job remains the **next meaningful learning action** (Mission, Evidence, Route step). Progression celebration is secondary and must not bury that action.

### S3 — Celebration matches significance

Feedback intensity matches significance:

* routine XP ≠ Prestige nomination
* Crest unlock ≠ Trust restriction

### S4 — Small XP must not interrupt learning

Small XP recognition events must not interrupt an active learning flow with blocking celebration.

### S5 — Evidence approval gets stronger feedback

Evidence-approved Mastery (and Route-Proven) deserves stronger, clearer feedback than routine activity XP.

### S6 — Trust restrictions are persistent and clear

Trust-required actions need persistent, plain messaging — not a one-shot confetti toast that disappears.

### S7 — Prestige and Title are not casual gamification

Title-review eligibility and Prestige nomination must read as review / distinction pathways, not arcade rewards or purchase upsells.

### S8 — Reduced motion respected

Reduced-motion settings must be respected for all progression celebrations and transitions (Fairness Architecture).

### S9 — No commercial prompts inside progression celebration

Commercial prompts (plan upgrade, Merit purchase framing, payment CTAs) must **not** appear inside progression celebration modules. Entitlement capacity may be explained elsewhere without co-opting celebration.

---

## Priority guidance (conceptual)

Without numeric thresholds, recommended priority order when multiple signals compete:

1. Trust-required action (safety / integrity)
2. Evidence-approved Mastery / Route-Proven
3. Title-review eligibility / Prestige nomination (non-casual)
4. Maturity progress / Breadth opportunity
5. Crest or Achievement
6. Momentum change / leaderboard result (if opted in)
7. XP increase (lowest interrupt priority)

Learning-next-action module remains structurally primary regardless of celebration priority.

---

## Explainability inheritance

Any Skyboard progression signal must support the eight explainability fields (meaning, cause, non-cause, next action, provisional, appeal, Evidence support, freshness) per [PROGRESSION-EXPLAINABILITY.md](./PROGRESSION-EXPLAINABILITY.md).

---

## Age and privacy

For ages 15–17 where legally activated: no personal data in celebrations; no unrestricted adult-contact CTAs; Prestige / mentoring signals follow age-sensitive controls ([AGE-PRIVACY-PROGRESSION.md](../fairness/AGE-PRIVACY-PROGRESSION.md)).

---

## Explicit non-goals

* No Product Code or layout implementation
* No locked numeric celebration thresholds
* No requirement to show leaderboards to all users
* No payment-in-celebration patterns

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
