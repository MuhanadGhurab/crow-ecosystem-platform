# ADR-008: CroAI Is Tenant-Scoped and Advisory by Default

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | PLANNED — no runtime |

## Context

AI features risk crossing tenant boundaries or implying authority.

## Decision

CroAI is an optional tenant-scoped subscription. Default mode is **advisory**. CroAI suspension must not auto-suspend core tenant operations.

## Rationale

Intelligence assists authorized users without becoming an alternate authorization path.

## Alternatives rejected

- Platform-wide generic chatbot
- CroAI as auto-admin
- Bundled mandatory AI in base subscription

## Consequences

Future CroAI implementation must enforce tenant isolation and permission filtering before any feature ships.

## Affected domains

CroAI, Runtime, Subscription, CyberCrow

## Links

- [`08-CROAI-CONSTITUTION.md`](../08-CROAI-CONSTITUTION.md)
