# Counterfactual Fairness Tests

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-CFT-001 |
| **Version** | 0.2.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [CALIBRATION-COHORTS.md](./CALIBRATION-COHORTS.md) · [MANDATORY-CALIBRATION-FINDINGS.md](./MANDATORY-CALIBRATION-FINDINGS.md) · [PROGRESSION-CALIBRATION-PRINCIPLES.md](./PROGRESSION-CALIBRATION-PRINCIPLES.md) |
| **Synthetic result** | **10/10 PASS** (RUN-008) |
| **CSV** | [../../analysis/progression-simulation/counterfactual-results.csv](../../analysis/progression-simulation/counterfactual-results.csv) |
| **Limitations** | Method lock for calibration · **NOT production calibrated** · **synthetic only** · real-user NOT RUN |

## Purpose

Define the **only** acceptable method for claiming schedule, language, age, plan, or accessibility fairness from synthetic (and later real) progression evidence. Unmatched persona comparisons are **insufficient**.

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
Matched counterfactual required (CAL-FND-007 · CAL-PR-07)
```

---

## Method

### Step 1 — Fix the event spine

Construct a **canonical event spine**: ordered validated events with intensity, Evidence class, Team/Live contribution flags, integrity flags, and timestamps / week indices.

### Step 2 — Vary exactly one protected factor

Clone the spine into arms that differ by **one** factor under test:

| Factor under test | Allowed arm difference | Forbidden simultaneous diffs |
|-------------------|------------------------|------------------------------|
| Schedule shape | Week placement / compression of the **same** events | Different Evidence quality or Mission set |
| Language surface | AR vs EN presentation metadata | Different technical Evidence content |
| Age band | Minor vs adult eligibility overlays | Different Mastery Evidence |
| Access Plan | Plan label only (Cohort D) | Different Mission unlock cheating |
| AT / reduced motion | Preference flags only | Dropped Evidence requirements |

### Step 3 — Score with identical formula versions

Run both arms through the **same** registered formula versions. Record XP, Level, Momentum score + league, Maturity Rank, CMI/RMI, Route-Proven, Trust state, Title eligibility, Prestige nomination, leaderboard eligibility.

### Step 4 — Assert required equalities / allowed deltas

Apply the equality table below. Any unexpected delta is a **finding**, not an automatic retune.

### Step 5 — Document cohort and seed

Cite `cohort`, seed, formula versions, and CSV path. Analytical outputs remain **NOT Product Code**.

---

## Required equalities

| Test ID | Arms | Must be equal | May differ | Notes |
|---------|------|---------------|------------|-------|
| CFT-01 | Plan A vs Plan B, identical spine | XP, Level, Momentum score, Maturity, Mastery, RP, Trust, Titles, Prestige eligibility | Entitlement / concurrency only | Pay-to-win; Cohort D |
| CFT-02 | Schedule compressed vs spread, identical events | Mastery indices, Route-Proven, Evidence-derived Maturity dimensions that depend only on Evidence | Momentum weekly components / league labels near edges | **Schedule must not change Mastery** |
| CFT-03 | AR vs EN surface, identical technical Evidence | Mastery, RP, Trust, Titles, Prestige | Localized explainability strings only | Language ≠ technical grade |
| CFT-04 | Minor vs adult, identical learning spine | XP, Level, Momentum, Maturity, Mastery from learning events | Prestige / adult social / certain boards may be blocked for minors | Privacy / age overlays |
| CFT-05 | AT / reduced-motion on vs off, identical spine | All progression standings | None for standing | Preference must not punish |
| CFT-06 | Matched PER-009↔PER-010 redesign | Mastery if Evidence matched | Momentum only if week placement differs | Addresses CAL-FND-007 |

---

## Explicitly invalid comparisons

1. PER-009 vs PER-010 **as shipped in RUN-001** without re-matching event quality.
2. Cohort A RP rate vs “launch expectation” without Cohort B.
3. League label flips under ±10% threshold shifts cited as unfairness without score-stability analysis.
4. Gold share cited as discrimination without a protected-factor arm.

---

## Synthetic execution status (1C)

| Item | Status |
|------|--------|
| Method locked | **YES** |
| Full matched CFT matrix executed | **YES — 10/10 PASS** (RUN-008) |
| Schedule compressed vs distributed | Skill **EQUAL** · mom delta **4.33 ≤ 10** · **PASS** |
| Pay-to-win / plan arms | diffs **0** · **PASS** |
| Real-user counterfactuals | **NOT RUN** |
| Production telemetry counterfactuals | **NOT RUN** |

### RUN-008 results (exact)

| Test | Result |
|------|--------|
| plans_openflight_vs_expedition | **PASS** |
| paid_vs_merit | **PASS** |
| language_ar_vs_en | **PASS** |
| age_adult_vs_minor | **PASS** |
| a11y_vs_standard | **PASS** |
| schedule_distributed_vs_compressed | **PASS** (Skill equal; mom Δ 4.33) |
| connectivity_high_vs_interrupted | **PASS** |
| device_mobile_vs_desktop | **PASS** |
| privacy_public_vs_private | **PASS** |
| reviewer_a_vs_b | **PASS** |

```text
Method: LOCKED
Synthetic CFT: 10/10 PASS
Production calibration: NOT
Evidence class: synthetic only
PENDING 1D
```

## Outputs

Expected analytical artifacts (when scripts run):

| Artifact | Role |
|----------|------|
| `counterfactual-fairness.csv` | Per-test arm deltas |
| `pay-to-win-results.txt` | Existing Cohort D attestation (RUN-006) |

Scripts under `analysis/progression-simulation/` remain **NON-RUNTIME ANALYSIS TOOL · NOT Product Code**.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Lock counterfactual fairness method and required equalities |
| 0.2.0 | 2026-07-21 | RUN-008 CSV — **10/10 PASS**; schedule mom Δ 4.33 ≤ 10 |
