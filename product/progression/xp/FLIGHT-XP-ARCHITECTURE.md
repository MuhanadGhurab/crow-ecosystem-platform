# Flight XP Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-XP-FLT-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md) · [EVIDENCE-REVIEW-MODEL.md](../../learning/evidence/EVIDENCE-REVIEW-MODEL.md) · [REMEDIATION-ARCHITECTURE.md](../../learning/architecture/REMEDIATION-ARCHITECTURE.md) · Momentum · Maturity · Mastery architectures |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Category weights, event values, caps, and reversal magnitudes → **GHV.PROGRESSION.1B** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Flight XP Architecture |

## Purpose

Define **Flight XP** as the cumulative recognition of meaningful activity and contribution on the platform — **not** as proof of competence, employment readiness, Rank seniority, Route-Proven status, or Title eligibility.

```text
STATUS: ARCHITECTURE RECOMMENDED
Flight XP = recognized activity / contribution
Flight XP ≠ proven competence
Values pending GHV.PROGRESSION.1B
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What XP is** | A lifetime (normally non-decaying) ledger of **recognized activity and contribution** across governed categories. |
| **What XP is not** | Proof that the learner can perform a capability, pass an assessment, hold a Rank, earn a Title, or claim Route-Proven / Horizon-Proven. |
| **Authority separation** | Competence signals live in **Mastery** and Evidence review. Long-term development profile lives in **Maturity Rank**. Seasonal pacing lives in **Momentum League**. XP only records that recognized work happened. |
| **Values** | All magnitudes, caps, and weights are **FORMULA PENDING** (1B). This document defines categories, eligibility logic, and prohibited interpretations only. |

---

## Category registry

Each category below is a governed XP lane. Events may map to at most one primary category unless a later Gate explicitly defines dual attribution with anti-double-count rules.

### XP-LEARNING

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Completing governed learning units (Stages, Missions, structured Nest modules) when completion is authentic and not idle/background. Assessment *attempt* may contribute only as learning activity recognition — not as Mastery. |
| **Why it exists** | Recognizes time-on-path engagement with curriculum so learners see progress for studying, not only for final Evidence. |
| **Quality / validation** | Completion must pass platform authenticity checks; trivial skip-through or auto-play without engagement is ineligible. |
| **Repeatability** | Replaying the same completed unit does not grant unlimited repeat XP. Refresh or higher-difficulty revisits may be eligible only under governed re-engagement policy (pending 1B). |
| **Anti-farming** | No XP for idle tabs, background playback, or rapid empty submits. Diminishing recognition for low-value repeats. |
| **Reversal** | Fraudulent or invalidated completions are reversed from the ledger. |
| **Visibility** | Shown as learning-activity recognition in Flight Log; must not be labeled “skill unlocked.” |
| **Prohibited interpretations** | Must not be read as demonstrated capability or Route-Proven. |

### XP-PRACTICE

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Labs, drills, sandboxes, practice Missions, and deliberate practice sessions that produce observable effort under governed practice constructs. |
| **Why it exists** | Separates hands-on rehearsal from passive content consumption. |
| **Quality / validation** | Practice must meet minimum engagement / completion criteria for the practice construct; empty starts do not qualify. |
| **Repeatability** | Practice may be repeated for skill building, but low-value identical loops are capped or diminished (policy pending 1B). |
| **Anti-farming** | Automated bots, idle holds, and identical micro-loops without variation are ineligible or heavily constrained. |
| **Reversal** | Invalidated practice sessions reverse XP. |
| **Visibility** | Practice recognition; not a competence badge. |
| **Prohibited interpretations** | Practice XP ≠ MEETS_STANDARD Evidence or Mastery state. |

### XP-EVIDENCE

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Submission of Evidence artifacts; **approval** of Evidence may create activity XP recognizing the contribution of producing reviewable work. |
| **Why it exists** | Rewards the act of documenting and submitting work that can be reviewed — distinct from whether Mastery aggregation later accepts that Evidence as capability proof. |
| **Quality / validation** | Approval creates recognition of **activity/contribution**; rubric level remains an Evidence quality signal for Mastery, not an automatic XP multiplier formula in this Gate. |
| **Repeatability** | Revisions of the same Evidence pack do not endlessly stack XP; governed revision recognition may apply once per meaningful revision cycle. |
| **Anti-farming** | Spam submissions, empty artifacts, and copy-paste packs without learner ownership are ineligible and may trigger integrity review. |
| **Reversal** | Revoked or fraudulent Evidence reverses associated XP-EVIDENCE recognition. |
| **Visibility** | May appear as “Evidence activity recognized”; must not display as “Mastery granted.” |
| **Prohibited interpretations** | **Evidence approval may create activity XP, but Mastery remains separate.** XP-EVIDENCE never equals Mastery state change. |

### XP-CONTRIBUTION

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Governed community or product contributions that add durable value (e.g. approved knowledge contributions, structured peer help under contribution programs) — not casual chat. |
| **Why it exists** | Recognizes constructive contribution beyond personal learning path completion. |
| **Quality / validation** | Contribution must pass moderation / contribution-program criteria; self-nomination alone is insufficient. |
| **Repeatability** | Subject to contribution-program caps; no unlimited micro-posts for XP. |
| **Anti-farming** | Low-effort spam, upvote rings, and templated noise are excluded. |
| **Reversal** | Removed or fraudulent contributions reverse XP. |
| **Visibility** | Contribution recognition in Flight Log. |
| **Prohibited interpretations** | Not employment history, not Title proof, not Mastery. |

### XP-TEAM

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Recognized participation in governed Team / collaborative Missions where individual contribution is attributable. |
| **Why it exists** | Values collaboration without collapsing individual accountability. |
| **Quality / validation** | Attribution and role evidence required; spectator or idle team membership is ineligible. |
| **Repeatability** | Team events may recur seasonally; identical idle re-joins do not farm XP. |
| **Anti-farming** | No XP for mere roster presence; contribution attribution is mandatory. |
| **Reversal** | Integrity failures or false attribution reverse XP. |
| **Visibility** | Team-activity recognition; separate from peer-reaction social signals. |
| **Prohibited interpretations** | Team XP ≠ leadership Title or Maturity Rank. |

### XP-LIVE

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Participation in governed Live / Live Sky / scheduled live learning events when attendance and engagement criteria are met. |
| **Why it exists** | Recognizes real-time cohort participation as distinct from async self-study. |
| **Quality / validation** | Check-in alone is insufficient if engagement policy requires active participation; proxy/bot attendance invalid. |
| **Repeatability** | Replaying recordings may map to XP-LEARNING/PRACTICE if governed — not automatic duplicate Live XP. |
| **Anti-farming** | Idle join, mute AFK, and multi-account attendance farming are prohibited. |
| **Reversal** | Invalid attendance reverses XP. |
| **Visibility** | Live-participation recognition. |
| **Prohibited interpretations** | Live XP ≠ assessment pass or Mastery. |

### XP-REFLECTION

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Structured reflection artifacts (journals, after-action notes, guided retros) tied to Missions / Evidence / remediation cycles when they meet quality gates. |
| **Why it exists** | Encourages metacognition and self-correction as first-class activity — supporting Maturity dimensions without substituting for Mastery. |
| **Quality / validation** | Minimum substance criteria; empty forms and single-word fills are ineligible. |
| **Repeatability** | One meaningful reflection per governed reflection window; spam reflections do not stack. |
| **Anti-farming** | Template paste and AI-generated empty reflections without learner ownership fail validation. |
| **Reversal** | Integrity invalidation reverses XP. |
| **Visibility** | Reflection activity; not a Rank upgrade. |
| **Prohibited interpretations** | Reflection XP ≠ Maturity Rank advancement by itself. |

### XP-REMEDIATION

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Completing assigned remediation paths after failed assessments, Evidence revision cycles, or integrity-remediation plans when remediation is **assigned and completed in good faith**. |
| **Why it exists** | Recognizes recovery work so learners are not punished into invisibility — without creating an incentive to fail deliberately. |
| **Quality / validation** | Only governed remediation blueprints qualify; voluntary “fail on purpose then remediate” patterns are detected and excluded or reversed. |
| **Repeatability** | Remediation recognition is available when remediation is required; looping deliberate failure → remediation is anti-farmed. |
| **Anti-farming** | **Remediation recognition without rewarding deliberate failure.** Systems must not make failing first more valuable than succeeding first. |
| **Reversal** | Fraudulent remediation completions reverse XP; may escalate to integrity. |
| **Visibility** | Remediation activity; framed as recovery, not as a preferred path. |
| **Prohibited interpretations** | Remediation XP is not a badge of weakness or a substitute for first-pass Mastery. |

### XP-SERVICE

| Dimension | Architecture rule |
|-----------|-------------------|
| **Eligible events** | Governed service roles that help the learning ecosystem (e.g. structured mentoring shifts, community stewardship under service programs) — **distinct from** moderator/reviewer operational work. |
| **Why it exists** | Values stewardship and mentoring as contribution, under separate governance from technical competence claims. |
| **Quality / validation** | Service program enrollment + verified service delivery; self-claim insufficient. |
| **Repeatability** | Service hours/events under program caps (pending 1B). |
| **Anti-farming** | Fake mentoring sessions and circular “service” for XP are prohibited. |
| **Reversal** | Invalid service claims reverse XP. |
| **Visibility** | Service recognition; not Rank or Title. |
| **Prohibited interpretations** | Service XP ≠ moderator authority and ≠ Mastery. |

---

## Cross-cutting rules (binding)

| ID | Rule |
|----|------|
| XP-R1 | **Lifetime, normally no decay.** Flight XP is cumulative. Ordinary inactivity does not decay XP. |
| XP-R2 | **Fraudulent activity is corrected via reversal**, not silent rewrite of history without audit. Reversals are visible in governed audit/Flight Log correction trails. |
| XP-R3 | **No unlimited low-value repeat XP.** Every category must eventually bind caps, cooldowns, or diminishing recognition (magnitudes pending 1B). |
| XP-R4 | **Remediation is recognized without rewarding deliberate failure.** Design and anti-farming must prefer first-pass success over fail-then-farm paths. |
| XP-R5 | **Evidence approval may create activity XP; Mastery remains separate.** Rubric outcomes inform Mastery evaluation, not automatic XP = competence. |
| XP-R6 | **Peer reactions (likes, reactions, applause) grant no technical Flight XP.** Social warmth is not a progression currency for competence lanes. |
| XP-R7 | **Purchase grants no XP.** Paid plans, packs, or merch never mint Flight XP. |
| XP-R8 | **Login streaks alone are not meaningful XP.** Presence without recognized activity does not earn Flight XP. |
| XP-R9 | **Idle / background activity grants no XP.** |
| XP-R10 | **Moderator / reviewer operational activity** uses **separate governed categories** (service/ops ledgers), not learner technical XP categories, and must not inflate learner competence signals. |
| XP-R11 | **Values pending GHV.PROGRESSION.1B.** No final XP values, formulas, or Product Codes in this Gate. |

---

## Ledger and visibility

| Concept | Architecture |
|---------|--------------|
| **Flight Log** | Durable history of recognized XP events, reversals, and category labels. |
| **Learner-facing copy** | Must describe XP as activity/contribution recognition. |
| **Public / profile** | Optional aggregate display; must not imply employment seniority or Proven status. |
| **Staff audit** | Reversals, integrity holds, and category overrides are auditable. |

---

## Explicit non-goals

- No XP → Rank automatic mapping.
- No XP → Title automatic mapping.
- No XP → Route-Proven or Horizon-Proven.
- No XP → Mastery state machine transitions.
- No Product Codes, store SKUs, or monetized XP boosts.
- No numeric category weights, event values, or decay half-lives in this document.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | Category registry + rules; must supply simulation-backed values, caps, and anti-farm parameters |
| **Calibration / simulation** | Must run before any numeric lock |
| **Product Code / implementation** | BLOCKED until later governed gates |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
