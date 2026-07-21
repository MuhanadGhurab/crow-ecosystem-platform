# Leaderboard Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-LDB-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [FLIGHT-XP-ARCHITECTURE.md](../xp/FLIGHT-XP-ARCHITECTURE.md) · [MOMENTUM-LEAGUE-ARCHITECTURE.md](../momentum/MOMENTUM-LEAGUE-ARCHITECTURE.md) · [ROUTE-MASTERY-ARCHITECTURE.md](../mastery/ROUTE-MASTERY-ARCHITECTURE.md) · [TRUST-STANDING-ARCHITECTURE.md](../trust/TRUST-STANDING-ARCHITECTURE.md) · [BREADTH-ARCHITECTURE.md](../breadth/BREADTH-ARCHITECTURE.md) · [ACHIEVEMENT-CREST-ARCHITECTURE.md](../achievements/ACHIEVEMENT-CREST-ARCHITECTURE.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Board scoring formulas, season lengths, tie-break details → **GHV.PROGRESSION.1B** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Leaderboard Architecture |

## Purpose

Define **Leaderboards and Standings** as **separated, explainable boards** for limited competitive or cooperative contexts — **not** as a universal ranking of Skill, Trust, Prestige, or employment worth.

```text
STATUS: ARCHITECTURE RECOMMENDED
Separated boards · NO universal ranking
XP board ≠ Skill · Momentum is seasonal
Formulas pending GHV.PROGRESSION.1B
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What Leaderboards are** | Scoped standings within a named board whose inputs, season (if any), and meaning are explicit. |
| **What they are not** | A single global “best expert” ranking, a Trust popularity score, a Mastery truth substitute, or a purchasable placement. |
| **System ID** | `PGS-LDB` |
| **Values** | Scoring formulas, season durations, and placement cutoffs are **FORMULA PENDING** (1B). This Gate defines board separation, states, and binding rules only. |

---

## Separated boards

Exact totals for separated board classes in this Gate: **8**.

There is **no universal ranking** that merges these boards into one Skill or Prestige order.

| Board class | What it may stand for | What it must not claim |
|-------------|----------------------|------------------------|
| **Route Mastery** | Relative standing among participants with approved Evidence on a Route / Mastery scope | Universal expert rank across all domains |
| **Horizon Progress** | Progress standing within a Horizon’s governed progress signals | Horizon-Proven by leaderboard alone |
| **Momentum** | Season-scoped consistency / League-related standing | Long-term Maturity or Mastery |
| **Community Contribution** | Governed contribution quality/impact signals | Raw post volume as merit |
| **Team** | Team or attributable team-contribution standings | Individual Mastery by team association alone |
| **Live Event** | Live Sky / event-era standings | Permanent Skill or Prestige |
| **Cross-Wing** | Cross-Wing demonstration / contribution standings under governed rules | Automatic full multi-Horizon Prestige |
| **Evidence Excellence** | Excellence among approved Evidence under review standards | Popularity or unpaid vanity metrics as Evidence quality |

Board catalogues and exact scoring remain PENDING 1B; architecture forbids collapsing them into one universal board.

---

## Standing states

Exact totals for standing states in this Gate: **9**.

| State | Meaning |
|-------|---------|
| **NOT_ELIGIBLE** | Participant does not meet board eligibility (privacy, age, Evidence, season, or scope rules). |
| **ELIGIBLE** | Eligible to appear; not yet placed or not currently placed. |
| **PLACED** | Currently placed on the active board under board rules. |
| **PROVISIONAL** | Placement shown pending finalization (e.g. season end, review window). |
| **FINAL** | Placement finalized for the board period / snapshot. |
| **UNDER_REVIEW** | Standing flagged for integrity, Evidence, or fairness review. |
| **CORRECTED** | Standing updated after governed correction. |
| **REMOVED** | Removed from board display for governed cause (eligibility loss, voided source, privacy, or sanction). |
| **SEASON_ARCHIVED** | Season or board period archived; historical snapshot preserved. |

---

## Binding rules

| ID | Rule |
|----|------|
| LDB-R1 | **No universal ranking.** Boards remain separated; UI must not present a single “overall Skill” ladder from mixed boards. |
| LDB-R2 | **XP board ≠ Skill.** Any Flight XP–based board is activity/contribution standing only. |
| LDB-R3 | **Momentum boards are seasonal.** Momentum standing is season-scoped; seasons archive rather than silently rewrite lifetime Mastery. |
| LDB-R4 | **Mastery boards need approved Evidence.** Route Mastery / Evidence Excellence boards require approved Evidence (or equivalent governed demonstration inputs) — not Mission clicks alone. |
| LDB-R5 | **Community boards ≠ raw post volume.** Contribution boards must use governed contribution signals, not mere posting frequency. |
| LDB-R6 | **Trust is not a public popularity score.** Do not operate a “Trust leaderboard” of likes/reactions as Trust Standing. |
| LDB-R7 | **Minors receive extra privacy.** Age-appropriate defaults may hide or restrict public standings. |
| LDB-R8 | **Crow identities may appear publicly** where the participant opts into public Crow display. |
| LDB-R9 | **Real names are not required** for leaderboard participation or display. |
| LDB-R10 | **Opt-out / privacy controls** must exist for public board appearance where policy requires. |
| LDB-R11 | **Ties are governed.** Tie handling is explicit policy (details PENDING 1B) — not arbitrary silent favoritism. |
| LDB-R12 | **Suspicious activity → UNDER_REVIEW.** Integrity concerns pause finalization for affected rows. |
| LDB-R13 | **Revoked Evidence updates standings.** Voided or revoked source Evidence must correct or remove dependent placements. |
| LDB-R14 | **Season history is preserved.** Archived seasons remain auditable snapshots (`SEASON_ARCHIVED`). |
| LDB-R15 | **Low participation ≠ misleading “top expert.”** Boards with sparse participation must not be labeled as definitive domain expertise. |
| LDB-R16 | **Paid plans have no scoring multipliers.** Access Plan tiers must not multiply board scores. |
| LDB-R17 | **Global boards do not replace Route context.** Cross-cutting boards must not erase Route-scoped meaning of Mastery or Proven. |
| LDB-R18 | **Formulas pending GHV.PROGRESSION.1B.** |

---

## Relationship to other systems

| System | Boundary |
|--------|----------|
| **Flight XP** | May feed XP-scoped boards only; never Mastery truth. |
| **Momentum League** | Season boards align with Momentum seasons; distinct from Maturity. |
| **Route Mastery / Evidence** | Mastery and Evidence Excellence boards consume approved demonstration inputs. |
| **Trust Standing** | May gate eligibility; Trust is not a popularity board. |
| **Breadth / Cross-Wing** | Cross-Wing boards reflect governed cross-scope signals — not automatic Prestige. |
| **Achievements / Crests** | May celebrate board milestones without redefining Skill. |
| **Access Plan** | Eligibility for participation capacity only — never score multipliers or purchased placement. |

---

## Visibility, privacy, and fairness

| Concept | Architecture |
|---------|--------------|
| **Learner-facing copy** | Each board must name what it measures and what it does not. |
| **Public vs private** | Opt-out and age rules apply; Crow identity display is allowed without real-name requirement. |
| **Corrections** | CORRECTED / REMOVED / UNDER_REVIEW states are first-class. |
| **Appeals** | Fairness and integrity appeals may challenge standings without reopening unrelated Evidence reviews unless source validity is the issue. |

---

## Explicit non-goals

- No universal Skill ranking.
- No paid score multipliers or purchased placement.
- No Trust-as-popularity leaderboard.
- No formula, season duration, or placement cutoff lock in this Gate.
- No Product Code, simulation, calibration, or technical validation claims.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | Separated board classes + states + rules; must supply scoring formulas, season parameters, and tie policy under simulation discipline |
| **Calibration / simulation** | Must run before any numeric lock |
| **Product Code / implementation** | BLOCKED until later governed gates |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
