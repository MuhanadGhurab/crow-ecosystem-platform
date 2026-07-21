# Master Screen Registry

| Field | Value |
|-------|-------|
| **Status** | ACTIVE — CORRECTED BASELINE (alias-safe) |
| **Version** | 1.2.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 amended by **CR-002** (PD.2 Amendment-02) |
| **Related** | [SCREEN-STATE-CONTRACT.md](./SCREEN-STATE-CONTRACT.md) · [SCREEN-ID-CORRECTION-MAP.md](./SCREEN-ID-CORRECTION-MAP.md) · [SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md](./SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md) · [MASTER-USER-JOURNEY.md](../journeys/MASTER-USER-JOURNEY.md) · [SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md](../../architecture/ghuravia/validation/SCREEN-BASELINE-ARCHITECTURE-PREFLIGHT.md) |
| **Count** | **92 ACTIVE / governed screen IDs** (0 aliases in inventory table) |

Family fields (apply to each ID): purpose, user type, journey phase, experience shell, entry conditions, primary action, important states, permissions, mobile/desktop behavior, loading/empty/locked/error/offline, exit transitions — detailed per family below; individual IDs inherit family defaults unless noted.

---

## Amendment — GHV.BASELINE-CORRECTION.1 (90 → 92)

| Field | Value |
|-------|-------|
| **Gate** | GHV.BASELINE-CORRECTION.1 |
| **Change Request** | **CR-001** — Master Screen Registry 92-screen reconciliation |
| **Amends** | Product Definition / PD.2 screen inventory (prior registry v1.0.0 = 90) |
| **Prior count** | 90 screen IDs |
| **Corrected count** | **92 screen IDs** |
| **Net change** | **+2** (ACT-011, ACT-012). No global renumbering. All other IDs preserved. |

### Defects closed by this amendment

| Defect | Description | Correction |
|--------|-------------|------------|
| **Defect A** | Email verification **Pending** and **Result** were conflated: ACT-003 (prompt/pending) exited to ACT-004 (“Email Verified”) as if a single success screen covered all token outcomes. Authoritative inventory requires distinct **Email Verification Pending** and **Email Verification Result**. | ACT-003 **RETAINED** and renamed to **Email Verification Pending**. ACT-011 **added** as **Email Verification Result** (full outcome set). ACT-004 retained as **SUPERSEDED_ALIAS** (compatibility row; do not delete). |
| **Defect B** | Interrupted / failed activation had **no separate screen ID**. Registry note claimed resume via “last incomplete ONB/ACT screen” only, omitting Activation Recovery required by the authoritative 92-screen / 7-shell decision. | ACT-012 **added** as **Activation Recovery**. Onboarding may still resume last incomplete ONB; activation interruptions route via ACT-012. |

### Non-negotiable correction rules

```text
NO SILENT REWRITE of historical IDs
NO global renumbering
ACT-004 ID PRESERVED as SUPERSEDED_ALIAS
Net +2 only (ACT-011, ACT-012)
Final total exactly 92
Product Code NOT authorized by this amendment
product/learning/ NOT modified
```

See [SCREEN-ID-CORRECTION-MAP.md](./SCREEN-ID-CORRECTION-MAP.md) and [SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md](./SEVEN-SHELL-SCREEN-COUNT-RECONCILIATION.md).

---

## Amendment — CR-002 / PD.2 Amendment-02 (alias-safe 92)

| Field | Value |
|-------|-------|
| **Gate** | GHV.BASELINE-CORRECTION.1 (amended) · GHV.PRODUCT-DEFINITION.2-AMENDMENT-02 |
| **Change Request** | **CR-002** — Screen alias inflation remediation |
| **Decision** | **DEC-153** |
| **Prior count model (v1.1.0)** | 92 table rows including ACT-004 SUPERSEDED_ALIAS → **91** ACTIVE when alias excluded (Architecture preflight defect) |
| **Corrected count** | **92 ACTIVE** in inventory table · **0 aliases** in table |
| **Net change** | ACT-004 removed from inventory table (appendix only) · **ACT-013 NEW** Accept Account Risk · Activation ACTIVE still **12** |

### Defect closed by this amendment

