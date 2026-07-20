# Interaction Grammar

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IX-GRAMMAR-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [PAGE-COMPOSITION-SYSTEM.md](./PAGE-COMPOSITION-SYSTEM.md) · [EXPLAINABLE-LOCKS.md](./EXPLAINABLE-LOCKS.md) · [PRODUCT-CONSTITUTION.md](../../governance/constitution/PRODUCT-CONSTITUTION.md) |
| **Scope** | CORE FOUNDATION + CONTROLLED LAUNCH |
| **Unresolved** | Visual tokens, final component library — deferred to design implementation Gates |
| **Change history** | 1.0.0 — initial lock at PD.3 |

## Purpose

Defines reusable interaction patterns for GHURAVIA. Product Code must not invent competing patterns.

---

## 9.1 Primary Action

- Exactly **one** dominant action per screen (or per focused step in a multi-step shell).
- Visually and semantically clear; consistent placement within the shell (typically end of primary canvas or sticky footer on mobile).
- Must not be destructive without confirmation (see Destructive Action).
- Label states the outcome (“Continue”, “Submit Evidence”, “Join Event”) — not vague (“OK”, “Next” alone when consequence is high).

## 9.2 Secondary Action

- Supports without competing with the primary action.
- Visually quieter (text button, outline, or link).
- Reasonable maximum: **2–3** secondary actions in the primary zone; additional actions move to tertiary menus.

## 9.3 Tertiary and Contextual Actions

- Exposed via overflow menus, contextual sheets, or drawers.
- Do not permanently expose every capability on the Skyboard or World Map.
- Progressive Disclosure applies (Constitution Principle 2).

## 9.4 Destructive Action

Requires:

1. Clear consequence statement.
2. Explicit confirmation (modal or dedicated step).
3. Step-up / reauthentication when sensitive (security, deletion, payment method removal).
4. Visible cancellation path.
5. Audit logging where required (admin, Evidence revocation, account deletion).

## 9.5 Back and Exit

- **Back** returns to the previous meaningful context (not an empty stack).
- **Exit from Mission**: preserve draft/progress; show save status; distinguish **Save and Exit** from **Submit**.
- Interrupted onboarding resumes at last incomplete step (registry rule).

## 9.6 Modal Use

**Allowed:** focused confirmation; small blocking decisions; security-sensitive reauthentication.

**Prohibited as sole container:** long learning content; complex plan comparison; large multi-step forms; full account recovery.

## 9.7 Drawer / Contextual Sheet

Used for: supplemental information; mobile controls; Route details; filters; RAVEN explanation; access-requirement explanations ([EXPLAINABLE-LOCKS.md](./EXPLAINABLE-LOCKS.md)).

## 9.8 Inline Expansion

Used when preserving context matters: Skyboard cards; World Map node details; Evidence feedback; plan entitlement explanation.

## 9.9 Toast / Temporary Message

Transient confirmations only.

**Must not be the only evidence of:** payment result; Evidence submission; security change; account recovery; deletion request. Those require persistent status screens or banners.

## 9.10 Persistent Status Banner

Used for: Grace Period; account restriction; degraded service; offline state; pending Evidence action; required Terms acceptance.

Banner remains until resolved or dismissed under policy (Grace / restriction may be non-dismissible).

---

## Cross-cutting rules

| Rule | Behavior |
|------|----------|
| Payment ≠ Skill | Upgrade CTAs never claim Mastery, Rank, or Prestige purchase |
| Merit visibility | Where entitlement is missing, Merit alternative is visible when eligible |
| Explainable Locks | Locked UI shows reason type + path ([EXPLAINABLE-LOCKS.md](./EXPLAINABLE-LOCKS.md)) |
| No fake urgency | No artificial countdowns on plans |
| Learning priority | Subscription prompts do not interrupt active Mission canvas |
| Unrestricted DMs | **OUT OF SCOPE** — no DM entry points |
