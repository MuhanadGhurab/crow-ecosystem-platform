# Progression System Separation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SEP-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-INVARIANTS.md](./PROGRESSION-INVARIANTS.md) · [PROGRESSION-IDENTIFIER-STANDARD.md](./PROGRESSION-IDENTIFIER-STANDARD.md) · [PROGRESSION-SOURCE-AUTHORITY.md](./PROGRESSION-SOURCE-AUTHORITY.md) · [PROGRESSION-LEDGER-MODEL.md](./PROGRESSION-LEDGER-MODEL.md) · [PROGRESSION-UNLOCK-BOUNDARY.md](./PROGRESSION-UNLOCK-BOUNDARY.md) · [../README.md](../README.md) · [../../learning/README.md](../../learning/README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: define eleven-system separation model |

---

## Purpose

Prevent any single progression measure from silently replacing another. GHURAVIA represents Activity, consistency, development maturity, demonstrated capability, multidisciplinary breadth, integrity/reliability, professional capability bundles, achievements, Prestige, and standings as **separate systems** with distinct meanings, inputs, and ledgers.

**Exact total:** **11** systems in the progression ecosystem, of which **Access Plan** is commercial and **outside** progression calculations.

---

## System inventory

| # | System | Domain | System ID |
|---|--------|--------|-----------|
| 1 | Access Plan | Commercial (outside progression) | — (commercial entitlement; no `PGS-*`) |
| 2 | Flight XP | Progression | `PGS-XP` |
| 3 | Momentum League | Progression | `PGS-MOM` |
| 4 | Maturity Rank | Progression | `PGS-MAT` |
| 5 | Route Mastery | Progression | `PGS-MST` |
| 6 | Breadth | Progression | `PGS-BRD` |
| 7 | Trust Standing | Progression | `PGS-TRU` |
| 8 | Professional Titles | Progression | `PGS-TTL` |
| 9 | Prestige Classes | Progression | `PGS-PRS` |
| 10 | Achievements and Crests | Progression | `PGS-ACH` |
| 11 | Leaderboards and Standings | Progression | `PGS-LDB` |

---

## 1. Access Plan (commercial — outside progression)

| Field | Definition |
|-------|------------|
| **Purpose** | Govern paid/free commercial entitlement: capacity, concurrent Routes, feature access windows, and plan duration. |
| **What it measures** | Commercial access state and capacity entitlement relative to the Access Plan catalogue. |
| **What it does NOT measure** | Skill, Mastery, Trust, Prestige, XP, Momentum, Maturity, Breadth, Titles, achievement worth, or leaderboard merit. |
| **Authoritative inputs** | `COMMERCIAL_EVENT` (subscription, renewals, cancellations, capacity changes); Merit Grant entitlement outcomes that temporarily confer plan-like access. |
| **Prohibited inputs** | Learning Evidence quality, assessment outcomes, popularity, Trust history used as payment, Mastery records used as billing proof. |
| **Persistence** | Entitlement state persists for the commercial period; historical billing records remain auditable under commercial policy. |
| **Expiry / season** | Plan periods and grace rules are commercial; they are **not** Momentum seasons and must not be encoded as progression Rank seasons. |
| **Reversibility** | Entitlement may start/stop with payment or Merit; completed learning Evidence and lifetime XP are not erased by plan expiry (see invariants). |
| **Visibility** | User-facing plan name and capacity; must never be labeled as Rank, Mastery, or Prestige. |
| **User-facing explanation** | “Your Access Plan controls how much of the world you can use at once — not how skilled you are.” |
| **Affected Unlocks** | Commercial capacity Unlocks only (entitlement gates). Must not unlock Mastery, Route-Proven, Titles, or Prestige. |
| **Appealability** | Billing/access disputes via commercial support paths; not Evidence appeals. |
| **Sensitive-decision status** | Commercial/privacy-sensitive; not a learning-integrity sensitive decision. |

