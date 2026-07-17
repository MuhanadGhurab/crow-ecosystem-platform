# ADR-014: Repository Documentation Is the Durable AI Source of Truth

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | IMPLEMENTED — `docs/crow/` layer established |

## Context

Chat history, model memory, and session reports were treated as project truth, causing contradictions across agents.

## Decision

**Repository documentation** (`docs/crow/`, `AGENTS.md`, ADRs, `CURRENT-STATE.md`) is the durable source of truth. Chat and model memory are **not** authoritative.

## Rationale

Enables consistent multi-AI and multi-developer operation with auditable governance.

## Alternatives rejected

- Session-only governance
- Duplicating full constitution in every agent prompt

## Consequences

Agents must read canonical docs first. Historical docs preserved but superseded sections link to `docs/crow/`. Gaps recorded in `GAP-LEDGER.md`.

## Affected domains

Governance, all AI development

## Links

- [`START-HERE.md`](../START-HERE.md)
- [`AGENTS.md`](../../../AGENTS.md)
