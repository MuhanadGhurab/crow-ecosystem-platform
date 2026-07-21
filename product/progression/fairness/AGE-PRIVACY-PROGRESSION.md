# Age and Privacy — Progression

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-AGE-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-FAIRNESS-ARCHITECTURE.md](./PROGRESSION-FAIRNESS-ARCHITECTURE.md) · [../experience/PROGRESSION-EXPLAINABILITY.md](../experience/PROGRESSION-EXPLAINABILITY.md) · [../experience/PROGRESSION-SCREEN-STATE-MAP.md](../experience/PROGRESSION-SCREEN-STATE-MAP.md) · [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../README.md](../README.md) |
| **Authoritative inputs** | GHV.PROGRESSION.1A §30 · Identity / Crow public profile principles · Product Constitution privacy |
| **Unresolved formula dependencies** | None numeric in 1A; age-band activation remains legal-gated |
| **Unresolved technical dependencies** | Guardian flows, contact controls, leaderboard privacy filters → legal + technical validation |
| **Privacy classification** | HIGH — minors / age-banded users |
| **Decision sensitivity** | HIGH for Prestige, mentoring, community, Titles presentation |
| **Appealability** | YES for wrongful public exposure or contact-policy breaches affecting standing |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED · Guardian requirements PENDING LEGAL |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Age and Privacy Architecture |

---

## Purpose

Define progression-specific **age and privacy** architecture for users aged **15–17** where legally activated, so public standing, Titles, Prestige, mentoring, and leaderboards never leak personal data or imply unsafe adult pathways.

```text
STATUS: ARCHITECTURE RECOMMENDED
Ages 15–17 where legally activated
Guardian requirements PENDING LEGAL VALIDATION
No behavioral ads · No selling progression data
```

---

## Scope

| In scope | Out of scope (this doc) |
|----------|-------------------------|
| Progression display, standing, Titles, Prestige, leaderboards, mentoring-adjacent progression | Full legal opinion, jurisdiction matrix Product Code |
| Public Crow identity vs private PII | Adult (18+) full social policy detail |
| Advertising and data-sale prohibitions tied to progression | Non-progression product marketing systems (except the ad prohibition) |

Activation of the 15–17 band remains subject to **legal activation** per jurisdiction. Architecture assumes the band may be enabled; it does not authorize launch without legal clearance.

---

## Binding rules (15–17 where legally activated)

Exact total locked in this section: **12** rules.

### A1 — Public standing uses Crow identity

Public progression surfaces show the **Crow identity** (public handle / presentation identity), not legal name by default.

### A2 — Exact age remains private

Exact age is not shown on leaderboards, Crest showcases, Title cards, Prestige nomination UIs, or public profiles as a progression field.

### A3 — Precise location remains private

Precise location is not a progression display field and must not appear on public standings.

### A4 — Real email and phone remain private

Contact identifiers are not progression credentials and must not appear on public progression screens.

### A5 — Unrestricted adult contact is prohibited

Progression-related community, mentoring, or Prestige pathways must not enable unrestricted adult contact with 15–17 users.

### A6 — Sensitive community and Prestige — extra controls

Sensitive community actions and Prestige pathways require **additional controls** for this age band (eligibility gating, moderated pathways, restricted nomination surfaces). Exact control catalog → later legal/policy gates.

### A7 — Public leaderboards avoid personal data

Leaderboards show Crow identity and permitted standing fields only. No email, phone, exact age, precise location, or other personal data.

### A8 — Titles do not imply employment eligibility

Professional Title presentation for this age band must **not** imply employment eligibility, hiring readiness, or labor-market certification.

### A9 — Prestige and mentoring are age-sensitive

Prestige Class pathways and mentoring-adjacent progression must follow age-sensitive policy (restricted or alternative pathways as legally required).

### A10 — Guardian requirements pending legal

Guardian consent, notice, or oversight requirements remain **PENDING LEGAL VALIDATION**. Architecture reserves the capability; it does not invent a false “guardian complete” claim.

### A11 — No behaviorally targeted advertising

Progression data and progression screens must not feed behaviorally targeted advertising to this age band.

### A12 — No selling progression data

Progression ledgers, Evidence-derived Mastery, Trust, Momentum, Titles, Prestige, and leaderboard data must not be sold.

---

## Screen and standing implications

| Surface | Age-band requirement |
|---------|----------------------|
| XP / Level | Crow identity; no PII |
| Momentum League | Optional participation; no PII on boards |
| Mastery / Breadth | Capability framing; no employment implication |
| Achievements / Crests | Showcase without personal data |
| Professional Titles | No employment-eligibility implication |
| Prestige Progress | Extra controls; age-sensitive pathway |
| Leaderboards | Crow identity only; opt-out respected |
| Skyboard celebrations | No adult-contact CTAs; no ad injection |

See [PROGRESSION-SCREEN-STATE-MAP.md](../experience/PROGRESSION-SCREEN-STATE-MAP.md) minor-user variants.

---

## Relationship to fairness and integrity

* Fairness: minors are an explicit learner situation (`FRN-11`).
* Integrity: anti-gaming must not justify invasive surveillance of minors.
* Corrections/appeals: wrongful exposure or contact-policy breach is appealable.

---

## Explicit non-goals

* No claim that guardian flows are implemented
* No jurisdiction-by-jurisdiction legal memo in this file
* No Product Code
* No sale or ad-tech integration patterns

```text
ARCHITECTURE RECOMMENDED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED · Guardian requirements PENDING LEGAL
Expert review N/A for architecture
```
