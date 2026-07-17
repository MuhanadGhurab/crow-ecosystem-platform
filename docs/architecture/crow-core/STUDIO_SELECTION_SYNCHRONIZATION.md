# Studio Selection Synchronization

**Status:** CURRENT

## Types

`StudioSelection`, `StudioSelectionSource`, `StudioSelectionTarget` — `src/lib/model-forge/studio/studio-selection.ts`

## Behavior

Graph ↔ Blueprint ↔ provenance ↔ decisions ↔ validation focus via `synchronizeStudioSelection()`.

Circular update guard via selection key deduplication.

## Deep links

Session-local blueprint paths and graph node keys only — no secrets or database IDs in URLs.
