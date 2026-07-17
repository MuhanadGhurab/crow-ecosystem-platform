# Crow Project Management Operating Model

| Field | Value |
|-------|-------|
| **Title** | Project Management Operating Model |
| **Status** | CANONICAL |
| **Authority** | Owner direction — CROW.PM.1 |
| **Last reviewed** | 2026-07-17 (CROW.PM.1) |
| **Supersedes** | Ad-hoc methodology mixing across Crow work |
| **Related decisions** | [`11-DEVELOPMENT-OPERATING-MODEL.md`](11-DEVELOPMENT-OPERATING-MODEL.md), [ADR-012](decisions/ADR-012-define-design-build-certify-promote.md) |
| **Implementation state** | Process model — labels/Projects not created until owner authorizes CROW.PM.2 |

## Purpose

Crow is an **enterprise creation, transformation, and running manager**. Delivery must match that reality: some workstreams evolve continuously; others require stage-gates, evidence, and predictive control.

This document defines **which delivery model applies where**, how workstreams relate, and how portfolio repositories support the Crow product without becoming disconnected side projects.

## Locked principle

**Do not use one methodology for everything.**

| Model | When to use |
|-------|-------------|
| **Predictive / stage-gate** | Authority, security, schema, isolation, commercial/legal, Production, compliance |
| **Adaptive** | Evolving product features in CEM, ProCrow, client portal, discovery, blueprint UX, dashboards |
| **Iterative / incremental** | UI screens, public polish, diagrams, portfolio docs, lab evidence, small tools |
| **Kanban / flow** | Bugs, small improvements, docs maintenance, security fixes, operational support |
| **Research / spike** | Feasibility (CroAI, Nafath/Absher/GOSI, PSP selection, advanced automation) |

All models still obey Crow’s engineering sequence:

```
DEFINE → DESIGN → BUILD → CERTIFY → PROMOTE
```

Adaptive delivery changes **scope rhythm**, not authority boundaries.

## Hybrid delivery system

### 1. Predictive / stage-gate

**Characteristics:** Fixed scope, ordered gates, evidence before Done, owner authorization for Production.

**Required for:**

- Identity and authority
- Auth / security behavior
- Database schema and migrations
- Tenant isolation
- Commercial / legal / payment boundaries
- Production deployments
- Compliance / evidence packages
- GAP-004 resolution (Preview/Production DB isolation)
- PR / `main` reconciliation (GAP-012)

**Cadence:** Gate checklist, not sprint backlog. A predictive item is not “Done” until gates pass.

### 2. Adaptive

**Characteristics:** Evolving backlog, 2-week iterations, monthly roadmap review, owner visual/product acceptance for user-facing change.

**Preferred for:**

- Enterprise Manager / CEM product features
- ProCrow workflows
- Client portal experience
- Discovery features
- Blueprint review features
- Operational workspace features
- Dashboards
- Feedback-driven journey improvements

**Cadence:** 2-week iteration · monthly roadmap review · certification branch before Production.

### 3. Iterative / incremental

**Characteristics:** Small vertical slices that ship value without claiming full domain completion.

**Preferred for:**

- UI screens and public pages
- Visual polish
- Diagrams and portfolio docs
- Lab evidence packages
- Small tools
- User-facing workflow increments

### 4. Kanban / flow

**Characteristics:** WIP limits, continuous pull, no fixed iteration commitment.

**Preferred for:**

- Bugs
- Small improvements
- Documentation updates
- Portfolio maintenance
- Security fixes
- Operational support tasks

### 5. Research / spike

**Characteristics:** Time-boxed learning; output is a decision memo, not production feature code.

**Preferred for:**

- CroAI feasibility
- Saudi government integrations (Nafath / Absher / GOSI)
- Payment provider selection
- Advanced tenant automation
- CyberCrow risk scoring concepts
- SAREA personalization engine depth

**Rule:** Spikes do not grant authority, create tenants, or connect live payment/government APIs without a separate authorized milestone.

## Product / program structure

Crow is managed as a **program** with streams A–O. Full stream cards live in [`13-PRODUCT-ROADMAP.md`](13-PRODUCT-ROADMAP.md).

