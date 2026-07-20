# Account & Trust Wireframes (TRU)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-TRU-PACK |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [IDENTITY-WIREFRAMES.md](../identity/IDENTITY-WIREFRAMES.md) · [ACTIVATION-WIREFRAMES.md](../activation/ACTIVATION-WIREFRAMES.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · [FORM-INTERACTION-RULES.md](../../interactions/FORM-INTERACTION-RULES.md) · [CAPABILITY-REGISTRY.md](../../CAPABILITY-REGISTRY.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.23 |
| **Scope** | CONTROLLED LAUNCH / CORE FOUNDATION |
| **Unresolved** | IdP / risk engine copy · exact A0–A3 labels · privacy legal wording (**PENDING EXTERNAL VALIDATION**) · SMS/recovery providers |
| **Change history** | 1.0.0 — PD.3 initial low-fidelity pack |

**Authority:** Screen IDs from Master Screen Registry only. Wireframe IDs `GHV-WF-TRU-00N`. Privacy export/deletion entry uses **IDN-005** (not a new TRU screen).

**Shell:** Trust ([PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md)). Account security modules live primarily on TRU-003 with status on TRU-004.

**Happy paths:** FLOW-006 Returning User · FLOW-015 Account Recovery · FLOW-016 Data Export or Deletion · FLOW-012 Report and Appeal.

**Ethical (pack-wide):** No fake urgency beyond real OTP/session expiry. Toast alone insufficient for recovery, export, deletion, or session revoke. Payment never appears as a trust “fix.”

---

## Index

| Wireframe ID | Screen ID | Name | Detail level |
|--------------|-----------|------|--------------|
| GHV-WF-TRU-001 | TRU-001 | Session Validation | DETAILED |
| GHV-WF-TRU-002 | TRU-002 | Terms Version Update | DETAILED |
| GHV-WF-TRU-003 | TRU-003 | Security Settings | DETAILED |
| GHV-WF-TRU-004 | TRU-004 | Assurance Status | DETAILED |
| GHV-WF-TRU-005 | TRU-005 | Recovery | DETAILED |
| GHV-WF-TRU-006 | TRU-006 | Report / Appeal | DETAILED |
| — | IDN-005 | Privacy (export / deletion entry) | DETAILED cross-link + FLOW-016 |

---

## Sequence overview

```text
ACT-010 Sign In
  → TRU-001 Session Validation
  → TRU-002 if terms outdated
  → SKY-001 (resume Mission position)

Account → TRU-004 Assurance Status ↔ TRU-003 Security Settings
  sessions · devices · passkeys · MFA · recovery codes

Forgot / claim → TRU-005 Recovery
  → method → verify → cooling → session revoke
  → restricted recovery → ACT-010 / full restore

Wingprint → IDN-005 Privacy
  → Export / Delete → step-up → consequence → confirm → status (FLOW-016)

Moderation event → TRU-006 Report / Appeal
  → confirmation → case status → decision → appeal if allowed
```

---

## GHV-WF-TRU-001 — Session Validation

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-TRU-001 |
| **Screen ID** | TRU-001 |
| **Name** | Session Validation |
| **Scope** | CORE FOUNDATION + CONTROLLED LAUNCH |
| **User type** | Returning |
| **Journey phase** | Return |
| **Shell** | Trust |
| **Objectives** | Validate session/risk after login; continue or challenge; never skip to Skyboard if blocked |
| **Entry** | ACT-010 success |
| **Exit** | SKY-001 · TRU-002 · ACT-009 · TRU-005 · TRU-003 step-up |
| **Primary actions** | Continue · Complete challenge |
| **Secondary actions** | Sign out · Use another device help |
| **Related capabilities** | CAP-TRU-001 · CAP-TRU-003 |
| **Unresolved** | Risk challenge variants (device / location / step-up) |

