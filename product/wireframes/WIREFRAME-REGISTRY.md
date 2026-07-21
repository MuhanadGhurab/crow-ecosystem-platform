# Wireframe Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-REG-001 |
| **Version** | 1.1.0 |
| **Status** | LOCKED AT LOW FIDELITY (registry) |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 · amended **GHV.BASELINE-CORRECTION.1** |
| **Last updated** | 2026-07-21 |
| **Related** | [MASTER-SCREEN-REGISTRY.md](../screens/MASTER-SCREEN-REGISTRY.md) · [WIREFRAME-REVIEW-CHECKLIST.md](./WIREFRAME-REVIEW-CHECKLIST.md) · [SCREEN-BASELINE-REFERENCE-AUDIT.md](../../governance/corrections/SCREEN-BASELINE-REFERENCE-AUDIT.md) |
| **Scope** | CONTROLLED LAUNCH coverage + deferred notes |
| **Unresolved** | Route catalogue names — LEARNING.1; formulas — PROGRESSION.1 |
| **Change history** | 1.0.0 — PD.3 · **1.1.0 — BASELINE-CORRECTION.1** (90→**92**; ACT-003 rename; ACT-004 superseded; ACT-011/012 added) |

### Amendment note (v1.1.0 — GHV.BASELINE-CORRECTION.1)

Screens covered **90 → 92**. **ACT-003** renamed to Email Verification Pending. **ACT-004** marked **SUPERSEDED_ALIAS → ACT-011** (retain ID; do not use for new flow routing). **ACT-011** Email Verification Result and **ACT-012** Activation Recovery added as DETAILED · CONTROLLED LAUNCH · P0.

## ID convention

| Kind | Form | Example |
|------|------|---------|
| Screen (locked) | `{FAMILY}-{NNN}` | `SKY-001` |
| Screen alias | `GHV-SCR-{FAMILY}-{NNN}` | `GHV-SCR-SKY-001` |
| Wireframe | `GHV-WF-{FAMILY}-{NNN}` | `GHV-WF-SKY-001` |

Gate conceptual names (e.g. BILL, ACC, CORE, LIVE) map to locked families **PAY, TRU, SKY/WLD, LIV**. No screen was removed. Public Live Sky = public-safe variant of **LIV-001** (Scope public Live; no 91st ID).

## Wireframe status vocabulary

DETAILED WIREFRAME · SCREEN-FAMILY SPECIFICATION · STATE-ONLY SPECIFICATION · POST-LAUNCH DEFERRED · CONDITIONAL

## Review status vocabulary

DRAFTED · REVIEWED · LOCKED · CONDITIONAL · DEFERRED  

Detailed items: **LOCKED AT LOW FIDELITY** (not final UI).

---

## Public (8)

| Screen | Name | Scope | WF status | WF ID | Family doc | Priority | Variants | Flow | Review |
|--------|------|-------|-----------|-------|------------|----------|----------|------|--------|
| PUB-001 | Landing | CONTROLLED LAUNCH | DETAILED | GHV-WF-PUB-001 | [public/PUBLIC-WIREFRAMES.md](./public/PUBLIC-WIREFRAMES.md) | P0 | locale | FLOW-001 | LOCKED |
| PUB-002 | Product Story | CONTROLLED LAUNCH | DETAILED | GHV-WF-PUB-002 | same | P0 | — | FLOW-001 | LOCKED |
| PUB-003 | Horizons Overview | CONTROLLED LAUNCH | DETAILED | GHV-WF-PUB-003 | same | P0 | — | — | LOCKED |
| PUB-004 | Safety & Trust | CONTROLLED LAUNCH | DETAILED | GHV-WF-PUB-004 | same | P1 | — | — | LOCKED |
| PUB-005 | Pricing Overview | CONTROLLED LAUNCH | DETAILED | GHV-WF-PUB-005 | same | P0 | plans | FLOW-013 | LOCKED |
| PUB-006 | Legal Hub | CONTROLLED LAUNCH | FAMILY | GHV-WF-PUB-006 | same | P1 | — | — | LOCKED |
| PUB-007 | Terms (public) | CONTROLLED LAUNCH | FAMILY | GHV-WF-PUB-007 | same | P1 | — | — | LOCKED |
| PUB-008 | Privacy (public) | CONTROLLED LAUNCH | FAMILY | GHV-WF-PUB-008 | same | P1 | — | — | LOCKED |

Public Live Sky: see LIV-001 public-safe variant in live docs.