---

## 2. Flight XP

| Field | Definition |
|-------|------------|
| **Purpose** | Represent cumulative recognized activity and contribution across the learning world. |
| **What it measures** | Volume and recognition of eligible activity/contribution events (learning, practice, contribution, team, Live Sky, reflection, remediation, service — as defined in XP architecture). |
| **What it does NOT measure** | Proven professional capability, Route-Proven, Horizon-Proven, Trust, Prestige, employment readiness, or Evidence quality by itself. |
| **Authoritative inputs** | Validated `LEARNING_EVENT`, selected `COMMUNITY_EVENT` / `TEAM_CONTRIBUTION_EVENT` / `LIVE_SKY_EVENT`, and governed contribution recognitions; never raw payment. |
| **Prohibited inputs** | Payment, plan tier multipliers on Evidence quality, popularity alone, integrity-voided events, unvalidated self-report without policy. |
| **Persistence** | Lifetime cumulative XP ledger; temporary inactivity does not erase lifetime XP. |
| **Expiry / season** | XP itself is not season-scoped; seasonal displays may snapshot XP for competitions without rewriting lifetime meaning. |
| **Reversibility** | Reversible via correction events when source events are voided or revoked; reversal must cite source records. |
| **Visibility** | User-facing Flight XP; optional public/community display only where privacy policy allows. |
| **User-facing explanation** | “Flight XP shows how much recognized activity and contribution you’ve built up — not that you are Route-Proven.” |
| **Affected Unlocks** | May contribute eligibility signals for visual evolution, selected community participation, or activity-gated experiences — never paid subscription or admin rights. |
| **Appealability** | Appeal of XP recognition via progression correction/appeal path when source event validity is disputed. |
| **Sensitive-decision status** | Generally non-sensitive relative to Mastery/Trust; still auditable. |

---

## 3. Momentum League

| Field | Definition |
|-------|------------|
| **Purpose** | Represent consistency and recent engagement cadence within a Momentum season. |
| **What it measures** | Season-scoped consistency of eligible activity relative to League placement rules (formulas PENDING). |
| **What it does NOT measure** | Long-term maturity, Mastery, Trust, Prestige, or professional capability. |
| **Authoritative inputs** | Season-scoped valid activity events (`LEARNING_EVENT` and other season-eligible sources per Momentum architecture). |
| **Prohibited inputs** | Payment, plan tier, popularity, Mastery standing, Trust standing used as League points. |
| **Persistence** | Season record persists historically; current League is season-bound. |
| **Expiry / season** | Bound to `MOM-SEASON-<YEAR>-<NUMBER>`; exact durations FORMULA PENDING / deferred to 1B. |
| **Reversibility** | Season standings may reverse when source events are voided within season policy. |
| **Visibility** | League badge and season standing; must be labeled as Momentum, not Maturity or Mastery. |
| **User-facing explanation** | “Momentum shows how consistently you’ve flown this season — not how mature or Mastered you are.” |
| **Affected Unlocks** | Season cosmetics, limited competitive participation; not Route-Proven or Titles. |
| **Appealability** | Season standing appeals via correction path; does not reopen Evidence review by itself. |
| **Sensitive-decision status** | Low–medium; competitive fairness sensitive, not employment-sensitive. |

---

## 4. Maturity Rank

