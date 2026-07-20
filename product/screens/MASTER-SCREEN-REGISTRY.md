# Master Screen Registry

| Field | Value |
|-------|-------|
| **Status** | LOCKED — Authoritative |
| **Version** | 1.0.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-20 |
| **Source Gate** | GHV.FOUNDATION.1A |
| **Related** | [SCREEN-STATE-CONTRACT.md](./SCREEN-STATE-CONTRACT.md) · [MASTER-USER-JOURNEY.md](../journeys/MASTER-USER-JOURNEY.md) |
| **Count** | 90 screen IDs |

Family fields (apply to each ID): purpose, user type, journey phase, experience shell, entry conditions, primary action, important states, permissions, mobile/desktop behavior, loading/empty/locked/error/offline, exit transitions — detailed per family below; individual IDs inherit family defaults unless noted.

---

## Family defaults (all families)

| Field | Default |
|-------|---------|
| Important states | loading, empty, locked, error, offline, success |
| Permissions | Server authorization; UI lock ≠ grant |
| Mobile / desktop | Per [RESPONSIVE-BEHAVIOR.md](./RESPONSIVE-BEHAVIOR.md) |
| Loading / error / offline | Per loading and error specs |

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

## Activation (ACT) — 10

| ID | Name | Purpose | User | Phase | Shell | Entry | Primary action | Exit |
|----|------|---------|------|-------|-------|-------|----------------|------|
| ACT-001 | Create Your Crow | Start identity intent | Visitor | Activate | Activation | Landing CTA | Begin | ACT-002 |
| ACT-002 | Create Account | Register | Visitor | Activate | Activation | ACT-001 | Submit registration | ACT-003 |
| ACT-003 | Verify Email Prompt | Await email | A0 | Activate | Activation | Registered | Open mail / resend | ACT-004 |
| ACT-004 | Email Verified | Confirm email | A0→A1 pending terms | Activate | Activation | Token valid | Continue | ACT-005 |
| ACT-005 | Accept Mandatory Terms | Terms gate | Email verified | Activate | Activation | ACT-004 | Accept current terms | ACT-006 |
| ACT-006 | Basic Account Activated | A1 success | A1 | Activate | Activation | Terms accepted + risk OK | Continue | ACT-007 |
| ACT-007 | Mobile Verify Now/Later | Optional mobile | A1 | Activate | Activation | ACT-006 | Verify or skip | ONB-001 |
| ACT-008 | Mobile OTP | Enter OTP | A1 | Activate | Activation | Chose verify | Submit OTP | ACT-007/ONB-001 |
| ACT-009 | Activation Blocked | Risk/terms failure | Any | Activate | Activation | Risk not acceptable | Resolve / support | PUB-001 |
| ACT-010 | Sign In | Login | Returning | Activation | Activation | Landing | Authenticate | TRU-001 |

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

Interrupted onboarding resumes via the last incomplete ONB/ACT screen (no separate screen ID).

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

| Family | Count |
|--------|-------|
| PUB | 8 |
| ACT | 10 |
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
| **Total** | **90** |

Visual wireframes are **out of scope** for this Gate.
