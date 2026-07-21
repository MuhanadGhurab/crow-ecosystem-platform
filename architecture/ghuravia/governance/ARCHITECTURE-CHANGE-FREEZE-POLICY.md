# Architecture Change Freeze Policy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-FRZ-001 |
| **Version** | 1.0.0 |
| **Status** | **LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |
| **Related** | [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](./GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md) · [FINAL-ADR-REGISTRY.md](./FINAL-ADR-REGISTRY.md) |

```text
LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE
No silent modification after 1E
Revisions require Change Request + new document version + register updates
```

## Purpose

Define what is frozen after successful GHV.ARCHITECTURE.1E and which change classes apply to the Architecture Design Baseline.

---

## Frozen after 1E (Foundational decisions)

* GHURAVIA Architecture Design Baseline v1.0.0 status and manifest
* ADR-ARC-001…038 accepted statuses (including DEFERRED WITH ADAPTER LOCKED vocabulary)
* Locked separations:
  * Auth ≠ Activation ≠ Authorization ≠ Entitlement ≠ Progression
  * Crow ≠ Private Legal Identity
  * Evidence Object ↛ Progression Ledger
  * Commercial ↛ Progression
  * Notification fail ↛ Business state
  * Spectator ↛ Participant mutation
  * Trust non-public non-numeric
  * Scanning fail-closed
  * Deny by default
* 7 shells / 92 ACTIVE screens / 0 aliases / ACT-004 NO / ACT-013 YES
* Technical spike programme verdicts (25/25 complete)
* Platform shape: modular monolith with explicit domain packages
* Progression event ledger + formula-version preservation pattern
* Evidence quarantine → scan fail-closed → release pattern
* Server-authoritative activation including ACT-013
* Learning and Progression **design baseline content** (architecture must not silently rewrite formulas or screen inventory)

---

## Allowed without Material Change Request (Editorial)

* Typographical correction
* Clearer wording without architectural meaning change
* Reference / link updates
* Arabic terminology correction in governance docs
* Traceability table refresh when upstream IDs unchanged
* Condition disposition updates **with evidence** (does not change frozen ADR decision)

---

## Requires Controlled Change Request

* ADR option change or status downgrade
* New ADR that contradicts an active ADR
* Provider deferral lifted → specific vendor **accepted** (requires evidence)
* Cache boundary relaxation toward shared mutable cache as source of truth
* Fail-open scanning or optional scanner bypass
* Client-authoritative activation or entitlement
* Commercial event writing progression meters
* Public numeric Trust score
* Spectator channel gaining participant write path
* Shell count or governed screen count change
* Reintroducing ACT-004 as ACTIVE inventory row
* Removing ACT-013 from activation path
* Closing WITH VALIDATION CONDITIONS without evidence
* Spike verdict revision (FAIL / INCONCLUSIVE / downgrade PASS)

Controlled CR must: create a new document version; preserve prior baseline history; update Decision Register; update Baseline Manifest; update affected ADR and spike records; re-run reconciliation artefacts.

---

## Requires Foundational Rebaseline

* Monolith → distributed microservices as default shape
* Progression ledger replaced by destructive overwrite model
* Evidence objects directly embedded in progression ledger
* Payment / entitlement coupling to XP/Mastery/Trust
* Removal of formula-version historical reproduction requirement
* Universal public leaderboard without population threshold
* Trust score publicization
* Scanning fail-open as default
* Deny-by-default authorization replaced with allow-by-default
* Full screen inventory rebaseline (≠ editorial CR-002 class correction)

Foundational rebaseline requires new Gate programme segment and explicit Founder approval.

---

## Explicit non-claims

Freeze does **not** mean:

```text
Product Code authorized
Implementation granted
Providers selected
External validation complete
Production ready
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E — architecture change freeze policy |
