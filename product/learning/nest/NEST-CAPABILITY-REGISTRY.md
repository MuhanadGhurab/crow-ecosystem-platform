# Nest Capability Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-NEST-CAP-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | Before GHV.LEARNING.1D |
| **Related** | [NEST-DEPENDENCY-MAP.md](./NEST-DEPENDENCY-MAP.md) · [NEST-TO-ROUTE-BRIDGE-MAP.md](./NEST-TO-ROUTE-BRIDGE-MAP.md) · [SHARED-CAPABILITY-REGISTRY.md](../architecture/SHARED-CAPABILITY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5 · [CONTENT-FRESHNESS-AND-LIFECYCLE.md](../content/CONTENT-FRESHNESS-AND-LIFECYCLE.md) |
| **Source research** | GHV.LEARNING.1A Nest dependency groupings (N-*) |
| **Limitations** | Capability outcomes only — Nest Mission catalogue content remains for 1C; no Product Codes; assessment item bank unresolved |
| **Unresolved** | Exact Nest Mission IDs · bilingual item bank · Micro-Mission content packs · GHV.LEARNING.1D lock |
| **Change history** | 1.0.0 (2026-07-21) — Canonical NST-CAP-* registry for GHV.LEARNING.1B |

## Purpose

Assign **canonical Nest capability IDs** (`NST-CAP-*`) for Digital Foundations, map legacy 1A research labels, and state outcomes, Evidence contribution, and freshness — without changing Nest readiness thresholds.

## Nest readiness bands (LOCKED — unchanged)

Authoritative: [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.5.

| Result | Label | Rule (unchanged) |
|--------|-------|------------------|
| ≥ 70% | Ready to Fly | May skip Nest; weaknesses → recommended reviews; **no advanced Mastery from skip alone** |
| 50%–69% | Guided Skip | May continue; **Micro-Missions** inserted; **advanced Routes keep prerequisites** |
| < 50% | Nest Recommended | Nest recommended active journey; advanced gated content unavailable until Nest done or readiness ≥ 50%; public exploration allowed |

## Freshness class (all Nest capabilities)

| Field | Value |
|-------|-------|
| **Freshness** | **Stable Foundation** |
| **Review cadence** | 18–24 months (per content lifecycle) unless urgent trigger |
| **Note** | Vendor UI click-paths stay out of Nest outcomes; Nest teaches durable digital foundations |

## Capability count

```text
Nest capability count = 13
NST-CAP-001 … NST-CAP-013
```

## Legacy 1A → 1B ID map

| 1A research label | Canonical ID | Notes |
|-------------------|--------------|-------|
| N-ACC (account / device) | **NST-CAP-001** · **NST-CAP-002** · **NST-CAP-005** | Split: devices/OS · apps/permissions · accounts/passwords |
| (MFA was inside N-PWD) | **NST-CAP-006** | Explicit MFA capability |
| N-BRW | **NST-CAP-003** | |
| N-FIL | **NST-CAP-004** | |
| N-PWD | **NST-CAP-005** (+ MFA → 006) | |
| N-NET | **NST-CAP-007** | |
| N-PRV | **NST-CAP-008** | |
| N-SCM | **NST-CAP-009** | |
| N-AIL | **NST-CAP-010** | |
| N-COL | **NST-CAP-011** | |
| N-TSH | **NST-CAP-012** | |
| N-IDN | **NST-CAP-013** | |

---

## NST-CAP-001 — Devices and operating basics

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-001 |
| **Title** | Devices and operating basics |
| **Outcomes** | Power on / update awareness; find settings; install/uninstall with care; distinguish device vs account problems; recognize basic trust cues (lock screen, updates) |
| **Evidence contribution possible** | **Yes** — short checklist or screenshot-safe reflection (no secrets); supports readiness claim, not Route Mastery |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-007 (foundation) · SHC-004 (when diagnosing device vs app) |

## NST-CAP-002 — Applications and permissions

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-002 |
| **Title** | Applications and permissions |
| **Outcomes** | Grant/revoke app permissions thoughtfully; recognize over-broad permission prompts; uninstall or restrict unused apps; separate work/personal app habits where practical |
| **Evidence contribution possible** | **Yes** — permission review exercise / decision note |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-006 · SHC-007 |

## NST-CAP-003 — Browsers and search

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-003 |
| **Title** | Browsers and search |
| **Outcomes** | Use tabs/bookmarks safely; evaluate source quality; recognize phishing UI patterns; basic search literacy; clear distinction between address bar and search ads |
| **Evidence contribution possible** | **Yes** — source-evaluation mini-task |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-010 (risk cues) · SHC-005 (verify AI/search claims) |

## NST-CAP-004 — Files and cloud

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-004 |
| **Title** | Files and cloud |
| **Outcomes** | Organize files; distinguish local vs cloud; share with least privilege; avoid accidental public exposure; recover deleted items where platform allows |
| **Evidence contribution possible** | **Yes** — sharing-permission scenario decision |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-006 · SHC-001 (light: name/files clearly) |

## NST-CAP-005 — Accounts and passwords

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-005 |
| **Title** | Accounts and passwords |
| **Outcomes** | Strong unique passwords; password-manager habit; session awareness; recover access without sharing secrets; recognize password-reset scams |
| **Evidence contribution possible** | **Yes** — habit checklist (never collect real passwords) |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-007 |

## NST-CAP-006 — MFA

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-006 |
| **Title** | Multi-factor authentication (MFA) |
| **Outcomes** | Enroll and use MFA; store recovery codes safely; recognize MFA fatigue / prompt bombing patterns; prefer app/passkey over SMS where available |
| **Evidence contribution possible** | **Yes** — enrollment simulation / recovery-plan note (no real secrets stored as Evidence) |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-007 · SHC-008 (recovery-code hygiene) |

## NST-CAP-007 — Connectivity and Wi-Fi

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-007 |
| **Title** | Connectivity and Wi-Fi |
| **Outcomes** | Distinguish Wi-Fi / mobile / VPN at user level; diagnose “no internet” vs app failure; safe public Wi-Fi habits; know when to stop and ask for help |
| **Evidence contribution possible** | **Yes** — triage decision tree exercise |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-004 |

## NST-CAP-008 — Privacy and digital footprint

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-008 |
| **Title** | Privacy and digital footprint |
| **Outcomes** | Permission hygiene; understand data-sharing prompts; minimize personal data in learning artifacts; awareness of public profile footprint |
| **Evidence contribution possible** | **Yes** — footprint review / minimization decision |
| **Freshness** | Stable Foundation |
| **Shared capability links** | **SHC-006** (authoritative Nest side) |

## NST-CAP-009 — Scams and online safety

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-009 |
| **Title** | Scams and online safety |
| **Outcomes** | Spot common scam patterns; refuse unsafe requests; report/escalate safely; **no live attack practice** |
| **Evidence contribution possible** | **Yes** — scam-pattern identification scenarios |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-010 (foundation) |

## NST-CAP-010 — AI literacy

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-010 |
| **Title** | AI literacy |
| **Outcomes** | Know when AI helps vs invents; label AI-assisted work; verify outputs; never paste secrets into tools |
| **Evidence contribution possible** | **Yes** — labeled AI-assist reflection |
| **Freshness** | Stable Foundation (tool UIs may age; outcomes stay durable) |
| **Shared capability links** | **SHC-005** |

## NST-CAP-011 — Collaboration

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-011 |
| **Title** | Collaboration |
| **Outcomes** | Use shared docs/chat responsibly; attribution; respectful disagreement; escalate blockers |
| **Evidence contribution possible** | **Yes** — collaboration scenario / attribution check |
| **Freshness** | Stable Foundation |
| **Shared capability links** | **SHC-003** · **SHC-009** |

## NST-CAP-012 — Troubleshooting

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-012 |
| **Title** | Troubleshooting |
| **Outcomes** | Structured observe → isolate → fix → document; ask useful help questions |
| **Evidence contribution possible** | **Yes** — documented troubleshooting walkthrough (synthetic problem) |
| **Freshness** | Stable Foundation |
| **Shared capability links** | **SHC-004** |

## NST-CAP-013 — Digital identity

| Field | Content |
|-------|---------|
| **Canonical ID** | NST-CAP-013 |
| **Title** | Digital identity |
| **Outcomes** | Separate personal vs professional identity; username/avatar hygiene; public profile risk awareness |
| **Evidence contribution possible** | **Yes** — identity hygiene plan (no doxxing; synthetic profiles OK) |
| **Freshness** | Stable Foundation |
| **Shared capability links** | SHC-007 |

---

## Evidence rules (Nest)

1. Nest Evidence supports **readiness** and Micro-Mission completion — **not** Route-Proven or advanced Mastery by itself.
2. Secrets, real passwords, recovery codes, and live credentials must never appear in Nest Evidence.
3. Nest skip (Ready to Fly) never grants advanced Mastery (Scope §3.5).

## Explicit non-goals

- Do not change 70 / 50 thresholds.
- Do not invent Nest Mission lesson content here (→ 1C).
- Do not invent progression formulas.
- Do not assign Product Codes.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Nest Mission / Micro-Mission blueprints per NST-CAP-* |
| GHV.LEARNING.1D | Final lock of Nest capability catalogue |
| GHV.PROGRESSION.1 | Any Mastery interaction (if any) — not invented here |