## Activation (12 registry rows · 92-screen model)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| ACT-001 | Create Your Crow | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-001 | [activation/ACTIVATION-WIREFRAMES.md](./activation/ACTIVATION-WIREFRAMES.md) | P0 | FLOW-001 | LOCKED |
| ACT-002 | Create Account | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-002 | same | P0 | FLOW-001 | LOCKED |
| ACT-003 | Email Verification Pending | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-003 | same | P0 | FLOW-001 / FLOW-001-P | LOCKED |
| ACT-004 | ~~Email Verified~~ — **SUPERSEDED_ALIAS → ACT-011** | CONTROLLED LAUNCH | SUPERSEDED (alias wireframe) | GHV-WF-ACT-004 | same | — | historical PD.3 only | SUPERSEDED |
| ACT-005 | Accept Mandatory Terms | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-005 | same | P0 | FLOW-001 | LOCKED |
| ACT-006 | Basic Account Activated | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-006 | same | P0 | FLOW-001 | LOCKED |
| ACT-007 | Mobile Verify Now/Later | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-007 | same | P0 | FLOW-001 | LOCKED |
| ACT-008 | Mobile OTP | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-008 | same | P0 | FLOW-001 | LOCKED |
| ACT-009 | Activation Blocked | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-009 | same | P0 | FLOW-001 | LOCKED |
| ACT-010 | Sign In | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-010 | same | P0 | FLOW-006 | LOCKED |
| ACT-011 | Email Verification Result | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-011 | same | P0 | FLOW-001 / FLOW-001-R-* | LOCKED |
| ACT-012 | Activation Recovery | CONTROLLED LAUNCH | DETAILED | GHV-WF-ACT-012 | same | P0 | FLOW-001-REC / FLOW-001-INT | LOCKED |

## Identity (6)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| IDN-001 | Crow Personalize | CONTROLLED LAUNCH | DETAILED FAMILY | GHV-WF-IDN-001 | [identity/](./identity/) | P0 | FLOW-001 | LOCKED |
| IDN-002 | Habitat Select | CONTROLLED LAUNCH | DETAILED FAMILY | GHV-WF-IDN-002 | same | P0 | FLOW-001 | LOCKED |
| IDN-003 | Character Select | CONTROLLED LAUNCH | DETAILED FAMILY | GHV-WF-IDN-003 | same | P0 | FLOW-001 | LOCKED |
| IDN-004 | Wingprint Home | CONTROLLED LAUNCH | DETAILED FAMILY | GHV-WF-IDN-004 | same | P1 | — | LOCKED |
| IDN-005 | Privacy Settings | CONTROLLED LAUNCH | DETAILED FAMILY | GHV-WF-IDN-005 | same + account | P0 | FLOW-016 | LOCKED |
| IDN-006 | Titles & Crests | CONTROLLED LAUNCH | FAMILY | GHV-WF-IDN-006 | same | P1 | — | LOCKED |

## Onboarding (11)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| ONB-001 | Personalize Entry | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-001 | [onboarding/ONBOARDING-WIREFRAMES.md](./onboarding/ONBOARDING-WIREFRAMES.md) | P0 | FLOW-001 | LOCKED |
| ONB-002 | Set Origin | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-002 | same | P0 | FLOW-001 | LOCKED |
| ONB-003 | Nest Intro | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-003 | same + Nest flow | P0 | FLOW-001 | LOCKED |
| ONB-004 | Nest Assessment | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-004 | same | P0 | FLOW-001 | LOCKED |
| ONB-005 | Nest Result | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-005 | same | P0 | FLOW-001 | LOCKED |
| ONB-006 | Nest Learning Path | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-006 | same | P0 | FLOW-001 | LOCKED |
| ONB-007 | Choose Horizon | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-007 | same + Horizon preview | P0 | FLOW-001 | LOCKED |
| ONB-008 | Preview Possible Future | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-008 | same | P0 | FLOW-001 | LOCKED |
| ONB-009 | Choose Route | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-009 | same | P0 | FLOW-001/003/004/005 | LOCKED |
| ONB-010 | Eligibility Decision | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-010 | same | P0 | FLOW-003/004/005 | LOCKED |
| ONB-011 | Flight Plan Review | CONTROLLED LAUNCH | DETAILED | GHV-WF-ONB-011 | same | P0 | FLOW-001/007 | LOCKED |

## Learning (12)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| LRN-001 | Mission Player | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-001 | [learning/](./learning/) | P0 | FLOW-001/002 | LOCKED |
| LRN-002 | Mission Complete | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-002 | same | P0 | FLOW-002 | LOCKED |
| LRN-003 | Evidence Capture | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-003 | same | P0 | FLOW-002/008 | LOCKED |
| LRN-004 | Evidence Submit | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-004 | same | P0 | FLOW-002/008 | LOCKED |
| LRN-005 | Evidence Status | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-005 | same | P0 | FLOW-002/008 | LOCKED |
| LRN-006 | Assessment Runner | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-006 | same | P0 | — | LOCKED |
| LRN-007 | Stage Overview | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-007 | same | P0 | — | LOCKED |
| LRN-008 | Route Overview | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-008 | same | P0 | FLOW-003 | LOCKED |
| LRN-009 | Unlock Celebration | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-009 | same | P1 | — | LOCKED |
| LRN-010 | Wings Claimed | CONTROLLED LAUNCH | DETAILED | GHV-WF-LRN-010 | same | P0 | FLOW-002 | LOCKED |
| LRN-011 | Cross-Wing Hub | CONTROLLED LAUNCH | FAMILY | GHV-WF-LRN-011 | same | P1 | — | LOCKED |
| LRN-012 | Secure Extension Hub | CONTROLLED LAUNCH | FAMILY | GHV-WF-LRN-012 | same | P1 | — | LOCKED |

