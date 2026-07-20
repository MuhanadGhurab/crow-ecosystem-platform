# Activation Wireframes (ACT)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-ACT-PACK |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · [FORM-INTERACTION-RULES.md](../../interactions/FORM-INTERACTION-RULES.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [CAPABILITY-REGISTRY.md](../../CAPABILITY-REGISTRY.md) · [PUBLIC-WIREFRAMES.md](../public/PUBLIC-WIREFRAMES.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | IdP field set · SMS provider · risk engine copy variants · exact A0/A1 assurance labels |
| **Change history** | 1.0.0 — PD.3 initial low-fidelity pack |

**Authority:** Screen IDs from Master Screen Registry only. Wireframe IDs `GHV-WF-ACT-00N`.

**Ethical (pack-wide):** No fake urgency on activation timers beyond real OTP/email expiry. Payment ≠ skill — activation never sells Mastery. Open Flight remains the default free learning path after ACT (surfaced in onboarding/pricing, not blocked here).

**Shell:** Activation Shell ([PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md)).

**Happy path (FLOW-001):** PUB-001 → ACT-001 → ACT-002 → ACT-003 → ACT-004 → ACT-005 → ACT-006 → ACT-007 → ONB-001. Sign-in: ACT-010 → TRU-001.

---

## Index

| Wireframe ID | Screen ID | Name | Detail level |
|--------------|-----------|------|--------------|
| GHV-WF-ACT-001 | ACT-001 | Create Your Crow | DETAILED |
| GHV-WF-ACT-002 | ACT-002 | Create Account | DETAILED |
| GHV-WF-ACT-003 | ACT-003 | Verify Email Prompt | DETAILED |
| GHV-WF-ACT-004 | ACT-004 | Email Verified | DETAILED |
| GHV-WF-ACT-005 | ACT-005 | Accept Mandatory Terms | DETAILED |
| GHV-WF-ACT-006 | ACT-006 | Basic Account Activated | DETAILED |
| GHV-WF-ACT-007 | ACT-007 | Mobile Verify Now/Later | DETAILED |
| GHV-WF-ACT-008 | ACT-008 | Mobile OTP | DETAILED (compact variant of ACT-007) |
| GHV-WF-ACT-009 | ACT-009 | Activation Blocked | DETAILED |
| GHV-WF-ACT-010 | ACT-010 | Sign In | DETAILED |

---

## GHV-WF-ACT-001 — Create Your Crow

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-001 |
| **Screen ID** | ACT-001 |
| **Name** | Create Your Crow |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Visitor |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Capture identity intent; set expectations (Crow ≠ purchased skill); begin registration |
| **Entry** | PUB-001 Create Crow · PUB-002/003/005 CTAs |
| **Exit** | ACT-002 · ACT-010 (already have account) · PUB-001 |
| **Primary actions** | Begin |
| **Secondary actions** | Sign In instead · Back |
| **Related capabilities** | CAP-ONB-002 |
| **Unresolved** | Illustration / Crow teaser fidelity |

**Content hierarchy:** Intent title → short promise → Begin → Sign In link.

```text
┌────────────────────────────────────────┐
│ Minimal header · Security context      │
│ Step: Create Your Crow                 │
├────────────────────────────────────────┤
│ Intent: start your Crow identity       │
│ Note: Personalization later; not paywall│
│ [Begin → ACT-002]                      │
│ Already flying? [Sign In → ACT-010]    │
├────────────────────────────────────────┤
│ Legal footer links → PUB-006           │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading / error / offline** | Begin disabled offline with reconnect; soft error retry |
| **Empty / locked / permission** | N/A |
| **Mobile / tablet / desktop** | Centered single column; sticky Begin on mobile |
| **A11y** | H1 intent; focus on Begin |
| **RTL / LTR** | Mirror actions |
| **Analytics** | `act_intent_view` · `act_intent_begin` |
| **Security / audit** | No credentials yet |

**Acceptance criteria**

1. Begin → ACT-002 only.
2. No payment or plan upsell dominating the step.
3. Sign In alternate path present.

---

## GHV-WF-ACT-002 — Create Account

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-002 |
| **Screen ID** | ACT-002 |
| **Name** | Create Account |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Visitor |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Register credentials; create A0; send verification |
| **Entry** | ACT-001 |
| **Exit** | ACT-003 (success) · ACT-009 (risk deny) · ACT-010 |
| **Primary actions** | Submit registration |
| **Secondary actions** | Back · Sign In · show/hide password |
| **Related capabilities** | CAP-ONB-002 |
| **Unresolved** | Exact IdP fields · password policy surface |

**Content hierarchy:** Fields → inline validation → Submit → help.

```text
┌────────────────────────────────────────┐
│ Step: Create Account                   │
├────────────────────────────────────────┤
│ Email                                  │
│ Password                               │
│ Confirm (if required)                  │
│ Optional display name                  │
│ [Submit registration]                  │
│ Help / password rules                  │
├────────────────────────────────────────┤
│ Legal footer                           │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Submit spinner; prevent double submit |
| **Empty** | Field-level required errors |
| **Error** | Inline + summary; duplicate email → Sign In hint |
| **Offline** | Block submit; queue not allowed for register |
| **Locked / permission** | Server risk → ACT-009 |
| **Mobile / desktop** | Single column form |
| **A11y** | Labels; error announced; autocomplete attributes |
| **RTL / LTR** | Form mirror; email LTR characters OK |
| **Analytics** | `register_submit` · `register_success` · `register_fail` |
| **Security / audit** | Rate limit; no password in logs; audit account_created |

