# I1 — Crow Portal Architecture, ProCrow Vision & Responsibility Model

**Last updated:** 27 May 2026  
**Audience:** Internal architecture, delivery, trust operations  
**Mode:** Staging / portfolio / advisory-first

**Constraints honored in I1:** no paid infra, no production launch, no live payments, no external APIs, no schema changes, no major feature implementation, no fake AI/compliance/customer claims.

---

## Executive summary

I1 locks the official ecosystem architecture before Client / Proposal Portal implementation:

- Four-portal model is now the canonical product structure.
- ProCrow is formally defined as the internal control tower (not only cybersecurity).
- Platform Admin ownership is explicitly under ProCrow.
- Client / Proposal Portal requirements and auth boundary are documented for next phase execution.

---

## Official four-portal model (locked)

Crow Ecosystem is organized into four primary portals:

1. Public Portal — market-facing entry point for visitors, potential clients, investors, employers, and portfolio reviewers.

2. Client / Proposal Portal — authenticated client space for account/profile, proposal access, blueprint review, scope approval, and onboarding tracking.

3. ProCrow Portal — internal control tower for platform administration, customer-to-tenant operational flow, CyberCrow trust/security, SAREA experience orchestration, runtime cohesion, evidence/GRC/risk, deployment/go-no-go, operator documentation, and deployment discipline.

4. Tenant Runtime Portal — multi-tenant ERP/CEM runtime where client organizations run modules, workflows, tasks, reports, and operations.

---

## Part 1 — Current portal audit

| Route / area | Current portal | Audience | Current maturity | Owner team | Notes / gaps |
|---|---|---|---|---|---|
| `/`, `/industries`, `/architecture`, `/security`, `/pricing`, `/request` | Public | Visitors, leads, portfolio reviewers | 2.5 / 5 | Builder + Founder/Product | Strong narrative baseline, still advisory language only; no production/compliance overclaims. |
| Public docs (`docs/public/*`, release notes) | Public | Visitors + reviewers | 3 / 5 | Builder + Founder/Product | Good portfolio documentation; keep customer claims controlled. |
| `/portal`, `/portal/requests`, `/portal/requests/[requestId]` | Client / Proposal (early) | Request submitter / future client | 1.5 / 5 | Builder + Delivery (future) | Present as early surface; still missing full account/profile/proposal workflow architecture. |
| `/proposal/[token]` | Client / Proposal (bridge) | Client/prospect reviewing proposal | 1.5 / 5 | Builder + Delivery (future) | Scope exists; formal auth-gated client portal still needed before approval flow hardening. |
| `/admin/overview`, `/admin/requests`, `/admin/tenants/[tenantId]`, `/admin/subscriptions`, `/admin/notifications`, `/admin/audit`, `/admin/security-baselines` | ProCrow | Operators, platform admins, trust leads | 3 / 5 | ProCrow Trust Team + Delivery | Correctly under control tower; polish and flow depth continue in I2/I3. |
| `discovery/*`, `blueprints/*` | ProCrow (workflow core) | Implementation analyst, operator, delivery | 3 / 5 | Delivery + ProCrow + Builder | Correct conceptual placement; customer/account linkage needs dedicated client portal contract. |
| `/[tenant]/cybercrow/*` | ProCrow capability, tenant-facing surface | Tenant trust reviewer, security analyst | 3 / 5 | ProCrow Trust Team | Identity remains distinct; should stay distinct while owned by ProCrow. |
| `/sarea/*` | ProCrow capability | SAREA operator, design/control team | 3 / 5 | ProCrow Trust Team | Distinct identity retained; no merge with CyberCrow/admin routing. |
| `/[tenant]/dashboard`, `/[tenant]/modules`, `/[tenant]/hr`, `/[tenant]/finance`, `/[tenant]/crm`, `/[tenant]/sales`, `/[tenant]/procurement`, `/[tenant]/inventory`, `/[tenant]/warehouse`, `/[tenant]/logistics`, `/[tenant]/tasks`, `/[tenant]/workflows`, `/[tenant]/reports`, `/[tenant]/settings/plan` | Tenant Runtime | Tenant admins, executives, managers, users | 3 / 5 | Builder + Delivery + Tenant Admin | G-series readiness is strong; transactional depth and high-volume runtime hardening remain future work. |
| Internal docs (`docs/internal/*`) + operator guides | ProCrow governance support | Founder, operators, delivery, trust | 3 / 5 | ProCrow Trust Team | Mature for portfolio/staging; can be unified further for control-tower onboarding. |

### Audit observations

- **Correctly placed today:** most public routes, admin routes, CyberCrow, SAREA, and tenant runtime routes.
- **Conceptually ProCrow:** admin + discovery/blueprint + CyberCrow + SAREA + runtime safety/verification.
- **Needs Client / Proposal Portal buildout:** authenticated account/profile, proposal + blueprint approval workflow, and onboarding tracker UX contract.
- **Boundary confusion risks:** `/portal` and `/proposal/[token]` exist but do not yet represent the full client portal contract.

