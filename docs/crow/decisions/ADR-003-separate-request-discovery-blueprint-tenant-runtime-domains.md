# ADR-003: Request, Discovery, Blueprint, Tenant, and Runtime Remain Separate Domains

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | IMPLEMENTED — separate Prisma models and routes |

## Context

Temptation to merge intake, design, and runtime into single auto-provisioning flows.

## Decision

Request, Discovery, Blueprint, Tenant provisioning, and Runtime are **separate domains** with explicit gates between them.

## Rationale

Authority control, auditability, and commercial gates require domain separation.

## Alternatives rejected

- Request auto-creates tenant
- Discovery grants operator authority
- Blueprint auto-deploys without approval

## Consequences

Each domain has its own models, routes, milestones, and verification scripts.

## Affected domains

Request, Discovery, Blueprint, Tenant, Runtime, ProCrow

## Links

- [`02-CANONICAL-LIFECYCLE.md`](../02-CANONICAL-LIFECYCLE.md)
- [`10-IMPLEMENTATION-BOUNDARIES.md`](../10-IMPLEMENTATION-BOUNDARIES.md)
