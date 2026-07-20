# Public Wireframes (PUB)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-PUB-PACK |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [MASTER-SCREEN-REGISTRY.md](../../screens/MASTER-SCREEN-REGISTRY.md) · [PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) · [CAPABILITY-REGISTRY.md](../../CAPABILITY-REGISTRY.md) · [LOCALIZATION-RTL-SPEC.md](../../screens/LOCALIZATION-RTL-SPEC.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Final marketing copy · Live public-safe event catalogue rules (GHV.LIVE) · Plan SKU names beyond Open Flight |
| **Change history** | 1.0.0 — PD.3 initial low-fidelity pack |

**Authority:** Screen IDs from Master Screen Registry only (not Gate aliases). Wireframe IDs `GHV-WF-PUB-00N`.

**Ethical (pack-wide):** No fake urgency. Payment ≠ skill / Mastery / Rank / Prestige. On pricing surfaces, **Open Flight** remains visibly available as the free path.

**Shell:** Public World Shell ([PAGE-COMPOSITION-SYSTEM.md](../../interactions/PAGE-COMPOSITION-SYSTEM.md)).

**Public Live Sky note:** There is **no** separate PUB screen ID for Live Sky. Public-safe Live preview is a **variant** on PUB-001 (and optionally PUB-002/003 exploration links) that deep-links or teases authenticated **LIV-001** Live Sky Directory — public-safe fields only (FLOW-010). Full directory/session UX lives under LIV-*.

---

## Index

| Wireframe ID | Screen ID | Name | Detail level |
|--------------|-----------|------|--------------|
| GHV-WF-PUB-001 | PUB-001 | Landing | DETAILED |
| GHV-WF-PUB-002 | PUB-002 | Product Story (World Preview) | DETAILED |
| GHV-WF-PUB-003 | PUB-003 | Horizons Overview | DETAILED |
| GHV-WF-PUB-004 | PUB-004 | Safety & Trust | DETAILED |
| GHV-WF-PUB-005 | PUB-005 | Pricing Overview | DETAILED |
| GHV-WF-PUB-006 | PUB-006 | Legal Hub | Family note |
| GHV-WF-PUB-007 | PUB-007 | Terms (public) | Family note |
| GHV-WF-PUB-008 | PUB-008 | Privacy (public) | Family note |

---

## GHV-WF-PUB-001 — Landing

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PUB-001 |
| **Screen ID** | PUB-001 |
| **Name** | Landing |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Visitor |
| **Journey phase** | Discover |
| **Shell** | Public |
| **Objectives** | Brand discovery; explain GHURAVIA value; route to Create Crow or Sign In; surface trust/plans/story without forcing account |
| **Entry** | Direct URL · marketing · logout return · ACT-009 resolve path |
| **Exit** | ACT-001 · ACT-010 · PUB-002..006 · public-safe Live tease → LIV-001 (auth) |
| **Primary actions** | Create Your Crow · Sign In |
| **Secondary actions** | Product Story · Horizons · Safety · Plans · Legal · Language |
| **Related capabilities** | CAP-ONB-001 |
| **Unresolved** | Exact hero media · public Live teaser eligibility copy |

**Content hierarchy:** Brand → one headline → short support → primary CTAs → Living World signal → secondary exploration → footer.

