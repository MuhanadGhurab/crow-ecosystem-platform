# Formula Revision Log

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-REV-001 |
| **Version** | 0.2.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B → GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Limitations** | CALIBRATION RECOMMENDED · **NOT production calibrated** · **synthetic only** · no Product Code |

## Purpose

Record every change to candidate formulas. Do not silently change candidates.

## Required fields per revision

* Formula ID.
* Previous version.
* New version.
* Simulation failure.
* Affected personas.
* Changed parameter.
* Reason.
* Impact.
* Unresolved concern.
* Approval status.

## Log

| Entry | Formula ID | Previous | New | Simulation failure | Affected personas | Changed parameter | Reason | Impact | Unresolved concern | Approval |
|-------|------------|----------|-----|--------------------|-------------------|-------------------|--------|--------|--------------------|----------|
| REV-000 | *(registry)* | — | 0.1.0 | None (initial) | — | All candidate parameters introduced | Initial simulation candidates under GHV.PROGRESSION.1B | Establishes baseline for simulation | Calibration deferred to 1C | Founder accepted as candidates |

## Post-simulation attestation (Gate 1B close)

```text
Revisions after RUN-001…RUN-006: 0
All 24 IDs remain 0.1.0 → 0.1.0 (unchanged)
No silent parameter edits
Recommendation: ADVANCE TO 1C without formula retune solely for distribution cosmetics
```

| Entry | Formula ID | Previous | New | Simulation failure | Affected personas | Changed parameter | Reason | Impact | Unresolved concern | Approval |
|-------|------------|----------|-----|--------------------|-------------------|-------------------|--------|--------|--------------------|----------|
| REV-ATT-001 | *(all 24 IDs)* | 0.1.0 | 0.1.0 | None | PER-001…015 PASS | None | Simulation complete with 0 formula failures; pay-to-win diffs = 0 | Candidates advance unchanged | Calibration / sensitivity watches remain for 1C | Founder attested — no revision |

## Post-calibration revisions (Gate 1C)

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
Revisions: MAT 0.1.0→0.2.0 · MOM-002 0.1.0→0.2.0 · XP 0.1.0→0.1.1
```

| Entry | Formula ID | Previous | New | Simulation failure | Affected personas | Changed parameter | Reason | Impact | Unresolved concern | Approval |
|-------|------------|----------|-----|--------------------|-------------------|-------------------|--------|--------|--------------------|----------|
| **REV-CAL-001** | FRM-MAT-001 | 0.1.0 | **0.2.0** | None (definition defect) | Early-Rank paths; Fledgling reachability | Learning contexts = Mission/Stage + Evidence; governed Rank skip; softened sim heuristic | CAL-FND-001 — contexts only from Evidence + formula ambiguity | Fledgling reachable; highest fully-met Rank; not forced population | Real-user Rank mix NOT RUN | Founder accepted clarification |
| **REV-CAL-002** | FRM-MOM-002 | 0.1.0 | **0.2.0** | None (sensitivity watch) | Band-edge league personas | Alternative B promotion buffer = **2**; keep best-6/8w; floors unchanged | CAL-FND-002 — ~37% label sensitivity at edges; score more stable | Reduces label thrash; ADVANCE WITH CONDITIONS | Monitor bands in real pilot | Founder accepted Alternative B |
| **REV-CAL-003** | FRM-XP-001 | 0.1.0 | **0.1.1** | None (explainability) | PER-004 pattern | Evidence XP once-per-approval clarification | CAL-FND-005 — high XP from Evidence milestones ≠ Skill | Separation clarified; no magnitude retune | Usability of copy NOT RUN | Founder accepted clarification |

## Notes

* No silent parameter edits.
* Clarification / hysteresis revisions preferred over quota retunes (Gate §8 principles).
* Simulation PASS is **not** production calibration.
* Calibration recommendation is **not** Final Progression Baseline lock.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Log opened with initial candidate baseline; post-simulation attestation of zero revisions |
| 0.2.0 | 2026-07-21 | Added REV-CAL-001…003 for MAT / MOM-002 / XP under GHV.PROGRESSION.1C |
