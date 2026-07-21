# Launch Team / Live Sky Blueprint — Controlled Technology Service Incident and Recovery Flight

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-LIV-MSN-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT COMPLETE — TECHNICAL VALIDATION PENDING |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Experience ID** | **LIV-MSN-001** |
| **Working concept** | Controlled Technology Service Incident and Recovery Flight |
| **Category** | LIVE_SKY_MISSION · TEAM_MISSION |
| **Related** | [MISSION-CATEGORY-REGISTRY.md](../../architecture/MISSION-CATEGORY-REGISTRY.md) · [TEAM-CONTRIBUTION-EVIDENCE.md](../../evidence/TEAM-CONTRIBUTION-EVIDENCE.md) · [LAUNCH-CAPSTONE-CONCEPTS.md](../../capstones/LAUNCH-CAPSTONE-CONCEPTS.md) (CAP-SKY-001) · Route / CXW / SEX architectures |
| **Limitations** | Blueprint only — **do not implement realtime** in this Gate; no Product Codes; no XP formulas; scoring placeholder → PROGRESSION.1; not LOCKED |
| **Unresolved** | Matchmaking; facilitator staffing; PROGRESSION.1 scoring; technical validation (ARCHITECTURE.1); 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C Live Sky blueprint |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Technical validation** | **PENDING** |

```text
Experience ID: LIV-MSN-001
Working concept: Controlled Technology Service Incident and Recovery Flight
Status: BLUEPRINT COMPLETE — TECHNICAL VALIDATION PENDING
Do NOT implement realtime systems in LEARNING.1C.
No XP. No LOCKED. Defensive / lab-only incident narrative.
```

---

## Purpose

Define a facilitator-supported, time-boxed **Team / Live Sky** learning experience where coordinated roles practice a controlled technology-service incident and recovery — producing individual contribution Evidence and a team pack — without requiring every learner to have completed all Routes.

---

## Working concept

| Field | Content |
|-------|---------|
| **Name** | Controlled Technology Service Incident and Recovery Flight |
| **ID** | **LIV-MSN-001** |
| **Problem shape** | A lab service shows degraded health, a noisy alert, and an undocumented recent change. The team must stabilize, diagnose within bounds, document residual risk, and hand off — **defensive / ops-safe only**. |
| **Not** | Live attacks on real tenants · offensive exploitation · production access · full SOC or SRE employment simulation claiming titles |

---

## Roles (scenario only)

| Role | Responsibility (scenario) | Typical capability affinity (non-mandatory) |
|------|---------------------------|-----------------------------------------------|
| **Ops lead** | Coordinate stabilization, change hygiene, observability | RT-OPR-001 / SEX-aware |
| **App contributor** | Assess app/config delta; safe rollback or fix in lab | RT-BLD-001 |
| **Security analyst** | Defensive triage of seeded signals; ethics; no offensive steps | RT-PRT-001 (selected) |
| **Delivery / risk coordinator** | Time box, stakeholder note, residual-risk / go-forward decision | RT-LED-001 / SHC-010 |
| **Observer / recorder** | Timeline integrity, Evidence capture, spectator-safe notes | Nest collaboration · SHC-001/008 |

Dual-hat allowed for smaller pods (document dual-hat in formation brief). Roles are **scenario titles only** — not job offers or professional titles.

---

## Eligibility (without requiring all Routes)

| Rule | Content |
|------|---------|
| **Minimum** | Nest collaboration / safety foundations complete (or declared equivalents); Live Sky eligibility Unlock when defined (**ULK** pattern → PROGRESSION.1) |
| **Route posture** | At least **one** P0 Route **in progress or complete** preferred — **not** all Routes required |
| **CXW / SEX** | Not required for LIV-MSN-001 entry |
| **Ethics / lab brief** | Mandatory before join |
| **Final Access Decision** | Still applies; blueprint does not invent numeric thresholds |

---

## Team formation

| Field | Content |
|-------|---------|
| **Size** | Ideal 4–5 (one seat per role); minimum 3 with dual-hat rules |
| **Formation** | Facilitator assign or governed self-select within role caps |
| **Matchmaking** | Deferred — no realtime matchmaking implementation in 1C |
| **Consent** | Recording / spectator / public-result consent captured before Flight |
| **No free-riding** | Individual contribution Evidence required (see TEAM-CONTRIBUTION-EVIDENCE) |

---

## Phases (blueprint)

| Phase | Name | Intent |
|-------|------|--------|
| **P0** | Brief & safety | Roles, lab bounds, ethics, spectator rules |
| **P1** | Detect & frame | Observe seeded symptoms; form shared problem statement |
| **P2** | Stabilize | Ops-led containment within lab allowlist |
| **P3** | Diagnose & remediate | Coordinated defensive diagnosis; lab-safe fix or rollback |
| **P4** | Decide & handoff | Residual risk; stakeholder note; runbook/timeline update |
| **P5** | Reflect & Evidence | Individual reflections; team pack; integrity attestation |

