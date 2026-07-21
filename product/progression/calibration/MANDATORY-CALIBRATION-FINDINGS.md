# Mandatory Calibration Findings — CAL-FND-001…007

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-FND-001 |
| **Version** | 0.2.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Limitations** | **NOT production calibrated** · **synthetic only** · dispositions bind formula clarifications, not production lock |

## Purpose

Record every mandatory calibration finding from integrity / fairness / sensitivity review of 1B simulation evidence, with an explicit disposition. Findings are **not** automatic formula rewrites for cosmetic distributions.

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

---

## CAL-FND-001 — Maturity contexts / Fledgling reachability

| Field | Value |
|-------|-------|
| **Finding ID** | CAL-FND-001 |
| **Systems** | FRM-MAT-001 · Maturity Rank |
| **Severity** | High (architecture / generator correctness) |
| **Evidence** | Synthetic maturity path analysis; multi-seed RUN-007 — Fledgling **3472**/25000; Cohort B Fledgling **1309**/7500; PER-001 / PER-014 now Fledgling |

### Observation

Learning-context counting treated contexts as arising **only from Evidence**, while formula language intended broader learning contexts. Combined with an aggressive first-practical dimension bump in the analytical heuristic, the **Fledgling** band was effectively skipped or unreachable for ordinary early learners. This looked like a Rank-population failure; root cause was **generator / context definition defect**, not a requirement to force-populate Fledgling.

### Measured (post-clarification)

| Scope | Fledgling | Raven |
|-------|----------:|------:|
| Multi-seed total (n=25000) | **3472** | **0** |
| Cohort B (n=7500) | **1309** | **0** |

### ROOT CAUSE

1. **Generator defect** — contexts sourced only from Evidence.
2. **Formula context ambiguity** — Mission / Stage not clearly counted as learning contexts.

### ACTION

- **FRM-MAT-001 v0.2.0** clarifies Mission / Stage as **learning contexts**.
- **Governed Rank skip** when a higher Rank’s gates are **fully met** (highest fully-met Rank wins; no mandatory dwell at intermediate Ranks).
- Simulation heuristic softened so first practical does not auto-jump past Fledgling.
- **Fledgling reachable.**
- **Not forced population.**

### Disposition

```text
ACCEPTED — CLARIFICATION REVISION (FRM-MAT-001 0.1.0 → 0.2.0)
NOT a quota-tuned Rank distribution fix
CALIBRATION RECOMMENDED · PENDING 1D
```

---

## CAL-FND-002 — Momentum league label sensitivity

| Field | Value |
|-------|-------|
| **Finding ID** | CAL-FND-002 |
| **Systems** | FRM-MOM-001 · FRM-MOM-002 |
| **Severity** | High (sensitivity watch) |
| **Evidence** | RUN-005 — MOM_THRESHOLD_SHIFT league change rate **37.3%** |

### Observation

Momentum **league labels** are ~**37%** sensitive at band edges under ±10% threshold shifts. Season **scores** (best-6 of 8 weeks) are materially more stable than labels. Edge flips are expected for discrete bands; they are not alone proof of unfairness.

### ACTION

- **FRM-MOM-002 v0.2.0** adopts **Alternative B promotion buffer (±2 points)** for league transitions (promotion / demotion hysteresis).
- Keep **8-week season** and **best-6** aggregation.
- Band floors themselves unchanged solely for cosmetic league mix.

### Disposition

