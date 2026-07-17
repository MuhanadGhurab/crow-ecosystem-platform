# Universal Process & Workflow Engine

The **CEM process fabric** turns blueprint intent into operational work instances that span departments.

## Universal lifecycle (22 stages)

`ProcessLifecycleStage` in `src/lib/crow-core/process/`:

1. intake  
2. qualify  
3. discover  
4. design  
5. estimate  
6. propose  
7. negotiate  
8. approve  
9. contract  
10. plan  
11. provision  
12. configure  
13. integrate  
14. test  
15. train  
16. pilot  
17. release  
18. operate  
19. monitor  
20. improve  
21. renew  
22. retire  

Each stage carries metadata: owner role, SLA, entry criteria, exit evidence.

## Core types

- `ProcessDefinition` / `ProcessVersion` — template
- `WorkflowInstance` — runtime binding to tenant + blueprint version
- `WorkItem` — assignable unit
- `Handoff` — cross-role transfer with evidence
- `TimelineEvent` — audit-friendly event log
- `SLA` — target and breach semantics

## Alignment with existing code

- `src/lib/cem/cem-operating-model-contract.ts`
- `src/lib/cem/cem-transaction-workflow-contract.ts`
- Prisma `Workflow` / `Task` models (mapping deferred to C3)

## Principles

- One primary owner per work item at a time
- No silent stage skips without traceability record
- Department workspaces consume the same instance model