| Defect | Description | Correction |
|--------|-------------|------------|
| **Alias inflation** | SUPERSEDED_ALIAS must not count toward governed 92; ACT-004 in inventory inflated the row count | ACT-004 moved to **Historical Alias Appendix** (HISTORICAL_REFERENCE / SUPERSEDED_ALIAS; ID preserved; does **NOT** count) |
| **Underspecified risk gate** | Scope activation requires `account_risk_status = acceptable`; previously folded into ACT-006 entry | **ACT-013 Accept Account Risk** added as ACTIVE Activation screen |

### Non-negotiable correction rules (CR-002)

```text
SUPERSEDED_ALIAS does NOT count toward governed 92
ACT-004 ID PRESERVED in Historical Alias Appendix only
ACT-013 NEW ACTIVE — Scope-required risk accept (not email duplicate)
NO Product Code · NO Learning/Progression formula change
Final ACTIVE inventory exactly 92
```

---

## Per-shell summary (7 shells)

| Shell | Families / IDs | Count |
|-------|----------------|------:|
| **Public** | PUB-001…PUB-008 | **8** |
| **Activation** | ACT-001…003, 005…013 (**12 ACTIVE**; ACT-004 appendix only — not counted) | **12** |
| **Onboarding** | ONB-001…ONB-011 + IDN-001…IDN-003 | **14** |
| **Core** | IDN-004…IDN-006 + LRN-001…LRN-012 + SKY/WLD (4) + COM-001…COM-008 + LIV-001…LIV-006 + PRG-001…PRG-006 | **39** |
| **Commercial** | PAY-001…PAY-006 | **6** |
| **Trust** | TRU-001…TRU-006 | **6** |
| **Admin** | ADM-001…ADM-007 | **7** |
| **Total** | | **92** |

```text
8 + 12 + 14 + 39 + 6 + 6 + 7 = 92
```

---

## Family defaults (all families)

| Field | Default |
|-------|---------|
| Important states | loading, empty, locked, error, offline, success |
| Permissions | Server authorization; UI lock ≠ grant |
| Mobile / desktop | Per [RESPONSIVE-BEHAVIOR.md](./RESPONSIVE-BEHAVIOR.md) |
| Loading / error / offline | Per loading and error specs |
| Launch status (first controlled launch) | CONTROLLED LAUNCH unless noted |
| Accessibility | Per [MOTION-ACCESSIBILITY-SPEC.md](./MOTION-ACCESSIBILITY-SPEC.md) |
| Arabic RTL | Per [LOCALIZATION-RTL-SPEC.md](./LOCALIZATION-RTL-SPEC.md) |

---

## Public (PUB) — 8

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| PUB-001 | Landing | Discover GHURAVIA | Visitor | Discover | Public | None | Create Crow / Sign In | ACT-001 or ACT-010 |
| PUB-002 | Product Story | Explain world | Visitor | Discover | Public | From Landing | Continue | PUB-001 |
| PUB-003 | Horizons Overview | Public Horizon preview | Visitor | Discover | Public | From Landing | Explore / Create | ONB deferred until auth |
| PUB-004 | Safety & Trust | Trust messaging | Visitor | Discover | Public | From Landing | Read / Create | PUB-001 |
| PUB-005 | Pricing Overview | Plan summary | Visitor | Discover | Public | From Landing | View plans | PAY-001 after auth or ACT |
| PUB-006 | Legal Hub | Terms/privacy index | Visitor | Discover | Public | From Landing | Open doc | PUB-007/008 |
| PUB-007 | Terms (public) | View terms | Visitor | Discover | Public | Legal Hub | Accept later in ACT | PUB-006 |
| PUB-008 | Privacy (public) | View privacy notice | Visitor | Discover | Public | Legal Hub | Return | PUB-006 |

---

## Activation (ACT) — 12 ACTIVE (inventory)

