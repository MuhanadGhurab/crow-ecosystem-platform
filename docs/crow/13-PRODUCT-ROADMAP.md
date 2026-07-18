# Crow Product Roadmap

| Field | Value |
|-------|-------|
| **Title** | Product Roadmap — Enterprise Manager / ProCrow Ecosystem |
| **Status** | CANONICAL |
| **Authority** | Owner direction — CROW.PM.1 |
| **Last reviewed** | 2026-07-17 (CROW.PM.1) |
| **Supersedes** | Informal “build next shiny thing” sequencing |
| **Related** | [`12-PROJECT-MANAGEMENT-OPERATING-MODEL.md`](12-PROJECT-MANAGEMENT-OPERATING-MODEL.md), [`CURRENT-STATE.md`](CURRENT-STATE.md), [`GAP-LEDGER.md`](GAP-LEDGER.md) |
| **Implementation state** | Planning truth — not a claim of feature completion |

## Product interpretation

**Crow** helps design, transform, build, govern, and operate organizations through:

public entry → request intake → onboarding → discovery → operating model → enterprise blueprint → commercial acceptance → tenant build → CEM runtime → CyberCrow trust → SAREA adaptation → ProCrow control → optional CroAI later.

Primary product focus: **Crow Ecosystem Platform / ProCrow / Enterprise Manager (CEM)**.

## Crow current-state snapshot (verified)

Statuses use: Live · Accepted · Implemented · Partial · Planned · Blocked · Deferred · Unknown.

| Area | Status | Evidence note |
|------|--------|---------------|
| Public Production | **Live** + **Accepted** | https://crow-ecosystem-platform.vercel.app · `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` · POSTPROD.1 |
| Public route model | **Accepted** | CROW.PUBLIC.9/10; browse vs gated process |
| PR #10 | **Blocked** (merge hold) | OPEN DRAFT MERGEABLE — FTGP + public; do not merge casually |
| `main` | **Partial** / risk | `a5620c3` legacy public; GAP-012 open |
| GAP-004 DB isolation | **Open / blocked** | Isolation unproven; **GAP-004A fail-closed implemented** (ALT2) |
| GAP-012 main vs Production | **Open** | RECON.1 cherry-pick plan READY |
| Client journey | **Partial** | Request/discovery/blueprint scaffolding |
| ProCrow | **Partial** | Control tower, queues, studio |
| CEM / Enterprise Manager | **Partial** | Demo tenants (MEEM/Rimal); My-* workspace planned |
| CyberCrow | **Partial** | Audit/GRC/risk UI + trust verifiers |
| SAREA | **Partial** | Experience profiles; composition-only contracts |
| CroAI | **Planned** | Constitution only; no runtime |
| Commercial / payment / subscription | **Planned** / **Partial** | Stripe scaffold advisory; full instruments deferred |

Do not invent completion beyond [`CURRENT-STATE.md`](CURRENT-STATE.md).

---

## Workstream map (A–O)

For each stream: purpose, current state, delivery model, first MVP, risks, dependencies, priority, next backlog items.

### A. Public Experience

| Field | Value |
|-------|-------|
| **Purpose** | Educate, convert, and route visitors without creating business records on browse |
| **Current state** | Live / Accepted on Production; `main` still legacy |
| **Delivery model** | Iterative for polish; **predictive** for Production / reconciliation |
| **First MVP** | Keep Production pinned; public-only `main` reconciliation (RECON path) |
| **Risks** | Accidental `main` deploy reverts UI and may run migrations |
| **Dependencies** | GAP-012; owner RECON decisions |
| **Priority** | P0 (stabilize) |
| **Next backlog** | (1) Execute public-only cherry-pick when authorized (2) Remove migrate-from-build on `main` (3) Production redeploy-from-`main` only after verify (4) Legacy path redirect polish (5) Portfolio public summaries |

### B. Client Request and Onboarding

