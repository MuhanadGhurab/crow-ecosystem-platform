# Workflow Forge Model

**Status:** CURRENT (template catalog); runtime instances PLANNED

## Location

`src/lib/model-forge/workflows/workflow-template-catalog.ts`

## WorkflowTemplate

Supports topology, states, transitions, workflow positions, evidence, audit events, KPIs, CyberCrow checks, SAREA hints, scale variants.

## Topologies

LINEAR, PARALLEL, CONDITIONAL, ITERATIVE, RECURRING, EVENT_DRIVEN, CASE_BASED, PROJECT_BASED, MISSION_BASED, COLLABORATIVE, EMERGENCY, CROSS_BRANCH, CROSS_COMPANY, HUMAN_AND_AI, LONG_RUNNING, HIGH_VOLUME

## Scaling

`scaleWorkflowTemplate()` — deterministic approval depth and state expansion by scale