**Acceptance criteria**

1. Success → ACT-003 with A0 session appropriate to IdP.
2. Risk reject → ACT-009.
3. No fake “spots remaining” on register.

---

## GHV-WF-ACT-003 — Verify Email Prompt

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-003 |
| **Screen ID** | ACT-003 |
| **Name** | Verify Email Prompt |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A0 |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Await email verification; resend/recovery without fake urgency pressure |
| **Entry** | ACT-002 success |
| **Exit** | ACT-004 (token OK) · ACT-009 · ACT-010 |
| **Primary actions** | Open mail app (hint) · I’ve verified / Continue when ready |
| **Secondary actions** | Resend · change email (policy) · Sign out |
| **Related capabilities** | CAP-ONB-003 |
| **Unresolved** | Resend cooldown seconds · change-email policy |

**Content hierarchy:** Status → instructions → resend → support.

```text
┌────────────────────────────────────────┐
│ Step: Verify your email                │
├────────────────────────────────────────┤
│ Sent to: user@…                        │
│ Real expiry note (honest, not scare)   │
│ [Resend email]                         │
│ Waiting… / [Continue when verified]    │
│ Help: check spam · wrong email         │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Poll or magic-link return; soft waiting state |
| **Empty** | N/A |
| **Error** | Send fail → retry; invalid prior token → resend |
| **Offline** | Explain need connectivity for verify complete |
| **Locked** | Limited product until verified |
| **Mobile / desktop** | Same; deep-link from mail opens ACT-004 |
| **A11y** | Live region for resend status |
| **RTL / LTR** | Mirror; address LTR |
| **Analytics** | `email_verify_prompt` · `email_resend` |
| **Security / audit** | Resend rate limit; token not exposed in UI |

**Acceptance criteria**

1. No artificial countdown shorter than real token policy used as pressure.
2. Verified deep-link → ACT-004.
3. CAP-ONB-003 satisfied before A1 terms.

---

## GHV-WF-ACT-004 — Email Verified

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-004 |
| **Screen ID** | ACT-004 |
| **Name** | Email Verified |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A0 → A1 pending terms |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Confirm email success; advance to mandatory terms |
| **Entry** | Valid verification token |
| **Exit** | ACT-005 · ACT-009 if post-verify risk fails |
| **Primary actions** | Continue |
| **Secondary actions** | Sign out |
| **Related capabilities** | CAP-ONB-003 |
| **Unresolved** | Success microcopy |

```text
┌────────────────────────────────────────┐
│ Email verified                         │
│ Success confirmation                   │
│ Next: accept current Terms             │
│ [Continue → ACT-005]                   │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading / error** | Token validate spinner; invalid → ACT-003 with reason |
| **Offline** | Cannot complete token exchange |
| **Mobile / desktop** | Compact success |
| **A11y** | Success announced once |
| **RTL / LTR** | Mirror |
| **Analytics** | `email_verified` |
| **Security / audit** | One-time token consume; audit email_verified |

**Acceptance criteria**

1. Continue → ACT-005 only when token valid.
2. Invalid/expired token recovers to ACT-003.

---

## GHV-WF-ACT-005 — Accept Mandatory Terms

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-005 |
| **Screen ID** | ACT-005 |
| **Name** | Accept Mandatory Terms |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Email verified |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Gate A1 on current Terms acceptance; versioned audit |
| **Entry** | ACT-004 |
| **Exit** | ACT-006 · ACT-009 (refuse / risk) · PUB-007 read-only |
| **Primary actions** | Accept current Terms |
| **Secondary actions** | Read full Terms · Decline / leave |
| **Related capabilities** | CAP-ONB-004 |
| **Unresolved** | Multi-document pack composition |

