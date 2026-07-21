# Momentum League Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-MOM-LGE-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [FLIGHT-XP-ARCHITECTURE.md](../xp/FLIGHT-XP-ARCHITECTURE.md) · Maturity Rank · Route Mastery · Learning intensity / remediation architectures |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Season duration, promotion/demotion thresholds, consistency-window lengths, grinding caps → **GHV.PROGRESSION.1B** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Momentum League Architecture |

## Purpose

Define **Momentum Leagues** as a **seasonal pacing and consistency** system that recognizes healthy engagement rhythms — **not** competence proof, Title determination, or erasure of XP / Mastery history.

```text
STATUS: ARCHITECTURE RECOMMENDED
Momentum = seasonal pacing / consistency
Momentum ≠ Mastery · ≠ Titles · ≠ XP erasure
Season duration pending GHV.PROGRESSION.1B
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What Momentum is** | A seasonal league standing reflecting qualifying activity consistency, healthy pacing, and recovery — within Iron → Diamond bands. |
| **What Momentum is not** | Proof of capability, employment readiness, Maturity Rank, Route-Proven, or Title eligibility. |
| **Independence** | Momentum may rise or fall without rewriting Flight XP totals or Mastery standing. |
| **Values** | Durations, thresholds, and window lengths are **FORMULA PENDING** (1B). |

---

## League ladder

Leagues are ordered from entry to highest seasonal band. IDs are stable; display names may localize.

| Order | League ID | Display name (working) |
|-------|-----------|------------------------|
| 1 | **MOM-IRON** | Iron |
| 2 | **MOM-BRONZE** | Bronze |
| 3 | **MOM-SILVER** | Silver |
| 4 | **MOM-GOLD** | Gold |
| 5 | **MOM-PLATINUM** | Platinum |
| 6 | **MOM-DIAMOND** | Diamond |

```text
Iron → Bronze → Silver → Gold → Platinum → Diamond
IDs: MOM-IRON … MOM-DIAMOND
```

Higher leagues signal stronger sustained pacing in the current season — not higher professional seniority.

---

## Season concept

| Concept | Architecture |
|---------|--------------|
| **Season** | A bounded time window during which Momentum standing is evaluated, promoted, maintained, or demoted. |
| **Season open** | Learners may enter placement or resume from prior seasonal context under governed rules. |
| **Season close** | Standing freezes for the season; historical badges may be awarded; next season starts with governed carry / reset policy (details pending 1B — **no duration claimed here**). |
| **Cross-season memory** | Historical season badges persist; they do not replace current-season standing. |

**Season duration is pending GHV.PROGRESSION.1B.** This Gate does not set calendar length.

---

## Participation and qualifying activity

| Topic | Rule |
|-------|------|
| **Participation** | Momentum applies to learners who opt into / are enrolled in seasonal Momentum tracking. Unranked learners may remain outside active league pressure. |
| **Qualifying activity** | Only governed learning, practice, Evidence progress, team/live participation, reflection, and remediation — aligned with Flight XP *eligibility ideas* — may count. Idle login, purchase, and peer reactions do not qualify. |
| **Consistency windows** | Momentum evaluates activity across consistency windows (definition pending 1B), preferring distributed healthy effort over single binge spikes. |
| **Healthy pacing** | Design prefers sustainable distribution of effort. Grinding that only spikes volume without learning quality receives diminishing or capped Momentum recognition. |
| **Accessibility / circumstances** | Documented accessibility needs and extraordinary circumstances must be considered via protected leave and adaptive pacing — not treated as “lack of grit.” |

---

## Recovery, promotion, maintenance, demotion

| Mechanism | Architecture |
|-----------|--------------|
| **Recovery** | Learners who fall behind or return after leave enter **RECOVERING** support paths. Remediation and return-to-path activity **support recovery** rather than punishing absence. |
| **Promotion** | Sustained qualifying consistency in a higher band may promote league standing within the season. |
| **Maintenance** | Meeting the season’s maintenance expectations keeps the current league without requiring endless escalation. |
| **Demotion** | Persistent under-participation relative to the current league’s maintenance bar may demote standing — **without** punitive collapse for missing a single day. |
| **Protected leave** | Governed leave pauses demotion pressure and preserves fair return paths. |
| **Anti-burnout** | Momentum must not incentivize unhealthy all-day grinding. Diminishing/capped recognition for excessive volume is mandatory at formula stage (1B). |

---

## Season close and historical badges

| Outcome | Architecture |
|---------|--------------|
| **Season close** | Standing moves to **SEASON_CLOSED** for that season instance; current live standing resets or re-places per 1B policy. |
| **Historical badges** | Season results may mint non-erasing historical badges (e.g. “Diamond — Season N”) that commemorate past pacing — not Mastery. |
| **No erasure of XP/Mastery** | Season close never deletes Flight XP or Mastery evidence history. |

---

## Paid plans and capacity

| Rule | Statement |
|------|-----------|
| **Capacity, not multipliers** | Paid plans may increase **capacity** (access to more Missions, Live seats, Evidence slots, etc.). They must **not** grant Momentum multipliers, auto-promotion, or league boosts. |
| **Fairness** | Momentum comparisons must remain about qualifying activity and pacing, not wallet size. |

---

## Binding rules

| ID | Rule |
|----|------|
| MOM-R1 | Momentum is **seasonal**. |
| MOM-R2 | Standing **may rise or fall** within and across seasons under governed rules. |
| MOM-R3 | Momentum **does not erase** Flight XP or Mastery. |
| MOM-R4 | Momentum **does not determine Titles**. |
| MOM-R5 | **No punitive collapse for missing a day.** Short gaps must not alone destroy standing. |
| MOM-R6 | **Grinding is diminishing and/or capped**; healthy distribution is preferred. |
| MOM-R7 | **Remediation and return paths support recovery.** |
| MOM-R8 | **Accessibility and circumstances** are considered via protected leave and adaptive policy. |
| MOM-R9 | **Paid plans increase capacity, not Momentum multipliers.** |
| MOM-R10 | **Season duration and numeric thresholds pending GHV.PROGRESSION.1B.** |

---

## State vocabulary

Use only these Momentum states:

| State | Meaning |
|-------|---------|
| **UNRANKED** | Not participating in active league evaluation. |
| **PLACEMENT** | Being placed into an initial league for the season. |
| **ACTIVE** | Participating with standing in a league. |
| **AT_RISK** | Below maintenance expectations; demotion risk if unrecovered. |
| **RECOVERING** | On a supported return/recovery path after leave, gap, or demotion risk. |
| **PROMOTED** | Recently promoted; may transition back to ACTIVE. |
| **MAINTAINED** | Met maintenance for the evaluation period. |
| **DEMOTED** | Recently demoted; may transition to ACTIVE/RECOVERING. |
| **SEASON_CLOSED** | Season ended; live evaluation paused pending next season. |

States are architectural labels — transition thresholds pending 1B.

---

## Explicit non-goals

- No Momentum → Title automatic mapping.
- No Momentum → Mastery automatic mapping.
- No single-day punishment collapse.
- No pay-to-win league boosts.
- No season length, promotion points, or demotion percentages in this document.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | League IDs, states, and qualitative rules; must supply simulated season length and thresholds |
| **Calibration / simulation** | Required before numeric lock |
| **Product Code / implementation** | BLOCKED |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
