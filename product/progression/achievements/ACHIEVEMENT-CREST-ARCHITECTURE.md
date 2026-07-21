# Achievement and Crest Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-ACH-CRS-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-IDENTIFIER-STANDARD.md](../architecture/PROGRESSION-IDENTIFIER-STANDARD.md) · [PRESTIGE-ARCHITECTURE.md](../prestige/PRESTIGE-ARCHITECTURE.md) · [ROUTE-MASTERY-ARCHITECTURE.md](../mastery/ROUTE-MASTERY-ARCHITECTURE.md) · [LEADERBOARD-ARCHITECTURE.md](../leaderboards/LEADERBOARD-ARCHITECTURE.md) · [TRUST-STANDING-ARCHITECTURE.md](../trust/TRUST-STANDING-ARCHITECTURE.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Achievement catalogue, award magnitudes, event Crest catalogues → **GHV.PROGRESSION.1B** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Achievement and Crest Architecture |

## Purpose

Define **Achievements** and **Crests** as recognition of discrete accomplishments and visual markers — **not** as substitutes for Route-Proven, Mastery, Trust, Titles, or Prestige.

```text
STATUS: ARCHITECTURE RECOMMENDED
Achievements / Crests celebrate milestones
Cosmetic ≠ Skill implication
No Achievement substitutes for Route-Proven
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What Achievements are** | Governed recognitions that a discrete, explainable accomplishment occurred under platform rules. |
| **What Crests are** | Visual / collectible markers linked to Achievement families, Horizons, events, fusion combinations, or Prestige — without silently meaning Mastery. |
| **What they are not** | Route-Proven, Horizon-Proven, Trust Standing, Professional Titles, Prestige Classes, employment credentials, or paid Skill claims. |
| **System ID** | `PGS-ACH` |
| **IDs** | Achievements `ACH-<CATEGORY>-<NUMBER>`; Crests by family `CRS-*` (see Crest categories). |
| **Values** | Catalogues and any scoring hooks are **FORMULA PENDING** (1B). This Gate defines categories, types, and binding rules only. |

---

## Crest categories

Exact totals for Crest ID families in this Gate: **6** (aligned with identifier standard).

| Crest family | ID pattern | What it represents |
|--------------|------------|--------------------|
| **Base** | `CRS-BASE-<NUMBER>` | Visual foundation / identity Crests — cosmetic foundation, not Skill. |
| **Achievement** | `CRS-ACH-<NUMBER>` | Crests linked to Achievement awards. |
| **Horizon** | `CRS-HRZ-<NUMBER>` | Horizon-linked Crests — Horizon association, not automatic Horizon-Proven. |
| **Fusion** | `CRS-FUS-<NUMBER>` | Combination / fusion Crests marking multi-path or multi-signal combinations under governed rules. |
| **Event** | `CRS-EVT-<NUMBER>` | Event-linked Crests — historical participation or event outcomes as defined by the event. |
| **Prestige** | `CRS-PRS-<NUMBER>` | Prestige-linked Crests — visual markers tied to Prestige Class outcomes; do not themselves award Prestige. |

---

## Achievement types

Exact totals for Achievement types in this Gate: **11**.

| Type ID | What it represents |
|---------|-------------------|
| **ACTIVITY** | Recognized platform activity milestones (not Mastery). |
| **LEARNING** | Structured learning progress milestones (completion ≠ Proven). |
| **EVIDENCE** | Evidence-linked accomplishments; must link to the relevant Evidence class. |
| **CAPSTONE** | Capstone-related milestones (approval still governed by Evidence / Proven rules elsewhere). |
| **COMMUNITY** | Community participation or contribution milestones (not popularity-as-Skill). |
| **TEAM** | Team collaboration milestones with attributable contribution where required. |
| **LIVE_SKY** | Live Sky participation or role milestones under Live Sky rules. |
| **INTEGRITY** | Integrity-affirming milestones (never purchasable “clean slate” cosmetics that imply Trust repair). |
| **CONTRIBUTION** | Contribution recognitions (service, content, mentoring signals where governed). |
| **MILESTONE** | Journey / progression milestones that are explicitly milestone-scoped. |
| **PRESTIGE** | Prestige-adjacent Achievement markers; still do not replace Prestige review. |

---

## Binding rules

| ID | Rule |
|----|------|
| ACH-R1 | **Achievements and Crests must state what they represent.** Display copy must not silently imply Skill, Proven, or employment. |
| ACH-R2 | **Cosmetic ≠ Skill implication.** Base and decorative Crests must not be labeled as Mastery or Route-Proven. |
| ACH-R3 | **Evidence-linked Achievements must link to the Evidence class** they celebrate (artifact, Capstone, review outcome — as applicable). |
| ACH-R4 | **Participation ≠ winner / Mastery.** Participation Crests and Achievements must not be worded as victory or Mastery unless the governing event explicitly awards that outcome under separate rules. |
| ACH-R5 | **Payment / subscription ≠ Achievements.** Access Plan and purchases never grant Skill-implying Achievements or Crests. |
| ACH-R6 | **Event Crests are historical.** Event Crests record event-era outcomes; they do not rewrite later Mastery or Trust. |
| ACH-R7 | **Revoked results may revoke or annotate Crests / Achievements** when the underlying result is voided — history remains auditable. |
| ACH-R8 | **Accessibility alternatives required.** Crest meaning must be available via text / non-color-only alternatives. |
| ACH-R9 | **Hidden Achievements are not essential progression.** Core learning and Proven paths must remain completable without discovering hidden Achievements. |
| ACH-R10 | **No Achievement substitutes for Route-Proven.** Achievements never replace Learning Design Baseline Route-Proven qualitative conditions. |
| ACH-R11 | **Catalogues and any numeric award hooks pending GHV.PROGRESSION.1B.** |

---

## Relationship to other systems

| System | Boundary |
|--------|----------|
| **Route Mastery / Route-Proven** | Achievements may celebrate milestones toward or around Mastery/Proven — never replace them. |
| **Prestige** | Prestige Crests visualize Prestige; Prestige award remains Prestige architecture. |
| **Trust** | Integrity Achievements must not sell Trust repair; Trust decisions remain Trust architecture. |
| **Leaderboards** | Board placements may unlock board-scoped Achievements only when explicitly governed — boards do not redefine Mastery. |
| **Flight XP / Momentum** | Activity systems may feed ACTIVITY / MILESTONE Achievements; XP alone is not Route-Proven. |
| **Access Plan** | Commercial entitlement only; never Achievement purchase for Skill claims. |

---

## Visibility and explainability

| Concept | Architecture |
|---------|--------------|
| **Learner-facing copy** | Crests and Achievements celebrate milestones — not Mastery or Trust by default. |
| **Progressive disclosure** | Skyboard may reveal Crests progressively; hidden Achievements remain non-essential. |
| **Annotations** | Revoked or voided underlying results may annotate or revoke related Crests while preserving audit history. |
| **Accessibility** | Every Crest needs a textual meaning path. |

---

## Explicit non-goals

- No Achievement catalogue lock in this Gate.
- No Skill-implying cosmetics.
- No payment-for-Achievement.
- No Achievement → Route-Proven shortcut.
- No Product Code, simulation, calibration, or technical validation claims.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | Crest families + Achievement types + rules; must supply catalogues and any award parameters under simulation discipline |
| **Calibration / simulation** | Must run before any numeric lock |
| **Product Code / implementation** | BLOCKED until later governed gates |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
