# Master User Journey

| Field | Value |
|-------|-------|
| **Status** | LOCKED — Authoritative |
| **Version** | 1.1.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.FOUNDATION.1A · amended **GHV.BASELINE-CORRECTION.1** |
| **Related** | [NAVIGATION-MAP.md](./NAVIGATION-MAP.md) · [MASTER-SCREEN-REGISTRY.md](../screens/MASTER-SCREEN-REGISTRY.md) · [PRODUCT-CONSTITUTION.md](../../governance/constitution/PRODUCT-CONSTITUTION.md) · [CRITICAL-FLOWS.md](../interactions/CRITICAL-FLOWS.md) · [SCREEN-BASELINE-REFERENCE-AUDIT.md](../../governance/corrections/SCREEN-BASELINE-REFERENCE-AUDIT.md) |

## Amendment note (v1.1.0 — GHV.BASELINE-CORRECTION.1)

Activation sequence corrected to authoritative screens: **Email Verification Pending (ACT-003)** → **Email Verification Result (ACT-011)** before mandatory Terms. **Activation Recovery (ACT-012)** is reachable from governed failure/interruption points. **ACT-004** is a superseded alias of ACT-011 (not used in journey steps). Total inventory target: **92 screens / 7 shells**. No mandatory activation step may be bypassed. **Verified email ≠ tenant auth ≠ elevated assurance.**

## Journey phases

1. Discover GHURAVIA
2. Create and activate account
3. Personalize the Crow
4. Set the Origin
5. Complete The Nest decision
6. Choose a Horizon
7. Preview the possible future
8. Choose a Route
9. Review the Flight Plan
10. Complete learning Missions
11. Produce and submit Evidence
12. Wings Claimed
13. Use the Adaptive Skyboard
14. Leave, return and recover

## Primary flow (new user)

```text
Landing Page
→ Create Your Crow (ACT-001) / Account Claimed intent
→ Create Account (ACT-002)
→ Email Verification Pending (ACT-003)
→ Email Verification Result (ACT-011)
→ Accept Mandatory Terms (ACT-005)
→ Basic Account Activated (ACT-006)
→ Verify Mobile Now or Later (ACT-007)
→ Personalize Your Crow
→ Set Your Origin
→ The Nest Readiness Choice
→ Choose Your Horizon
→ Preview Your Possible Future
→ Choose Your Route
→ Eligibility and Entitlement Decision
→ Review Your Flight Plan
→ Launch First Mission
→ Submit First Evidence
→ Wings Claimed
→ Adaptive Skyboard
```

## Activation recovery (governed)

```text
Governed interruption / failure during activation
→ Activation Recovery (ACT-012)
→ Resume at the next incomplete mandatory step
   (ACT-003 · ACT-011 · ACT-005 · …)
→ Never skip mandatory steps
→ Verified email alone does not grant tenant auth or elevated assurance
```

Reachable from (non-exhaustive): expired or failed verification outcome handling, session loss mid-activation, risk soft-interrupt with retry allowed, return after ACT-009 resolve when policy permits, and unfinished A0→A1 paths after Sign In (ACT-010).

## Returning user flow

```text
Login
→ Session and Risk Validation
→ Terms-Version Check
→ Load Current User State
→ Build Adaptive Skyboard
→ Continue Previous Flight
```

Unfinished activation after Sign In resumes via ACT-012 or directly into the incomplete activation screen (ACT-003 / ACT-011 / ACT-005 as applicable).

## Phase contracts

| Phase | Entry | Primary outcome | Failure / deferral |
|-------|-------|-----------------|--------------------|
| Discover | Public visitor | Intent to create Crow / account | Exit site |
| Activate | Registration started | A1 basic account | Stuck at A0 until email result success + terms; recovery via ACT-012 without bypass |
| Personalize | A1 | Wingprint basics set | Skip limited cosmetics later |
| Origin | Crow personalized | Origin recorded | Soft default with review prompt |
| Nest decision | Origin set | Ready to Fly / Guided Skip / Nest Recommended | Nest path if < 50% — see [Scope Baseline](../../governance/scope/SCOPE-BASELINE.md) §3.5 |
| Horizon | Nest decision complete | Horizon selected | Browse World Map only |
| Future preview | Horizon selected | Motivational preview acknowledged | Continue without deep preview |
| Route | Preview done | Route chosen | Capacity/entitlement block |
| Flight Plan | Route eligible | Plan reviewed and launched | Return to Route choice |
| Missions | Plan active | Mission progress | Save and Resume |
| Evidence | Mission complete enough | Evidence submitted | Draft offline / retry |
| Wings Claimed | First Evidence path done | Celebration + unlocks | Soft unlock messaging |
| Skyboard | Authenticated ongoing | Adaptive home | Degraded core learning mode |
| Leave/return | Any saved state | Recovery and continue | Risk/terms re-check; incomplete activation → ACT-012 |

## Nest decision outcomes

See [SCOPE-BASELINE.md](../../governance/scope/SCOPE-BASELINE.md) §4.

## Eligibility and entitlement

Commercial entitlement and learning eligibility are evaluated separately before Flight Plan launch. Payment never substitutes for readiness or Evidence.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-20 | GHV.FOUNDATION.1A — initial journey lock |
| 1.1.0 | 2026-07-21 | GHV.BASELINE-CORRECTION.1 — ACT-003/011/012 activation sequence |