| Field | Value |
|-------|-------|
| **Purpose** | Capture intent; verify account control; create request records without granting tenant authority |
| **Current state** | Partial |
| **Delivery model** | Adaptive for UX; **predictive** for auth/verification boundaries |
| **First MVP** | Public → signup/login → verified email/mobile → client request → ProCrow queue handoff |
| **Risks** | Verification mistaken for membership; request mistaken for tenant |
| **Dependencies** | Auth foundation; JourneyKind vs OrganizationContext (GAP-008) |
| **Priority** | P1 after Phase 0–1 |
| **Next backlog** | (1) Owner accept CROW.REQUEST.1 plan (2) Phone/GAP-004 decisions (3) CROW.REQUEST.2 JourneyKind + gate alignment (4) Qualification status UX (5) Operator queue entry criteria |

### C. Discovery

| Field | Value |
|-------|-------|
| **Purpose** | Capture organization context, responsibilities, workflows, trust needs |
| **Current state** | Partial |
| **Delivery model** | Adaptive |
| **First MVP** | Discovery questions + Build New vs Transform flows + draft operating-model inputs |
| **Risks** | Discovery granting elevated access; incomplete FTGP shell |
| **Dependencies** | Request qualification; GAP-005 |
| **Priority** | P1 |
| **Next backlog** | (1) Interview readiness checklist (2) Department/role/workflow capture (3) Client vs operator views (4) Evidence export (5) Shell reconciliation |

### D. Operating Model Designer

| Field | Value |
|-------|-------|
| **Purpose** | Compose how the organization should operate before blueprint freeze |
| **Current state** | Partial (via discovery/blueprint scaffolding) |
| **Delivery model** | Adaptive |
| **First MVP** | Responsibilities / workflows / trust model draft from discovery |
| **Risks** | Skipping into runtime without blueprint approval |
| **Dependencies** | Discovery MVP |
| **Priority** | P1 |
| **Next backlog** | (1) Draft artifact schema clarity (2) Client editable sections (3) ProCrow review notes (4) Version snapshot (5) Handoff to blueprint |

### E. Enterprise Blueprint

| Field | Value |
|-------|-------|
| **Purpose** | Reviewed organizational design source for tenant build |
| **Current state** | Partial (versioning, studio, review cycles exist) |
| **Delivery model** | Adaptive for UX; **predictive** for approval, freeze, evidence |
| **First MVP** | Draft → ProCrow review → client review → scope freeze → version trail |
| **Risks** | Build without freeze; weak evidence trail |
| **Dependencies** | Operating model draft; ProCrow gates |
| **Priority** | P1 |
| **Next backlog** | (1) Scope freeze enforcement (2) Client review UX (3) Diff between versions (4) Approval evidence pack (5) Build-readiness checklist link |

### F. Commercial Proposal and Agreement

| Field | Value |
|-------|-------|
| **Purpose** | Commercial instruments independent of authority grants |
| **Current state** | Planned / Partial scaffold |
| **Delivery model** | Predictive |
| **First MVP** | Proposal → agreement acceptance → payment schedule record (provider-neutral) |
| **Risks** | Payment≠authority violation; premature Stripe live |
| **Dependencies** | Blueprint freeze; GAP-001; owner PSP decision |
| **Priority** | P2 (after blueprint MVP) |
| **Next backlog** | (1) Instrument model design (2) Provider-neutral states (3) Failed-payment policy (4) Legal acceptance evidence (5) PSP spike |

### G. Tenant Build and Readiness

| Field | Value |
|-------|-------|
| **Purpose** | Provision and ready tenant only after blueprint + commercial gates |
| **Current state** | Partial (demo tenants; FTGP open) |
| **Delivery model** | Predictive |
| **First MVP** | Readiness checklist + Go/No-Go + membership from approved blueprint |
| **Risks** | Premature membership; GAP-004 bleed |
| **Dependencies** | GAP-004; GAP-005; blueprint freeze |
| **Priority** | P1–P2 |
| **Next backlog** | (1) Readiness checklist (2) Isolation verify (3) Invite/acceptance evidence (4) Go-Live gate (5) Rollback runbook |

### H. CEM / Enterprise Manager Runtime

