# Identity and Activation Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-IDN-ACT-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §18 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-003 · SPK-ARC-004 · SPK-ARC-025 |
| **Related baselines** | SCOPE-BASELINE activation formula · MASTER-SCREEN-REGISTRY v1.2.0 · CR-002 / DEC-153 · FLOW-001 |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
SERVER-AUTHORITATIVE ACTIVATION STATE REQUIRED
NO Product Code · NO IdP brand lock without evidence
ACT-004 = HISTORICAL ONLY (does not count; not an implementation target)
```

## 1. Purpose

Validate technical requirements for the locked activation journey so that no screen depends solely on frontend state for authoritative activation status.

## 2. Authoritative activation formula

```text
email_verified
+ current_terms_accepted
+ account_risk_status = acceptable
→ Basic Account Activated (ACT-006)
```

ACT-013 captures risk acceptance only. It does **not** grant entitlement, XP, Mastery, or tenant membership.

## 3. Screen → technical state source map

| Screen ID | Title | Role | Required technical state source | Notes |
|-----------|-------|------|----------------------------------|-------|
| ACT-003 | Email Verification Pending | Pending UX | Server: outstanding verification request (destination, expiry, resend policy) | Not “result” |
| ACT-011 | Email Verification Result | Result UX | Server: token/consume outcome (VERIFIED / FAILED / EXPIRED / REUSED) | Success path sets `email_verified` |
| ACT-012 | Activation Recovery | Interrupted / unfinished | Server: incomplete-activation projection (which formula parts missing) | Never skip mandatory steps; never jump to Skyboard |
| ACT-005 | Accept Mandatory Terms | Terms | Server: current terms version + acceptance record | Versioned |
| ACT-013 | Accept Account Risk | Risk | Server: `account_risk_status` transition to `acceptable` | ACTIVE (CR-002) |
| ACT-006 | Basic Account Activated | Completion | Server: formula evaluation result | Emit only when all parts true |
| ACT-004 | *(Historical)* | SUPERSEDED_ALIAS → ACT-011 | **N/A — historical appendix only** | Must not appear as ACTIVE target; does not count toward 92 |

Happy path (FLOW-001): … → **ACT-003** → **ACT-011** → **ACT-005** → **ACT-013** → **ACT-006** → …

## 4. Validation checklist

| Area | Must validate | Spike |
|------|---------------|-------|
| Account claim | Unique claim; no activated bypass | SPK-ARC-003 |
| Email verification pending | ACT-003 state machine | SPK-ARC-003 |
| Email verification result | ACT-011 outcomes | SPK-ARC-003 |
| Resend | Invalidates or supersedes prior token per policy | SPK-ARC-003 |
| Expiry | Expired → pending/recovery, not silent verify | SPK-ARC-003 |
| Superseded requests | Only latest request valid | SPK-ARC-003 |
| Activation Recovery | ACT-012 resumes correct incomplete step | SPK-ARC-003 · 004 |
| Terms | Current version only | SPK-ARC-003 |
| Acceptable risk | ACT-013 | SPK-ARC-003 |
| Mobile verify | Optional / policy-driven exactly as Scope (ACT-007/008) — not substitute for formula | SPK-ARC-003 |
| Assurance levels | Verified email ≠ elevated assurance ≠ tenant auth | SPK-ARC-003 |
| Public Crow identity | Separated from private legal identity | SPK-ARC-025 |
| Private legal identity | Restricted access | SPK-ARC-025 |
| Minor-user privacy | Age category protections | SPK-ARC-025 |
| Session handling | A0 session appropriate to IdP candidate | SPK-ARC-003 |
| Logout | Session revoke | SPK-ARC-003 |
| Compromised account | Recovery / lock paths | SPK-ARC-003 |
| Support escalation | Audited privileged changes | SPK-ARC-019 |
| Privileged identity changes | Separation of duties | SPK-ARC-019 |

## 5. Hard rules

1. **No screen may depend only on frontend state for authoritative activation status.**
2. Do not import identity rules from another Crow product unless GHURAVIA baselines explicitly approve them.
3. Keycloak (or any IdP) remains **CANDIDATE · PENDING TECHNICAL VALIDATION** — not selected in 1A.
4. Unfinished activation after Sign In (ACT-010) must recover via ACT-012 or the incomplete screen — never Skyboard skip.

## 6. Pass / fail (future)

| Pass | Fail |
|------|------|
| Server formula gates ACT-006 | Client sets “activated” flag alone |
| ACT-003/011/012/005/013/006 distinct | ACT-004 revived as ACTIVE duplicate |
| Interrupted flow resumes correctly | Mandatory step skip |

## 7. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
Usability of ACT-003/011/012/013 NOT RUN
```

## 8. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §18 — activation state authority plan |