| ID | Stream | Default delivery model |
|----|--------|------------------------|
| A | Public Experience | Iterative + predictive for Production |
| B | Client Request and Onboarding | Adaptive + predictive for auth/verification |
| C | Discovery | Adaptive |
| D | Operating Model Designer | Adaptive |
| E | Enterprise Blueprint | Adaptive + predictive for approval/versioning |
| F | Commercial Proposal and Agreement | Predictive |
| G | Tenant Build and Readiness | Predictive |
| H | CEM / Enterprise Manager Runtime | Adaptive |
| I | ProCrow Control Tower | Adaptive + predictive for gates |
| J | CyberCrow Trust, Risk, and Evidence | Predictive + iterative UI |
| K | SAREA Experience Layer | Adaptive (presentation only) |
| L | CroAI Advisory Intelligence | Spike → later adaptive |
| M | Billing, Subscription, and Entitlements | Predictive |
| N | Integrations | Spike → predictive |
| O | Portfolio and Public Proof | Iterative + Kanban |

## Prioritization model

### Score formula

```
Priority Score =
  Business Value
  + User Value
  + Risk Reduction
  + Learning Value
  + Dependency Unlock
  − Effort
  − Complexity
  − Security Risk
```

Score each factor **1–5**. Higher total = earlier.

### MoSCoW classes

| Class | Meaning |
|-------|---------|
| **Must Have** | Blocks safe operation, authority integrity, or live Production safety |
| **Should Have** | Core journey value for next MVP phase |
| **Could Have** | Nice-to-have within phase capacity |
| **Later** | Deferred by roadmap |
| **Blocked** | Waiting on owner decision, GAP, or external dependency |

### Adaptive rhythm rules

| Rule | Requirement |
|------|-------------|
| Iteration | 2 weeks |
| Roadmap review | Monthly |
| Feature acceptance | Written criteria before Build |
| Visual/product change | Owner acceptance of deployed/certification evidence |
| Done evidence | Tests + docs + milestone note |
| Production | Separate explicit owner authorization |
| Migrations / hosted writes | Never implied by adaptive “ship” |

## Definition of Ready

Work is Ready only when:

1. Canonical docs for the domain are read (`docs/crow/` + specialist refs as needed)
2. Scope is clear (in / out)
3. Protected boundaries are listed
4. Dependencies are known (including GAP IDs)
5. Delivery model is chosen (predictive / adaptive / iterative / kanban / spike)
6. Acceptance criteria are written
7. Test plan is known
8. Rollback / Production / migration / hosted-data impact is assessed
9. Owner decision required flag is set if needed

## Definition of Done

Work is Done only when:

1. Code and/or docs updated as scoped
2. Required tests pass
3. No unauthorized migrations
4. No hosted business writes unless authorized
5. Security / privacy reviewed for the change class
6. Owner acceptance obtained for visual/product changes
7. Canonical docs updated (`CURRENT-STATE.md`, `GAP-LEDGER.md` when applicable)
8. Milestone / handoff evidence produced
9. **Production authorization remains separate** — Done ≠ Deployed

## Relationship to engineering DoD

This PM DoR/DoD **extends** [`11-DEVELOPMENT-OPERATING-MODEL.md`](11-DEVELOPMENT-OPERATING-MODEL.md). It does not weaken payment≠authority, SAREA≠authority, CroAI≠authority, or tenant isolation rules.

## Immediate governance holds (still active)

Until owner authorizes otherwise:

- No PR #10 merge
- No casual `main` push as Production source while GAP-012 open
- No Production redeploy without explicit authorization
- No hosted migrations outside controlled-migration workflow
- No GitHub Issues / Projects / labels creation until CROW.PM.2 authorization
- No private repo publication
- No sensitive/client/company data in public portfolio assets

## Related documents

- [`13-PRODUCT-ROADMAP.md`](13-PRODUCT-ROADMAP.md)
- [`14-DELIVERY-BACKLOG-MODEL.md`](14-DELIVERY-BACKLOG-MODEL.md)
- [`15-GITHUB-PROJECTS-SETUP-PLAN.md`](15-GITHUB-PROJECTS-SETUP-PLAN.md)
- [`milestones/CROW-PM-1.md`](milestones/CROW-PM-1.md)
