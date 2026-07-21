# Progression Integrity Red Team — 20 Attacks

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-RTM-001 |
| **Version** | 0.2.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Exact attack count** | **20** |
| **Result** | **20/20 PASS** (CSV-confirmed) |
| **CSV** | [../../analysis/progression-simulation/integrity-red-team-results.csv](../../analysis/progression-simulation/integrity-red-team-results.csv) |
| **Report** | [../simulation/RED-TEAM-SIMULATION-REPORT.md](../simulation/RED-TEAM-SIMULATION-REPORT.md) |
| **Limitations** | Design-level analytical attacks · **NOT production calibrated** · **synthetic only** · **NOT Product Code** |

## Purpose

Provide a fixed **20-attack** integrity red-team against candidate formulas. Attacks exercise anti-gaming, separation, and pay-to-win invariants without implementing production detection.

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
Results: 20/20 PASS (CSV-confirmed)
```

## Attack results (exact 20)

| Attack ID | Threat class | Attack description | Expected defense | Systems under test | Result | CSV field |
|-----------|--------------|--------------------|------------------|--------------------|--------|-----------|
| RTM-01 | Mission farming | Submit maximum LIGHT Missions with identical low-value repeats | Repeat factor / caps; XP ≠ Mastery | FRM-XP-001 · FRM-MST-* | **PASS** | `1` |
| RTM-02 | Identical repeat XP | Re-complete same Mission without improved-repeat classification | Repeat Factor = 0 | FRM-XP-001 | **PASS** | `4` |
| RTM-03 | Remediation farming | Intentionally fail to farm remediation XP | One remediation per gap; no intentional-failure reward | FRM-XP-001 · FRM-MOM-001 | **PASS** | `5` |
| RTM-04 | Plan multiplier | Assert paid plan multiplies XP / Momentum / Mastery | Diffs = 0; payment prohibited inputs | All FRM-* · Cohort D | **PASS** | `19` |
| RTM-05 | Popularity → Mastery | High reactions / followers without Evidence | No Mastery / RP / Trust elevation from popularity | FRM-MST-* · POL-TRU-001 | **PASS** | `10` |
| RTM-06 | Volume → Route-Proven | High Mission volume, zero Evidence | No Route-Proven | FRM-MST-003 | **PASS** | `3` |
| RTM-07 | XP → Title | High XP alone claims Professional Title | Titles require Evidence / review templates | TPL-TTL-* | **PASS** | `15` |
| RTM-08 | Momentum → Maturity | Diamond / Gold season claims Maturity Rank | Momentum ≠ Maturity | FRM-MOM-002 · FRM-MAT-001 | **PASS** | design |
| RTM-09 | Season timing game | Concentrate activity to game grace weeks / best-6 | Caps + grace rules; buffer hysteresis | FRM-MOM-002 | **PASS** | `13` |
| RTM-10 | Recovery farming | Cycle inactivity to farm Recovery points | Recovery not rewarded for intentional inactivity | FRM-MOM-001 | **PASS** | design |
| RTM-11 | Team passenger RP | Team success without individual Evidence | No full individual Route-Proven | FRM-MST-* | **PASS** | `6` |
| RTM-12 | Fake Live contribution | Claim Live Sky contribution without valid event | Source validation; no standing write | FRM-XP-001 · FRM-LDB-004 | **PASS** | design |
| RTM-13 | Copied Evidence | Duplicate Evidence portfolio across accounts | Authenticity / integrity hold path | FRM-MST-001 · POL-TRU-001 | **PASS** | `20` |
| RTM-14 | Provisional as final | Treat provisional leaderboard as permanent Prestige | Provisional reversible; Prestige human-only | FRM-LDB-* · POL-PRS-001 | **PASS** | `18` |
| RTM-15 | Integrity erase history | Demand deletion of valid Evidence after Trust hit | History preserved; eligibility may suspend | POL-TRU-001 · POL-COR-001 | **PASS** | `16` |
| RTM-16 | Prestige auto-grant | Cross PEI threshold expects auto Prestige Class | Nomination / review only; no auto-grant | FRM-PRS-001 · POL-PRS-001 | **PASS** | `18` |
| RTM-17 | Obsidian first-year farm | Ordinary first-year path claims Obsidian eligibility | Obsidian = 0 in ordinary launch-realistic | POL-PRS-001 · COH-B | **PASS** | Cohort B |
| RTM-18 | Forced Rank skip abuse | Claim higher Rank without meeting gates | Skip only when higher Rank **fully met** | FRM-MAT-001 v0.2.0 | **PASS** | design |
| RTM-19 | Evidence XP double-count | Multiple XP awards for one Evidence approval | Once-per-approval (FRM-XP-001 v0.1.1) | FRM-XP-001 | **PASS** | `2` |
| RTM-20 | Board population game | Tiny opt-in set claims authoritative public ranking | POL-POP-001 thresholds; provisional rules | POL-POP-001 · FRM-LDB-* | **PASS** | design |

CSV attack rows 1–20 in `integrity-red-team-results.csv` all record `result=PASS`. Template IDs above map to the same threat classes; see [RED-TEAM-SIMULATION-REPORT.md](../simulation/RED-TEAM-SIMULATION-REPORT.md) for CSV-row detail.

---

## Aggregate result (1C package)

| Metric | Value |
|--------|-------|
| Attacks defined | **20** |
| FAIL | **0** |
| PASS (CSV-confirmed) | **20** |
| Blocking integrity defect | **None** |

```text
Integrity red-team: COMPLETE — 20/20 PASS
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial 20-attack integrity red-team template for GHV.PROGRESSION.1C |
| 0.2.0 | 2026-07-21 | CSV confirmation — **20/20 PASS** |
