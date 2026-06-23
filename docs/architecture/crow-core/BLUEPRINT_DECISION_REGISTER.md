# Blueprint Decision Register

**Status:** CURRENT (session-local)

## Types

`BlueprintDecisionRegister`, `BlueprintDecisionItem` — `src/lib/model-forge/blueprint/blueprint-decisions.ts`

## Categories

`ORGANIZATION`, `DEPARTMENT`, `PERSONA`, `WORKFLOW`, `ENTITY`, `AUTHORITY`, `EXPERIENCE`, `SECURITY`, `INTEGRATION`, `COMPLIANCE`, `SCALE`, `TOPOLOGY`

## Fields

`question`, `reason`, `affectedBlueprintPaths`, `availableOptions`, `recommendedOption`, `provenance`, `blocking`, `currentDraftSelection`

## Persistence

Selections are **session-local only** via `sessionStorage` (`blueprint-session.ts`). No database rows.

## UI

Blueprint Studio **Decisions** mode and export via `exportDecisionRegister()`.
