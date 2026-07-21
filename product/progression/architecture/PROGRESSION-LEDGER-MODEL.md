# Progression Ledger Model

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-LDG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SYSTEM-SEPARATION.md](./PROGRESSION-SYSTEM-SEPARATION.md) · [PROGRESSION-SOURCE-AUTHORITY.md](./PROGRESSION-SOURCE-AUTHORITY.md) · [PROGRESSION-INVARIANTS.md](./PROGRESSION-INVARIANTS.md) · [PROGRESSION-IDENTIFIER-STANDARD.md](./PROGRESSION-IDENTIFIER-STANDARD.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: define conceptual progression ledgers |

---

## Purpose

Define **separate conceptual ledgers** so that no ledger overwrites another’s meaning. Ledgers are architectural records — not database schemas (technical validation NOT RUN; Product Code BLOCKED).

Exact total: **11** conceptual ledgers.

---

## Non-overwrite rule

1. Each ledger owns one progression meaning (or correction audit).
2. A write to one ledger must not silently redefine another ledger’s current state.
3. Cross-ledger eligibility reads are allowed only as explicit inputs documented elsewhere.
4. Aggregation formulas (PENDING) may read multiple ledgers but must publish results into the correct target ledger only.

---

## 1. XP Ledger (`PGS-XP`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Validated learning/contribution events allowed to recognize XP; correction events that reverse XP. |
| **Current state** | Lifetime recognized XP standing (structure only; values PENDING). |
| **Historical state** | Append-only recognition and reversal entries with source event IDs. |
| **Reversal** | Compensating XP reversal entries tied to voided/revoked sources. |
| **Source Evidence** | Links to originating activity/contribution records; Evidence approval is not required for all XP categories. |
| **Visibility** | User-primary; public optional under privacy policy. |
| **Auditability** | Full entry audit trail required. |
| **Privacy** | Personal activity history — minimize public exposure. |
| **Retention** | Lifetime progression history retained per data-minimization policy (detail PENDING). |
| **User appeal path** | Progression correction/appeal for wrongful recognition or omission. |
| **Aggregation dependency** | May feed season snapshots and limited leaderboards; must not rewrite Mastery. |

---

## 2. Momentum Season Record (`PGS-MOM`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Season-eligible activity events scoped to `MOM-SEASON-<YEAR>-<NUMBER>`. |
| **Current state** | Current season League (`MOM-IRON` … `MOM-DIAMOND`) and season standing (thresholds PENDING). |
| **Historical state** | Per-season closed records. |
| **Reversal** | Intra-season reversals when sources void; closed seasons corrected via audited adjustments. |
| **Source Evidence** | Season activity sources; not Evidence-as-Mastery. |
| **Visibility** | Season badge/standing; labeled Momentum. |
| **Auditability** | Season entry and placement audit. |
| **Privacy** | Competitive standing may be public within age-safe boards. |
| **Retention** | Historical seasons retained for fairness audit. |
| **User appeal path** | Season standing appeal. |
| **Aggregation dependency** | Reads XP/activity signals; must not rewrite Maturity or Mastery. |

---

## 3. Maturity Record (`PGS-MAT`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Maturity progress evaluations / corrections (rules PENDING). |
| **Current state** | Current `MAT-*` Rank. |
| **Historical state** | Rank transition history. |
| **Reversal** | Audited Rank correction only. |
| **Source Evidence** | Aggregated journey signals — not a single Mission. |
| **Visibility** | User-facing Rank; public optional. |
| **Auditability** | Transition audit required. |
| **Privacy** | Profile-adjacent; respect privacy preferences. |
| **Retention** | Long-lived. |
| **User appeal path** | Maturity standing appeal. |
| **Aggregation dependency** | May read long-horizon activity/Mastery signals; must not equal Momentum. |

---

## 4. Mastery Record (`PGS-MST`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Evidence/assessment/Capstone/Proven events; integrity validity changes; corrections. |
| **Current state** | Capability and Route Mastery / Route-Proven standing (`MST-*`). |
| **Historical state** | Award, refresh, suspension, revocation history. |
| **Reversal** | Evidence revocation and assessment voiding may reverse current standing. |
| **Source Evidence** | Required for Mastery claims; links to Evidence/assessment anchors. |
| **Visibility** | Portfolio-controlled; Proven display distinct from completion. |
| **Auditability** | High — sensitive. |
| **Privacy** | May contain assessment outcomes; minimize exposure. |
| **Retention** | Long-lived with freshness states. |
| **User appeal path** | Evidence/Mastery appeal (primary sensitive path). |
| **Aggregation dependency** | Feeds Breadth, Titles, Prestige eligibility; must not be overwritten by XP/Momentum. |

---

## 5. Breadth Record (`PGS-BRD`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Cross-Horizon proof events and related corrections. |
| **Current state** | `BRD-HRZ-*` and `BRD-MULTI-*` standing. |
| **Historical state** | Breadth grant/reversal history. |
| **Reversal** | Follows underlying Mastery/Proven reversals. |
| **Source Evidence** | Multi-path Evidence/Mastery sources. |
| **Visibility** | Breadth surface (launch surface limited). |
| **Auditability** | Required. |
| **Privacy** | Portfolio-adjacent. |
| **Retention** | Long-lived. |
| **User appeal path** | Via underlying Mastery/Evidence or Breadth aggregation correction. |
| **Aggregation dependency** | Depends on Mastery/Proven across Horizons; not on payment. |

---

## 6. Trust Ledger (`PGS-TRU`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Integrity, moderation, Trust case events (`TRU-REC-*`), restorations, appeals. |
| **Current state** | Trust Standing and active restrictions. |
| **Historical state** | Sanctions and restorations. |
| **Reversal** | Appeal overturn / restoration events. |
| **Source Evidence** | Integrity case records; must not delete valid learning Evidence. |
| **Visibility** | Restricted by default. |
| **Auditability** | **Mandatory** high sensitivity. |
| **Privacy** | High — need-to-know. |
| **Retention** | Per safety/compliance policy (PENDING exact retention). |
| **User appeal path** | Trust/moderation appeal. |
| **Aggregation dependency** | Gates eligibility for community/review/Merit/Prestige; does not invent Mastery. |

---

## 7. Professional Title Record (`PGS-TTL`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Title review decisions, suspensions, revocations, corrections. |
| **Current state** | Held Titles (`TTL-<DOMAIN>-<NUMBER>`). |
| **Historical state** | Award/denial/revocation history. |
| **Reversal** | Revocation/suspension on Evidence or integrity change. |
| **Source Evidence** | Required Mastery/Evidence bundles + Trust eligibility. |
| **Visibility** | Portfolio display. |
| **Auditability** | High. |
| **Privacy** | Professional claim — careful public wording. |
| **Retention** | Long-lived. |
| **User appeal path** | Title review appeal. |
| **Aggregation dependency** | Depends on Mastery + Trust + review; never payment. |

---

## 8. Prestige Review Record (`PGS-PRS`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Nominations, reviews, awards, revocations for `PRS-*`. |
| **Current state** | Prestige Class standing (if any). |
| **Historical state** | Review dossier history. |
| **Reversal** | Revocation; Prestige is not permanent immunity. |
| **Source Evidence** | Selected high-bar Evidence/Mastery/Breadth/Trust inputs. |
| **Visibility** | High-visibility when awarded; review notes restricted. |
| **Auditability** | High. |
| **Privacy** | Reviewer notes protected. |
| **Retention** | Long-lived. |
| **User appeal path** | Prestige review appeal. |
| **Aggregation dependency** | Multi-ledger inputs; must require more than activity/longevity. |

---

## 9. Achievement Record (`PGS-ACH`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Achievement/Crest grant and revocation events (`ACH-*`, `CRS-*`). |
| **Current state** | Owned Achievements and Crests. |
| **Historical state** | Grant history including season/event Crests. |
| **Reversal** | Revoke when sources void. |
| **Source Evidence** | Rule-linked events; Prestige Crests depend on Prestige Record. |
| **Visibility** | Collectible/display. |
| **Auditability** | Required. |
| **Privacy** | Generally lower sensitivity. |
| **Retention** | Long-lived collectibles; event Crests retain event linkage. |
| **User appeal path** | Achievement grant appeal. |
| **Aggregation dependency** | Must not redefine Mastery/Trust. |

---

## 10. Leaderboard Standing Record (`PGS-LDB`)

| Field | Definition |
|-------|------------|
| **Authoritative events** | Board open/close, snapshot publications, fairness corrections. |
| **Current state** | Standing on active boards. |
| **Historical state** | Closed board snapshots. |
| **Reversal** | Recalculation from source ledgers after reversals. |
| **Source Evidence** | Board-specific ledger snapshots — not Evidence approval. |
| **Visibility** | Board-public within policy/age rules. |
| **Auditability** | Fairness audit required. |
| **Privacy** | Age-safe; opt-out where required. |
| **Retention** | Snapshot retention for dispute windows (PENDING exact). |
| **User appeal path** | Leaderboard fairness appeal. |
| **Aggregation dependency** | Derived only; never authoritative for Mastery/Trust/Prestige meaning. |

---

## 11. Progression Correction Record

| Field | Definition |
|-------|------------|
| **Authoritative events** | `ADMINISTRATIVE_CORRECTION` and appeal outcomes affecting any progression ledger. |
| **Current state** | Open correction cases and applied patches. |
| **Historical state** | Full correction dossier. |
| **Reversal** | Corrections preferably reversible via compensating entries. |
| **Source Evidence** | Links to erroneous entries and rationale. |
| **Visibility** | Restricted to user + privileged roles. |
| **Auditability** | **Mandatory** — privileged actors only. |
| **Privacy** | High. |
| **Retention** | Long-lived for accountability. |
| **User appeal path** | Appeal of correction itself where policy allows. |
| **Aggregation dependency** | May patch any ledger; must preserve non-overwrite semantics and invariants. |

---

## Exact totals

| Item | Exact total |
|------|------------:|
| Conceptual ledgers | **11** |
| Ledgers mapped to `PGS-*` | **10** |
| Correction ledger (cross-cutting) | **1** |