---

## Portal definitions, purpose, audience, ownership, non-claims, roadmap

### 1) Public Portal

- **Purpose:** Market-facing entry point.
- **Audience:** Potential clients, investors, employers, portfolio reviewers, market comparison visitors.
- **Current maturity:** 2.5 / 5.
- **Ownership:** Builder Team (implementation) + Founder/Product (narrative and positioning).
- **Route examples:** `/`, `/industries`, `/architecture`, `/security`, `/pricing`, `/request`.
- **Must never claim:** production-launched SaaS, certified compliance, live customers (unless approved), SAP/Oracle replacement.
- **Roadmap:** strengthen value proof + competitor-positioning clarity while retaining advisory honesty.

### 2) Client / Proposal Portal

- **Purpose:** Authenticated client workspace after lead qualification.
- **Audience:** Client owner, client stakeholders, implementation contacts.
- **Current maturity:** 1 / 5 (requirements stage).
- **Ownership:** Delivery Team + Builder Team.
- **Route examples (current bridge):** `/portal/*`, `/proposal/[token]`.
- **Must never claim:** finished onboarding automation, production billing, autonomous proposal approvals.
- **Roadmap:** implement after I1 architecture lock and I2 scope design.

### 3) ProCrow Portal

- **Purpose:** Internal control tower for safe customer-to-tenant operations and trust governance.
- **Audience:** Platform admins, trust/security operations, delivery operators, founder mode owner.
- **Current maturity:** 3 / 5.
- **Ownership:** ProCrow Trust Team (with Delivery and Builder collaboration).
- **Route examples:** `/admin/*`, `discovery/*`, `blueprints/*`, `/[tenant]/cybercrow/*`, `/sarea/*`.
- **Must never claim:** autonomous governance, certified compliance guarantees, fully automated go-live.
- **Roadmap:** UX unification, tighter decision gates, operator speed improvements, stronger evidence posture.

### 4) Tenant Runtime Portal

- **Purpose:** Multi-tenant ERP/CEM operational runtime.
- **Audience:** Tenant admins, executives, managers, frontline users, analysts.
- **Current maturity:** 3 / 5.
- **Ownership:** Builder Team + Delivery Team + Tenant Admin.
- **Route examples:** `/[tenant]/dashboard`, `/[tenant]/modules`, domain modules, tasks/workflows/reports/settings.
- **Must never claim:** fully production-grade transactional ERP replacement at current phase.
- **Roadmap:** future transactional depth, load/scale posture, operational automation where explicitly scoped.

---

## Part 3 — ProCrow definition (control tower)

ProCrow owns:

- Platform Admin Portal
- CyberCrow Trust & Security
- SAREA Experience Studio
- Runtime Cohesion
- Evidence / GRC / Risk
- Deployment / Go-No-Go
- Operator Documentation
- Validation discipline
- Runtime safety
- Deployment discipline

### Why Platform Admin belongs under ProCrow

Platform Admin controls the exact handoff between business demand and safe runtime operation:

Public request  
→ client account/profile  
→ proposal/blueprint  
→ platform admin review  
→ tenant provisioning readiness  
→ runtime monitoring  
→ trust/evidence/SAREA checks

ProCrow is therefore **platform control + trust governance + safety operations**, not only a cybersecurity layer.

---

## Part 4 — Client / Proposal Portal requirements (future implementation contract)

### Required capabilities

- User account creation
- Common login options
- Company profile
- Contact profile
- Request history
- Proposal view
- Blueprint review
- Scope approval
- Onboarding tracker
- Status visibility
- Future notes/messages
- Future missing-information checklist

### Auth boundary

- Public request can start without login.
- **Proposal and blueprint approval require authenticated account.**

### Allowed sign-in methods (planned)

- Email/password
- Google
- Microsoft
- Apple (later, only if approved)

### I1 implementation boundary

- Requirements documented only.
- No schema changes in I1.
- No client portal feature implementation in I1.

---

## Part 5 — Team / responsibility model

### Builder Team

- **Purpose:** Build product systems and UX.
- **Responsibilities:** architecture, frontend/backend, ERP module depth, public portal, client portal implementation, tenant runtime, testing/fixes.
- **Portal ownership:** Public + Tenant Runtime + technical implementation in all portals.

### Delivery Team

- **Purpose:** Customer onboarding and operational delivery.
- **Responsibilities:** discovery, blueprint, proposal, onboarding coordination, tenant setup coordination, training, customer success.
- **Portal ownership:** Client / Proposal + workflow operations in ProCrow.

### Trust Team = ProCrow