| Field | Definition |
|-------|------------|
| **Purpose** | Represent long-horizon development maturity of the learner’s journey posture (breadth of sustained growth signals), distinct from season Momentum and from Mastery. |
| **What it measures** | Mature development stage along the canonical Maturity ladder (`MAT-HATCHLING` … `MAT-RAVEN`). |
| **What it does NOT measure** | Short-term activity spikes, single-Route Mastery, Trust reliability alone, Prestige distinction, or subscription status. |
| **Authoritative inputs** | Aggregated maturity progress signals from learning history and governed progression records (not payment). |
| **Prohibited inputs** | Payment, plan level, popularity, Mission volume alone, high XP alone, high Momentum alone. |
| **Persistence** | Maturity Record is long-lived; regressions only via governed correction/policy, not inactivity alone. |
| **Expiry / season** | Not season-scoped like Momentum; no season duration defined in 1A. |
| **Reversibility** | Possible only under correction/appeal with audit; not casual auto-decay from temporary inactivity. |
| **Visibility** | User-facing Maturity Rank; public display only under privacy rules. |
| **User-facing explanation** | “Maturity Rank reflects how far your overall learning journey has matured — not a single Route’s proof.” |
| **Affected Unlocks** | Journey presentation, selected mentoring/application eligibility signals; never admin or paid plan. |
| **Appealability** | Appealable as a progression standing decision when formula/policy applied incorrectly (formulas PENDING). |
| **Sensitive-decision status** | Medium; reputation-adjacent but not employment guarantee. |

---

## 5. Route Mastery

| Field | Definition |
|-------|------------|
| **Purpose** | Represent demonstrated capability on Capabilities and Routes based on Evidence and assessment outcomes. |
| **What it measures** | Capability Mastery and Route Mastery standing derived from approved Evidence / assessment / Capstone pathways (qualitative Proven rules already locked in Learning; numeric aggregation PENDING). |
| **What it does NOT measure** | Mere Mission completion volume, popularity, XP, Momentum, payment, or Horizon-Proven from a single Route. |
| **Authoritative inputs** | `EVIDENCE_EVENT`, `ASSESSMENT_EVENT`, Capstone/Proven events, integrity-validated records; Route-Proven qualitative conditions from Learning Design Baseline. |
| **Prohibited inputs** | Payment, plan multipliers on Evidence quality, community popularity, Mission volume alone, high XP alone. |
| **Persistence** | Mastery Record persists; Evidence revocation may affect current Mastery standing without erasing the historical Evidence event’s existence in the Flight Log when policy retains history. |
| **Expiry / season** | Freshness/revalidation is a Mastery concern (see Mastery freshness architecture); not Momentum seasons. |
| **Reversibility** | Mastery may reverse when Evidence is revoked or assessment voided; corrections audited. |
| **Visibility** | Private-first with optional portfolio sharing; Route-Proven display is distinct from completion badges. |
| **User-facing explanation** | “Mastery and Route-Proven show what you’ve demonstrated with Evidence — not how many Missions you finished or what you paid.” |
| **Affected Unlocks** | Route-Proven display, Cross-Wing review eligibility, Title/Prestige eligibility signals, reviewer application eligibility. |
| **Appealability** | High — Evidence and Mastery standing appeals are first-class. |
| **Sensitive-decision status** | **Sensitive** — consequential for professional claims. |

---

## 6. Breadth

| Field | Definition |
|-------|------------|
| **Purpose** | Represent multidisciplinary span across Horizons and multi-path achievements. |
| **What it measures** | Horizon-linked breadth records (`BRD-HRZ-*`) and multi-path breadth markers (`BRD-MULTI-*`). |
| **What it does NOT measure** | Depth of Mastery in one Route, Trust, Prestige Class alone, or Access Plan capacity. |
| **Authoritative inputs** | Evidence/assessment/Proven outcomes across distinct Horizons/Routes; not payment. |
| **Prohibited inputs** | Payment, popularity, XP totals alone, Momentum League alone. |
| **Persistence** | Breadth Record persists with source Evidence linkage. |
| **Expiry / season** | Not Momentum-season scoped; freshness may follow Mastery freshness for underlying proofs. |
| **Reversibility** | May reverse if underlying Mastery/Proven sources reverse. |
| **Visibility** | Portfolio/breadth surface (CONTROLLED LAUNCH surface; full depth POST-LAUNCH PLANNED). |
| **User-facing explanation** | “Breadth shows how many Horizons you’ve truly covered — not how busy you were in one place.” |
| **Affected Unlocks** | Breadth cosmetics, Horizon-related presentation, selected Prestige eligibility inputs. |
| **Appealability** | Appealable via underlying Evidence/Mastery appeals and Breadth aggregation corrections. |
| **Sensitive-decision status** | Medium. |