| Field | Value |
|-------|-------|
| **Purpose** | Run approved organization: work, cases, approvals, records, dashboards |
| **Current state** | Partial (module-centric demos; My-* planned — GAP-006) |
| **Delivery model** | Adaptive |
| **First MVP** | Tenant workspace + roles/personas + tasks/cases/approvals + operational dashboard |
| **Risks** | Building runtime before governance path; authority leaks via UI |
| **Dependencies** | Tenant readiness; CyberCrow isolation; SAREA presentation rules |
| **Priority** | P1 product focus (after intake/control foundations) |
| **Next backlog** | (1) My Attention/Work/Decisions shell (2) Case/task model clarity (3) Approval trail (4) Record views (5) Operator vs member boundaries |

### I. ProCrow Control Tower

| Field | Value |
|-------|-------|
| **Purpose** | Accountable governance from qualification through Go-Live |
| **Current state** | Partial |
| **Delivery model** | Adaptive for queues/UX; **predictive** for lifecycle gates |
| **First MVP** | Qualification queue + review queues + readiness + decision evidence |
| **Risks** | Operator shortcuts skipping gates |
| **Dependencies** | Request/discovery/blueprint artifacts |
| **Priority** | P1 |
| **Next backlog** | (1) Qualification criteria (2) Decision evidence pack (3) Operator docs (4) Dual-role bootstrap (5) Audit of gate skips |

### J. CyberCrow Trust, Risk, and Evidence

| Field | Value |
|-------|-------|
| **Purpose** | Trust signals, isolation enforcement evidence, audit, risk — not autonomous SOC |
| **Current state** | Partial |
| **Delivery model** | Predictive for enforcement; iterative for evidence UI |
| **First MVP** | Isolation checks + authz evidence + audit views + compliance export concept |
| **Risks** | Treating UI as authority; shared DB (GAP-004) |
| **Dependencies** | GAP-004; tenant model |
| **Priority** | P1 (parallel with runtime) |
| **Next backlog** | (1) Isolation checklist (2) Audit log operator view (3) Risk signal taxonomy (4) Evidence export (5) Session/behavior trust concept spike |

### K. SAREA Experience Layer

| Field | Value |
|-------|-------|
| **Purpose** | Permitted UX adaptation only — never grants permission |
| **Current state** | Partial |
| **Delivery model** | Adaptive |
| **First MVP** | Presentation preferences bound to authorized persona — no authority changes |
| **Risks** | SAREA≠authority violation |
| **Dependencies** | Runtime personas; contracts already exist |
| **Priority** | P2 |
| **Next backlog** | (1) Preference model (2) Contract tests (3) Preview mode (4) Tenant-safe defaults (5) No cross-tenant bleed tests |

### L. CroAI Advisory Intelligence

| Field | Value |
|-------|-------|
| **Purpose** | Permission-aware advisory summaries — no autonomous authority |
| **Current state** | Planned |
| **Delivery model** | Spike → later adaptive |
| **First MVP** | Summaries / workflow explanation / evidence briefs with human approval gates |
| **Risks** | CroAI≠authority; data leakage |
| **Dependencies** | Runtime maturity; entitlements; GAP-002 |
| **Priority** | Later |
| **Next backlog** | (1) Provider spike (2) Permission-aware prompt rules (3) Audit of AI outputs (4) Entitlement gate (5) Human approval UX |

### M. Billing, Subscription, and Entitlements

| Field | Value |
|-------|-------|
| **Purpose** | Recurring access bundles without conflating payment and roles |
| **Current state** | Planned / Partial schema |
| **Delivery model** | Predictive |
| **First MVP** | Subscription agreement + entitlements + failed-payment handling (provider-neutral) |
| **Risks** | Payment≠authority; GAP-001/007 |
| **Dependencies** | Commercial MVP; owner PSP decision |
| **Priority** | P2–P3 |
| **Next backlog** | (1) Entitlement versioning design (2) Grace/suspension policy (3) Bundle containment tests (4) Provider adapter boundary (5) Operator override evidence |

### N. Integrations

