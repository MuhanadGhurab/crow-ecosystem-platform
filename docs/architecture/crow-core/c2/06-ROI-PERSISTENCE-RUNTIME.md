# C2 — ROI persistence runtime

## Models

- **RoiAssumption** — long-lived assumption identity per Blueprint
- **RoiAssumptionRevision** — immutable revision (value, unit, currency, frequency, source, confidence, approval state)
- **RoiSnapshot** — reproducible calculation envelope tied to exact Blueprint version

## Rules

- Sales may propose/edit via new revisions; sales cannot approve assumptions
- Snapshots store engine name/version, formula version, scenario, normalized inputs, outputs, warnings — not only a percentage
- Snapshots reference assumption revision IDs for reproducibility

## Repository

`src/lib/crow-core/blueprint-persistence/roi.repository.ts`

Studio ROI flows remain advisory; full Studio wiring for persist-on-calculate is incremental in C2.