```text
┌──────────────────────────────────────────────────────────┐
│ [GHURAVIA]   AR|EN    Story  Horizons  Safety  Plans    │
│                         [Sign In]  [Create Your Crow]    │
├──────────────────────────────────────────────────────────┤
│ HERO                                                     │
│ Brand + headline                                         │
│ One supporting sentence                                  │
│ [Create Your Crow]              [Sign In]                │
├──────────────────────────────────────────────────────────┤
│ Living World Signal (optional public-safe Live tease)    │
│ "Live Sky" → requires account → LIV-001 (not a PUB id)   │
├──────────────────────────────────────────────────────────┤
│ Explore: Story | Horizons | Safety | Plans               │
├──────────────────────────────────────────────────────────┤
│ Footer: Legal · Privacy · Terms · Contact                │
└──────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Adaptive** | Single composition; no dashboard chrome |
| **Loading** | Skeleton header + hero; CTAs disabled until shell ready |
| **Empty** | N/A (static marketing); Live tease empty → hide row |
| **Locked** | N/A for visitors |
| **Permission** | No authenticated modules |
| **Error** | Soft banner; retry content; CTAs remain |
| **Offline** | Cached static; Create/Sign In show connectivity notice |
| **Mobile** | Stack hero → CTAs sticky bottom; nav in menu |
| **Tablet** | Hero full-bleed; secondary two-col |
| **Desktop** | Full Public shell as above |
| **A11y** | One H1; skip link; CTA contrast; focus order header→hero→explore |
| **Arabic RTL** | Mirror header/footer; brand still first reading signal |
| **English LTR** | Default LTR composition |
| **Analytics (conceptual)** | `landing_view` · `cta_create_crow` · `cta_sign_in` · `nav_public_*` · `live_tease_click` |
| **Security / audit** | No PII; language cookie/session only |

**Acceptance criteria**

1. Create Crow → ACT-001; Sign In → ACT-010.
2. No countdown / fake scarcity on landing.
3. Public Live tease does not invent a PUB Live ID; documents path to LIV-001.
4. Arabic RTL and English LTR both preserve brand-first hero.

---

## GHV-WF-PUB-002 — Product Story (World Preview)

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PUB-002 |
| **Screen ID** | PUB-002 |
| **Name** | Product Story (World Preview) |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Visitor |
| **Journey phase** | Discover |
| **Shell** | Public |
| **Objectives** | Explain world model (Nest → Horizons → Routes → Missions → Evidence); motivate Create Crow without payment pressure |
| **Entry** | PUB-001 · header Story |
| **Exit** | PUB-001 · PUB-003 · ACT-001 · ACT-010 |
| **Primary actions** | Continue / Create Your Crow |
| **Secondary actions** | Back to Landing · Horizons · Sign In |
| **Related capabilities** | CAP-ONB-001 · CAP-ONB-009 (preview only) |
| **Unresolved** | Final narrative beats · illustration set |

**Content hierarchy:** Title → world metaphor → 4–5 story beats → CTA.

```text
┌──────────────────────────────────────────────────────────┐
│ [GHURAVIA]  …nav…                    [Sign In][Create]   │
├──────────────────────────────────────────────────────────┤
│ Product Story / World Preview                            │
│ Beat 1: The Crow & identity                              │
│ Beat 2: The Nest                                         │
│ Beat 3: Five Horizons                                    │
│ Beat 4: Missions & Evidence (XP ≠ Mastery callout)       │
│ Beat 5: Live Sky (public-safe) → later LIV-001           │
│ [Create Your Crow]     [Explore Horizons → PUB-003]      │
└──────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Adaptive** | Linear story; optional side preview panel on desktop |
| **Loading / error / offline** | Progressive text; offline = cached story |
| **Empty / locked** | N/A |
| **Mobile / tablet / desktop** | Mobile: stacked beats; desktop: beats + optional world diagram |
| **A11y** | Landmark main; beat headings; reduced-motion for any motion beats |
| **RTL / LTR** | Mirror diagram arrows |
| **Analytics** | `story_view` · `story_complete` · `story_cta_create` |
| **Security / audit** | Public content only |

**Acceptance criteria**

1. Payment never framed as skill unlock in story beats.
2. Open Flight / free start implied via Create Crow, not gated paywall.
3. Live mentioned as public-safe preview → LIV-001 after auth.

---

## GHV-WF-PUB-003 — Horizons Overview

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PUB-003 |
| **Screen ID** | PUB-003 |
| **Name** | Horizons Overview |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Visitor |
| **Journey phase** | Discover |
| **Shell** | Public |
| **Objectives** | Preview five Horizons publicly; defer Nest/Route selection until auth (ONB) |
| **Entry** | PUB-001 · PUB-002 · nav |
| **Exit** | ACT-001 · PUB-001 · PUB-002 · PUB-005 |
| **Primary actions** | Create Crow to explore · Horizon card expand (read-only) |
| **Secondary actions** | Plans · Safety · Sign In |
| **Related capabilities** | CAP-ONB-001 · CAP-ONB-009 (visibility only) |
| **Unresolved** | Horizon display names locked in Learning Gate |