Time-box is session-bounded (exact minutes → facilitation standard later).

---

## Spectator-safe information

| Allowed for spectators | Forbidden |
|------------------------|-----------|
| High-level phase status · anonymized role labels · public debrief themes after consent | Secrets · raw logs with identifiers · personal critique · exploit details · non-consented recordings · grading commentary mid-Flight |

Spectators cannot submit team Evidence or alter lab state.

---

## Evidence

| Artifact | Owner | Notes |
|----------|-------|-------|
| Shared timeline | Team (recorder primary) | Seed-bound; lab-marked |
| Role contribution notes | Each participant | Maps to TEAM-CONTRIBUTION-EVIDENCE |
| Individual reflection | Each participant | Public-portfolio suitable when sanitized |
| Integrity / attendance attestation | Each + facilitator | Presence rules |
| Team Evidence pack | Team | Peer consent for any external share |

Evidence proves **contribution + coordination**, not free-riding. Rubric detail → PROGRESSION.1 / facilitation standards.

---

## Scoring placeholder → PROGRESSION.1

```text
Scoring / Trust / Mastery / XP formulas: NOT DEFINED HERE.
Placeholder only — handoff to GHV.PROGRESSION.1.
No XP numbers in LEARNING.1C.
```

Qualitative review dimensions (non-numeric): role fulfillment · safety compliance · Evidence integrity · collaboration · residual-risk honesty.

---

## Integrity

| Control | Posture |
|---------|---------|
| Seed uniqueness | Per Flight seed ID; no instructor-key paste |
| Contribution | Individual artifacts required |
| AI disclosure | Required on prose/code assists |
| Cross-team plagiarism | Monitored in review |
| Secrets | Never in Evidence |
| Claims | Lab-only; no production heroics |

---

## Failure / reconnect

| Event | Response |
|-------|----------|
| Lab fault / tool outage | Facilitator pause; extend time box or reschedule; preserve valid notes |
| Participant disconnect | Reconnect window; dual-hat or observer cover; do not fail entire team solely for transient disconnect |
| Safety / ethics breach | Immediate stop; INTEGRITY_REVIEW path; may quarantine Flight |
| Incomplete Evidence | Remediation: revision Flight or individual make-up task — not silent pass |

---

## Moderation

Facilitator enforces lab allowlists, respectful collaboration, no harassment, no offensive instructions, spectator boundaries. Escalation to integrity / trust & safety process when needed. Moderation tooling **not implemented** in 1C.

---

## Reflection

Post-Flight structured reflection: what worked, what residual risk remains, what Nest/Route practice to reinforce. Reflection is Evidence-eligible; it is not a title award.

---

## Public result boundary

| May be public (with consent + sanitization) | Must stay private |
|---------------------------------------------|-------------------|
| Individual reflection · high-level team outcome badge/status (when productized later) | Raw logs · peer grades · unredacted timeline · facilitator notes · other learners’ PII |

---

## Accessibility (a11y)

| Requirement | Posture |
|-------------|---------|
| Participation paths | Keyboard-reachable session controls where UI exists later; captioned briefings; RTL-aware Arabic materials |
| Cognitive load | Phase checklists; plain-language prompts |
| Alternatives | Async make-up path for critical Evidence if live channel inaccessible — fairness over FOMO |
| Live UI | **Not implemented** in 1C; a11y requirements bind future technical design |

---

## Technical dependencies (non-implementation)

| Class | Examples (non-lock) | 1C rule |
|-------|---------------------|---------|
| Session | Facilitator call + shared doc | Blueprint only |
| Lab | LOCAL-SAFE / CLOUD-SANDBOX reuse from OPR/BLD | No new realtime mesh |
| Future | Presence, matchmaking, live scoreboard | **TECHNICAL VALIDATION PENDING** — do **not** implement realtime in this Gate |

---

## Launch feasibility

| Dimension | Assessment |
|-----------|------------|
| Pedagogical | High — clear roles, bounded incident, Evidence trail |
| Operational | Medium — needs facilitators and lab quotas |
| Technical (now) | Blueprint only; realtime **out of scope** for 1C |
| Safety | High if lab-only and moderation enforced |
| Catalogue | Optional launch experience — not a P0 Route substitute |

---

## Explicit non-claims

- No Product Codes · No XP · No professional titles from Live Sky alone  
- Completing LIV-MSN-001 ≠ all-Route Proven · ≠ CXW/SEX Capstone  
- Expert review **NOT RUN** · Pilot **NOT RUN**  
- Status: **BLUEPRINT COMPLETE — TECHNICAL VALIDATION PENDING**  