Governed Activation IDs in the inventory table: **ACT-001…003, 005…013**. ACT-004 is **not** listed here — see [Historical Alias Appendix](#historical-alias-appendix--act-004).

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit | Registry status |
|----|------|---------|------|-------|-------|-------|----------------|------|-----------------|
| ACT-001 | Create Your Crow | Start identity intent | Visitor | Activate | Activation | Landing CTA | Begin | ACT-002 | ACTIVE |
| ACT-002 | Create Account | Register | Visitor | Activate | Activation | ACT-001 | Submit registration | ACT-003 | ACTIVE |
| ACT-003 | Email Verification Pending | Await / manage email verification | A0 | Activate | Activation | Registered (ACT-002) | Open mail / resend / correct address / get help | ACT-011 (link consume) · ACT-012 (interrupt/fail) · ACT-003 (resend loop) | ACTIVE — CORRECTED |
| ACT-005 | Accept Mandatory Terms | Terms gate (`current_terms_accepted`) | Email verified | Activate | Activation | ACT-011 state **VERIFIED** | Accept current terms | **ACT-013** | ACTIVE |
| ACT-006 | Basic Account Activated | A1 success (activation formula complete) | A1 | Activate | Activation | ACT-013 **acceptable** (email verified + terms + risk) | Continue | ACT-007 | ACTIVE |
| ACT-007 | Mobile Verify Now/Later | Optional mobile | A1 | Activate | Activation | ACT-006 | Verify or skip | ONB-001 | ACTIVE |
| ACT-008 | Mobile OTP | Enter OTP | A1 | Activate | Activation | Chose verify | Submit OTP | ACT-007/ONB-001 | ACTIVE |
| ACT-009 | Activation Blocked | Risk/terms failure | Any | Activate | Activation | Risk not acceptable · hard block | Resolve / support | PUB-001 · ACT-012 | ACTIVE |
| ACT-010 | Sign In | Login | Returning | Activate | Activation | Landing | Authenticate | TRU-001 | ACTIVE |
| ACT-011 | Email Verification Result | Present verification token outcome (does **not** grant tenant membership or elevated assurance) | A0 | Activate | Activation | Verification link / token consume from ACT-003 | Continue (VERIFIED) · Retry Pending · Open Recovery | **VERIFIED → ACT-005** · failures → ACT-003 / ACT-012 | ACTIVE |
| ACT-012 | Activation Recovery | Diagnose interrupted/failed activation (does **not** bypass assurance; does **not** replace TRU-005) | A0–A1 / interrupted | Activate | Activation | Failed/interrupted ACT path · deep link · support handoff | Resume Pending · Result · Terms · Risk · Support · Sign In | ACT-003 · ACT-011 · ACT-005 · **ACT-013** · ACT-009 · ACT-010 · TRU-005 *(account recovery only)* · PUB-001 | ACTIVE |
| ACT-013 | Accept Account Risk | Capture mandatory `account_risk_status = acceptable` | Email verified + terms accepted (or resume) | Activate | Activation | After ACT-005 · or ACT-012 when TERMS done but risk incomplete | Accept risk / decline | **acceptable → ACT-006** · not acceptable → ACT-009 / ACT-012 | ACTIVE — NEW |

### ACT-003 — Email Verification Pending (detailed)

| Field | Value |
|-------|-------|
| **ID** | ACT-003 |
| **Previous title** | Verify Email Prompt |
| **Canonical title** | **Email Verification Pending** |
| **Treatment** | **RETAINED** — rename only; canonical active ID for Pending |
| **Purpose** | Hold the user in email-verification pending until a token is consumed or recovery is required |
| **User** | A0 (registered, email not yet verified) |
| **Phase** | Activate |
| **Shell** | Activation |
| **Entry** | Successful registration (ACT-002); return from ACT-011 failure; return from ACT-012 reason EMAIL_NOT_VERIFIED / VERIFICATION_EXPIRED / EMAIL_CHANGED (as applicable) |
| **Primary action** | Open mail client / copy instructions; resend when available; correct address when allowed; open help |
| **Exit** | Consume link → **ACT-011**; interruption/failure diagnosis → **ACT-012**; remain on ACT-003 for resend/cooldown loops |
| **Launch status** | CONTROLLED LAUNCH |
| **Auth / assurance notes** | Remains at A0. Does not grant A1, tenant membership, or elevated assurance. Resend and address correction are server-authorized. |
| **Accessibility** | Keyboard-reachable primary actions; live region for resend/cooldown status; non-color error/state cues; clear heading “Email verification pending” |
| **Arabic RTL** | Full RTL layout; email address may be LTR island; directional chevrons flip |
| **Dependencies** | Identity/email delivery service; ACT-002 registration; ACT-011 result; ACT-012 recovery; localization strings |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 (amendment of PD.2) |
| **Amendment record** | CR-001 / Defect A — retained ID; title corrected; exit map no longer treats ACT-004 as success terminus |

**Pending states (document; no final timers in this Gate):**

| State | Meaning |
|-------|---------|
| MESSAGE_SENT | Verification message dispatched |
| RESEND_AVAILABLE | User may request another message |
| RESEND_COOLDOWN | Resend temporarily unavailable (policy-defined; timer values deferred) |
| DELIVERY_DELAYED | Delivery lag indicated; stay on Pending |
| ADDRESS_CORRECTION_AVAILABLE | Server allows address correction path |
| REQUEST_EXPIRED | Pending request no longer valid; route toward Result/Recovery as authorized |
| HELP_AVAILABLE | Help / support entry visible |

### ACT-004 — relocated

**ACT-004** is no longer an inventory-table row. See [Historical Alias Appendix — ACT-004](#historical-alias-appendix--act-004).

### ACT-011 — Email Verification Result

| Field | Value |
|-------|-------|
| **ID** | ACT-011 |
| **Title** | **Email Verification Result** |
| **Treatment** | ACTIVE — full verification outcome surface (CR-001) |
| **Purpose** | Present the result of consuming an email-verification token and route the user safely |
| **User** | A0 (token consumer); may briefly show outcomes for already-processed tokens |
| **Phase** | Activate |
| **Shell** | Activation |
| **Entry** | Verification link / token from ACT-003; redirects from historical ACT-004 alias; optional return from ACT-012 when re-evaluating a token outcome |
| **Primary action** | Continue (when VERIFIED); Retry verification / return to Pending; Open Activation Recovery; Contact support when RISK_REVIEW_REQUIRED |
| **Exit** | **VERIFIED → ACT-005**; EXPIRED / INVALID / ALREADY_USED / SUPERSEDED → ACT-003 and/or ACT-012; RISK_REVIEW_REQUIRED → ACT-012 / ACT-009 / support as authorized |
| **Launch status** | CONTROLLED LAUNCH |
| **Auth / assurance notes** | **Does not grant tenant membership or elevated assurance.** VERIFIED unlocks the terms gate (ACT-005) only; A1 still requires terms + risk OK (ACT-013 → ACT-006). |
| **Accessibility** | Outcome announced to assistive tech; distinct text+icon per outcome; Continue disabled until outcome resolved |
| **Arabic RTL** | Full RTL; outcome status readable as complete sentence; token/debug fragments as LTR islands if shown |
| **Dependencies** | Token validation service; ACT-003; ACT-005; ACT-012; risk signals for RISK_REVIEW_REQUIRED |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 |
| **Amendment record** | CR-001 / Defect A — net +1 toward 92 |

**Result outcomes:**

| Outcome | Meaning | Typical next |
|---------|---------|--------------|
| VERIFIED | Token accepted; email verified | **ACT-005** |
| EXPIRED | Token past validity | ACT-003 (resend) · ACT-012 |
| INVALID | Token malformed / not recognized | ACT-003 · ACT-012 |
| ALREADY_USED | Token previously consumed | ACT-003 / Sign In / ACT-012 as authorized |
| SUPERSEDED | Newer verification request replaced this token | ACT-003 · ACT-012 |
| RISK_REVIEW_REQUIRED | Risk controls block automatic continue | ACT-012 · ACT-009 · support |

### ACT-012 — Activation Recovery

| Field | Value |
|-------|-------|
| **ID** | ACT-012 |
| **Title** | **Activation Recovery** |
| **Treatment** | ACTIVE — interrupted/failed activation diagnosis (CR-001) |
| **Purpose** | Diagnose why activation stopped and route to the correct ACT (or support) path without elevating assurance |
| **User** | A0–A1 / interrupted activation; returning users mid-activation |
| **Phase** | Activate |
| **Shell** | Activation |
| **Entry** | Interrupted ACT flow; failed ACT-011; ACT-009 handoff; session loss mid-activation; support deep link; conflicting activation request |
| **Primary action** | Review reason; resume recommended step; open support when SUPPORT_REQUIRED |
| **Exit** | Per reason → ACT-003, ACT-011, ACT-005, **ACT-013**, ACT-009, ACT-010, PUB-001; account/password recovery only → **TRU-005** (explicitly out of band for activation diagnosis) |
| **Launch status** | CONTROLLED LAUNCH |
| **Auth / assurance notes** | **Does NOT bypass assurance.** **Does NOT replace TRU-005** account recovery / password reset. Recovery actions remain server-authorized. |
| **Accessibility** | Reason list as structured content; one primary CTA; support path keyboard-reachable |
| **Arabic RTL** | Full RTL; reason codes may remain LTR islands with localized labels |
| **Dependencies** | Activation state machine; ACT-003/005/009/010/011/013; TRU-005 (boundary only); support tooling |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 |
| **Amendment record** | CR-001 / Defect B — net +1 toward 92; CR-002 adds RISK_ACCEPTANCE_INCOMPLETE → ACT-013 |

**Recovery reasons:**

| Reason | Meaning | Typical next |
|--------|---------|--------------|
| EMAIL_NOT_VERIFIED | Still pending verification | ACT-003 |
| VERIFICATION_EXPIRED | Pending/result expired | ACT-003 · ACT-011 |
| EMAIL_CHANGED | Address change requires new verification | ACT-003 |
| TERMS_INCOMPLETE | Verified but terms not accepted | ACT-005 |
| RISK_ACCEPTANCE_INCOMPLETE | Terms done; risk not yet acceptable | **ACT-013** |
| RISK_REVIEW | Risk hold | ACT-009 · support |
| SESSION_EXPIRED | Activation session lost | ACT-010 · ACT-003 as authorized |
| CONFLICTING_REQUEST | Concurrent/conflicting activation request | ACT-003 · support |
| SUPPORT_REQUIRED | Cannot self-serve | Support · PUB-001 |

### ACT-013 — Accept Account Risk (NEW)

| Field | Value |
|-------|-------|
| **ID** | ACT-013 |
| **Title** | **Accept Account Risk** |
| **Treatment** | **NEW ACTIVE** — Scope activation formula gate |
| **Purpose** | Capture mandatory `account_risk_status = acceptable` per Scope Baseline activation formula (`email_verified` + `current_terms_accepted` + `account_risk_status = acceptable`). Previously underspecified (folded into ACT-006 entry). |
| **User** | Email verified; current terms accepted (or ACT-012 resume when risk incomplete) |
| **Phase** | Activate |
| **Shell** | Activation |
| **Entry** | After ACT-005 terms accepted; or from ACT-012 when TERMS done but risk incomplete |
| **Primary action** | Review risk disclosure; accept / decline |
| **Exit** | **acceptable → ACT-006**; not acceptable → **ACT-009** / **ACT-012** |
| **Launch status** | CONTROLLED LAUNCH |
| **Auth / assurance notes** | **Does NOT grant entitlement, XP, Mastery, or tenant membership.** Does not alone create A1; ACT-006 remains the activation-complete success surface after the full formula. |
| **Accessibility** | Risk disclosure as structured readable content; accept/decline distinct; no color-only status |
| **Arabic RTL** | Full RTL; legal/risk citations may use LTR islands where required |
| **Dependencies** | Risk decisioning / policy; ACT-005; ACT-006; ACT-009; ACT-012 |
| **Source Gate** | CR-002 / PD.2 Amendment-02 |
| **Amendment record** | CR-002 — replaces alias inflation; Scope-required (not invented solely for count) |

---

## Historical Alias Appendix — ACT-004

> **Counting rule:** Rows in this appendix are **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS**. They **do NOT** contribute to the governed **92**.

### ACT-004 — Email Verified (HISTORICAL_REFERENCE / SUPERSEDED_ALIAS)

| Field | Value |
|-------|-------|
| **ID** | ACT-004 |
| **Title** | Email Verified *(historical)* |
| **Treatment** | **Historical alias** — ID preserved for compatibility. **Not** an inventory-table row under v1.2.0. |
| **Status** | **HISTORICAL_REFERENCE / SUPERSEDED_ALIAS** |
| **Counts toward 92?** | **No** |
| **Semantics now provided by** | **ACT-011** state **VERIFIED** |
| **Purpose (legacy)** | Confirm email after token (historical single success screen) |
| **Entry map** | Any historical deep link or flow targeting ACT-004 **redirects to ACT-011** |
| **Primary action / Exit map** | Redirect to **ACT-011**; on VERIFIED continue to **ACT-005** (same as ACT-011) |
| **Launch status** | Compatibility redirect only; not a distinct UX destination |
| **Auth / assurance notes** | Must not be implemented as a parallel success path that skips ACT-011 outcome handling |
| **Dependencies** | ACT-011; client/router alias map |
| **Source Gate** | GHV.BASELINE-CORRECTION.1 (CR-001) · counting corrected by **CR-002** |
| **Amendment record** | CR-001 preserved ID; CR-002 moved out of inventory count table |

---

## Identity / Wingprint setup (IDN) — 6

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| IDN-001 | Crow Personalize | Base Crow, colors, style | A1 | Personalize | Onboarding | Activated | Save Wingprint basics | ONB-002 |
| IDN-002 | Habitat Select | Choose habitat | A1 | Personalize | Onboarding | IDN-001 | Select | IDN-001/ONB-002 |
| IDN-003 | Character Select | Character archetype | A1 | Personalize | Onboarding | IDN-001 | Select | IDN-001 |
| IDN-004 | Wingprint Home | View identity | A1+ | Ongoing | Core | Nav Wingprint | Edit / privacy | IDN-005 |
| IDN-005 | Privacy Settings | Visibility controls | A1+ | Ongoing | Core | Wingprint | Save | IDN-004 |
| IDN-006 | Titles & Crests | Display earned marks | A1+ | Ongoing | Core | Wingprint | View | IDN-004 |

---

## Onboarding (ONB) — 11

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| ONB-001 | Personalize Entry | Enter Crow setup | A1 | Personalize | Onboarding | ACT-007 | Start | IDN-001 |
| ONB-002 | Set Origin | Record Origin | A1 | Origin | Onboarding | Crow set | Save Origin | ONB-003 |
| ONB-003 | Nest Intro | Explain Nest | A1 | Nest | Onboarding | Origin set | Begin Nest / assess | ONB-004 |
| ONB-004 | Nest Assessment | Readiness check | A1 | Nest | Onboarding | ONB-003 | Complete | ONB-005 |
| ONB-005 | Nest Result | Ready/Guided/Recommended | A1 | Nest | Onboarding | Assessment done | Continue | ONB-006 or ONB-007 |
| ONB-006 | Nest Learning Path | Nest Missions | <50% or chose Nest | Nest | Onboarding | Nest Recommended | Start Mission | LRN-001 |
| ONB-007 | Choose Horizon | Select Horizon | Nest decision done | Horizon | Onboarding | Eligible | Select | ONB-008 |
| ONB-008 | Preview Possible Future | Motivational preview | Horizon chosen | Preview | Onboarding | ONB-007 | Continue | ONB-009 |
| ONB-009 | Choose Route | Select Route | Preview done | Route | Onboarding | Horizon set | Select Route | ONB-010 |
| ONB-010 | Eligibility Decision | Readiness + entitlement | Route chosen | Route | Onboarding | ONB-009 | Resolve | ONB-011 or PAY-002 |
| ONB-011 | Flight Plan Review | Review plan | Eligible | Flight Plan | Onboarding | ONB-010 pass | Launch | LRN-001 |

**Resume rules:** Interrupted **activation** is diagnosed via **ACT-012** (Activation Recovery). Interrupted **onboarding** may still resume via the last incomplete ONB screen (and related IDN-001…003 setup screens). Do not treat ACT-012 as a substitute for ONB resume, and do not treat “last incomplete ONB/ACT” as a substitute for Activation Recovery.

---

## Learning (LRN) — 12

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| LRN-001 | Mission Player | Complete Mission | Entitled | Missions | Core | Flight Plan / continue | Complete steps | LRN-002 |
| LRN-002 | Mission Complete | Mission success | Learner | Missions | Core | Mission done | Next / Evidence | LRN-003 or LRN-001 |
| LRN-003 | Evidence Capture | Produce Evidence | Learner | Evidence | Core | Prompted | Create draft | LRN-004 |
| LRN-004 | Evidence Submit | Submit Evidence | Learner | Evidence | Core | Draft ready | Submit | LRN-005 |
| LRN-005 | Evidence Status | Review status | Learner | Evidence | Core | Submitted | View outcome | LOG-001 |
| LRN-006 | Assessment Runner | Take assessment | Learner | Missions | Core | Mission gate | Submit answers | LRN-002 |
| LRN-007 | Stage Overview | Stage progress | Learner | Missions | Core | Route active | Enter Mission | LRN-001 |
| LRN-008 | Route Overview | Route map | Learner | Route | Core | Entitled | Enter Stage | LRN-007 |
| LRN-009 | Unlock Celebration | Unlock feedback | Learner | Unlock | Core | Unlock event | Continue | SKY-001 |
| LRN-010 | Wings Claimed | First wings moment | Learner | Wings Claimed | Core | First Evidence path | Go Skyboard | SKY-001 |
| LRN-011 | Cross-Wing Hub | Cross-Wing entry | Eligible | Learning | Core | Atlas-published | Enter Route | LRN-008 |
| LRN-012 | Secure Extension Hub | Secure Extension entry | Eligible | Learning | Core | Atlas-published | Enter | LRN-008 |

Micro-Mission inserts and prerequisite blocks are states/overlays on LRN-001 / LRN-008 / WLD-003, not separate screen IDs.

---

## Core Portal / World / Skyboard (WLD + SKY) — 4

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| SKY-001 | Adaptive Skyboard | Home experience (Continue Flight, Wings, Live, Rookery, Log, RAVEN Guidance modules) | A1+ | Skyboard | Core | Auth + state load | Continue Flight | LRN-001 / modules |
| WLD-001 | World Map | Five Horizons + Nest entry | A1+ | World | Core | Nav World | Select Horizon / Nest | WLD-002 / ONB-006 |
| WLD-002 | Horizon Detail | Horizon Routes | A1+ | World | Core | WLD-001 | Select Route | LRN-008 / ONB-009 |
| WLD-003 | Learning Graph View | Prereq visualization | A1+ | World | Core | From block/route | Plan path | LRN-008 |

---

## Community / Rookery (COM) — 8

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| COM-001 | Rookery Home | Community home | A1+ | Community | Core | Nav Rookery | Browse | COM-002 |
| COM-002 | Structured Feed | Posts feed | A1+ | Community | Core | COM-001 | React / open | COM-003 |
| COM-003 | Post Detail | View post | A1+ | Community | Core | Feed | React / report | COM-002 |
| COM-004 | Create Post | Structured compose | A1+ trust OK | Community | Core | Feed | Publish | COM-002 |
| COM-005 | Route Space | Route community | Entitled | Community | Core | Space join rules | Participate | COM-002 |
| COM-006 | Team Space | Team collaboration | Team member | Community | Core | Team + mobile rules as required | Collaborate | COM-007 |
| COM-007 | Teams Directory | Find/create Team | A1+ | Community | Core | Rookery | Create/join | COM-006 |
| COM-008 | Repository Space | Controlled Repository | Eligible | Community | Core | Launch catalogue | Enter | COM-002 |

---

## Live Sky (LIV) — 6

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| LIV-001 | Live Sky Directory | Browse events (filters include workshops/tournaments) | A1+ | Live | Core | Nav Live | Open event | LIV-002 |
| LIV-002 | Event Detail | Event info | A1+ | Live | Core | Directory | Join / Spectate | LIV-003/004 |
| LIV-003 | Participant Session | Active participation | Eligible | Live | Core | Entitled + trust | Participate | LIV-005 |
| LIV-004 | Spectator View | Watch | Eligible spectator | Live | Core | Event allows | Watch | LIV-001 |
| LIV-005 | Session Results | Outcomes | Participant | Live | Core | Session end | View | LIV-001 |
| LIV-006 | Live Host Console | Host controls | Host + mobile/trust | Live | Core | Host role | Manage | LIV-003 |

---

## Progression (PRG) — 6

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| PRG-001 | Progression Overview | XP/Momentum/Maturity | A1+ | Progression | Core | Wingprint | Explore | PRG-002 |
| PRG-002 | Momentum League | Seasonal league | A1+ | Progression | Core | PRG-001 | View | PRG-001 |
| PRG-003 | Mastery Board | Route Mastery | A1+ | Progression | Core | PRG-001 | Open Route | LRN-008 |
| PRG-004 | Achievements | Achievement list | A1+ | Progression | Core | Wingprint | View | PRG-001 |
| PRG-005 | Leaderboards Limited | Limited boards | A1+ | Progression | Core | Policy allows | View | PRG-001 |
| PRG-006 | Prestige View | Prestige Classes | Eligible | Progression | Core | Prestige rules | View | PRG-001 |

---

## Commercial (PAY) — 6

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| PAY-001 | Plans | Compare Access Plans | A1+ | Commercial | Commercial | Nav / entitlement block | Select plan | PAY-002 |
| PAY-002 | Checkout | Start subscription | A1+ | Commercial | Commercial | Plan selected | Pay | PAY-003 |
| PAY-003 | Payment Result | Success/fail | A1+ | Commercial | Commercial | Checkout return | Continue | SKY-001 / PAY-002 |
| PAY-004 | Subscription Manage | Manage plan | Subscriber | Commercial | Commercial | Account | Change / cancel | PAY-001 |
| PAY-005 | Invoices | Invoice list | Payer | Commercial | Commercial | Account | Download | PAY-004 |
| PAY-006 | Merit Grants | View Merit Access | A1+ | Commercial | Commercial | Account / awards | Activate grant | SKY-001 |

---

## Account and Trust (TRU) — 6

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| TRU-001 | Session Validation | Risk/session check | Returning | Return | Trust | Login | Continue | SKY-001 / ACT-009 |
| TRU-002 | Terms Version Update | Re-accept terms | A1+ | Return | Trust | Terms changed | Accept | SKY-001 |
| TRU-003 | Security Settings | Passkey/MFA/recovery | A1+ | Trust | Trust | Account | Configure A2 | TRU-004 |
| TRU-004 | Assurance Status | Show A0–A3 | A1+ | Trust | Trust | Account | Improve assurance | TRU-003 |
| TRU-005 | Recovery | Account recovery | Claimed | Trust | Trust | Recovery start | Recover | ACT-010 |
| TRU-006 | Report / Appeal | Safety appeal | A1+ | Community/Trust | Trust | Moderation event | Submit | COM-001 |

---

## Administration (ADM) — 7

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| ADM-001 | Admin Home | Staff home (includes regional policy entry) | Admin | Ops | Admin | Admin role | Navigate | ADM-* |
| ADM-002 | User Support | Account support | Admin | Ops | Admin | ADM-001 | Search user | ADM-001 |
| ADM-003 | Moderation Queue | Review reports | Moderator | Ops | Admin | ADM-001 | Act | ADM-001 |
| ADM-004 | Content Lifecycle | Publish/retire content | Content admin | Ops | Admin | ADM-001 | Manage | ADM-001 |
| ADM-005 | Entitlement Audit | Entitlement inspection | Admin | Ops | Admin | ADM-001 | Inspect | ADM-001 |
| ADM-006 | Live Ops | Live Sky ops | Live admin | Ops | Admin | ADM-001 | Manage events | LIV-001 |
| ADM-007 | Audit Log Viewer | Security audit | Security admin | Ops | Admin | ADM-001 | Query | ADM-001 |

---

## Count check

### Counting rule

```text
Inventory table = ACTIVE / governed IDs only.
Historical Alias Appendix (ACT-004) does NOT count.
Aliases in inventory = 0.
Total ACTIVE = 92.
```

### By family

| Family | Count |
|--------|------:|
| PUB | 8 |
| ACT | **12** ACTIVE (ACT-001…003, 005…013; ACT-004 appendix only) |
| IDN | 6 |
| ONB | 11 |
| LRN | 12 |
| SKY+WLD | 4 |
| COM | 8 |
| LIV | 6 |
| PRG | 6 |
| PAY | 6 |
| TRU | 6 |
| ADM | 7 |
| **Total** | **92** |

### By shell (must match family total)

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

Visual wireframes are **out of scope** for this Gate.
