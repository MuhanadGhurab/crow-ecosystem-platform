# Frontend Architecture Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-FE-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §14 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-001 · SPK-ARC-002 · SPK-ARC-004 · SPK-ARC-006 · SPK-ARC-017 · SPK-ARC-023 |
| **Related baselines** | Master Screen Registry v1.2.0 (92 ACTIVE / 7 shells) · Learning Design Baseline v1.0.0 · Progression Design Baseline v1.0.0 · CR-002 / DEC-153 |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO Product Code
NO schema
NO vendor lock without evidence
≠ TECHNICALLY VALIDATED · ≠ STACK LOCKED · ≠ PRODUCTION READY
```

## 1. Purpose

Define how GHURAVIA will validate frontend architecture against the governed product surface (92 ACTIVE screens, 7 shells, Arabic-first) without implementing Product Code in Gate 1A.

## 2. Validation objectives

| ID | Objective | Pass signal (future) | Fail / reject signal |
|----|-----------|----------------------|----------------------|
| FE-O1 | Repository-compatible UI runtime | Candidate runs in governed Local/Test without inventing undeclared packages as “approved stack” | Requires undeclared runtime or conflicts with deploy guard |
| FE-O2 | Arabic RTL + English LTR coexistence | Shells flip correctly; technical islands remain LTR | Broken bidirectional layout or forced mono-direction |
| FE-O3 | Seven-shell composition | Public / Activation / Onboarding / Core / Commercial / Trust / Admin compose without screen-ID inflation | Alias screens or shell bleed |
| FE-O4 | Server-authoritative protected routes | Activation and entitlement gates enforced server-side | Client-only “isActivated” truth |
| FE-O5 | Save/resume & offline-safe UX | Matches runtime classification (OFFLINE_CAPABLE / READ_ONLY / RECONNECT_REQUIRED / ONLINE_ONLY) | Silent data loss or fake offline writes |
| FE-O6 | Accessibility & reduced motion | STATIC/AUTOMATED/MANUAL paths defined; user validation scheduled | Claiming a11y validated in 1A |

## 3. Assessment surfaces

| Surface | What to validate | Spike |
|---------|------------------|-------|
| Framework ↔ repository fit | Absence of GHURAVIA `package.json`/`src` today; candidate must be inventoried, not assumed from CyberCrow archive | SPK-ARC-001 |
| Arabic RTL / English LTR | Shell direction, nav order, forms | SPK-ARC-002 |
| Mixed-direction technical content | Code, CLI, IPs, paths, URLs inside RTL | SPK-ARC-002 |
| Responsive shells | Breakpoints across 7 shells | SPK-ARC-004 |
| Authenticated navigation | Sign-in → unfinished activation recovery (ACT-012 path) | SPK-ARC-003 |
| Adaptive Skyboard composition | Performance under progression/learning projections | SPK-ARC-023 |
| State management | Client cache vs server authority | SPK-ARC-003 · SPK-ARC-006 |
| SSR vs CSR | Which screens need server render for SEO/auth | SPK-ARC-001 |
| Route protection | Screen IDs map to authz/activation checks | SPK-ARC-004 |
| Forms | Activation, Evidence, commercial, admin | SPK-ARC-003 |
| Optimistic UI | Only where rollback is safe; never for activation completion | SPK-ARC-006 |
| Save / resume | Mission draft, last location | SPK-ARC-006 |
| Offline-safe behavior | Per runtime classification | SPK-ARC-006 |
| Accessibility | Keyboard, focus, status, reduced motion | SPK-ARC-017 |
| Design tokens / component governance | Brand tokens later; no lock in 1A | — |
| Error boundaries / loading / feedback | Explainable locks, recoverable errors | SPK-ARC-004 |
| Analytics boundaries | Analytics ≠ progression authority | SPK-ARC-022 |
| Frontend security | XSS, CSRF pairing, secret non-exposure | SPK-ARC-001 |
| Bundle size / caching | Launch budgets as DRAFT targets | SPK-ARC-023 |
| Testing strategy | Component + shell + RTL + a11y automation plan | SPK-ARC-017 |

## 4. Candidate evaluation template

For every frontend candidate (framework, rendering mode, state library, styling approach):

| Field | Required content |
|-------|------------------|
| Hypothesis | What problem it solves for GHURAVIA |
| Repository evidence | What exists today (inventory only) |
| Expected benefit | Measurable or observable benefit |
| Risk | Lock-in, RTL, a11y, complexity |
| Validation method | Spike ID + environment |
| Pass criteria | Explicit |
| Rejection criteria | Explicit |

**Rule:** No brand or framework is ACCEPTED in 1A. Status remains **CANDIDATE · DECISION PENDING** until later Architecture Gates with spike evidence.

## 5. Activation-family UI constraints (non-negotiable)

| Screen | UI may show | Authoritative state source |
|--------|-------------|----------------------------|
| ACT-003 Pending | Pending copy, resend, change-email (policy) | Server activation state |
| ACT-011 Result | Success / failure / expired outcomes | Server verification result |
| ACT-012 Recovery | Resume to incomplete step | Server incomplete-activation projection |
| ACT-005 Terms | Current terms version acceptance | Server terms record |
| ACT-013 Accept Account Risk | Risk acceptance only | Server `account_risk_status` |
| ACT-006 Activated | Confirmation after formula met | Server activation completion |
| ACT-004 | Historical alias only — **no UI implementation target** | N/A |

Frontend must never treat local storage alone as activation truth.

## 6. Explicit non-claims

* Does not authorize Product Code or UI implementation.
* Does not select a frontend framework.
* Does not validate accessibility (see accessibility plan — NOT RUN).
* Does not inherit CyberCrow UI stack as approved.

## 7. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
Usability validation NOT RUN · Expert RTL review NOT RUN
```

## 8. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §14 — initial validation plan |