```text
ADVANCE WITH CONDITIONS
Monitor league bands in real pilot
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

---

## CAL-FND-003 — Route-Proven density (38.6%)

| Field | Value |
|-------|-------|
| **Finding ID** | CAL-FND-003 |
| **Systems** | FRM-MST-* · Route-Proven pathways |
| **Severity** | Medium (cohort interpretation) |
| **Evidence** | RUN-004 population — Route-Proven **38.60%**; RUN-007 Cohort A **45.11%** · Cohort B **22.88%** |

### Observation

The **38.6%** (1B) / **45.11%** (1C Cohort A) Route-Proven rates reflect **architecture stress density** (Evidence-rich synthetic mix), not a forecast of ordinary launch. **Launch-realistic Cohort B** measures **22.88%** RP under the same Mastery floors.

### Measured (RUN-007)

| Cohort | n | Route-Proven |
|--------|--:|-------------:|
| A stress | 12500 | **45.11%** |
| **B launch-realistic** | 7500 | **22.88%** |
| C experienced | 2500 | high by design |

### ACTION

- Formula floors **unchanged**.
- **Not tuned to quota.**
- Report RP rates by cohort; never cite Cohort A RP as launch KPI.

### Disposition

```text
ACCEPTED — NO FLOOR CHANGE
Interpret via Cohorts A vs B
CALIBRATION RECOMMENDED · PENDING 1D
```

---

## CAL-FND-004 — Ascendant nomination soft watch (~4.4%)

| Field | Value |
|-------|-------|
| **Finding ID** | CAL-FND-004 |
| **Systems** | FRM-PRS-001 · POL-PRS-001 |
| **Severity** | Soft watch |
| **Evidence** | RUN-004 — Ascendant **4.40%**; RUN-007 Cohort B Ascendant **0%** · Cohort A **8.31%**; Apex **0**; Obsidian **0** |

### Observation

1B Ascendant ~**4.4%** sat near the provisional warning band. Under 1C multi-seed cohorts: **Cohort B Ascendant = 0%** (launch-realistic); Cohort A Ascendant **8.31%** is architecture stress (expected higher). Apex / Obsidian remain **0**. Soft watch ≠ defect.

### Measured (RUN-007 / RUN-010)

| Scope | Ascendant | Apex | Obsidian |
|-------|----------:|-----:|---------:|
| Cohort B (n=7500) | **0%** | **0** | **0** |
| Cohort A (n=12500) | **8.31%** | **0** | **0** |

### ACTION

- Keep Prestige rarity posture.
- **Apex / Obsidian must be 0** in ordinary first-year launch-realistic cohorts.
- **No threshold hike solely to eliminate nominees.**

### Disposition

```text
SOFT WATCH — ADVANCE WITH CONDITIONS (Prestige panel / PEI monitoring)
No cosmetic threshold hike
CALIBRATION RECOMMENDED · PENDING 1D
```

---

## CAL-FND-005 — PER-004 high XP from Evidence milestones

| Field | Value |
|-------|-------|
| **Finding ID** | CAL-FND-005 |
| **Systems** | FRM-XP-001 · Flight Level |
| **Severity** | Medium (explainability / separation) |
| **Evidence** | RUN-001 PER-004 — XP **1015** · L5 with low Mission volume, high Evidence |

### Observation

PER-004’s high XP comes from **Evidence milestone XP** (activity recognition **once per approval**), **not** from Skill / Mastery substitution. Low activity correctly implies low Mission volume; approved Evidence events still recognize validated activity.

### ACTION

- Clarify **FRM-XP-001 v0.1.1** — Evidence XP is once-per-approval activity recognition.
- UX must not imply XP = Skill.
- No XP magnitude retune solely because Evidence-heavy personas look “high XP.”

### Disposition

```text
ACCEPTED — CLARIFICATION (FRM-XP-001 0.1.0 → 0.1.1)
Separation preserved: XP ≠ Skill
CALIBRATION RECOMMENDED · PENDING 1D
```

---

## CAL-FND-006 — Gold concentration / Diamond rarity

| Field | Value |
|-------|-------|
| **Finding ID** | CAL-FND-006 |
| **Systems** | FRM-MOM-002 · Momentum leagues |
| **Severity** | Low (distribution interpretation) |
| **Evidence** | RUN-004 — Gold **169**/500; Diamond **0**; RUN-007 — Gold **7399**/25000 · Diamond **0** |

### Observation

Gold concentration is a **distribution shape** under candidate bands and synthetic activity, **not** a fairness defect. Diamond rare / hard is **OK**. Equalizing league shares would be cosmetic retuning.

### Measured (RUN-007 leagues, n=25000)

| League | Count |
|--------|------:|
| Gold | **7399** |
| Silver | 7380 |
| Bronze | 4127 |
| Iron | 3965 |
| Platinum | 2129 |
| Diamond | **0** |

### ACTION

- **Do not equalize leagues.**
- Keep Diamond scarce.
- Monitor shape in Cohort B / real pilot; do not force uniform league histograms.

### Disposition

```text
ACCEPTED — NO EQUALIZATION
Distribution shape ≠ fairness defect
CALIBRATION RECOMMENDED · PENDING 1D
```

---

## CAL-FND-007 — PER-009 vs PER-010 (schedule vs event quality)

| Field | Value |
|-------|-------|
| **Finding ID** | CAL-FND-007 |
| **Systems** | FRM-MOM-* · FRM-MST-* · fairness / a11y |
| **Severity** | Medium (fairness method) |
| **Evidence** | RUN-001 unmatched PER-009 vs PER-010; RUN-008/009 matched CFT — **10/10 PASS**; schedule Skill equal; mom Δ **4.33 ≤ 10** |

### Observation

PER-009 vs PER-010 outcomes differed in **event quality / content**, not only schedule shape. Claiming schedule discrimination from unmatched personas is invalid. **Matched counterfactual** testing is required. **Schedule must not change Mastery.**

### ACTION

- Require matched counterfactuals (see [COUNTERFACTUAL-FAIRNESS-TESTS.md](./COUNTERFACTUAL-FAIRNESS-TESTS.md)).
- Keep Mastery Evidence-driven; schedule accommodations may affect Momentum pacing recognition rules, never Mastery floors via schedule alone.
- Soft a11y watch continues into pilot (WITH CONDITIONS on Momentum fairness monitoring).

### Disposition

```text
ACCEPTED — METHOD REQUIREMENT
Matched counterfactual required
Schedule must not change Mastery
CALIBRATION RECOMMENDED · PENDING 1D
```

---

## Cross-finding rules

1. Clarification revisions (context, once-per-approval, buffer hysteresis) are preferred over quota retunes.
2. Soft watches do not authorize cosmetic threshold hikes.
3. Cohort labels must appear whenever rates are cited.
4. All findings remain **synthetic only** until real-user calibration.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial CAL-FND-001…007 dispositions under GHV.PROGRESSION.1C |
| 0.2.0 | 2026-07-21 | Measured RUN-007 numbers (Fledgling 3472; B RP 22.88%; B Asc 0%; leagues; Diamond/Raven 0) |