```text
┌────────────────────────────────────────┐
│ Accept Terms                           │
│ Version / effective date               │
│ Summary bullets                        │
│ [View full Terms → PUB-007 style]      │
│ ☐ I accept the current Terms           │
│ [Accept & continue]                    │
│ Decline → leave / ACT-009 path         │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Fetch current version; block accept until loaded |
| **Error** | Version fetch fail → retry; no silent old accept |
| **Locked** | Accept disabled until checkbox + version known |
| **Offline** | Cannot accept without server confirm |
| **Mobile / desktop** | Scrollable summary; sticky accept |
| **A11y** | Checkbox labeled; version in accessible name |
| **RTL / LTR** | Document mirror |
| **Analytics** | `terms_view` · `terms_accepted` · `terms_declined` |
| **Security / audit** | Persist version id, timestamp, subject — required audit |

**Acceptance criteria**

1. Accept records current version; proceeds ACT-006 only if risk OK.
2. Public PUB-007 view ≠ this acceptance event.
3. Decline does not silently activate A1.

---

## GHV-WF-ACT-006 — Basic Account Activated

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-006 |
| **Screen ID** | ACT-006 |
| **Name** | Basic Account Activated |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A1 |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Celebrate A1; clarify next optional mobile; point toward free Open Flight path later |
| **Entry** | ACT-005 + risk OK |
| **Exit** | ACT-007 |
| **Primary actions** | Continue |
| **Secondary actions** | None required |
| **Related capabilities** | CAP-ONB-002 · CAP-ONB-004 |
| **Unresolved** | Success art |

```text
┌────────────────────────────────────────┐
│ Basic account activated (A1)           │
│ You can learn on Open Flight after     │
│ onboarding — payment ≠ skill           │
│ [Continue → ACT-007]                   │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **States** | Mostly success; error rare → support |
| **Mobile / desktop** | Compact |
| **A11y** | Success H1 |
| **RTL / LTR** | Mirror |
| **Analytics** | `account_activated_a1` |
| **Security / audit** | Assurance level A1 recorded |

**Acceptance criteria**

1. Continue → ACT-007.
2. No paid upsell as requirement to continue.
3. Open Flight mentioned as free path (ethical), not a payment CTA.

---

## GHV-WF-ACT-007 — Mobile Verify Now/Later

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-007 |
| **Screen ID** | ACT-007 |
| **Name** | Mobile Verify Now/Later |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A1 |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Offer optional mobile verify; allow skip for ordinary learning (CAP-ONB-005) |
| **Entry** | ACT-006 |
| **Exit** | ACT-008 (verify now) · ONB-001 (later/skip) |
| **Primary actions** | Verify now · Later / Skip |
| **Secondary actions** | Why we ask (info) |
| **Related capabilities** | CAP-ONB-005 |
| **Unresolved** | Which features need mobile later |

```text
┌────────────────────────────────────────┐
│ Optional: verify mobile                │
│ Ordinary learning works without it     │
│ Phone (E.164)                          │
│ [Verify now → ACT-008]                 │
│ [Later / Skip → ONB-001]               │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading / error / offline** | Send OTP needs network; fail inline |
| **Empty** | Phone required only if Verify now |
| **Locked / permission** | N/A for skip |
| **Mobile / desktop** | Native tel keyboard on mobile |
| **A11y** | Equal weight Now vs Later (Later not buried) |
| **RTL / LTR** | Phone field LTR digits |
| **Analytics** | `mobile_offer_view` · `mobile_verify_now` · `mobile_skip` |
| **Security / audit** | Skip allowed; audit if verified later |

**Acceptance criteria**

1. Skip → ONB-001 without punishment UX.
2. Verify now → ACT-008.
3. No fake urgency forcing mobile for Open Flight learning.

---

## GHV-WF-ACT-008 — Mobile OTP (compact variant of ACT-007)

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-008 |
| **Screen ID** | ACT-008 |
| **Name** | Mobile OTP |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A1 |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Enter OTP; confirm mobile; return to flow |
| **Entry** | ACT-007 Verify now |
| **Exit** | ONB-001 (success) · ACT-007 (change number / cancel) |
| **Primary actions** | Submit OTP |
| **Secondary actions** | Resend · Change number · Cancel to Later |
| **Related capabilities** | CAP-ONB-005 |
| **Unresolved** | OTP length · resend cooldown |

**Note:** Compact continuation of ACT-007 decision — same shell, OTP stage only.

```text
┌────────────────────────────────────────┐
│ Enter code sent to +…XX                │
│ [ OTP _ _ _ _ _ _ ]                    │
│ Honest expiry · [Resend]               │
│ [Submit]     [Use different number]    │
│ [Skip for now → ONB-001]               │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Verify spinner |
| **Error** | Wrong/expired code inline; lockout messaging honest |
| **Offline** | Block submit |
| **Mobile / desktop** | Autofill one-time-code where supported |
| **A11y** | OTP as single field or grouped with labels |
| **RTL / LTR** | Digits LTR |
| **Analytics** | `mobile_otp_submit` · `mobile_otp_success` · `mobile_otp_fail` |
| **Security / audit** | Rate limit; audit mobile_verified |

