# ADR-010: ProCrow Governs Design-to-Runtime Accountability

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | PARTIAL — console exists; FTGP gates in progress |

## Context

Platform operations need a single accountability surface for design-through-Go-Live.

## Decision

ProCrow governs qualification, review, provenance, commercial-scope preparation, tenant build, readiness, Go-Live, and lifecycle change control. ProCrow is **not** a fourth commercial customer product.

## Rationale

Separates client experience from operator accountability without duplicating commercial SKUs.

## Alternatives rejected

- Client Portal performing tenant build
- Separate "admin product" sold to clients

## Consequences

Operator actions require platform console guards and audit trails.

## Affected domains

ProCrow, Blueprint, Tenant, Commercial

## Links

- [`03-PORTALS-AND-OWNERSHIP.md`](../03-PORTALS-AND-OWNERSHIP.md)