---

## 7. Trust Standing

| Field | Definition |
|-------|------------|
| **Purpose** | Represent integrity and community reliability governing social authority and eligibility for sensitive participation. |
| **What it measures** | Trust Standing derived from integrity outcomes, moderation, identity-assurance interactions (as Trust architecture defines), and reliability signals. |
| **What it does NOT measure** | Technical Mastery, popularity-as-skill, XP, payment loyalty, or Prestige Class. |
| **Authoritative inputs** | `INTEGRITY_EVENT`, moderation/review outcomes, Trust records (`TRU-REC-*`). |
| **Prohibited inputs** | Payment, plan tier, Mission volume, likes/popularity as Mastery proxies. |
| **Persistence** | Trust Ledger with historical sanctions and restorations. |
| **Expiry / season** | Sanctions may have durations (policy PENDING for exacts); Trust is not a Momentum League. |
| **Reversibility** | Restorations and appeal overturns; Trust violations do **not** erase valid historical learning Evidence. |
| **Visibility** | Often restricted; public Trust badges only where policy allows. |
| **User-facing explanation** | “Trust Standing shows how reliably you participate — not how skilled or popular you are.” |
| **Affected Unlocks** | Community responsibility, mentoring/reviewer eligibility, Live Sky roles, selected Merit/Prestige eligibility gates. |
| **Appealability** | **High** — Trust decisions are appealable. |
| **Sensitive-decision status** | **Sensitive**. |

---

## 8. Professional Titles

| Field | Definition |
|-------|------------|
| **Purpose** | Represent reviewed professional capability bundles (domain titles), not employment contracts. |
| **What it measures** | Eligibility and award of Professional Titles (`TTL-<DOMAIN>-<NUMBER>`) after governed review. |
| **What it does NOT measure** | Employment guarantee, accreditation, Access Plan status, or popularity. |
| **Authoritative inputs** | Mastery/Evidence/assessment bundles, Trust eligibility, review outcomes (`REVIEW_EVENT`). |
| **Prohibited inputs** | Payment-for-title, plan tier, XP alone, Momentum alone, community popularity alone. |
| **Persistence** | Title Record persists; may be suspended/revoked under integrity or Evidence reversal. |
| **Expiry / season** | Titles may require freshness/revalidation (policy PENDING); not Momentum seasons. |
| **Reversibility** | Revocable via correction/integrity; appealable. |
| **Visibility** | Portfolio-facing; catalogue deferred for final list. |
| **User-facing explanation** | “A Professional Title is a reviewed capability bundle — not a job offer or certificate of employment.” |
| **Affected Unlocks** | Title display, related mentoring/application signals; never DB privileges or employment status. |
| **Appealability** | High for award/denial/revocation. |
| **Sensitive-decision status** | **Sensitive**. |

---

## 9. Prestige Classes

| Field | Definition |
|-------|------------|
| **Purpose** | Represent exceptional distinction beyond ordinary activity or longevity. |
| **What it measures** | Prestige Class standing among Ascendant / Apex / Obsidian (`PRS-ASCENDANT`, `PRS-APEX`, `PRS-OBSIDIAN`). |
| **What it does NOT measure** | Mere XP, Momentum, payment, or permanent immunity from review. |
| **Authoritative inputs** | Governed Prestige review using Mastery/Breadth/Trust/selected Evidence and nomination pathways. |
| **Prohibited inputs** | Payment, subscription tier, popularity contests alone, activity longevity alone. |
| **Persistence** | Prestige Review Record; subject to review and integrity. |
| **Expiry / season** | Prestige is not sold as a season pass; revalidation may apply (PENDING). |
| **Reversibility** | Prestige may be revoked; **Prestige ≠ permanent immunity**. |
| **Visibility** | High-visibility distinction; must remain rare and explainable. |
| **User-facing explanation** | “Prestige marks exceptional distinction reviewed beyond ordinary activity — it does not sell Rank and does not stop future review.” |
| **Affected Unlocks** | Prestige display, Prestige Access Merit eligibility, selected nomination rights — never paid subscription grant by itself. |
| **Appealability** | High for nomination/review outcomes. |
| **Sensitive-decision status** | **Sensitive**. |

