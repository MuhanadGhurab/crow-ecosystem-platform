# Scenario Diff Semantics

**Status:** CURRENT

## Node diff

`compareScenarioGraphs()` — all 17 node types with ADDED/REMOVED/CHANGED/MERGED/SPLIT/EXPANDED/REDUCED/UNCHANGED.

## Edge diff

`compareOperatingGraphEdges()` — EDGE_ADDED/REMOVED, RESPONSIBILITY_TRANSFERRED, OWNERSHIP_RECOMMENDATION_CHANGED, APPROVAL_PATH_CHANGED, INTEGRATION_PATH_CHANGED, TRUST_CONTROL_CHANGED, EVIDENCE_REQUIREMENT_CHANGED.

Each diff includes what changed, why, variant trigger, blueprint paths, advisory status.