| Field | Value |
|-------|-------|
| **Purpose** | Official, consented integrations (Saudi enterprise services, identity assurance) |
| **Current state** | Deferred (GAP-010) |
| **Delivery model** | Spike → predictive |
| **First MVP** | Feasibility memos only — no direct API assumptions |
| **Risks** | Unofficial API use; privacy; false assurance |
| **Dependencies** | Official partnerships; regulatory review |
| **Priority** | Later |
| **Next backlog** | (1) Nafath feasibility (2) Absher where officially supported (3) GOSI feasibility (4) Consent/audit controls design (5) Security review gate |

### O. Portfolio and Public Proof

| Field | Value |
|-------|-------|
| **Purpose** | Career/interview proof that supports Crow vision without leaking client data |
| **Current state** | Live profile ecosystem (2026-07-17 GitHub audit) |
| **Delivery model** | Iterative + Kanban |
| **First MVP** | Map each public repo to Crow proof theme; demo-safe packaging |
| **Risks** | Disconnected projects; private source exposure |
| **Dependencies** | Crow narrative consistency |
| **Priority** | Ongoing parallel (P2) |
| **Next backlog** | (1) Portfolio → Crow theme map (2) Demo-safe screenshots (3) Architecture summaries (4) Interview walkthrough (5) LinkedIn proof points |

---

## Phase roadmap

Phases adjusted to repository truth: **stabilize Production/`main` before feature acceleration**.

### Phase 0 — Stabilize Live Public Foundation

- Keep Production pinned on accepted deploy
- Public-only `main` reconciliation (RECON.1 plan)
- Avoid accidental rollback / migrate-from-build
- No new product feature work until deploy safety is clean enough to proceed in parallel safely

**Exit:** Owner-authorized public-only path to `main` **or** explicit accept residual GAP-012 risk while building on feature branch with Production pin hold.

### Phase 1 — Project Management System

- Delivery model (this doc set)
- Workstream map
- Backlog taxonomy
- GitHub Projects design
- Labels / milestone structure (create only after owner auth)
- Decision gates

**Exit:** CROW.PM.2 authorized and applied (or deferred with documented hold).

### Phase 2 — Request and Client Intake MVP

Public request handoff · signup/login · verification boundaries · client request record · ProCrow qualification queue.

**CROW.REQUEST.1 (2026-07-18):** Audit + delivery plan complete — [`request/REQUEST-INTAKE-AUDIT.md`](request/REQUEST-INTAKE-AUDIT.md), [`request/REQUEST-INTAKE-MVP-PLAN.md`](request/REQUEST-INTAKE-MVP-PLAN.md). **No implementation yet.** Substantial wizard already exists; remaining work is JourneyKind persistence, verification policy alignment, qualification UX, and safe certify path (GAP-004).

**Phases (plan):** R0 safety → R1 model design → R2 UX → R3 gates → R4 ProCrow queue → R5 Discovery handoff.

**Next after owner acceptance:** CROW.REQUEST.2 (suggested) local-first implementation, or Issue #16 Preview DB first.

### Phase 3 — Discovery and Operating Model MVP

**Field architecture (CROW.DISCOVERY.FIELD.1):** 10-layer adaptive system, taxonomy, question metadata, stages 1–7 — see [`discovery/DISCOVERY-FIELD-ARCHITECTURE.md`](discovery/DISCOVERY-FIELD-ARCHITECTURE.md).

**CROW.DISCOVERY.1 (plan):** audit + phases D0–D6 — see [`discovery/DISCOVERY-AUDIT.md`](discovery/DISCOVERY-AUDIT.md), [`discovery/DISCOVERY-MVP-PLAN.md`](discovery/DISCOVERY-MVP-PLAN.md).

**CROW.DISCOVERY.2 (build slice):** D0–D2 local-first — see [`milestones/CROW-DISCOVERY-2.md`](milestones/CROW-DISCOVERY-2.md).

**CROW.DISCOVERY.3 (build slice):** D3 Stages 1–3 adaptive form local-first — see [`milestones/CROW-DISCOVERY-3.md`](milestones/CROW-DISCOVERY-3.md).

**CROW.DISCOVERY.4 (build slice):** D4 Operating Model input draft local-first — see [`milestones/CROW-DISCOVERY-4.md`](milestones/CROW-DISCOVERY-4.md).

