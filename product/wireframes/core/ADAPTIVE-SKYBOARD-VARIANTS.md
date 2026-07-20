# Adaptive Skyboard Variants

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-SKY-VARIANTS |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Screen** | SKY-001 (GHV-WF-SKY-001) |
| **Related** | [CORE-WIREFRAMES.md](./CORE-WIREFRAMES.md) · [SKYBOARD-COMPOSITION-RULES.md](../../ebux/SKYBOARD-COMPOSITION-RULES.md) · [ADAPTIVE-STATE-MATRIX.md](../../ebux/ADAPTIVE-STATE-MATRIX.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Change history** | 1.0.0 — PD.3 |

---

## Composition law

Modules (required set): **Continue Flight · Wings · Live · Rookery · Log · RAVEN Guidance**.

| Rule | Lock |
|------|------|
| **Max 3 competing priority cards above fold** | Never stack more than three attention-competing cards in the priority region |
| Continue Flight wins when an active Flight exists | Unless a higher urgency safety/account banner applies (grace, restricted) — banners ≠ priority cards |
| Hidden ≠ unauthorized | Hidden modules still exist in nav; omit from priority only |
| RAVEN is advisory | User may ignore; degraded service falls back without blocking learning |
| No subscription interrupt inside Mission | Grace/upgrade cards allowed on Skyboard only — not injected into LRN-001 |

### Priority card anatomy

```text
┌─ Priority card ─────────────────────────────────────────┐
│ Title · urgency tone (calm|attention|critical)          │
│ One-line status                                         │
│ [Primary CTA]                                           │
└─────────────────────────────────────────────────────────┘
```

### Column key (all 16 variants)

| Field | Meaning |
|-------|---------|
| **First priority card** | Slot 1 above fold |
| **Secondary** | Slot 2 (and slot 3 if listed); extras demoted to modules |
| **Hidden** | Not shown as priority cards (module may still render quieter) |
| **Primary CTA** | Single strongest action on the board |
| **RAVEN message** | Guidance module copy direction |
| **Reason** | Why this composition |
| **Fallback** | If primary path fails or services degrade |

---

## 1 — New Learner

| Field | Value |
|-------|-------|
| **First priority card** | Welcome / Finish Nest or Choose Horizon |
| **Secondary** | (2) Open Flight intro · (3) Safety & Trust tip — *or omit 3 if Nest incomplete* |
| **Hidden** | Live event promo · Merit · Momentum risk · Overloaded warnings |
| **Primary CTA** | Start Nest assessment / Continue onboarding |
| **RAVEN message** | “Begin with Nest or your first Horizon — I’ll keep the path simple.” |
| **Reason** | No active Flight; orientation over engagement mechanics |
| **Fallback** | World Map Nest entry; skip optional tips |

**Above fold (≤3):** Welcome · Open Flight intro · optional Trust tip.

---

## 2 — First Mission Available

| Field | Value |
|-------|-------|
| **First priority card** | First Mission ready (Route/Stage named) |
| **Secondary** | (2) Flight Plan reminder · (3) Your Wings empty-state “Evidence ahead” |
| **Hidden** | Live · Rookery social proof · Grace · Stall recovery |
| **Primary CTA** | Start first Mission |
| **RAVEN message** | “Your first Mission is ready. XP tracks effort; Evidence builds Wings.” |
| **Reason** | Entitled + Flight Plan complete; convert to first Mission Focus |
| **Fallback** | Stage Overview (LRN-007) if Mission payload fails to load |

**Above fold (≤3):** Mission ready · Flight Plan · Wings empty hint.

---

## 3 — Active Mission

| Field | Value |
|-------|-------|
| **First priority card** | Continue Flight — exact Mission position |
| **Secondary** | (2) Stage progress snippet · (3) optional next-unlock peek **or** Log “last save” |
| **Hidden** | New learner welcome · Live promo · Merit (unless also grace — then grace is banner not 4th card) |
| **Primary CTA** | Resume Mission |
| **RAVEN message** | “Pick up where you left off — progress is saved.” |
| **Reason** | Active Flight is highest composition priority |
| **Fallback** | Open Stage Overview; Safe Exit resume point from sync |

**Above fold (≤3):** Continue · Stage snippet · save/unlock peek.

---

## 4 — Evidence Pending

| Field | Value |
|-------|-------|
| **First priority card** | Evidence in review (status) |
| **Secondary** | (2) Continue Flight if Mission remains · (3) Log deep-link to LRN-005 |
| **Hidden** | Live · Rookery · New unlock celebration (defer until decision) |
| **Primary CTA** | View Evidence Status |
| **RAVEN message** | “Your Evidence is under review. Mastery waits on the outcome — not on XP.” |
| **Reason** | Pending review is the learner’s open loop |
| **Fallback** | Flight Log list; Continue Mission if still incomplete |

**Above fold (≤3):** Evidence pending · Continue (if any) · Log link.

---

## 5 — Revision Required

| Field | Value |
|-------|-------|
| **First priority card** | Evidence revision required + feedback excerpt |
| **Secondary** | (2) Continue other Flight only if non-blocking · (3) Log history |
| **Hidden** | Live · Wings celebration · Merit upsell |
| **Primary CTA** | Edit & resubmit Evidence |
| **RAVEN message** | “Revision is part of mastery — here’s what to improve.” |
| **Reason** | Actionable blocker on Mastery path (FLOW-008) |
| **Fallback** | Open LRN-005 full feedback; support link |

**Above fold (≤3):** Revision · optional Continue · Log.

---

## 6 — New Unlock

| Field | Value |
|-------|-------|
| **First priority card** | New unlock available (Stage/Route/Live/feature) |
| **Secondary** | (2) Continue Flight · (3) Wings / crest note if related |
| **Hidden** | Stall · Overloaded · Merit (unless unlock *is* Merit) |
| **Primary CTA** | Explore unlock / Continue to unlocked place |
| **RAVEN message** | “Something new opened on your path — see what you can do now.” |
| **Reason** | Celebrate progress without drowning active Mission |
| **Fallback** | LRN-009 celebration screen once; then quiet badge on module |

**Above fold (≤3):** Unlock · Continue · Wings note.

---

## 7 — Live Event Eligible

| Field | Value |
|-------|-------|
| **First priority card** | Live Sky event eligible (time-bound) |
| **Secondary** | (2) Continue Flight · (3) Spectate option if not joining |
| **Hidden** | Rookery promo · Merit · New learner |
| **Primary CTA** | View event / Board |
| **RAVEN message** | “You’re eligible for a Live session — join or spectate safely.” |
| **Reason** | Time sensitivity elevates Live without deleting Flight |
| **Fallback** | LIV-001 directory; if ineligible on tap → Explainable Event Lock |

**Above fold (≤3):** Live eligible · Continue · Spectate.

---

## 8 — Returning User

| Field | Value |
|-------|-------|
| **First priority card** | Welcome back — Continue Flight (last position) |
| **Secondary** | (2) What changed (unlock/Evidence/Live one-liner) · (3) Log recent |
| **Hidden** | Full Nest onboarding · Overloaded multi-alerts |
| **Primary CTA** | Resume |
| **RAVEN message** | “Welcome back. Here’s the shortest path to your last Mission.” |
| **Reason** | Re-entry after session (FLOW-006); reduce re-orientation cost |
| **Fallback** | Stage Overview; World if no Flight |

**Above fold (≤3):** Resume · changelog one-liner · Log.

---

## 9 — Stalled User

| Field | Value |
|-------|-------|
| **First priority card** | Stall recovery — smaller Mission or Resume |
| **Secondary** | (2) Refresh Flight Plan · (3) Nest/Micro-Mission if readiness gap |
| **Hidden** | Live FOMO · Rookery noise · competitive leaderboards |
| **Primary CTA** | Start smaller Mission / Resume gently |
| **RAVEN message** | “No shame in pausing. Choose a smaller step or resume when ready.” |
| **Reason** | Engagement Recovery Engine (FLOW-007); calm tone |
| **Fallback** | ONB-011 Flight Plan review; World Nest |

**Above fold (≤3):** Recovery · Flight Plan · Micro-Mission/Nest.

---

## 10 — Overloaded User

| Field | Value |
|-------|-------|
| **First priority card** | Focus suggestion — one next Mission only |
| **Secondary** | (2) Pause/park extra Routes (capacity) · (3) Hide Live/Rookery noise CTA |
| **Hidden** | Additional Live cards · multi-unlock stack · Merit + Grace together as cards (use one banner max) |
| **Primary CTA** | Do one thing — Continue single Flight |
| **RAVEN message** | “Too much at once — I collapsed the board to one next step.” |
| **Reason** | Cognitive load; enforce ≤3 cards by suppressing competition |
| **Fallback** | Manual module list; user chooses World |

**Above fold (≤3):** One focus · Capacity/pause · Quiet mode toggle.

---

## 11 — Subscription Grace Period

| Field | Value |
|-------|-------|
| **First priority card** | Grace status — preserve work messaging |
| **Secondary** | (2) Continue Flight (Open Flight / entitled remainder) · (3) Update payment **or** Merit alternative |
| **Hidden** | Upsell bundles · Live paid-only promos as priority |
| **Primary CTA** | Update payment (or Continue if still entitled to active Mission) |
| **RAVEN message** | “You’re in grace — completed work stays. Fix billing or continue what’s still open.” |
| **Reason** | FLOW-014; Skyboard may show commercial urgency; Mission Focus must not interrupt |
| **Fallback** | PAY-004 manage · downgrade Open Flight path · PAY-006 Merit |

**Above fold (≤3):** Grace · Continue · Pay/Merit.

*Persistent grace banner may accompany cards; still count competing cards ≤3.*

---

## 12 — Merit Opportunity

| Field | Value |
|-------|-------|
| **First priority card** | Merit Access opportunity (criteria summary) |
| **Secondary** | (2) Continue Flight / Evidence path toward criteria · (3) Commercial plan as **secondary** alternative |
| **Hidden** | Aggressive upgrade-only card · Stall shame |
| **Primary CTA** | View Merit path / required Evidence |
| **RAVEN message** | “Merit can open this Route — Evidence and progress first; plans are optional.” |
| **Reason** | Ethical commercial: Merit visible without Skill-purchase implication |
| **Fallback** | PAY-006 · Learning Graph prerequisites · Save for later |

**Above fold (≤3):** Merit · Continue/Evidence · Plan alternative.

---

## 13 — Momentum at Risk

| Field | Value |
|-------|-------|
| **First priority card** | Momentum at risk — short Mission to stabilize |
| **Secondary** | (2) Continue Flight · (3) League calm status (no panic ranking) |
| **Hidden** | Live · Rookery · multi-upsell |
| **Primary CTA** | Complete short Mission |
| **RAVEN message** | “Momentum dips — a small Mission today protects your streak of effort.” |
| **Reason** | Progression engagement without dark patterns |
| **Fallback** | PRG-002 quiet view; Resume any active Mission |

**Above fold (≤3):** Momentum · Continue · calm League note.

---

## 14 — No Active Route

| Field | Value |
|-------|-------|
| **First priority card** | Choose / resume a Route |
| **Secondary** | (2) World Map Horizons · (3) Nest if readiness unclear |
| **Hidden** | Continue Flight (no Flight) · Evidence pending · Live FOMO |
| **Primary CTA** | Open World / Choose Route |
| **RAVEN message** | “No active Route — pick a Horizon or return to Nest guidance.” |
| **Reason** | Empty Continue module must show first-action, not dead end |
| **Fallback** | ONB-007/009 · LRN-011/012 if eligible hubs |

**Above fold (≤3):** Choose Route · World · Nest.

---

## 15 — Degraded Recommendation Service

| Field | Value |
|-------|-------|
| **First priority card** | Continue Flight (raw Flight State) **or** Choose Route if none |
| **Secondary** | (2) Flight Log · (3) World Map |
| **Hidden** | Personalized RAVEN ranking cards · “Recommended for you” stacks |
| **Primary CTA** | Resume / Open Log |
| **RAVEN message** | “Guidance is limited right now — your Flight and Log still work.” *(or module quiet empty)* |
| **Reason** | EBUX: core learning continues if recommendation/AI degrades |
| **Fallback** | Composition rules degraded mode: Continue + Log only; retry guidance later |

**Above fold (≤3):** Continue/Choose · Log · World.

---

## 16 — Offline with Saved Work

| Field | Value |
|-------|-------|
| **First priority card** | Offline Draft / saved work available |
| **Secondary** | (2) Continue supported offline Mission steps · (3) Sync status when back online |
| **Hidden** | Live · Rookery publish · Submit Evidence · payment |
| **Primary CTA** | Open saved Mission / review Offline Draft |
| **RAVEN message** | “You’re offline — saved work is kept. Submit waits until sync.” |
| **Reason** | Sync spec: never silently discard; disable unsupported actions with reason |
| **Fallback** | Read-only Log cache; block Submit/Assessment final until Synced |

**Above fold (≤3):** Offline saved work · Continue (if allowed) · Sync explainer.

---

## Priority conflict resolution

When multiple variant signals fire simultaneously, rank urgency:

```text
1. Restricted / terms / safety banners (chrome — not cards)
2. Offline with Saved Work / Sync Conflict
3. Subscription Grace (if access endangered)
4. Revision Required / Evidence Pending
5. Active Mission Continue
6. Stall / Overloaded / Momentum (pick one engagement card)
7. Live time-bound
8. New Unlock / Merit / Returning chrome
9. New Learner / No Active Route
```

Truncate to **3** priority cards; demote the rest into quiet modules.

---

## ASCII — example Active Mission board

```text
┌──────────────────────────────────────────────────────────────────┐
│ SKY-001 · sync Saved · 🔔 state                                  │
├──────────────────────────────────────────────────────────────────┤
│ [P1 Continue Mission X @ step 3] [P2 Stage 60%] [P3 Last save]   │
├──────────────────────────────────────────────────────────────────┤
│ Continue Your Flight — Resume                                    │
│ Your Wings — …                                                   │
│ Live Sky — quiet                                                 │
│ The Rookery — quiet                                              │
│ Flight Log — recent                                              │
│ RAVEN Guidance — “Pick up where you left off…”                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Acceptance (wireframe)

- [ ] All 16 variants specified with required fields
- [ ] Max 3 competing priority cards enforced in law + examples
- [ ] Modules referenced: Continue Flight, Wings, Live, Rookery, Log, RAVEN Guidance
- [ ] Degraded + offline fallbacks preserve learning
- [ ] Grace commercial on Skyboard only — not Mission interrupt
