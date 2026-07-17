# ADR-013: Owner Acceptance Is Required Before Promotion

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | Process — effective immediately |

## Context

AI agents may treat their own reports as approval to merge or deploy.

## Decision

**Owner acceptance is required before promotion** (merge to main, Production deploy). Cursor reports and verifier green output are evidence only — not acceptance.

## Rationale

Product owner retains authority over what reaches clients and Production.

## Alternatives rejected

- Auto-merge on CI green
- Agent self-certification as acceptance

## Consequences

Handoffs must state `owner review status: Pending` unless explicitly confirmed. PR #10 remains unmerged until owner authorizes.

## Affected domains

All promotion activities

## Links

- [`AI-HANDOFF-PROTOCOL.md`](../AI-HANDOFF-PROTOCOL.md)
- [`11-DEVELOPMENT-OPERATING-MODEL.md`](../11-DEVELOPMENT-OPERATING-MODEL.md)