- **Purpose:** Safety, trust, governance, control tower execution.
- **Responsibilities:** platform admin, customer-to-tenant flow governance, CyberCrow, SAREA, evidence/GRC/risk, runtime cohesion, deployment go/no-go, validation discipline, operator docs.
- **Portal ownership:** ProCrow Portal and trust boundaries across other portals.

### Founder mode (current)

Muhanad currently operates as:

- Founder / Product Owner
- Platform Architect
- Head of ProCrow / Trust Team
- DevOps owner
- Demo/operator owner

---

## Part 6 — Interface ownership map

| Interface | Primary ownership | Secondary contributors |
|---|---|---|
| Public Portal | Product Owner + Builder Team | Delivery Team (messaging inputs) |
| Client / Proposal Portal | Delivery Team + Builder Team | Product Owner + ProCrow (gates) |
| Platform Admin Portal | ProCrow + Delivery Team | Builder Team |
| CyberCrow | ProCrow Trust Team | Builder Team (implementation support) |
| SAREA Studio | ProCrow Trust Team | Builder Team |
| Operator docs | ProCrow Trust Team | Delivery Team + Product Owner |
| Tenant Runtime Portal | Builder Team + Delivery Team + Tenant Admin | ProCrow (safety boundaries) |
| Deployment / Go-No-Go | ProCrow / DevOps owner | Product Owner + Delivery Team |

---

## Part 7 — RACI matrix

**Roles**

- Founder / Product Owner
- Builder Team
- Delivery Team
- ProCrow Trust Team
- DevOps owner
- Security/GRC owner
- SAREA owner
- Implementation Analyst
- Tenant Admin

| Area | Founder / Product Owner | Builder Team | Delivery Team | ProCrow Trust Team | DevOps owner | Security/GRC owner | SAREA owner | Implementation Analyst | Tenant Admin |
|---|---|---|---|---|---|---|---|---|---|
| Public Portal | A | R | C | C | I | I | I | I | I |
| Client / Proposal Portal | A | R | R | C | I | I | I | C | C |
| Platform Admin Portal | C | C | R | A/R | C | C | C | R | I |
| CyberCrow | C | C | C | A | I | R | I | C | I |
| SAREA | C | C | C | A | I | C | R | C | C |
| Tenant Runtime Portal | C | R | R | C | I | I | I | C | A/R |
| Operator documentation | A | C | R | R | C | C | C | C | I |
| Deployment / Go-No-Go | A | C | C | R | R | C | I | I | I |
| Validation discipline | A | R | C | R | R | C | C | C | I |
| Request → Proposal → Tenant flow | A | C | R | R | C | C | C | R | C |

Legend: **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed.

---

## Part 8 — ProCrow certification roadmap (recommended, non-mandatory)

### Foundation

- CompTIA Security+
- Microsoft SC-900 or AZ-900 (optional foundation)

### Governance / security management

- CISM
- ISO/IEC 27001 Foundation, then Lead Implementer

### Risk / controls

- CRISC
- NCA ECC knowledge and practical mapping

### Architecture / senior track

- CISSP (later, when experience threshold is met)

### Cloud / DevSecOps operations

- AZ-104 or AZ-500 (if Azure security operations become core)
- Practical mastery (non-cert): Supabase/Postgres/Vercel operations

### Why this maps to ProCrow

- CyberCrow security posture
- Evidence/GRC/risk discipline
- Deployment/go-no-go rigor
- Trust governance model
- Runtime safety and operator control

This is a **professional development roadmap**, not a legal requirement claim.

---

## Part 9 — Portal maturity model

### Standard maturity scale

0. Concept  
1. Documented  
2. Basic UI  
3. Workflow-linked  
4. Trust/governance integrated  
5. Production-ready

### Current portal maturity (honest)

| Portal | Current level | Notes |
|---|---:|---|
| Public Portal | **2.5 / 5** | Strong presentation + request entry; still advisory and portfolio-oriented. |
| Client / Proposal Portal | **1 / 5** | Requirements now clarified; implementation is next-phase work. |
| ProCrow Portal | **3 / 5** | Strong admin + CyberCrow + SAREA + validation foundation; needs further UX unification/depth. |
| Tenant Runtime Portal | **3 / 5** | G-series readiness depth is strong; future transactional scale/load depth remains. |

---

## Part 10 — I1 completion boundary

I1 is architecture and governance definition phase only.

- No portal merge in routing.
- No auth model rewrite.
- No schema work.
- No paid infrastructure activation.
- No production launch commitments.

---

## Recommended next phase

Primary recommendation:

- **I2 — Client / Proposal Portal Requirements & Auth Flow Design**

Alternative:

- **I2 — ProCrow Portal UX Unification**

Choose based on immediate business goal (client pipeline conversion vs operator velocity).

