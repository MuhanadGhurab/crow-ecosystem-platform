# GHURAVIA Activation UX and Onboarding Entry Baseline

| Field | Value |
|-------|-------|
| **Baseline ID** | GHURAVIA-ACTIVATION-UX-BASELINE |
| **Version** | **v0.3.0** |
| **Status** | **ACTIVE WITH CONDITIONS** |
| **Source Gate** | GHV.IMPLEMENTATION.0C · formalized by **0C-CLOSURE-01** |
| **Authorization** | GHV-IMP-AUTH-003 |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `2f66902f741f5b24c350460c9de13af0b113a9c2` |
| **Implementation HEAD** | `024b71f395d24bdc0d419d1046ec0879dc6a5100` · Actions `29879464258` · verify `88796880094` · **success** |
| **Closure** | **GHV.IMPLEMENTATION.0C-CLOSURE-01 PASS** — server-authoritative route guards · mandatory browser matrix · local cleanup |

## Scope included

- Activation formula unchanged: `email_verified AND current_terms_accepted AND account_risk_status = acceptable`; mobile **OPTIONAL ASSURANCE**
- Hardened screens: **ACT-003 · ACT-011 · ACT-005 · ACT-013 · ACT-012 · ACT-006**
- Handoff screens: **ACT-007** (`/activation/mobile-optional`) thin optional · **ONB-001** (`/onboarding/entry`) handoff-only
- Arabic default locale; English parity; **88** localization keys
- Shared activation shell, progress, Explainable Locks, localized errors
- **Server-authoritative** page guards (`server-only`); client redirects convenience only
- Playwright + `@axe-core/playwright` (dev-only); Critical/Serious axe violations **0** on **actual authorized states**
- Keyboard-only activation e2e **PASS** (mouse user actions **0**); mandatory browser scenarios **19/19**
- Synthetic session, disposable Postgres, email mock mailbox, deterministic local/test controls
- Local cleanup commands `db:cleanup` / `db:stop`
## Explicitly excluded

- ACT-008 OTP · real SMS · mobile verification persistence
- IDN-001…003 · ONB-002 Set Origin · Nest / Horizon · origin persistence
- Complete onboarding (? **GHV.IMPLEMENTATION.0D**)
- Real auth / email / SMS / payments / Evidence / Trust / Prestige
- Preview · Staging · Production · deployment

## Predecessor

| Baseline | Status |
|----------|--------|
| GHURAVIA Foundation Runtime and Activation Slice Baseline **v0.2.0** (0B) | **ACTIVE — LIMITED ACTIVATION VERTICAL SLICE** (retained) |
| GHURAVIA Product Code Bootstrap Baseline **v0.1.0** (0A) | **ACTIVE** (retained) |

This baseline **extends** UX, accessibility, and onboarding-entry handoff; it does not invalidate 0A/0B runtime roots.

## Conditions (non-blocking for Gate closure)

| Condition | Status | Controlled Launch |
|-----------|--------|-------------------|
| Assistive-Technology user validation | **NOT RUN** | **BLOCKER** |
| Native-Arabic expert review | **NOT RUN** | **BLOCKER** |
| Arabic user validation | **NOT RUN** | **BLOCKER** |
| Technical RTL (implementer) | **PARTIAL / COMPLETE** | Review before launch copy |
| Moderate dependency advisories ADV-001 · ADV-002 | **ACCEPT TEMPORARILY WITH OWNER** | Hygiene checkpoint |

## Non-claims

```text
NOT Production-proven
NOT legally approved terms/risk copy
NOT real email/SMS/IdP
NOT Preview/controlled-launch ready
NOT complete onboarding
Screen inventory unchanged: 92 ACTIVE / 7 shells
```

## Evidence

| Document | Role |
|----------|------|
| [IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md](./IMPLEMENTATION-0C-ACCEPTANCE-MATRIX.md) | Gate acceptance |
| [docs/implementation/ACTIVATION-UX.md](../../docs/implementation/ACTIVATION-UX.md) | Operator UX notes |
| [docs/implementation/ACTIVATION-UX-STATE-MATRIX.md](../../docs/implementation/ACTIVATION-UX-STATE-MATRIX.md) | State catalogue |
| [docs/implementation/ONBOARDING-ENTRY-HANDOFF.md](../../docs/implementation/ONBOARDING-ENTRY-HANDOFF.md) | Handoff boundary |