Lab / remediation: Mission Workspace variants (STATE on LRN-001).

## Core World / Skyboard (4)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Variants | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|----------|------|--------|
| SKY-001 | Adaptive Skyboard | CONTROLLED LAUNCH | DETAILED | GHV-WF-SKY-001 | [core/](./core/) | P0 | 16 variants | FLOW-006/007 | LOCKED |
| WLD-001 | World Map | CONTROLLED LAUNCH | DETAILED | GHV-WF-WLD-001 | same | P0 | zoom levels | — | LOCKED |
| WLD-002 | Horizon Detail | CONTROLLED LAUNCH | DETAILED | GHV-WF-WLD-002 | same | P0 | — | — | LOCKED |
| WLD-003 | Learning Graph View | CONTROLLED LAUNCH | DETAILED | GHV-WF-WLD-003 | same | P0 | FLOW-003 | LOCKED |

Notifications: STATE-ONLY on SKY-001. Flight Log / RAVEN / Wings modules: DETAILED within Skyboard pack.

## Community (8)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| COM-001 | Rookery Home | CONTROLLED LAUNCH | DETAILED | GHV-WF-COM-001 | [community/](./community/) | P0 | — | LOCKED |
| COM-002 | Structured Feed | CONTROLLED LAUNCH | DETAILED | GHV-WF-COM-002 | same | P0 | — | LOCKED |
| COM-003 | Post Detail | CONTROLLED LAUNCH | DETAILED | GHV-WF-COM-003 | same | P0 | FLOW-012 | LOCKED |
| COM-004 | Create Post | CONTROLLED LAUNCH | DETAILED | GHV-WF-COM-004 | same | P1 | — | LOCKED |
| COM-005 | Route Space | CONTROLLED LAUNCH | DETAILED | GHV-WF-COM-005 | same | P0 | FLOW-011 | LOCKED |
| COM-006 | Team Space | CONTROLLED LAUNCH | FAMILY | GHV-WF-COM-006 | same | P1 | FLOW-011 | LOCKED |
| COM-007 | Teams Directory | CONTROLLED LAUNCH | DETAILED | GHV-WF-COM-007 | same | P1 | FLOW-011 | LOCKED |
| COM-008 | Repository Space | CONTROLLED LAUNCH | FAMILY | GHV-WF-COM-008 | same | P1 | — | LOCKED |

Unrestricted DMs: OUT OF SCOPE (no screen).

## Live Sky (6)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| LIV-001 | Live Sky Directory | CONTROLLED LAUNCH | DETAILED | GHV-WF-LIV-001 | [live/](./live/) | P0 | FLOW-009/010 | LOCKED |
| LIV-002 | Event Detail | CONTROLLED LAUNCH | DETAILED | GHV-WF-LIV-002 | same | P0 | FLOW-009/010 | LOCKED |
| LIV-003 | Participant Session | CONTROLLED LAUNCH | DETAILED | GHV-WF-LIV-003 | same | P0 | FLOW-009 | LOCKED |
| LIV-004 | Spectator View | CONTROLLED LAUNCH | DETAILED | GHV-WF-LIV-004 | same | P0 | FLOW-010 | LOCKED |
| LIV-005 | Session Results | CONTROLLED LAUNCH | DETAILED | GHV-WF-LIV-005 | same | P0 | FLOW-009 | LOCKED |
| LIV-006 | Live Host Console | CONTROLLED LAUNCH (essential ops) | FAMILY/DETAILED | GHV-WF-LIV-006 | same | P2 | — | LOCKED |

Replay: FAMILY on LIV-005.

## Progression (6)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| PRG-001 | Progression Overview | CONTROLLED LAUNCH | FAMILY | GHV-WF-PRG-001 | [progression/](./progression/) | P1 | — | LOCKED |
| PRG-002 | Momentum League | CONTROLLED LAUNCH | FAMILY | GHV-WF-PRG-002 | same | P1 | — | LOCKED |
| PRG-003 | Mastery Board | CONTROLLED LAUNCH | DETAILED | GHV-WF-PRG-003 | same | P0 | FLOW-002 | LOCKED |
| PRG-004 | Achievements | CONTROLLED LAUNCH | DETAILED | GHV-WF-PRG-004 | same | P0 | — | LOCKED |
| PRG-005 | Leaderboards Limited | CONTROLLED LAUNCH | FAMILY | GHV-WF-PRG-005 | same | P2 | — | LOCKED |
| PRG-006 | Prestige View | CONTROLLED LAUNCH (surface) | DETAILED | GHV-WF-PRG-006 | same | P1 | — | LOCKED |

