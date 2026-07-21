# Authorization Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-AUTHZ-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §19 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-003 · SPK-ARC-012 · SPK-ARC-013 · SPK-ARC-019 · SPK-ARC-025 |
| **Related** | [IDENTITY-ACTIVATION-VALIDATION-PLAN.md](./IDENTITY-ACTIVATION-VALIDATION-PLAN.md) · [COMMERCIAL-ENTITLEMENT-VALIDATION-PLAN.md](../commercial/COMMERCIAL-ENTITLEMENT-VALIDATION-PLAN.md) |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO final RBAC database model
NO Product Code
```

## 1. Purpose

Separate six distinct control planes so implementation cannot collapse them into a single “role flag.”

## 2. Distinctions (mandatory)

| Plane | Question it answers | Not the same as |
|-------|---------------------|-----------------|
| **Authentication** | Who is the principal asserting identity? | Activation, entitlement |
| **Account Activation** | Has the basic activation formula completed? | Authn success; plan purchase |
| **Authorization** | What actions may this principal perform in this context? | Learning eligibility |
| **Commercial Entitlement** | What Access Plan / Merit access is granted? | XP, Mastery, Trust |
| **Learning Eligibility** | What Learning Graph nodes may be entered under educational rules? | Payment tier |
| **Trust Eligibility** | What integrity/reliability constraints apply (POL-TRU)? | Popularity; Skill |
| **Contextual Conditions** | Time, device assurance, minor status, Live Sky role, etc. | Permanent role alone |

```text
Authn ≠ Activation ≠ Authz ≠ Entitlement ≠ Learning Eligibility ≠ Trust
```

## 3. Principal types to validate

| Principal | Typical authority (conceptual) | Least-privilege notes |
|-----------|--------------------------------|------------------------|
| Visitor | Public screens only | No private data |
| Learner | Own learning / Evidence / progression views | No review of others by default |
| Reviewer | Assigned Evidence review | No entitlement admin |
| Mentor | Guided support within Scope | No moderation power by default |
| Moderator | Community / safety actions | No payment mutation |
| Support operator | Account recovery assist | Break-glass audited |
| Content operator | Catalogue draft/publish pipeline | No Trust standing write |
| Finance operator | Invoices / reconcile | No Evidence object access |
| Administrator | Privileged configuration | Separation of duties |
| Prestige panel member | Prestige decisions only | Quorum / CoI rules |
| Service account | Narrow automation | No interactive user impersonation without audit |
| Integration provider | Adapter-scoped callbacks | Webhook auth; least data |

## 4. Control requirements

| Control | Validation expectation |
|---------|------------------------|
| Least privilege | Default deny; explicit grants |
| Separation of duties | e.g. finance ≠ Evidence reviewer ≠ Prestige panel alone |
| Sensitive action confirmation | Step-up / reauth for privileged identity changes |
| Human review | Evidence / Prestige / appeals as governed |
| Audit | All privileged mutations |
| Temporary authority | Time-boxed grants with expiry |
| Revocation | Immediate effect on sessions/tokens where required |
| Break-glass | Rare, dual-control preferred, mandatory audit |
| Minor-user restrictions | Hard limits on public profile & messaging (no DMs at launch) |
| Provider access | Scoped credentials; no shared god-keys |

## 5. Entitlement vs eligibility examples

| Scenario | Entitlement | Learning eligibility | Authz |
|----------|-------------|----------------------|-------|
| Open Flight user | Base access plan | Nest / Route rules still apply | Learner self APIs |
| Paid Wing Pass | Wider route concurrency / access | Still cannot buy PREREQUISITE | Same |
| Unactivated account | None / limited | Blocked from Skyboard core | Activation screens only |
| Trust-restricted | May still “have” plan | Entry blocked / limited | Restricted actions |

## 6. Explicit prohibitions

* Do not create a final RBAC schema in 1A.
* Do not treat subscription tier as Learning Graph PREREQUISITE satisfaction.
* Do not treat Trust as a cosmetic badge writable by moderators without policy.

## 7. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
```

## 8. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §19 — authorization plane separation |
