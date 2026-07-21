# Activation Wireframes (ACT)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-ACT-PACK |
| **Version** | 1.1.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 · **GHV.BASELINE-CORRECTION.1** |
| **Last updated** | 2026-07-21 |
| **Related** | [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · [FORM-INTERACTION-RULES.md](../../interactions/FORM-INTERACTION-RULES.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [CAPABILITY-REGISTRY.md](../../CAPABILITY-REGISTRY.md) · [PUBLIC-WIREFRAMES.md](../public/PUBLIC-WIREFRAMES.md) · [SCREEN-BASELINE-REFERENCE-AUDIT.md](../../../governance/corrections/SCREEN-BASELINE-REFERENCE-AUDIT.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | IdP field set · SMS provider · risk engine copy variants · exact A0/A1 assurance labels · resend cooldown seconds · change-email policy |
| **Change history** | 1.0.0 — PD.3 · **1.1.0 — BASELINE-CORRECTION.1** (ACT-003 rename + states; ACT-004 superseded; ACT-011/012 DETAILED) |

**Authority:** Screen IDs from Master Screen Registry only (92-screen reconciliation). Wireframe IDs `GHV-WF-ACT-00N` / `GHV-WF-ACT-01N`.

**Ethical (pack-wide):** No fake urgency on activation timers beyond real OTP/email expiry. Payment ≠ skill — activation never sells Mastery. Open Flight remains the default free learning path after ACT (surfaced in onboarding/pricing, not blocked here). **Verified email ≠ tenant auth ≠ elevated assurance.** No mandatory activation step may be bypassed via recovery.

**Shell:** Activation Shell ([PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md)).

**Happy path (FLOW-001):** PUB-001 → ACT-001 → ACT-002 → **ACT-003** → **ACT-011** → ACT-005 → ACT-006 → ACT-007 → ONB-001. Sign-in: ACT-010 → TRU-001 (or **ACT-012** / incomplete ACT if activation unfinished).

**Amendment note:** Former happy path used ACT-004 for result; **ACT-004** is now **SUPERSEDED_ALIAS → ACT-011**.

---

## Index

| Wireframe ID | Screen ID | Name | Detail level |
|--------------|-----------|------|--------------|
| GHV-WF-ACT-001 | ACT-001 | Create Your Crow | DETAILED |
| GHV-WF-ACT-002 | ACT-002 | Create Account | DETAILED |
| GHV-WF-ACT-003 | ACT-003 | Email Verification Pending | DETAILED |
| GHV-WF-ACT-004 | ACT-004 | ~~Email Verified~~ — SUPERSEDED_ALIAS → ACT-011 | SUPERSEDED |
| GHV-WF-ACT-005 | ACT-005 | Accept Mandatory Terms | DETAILED |
| GHV-WF-ACT-006 | ACT-006 | Basic Account Activated | DETAILED |
| GHV-WF-ACT-007 | ACT-007 | Mobile Verify Now/Later | DETAILED |
| GHV-WF-ACT-008 | ACT-008 | Mobile OTP | DETAILED (compact variant of ACT-007) |
| GHV-WF-ACT-009 | ACT-009 | Activation Blocked | DETAILED |
| GHV-WF-ACT-010 | ACT-010 | Sign In | DETAILED |
| GHV-WF-ACT-011 | ACT-011 | Email Verification Result | DETAILED |
| GHV-WF-ACT-012 | ACT-012 | Activation Recovery | DETAILED |

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

## GHV-WF-ACT-003 — Email Verification Pending

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-003 |
| **Screen ID** | ACT-003 |
| **Name** | Email Verification Pending |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A0 |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Purpose** | Hold the user in a governed pending state until an email verification attempt is completed; support resend, expiry messaging, email change, and interrupt recovery without fake urgency or step bypass |
| **Objectives** | Await email verification; resend/recovery without pressure UX |
| **Entry** | ACT-002 success · ACT-012 resume · ACT-011 failure return · ACT-010 unfinished activation |
| **Exit** | **ACT-011** (deep-link / confirm attempt) · ACT-012 (interrupt) · ACT-009 · ACT-010 |
| **Primary actions** | Open mail app (hint) · I’ve verified / Continue when ready (polls or waits for link) |
| **Secondary actions** | Resend · Change email (policy) · Sign out · Help |
| **Related capabilities** | CAP-ONB-003 |
| **Related Critical Flow** | FLOW-001-P · FLOW-001-RESEND · FLOW-001-EXP · FLOW-001-CHG · FLOW-001 |
| **Unresolved** | Resend cooldown seconds · change-email policy |

### States (Gate §8 / BASELINE-CORRECTION.1)

| State | Behavior |
|-------|----------|
| **Pending (waiting)** | Default: masked email, honest expiry, soft waiting; limited product |
| **Resend available** | Resend enabled when cooldown elapsed |
| **Resend cooldown** | Button disabled; live region announces remaining wait (real policy only) |
| **Send error** | Inline retry; stay pending |
| **Expired guidance** | Banner: link/token expired → Resend; do not claim verified |
| **Email change** | Policy path to update destination; voids prior tokens; return to pending |
| **Interrupted** | Session loss / abandon → next entry via **ACT-012** (no skip) |
| **Handoff** | Magic-link / confirmed attempt → **ACT-011** (not ACT-004) |

**Content hierarchy:** Status → instructions → primary wait/confirm → resend → change email → support.

```text
┌────────────────────────────────────────┐
│ Step: Email verification pending       │
├────────────────────────────────────────┤
│ Sent to: user@… (masked)               │
│ Real expiry note (honest, not scare)   │
│ State: Waiting…                        │
│ [Open mail app]  [I’ve verified]       │
│ [Resend email] (or cooldown mm:ss)     │
│ [Change email] (policy)                │
│ Help: check spam · wrong email         │
│ Interrupted? Resume via recovery later │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Layout** | Activation Shell single column; step indicator; no dashboard chrome |
| **Loading** | Soft waiting / poll; no fake progress to A1 |
| **Empty** | N/A (always has destination email once registered) |
| **Error** | Send fail → retry; rate-limit message honest |
| **Offline** | Explain connectivity needed to complete verify |
| **Explainable Lock** | Assurance / activation lock: product limited until email result success — path = check mail / resend ([EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) Assurance Requirement pattern) |
| **Recovery** | Interrupt → ACT-012; expired → resend on ACT-003 or fail on ACT-011 |
| **Responsive** | Mobile sticky primary; desktop centered form |
| **A11y** | H1 pending; live region for resend/cooldown; focus order |
| **RTL / LTR** | Mirror chrome; email address LTR |
| **Analytics** | `email_verify_pending` · `email_resend` · `email_change_start` |
| **Security / privacy** | Mask email; resend rate limit; never show raw token; no enumeration beyond policy |

**Acceptance criteria**

1. No artificial countdown shorter than real token policy used as pressure.
2. Verified deep-link → **ACT-011** (not ACT-004).
3. CAP-ONB-003 pending satisfied before result + terms for A1.
4. States above covered without mandatory-step bypass.

---

## GHV-WF-ACT-004 — SUPERSEDED_ALIAS → ACT-011

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-004 |
| **Screen ID** | ACT-004 |
| **Name** | ~~Email Verified~~ — **SUPERSEDED_ALIAS** |
| **Status** | **SUPERSEDED** — do not implement as a distinct result screen |
| **Canonical successor** | **ACT-011 / GHV-WF-ACT-011** Email Verification Result |
| **Scope** | CONTROLLED LAUNCH (historical ID retention only) |
| **Related Critical Flow** | Historical PD.3 FLOW-001 refs → interpret as ACT-011 |

```text
┌────────────────────────────────────────┐
│ ACT-004 SUPERSEDED                     │
│ Use GHV-WF-ACT-011 (ACT-011) instead   │
│ Keep ID in registries for traceability │
└────────────────────────────────────────┘
```

**Acceptance criteria**

1. No new flows route to ACT-004.
2. Docs that cite ACT-004 for result handling point to ACT-011.

---

## GHV-WF-ACT-005 — Accept Mandatory Terms

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-005 |
| **Screen ID** | ACT-005 |
| **Name** | Accept Mandatory Terms |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Email verified (ACT-011 success) |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Objectives** | Gate A1 on current Terms acceptance; versioned audit |
| **Entry** | **ACT-011** success · ACT-012 resume to terms |
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
| **Exit** | TRU-001 · ACT-003 / ACT-011 / ACT-005 (unfinished) · **ACT-012** · ACT-009 · ACT-001 (create) |
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
3. Unfinished activation recovers via **ACT-012** or directly to ACT-003 / ACT-011 / ACT-005 as required — never Skyboard skip.

---

## GHV-WF-ACT-011 — Email Verification Result

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-011 |
| **Screen ID** | ACT-011 |
| **Name** | Email Verification Result |
| **Scope** | CONTROLLED LAUNCH |
| **Priority** | P0 |
| **User type** | A0 → pending terms on success |
| **Journey phase** | Activate |
| **Shell** | Activation |
| **Purpose** | Present the outcome of an email verification attempt (success or failure classes) and route onward without treating verification as full activation, tenant auth, or elevated assurance |
| **Objectives** | Consume one-time token; show success or recoverable failure; advance only on success to mandatory terms |
| **Entry** | Magic-link / token from mail · ACT-003 “I’ve verified” confirm · ACT-012 resume to result |
| **Exit** | Success → **ACT-005** · Failure/expired → **ACT-003** or **ACT-012** · Risk → ACT-009 |
| **Primary actions** | Success: Continue to Terms · Failure: Resend / Return to pending |
| **Secondary actions** | Sign out · Support · Change email (via ACT-003) |
| **Related capabilities** | CAP-ONB-003 |
| **Related Critical Flow** | FLOW-001-R-OK · FLOW-001-R-FAIL · FLOW-001-EXP · FLOW-001 |
| **Unresolved** | Exact failure copy catalogue |

**Content hierarchy:** Outcome title → reason (if fail) → primary next → secondary recovery.

```text
┌────────────────────────────────────────┐
│ Email verification result              │
├────────────────────────────────────────┤
│ SUCCESS variant:                       │
│  Email verified                        │
│  Next: accept current Terms            │
│  Note: not full assurance / not tenant │
│  [Continue → ACT-005]                  │
├────────────────────────────────────────┤
│ FAILURE / EXPIRED / REUSED variant:    │
│  Could not verify                      │
│  Reason class (expired / invalid / …)  │
│  [Resend & return → ACT-003]           │
│  [Activation recovery → ACT-012]       │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Layout** | Activation Shell; outcome-first; no marketing upsell |
| **Primary / secondary** | Success: Continue primary; Failure: Resend primary, Recovery secondary |
| **Loading** | Token validate spinner; block double-consume |
| **Error** | Failure states above; network error → retry validate once |
| **Empty** | Missing token → failure with return to ACT-003 |
| **Explainable Lock** | On failure: Assurance Requirement lock — path = resend / pending; on success: clear that terms still required before A1 |
| **Recovery** | Expired/invalid → ACT-003; interrupted mid-result → ACT-012; no step skip |
| **Responsive** | Compact success/fail; sticky CTA on mobile |
| **A11y** | Outcome announced once (status role); distinct success vs error |
| **RTL / LTR** | Mirror actions; reason text localized |
| **Analytics** | `email_verify_result_ok` · `email_verify_result_fail` · reason_code |
| **Security / privacy** | One-time token consume; audit `email_verified` only on success; no token echo in UI |

**Acceptance criteria**

1. Success Continue → ACT-005 only; does not alone create A1.
2. Invalid/expired/reused recovers to ACT-003 or ACT-012 — never silent verify.
3. Copy states verified email ≠ tenant auth ≠ elevated assurance.
4. Supersedes all former ACT-004 result handling.

---

## GHV-WF-ACT-012 — Activation Recovery

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-ACT-012 |
| **Screen ID** | ACT-012 |
| **Name** | Activation Recovery |
| **Scope** | CONTROLLED LAUNCH |
| **Priority** | P0 |
| **User type** | A0 / incomplete activation (any governed interrupt) |
| **Journey phase** | Activate / Leave-return |
| **Shell** | Activation |
| **Purpose** | Re-enter the activation path after interruption or recoverable failure; show remaining mandatory steps; resume at the correct screen without bypass |
| **Objectives** | Orient user; preserve progress; route to next incomplete mandatory step |
| **Entry** | Session loss · abandon · ACT-011 failure with interrupt · ACT-010 unfinished · soft risk retry · support return |
| **Exit** | Resume → ACT-003 · ACT-011 · ACT-005 · ACT-006 as computed · ACT-009 if hard block · PUB-001 |
| **Primary actions** | Resume activation |
| **Secondary actions** | Support · Sign out · Back to Landing |
| **Related capabilities** | CAP-ONB-002..004 (recovery) |
| **Related Critical Flow** | FLOW-001-REC · FLOW-001-INT · FLOW-001-RET · FLOW-006 (incomplete branch) |
| **Unresolved** | Exact progress checklist labels |

**Content hierarchy:** What happened → where you are → remaining steps → Resume.

```text
┌────────────────────────────────────────┐
│ Activation recovery                    │
├────────────────────────────────────────┤
│ You left activation incomplete         │
│ Remaining mandatory steps:             │
│  ☐ Email verification pending          │
│  ☐ Email verification result           │
│  ☐ Accept mandatory terms              │
│  … (only incomplete shown)             │
│ [Resume → next ACT screen]             │
│ [Support]  [Landing → PUB-001]         │
│ Note: no step may be skipped           │
│ Verified email ≠ tenant auth ≠ A3      │
└────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Layout** | Activation Shell; checklist of remaining mandatory steps only |
| **Primary / secondary** | Resume primary; Support / Landing secondary |
| **Loading** | Fetch activation progress; skeleton checklist |
| **Error** | Progress fetch fail → retry; do not invent completed steps |
| **Empty** | If already complete → hand off ACT-006/ONB (should not land here) |
| **Explainable Lock** | Activation incomplete lock — path = Resume to named next step; never pay-to-skip |
| **Recovery** | This screen *is* the recovery hub; hard deny → ACT-009 |
| **Responsive** | Full-width checklist; sticky Resume |
| **A11y** | H1 recovery; list semantics for remaining steps; focus Resume |
| **RTL / LTR** | Mirror checklist |
| **Analytics** | `activation_recovery_view` · `activation_resume` · next_screen_id |
| **Security / privacy** | Server-authoritative progress; client cannot mark steps done |

**Acceptance criteria**

1. Resume lands on the true next incomplete mandatory screen.
2. **No mandatory step bypass** (including email result and terms).
3. Distinct from TRU-005 account recovery (FLOW-015).
4. Messaging: verified email ≠ tenant auth ≠ elevated assurance.

---

## Pack acceptance (Activation)

1. ACT-001..003, ACT-005..012 detailed; ACT-008 compact OTP variant of ACT-007; **ACT-004** superseded alias only.
2. Happy path: … ACT-003 → **ACT-011** → ACT-005 …
3. Optional mobile (CAP-ONB-005) skippable for ordinary learning.
4. Terms acceptance audited only on ACT-005.
5. No payment-as-skill or fake urgency patterns in activation.
6. Blocked path ACT-009 explainable and recoverable toward PUB-001/support.
7. ACT-012 recovers without skipping mandatory steps.
8. Source Gate includes **GHV.BASELINE-CORRECTION.1**.
