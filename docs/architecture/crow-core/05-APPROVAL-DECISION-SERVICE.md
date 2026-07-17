# Approval & Decision Service

Approvals gate material changes to blueprint, commercial, security, and tenant configuration.

## Patterns

| Pattern | When |
|---------|------|
| Single approver | Low-risk configuration |
| Sequential chain | Commercial + legal |
| Parallel quorum | Security policy |
| Advisory + human confirm | AI-assisted recommendations |

Types: `ApprovalRequest`, `Decision`, `DecisionAssistance` in `src/lib/crow-core/decision/`.

## Decision assistance boundaries

- AI may **summarize**, **highlight risks**, and **suggest** options
- AI must **not** autonomously approve payments, terminations, privileged access, contracts, or policy changes
- `DecisionAssistance` records model, confidence, and human override

## Alignment

Task/approval depth constants: `src/lib/constants/task-approval-engine-depth.ts` (G8). C4 will extract a dedicated service; C0 documents the target contract only.

## Traceability

Every approval links to `TraceabilityRecord` with actor type (`human` | `ai_assistant` | `automation`).