Formulas: PENDING GHV.PROGRESSION.1.

## Commercial (6)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| PAY-001 | Plans | CONTROLLED LAUNCH | DETAILED | GHV-WF-PAY-001 | [commercial/](./commercial/) | P0 | FLOW-004/013 | LOCKED |
| PAY-002 | Checkout | CONTROLLED LAUNCH | DETAILED | GHV-WF-PAY-002 | same | P0 | FLOW-013 | LOCKED |
| PAY-003 | Payment Result | CONTROLLED LAUNCH | DETAILED | GHV-WF-PAY-003 | same | P0 | FLOW-013 | LOCKED |
| PAY-004 | Subscription Manage | CONTROLLED LAUNCH | DETAILED | GHV-WF-PAY-004 | same | P0 | FLOW-014 | LOCKED |
| PAY-005 | Invoices | PENDING EXTERNAL VALIDATION | FAMILY | GHV-WF-PAY-005 | same | P2 | — | CONDITIONAL |
| PAY-006 | Merit Grants | CONTROLLED LAUNCH | DETAILED | GHV-WF-PAY-006 | same | P0 | FLOW-004 | LOCKED |

Grace: STATE + PAY-004 (FLOW-014). Provider: PENDING TECHNICAL VALIDATION.

## Account / Trust (6)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Flow | Review |
|--------|------|-------|-----------|-------|-----|----------|------|--------|
| TRU-001 | Session Validation | CONTROLLED LAUNCH | DETAILED | GHV-WF-TRU-001 | [account/](./account/) | P0 | FLOW-006 | LOCKED |
| TRU-002 | Terms Version Update | CONTROLLED LAUNCH | DETAILED | GHV-WF-TRU-002 | same | P0 | FLOW-006 | LOCKED |
| TRU-003 | Security Settings | CONTROLLED LAUNCH | DETAILED | GHV-WF-TRU-003 | same | P0 | FLOW-015 | LOCKED |
| TRU-004 | Assurance Status | CONTROLLED LAUNCH | DETAILED | GHV-WF-TRU-004 | same | P0 | — | LOCKED |
| TRU-005 | Recovery | CONTROLLED LAUNCH | DETAILED | GHV-WF-TRU-005 | same | P0 | FLOW-015 | LOCKED |
| TRU-006 | Report / Appeal | CONTROLLED LAUNCH | DETAILED | GHV-WF-TRU-006 | same | P0 | FLOW-012 | LOCKED |

Ages 15–17 activation UX: CONDITIONAL on legal validation.

## Administration (7)

| Screen | Name | Scope | WF status | WF ID | Doc | Priority | Review |
|--------|------|-------|-----------|-------|-----|----------|--------|
| ADM-001 | Admin Home | CONTROLLED LAUNCH | DETAILED | GHV-WF-ADM-001 | [administration/](./administration/) | P0 | LOCKED |
| ADM-002 | User Support | CONTROLLED LAUNCH | FAMILY | GHV-WF-ADM-002 | same | P1 | LOCKED |
| ADM-003 | Moderation Queue | CONTROLLED LAUNCH | DETAILED | GHV-WF-ADM-003 | same | P0 | LOCKED |
| ADM-004 | Content Lifecycle | CONTROLLED LAUNCH | FAMILY | GHV-WF-ADM-004 | same | P1 | LOCKED |
| ADM-005 | Entitlement Audit | CONTROLLED LAUNCH | DETAILED | GHV-WF-ADM-005 | same | P0 | LOCKED |
| ADM-006 | Live Ops | CONTROLLED LAUNCH | FAMILY | GHV-WF-ADM-006 | same | P1 | LOCKED |
| ADM-007 | Audit Log Viewer | CONTROLLED LAUNCH | DETAILED | GHV-WF-ADM-007 | same | P0 | LOCKED |

## Counts

| WF status | Count |
|-----------|------:|
| DETAILED (incl. detailed family) | ~72 |
| SCREEN-FAMILY SPECIFICATION | ~16 |
| STATE-ONLY | notifications + grace + lab/remediation overlays |
| CONDITIONAL | invoices wording; minors UX |
| POST-LAUNCH DEFERRED | none of the 92 removed; depth features deferred in Scope |
| SUPERSEDED alias | ACT-004 → ACT-011 (ID retained) |
| **Screens covered** | **92 / 92** |
