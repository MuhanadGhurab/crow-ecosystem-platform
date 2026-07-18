# Crow — Start Here

| Field | Value |
|-------|-------|
| **Title** | Crow Canonical Documentation Index |
| **Status** | CANONICAL |
| **Authority** | Owner decisions in CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-18 (CROW.GAP004.1) |
| **Supersedes** | Informal doc sprawl as sole AI entry (see [`docs/internal/MILESTONES.md`](../internal/MILESTONES.md) for historical ledger) |
| **Related decisions** | [`decisions/`](decisions/) |
| **Implementation state** | Governance layer established; see [`CURRENT-STATE.md`](CURRENT-STATE.md) |

## Project identity

**Crow** is a governed design-to-runtime service that transforms organizational intent into an approved Operating Model, Enterprise Blueprint, and Operational Tenant — then supports that tenant through recurring platform services, controlled evolution, and optional CroAI intelligence.

**Public promise:** *Design how your organization should operate — then build the system around it.*

**Repository:** [MuhanadGhurab/crow-ecosystem-platform](https://github.com/MuhanadGhurab/crow-ecosystem-platform)

## Canonical document index

| Doc | Subject |
|-----|---------|
| [`00-CROW-CONSTITUTION.md`](00-CROW-CONSTITUTION.md) | Product definition, outcomes, non-claims |
| [`01-SERVICE-MODEL.md`](01-SERVICE-MODEL.md) | Service packaging (Phases A–E) |
| [`02-CANONICAL-LIFECYCLE.md`](02-CANONICAL-LIFECYCLE.md) | End-to-end lifecycle and public projections |
| [`03-PORTALS-AND-OWNERSHIP.md`](03-PORTALS-AND-OWNERSHIP.md) | Four portals and ownership matrix |
| [`04-IDENTITY-AUTHORITY-TRUST.md`](04-IDENTITY-AUTHORITY-TRUST.md) | Identity, verification, authority separations |
| [`05-ENTERPRISE-BLUEPRINT.md`](05-ENTERPRISE-BLUEPRINT.md) | Blueprint domains, provenance, approval |
| [`06-COMMERCIAL-AND-PAYMENTS.md`](06-COMMERCIAL-AND-PAYMENTS.md) | Commercial instruments and payment-state model |
| [`07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md`](07-TENANT-SUBSCRIPTION-AND-ENTITLEMENTS.md) | Subscriptions and entitlements |
| [`08-CROAI-CONSTITUTION.md`](08-CROAI-CONSTITUTION.md) | CroAI boundaries (planned capability) |
| [`09-PUBLIC-EXPERIENCE.md`](09-PUBLIC-EXPERIENCE.md) | Approved public direction; frozen scroll story |
| [`10-IMPLEMENTATION-BOUNDARIES.md`](10-IMPLEMENTATION-BOUNDARIES.md) | What agents must not change without authorization |
| [`11-DEVELOPMENT-OPERATING-MODEL.md`](11-DEVELOPMENT-OPERATING-MODEL.md) | Define → Design → Build → Certify → Promote |
| [`12-PROJECT-MANAGEMENT-OPERATING-MODEL.md`](12-PROJECT-MANAGEMENT-OPERATING-MODEL.md) | Hybrid PM models, DoR/DoD, prioritization |
| [`13-PRODUCT-ROADMAP.md`](13-PRODUCT-ROADMAP.md) | Workstreams A–O and Phase 0–12 roadmap |
| [`14-DELIVERY-BACKLOG-MODEL.md`](14-DELIVERY-BACKLOG-MODEL.md) | Backlog taxonomy, labels design, portfolio map |
| [`15-GITHUB-PROJECTS-SETUP-PLAN.md`](15-GITHUB-PROJECTS-SETUP-PLAN.md) | Projects board design — create only after CROW.PM.2 |
| [`16-PRODUCTION-DEPLOYMENT-POLICY.md`](16-PRODUCTION-DEPLOYMENT-POLICY.md) | Production release authority, main merge, Instant Promote, auto-deploy |
| [`request/REQUEST-INTAKE-AUDIT.md`](request/REQUEST-INTAKE-AUDIT.md) | Client Request Intake current-state audit |
| [`request/REQUEST-INTAKE-MVP-PLAN.md`](request/REQUEST-INTAKE-MVP-PLAN.md) | Client Request Intake MVP delivery plan |
| [`procrow/PROCROW-QUALIFICATION-AUDIT.md`](procrow/PROCROW-QUALIFICATION-AUDIT.md) | ProCrow qualification outcome audit |
| [`procrow/PROCROW-QUALIFICATION-MVP-PLAN.md`](procrow/PROCROW-QUALIFICATION-MVP-PLAN.md) | ProCrow qualification MVP plan |
| [`discovery/DISCOVERY-FIELD-ARCHITECTURE.md`](discovery/DISCOVERY-FIELD-ARCHITECTURE.md) | Adaptive enterprise discovery field architecture |
| [`discovery/DISCOVERY-FIELD-TAXONOMY.md`](discovery/DISCOVERY-FIELD-TAXONOMY.md) | Field taxonomy and MVP/later split |
| [`discovery/DISCOVERY-QUESTION-MODEL.md`](discovery/DISCOVERY-QUESTION-MODEL.md) | Field types and question metadata |
| [`discovery/DISCOVERY-ADAPTIVE-INTAKE-MODEL.md`](discovery/DISCOVERY-ADAPTIVE-INTAKE-MODEL.md) | Stages, outputs, ProCrow review, tests plan |
| [`pr10/PR10-ARCHIVE-AND-SLICE-RULE.md`](pr10/PR10-ARCHIVE-AND-SLICE-RULE.md) | PR #10 draft archive + slice extraction rules (owner accepted) |
| [`pr10/PR10-CONFLICT-AUDIT.md`](pr10/PR10-CONFLICT-AUDIT.md) | PR #10 conflict inventory |
| [`discovery/DISCOVERY-MVP-PLAN.md`](discovery/DISCOVERY-MVP-PLAN.md) | Discovery MVP delivery plan (D0–D6 local-first; cert package prepared) |
| [`discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](discovery/DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md) | D0–D6 local-first certification evidence |
| [`discovery/DISCOVERY-MVP-OWNER-ACCEPTANCE-CHECKLIST.md`](discovery/DISCOVERY-MVP-OWNER-ACCEPTANCE-CHECKLIST.md) | Owner UX / boundary acceptance checklist |
| [`GLOSSARY.md`](GLOSSARY.md) | Terms defined once |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Verified implementation map |
| [`GAP-LEDGER.md`](GAP-LEDGER.md) | Design–implementation gaps |
| [`gaps/GAP-004-DB-ISOLATION-AUDIT.md`](gaps/GAP-004-DB-ISOLATION-AUDIT.md) | Preview/Production DB isolation audit |
| [`gaps/GAP-004-DB-ISOLATION-PLAN.md`](gaps/GAP-004-DB-ISOLATION-PLAN.md) | Isolation decision / implementation plan |
| [`AI-HANDOFF-PROTOCOL.md`](AI-HANDOFF-PROTOCOL.md) | Agent-to-agent handoff fields |

## Reading order

**New AI or developer:**

1. This file
2. [`AGENTS.md`](../AGENTS.md) (repository root)
3. [`00-CROW-CONSTITUTION.md`](00-CROW-CONSTITUTION.md)
4. [`CURRENT-STATE.md`](CURRENT-STATE.md)
5. Domain doc for the active milestone
6. Specialist references in [`docs/architecture/crow-core/`](../architecture/crow-core/) as needed

## Current milestone

**CROW.GAP004.1** — Preview/Production database isolation audit and decision plan (execution not authorized).

Evidence: [`milestones/CROW-GAP004-1.md`](milestones/CROW-GAP004-1.md) · [`gaps/GAP-004-DB-ISOLATION-AUDIT.md`](gaps/GAP-004-DB-ISOLATION-AUDIT.md) · [`gaps/GAP-004-DB-ISOLATION-PLAN.md`](gaps/GAP-004-DB-ISOLATION-PLAN.md)

**Prior:** CROW.DISCOVERY.MVP-CERT.1 @ `a210013` · Discovery D0–D6 local-first

**Production:** https://crow-ecosystem-platform.vercel.app · live `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` · `main` @ `e8cb812`

**Hold:** PR #10 archive · no hosted migrations/writes while GAP-004 open · no Instant Promote · Option C interim

**Recommended next:** Owner provisions dedicated Preview Supabase + binds Vercel Preview env (plan Phases 1–3) · then **GAP-015** · keep Discovery hosted persistence blocked

**Branch:** `feat/first-tenant-golden-path` · **PR #10:** OPEN DRAFT CONFLICTING (archive) · **Project:** #2 private · Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16)

## Current implementation summary

See [`CURRENT-STATE.md`](CURRENT-STATE.md). High level:

- **IMPLEMENTED (partial):** Public site (**accepted on certification**), account registration/verification (C3), Request/Discovery/Blueprint scaffolding, ProCrow console, tenant runtime (MEEM/Rimal demos), Stripe scaffold (advisory)
- **PLANNED:** Full commercial domain, recurring billing enforcement, CroAI runtime, Vercel Option B auto-deploy gate (owner settings), Saudi government integrations
- **FROZEN:** Cinematic scroll-story experiment (`/experience/architects-map`)

## Major protected boundaries

See [`10-IMPLEMENTATION-BOUNDARIES.md`](10-IMPLEMENTATION-BOUNDARIES.md) and [`AGENTS.md`](../AGENTS.md).

## Development workflow

1. **Define** — purpose, states, permissions, audit requirements
2. **Design** — journey, hierarchy, interaction states
3. **Build** — approved scope only
4. **Certify** — behavior, authority, tests in certification environment
5. **Promote** — only after explicit owner acceptance

## How to update documentation

- **Product truth** → update the owning canonical doc in `docs/crow/`
- **Implementation truth** → update `CURRENT-STATE.md` with evidence (file paths, routes, entities)
- **Gaps** → add or update entries in `GAP-LEDGER.md`
- **Locked decisions** → add ADR in `docs/crow/decisions/`
- **Historical evidence** → preserve in `docs/architecture/` or `docs/internal/`; mark superseded sections and link to canonical source
- Do not duplicate definitions — link to the authoritative owner

## Specialist references (preserved)

| Area | Location |
|------|----------|
| Crow Core architecture (C0) | [`docs/architecture/crow-core/`](../architecture/crow-core/) |
| Identity constitution (detail) | [`06-IDENTITY-TRUST-SECURITY-CONSTITUTION.md`](../architecture/crow-core/06-IDENTITY-TRUST-SECURITY-CONSTITUTION.md) |
| First Tenant Golden Path | [`docs/architecture/crow-core/first-tenant/`](../architecture/crow-core/first-tenant/) |
| Delivery milestones (historical) | [`docs/internal/MILESTONES.md`](../internal/MILESTONES.md) |
| Project status (historical) | [`docs/internal/PROJECT_STATUS.md`](../internal/PROJECT_STATUS.md) |
