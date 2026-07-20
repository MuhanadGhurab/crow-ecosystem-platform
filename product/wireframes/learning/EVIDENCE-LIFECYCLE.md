# Evidence Lifecycle — Wireframe Spec

| Field | Value |
|-------|-------|
| **Document ID** | GHV-WF-LRN-EVIDENCE |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Screens** | LRN-003 · LRN-004 · LRN-005 (and Log surfaces) |
| **Related** | [LEARNING-WIREFRAMES.md](./LEARNING-WIREFRAMES.md) · [CRITICAL-FLOWS.md](../../interactions/CRITICAL-FLOWS.md) FLOW-002/008 · [SAVE-SYNC-OFFLINE-INTERACTION.md](../../interactions/SAVE-SYNC-OFFLINE-INTERACTION.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Change history** | 1.0.0 — PD.3 |

---

## Purpose

Lock the Evidence journey from draft through review outcomes, including revision and revocation, with explicit **public vs private** Evidence clarity. Evidence precedes Mastery (product constitution).

---

## Lifecycle (authoritative)

```text
Draft ──► Submit ──► Auto review and/or Human review
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
        Approved     Revision      Rejected
            │         Required         │
            │            │             │
            │            ▼             │
            │     Edit draft ──► Resubmit
            │
            └──► (later) Revocation (trust/integrity/admin)
```

| Phase | Screen | Learner action |
|-------|--------|----------------|
| Draft | LRN-003 | Create / edit artifact; autosave |
| Submit | LRN-004 | Confirm visibility + integrity; Submit |
| In review | LRN-005 | View status; wait; no silent discard |
| Revision required | LRN-005 → LRN-003 | Read feedback; edit; resubmit via LRN-004 |
| Approved | LRN-005 → Mastery / LRN-010 path | Continue |
| Rejected | LRN-005 | Understand reason; optional appeal path if policy allows |
| Revoked | LRN-005 / Log | Clear notice; Mastery impact explained |

Submit requires confirmed server sync (Sync spec). Safe Exit from Capture saves draft; does not submit.

---

## Public vs private Evidence (clarity contract)

Every Capture and Submit surface must show an unambiguous visibility control and consequence copy.

```text
┌────────────────────────────────────────────────────────────┐
│ Evidence visibility                                        │
│ ( ) Private — only you, reviewers, and authorized staff    │
│ ( ) Public — eligible for Showcase / community surfaces    │
│                                                            │
│ Public does NOT mean indexed outside GHURAVIA policies.    │
│ Private Evidence never appears in Rookery feeds.           │
│ Reviewers may see either for assessment integrity.         │
└────────────────────────────────────────────────────────────┘
```

| Visibility | Who can see (launch direction) | UI badge |
|------------|--------------------------------|----------|
| **Private** | Learner · assigned reviewers · authorized ops | `Private` |
| **Public** | Per Showcase / community eligibility + trust | `Public` |

Rules:

1. Default for first Evidence: **Private** unless Mission explicitly requires public showcase.
2. Changing Private → Public after approval may require re-confirm; Public → Private respects published copies policy (show consequence).
3. Status screens and Log entries always show the badge; never imply Mastery from XP alone.

---

## LRN-003 — Evidence Capture (GHV-WF-LRN-003)

```text
┌──────────────────────────────────────────────────────────────────┐
│ Evidence Capture · linked Mission/Stage          [Save: Saved]   │
├──────────────────────────────────────────────────────────────────┤
│ Title                                                            │
│ Artifact area: upload · paste · structured fields · workspace    │
│ Notes / reflection                                               │
│ Visibility: Private | Public   ← required choice before Submit   │
│ Integrity checklist (honest work, no prohibited paste)           │
├──────────────────────────────────────────────────────────────────┤
│ [Safe Exit]                              [Continue to Submit →]  │
└──────────────────────────────────────────────────────────────────┘
```

States: empty draft guidance · saving · offline draft · validation errors · linked Mission missing (recover).

---

## LRN-004 — Evidence Submit (GHV-WF-LRN-004)

```text
┌──────────────────────────────────────────────────────────────────┐
│ Submit Evidence                                                  │
├──────────────────────────────────────────────────────────────────┤
│ Summary of artifact · Mission link                               │
│ Visibility confirmation: Private / Public (read-only here or edit)│
│ Review path: Auto · Human · Auto then Human (system-determined)  │
│ Sync status: must be Saved/Synced before Submit enabled          │
├──────────────────────────────────────────────────────────────────┤
│ [Back to edit]                                    [Submit]       │
└──────────────────────────────────────────────────────────────────┘
```

On Submit success → LRN-005. On fail → retain draft; show retry.

---

## LRN-005 — Evidence Status (GHV-WF-LRN-005)

```text
┌──────────────────────────────────────────────────────────────────┐
│ Evidence Status · [Private|Public]                               │
├──────────────────────────────────────────────────────────────────┤
│ Timeline:                                                        │
│  ● Draft created                                                 │
│  ● Submitted                                                     │
│  ● Auto review (pass / flag / skip)                              │
│  ○ Human review (queued / in progress / done)                    │
│  ○ Outcome                                                       │
│                                                                  │
│ Outcome panel (one of):                                          │
│  APPROVED | REVISION REQUIRED | REJECTED | REVOKED               │
│ Feedback (human or system) — actionable, non-shaming             │
├──────────────────────────────────────────────────────────────────┤
│ [Open in Log]  [Edit & resubmit]  [Continue Flight / Skyboard]   │
└──────────────────────────────────────────────────────────────────┘
```

### Outcome actions

| Outcome | Primary | Secondary |
|---------|---------|-----------|
| Approved | Continue (Mastery / Wings / next Mission) | View in Log |
| Revision required | Edit Evidence (LRN-003) | Ask for clarification (if allowed) |
| Rejected | Understand / retry new draft if allowed | Appeal (TRU-006) if eligible |
| Revoked | Read reason + Mastery impact | Support / appeal if eligible |

---

## Revision loop (FLOW-008)

```text
LRN-005 (Revision Required)
    → LRN-003 (prefilled draft + feedback callouts)
    → LRN-004 (resubmit)
    → LRN-005 (new review cycle)
```

Prior submission remains in history; new version labeled. No subscription interrupt in this loop.

---

## Revocation

Triggered by integrity, trust, or admin content lifecycle — not by learner whim after Mastery grant without process.

```text
┌────────────────────────────────────────────┐
│ Evidence revoked                           │
│ Reason (category + summary)                │
│ Effect on Mastery / Wings display          │
│ [View policy]  [Appeal if allowed]         │
└────────────────────────────────────────────┘
```

---

## Log relationship

Flight Log (Log nav / Skyboard Log module) lists Evidence history with status + visibility badge. LRN-005 is the detail status surface; Log is the index.

---

## Acceptance (wireframe)

- [ ] Full Draft→…→Revocation path shown
- [ ] Public vs Private always labeled on Capture, Submit, Status
- [ ] Submit gated on sync
- [ ] Revision loop screens mapped
- [ ] No paywall in Evidence lifecycle screens