---

## 10. Achievements and Crests

| Field | Definition |
|-------|------------|
| **Purpose** | Recognize discrete accomplishments and visual Crests without substituting for Mastery or Trust. |
| **What it measures** | Achievement awards (`ACH-*`) and Crest grants (`CRS-*` families). |
| **What it does NOT measure** | Route-Proven, Horizon-Proven, Trust reliability, or Prestige Class by itself. |
| **Authoritative inputs** | Governed achievement rules over validated events; Prestige/Horizon/event Crests only via their governing systems. |
| **Prohibited inputs** | Payment-for-Crest, plan-tier Achievements that imply skill, popularity-only Crests that claim Mastery. |
| **Persistence** | Achievement Record; historical Crests may remain even if season League resets. |
| **Expiry / season** | Some Crests may be event/season scoped by ID family; durations PENDING. |
| **Reversibility** | Revocable if source events voided. |
| **Visibility** | Collectible/display-oriented; progressive disclosure on Skyboard. |
| **User-facing explanation** | “Achievements and Crests celebrate milestones — they are not the same as Mastery or Trust.” |
| **Affected Unlocks** | Visual evolution and display; not admin access. |
| **Appealability** | Medium — appeal when award incorrectly denied/granted. |
| **Sensitive-decision status** | Generally low; Prestige Crests inherit Prestige sensitivity. |

---

## 11. Leaderboards and Standings

| Field | Definition |
|-------|------------|
| **Purpose** | Present competitive or cooperative standings for limited, explainable boards. |
| **What it measures** | Standing within a defined board (season XP, Momentum, team contribution, etc. — board definitions PENDING). |
| **What it does NOT measure** | Mastery truth, Trust truth, Prestige truth, or employment ranking. |
| **Authoritative inputs** | Snapshots from the relevant ledger(s) for that board; never payment rank-buy. |
| **Prohibited inputs** | Purchased placement, popularity-only boards presented as Mastery, opaque scoring. |
| **Persistence** | Leaderboard Standing Record; historical board snapshots retained for audit. |
| **Expiry / season** | Many boards are season-scoped; season lengths PENDING. |
| **Reversibility** | Standings reverse when source ledger entries reverse. |
| **Visibility** | Limited launch boards; age/privacy filters apply. |
| **User-facing explanation** | “Leaderboards show standings for a specific race or season — they do not redefine your Mastery or Trust.” |
| **Affected Unlocks** | Board participation eligibility; never unrestricted social authority. |
| **Appealability** | Medium — fairness/integrity appeals. |
| **Sensitive-decision status** | Medium for competitive fairness; not employment-sensitive. |

---

## Cross-system non-substitution rule

No system may be used as a silent proxy for another in UI copy, eligibility engines, or ledgers. Cross-reads are allowed only as **explicit eligibility inputs** documented in unlock/Merit boundaries and source authority — never as meaning overwrite.

See [PROGRESSION-INVARIANTS.md](./PROGRESSION-INVARIANTS.md) and [PROGRESSION-LEDGER-MODEL.md](./PROGRESSION-LEDGER-MODEL.md).

---

## Exact totals

| Item | Total |
|------|------:|
| Systems defined in this document | **11** |
| Systems outside progression calculations | **1** (Access Plan) |
| Progression systems with `PGS-*` IDs | **10** |