**Content hierarchy:** Intro → five Horizon cards → CTA to activate.

```text
┌──────────────────────────────────────────────────────────┐
│ Header …                                                 │
├──────────────────────────────────────────────────────────┤
│ Horizons Overview                                        │
│ Short: choose a Horizon after you activate               │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                      │
│ │ H1 │ │ H2 │ │ H3 │ │ H4 │ │ H5 │  (read-only preview) │
│ └────┘ └────┘ └────┘ └────┘ └────┘                      │
│ Detail panel: purpose · sample Route types (no enroll)   │
│ [Create Your Crow]         [View Plans → PUB-005]        │
└──────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Locked** | Enroll / start Route controls absent; explain “available after activation” |
| **Empty** | If catalogue unavailable → retry; show Nest mention as concept only |
| **Loading / error / offline** | Card skeletons; offline = last public catalogue snapshot |
| **Mobile** | Horizontal scroll or stacked cards |
| **Desktop** | Five-up or wrap grid + detail |
| **A11y** | Cards as buttons for expand; focus trap in detail |
| **RTL / LTR** | Card order mirrors |
| **Analytics** | `horizons_overview_view` · `horizon_card_open` · `horizons_cta_create` |
| **Security / audit** | No entitlement checks client-side as grants |

**Acceptance criteria**

1. No Route start without auth; ONB deferred.
2. No fake “limited seats” urgency on public cards.
3. Open Flight not hidden behind Horizon pay messaging.

---

## GHV-WF-PUB-004 — Safety & Trust

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PUB-004 |
| **Screen ID** | PUB-004 |
| **Name** | Safety & Trust |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Visitor |
| **Journey phase** | Discover |
| **Shell** | Public |
| **Objectives** | Trust messaging: integrity, Evidence honesty, community norms, privacy posture; invite Create Crow |
| **Entry** | PUB-001 · footer · ACT blocked recovery education |
| **Exit** | PUB-001 · PUB-006 · ACT-001 · ACT-010 |
| **Primary actions** | Read sections · Create Crow |
| **Secondary actions** | Legal Hub · Privacy · Report info (conceptual) |
| **Related capabilities** | CAP-ONB-001 · CAP-ONB-003/004 (trust education) |
| **Unresolved** | Regional policy pack variants |

**Content hierarchy:** Promise → principles → what we never sell as skill → links to legal.

```text
┌──────────────────────────────────────────────────────────┐
│ Header …                                                 │
├──────────────────────────────────────────────────────────┤
│ Safety & Trust                                           │
│ • Learning integrity (Evidence, no shortcut purchase)    │
│ • Payment ≠ Skill / Mastery / Rank                       │
│ • Community & Live safety (public-safe spectate norms)   │
│ • Account assurance overview (email → optional mobile)   │
│ [Create Your Crow]     [Legal Hub → PUB-006]             │
└──────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **States** | Mostly static; error = section fail soft |
| **Mobile / desktop** | Stacked sections; desktop two-col principles |
| **A11y** | Headings per principle; links labeled |
| **RTL / LTR** | Mirror lists |
| **Analytics** | `safety_view` · `safety_to_legal` · `safety_cta_create` |
| **Security / audit** | No collection beyond analytics consent rules |

**Acceptance criteria**

1. Explicit Payment ≠ Skill statement visible without expand.
2. No scare-urgency or “act now or banned” dark patterns.
3. Path to PUB-006/007/008 clear.

---

## GHV-WF-PUB-005 — Pricing Overview

