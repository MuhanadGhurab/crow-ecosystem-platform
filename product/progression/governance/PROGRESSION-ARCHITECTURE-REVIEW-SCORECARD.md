# Progression Architecture Review Scorecard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-SCR-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SIMULATION-HANDOFF.md](./PROGRESSION-SIMULATION-HANDOFF.md) · [../architecture/PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) · [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: architecture-review scorecard (evidence scores, not progression formulas) |

---

## Important classification

These scores are **architecture-review evidence** (0–100 per system) for GHV.PROGRESSION.1A gate review.

They are **NOT** progression formulas, XP values, Rank thresholds, Mastery percentages, Momentum points, Prestige scores, or learner-facing standing numbers.

```text
Scorecard scores = review evidence (0–100)
Progression formulas = PENDING (GHV.PROGRESSION.1B)
Plausible band for 1A: strong separation, formulas not locked → typically 78–92
```

---

## Weight model (exact)

| Criterion | Weight |
|-----------|-------:|
| Purpose clarity | 10 |
| Separation | 12 |
| Source authority | 10 |
| Evidence integrity | 10 |
| Reversal / correction | 8 |
| Explainability | 8 |
| Anti-pay-to-win | 10 |
| Anti-gaming | 8 |
| Fairness / accessibility | 7 |
| Privacy / age | 5 |
| UX clarity | 5 |
| Tech feasibility | 4 |
| Founder governance | 3 |
| **Total weight** | **100** |

Weighted system score = Σ (criterion score × weight) / 100, with each criterion scored 0–100.

---

## System scores

Criterion columns use abbreviated headers: PC Purpose clarity · SEP Separation · SRC Source authority · EVI Evidence integrity · REV Reversal/correction · EXP Explainability · APW Anti-pay-to-win · AG Anti-gaming · FA Fairness/a11y · PRV Privacy/age · UX UX clarity · TECH Tech feasibility · FG Founder governance.

| System | PC | SEP | SRC | EVI | REV | EXP | APW | AG | FA | PRV | UX | TECH | FG | **Total** |
|--------|---:|----:|----:|----:|----:|----:|----:|---:|---:|----:|---:|-----:|---:|----------:|
| Flight XP | 90 | 92 | 88 | 82 | 86 | 84 | 94 | 80 | 78 | 80 | 82 | 78 | 88 | **86** |
| Momentum | 88 | 90 | 86 | 80 | 84 | 82 | 92 | 82 | 80 | 78 | 84 | 76 | 86 | **85** |
| Maturity | 86 | 88 | 84 | 84 | 80 | 82 | 90 | 78 | 82 | 80 | 80 | 74 | 88 | **84** |
| Mastery | 92 | 94 | 92 | 94 | 88 | 86 | 96 | 86 | 84 | 82 | 84 | 78 | 90 | **90** |
| Breadth | 84 | 88 | 86 | 88 | 82 | 80 | 92 | 80 | 80 | 78 | 78 | 74 | 86 | **84** |
| Trust | 88 | 90 | 90 | 86 | 90 | 84 | 94 | 88 | 86 | 90 | 80 | 76 | 92 | **88** |
| Titles | 90 | 92 | 90 | 90 | 86 | 86 | 94 | 84 | 84 | 86 | 84 | 76 | 90 | **88** |
| Prestige | 92 | 94 | 92 | 92 | 88 | 88 | 96 | 86 | 86 | 88 | 86 | 74 | 94 | **90** |
| Achievements / Crests | 86 | 88 | 84 | 82 | 84 | 84 | 90 | 80 | 78 | 80 | 86 | 80 | 86 | **84** |
| Leaderboards | 84 | 86 | 82 | 80 | 86 | 82 | 90 | 84 | 80 | 78 | 84 | 78 | 86 | **84** |

Exact systems scored: **10**.

---

## Brief rationale per system

### Flight XP — Total **86**

Clear activity-recognition purpose and strong anti-pay-to-win separation from Mastery/Titles. Score held below the top band because magnitudes, caps, and category weights remain FORMULA PENDING and anti-gaming thresholds are unsimulated.

### Momentum — Total **85**

Seasonal pacing is well separated from competence and Prestige. League vocabulary is locked; season duration and promotion/demotion thresholds are PENDING, which limits tech-feasibility and calibration confidence.

### Maturity — Total **84**

Long-term developmental profile is distinct from XP ladders and job titles. Dimension model is qualitative-only in 1A; advancement thresholds and weighting await 1B, so explainability of “why Rank moved” is architecturally intended but not formula-backed yet.

### Mastery — Total **90**

Strongest Evidence integrity and separation (Evidence ≠ XP ≠ payment). Freshness overlays and Route-Proven qualitative alignment are clear. Aggregation formulas remain PENDING; still scores high as architecture.

### Breadth — Total **84**

Horizon / multi-path standing is conceptually separate from single-Route Mastery. Source authority and anti-pay-to-win are solid; UX and tech feasibility trail because Breadth surfaces and thresholds are less formula-ready than Mastery in 1A.

### Trust — Total **88**

Integrity-driven standing with strong privacy/age and Founder-governance fit; irreversible Trust reserved for humans. Anti-gaming and reversal paths are well framed; numeric sanction ladders not locked.

### Titles — Total **88**

Professional Title path correctly requires Evidence and human review for high-impact grants. Eligibility automation is allowed; grant authority boundary is clear. Formula dependency for eligibility scoring remains PENDING.

### Prestige — Total **90**

Highest Founder-governance and anti-pay-to-win clarity; grants and permanent revocation are human-only. Nomination/eligibility explainability is strong architecturally; class thresholds PENDING.

### Achievements / Crests — Total **84**

Celebration layer is separated from competence claims. Reversal and season Crest concepts are present; Evidence integrity is lower than Mastery because some Crests may be activity/season commemorative (still not payment-bought Skill).

### Leaderboards — Total **84**

Provisional vs final distinction and correction states are strong. Purpose clarity is good; Evidence integrity is inherently weaker because boards often surface XP/Momentum rather than Mastery. Fairness/privacy need simulation before lock.

---

## Aggregate review note

| Metric | Value |
|--------|------:|
| Systems scored | **10** |
| Score band observed | **84–90** (within intended 78–92 architecture-review band) |
| Mean (unweighted across systems) | **86.3** |
| Formulas locked | **0** (all PENDING 1B) |

Interpretation: architecture separation and authority boundaries are strong enough for 1A recommendation; residual score gap to the top of the band is intentional — formulas, simulation, calibration, and technical validation are not complete.

```text
ARCHITECTURE-REVIEW EVIDENCE ONLY
NOT progression formulas · FORMULA PENDING
SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
