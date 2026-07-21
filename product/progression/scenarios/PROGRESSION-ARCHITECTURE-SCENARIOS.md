# Progression Architecture Scenarios

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SCN-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [../architecture/PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../architecture/MERIT-PROGRESSION-BOUNDARY.md](../architecture/MERIT-PROGRESSION-BOUNDARY.md) · [../governance/PROGRESSION-CORRECTION-AND-APPEAL.md](../governance/PROGRESSION-CORRECTION-AND-APPEAL.md) · [../integrity/PROGRESSION-ANTI-GAMING-ARCHITECTURE.md](../integrity/PROGRESSION-ANTI-GAMING-ARCHITECTURE.md) · [../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md](../mastery/MASTERY-FRESHNESS-ARCHITECTURE.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §34 · Permanent Separation Rules · Unlock / Merit boundaries · Correction / Anti-Gaming / Fairness |
| **Unresolved formula dependencies** | All magnitudes → **GHV.PROGRESSION.1B**; integrity calibration → **1C** |
| **Unresolved technical dependencies** | Executable scenario harness → later technical validation |
| **Privacy classification** | Architecture scenarios — no live user data |
| **Decision sensitivity** | Architecture review evidence only |
| **Appealability** | N/A (scenario document); scenarios assert appeal availability where gated |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Architecture-Level Progression Scenarios |

---

## Purpose

Document architecture-level scenarios **SCN-001 through SCN-015** exactly as specified in GHV.PROGRESSION.1A §34, with expected outcomes and a **PASS** result when the 1A architecture supports each scenario.

```text
STATUS: ARCHITECTURE RECOMMENDED
Architecture support review — NOT simulation
SIMULATION NOT RUN · FORMULA PENDING · Product Code BLOCKED
```

These scenarios validate **separation and governance architecture**, not numeric formulas or Product Code behavior.

---

## SCN-001 — High XP, Low Mastery

**Setup:** A learner completes many activities but has weak Evidence.

**Expected outcomes:**

* XP may be high.
* Momentum may be active.
* Mastery remains developing.
* No Route-Proven.
* No misleading Title.

**Architecture support:** Flight XP recognizes activity without proving competence; Mastery / Route-Proven require approved Evidence; Titles cannot be inferred from XP; explainability copy states XP does not prove Mastery.

**Result:** **PASS**

---

## SCN-002 — Low Activity, Strong Evidence

**Setup:** An experienced learner produces strong Evidence efficiently.

**Expected outcomes:**

* XP may be moderate.
* Mastery may be strong.
* Route-Proven may be possible.
* Momentum may remain ordinary.
* No activity-volume penalty.

**Architecture support:** Mastery is Evidence/assessment-based; fairness forbids punishing efficient / experienced learners for lower activity volume; XP and Momentum remain separate from Mastery.

**Result:** **PASS**

---

## SCN-003 — Subscription Upgrade

**Setup:** A learner upgrades to Expedition Pass.

**Expected outcomes:**

* Entitlements and capacity change.
* No progression standing changes.
* No XP.
* No Mastery.
* No Rank.

**Architecture support:** Access Plan is commercial entitlement only; permanent separation rules forbid payment creating XP, Momentum, Maturity, Mastery, Breadth, Trust, Titles, or Prestige.

**Result:** **PASS**

---

## SCN-004 — Merit Grant

**Setup:** A learner earns a Route Grant.

**Expected outcomes:**

* Access changes.
* Progression remains unchanged until learning occurs.

**Architecture support:** Merit / unlock boundary treats grants as entitlement outcomes, not Skill standing; progression ledgers move only when eligible learning / Evidence events occur afterward.

**Result:** **PASS**

---

## SCN-005 — Evidence Revoked

**Setup:** Previously approved Evidence is revoked.

**Expected outcomes:**

* History remains.
* Affected Mastery enters reevaluation.
* Route-Proven may be reevaluated.
* Unrelated XP and Evidence remain.

**Architecture support:** Correction architecture requires new records and preserved history; Evidence revocation targets dependent Mastery / Route-Proven without silently wiping unrelated XP or unrelated valid Evidence.

**Result:** **PASS**

---

## SCN-006 — Long Inactivity

**Setup:** Learner is inactive for a long period, then returns.

**Expected outcomes:**

* XP preserved.
* Mastery preserved or refresh may be recommended.
* Momentum may decline or season-close.
* Trust remains unchanged without a conduct event.
* Returning-user recovery is available.

**Architecture support:** Fairness rule — absence must not erase learning; Momentum is seasonal; freshness may recommend reevaluation without blanket Mastery wipe; Trust unchanged absent conduct/integrity events.

**Result:** **PASS**

---

## SCN-007 — Community Popularity

**Setup:** Learner receives high reactions / popularity.

**Expected outcomes:**

* Reactions do not create technical Mastery.
* Validated contribution may affect contribution XP or Trust.
* Popularity alone creates no Title or Prestige.

**Architecture support:** Source authority and invariants — community popularity does not create Mastery; Titles and Prestige require verified capability / review, not reactions.

**Result:** **PASS**

---

## SCN-008 — Team Success, Weak Individual Contribution

**Setup:** Team succeeds; individual contribution is weak.

**Expected outcomes:**

* Team result recorded.
* Individual contribution reviewed separately.
* No automatic full capability credit.

**Architecture support:** Team / Live Sky sources separate team outcomes from individual Mastery credit; anti-gaming addresses artificial Team contribution; no automatic full capability credit.

**Result:** **PASS**

---

## SCN-009 — Confirmed Integrity Violation

**Setup:** Integrity violation is confirmed.

**Expected outcomes:**

* Relevant Evidence and Trust are reviewed.
* Unrelated valid learning history remains.
* Appeal available.
* Prestige or reviewer authority may be suspended.

**Architecture support:** Integrity finding is a correction cause; unrelated history preserved; appeals tracked; Prestige / reviewer authority may be suspended under stronger review — not a silent full-history erase.

**Result:** **PASS**

---

## SCN-010 — Momentum Grinding

**Setup:** Learner attempts unhealthy high-volume Momentum farming.

**Expected outcomes:**

* Unhealthy volume does not dominate.
* Category limits or diminishing recognition apply conceptually.
* Mastery unchanged without Evidence.

**Architecture support:** Anti-gaming defines diminishing recognition and category caps conceptually; Momentum ≠ Mastery; fairness rejects unhealthy streak pressure while still limiting empty grind dominance.

**Result:** **PASS**

---

## SCN-011 — Route-Proven Achieved

**Setup:** Learner meets Route-Proven requirements via approved pathway.

**Expected outcomes:**

* Mastery and Route-Proven update.
* Relevant Crest or Achievement may unlock.
* Cross-Wing eligibility may update.
* Subscription remains separate.

**Architecture support:** Route-Proven is distinct from XP/Momentum/payment; Achievements/Crests may unlock from governed proven events; Access Plan remains commercial and unchanged by proven standing.

**Result:** **PASS**

---

## SCN-012 — RT-ANL-001 Not Launched

**Setup:** Reserve / unlaunched route content (example RT-ANL-001) is not available.

**Expected outcomes:**

* Reserve architecture remains invisible or clearly future-facing.
* No user can earn launch Mastery from unlaunched content.
* No Breadth requirement depends on unavailable reserve content.

**Architecture support:** Breadth and Mastery architectures forbid requiring unavailable content; screen state map no-data rules; fairness/accessibility against impossible mandatory paths.

**Result:** **PASS**

---

## SCN-013 — Prestige Candidate

**Setup:** Learner appears to meet Prestige interest signals (including high XP).

**Expected outcomes:**

* Eligibility and nomination only.
* Human review required.
* High XP alone is insufficient.
* Paid plan has no effect.

**Architecture support:** Prestige architecture — nomination ≠ grant; human review required; XP insufficient; payment must not grant Prestige; Skyboard must not casual-gamify Prestige.

**Result:** **PASS**

---

## SCN-014 — Moderation Decision Overturned

**Setup:** A moderation decision is overturned on review/appeal.

**Expected outcomes:**

* Affected Trust restriction reversed.
* Audit preserved.
* Leaderboard or role eligibility recalculated later.
* No unrelated Mastery modification.

**Architecture support:** Moderation reversal is a correction cause; history/audit preserved; Trust reversals do not auto-award Mastery; leaderboard/role eligibility may recalculate later as a separate governed step.

**Result:** **PASS**

---

## SCN-015 — Content Becomes Outdated

**Setup:** Learning content or capability expectations become outdated relative to prior Evidence.

**Expected outcomes:**

* Historical Evidence remains.
* Refresh recommendation may appear.
* Current capability standing may require targeted Evidence.
* No blanket reset.

**Architecture support:** Mastery freshness architecture — recommend refresh / targeted Evidence; preserve historical Evidence; forbid blanket wipe of valid history.

**Result:** **PASS**

---

## Scenario PASS table

| Scenario | Title | Result |
|----------|-------|--------|
| SCN-001 | High XP, Low Mastery | **PASS** |
| SCN-002 | Low Activity, Strong Evidence | **PASS** |
| SCN-003 | Subscription Upgrade | **PASS** |
| SCN-004 | Merit Grant | **PASS** |
| SCN-005 | Evidence Revoked | **PASS** |
| SCN-006 | Long Inactivity | **PASS** |
| SCN-007 | Community Popularity | **PASS** |
| SCN-008 | Team Success, Weak Individual Contribution | **PASS** |
| SCN-009 | Confirmed Integrity Violation | **PASS** |
| SCN-010 | Momentum Grinding | **PASS** |
| SCN-011 | Route-Proven Achieved | **PASS** |
| SCN-012 | RT-ANL-001 Not Launched | **PASS** |
| SCN-013 | Prestige Candidate | **PASS** |
| SCN-014 | Moderation Decision Overturned | **PASS** |
| SCN-015 | Content Becomes Outdated | **PASS** |

**Totals:** 15 scenarios documented · **15 PASS** · 0 FAIL · 0 BLOCKED by architecture gaps in 1A separation/governance scope.

**Not claimed:** Simulation run, formula lock, calibration, technical validation, or Product Code execution of these scenarios.

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
Scenario architecture support: 15/15 PASS
```