| Field | Value |
|-------|-------|
| **Wireframe ID** | GHV-WF-PUB-005 |
| **Screen ID** | PUB-005 |
| **Name** | Pricing Overview |
| **Scope** | CONTROLLED LAUNCH |
| **User type** | Visitor |
| **Journey phase** | Discover |
| **Shell** | Public |
| **Objectives** | Summarize plans ethically; keep **Open Flight** visible and equal-weight as free path; defer checkout to PAY after auth |
| **Entry** | PUB-001 · nav Plans · PUB-003 |
| **Exit** | ACT-001 · ACT-010 · PAY-001 (after auth) · PUB-001 · PUB-004 |
| **Primary actions** | Start Open Flight (Create Crow) · View paid plan details (info) |
| **Secondary actions** | Safety · Sign In · Legal |
| **Related capabilities** | CAP-ONB-001 · commercial caps (PAY after auth) |
| **Unresolved** | Final plan matrix · SAR display formatting |

**Content hierarchy:** Ethical frame → Open Flight first/equal → paid plan cards → footnotes.

```text
┌──────────────────────────────────────────────────────────┐
│ Header …                                                 │
├──────────────────────────────────────────────────────────┤
│ Plans                                                    │
│ Note: Payment does not buy skill, Mastery, Rank, Prestige│
│ No countdown / fake scarcity                             │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│ │ Open Flight  │  │ Plan B       │  │ Plan C       │    │
│ │ FREE path    │  │ (entitlement)│  │ (entitlement)│    │
│ │ [Start free] │  │ [Learn more] │  │ [Learn more] │    │
│ └──────────────┘  └──────────────┘  └──────────────┘    │
│ Checkout after account → PAY-* (not on this screen)      │
└──────────────────────────────────────────────────────────┘
```

| Concern | Behavior |
|---------|----------|
| **Locked** | Purchase CTAs for visitors → Create Crow / Sign In first |
| **Empty** | If plans fail to load → Open Flight CTA still present |
| **Error / offline** | Preserve Open Flight; show retry for paid catalogue |
| **Mobile** | Stack; Open Flight first |
| **Desktop** | Equal card row; Open Flight not demoted |
| **A11y** | Plan comparison readable; no color-only “recommended” |
| **RTL / LTR** | Card order mirrors; currency locale |
| **Analytics** | `pricing_view` · `open_flight_cta` · `plan_info_open` |
| **Security / audit** | No payment instrument on PUB-005 |

**Acceptance criteria**

1. **Open Flight** visible without scroll-past-paid-only layout.
2. No fake urgency timers or “only N left” on plans.
3. Copy never claims payment purchases skill/Mastery/Rank/Prestige.
4. Paid start routes through ACT then PAY, not silent charge.

---

## Family note — PUB-006 · PUB-007 · PUB-008 (Legal)

| Screen ID | Name | Wireframe ID | Role |
|-----------|------|--------------|------|
| PUB-006 | Legal Hub | GHV-WF-PUB-006 | Index: Terms · Privacy · related notices |
| PUB-007 | Terms (public) | GHV-WF-PUB-007 | Read-only current public Terms; acceptance later at ACT-005 |
| PUB-008 | Privacy (public) | GHV-WF-PUB-008 | Read-only privacy notice |

**Shared shell:** Public header + document reader + footer back to hub.

```text
┌──────────────────────────────────────┐
│ Header …                             │
├──────────────────────────────────────┤
│ Legal Hub / Document title           │
│ Links or long-form body              │
│ [Back to Hub]  [Create Crow]         │
└──────────────────────────────────────┘
```

| Shared | Behavior |
|--------|----------|
| **User / phase** | Visitor · Discover |
| **Entry / exit** | Footer · PUB-004 · hub ↔ docs · return PUB-001 |
| **Primary** | Open / read; no accept checkbox on public Terms |
| **States** | Loading doc · error retry · offline cached version label |
| **RTL / LTR** | Full document mirror; version/date locale |
| **Analytics** | `legal_hub_view` · `terms_public_view` · `privacy_public_view` |
| **Audit** | View-only; acceptance audit belongs to ACT-005 |
| **Related** | CAP-ONB-004 (education); binding accept = ACT |
| **Acceptance** | Public Terms ≠ activation acceptance; clear version stamp |

---

## Pack acceptance (Public)

1. All PUB-001..005 detailed; PUB-006..008 documented as legal family.
2. No Gate alias IDs; registry IDs only.
3. Public Live Sky documented as variant → LIV-001, not a PUB id.
4. Ethical rules enforced on PUB-005 and referenced on PUB-004.
