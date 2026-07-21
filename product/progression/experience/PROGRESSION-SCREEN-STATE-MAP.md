# Progression Screen State Map

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SCR-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-EXPLAINABILITY.md](./PROGRESSION-EXPLAINABILITY.md) · [PROGRESSION-SKYBOARD-COMPOSITION.md](./PROGRESSION-SKYBOARD-COMPOSITION.md) · [../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md](../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md) · [../fairness/AGE-PRIVACY-PROGRESSION.md](../fairness/AGE-PRIVACY-PROGRESSION.md) · [../governance/PROGRESSION-CORRECTION-AND-APPEAL.md](../governance/PROGRESSION-CORRECTION-AND-APPEAL.md) · [../../wireframes/progression/PROGRESSION-WIREFRAMES.md](../../wireframes/progression/PROGRESSION-WIREFRAMES.md) · [../../screens/MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §33 · System Separation · Explainability · Age/Privacy · Correction/Appeal |
| **Unresolved formula dependencies** | Display values, season labels, Rank thresholds → **GHV.PROGRESSION.1B** |
| **Unresolved technical dependencies** | UI Product Code, live data bindings → later technical gates |
| **Privacy classification** | User-facing; minor variants required |
| **Decision sensitivity** | Per screen — highest on Titles, Prestige, Trust-linked boards |
| **Appealability** | Surfaces must expose appeal/correction states when applicable |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Progression Screen Architecture Review |

---

## Purpose

Map conceptual progression screens **GHV-SCR-PRG-001 through GHV-SCR-PRG-008**: systems shown and excluded, primary user question, data sources, and required states — **without UI code**.

```text
STATUS: ARCHITECTURE RECOMMENDED
No UI code
FORMULA PENDING · Product Code BLOCKED
```

---

## Wireframe naming note

Locked low-fidelity wireframes may use **PRG-001 … PRG-006** naming from Product Definition / wireframe gates. This architecture map uses the **eight conceptual screens** from GHV.PROGRESSION.1A §33.

| Conceptual screen (1A) | Likely wireframe / registry affinity |
|------------------------|--------------------------------------|
| GHV-SCR-PRG-001 XP and Level | Part of wireframe **PRG-001** Progression Overview (XP panel) |
| GHV-SCR-PRG-002 Momentum League | Wireframe **PRG-002** Momentum League |
| GHV-SCR-PRG-003 Mastery Profile | Wireframe **PRG-003** Mastery Board |
| GHV-SCR-PRG-004 Breadth Map | May be nested in Mastery Board / Overview until dedicated wireframe |
| GHV-SCR-PRG-005 Achievements and Crests | Wireframe **PRG-004** Achievements |
| GHV-SCR-PRG-006 Professional Titles | May be Overview-linked until dedicated wireframe |
| GHV-SCR-PRG-007 Prestige Progress | Wireframe **PRG-006** Prestige View |
| GHV-SCR-PRG-008 Leaderboards | Wireframe **PRG-005** Leaderboards Limited |

Wireframe IDs do not override conceptual screen obligations below.

---

## Shared state vocabulary

| State | Architecture meaning |
|-------|----------------------|
| **Provisional** | Standing may change after integrity / season / review finalization |
| **Empty** | No records yet; teach meaning + next action |
| **Loading** | Data not yet available; no fake scores |
| **Correction** | Active or recent correction affecting displayed system |
| **Appeal** | Appeal open or recently resolved for displayed outcome |
| **Privacy** | Fields suppressed or Crow-identity-only |
| **Minor** | Ages 15–17 legally activated variant |
| **A11y** | Reduced motion, AT, contrast, non-punitive paths |
| **RTL** | Arabic-first layout and copy mirroring |
| **No-data** | Source missing or not applicable — explicit, not zero-as-proof |

All screens inherit explainability fields from [PROGRESSION-EXPLAINABILITY.md](./PROGRESSION-EXPLAINABILITY.md).

---

## GHV-SCR-PRG-001 — XP and Level

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Flight XP; Level as XP-derived presentation only (values PENDING 1B) |
| **Systems excluded** | Mastery, Route-Proven, Momentum season score as “skill,” Trust, Titles, Prestige, Access Plan as XP |
| **Primary user question** | “How much validated activity have I built up — and what does that *not* prove?” |
| **Data source** | XP ledger / validated learning & contribution events |
| **Provisional** | Show when underlying events are under integrity review |
| **Empty** | Explain XP meaning; CTA to first eligible Mission / activity |
| **Loading** | Skeleton / wait — no placeholder “proof” numbers presented as real |
| **Correction** | Surface XP correction applied / under review with permitted explanation |
| **Appeal** | Link when XP removal/application is appealable |
| **Privacy** | Crow identity context only; no email/phone/age/location |
| **Minor** | Same meaning copy; no employment implication; no adult-contact CTA |
| **A11y** | Reduced-motion safe; AT readable meaning and non-cause statements |
| **RTL** | Mirrored layout; Arabic meaning copy first-class |
| **No-data** | “XP not yet available” ≠ “zero Mastery” |
| **Cross-links** | Momentum (002), Mastery (003), Achievements (005), Skyboard learning action |
| **Prohibited interpretations** | XP ≠ Mastery ≠ employment readiness ≠ Title ≠ Prestige ≠ payment success |

---

## GHV-SCR-PRG-002 — Momentum League

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Momentum League season standing / consistency |
| **Systems excluded** | Lifetime XP as Momentum, Mastery, Prestige, payment tier as league boost |
| **Primary user question** | “How consistent have I been this season — without erasing my lifetime progress?” |
| **Data source** | Season Momentum ledger / season-eligible events |
| **Provisional** | Season boards may be provisional pending fair-play review |
| **Empty** | Explain seasonal meaning; optional join; no mandatory grind |
| **Loading** | No fake league position |
| **Correction** | Season corrections / reversals visible when they affect displayed standing |
| **Appeal** | Available when integrity limits wrongly applied |
| **Privacy** | Cohort lists show Crow identity only |
| **Minor** | Extra privacy; opt-in boards; no PII |
| **A11y** | No punishment for reduced motion; avoid unhealthy streak pressure copy |
| **RTL** | Full RTL season chrome and labels |
| **No-data** | Off-season or not joined — not a Mastery failure |
| **Cross-links** | XP (001), Leaderboards (008) if linked, Fair-play / appeal help |
| **Prohibited interpretations** | Momentum ≠ Mastery ≠ Prestige ≠ moral worth; absence ≠ erased learning |

---

## GHV-SCR-PRG-003 — Mastery Profile

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Capability Mastery, Route Mastery, Route-Proven (as applicable), supporting Evidence references |
| **Systems excluded** | XP volume as Mastery, Momentum, reactions, Access Plan, Prestige Class as automatic Mastery |
| **Primary user question** | “What can I demonstrate — based on approved Evidence and assessments?” |
| **Data source** | Mastery records; Evidence / assessment outcomes; freshness state |
| **Provisional** | Under review / reevaluation labeled clearly |
| **Empty** | Explain Evidence path; next Mission / Evidence CTA |
| **Loading** | No invented Mastery bars as final truth |
| **Correction** | Evidence revocation / restoration / assessment correction states |
| **Appeal** | Evidence revocation and Mastery-impacting decisions |
| **Privacy** | Portfolio visibility per policy; no private contact fields |
| **Minor** | No employment-eligibility implication |
| **A11y** | Accessible Evidence alternative CTAs where required |
| **RTL** | Evidence and rubric labels bilingual-capable |
| **No-data** | “Not yet demonstrated” ≠ “failed forever” |
| **Cross-links** | Breadth (004), Titles (006), XP (001) with separation callout, learning Route screens |
| **Prohibited interpretations** | Mastery ≠ XP; Route-Proven ≠ subscription; popularity ≠ technical Mastery |

---

## GHV-SCR-PRG-004 — Breadth Map

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Breadth dimensions / opportunities (intra-route, Horizon, multi-Horizon, integrated — as architecture defines) |
| **Systems excluded** | Enrollment alone as Breadth, XP alone as Breadth, payment as Breadth |
| **Primary user question** | “Where have I demonstrated capability across distinct areas — and what’s a fair next breadth step?” |
| **Data source** | Breadth records derived from Mastery / Route-Proven / verified cross-area Evidence |
| **Provisional** | When source Mastery is under reevaluation |
| **Empty** | Teach Breadth meaning; suggest legitimate next area — not FOMO |
| **Loading** | No fake map completion |
| **Correction** | Source Evidence / Mastery corrections may dim or reopen nodes via governed recalculation later |
| **Appeal** | Via source Evidence / Mastery appeal paths |
| **Privacy** | No personal data on shared breadth showcases |
| **Minor** | Age-safe pathway suggestions; no adult-only Prestige pressure |
| **A11y** | Map must be navigable without motion dependence |
| **RTL** | Map chrome and labels RTL-safe |
| **No-data** | Unavailable / unlaunched content must not be required (see SCN-012) |
| **Cross-links** | Mastery (003), Prestige eligibility context (007) without casual gamification, Route catalog |
| **Prohibited interpretations** | Breadth ≠ XP tourism; Breadth ≠ forced Live Sky; Breadth ≠ paid unlock of skill |

---

## GHV-SCR-PRG-005 — Achievements and Crests

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Achievements; Crest families |
| **Systems excluded** | Trust as collectible vanity, Titles as Crests, Prestige Classes as casual badges, payment Crests for skill |
| **Primary user question** | “What milestones have I earned — and which are collectible vs capability signals?” |
| **Data source** | Achievement / Crest ledgers tied to governed unlock rules |
| **Provisional** | If unlock depended on provisional standing |
| **Empty** | Explain collectible vs capability separation; suggest meaningful next milestone |
| **Loading** | Empty slots not presented as failures |
| **Correction** | Revoked unlocks leave audit; display reflects current standing |
| **Appeal** | When Achievement removal is disputed |
| **Privacy** | Showcase uses Crow identity |
| **Minor** | Safe showcase; no PII |
| **A11y** | Reduced-motion celebrations |
| **RTL** | Crest names and descriptions localized |
| **No-data** | No Crest ≠ no Mastery necessarily |
| **Cross-links** | Mastery (003), Prestige (007) with “not the same” callout, XP (001) |
| **Prohibited interpretations** | Crest ≠ Route-Proven; Achievement ≠ Professional Title; collectible ≠ employment |

---

## GHV-SCR-PRG-006 — Professional Titles

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Professional Title eligibility, review status, awarded Titles |
| **Systems excluded** | XP as Title proof, Momentum, payment, reaction counts, Prestige Class confusion |
| **Primary user question** | “Am I eligible for Title review — and what Evidence / Trust standing does review consider?” |
| **Data source** | Title records; eligibility derived from Mastery / Evidence / Trust policy (formulas PENDING) |
| **Provisional** | Nomination / under review ≠ awarded |
| **Empty** | Explain Title meaning; path to Evidence — not purchase CTA |
| **Loading** | No fake awarded Title |
| **Correction** | Title revocation / restoration under stronger review |
| **Appeal** | Denial and revocation appealable |
| **Privacy** | Crow identity; no personal contact data |
| **Minor** | **Must not imply employment eligibility** |
| **A11y** | Clear non-casual language; AT-readable status |
| **RTL** | Title names and status labels RTL-safe |
| **No-data** | Not eligible yet — explain gaps without shame FOMO |
| **Cross-links** | Mastery (003), Trust help, Prestige (007) separation, appeal |
| **Prohibited interpretations** | Title ≠ sold credential; Title ≠ XP level; Title ≠ automatic job eligibility |

---

## GHV-SCR-PRG-007 — Prestige Progress

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Prestige Class eligibility / nomination / standing (Ascendant / Apex / Obsidian Raven naming preserved where used) |
| **Systems excluded** | High XP alone, paid plan, leaderboard rank alone, casual Achievement equivalence |
| **Primary user question** | “Am I in a Prestige nomination or review path — and why isn’t this a normal badge?” |
| **Data source** | Prestige records; human review outcomes; capability / Breadth / Trust / impact inputs |
| **Provisional** | Candidate / nominated ≠ granted |
| **Empty** | Explain exceptional verified requirement; no purchase path |
| **Loading** | No speculative Class assignment |
| **Correction** | Revocation requires stronger review; history preserved |
| **Appeal** | Required for denial / revocation |
| **Privacy** | Crow identity; restricted mentoring/contact for minors |
| **Minor** | Age-sensitive controls; extra restrictions on Prestige / mentoring |
| **A11y** | Non-flashy mandatory motion; respectful copy |
| **RTL** | Class names and review status localized |
| **No-data** | Not a candidate — not a Trust failure by itself |
| **Cross-links** | Mastery (003), Breadth (004), Titles (006), Trust, appeal |
| **Prohibited interpretations** | Prestige ≠ XP grind; Prestige ≠ subscription; Prestige ≠ popularity; nomination ≠ award |

---

## GHV-SCR-PRG-008 — Leaderboards

| Aspect | Definition |
|--------|------------|
| **Systems displayed** | Policy-limited leaderboards / standings (Momentum, contribution, or other permitted boards) |
| **Systems excluded** | Mandatory participation, Mastery-as-popularity board, PII columns, payment-boosted ranks |
| **Primary user question** | “Where do I stand on an optional, fair, privacy-safe board — if I choose to participate?” |
| **Data source** | Standing aggregates from permitted seasonal or contribution ledgers; may be provisional |
| **Provisional** | Default posture for competitive boards pending integrity |
| **Empty / opt-out** | Participation not mandatory; opt-out must not block core progression |
| **Loading** | No fabricated rivals |
| **Correction** | Recalculation after moderation reversal / integrity later |
| **Appeal** | When removed or penalized standing is disputed |
| **Privacy** | **No personal data** — Crow identity only |
| **Minor** | Stricter privacy; unrestricted adult contact prohibited from board UX |
| **A11y** | Boards usable with AT; reduced motion for live updates |
| **RTL** | Rank tables RTL-safe |
| **No-data** | Board unavailable / opted out — explain without penalty framing |
| **Cross-links** | Momentum (002), XP (001) with separation, fair-play / appeal |
| **Prohibited interpretations** | Leaderboard ≠ Mastery; leaderboard ≠ Prestige; opt-out ≠ failure; reactions ≠ technical rank |

---

## Cross-screen prohibited narrative (global)

Across all eight screens, UX and copy must never claim:

* payment creates Skill Mastery, Rank, Title, or Prestige
* XP proves professional capability
* Momentum proves long-term maturity alone
* community popularity creates technical Mastery
* hidden unexplained scores control Trust, Title, or Prestige

---

## Explicit non-goals

* No UI code, components, or visual specs
* No numeric Level / Rank / season values
* No replacement of locked wireframe family documents
* No claim that all eight screens already have dedicated high-fidelity wireframes

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Expert review N/A for architecture
```
