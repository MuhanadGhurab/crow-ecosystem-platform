# Page Composition System

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IX-COMP-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [INTERACTION-GRAMMAR.md](./INTERACTION-GRAMMAR.md) · [MASTER-SCREEN-REGISTRY.md](../screens/MASTER-SCREEN-REGISTRY.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Exact spacing tokens — implementation Gate |
| **Change history** | 1.0.0 — PD.3 |

Experience shells map to registry shells: Public · Activation · Onboarding · Core · Commercial · Trust · Admin · Live (Live Sky Shell).

---

## Public World Shell

```text
┌────────────────────────────────────────────┐
│ Global Header (brand, lang, Sign In/Create)│
├────────────────────────────────────────────┤
│ Hero / Primary Context                     │
│ Living World Signal                        │
│ Primary Value                              │
│ [Primary CTA]                              │
├────────────────────────────────────────────┤
│ Secondary Exploration                      │
│ Trust and Access Explanation               │
├────────────────────────────────────────────┤
│ Footer (legal, plans, safety)              │
└────────────────────────────────────────────┘
```

## Activation Shell

```text
┌────────────────────────────────────────────┐
│ Minimal Header                             │
│ Security Context                           │
│ Current Step                               │
├────────────────────────────────────────────┤
│ Primary Form or Decision                   │
│ Help and Recovery                          │
├────────────────────────────────────────────┤
│ Legal Footer                               │
└────────────────────────────────────────────┘
```

## Guided Onboarding Shell

```text
┌────────────────────────────────────────────┐
│ Step Indicator                             │
│ Context Title                              │
├──────────────────────┬─────────────────────┤
│ Primary Decision     │ Preview / Explain   │
│                      │ RAVEN Guidance      │
├──────────────────────┴─────────────────────┤
│ [Back]  [Save]              [Continue]     │
└────────────────────────────────────────────┘
```

Mobile: stack decision → preview → RAVEN → sticky Continue.

## Adaptive World Shell

**Desktop**

```text
┌──────┬─────────────────────────────────────┐
│ Rail │ Context Header                      │
│ Nav  ├──────────────────┬──────────────────┤
│      │ Primary Canvas   │ Optional Context │
│      │                  │ Panel / RAVEN    │
│      ├──────────────────┴──────────────────┤
│      │ Global Save / Sync Status           │
└──────┴─────────────────────────────────────┘
```

**Mobile**

```text
┌────────────────────────────────────────────┐
│ Compact Header + Sync chip                 │
├────────────────────────────────────────────┤
│ Primary Canvas                             │
│ Contextual Sheet (as needed)               │
│ Persistent Resume Action                   │
├────────────────────────────────────────────┤
│ Bottom Nav: Flight World Live Rookery Log  │
│             Wingprint                      │
└────────────────────────────────────────────┘
```

## Mission Focus Shell

```text
┌────────────────────────────────────────────┐
│ Mission Header · Progress · Save State     │
├────────────────────────────────────────────┤
│ Learning Canvas                            │
│ Resources / Notes (collapsible)            │
├────────────────────────────────────────────┤
│ [Safe Exit]              [Continue/Submit] │
└────────────────────────────────────────────┘
```

## Live Sky Shell

```text
┌────────────────────────────────────────────┐
│ Event Status · Time · Connection           │
├────────────────────────────────────────────┤
│ Primary Event Canvas                       │
├──────────────────────┬─────────────────────┤
│ Participants/Teams   │ Activity/Standings  │
│ (role-scoped)        │ Report / Support    │
└──────────────────────┴─────────────────────┘
```

Participant vs spectator: separate information regions (see Live wireframes).

## Administration Shell

```text
┌────────────────────────────────────────────┐
│ Environment + Role Banner                  │
├──────┬─────────────────────────────────────┤
│ Ops  │ Queue / Control Canvas              │
│ Nav  │ Audit Context                       │
│      │ Sensitive Action Controls           │
└──────┴─────────────────────────────────────┘
```