```text
┌──────────────────────────────────────────────────────────────┐
│ Checking your flight session…                                │
├──────────────────────────────────────────────────────────────┤
│ States (mutually exclusive primary):                         │
│                                                              │
│ [OK] Session trusted                                         │
│      [Continue → SKY-001 or TRU-002 if terms]                │
│                                                              │
│ [CHALLENGE] Extra verification needed                        │
│      Passkey / MFA / email OTP / device confirm              │
│      [Verify]  [Try another method]                          │
│                                                              │
│ [BLOCKED] Cannot continue                                    │
│      Explainable reason → ACT-009 / support                  │
│      [Sign out]  [Recovery → TRU-005]                        │
├──────────────────────────────────────────────────────────────┤
│ Soft progress — no fake urgency beyond real challenge expiry │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading** | Indeterminate check; then OK / challenge / blocked |
| **Error / offline** | Offline: cannot mint trusted session; reconnect + retry |
| **Mobile / desktop** | Centered trust card |
| **A11y** | Status live region; focus to Verify |
| **Analytics** | `session_validate` · `session_challenge` · `session_block` |
| **Security / audit** | Challenge outcomes audited; no silent elevation |

**Acceptance criteria**

1. Success path is TRU-001 → (TRU-002 if needed) → SKY-001 (FLOW-006).
2. Challenge required before Skyboard when risk signals fire.
3. Blocked users get Explainable path, not empty error.

---

## GHV-WF-TRU-002 — Terms Version Update

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-TRU-002 |
| **Screen ID** | TRU-002 |
| **Name** | Terms Version Update |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A1+ |
| **Journey phase** | Return |
| **Shell** | Trust |
| **Objectives** | Force re-acceptance of mandatory terms before Skyboard when version changes |
| **Entry** | TRU-001 / nav gate when terms outdated |
| **Exit** | SKY-001 · sign out · PUB legal docs (read) |
| **Primary actions** | Accept |
| **Secondary actions** | Read full Terms · Decline / sign out |
| **Related capabilities** | CAP-TRU-004 (policy) · ACT-005 lineage |
| **Unresolved** | Diff summary wording — PENDING LEGAL |

```text
┌──────────────────────────────────────────────────────────────┐
│ Updated Terms                                                │
│ Version N → N+1 · effective DATE                             │
├──────────────────────────────────────────────────────────────┤
│ Summary of material changes (PENDING LEGAL exact text)       │
│ [Read full Terms]  [Privacy notice]                          │
│                                                              │
│ □ I accept the updated Terms                                 │
│ [Accept and continue → SKY-001]                              │
│ [Sign out]                                                   │
├──────────────────────────────────────────────────────────────┤
│ Persistent terms banner on Core until accepted (if deferred  │
│ not allowed — gate before Skyboard)                          │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Locked** | Skyboard / learning blocked until Accept |
| **Offline** | Accept requires online ack |
| **A11y** | Checkbox + Accept; documents readable |
| **Analytics** | `terms_update_view` · `terms_accept` · `terms_decline_signout` |
| **Security / audit** | Acceptance version + timestamp audited |

**Acceptance criteria**

1. Outdated terms cannot reach SKY-001 (NAVIGATION-INTERACTION-SPEC).
2. Decline = sign out / restricted, not silent continue.
3. Legal body may open read-only; acceptance remains on TRU-002.

---

## GHV-WF-TRU-003 — Security Settings

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-TRU-003 |
| **Screen ID** | TRU-003 |
| **Name** | Security Settings |
| **Scope** | CORE FOUNDATION + CONTROLLED LAUNCH |
| **User type** | A1+ |
| **Journey phase** | Trust / Account |
| **Shell** | Trust |
| **Objectives** | Configure sessions, devices, passkeys, MFA, recovery; support assurance uplift toward A2+ |
| **Entry** | Account · TRU-004 Improve · step-up prompts |
| **Exit** | TRU-004 · IDN-005 · ACT-010 (after revoke all) |
| **Primary actions** | Add passkey · Enable MFA · Manage devices |
| **Secondary actions** | View assurance · Recovery codes · Sign out other sessions |
| **Related capabilities** | CAP-TRU-001 · CAP-TRU-003 · CAP-TRU-005 |
| **Unresolved** | Exact MFA factor catalogue · SMS provider |

