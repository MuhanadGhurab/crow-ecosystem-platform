# Formula Revision Log

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-REV-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

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

## Post-simulation attestation (Gate close)

```text
Revisions after RUN-001…RUN-006: 0
All 24 IDs remain 0.1.0 → 0.1.0 (unchanged)
No silent parameter edits
Recommendation: ADVANCE TO 1C without formula retune solely for distribution cosmetics
```

| Entry | Formula ID | Previous | New | Simulation failure | Affected personas | Changed parameter | Reason | Impact | Unresolved concern | Approval |
|-------|------------|----------|-----|--------------------|-------------------|-------------------|--------|--------|--------------------|----------|
| REV-ATT-001 | *(all 24 IDs)* | 0.1.0 | 0.1.0 | None | PER-001…015 PASS | None | Simulation complete with 0 formula failures; pay-to-win diffs = 0 | Candidates advance unchanged | Calibration / sensitivity watches remain for 1C | Founder attested — no revision |

## Notes

* Revisions **may be added after simulation** (RUN-001…RUN-006 and failure registry).
* Until a revision row changes a version, all formulas remain at `0.1.0`.
* No silent parameter edits.
* Simulation PASS is **not** calibration.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Log opened with initial candidate baseline; post-simulation attestation of zero revisions |
