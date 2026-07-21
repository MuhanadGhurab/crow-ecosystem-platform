# Screen Baseline — Architecture Preflight (GHV.ARCHITECTURE.1A)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-SCR-PREFLIGHT |
| **Version** | 1.0.0 |
| **Status** | **PASS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Related** | CR-002 · DEC-153 · MASTER-SCREEN-REGISTRY v1.2.0 · GHV.PRODUCT-DEFINITION.2-AMENDMENT-02 |
| **Gate** | GHV.ARCHITECTURE.1A preflight (screen baseline) |

## Verdict

```text
PASS — 92 GOVERNED SCREENS VERIFIED WITHOUT ALIAS INFLATION
```

## Counting rules applied

| Rule | Result |
|------|--------|
| Governed total = unique **ACTIVE** IDs in inventory table | **92** |
| **SUPERSEDED_ALIAS** / **HISTORICAL_REFERENCE** must **NOT** count | Enforced |
| ACT-004 classification | **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** — appendix only; **does NOT contribute to 92** |
| Aliases in inventory table | **0** |
| Email-verification duplicates invented | **None** |

## Defect closed

| Defect | Preflight finding | Remediation |
|--------|-------------------|-------------|
| Alias inflation | Inventory 92 rows including ACT-004 SUPERSEDED_ALIAS → excluding alias = **91** ACTIVE | CR-002: ACT-004 → Historical Alias Appendix; **ACT-013 Accept Account Risk** added as ACTIVE |

## Activation family (ACTIVE inventory)

| ID | Title | Status |
|----|-------|--------|
| ACT-001 | Create Your Crow | ACTIVE |
| ACT-002 | Create Account | ACTIVE |
| ACT-003 | Email Verification Pending | ACTIVE |
| ACT-005 | Accept Mandatory Terms | ACTIVE |
| ACT-006 | Basic Account Activated | ACTIVE |
| ACT-007 | Mobile Verify Now/Later | ACTIVE |
| ACT-008 | Mobile OTP | ACTIVE |
| ACT-009 | Activation Blocked | ACTIVE |
| ACT-010 | Sign In | ACTIVE |
| ACT-011 | Email Verification Result | ACTIVE |
| ACT-012 | Activation Recovery | ACTIVE |
| ACT-013 | Accept Account Risk | ACTIVE |

**Activation ACTIVE count = 12.** ACT-004 is **not** in this list.

## Historical alias (non-counting)

| ID | Classification | Redirect | Counts toward 92? |
|----|----------------|----------|-------------------|
| ACT-004 | HISTORICAL_REFERENCE / SUPERSEDED_ALIAS | → ACT-011 VERIFIED | **No** |

## Seven-shell roll-up

| Shell | Count |
|-------|------:|
| Public | 8 |
| Activation | 12 |
| Onboarding | 14 |
| Core | 39 |
| Commercial | 6 |
| Trust | 6 |
| Admin | 7 |
| **Total** | **92** |

```text
8 + 12 + 14 + 39 + 6 + 6 + 7 = 92
```

## Scope activation formula alignment

```text
email_verified + current_terms_accepted + account_risk_status = acceptable
```

Surface mapping: ACT-011 (VERIFIED) · ACT-005 (terms) · **ACT-013** (risk acceptable) → ACT-006. ACT-013 does **not** grant entitlement, XP, Mastery, or tenant membership.

## Non-claims

- This preflight does **not** authorize Product Code.
- Learning and Progression formulas are **unchanged**.
- Full Architecture Gate technical validation remains separate from this screen-count preflight.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | CR-002 preflight PASS — alias-safe 92 |
