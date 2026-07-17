# Merge Wave 1 Checklist — MGH.PORTFOLIO.REVIEW.1

**Do not execute merges from this document.** Owner approval required for every merge and every closure.

Verified SHAs: 2026-07-17

---

## POSITION 0 — Crow cleanup decisions (no code merge)

- [ ] Owner approve closure of Crow #3–#8 (superseded by #10)
- [ ] Owner decide Crow #2 (keep draft / cherry-pick later / close)
- [ ] Confirm Crow #10 remains OPEN + DRAFT + UNMERGED (`8367d95`)
- [ ] Apply public repository descriptions (see REPOSITORY-DESCRIPTIONS.md)
- [ ] Post governance comments if not already present (owner script)

---

## MERGE ITEM 1 — Portfolio OS

- Repository: `enterprise-cyber-resilience-portfolio`
- PR: [#1](https://github.com/MuhanadGhurab/enterprise-cyber-resilience-portfolio/pull/1)
- Base: `main` (`bb02ed0`)
- Head: `feat/portfolio-operating-system`
- Head SHA: `e7477b13eb7e0474ff184b1022a5aba670e82da9`
- Draft: yes → convert to ready only with owner approval
- Mergeability: clean
- CI: validate success on head
- Predecessor: Crow cleanup decisions (process)
- Owner decision: [ ]
- Final pre-merge command (do not run until approved):
  `gh pr ready 1 --repo MuhanadGhurab/enterprise-cyber-resilience-portfolio && gh pr merge 1 --repo MuhanadGhurab/enterprise-cyber-resilience-portfolio --merge`
- Post-merge validation: re-run validate workflow on main; confirm career gate CLOSED
- Rollback: `git revert` merge commit on main
- Description update: apply proposed portfolio description
- Profile dependency: profile waits until end

---

## MERGE ITEM 2 — GRC

- Repository: `enterprise-cyber-risk-governance`
- PR: [#1](https://github.com/MuhanadGhurab/enterprise-cyber-risk-governance/pull/1)
- Head SHA: `42705cf466819bebdd1534499da4e041655cc8c3`
- Branch: `feat/risk-governance-foundation`
- Draft: yes; mergeable clean; CI green
- Predecessor: Portfolio OS #1 merged
- Owner decision: [ ]
- Pre-merge: `gh pr merge 1 --repo MuhanadGhurab/enterprise-cyber-risk-governance --merge`
- Post-merge: risk validation on main
- Rollback: revert merge
- Description: replace commit-style description

---

## MERGE ITEM 3 — Delivery

- Repository: `secure-project-delivery-office`
- PR: [#1](https://github.com/MuhanadGhurab/secure-project-delivery-office/pull/1)
- Head SHA: `05dc67a9e2f26a5fffa7cd40992b67d5f1b3450d`
- Branch: `feat/secure-delivery-office`
- Predecessor: GRC #1
- Owner decision: [ ]
- Pre-merge: `gh pr merge 1 --repo MuhanadGhurab/secure-project-delivery-office --merge`

---

## MERGE ITEM 4 — Lab

- Repository: `enterprise-cybersecurity-lab`
- PR: [#1](https://github.com/MuhanadGhurab/enterprise-cybersecurity-lab/pull/1)
- Head SHA: `73bc7667d8ebe01c0a0a8e70759b9b9191fbf119`
- Branch: `feat/itops-defense-1`
- Predecessor: Delivery #1
- Owner decision: [ ]

---

## MERGE ITEM 5 — Mini Projects

- Repository: `mini-it-cyber-projects`
- PR: [#1](https://github.com/MuhanadGhurab/mini-it-cyber-projects/pull/1)
- Head SHA: `4b7ab28be7b39f6c09ede51e6efb9832ae5e130d`
- Branch: `feat/engineering-automation-1`
- Predecessor: Lab #1
- Owner decision: [ ]

---

## MERGE ITEM 6 — SecureSkies

- Repository: `secureskies-drone-security`
- PR: [#1](https://github.com/MuhanadGhurab/secureskies-drone-security/pull/1)
- Head SHA: `9cb424a12ee143d265557e1643418d97a1513fec`
- Branch: `feat/emerging-1`
- Predecessor: Mini #1
- Owner decision: [ ]

---

## MERGE ITEM 7 — Crow Secure SDLC docs

- Repository: `crow-ecosystem-platform`
- PR: [#11](https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/11)
- Head SHA: `09fd2573e17bcaf6cf2fbb5e691d907181f045d0`
- Branch: `feat/secure-sdlc-evidence-1`
- Predecessor: SecureSkies #1
- **Do not merge Crow #10**
- Owner decision: [ ]

---

## POSITION 9 — Description verification

- [ ] All eight public portfolio repos show purpose-style descriptions
- [ ] No commit-message descriptions remain

---

## MERGE ITEM 8 / POSITION 10 — Profile (LAST)

- Repository: `MuhanadGhurab/MuhanadGhurab`
- PR: [#1](https://github.com/MuhanadGhurab/MuhanadGhurab/pull/1)
- Head SHA: `9dbb90c487f1e4a498cccf064b7d5fb5282bebf5`
- Branch: `feat/profile-program-map`
- Predecessor: Crow #11 + description verification
- Owner decision: [ ]
- Post-merge: click all profile links; confirm no draft work presented as complete

---

## Explicit non-authorization

This checklist does **not** authorize merge, closure, deploy, migration, résumé update, LinkedIn update, or E5 approval.
