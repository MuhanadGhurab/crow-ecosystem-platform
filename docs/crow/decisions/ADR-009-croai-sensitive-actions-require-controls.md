# ADR-009: Sensitive CroAI Actions Require Permission, Approval, Confirmation, and Audit

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | PLANNED |

## Context

AI agents may propose actions that affect operational or security state.

## Decision

Sensitive CroAI actions follow: User intent → Permission check → Action preview → Required approval → Explicit confirmation → Execution → Audit evidence.

## Rationale

Human-in-the-loop for material changes; segregation of duties preserved.

## Alternatives rejected

- Autonomous CroAI execution
- Self-approval of AI recommendations

## Consequences

CroAI MVP should be read-only assistance until control sequence is implemented.

## Affected domains

CroAI, CyberCrow, CEM

## Links

- [`08-CROAI-CONSTITUTION.md`](../08-CROAI-CONSTITUTION.md)
