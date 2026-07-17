# AI Capability Framework

Crow Intelligence capabilities are **registered, risk-tiered, and human-gated**.

## AiCapability

Fields include: id, name, riskTier (`low` | `medium` | `high`), humanInTheLoopRequired, explainabilityRequired, quotaClass.

## Prohibited autonomous actions

AI must never autonomously:

- Approve payments or contracts
- Terminate employment or access
- Grant privileged access
- Change security policy
- Publish blueprint or SOW without human approval

Defined in `PROHIBITED_AUTONOMOUS_ACTIONS` in `src/lib/crow-core/ai/`.

## AiInvocation

Every invocation records: capabilityId, actorRef, inputSummary, outputSummary, humanReviewed (when required).

## Quotas

Tied to tenant resilience (doc 10). High-risk capabilities require explicit tenant feature flag in future C7.
