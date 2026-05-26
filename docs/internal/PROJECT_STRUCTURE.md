# Project Structure

Practical map of where core platform logic lives.

---

## Application routes (`src/app`)

- Public pages and marketing/docs-facing routes
- Admin routes (`/admin/*`) for operator workflows
- Tenant routes (`/[tenant]/*`) for runtime operations
- Discovery/Blueprint/Portal flows
- API routes under `src/app/api/*`

---

## Services and actions

## `src/lib/services`

Primary domain/business services:
- pipeline/discovery/blueprint lifecycle orchestration
- tenant workspace and readiness aggregation
- SAREA runtime/studio services
- CyberCrow operational/trust services
- commercial/pricing/subscription advisory logic

## `src/lib/actions`

Server actions used by UI routes/components to perform controlled writes and mutations.

---

## Mock and constants

## `src/lib/mock`

Mock datasets and helpers for demo/local flows:
- pipeline/discovery/blueprint/mock tenant data
- environment switch logic (`isUseMockData`)

## `src/lib/constants`

Shared enums/labels/keys and curated static config:
- tenant constants (MEEM/Rimal)
- SAREA persona/runtime constants
- discovery template registries
- labels and route-friendly metadata

---

## Components

## `src/components/public`
Public storytelling surfaces and reusable public blocks.

## `src/components/admin`
Operator/admin console panels, summaries, and controls.

## `src/components/tenant`
Tenant runtime components for operations and engine visibility.

## `src/components/studio/sarea`
SAREA studio and preview control components for adaptive experience management.

---

## Scripts (`/scripts`)

Developer/operator scripts for:
- validation and smoke checks
- staging-safe verification
- deployment simulation
- mock integrity checks (`verify-mock-mode-integrity.ts`)
- utility and maintenance operations

---

## Docs boundary

## `docs/public`
Sanitized public documentation for GitHub/portfolio users.

## `docs/internal`
Operational runbooks, phase docs, and implementation status history.

`docs/internal` must remain excluded from public mirror outputs.

---

## Prisma

- `prisma/schema.prisma`: source of data model truth
- `prisma/migrations`: migration history
- Prisma client generation via `npx prisma generate`

Schema changes are controlled and out of scope for docs-only phases unless explicitly requested.