**Acceptance criteria**

1. Success → ONB-001 (or return ACT-007 success state then ONB).
2. Skip still available; CAP-ONB-005 optional nature preserved.
3. Resend cooldown reflects real provider policy only.

---

## GHV-WF-ACT-009 — Activation Blocked

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-009 |
| **Screen ID** | ACT-009 |
| **Name** | Activation Blocked |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Any (visitor / A0 / blocked) |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Explain risk/terms failure; recovery/support; no dark-pattern guilt |
| **Entry** | Risk not acceptable · terms refusal path · TRU session deny into activation |
| **Exit** | PUB-001 · support · ACT-010 (if allowed) · retry when policy allows |
| **Primary actions** | Contact support / Resolve guidance |
| **Secondary actions** | Return to Landing · Sign out |
| **Related capabilities** | CAP-ONB-002..004 (failure) · trust |
| **Unresolved** | Case ID format · appeal flow ownership |

```text
┌────────────────────────────────────────┐
│ Activation blocked                     │
│ Clear reason class (risk / terms / …)  │
│ What you can do next                   │
│ Case / reference id if available       │
│ [Support]  [Back to Landing → PUB-001] │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading / error** | Stable blocked state; avoid flicker |
| **Permission** | UI cannot override server deny |
| **Offline** | Show last known block reason |
| **Mobile / desktop** | Full-width message |
| **A11y** | Role alert; focus to heading |
| **RTL / LTR** | Mirror |
| **Analytics** | `activation_blocked` · reason_code |
| **Security / audit** | Mandatory audit of deny decision |

**Acceptance criteria**

1. Server decision authoritative; no client unlock.
2. Path to PUB-001 and support present.
3. No fake “pay to unlock account” framing.

---

## GHV-WF-ACT-010 — Sign In

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-010 |
| **Screen ID** | ACT-010 |
| **Name** | Sign In |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Returning |
| **Journey phase** | Activation |
| **Shell** | Activation |
| **Objectives** | Authenticate; hand off to TRU-001 session validation |
| **Entry** | PUB-001 · ACT-001 alternate · deep links |
| **Exit** | TRU-001 · ACT-003 (unverified) · ACT-009 · ACT-001 (create) |
| **Primary actions** | Authenticate / Sign In |
| **Secondary actions** | Create Crow · Forgot password / recovery (TRU-005 path) · language |
| **Related capabilities** | CAP-ONB-002 (return) |
| **Unresolved** | SSO providers list |

```text
┌────────────────────────────────────────┐
│ Sign In                                │
│ Email                                  │
│ Password                               │
│ [Sign In → TRU-001]                    │
│ [Forgot password]                      │
│ New here? [Create Your Crow → ACT-001] │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Auth spinner; prevent double submit |
| **Error** | Generic auth fail (no user enumeration beyond policy) |
| **Offline** | Block auth |
| **Locked** | Soft lock messaging after attempts → support |
| **Mobile / desktop** | Single column; password managers supported |
| **A11y** | Labels; error summary |
| **RTL / LTR** | Mirror; credentials fields standard |
| **Analytics** | `sign_in_submit` · `sign_in_success` · `sign_in_fail` |
| **Security / audit** | Session mint audited downstream TRU-001 |

**Acceptance criteria**

1. Success → TRU-001 (FLOW-006), not direct SKY skip of trust checks.
2. Create Crow alternate → ACT-001.
3. Unverified account recovers toward ACT-003 when policy requires.

---

## Pack acceptance (Activation)

1. All ACT-001..010 detailed; ACT-008 documented as compact OTP variant of ACT-007.
2. Optional mobile (CAP-ONB-005) skippable for ordinary learning.
3. Terms acceptance audited only on ACT-005.
4. No payment-as-skill or fake urgency patterns in activation.
5. Blocked path ACT-009 explainable and recoverable toward PUB-001/support.