**Modules on one screen (sections):** Sessions · Devices · Passkeys · MFA · Recovery.

```text
┌──────────────────────────────────────────────────────────────┐
│ Security Settings                                            │
│ Assurance: A1 (example) · [View status → TRU-004]            │
├──────────────────────────────────────────────────────────────┤
│ Sessions                                                     │
│ • This device · Now · [Current]                              │
│ • Browser X · City · 2d ago · [Revoke]                       │
│ [Revoke all other sessions]  ← confirm + step-up             │
├──────────────────────────────────────────────────────────────┤
│ Devices                                                      │
│ • Trusted laptop · last seen … · [Remove]                    │
│ • Phone · … · [Remove]                                       │
│ Empty: “No extra trusted devices yet.”                       │
├──────────────────────────────────────────────────────────────┤
│ Passkeys                                                     │
│ • Passkey on Device · [Rename] [Remove]                      │
│ [Add passkey]                                                │
├──────────────────────────────────────────────────────────────┤
│ MFA                                                          │
│ Status: Off | App | SMS (PENDING provider) | …               │
│ [Enable MFA]  [Change method]  [Disable…] ← step-up          │
├──────────────────────────────────────────────────────────────┤
│ Recovery                                                     │
│ Recovery codes: Generated | Never · [View / regenerate]      │
│ Linked recovery email / mobile summary                       │
│ [Start recovery help → TRU-005] (if locked out elsewhere)    │
├──────────────────────────────────────────────────────────────┤
│ Privacy & data → [IDN-005]                                   │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Step-up** | Revoke all, disable MFA, view codes, remove last passkey require re-auth |
| **Loading / error / offline** | Mutations need online; list may be cached read-only |
| **Empty** | Guidance to add passkey/MFA for higher assurance |
| **Mobile** | Accordion sections; sticky Add passkey / Enable MFA |
| **Desktop** | Section stack with side status |
| **A11y** | Each revoke/remove has accessible name + confirm dialog |
| **Analytics** | `sec_passkey_add` · `sec_mfa_enable` · `sec_session_revoke` · `sec_codes_regen` |
| **Security / audit** | All mutations audited; toast alone insufficient for revoke-all |

**Acceptance criteria**

1. Sessions, devices, passkeys, MFA, recovery all represented.
2. Destructive security actions use step-up + confirm.
3. Link to TRU-004 and IDN-005 present.
4. No commercial upsell framed as security requirement.

---

## GHV-WF-TRU-004 — Assurance Status

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-TRU-004 |
| **Screen ID** | TRU-004 |
| **Name** | Assurance Status |
| **Scope** | CORE FOUNDATION + CONTROLLED LAUNCH |
| **User type** | A1+ |
| **Journey phase** | Trust |
| **Shell** | Trust |
| **Objectives** | Show A0–A3 posture; explain gates; route to improve via TRU-003 / ACT mobile verify |
| **Entry** | Account · TRU-003 · Explainable Lock (assurance) |
| **Exit** | TRU-003 · ACT-007/008 · SKY-001 |
| **Primary actions** | Improve assurance |
| **Secondary actions** | Learn why levels exist · Back |
| **Related capabilities** | CAP-TRU-003 |
| **Unresolved** | Exact A0–A3 label strings |

```text
┌──────────────────────────────────────────────────────────────┐
│ Assurance Status                                             │
│ Current level: A1 (example)                                  │
├──────────────────────────────────────────────────────────────┤
│ A0 ── A1 ── A2 ── A3   (progress indicator)                  │
│                                                              │
│ What you have                                                │
│ ✓ Email verified · Account activated                         │
│ ○ Mobile verified (optional for some paths)                  │
│ ○ Passkey / MFA (TRU-003)                                    │
│ ○ Additional signals (PENDING risk policy)                   │
│                                                              │
│ What this unlocks / still gated                              │
│ Explainable list (Live, high-risk actions, etc.)             │
│                                                              │
│ [Improve → TRU-003]  [Verify mobile → ACT-007]               │
│ Note: Paying does not raise assurance or Skill               │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Empty / N/A** | Always has a level; never blank |
| **Locked paths** | Deep-link to required improve step |
| **A11y** | Level as text + progress |
| **Analytics** | `assurance_view` · `assurance_improve` |
| **Security / audit** | Display only; mutations on TRU-003/ACT |