**CROW.DISCOVERY.5 (build slice):** D5 ProCrow modeling review local-first — see [`milestones/CROW-DISCOVERY-5.md`](milestones/CROW-DISCOVERY-5.md).

**CROW.DISCOVERY.6 (build slice):** D6 Blueprint handoff contract local-first — see [`milestones/CROW-DISCOVERY-6.md`](milestones/CROW-DISCOVERY-6.md). Generation / draft records remain blocked.

**CROW.DISCOVERY.MVP-CERT.1 (cert package):** D0–D6 local-first certification + owner checklist — see [`milestones/CROW-DISCOVERY-MVP-CERT-1.md`](milestones/CROW-DISCOVERY-MVP-CERT-1.md). Acceptance not auto-applied.

Discovery questions · org context · Build New vs Transform · responsibilities/workflows/trust capture · operating model draft · **stop before Blueprint generation**.

### Phase 4 — Enterprise Blueprint MVP

Draft · ProCrow review · client review · scope freeze · versioning · evidence trail.

### Phase 5 — ProCrow Control Tower MVP

Review queues · lifecycle gates · readiness checklist · approval evidence · operator documentation.

### Phase 6 — CEM / Enterprise Manager Runtime MVP

Tenant workspace · roles/personas · responsibilities · workflows/tasks/cases · approvals · records · operational dashboard.

### Phase 7 — CyberCrow Trust and Governance MVP

Isolation checks · authorization evidence · audit views · risk signals · session/behavior trust concept · compliance exports.

### Phase 8 — Commercial and Subscription Layer

Proposal · agreement · payment schedule · subscription · entitlements · failed-payment · provider-neutral records.

### Phase 9 — SAREA Experience Layer

Permitted UX adaptation · preferences · no authority changes · tenant-safe personalization.

### Phase 10 — CroAI Advisory Layer

Permission-aware summaries · explanations · evidence briefs · risk highlights · human approval · no autonomous authority.

### Phase 11 — Integrations and Saudi Enterprise Services

Feasibility only first · consent/audit/security · no direct API assumptions.

### Phase 12 — Portfolio / Case Study Packaging

Public architecture summaries · demo-safe screenshots · interview walkthroughs · GitHub docs · LinkedIn proof.

---

## Immediate next milestones (recommended)

| Order | Milestone | Intent |
|-------|-----------|--------|
| 1 | **Discovery MVP D0–D2** local-first | Build under Issue #18 — does **not** merge PR #10 |
| 2 | **#16 GAP-004 / GAP-004A** | Isolation **blocked**; GAP-004A **implemented** (ALT2) — owner acceptance pending |
| 3 | **#15 GAP-015** | Production auto-deploy settings (parallel) |
| 4 | Later **Blueprint boundary quarantine** | Separate slice when Discovery ready-for-modeling lands |
| 5 | **CROW.CEM.1** | Enterprise Manager runtime MVP architecture |

**PR #10 policy (owner accepted CROW.PR10.2):** draft archive only — extract slices; never merge as monolith. See [`pr10/PR10-ARCHIVE-AND-SLICE-RULE.md`](pr10/PR10-ARCHIVE-AND-SLICE-RULE.md).

**Completed recently:** CROW.REQUEST.2 · CROW.PROCROW.1 / 1A · CROW.DISCOVERY.* · CROW.DISCOVERY.MVP-CERT.1 · CROW.GAP004.1–3 · CROW.GAP004.ALT1 · **CROW.GAP004.ALT2** (GAP-004A fail-closed implemented)

**Parallel Kanban:** portfolio proof packaging, docs hygiene, security fixes — never substitute for Phase 0 safety.

## Portfolio support rule

Every non-Crow public repo should answer: **Which Crow stream or proof theme does this strengthen?** If none, mark **Deferred / Needs Ownership Review** before investing more effort.

See [`14-DELIVERY-BACKLOG-MODEL.md`](14-DELIVERY-BACKLOG-MODEL.md) for GitHub ecosystem classification.
