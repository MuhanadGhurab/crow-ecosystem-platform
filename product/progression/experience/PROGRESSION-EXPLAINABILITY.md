# Progression Explainability

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-EXP-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SKYBOARD-COMPOSITION.md](./PROGRESSION-SKYBOARD-COMPOSITION.md) · [PROGRESSION-SCREEN-STATE-MAP.md](./PROGRESSION-SCREEN-STATE-MAP.md) · [../governance/PROGRESSION-CORRECTION-AND-APPEAL.md](../governance/PROGRESSION-CORRECTION-AND-APPEAL.md) · [../architecture/PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md](../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §31 · System Separation · Event Validity · Freshness Architecture |
| **Unresolved formula dependencies** | Exact copy localization variants; numeric “why” breakdowns → **1B** where values exist |
| **Unresolved technical dependencies** | Explainability component Product Code → later UX / technical gates |
| **Privacy classification** | User-facing; integrity rationales may be redacted |
| **Decision sensitivity** | HIGH when explaining Trust, Prestige, Title, integrity |
| **Appealability** | Explainability must disclose when appeal is available |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Explainability Architecture |

---

## Purpose

Require every progression screen to make standing **intelligible**: what the measure means, what moved it, what did not, what to do next, and whether the result is provisional, appealable, Evidence-backed, or subject to freshness review.

```text
STATUS: ARCHITECTURE RECOMMENDED
No unexplained hidden score for sensitive outcomes
Product Code BLOCKED · No numeric formulas
```

---

## Mandatory explainability fields

Every progression screen (and material Skyboard progression module) must be able to answer:

| Field | Question |
|-------|----------|
| **Meaning** | What does this measure mean? |
| **Cause** | What caused the current change? |
| **Non-cause** | What did **not** affect it? |
| **Next action** | What is the next meaningful action? |
| **Provisional?** | Is the result provisional? |
| **Review / appeal?** | Is review or appeal available? |
| **Evidence support** | Which Evidence (if any) supports the result? |
| **Freshness / reevaluation** | Does freshness or reevaluation apply? |

Screens that cannot answer these for the systems they display are non-compliant with 1A explainability architecture.

---

## Canonical example copy (gate)

### XP

> Recognizes completed and validated activity. It does not prove Mastery.

### Momentum

> Shows recent consistency. It changes seasonally and does not erase your lifetime progress.

### Mastery

> Based on approved Evidence and assessments.

### Trust

> Represents reliability and integrity. It is not a popularity score.

### Prestige

> Requires exceptional verified capability, Breadth, Trust and impact.

These lines are **canonical meaning statements**. Localized UX may expand them; it must not contradict them.

---

## Extended explainability patterns (architecture)

### Flight XP

| Element | Guidance |
|---------|----------|
| Meaning | Activity / contribution recognition |
| Cause | Validated eligible events in XP categories |
| Non-cause | Payment, popularity alone, Mastery approval |
| Next action | Continue meaningful Missions / Evidence — not grind theater |
| Provisional | May be provisional if source event under integrity review |
| Appeal | Via correction/appeal when XP was wrongly applied or removed |
| Evidence | XP is not Evidence; link to activity source, not Mastery proof |
| Freshness | Lifetime XP normally preserved; freshness applies to Mastery, not XP erasure |

### Momentum League

| Element | Guidance |
|---------|----------|
| Meaning | Seasonal consistency |
| Cause | Season-eligible activity within fair-play bounds |
| Non-cause | Lifetime XP total, payment, Prestige |
| Next | Sustainable participation — not unhealthy streaks |
| Provisional | Season standings may be provisional |
| Appeal | Integrity / correction paths when wrongly limited |
| Evidence | Not Mastery Evidence |
| Freshness | Season close / decline possible; lifetime progress remains |

### Mastery / Route-Proven

| Element | Guidance |
|---------|----------|
| Meaning | Demonstrated capability via approved Evidence / assessments |
| Cause | Approved Evidence, assessments, capstone / proven pathways |
| Non-cause | XP volume, Momentum, reactions, payment |
| Next | Targeted Evidence or refresh where recommended |
| Provisional | Under review / reevaluation states must be labeled |
| Appeal | Evidence revocation and Mastery-impacting decisions appealable |
| Evidence | Show supporting Evidence references where permitted |
| Freshness | Freshness / reevaluation may apply without blanket reset |

### Trust

| Element | Guidance |
|---------|----------|
| Meaning | Reliability and integrity standing |
| Cause | Conduct, integrity, assurance-related events |
| Non-cause | Likes, followers, XP high score |
| Next | Clear required actions if restricted |
| Provisional | Integrity review may hold provisional standing |
| Appeal | Required for restrictions |
| Evidence | May reference case records with redaction |
| Freshness | Not a popularity decay meter |

### Prestige / Titles

| Element | Guidance |
|---------|----------|
| Meaning | Distinction / professional recognition outcomes — not casual badges |
| Cause | Verified capability, Breadth, Trust, impact, human review |
| Non-cause | High XP alone, paid plan, reaction farming |
| Next | Eligibility and nomination — not purchase |
| Provisional | Nomination ≠ grant |
| Appeal | Denial / revocation appealable under stronger review |
| Evidence | Portfolio / Evidence references as policy allows |
| Freshness | May require continued integrity and capability standing |

---

## Sensitive outcomes rule

**No unexplained hidden score may control sensitive user outcomes.**

Sensitive outcomes include at least:

* Trust restrictions
* Prestige grant / revocation
* Professional Title grant / revocation
* Evidence revocation affecting Mastery or Route-Proven
* Integrity sanctions affecting standing or roles

Users must receive permitted explanation; detection internals may be restricted (see Correction and Appeal; Anti-Gaming).

---

## Skyboard and screen obligations

* Skyboard progression modules inherit the same eight explainability fields for any standing they celebrate or warn about.
* Screen state map documents how each GHV-SCR-PRG-* surface exposes meaning, empty, provisional, correction, and appeal states.

---

## Explicit non-goals

* No Product Code components
* No numeric “points breakdown” formulas
* No requirement to disclose production detection algorithms
* No conflation of XP copy with Mastery copy

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