**Acceptance criteria**

1. Levels A0–A3 represented.
2. Improve routes to TRU-003 (and mobile ACT when relevant).
3. Copy separates assurance from commercial entitlement.

---

## GHV-WF-TRU-005 — Recovery

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-TRU-005 |
| **Screen ID** | TRU-005 |
| **Name** | Recovery |
| **Scope** | CORE FOUNDATION + CONTROLLED LAUNCH |
| **User type** | Claimed / locked-out |
| **Journey phase** | Trust |
| **Shell** | Trust (or Activation-adjacent) |
| **Objectives** | Recover account via verified method; cooling; revoke sessions; restricted then full restore (FLOW-015) |
| **Entry** | ACT-010 forgot · TRU-001 blocked · TRU-003 help |
| **Exit** | ACT-010 · restricted recovery home · TRU-003 |
| **Primary actions** | Choose method · Verify · Continue |
| **Secondary actions** | Cancel · Contact support (no unrestricted DM) |
| **Related capabilities** | CAP-TRU-001 · CAP-TRU-010 |
| **Unresolved** | Cooling duration · SMS/email provider |

```text
┌──────────────────────────────────────────────────────────────┐
│ Account Recovery                                             │
│ Toast alone is insufficient — stay on this flow              │
├──────────────────────────────────────────────────────────────┤
│ Step 1 · Method                                              │
│ ○ Email link  ○ Recovery codes  ○ Passkey  ○ SMS (PENDING)   │
│ [Continue]                                                   │
├──────────────────────────────────────────────────────────────┤
│ Step 2 · Verification                                        │
│ OTP / code / passkey prompt · real expiry only               │
│ [Verify]                                                     │
├──────────────────────────────────────────────────────────────┤
│ Step 3 · Cooling & session revoke                            │
│ “For your safety, other sessions will be signed out.”        │
│ Waiting / progress · [Understood]                            │
├──────────────────────────────────────────────────────────────┤
│ Step 4 · Restricted recovery                                 │
│ Limited actions until re-establish factors on TRU-003        │
│ [Go to Security Settings]  [Sign in → ACT-010]               │
├──────────────────────────────────────────────────────────────┤
│ Step 5 · Full restore (after factors OK)                     │
│ [Continue to Skyboard]                                       │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Loading / error / offline** | Verify needs online; clear retry; no silent success |
| **Locked** | Rate limit / abuse → Explainable wait |
| **Mobile / desktop** | Stepper; primary Verify sticky |
| **A11y** | Step announced; cooling status live |
| **Analytics** | `recovery_start` · `recovery_verify` · `recovery_revoke` · `recovery_restore` |
| **Security / audit** | Full trail; session revoke mandatory on success path |

**Acceptance criteria**

1. FLOW-015: method → verification → cooling → session revoke → restricted → full restore.
2. Toast-only success forbidden.
3. Returns to ACT-010 or TRU-003 as appropriate.

---

## GHV-WF-TRU-006 — Report / Appeal

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-TRU-006 |
| **Screen ID** | TRU-006 |
| **Name** | Report / Appeal |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | A1+ |
| **Journey phase** | Community / Trust |
| **Shell** | Trust |
| **Objectives** | Submit safety report or appeal; track case; no DM channel |
| **Entry** | Content action · COM moderation event · notification |
| **Exit** | COM-001 · case status · prior context |
| **Primary actions** | Submit report · Submit appeal |
| **Secondary actions** | Cancel · View policy |
| **Related capabilities** | CAP-SOC-008 · moderation |
| **Unresolved** | Exact reason taxonomy · SLA copy |

```text
┌──────────────────────────────────────────────────────────────┐
│ Report / Appeal                                              │
├────────────────────────────┬─────────────────────────────────┤
│ Mode: (●) Report  ( ) Appeal                                 │
│                                                              │
│ Target: content / user / Live event (context chip)           │
│ Reason: [Select…]                                            │
│ Details: [ multiline ]                                       │
│ Attachments: optional Evidence refs (policy)                 │
│                                                              │
│ Appeal mode: prior case ID · decision summary · grounds      │
│                                                              │
│ [Submit]  [Cancel]                                           │
├────────────────────────────┴─────────────────────────────────┤
│ After submit                                                 │
│ Confirmation + case ID                                       │
│ Status: Received | In review | Decision | Closed             │
│ Appeal allowed? Yes → [Appeal] / No → explain                │
└──────────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Empty** | Need target context; else pick from recent |
| **Error / offline** | Queue draft offline if supported; submit online |
| **Mobile** | Single column form |
| **A11y** | Required fields labeled; confirm live region |
| **Analytics** | `report_submit` · `appeal_submit` · `case_status_view` |
| **Security / audit** | Case immutable log; reporter privacy protected |

