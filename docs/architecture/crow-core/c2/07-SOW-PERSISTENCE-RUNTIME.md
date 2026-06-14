# C2 — SOW persistence runtime

## Models

- **SowDocument** — long-lived SOW identity (tenant + Blueprint)
- **SowVersion** — reviewable/approved version metadata
- **SowSection** — ordered sections with provenance (`GENERATED`, `MANUAL`, `GENERATED_EDITED`, `LOCKED`)

## Regeneration rules

- Regenerate untouched generated sections only
- Preserve manual and locked sections
- Surface conflicts; never silently overwrite manual edits
- Approved SOW versions are immutable
- Advisory only — no e-signature or legal execution

## Repository

`src/lib/crow-core/blueprint-persistence/sow.repository.ts`
