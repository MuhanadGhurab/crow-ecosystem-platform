# Form Interaction Rules

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IX-FORM-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AT LOW FIDELITY |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Last updated** | 2026-07-21 |
| **Related** | [INTERACTION-GRAMMAR.md](./INTERACTION-GRAMMAR.md) · [LOCALIZATION-RTL-SPEC.md](../screens/LOCALIZATION-RTL-SPEC.md) |
| **Scope** | CONTROLLED LAUNCH |
| **Unresolved** | Provider OTP UX details — PENDING TECHNICAL VALIDATION |
| **Change history** | 1.0.0 — PD.3 |

## Rules

| Topic | Rule |
|-------|------|
| Labels | Visible text labels always; placeholder is never the only label |
| Required / optional | Mark required; optional explicitly labeled |
| Inline validation | On blur / after attempt; do not yell on first keystroke |
| Server validation | Map to fields; show error summary at top for multi-field |
| Preserve data | Keep entered values on soft errors |
| Focus | Move focus to first error; announce for AT |
| Passwords / passkeys | Prefer passkey; password rules disclosed before submit |
| Verification codes | Numeric OTP; paste allowed; expiry stated |
| File uploads | Progress, cancel, type/size limits, malware-scan pending status |
| Multi-step | Step indicator; back preserves data |
| Autosave | Drafts for long forms (Evidence, posts) per Sync spec |
| Sensitive submit | Review step before delete / payment / recovery |
| Arabic / English | Labels follow UI dir; user input dir may be auto |
| Mixed technical text | Code, IPs, commands, paths stay LTR islands inside RTL UI |