**Acceptance criteria**

1. FLOW-012: report → confirmation → status → decision → appeal if allowed.
2. No unrestricted DMs as support path.
3. Dual mode Report vs Appeal clear.

---

## Privacy / export / deletion via IDN-005 + step-up (FLOW-016)

**Registry:** Export and deletion **enter through IDN-005 Privacy Settings** ([IDENTITY-WIREFRAMES.md](../identity/IDENTITY-WIREFRAMES.md) GHV-WF-IDN-005). No separate PAY/TRU screen ID for the entry point.

### Entry (IDN-005 excerpt)

```text
│ [Preview as others see]     [Export data]  [Delete…]         │
│ Export/Delete → step-up + consequence (FLOW-016)             │
```

### Shared FLOW-016 interaction (Trust overlay / wizard)

```text
┌──────────────────────────────────────────────────────────────┐
│ Export data  |  Delete account                               │
│ Legal wording: PENDING EXTERNAL VALIDATION                   │
├──────────────────────────────────────────────────────────────┤
│ 1. Step-up (passkey / MFA / password) — required             │
│ 2. Consequence review                                        │
│    Export: what’s included · delivery channel · retention    │
│    Delete: irreversible summary · grace if any · learning    │
│            progress / Evidence / subscription effects        │
│ 3. Typed confirm (Delete) or explicit Export confirm         │
│ 4. Status tracking                                           │
│    Queued · Preparing · Ready (download/link) · Done         │
│    Delete: Scheduled · Cooling · Completed                   │
│ Toast alone insufficient                                     │
│ [Cancel]                                      [Confirm…]     │
└──────────────────────────────────────────────────────────────┘
```

| Rule | Behavior |
|------|----------|
| **Step-up** | Always before export download or delete schedule |
| **Open Flight / paid** | Deletion consequences mention Access Plan; not framed as “incomplete free user” |
| **Offline** | Cannot complete destructive confirm offline |
| **Audit** | Request and completion audited |
| **Exit** | Status sheet → IDN-005 / ACT-001 if account gone |

**Acceptance:** FLOW-016 — IDN-005 → step-up → consequence → confirm → status; PENDING LEGAL labeled.

---

## Lock status summary

| Wireframe ID | Screen ID | Status |
|--------------|-----------|--------|
| GHV-WF-TRU-001 | TRU-001 | LOCKED AT LOW FIDELITY |
| GHV-WF-TRU-002 | TRU-002 | LOCKED AT LOW FIDELITY |
| GHV-WF-TRU-003 | TRU-003 | LOCKED AT LOW FIDELITY |
| GHV-WF-TRU-004 | TRU-004 | LOCKED AT LOW FIDELITY |
| GHV-WF-TRU-005 | TRU-005 | LOCKED AT LOW FIDELITY |
| GHV-WF-TRU-006 | TRU-006 | LOCKED AT LOW FIDELITY |
| FLOW-016 via IDN-005 | IDN-005 entry | LOCKED AT LOW FIDELITY (cross-pack) |
