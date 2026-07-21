# Technical Spike Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-VAL-SPK-REG-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · PLANNED · NOT RUN** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §42 |
| **Last updated** | 2026-07-21 |
| **Standard** | [TECHNICAL-SPIKE-STANDARD.md](./TECHNICAL-SPIKE-STANDARD.md) |
| **Priority matrix** | [TECHNICAL-SPIKE-PRIORITY-MATRIX.md](./TECHNICAL-SPIKE-PRIORITY-MATRIX.md) |

```text
Technical Spikes registered: 25 (SPK-ARC-001…025)
Technical Spikes Run: 0
Status (all): PLANNED · NOT RUN
Code permission (1A): DENIED
Database permission: DENIED
Deployment permission: DENIED
Product Code: BLOCKED
```

## Preliminary priority counts

| Priority | Meaning | Count | IDs |
|----------|---------|------:|-----|
| **P0** | REQUIRED BEFORE STACK LOCK | **6** | SPK-ARC-001, SPK-ARC-003, SPK-ARC-005, SPK-ARC-010, SPK-ARC-011, SPK-ARC-021 |
| **P1** | REQUIRED BEFORE IMPLEMENTATION | **8** | SPK-ARC-002, SPK-ARC-004, SPK-ARC-006, SPK-ARC-007, SPK-ARC-009, SPK-ARC-012, SPK-ARC-013, SPK-ARC-019 |
| **P2** | REQUIRED BEFORE CONTROLLED LAUNCH | **8** | SPK-ARC-008, SPK-ARC-014, SPK-ARC-016, SPK-ARC-017, SPK-ARC-020, SPK-ARC-022, SPK-ARC-024, SPK-ARC-025 |
| **P3** | POST-LAUNCH OR CONDITIONAL | **3** | SPK-ARC-015, SPK-ARC-018, SPK-ARC-023 |
| **Total** | | **25** | SPK-ARC-001…025 |

## Registry

### SPK-ARC-001 — Repository and framework compatibility

| Field | Value |
|-------|-------|
| **Architecture question** | Can a governed GHURAVIA app shell coexist with inherited repo tooling without auto-adopting CyberCrow stack? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P0** |
| **Blocking Gate** | GHV.ARCHITECTURE.1B |
| **Risk** | RISK-ARC-002 |
| **Dependency** | None (foundational) |
| **Required evidence** | Compatibility matrix + reject/inherit table |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Inherited tooling inventoried; GHURAVIA candidates scored without silent ACCEPTED ADRs; incompatibilities documented. |
| **Fail criteria** | Any CyberCrow path treated as approved stack without evidence; Product Code introduced. |

### SPK-ARC-002 — Arabic RTL plus LTR technical islands

| Field | Value |
|-------|-------|
| **Architecture question** | Can Arabic-first shells host LTR code/labs without layout or a11y breakage? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1C/1E |
| **Risk** | RISK-ARC-017 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | RTL/LTR island checklist PASS |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Critical shells render RTL correctly; LTR islands contained; no mirrored controls that break meaning. |
| **Fail criteria** | Unusable Arabic primary path; LTR bleed into Arabic chrome. |

### SPK-ARC-003 — Authentication and activation-state authority

| Field | Value |
|-------|-------|
| **Architecture question** | Is activation state server-authoritative across ACT-003/011/012/013/005/006 without client spoofing? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P0** |
| **Blocking Gate** | GHV.ARCHITECTURE.1C |
| **Risk** | RISK-ARC-001 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | State machine evidence + spoof attempts fail |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Server rejects forged activation; ACT-004 excluded from 92; ACT-013 risk accept enforced. |
| **Fail criteria** | Client-only activation; alias inflation; risk accept bypassed. |

### SPK-ARC-004 — 92-screen routing and shell composition feasibility

| Field | Value |
|-------|-------|
| **Architecture question** | Can 92 ACTIVE screens compose through 7 shells without routing sprawl or alias inflation? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1B/1E |
| **Risk** | RISK-ARC-032 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Route map = 92 ACTIVE; ACT-004 excluded |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | All 92 ACTIVE IDs route via 7 shells; 0 aliases counted; no duplicate email screens. |
| **Fail criteria** | Missing/extra screens; ACT-004 counted; shell count ≠7. |

### SPK-ARC-005 — Learning Graph representation and acyclicity

| Field | Value |
|-------|-------|
| **Architecture question** | Can Learning Graph semantics be represented without assuming a graph DB by name, while preserving acyclicity checks? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P0** |
| **Blocking Gate** | GHV.ARCHITECTURE.1B/1C |
| **Risk** | RISK-ARC-004 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Acyclicity proofs + query scenarios |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Graph semantics validated on relational/typed model; acyclicity checks work; no DB-by-name assumption. |
| **Fail criteria** | Requires unnamed graph vendor as sole option without comparison; cycles undetected. |

### SPK-ARC-006 — Mission save and resume

| Field | Value |
|-------|-------|
| **Architecture question** | Can Mission progress save/resume with conflict-safe sync under QAS-001? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-019 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Save/resume scenarios PASS |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Resume restores authoritative Mission state after interrupt; conflicts resolved per policy. |
| **Fail criteria** | Silent data loss; divergent client/server progress. |

### SPK-ARC-007 — Evidence resumable upload and object-storage isolation

| Field | Value |
|-------|-------|
| **Architecture question** | Can Evidence objects upload resumably with isolation from public assets? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1C/1E |
| **Risk** | RISK-ARC-008 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Isolation + resume evidence |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Resumable upload works; Evidence objects isolated from public CDN; access signed/short-lived. |
| **Fail criteria** | Public URL exposure; non-resumable only path for large Evidence. |

### SPK-ARC-008 — Malware and secret-scanning pipeline

| Field | Value |
|-------|-------|
| **Architecture question** | Can upload scanning block malware/secrets before Evidence acceptance? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1C/1E |
| **Risk** | RISK-ARC-009 |
| **Dependency** | SPK-ARC-007 |
| **Required evidence** | Known-bad fixtures blocked |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Malware and secret fixtures blocked before acceptance; quarantine path exists. |
| **Fail criteria** | Known-bad accepted; scanner optional in happy path. |

### SPK-ARC-009 — Evidence approval to targeted progression recalculation

| Field | Value |
|-------|-------|
| **Architecture question** | Does Evidence approval trigger targeted recalculation without global destructive recompute? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-006 |
| **Dependency** | SPK-ARC-010,011 |
| **Required evidence** | Targeted cascade only |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Approval triggers targeted recalculation only; unrelated ledgers untouched. |
| **Fail criteria** | Global destructive recompute; entitlement write into progression. |

### SPK-ARC-010 — Progression event idempotency and reversal

| Field | Value |
|-------|-------|
| **Architecture question** | Do duplicate keys and reversals preserve ledger integrity (QAS-004)? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P0** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-005 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Idempotent apply + reversible path |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Duplicate event keys do not double-apply; reversal restores prior standing with audit. |
| **Fail criteria** | Double XP/standing; irreversible silent edits. |

### SPK-ARC-011 — Formula-version historical reproduction

| Field | Value |
|-------|-------|
| **Architecture question** | Can historical standings reproduce under original formula versions (QAS-013)? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P0** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-007 |
| **Dependency** | SPK-ARC-010 |
| **Required evidence** | Versioned replay matches |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Replay under stored formula version matches historical standing. |
| **Fail criteria** | Silent parameter drift changes history. |

### SPK-ARC-012 — Commercial webhook idempotency and entitlement reconciliation

| Field | Value |
|-------|-------|
| **Architecture question** | Do payment webhooks reconcile entitlements without coupling to progression meters? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-020 |
| **Dependency** | SPK-ARC-010 |
| **Required evidence** | Entitlement≠progression evidence |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Webhook retries idempotent; entitlement updates isolated from Flight XP/Mastery. |
| **Fail criteria** | Pay-to-win coupling; duplicate entitlement grants. |

### SPK-ARC-013 — Community moderation and Trust-state separation

| Field | Value |
|-------|-------|
| **Architecture question** | Can moderation actions update Trust without leaking non-public Trust as a public score? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1C/1E |
| **Risk** | RISK-ARC-021 |
| **Dependency** | SPK-ARC-003 |
| **Required evidence** | Trust privacy invariants hold |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Moderation updates Trust privately; no public numeric Trust score leak. |
| **Fail criteria** | Trust score publicized; moderation writes progression meters. |

### SPK-ARC-014 — Live Sky participant and spectator channels

| Field | Value |
|-------|-------|
| **Architecture question** | Can participant vs spectator channels separate without early service sprawl? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-013 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Channel separation scenarios |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Participant and spectator channels separated; caps enforceable. |
| **Fail criteria** | Spectator path can emit participant contributions. |

### SPK-ARC-015 — Live Sky reconnect and duplicate-contribution prevention

| Field | Value |
|-------|-------|
| **Architecture question** | Does reconnect avoid duplicate Live contributions (QAS-008)? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P3** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-014 |
| **Dependency** | SPK-ARC-014 |
| **Required evidence** | No duplicate contribution |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Reconnect does not duplicate contributions; session fencing works. |
| **Fail criteria** | Duplicate Live XP/contributions on reconnect. |

### SPK-ARC-016 — Arabic search and mixed-language discovery

| Field | Value |
|-------|-------|
| **Architecture question** | Can Arabic + mixed-language discovery meet launch needs without false confidence? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-016 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Search quality pack |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Arabic/mixed queries return usable launch results on test corpus. |
| **Fail criteria** | Arabic queries systematically empty/wrong with no mitigation plan. |

### SPK-ARC-017 — Accessibility and reduced-motion shell behavior

| Field | Value |
|-------|-------|
| **Architecture question** | Do shells honour reduced-motion and a11y without breaking Labs (QAS-011)? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1E |
| **Risk** | RISK-ARC-018 |
| **Dependency** | SPK-ARC-002,004 |
| **Required evidence** | A11y checklist PASS |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Reduced-motion and a11y checks pass on shell samples; Labs remain usable. |
| **Fail criteria** | Motion-required traps; inaccessible critical path. |

### SPK-ARC-018 — Notification failure isolation

| Field | Value |
|-------|-------|
| **Architecture question** | Does notification failure isolate without blocking Mission/Progression cores (QAS-018)? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P3** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-011 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Core path survives outage |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Notification outage does not block Mission complete or activation. |
| **Fail criteria** | Core journeys fail when notifier down. |

### SPK-ARC-019 — Audit and privileged correction

| Field | Value |
|-------|-------|
| **Architecture question** | Are privileged corrections fully audited and reversible under governance? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P1** |
| **Blocking Gate** | GHV.ARCHITECTURE.1C/1E |
| **Risk** | RISK-ARC-022 |
| **Dependency** | SPK-ARC-010 |
| **Required evidence** | Audit trail complete |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Privileged correction requires authz + audit + explainability fields. |
| **Fail criteria** | Unaudited admin edits; silent standing changes. |

### SPK-ARC-020 — Backup and targeted restore

| Field | Value |
|-------|-------|
| **Architecture question** | Can backup/restore recover critical domains without silent formula rewrite? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-025 |
| **Dependency** | SPK-ARC-011,021 |
| **Required evidence** | Restore drill evidence |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Targeted restore recovers Evidence/Progression samples without formula rewrite. |
| **Fail criteria** | Restore rewrites formula versions; incomplete critical restore. |

### SPK-ARC-021 — Deployment-environment isolation

| Field | Value |
|-------|-------|
| **Architecture question** | Are Preview/Production secrets and DB URLs isolated (TECH-018 related)? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P0** |
| **Blocking Gate** | GHV.ARCHITECTURE.1B/1D |
| **Risk** | RISK-ARC-029 |
| **Dependency** | SPK-ARC-001 |
| **Required evidence** | Isolation checklist PASS |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Preview cannot use Production DB URLs; branch deploy guard respected. |
| **Fail criteria** | Shared Production credentials on Preview; accidental deploy. |

### SPK-ARC-022 — Observability and privacy-safe diagnostics

| Field | Value |
|-------|-------|
| **Architecture question** | Can diagnostics observe without leaking PII/Trust internals? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1D/1E |
| **Risk** | RISK-ARC-027 |
| **Dependency** | SPK-ARC-021 |
| **Required evidence** | Privacy-safe telemetry pack |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Logs/metrics exclude raw PII and Trust internals by default. |
| **Fail criteria** | PII in default traces; Trust internals in client telemetry. |

### SPK-ARC-023 — Performance of Adaptive Skyboard composition

| Field | Value |
|-------|-------|
| **Architecture question** | Does Skyboard composition meet latency scenarios under load? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P3** |
| **Blocking Gate** | GHV.ARCHITECTURE.1E / post |
| **Risk** | RISK-ARC-033 |
| **Dependency** | SPK-ARC-004 |
| **Required evidence** | Perf budget evidence |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Composition latency within declared budget on fixture load. |
| **Fail criteria** | Budget unknown and exceeded with no mitigation. |

### SPK-ARC-024 — Leaderboard population and privacy enforcement

| Field | Value |
|-------|-------|
| **Architecture question** | Do population thresholds and privacy rules hide unsafe boards? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1E |
| **Risk** | RISK-ARC-021 |
| **Dependency** | SPK-ARC-013 |
| **Required evidence** | POL-POP enforcement evidence |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Below-threshold boards hidden; privacy rules enforced server-side. |
| **Fail criteria** | Public ranks for tiny populations; minor leak. |

### SPK-ARC-025 — Minor-user public-profile protection

| Field | Value |
|-------|-------|
| **Architecture question** | Are minor public-profile protections enforceable server-side (QAS-019)? |
| **Hypothesis** | A time-boxed harness can produce pass/fail evidence for this question without Product Code. |
| **Priority (prelim.)** | **P2** |
| **Blocking Gate** | GHV.ARCHITECTURE.1C/1E |
| **Risk** | RISK-ARC-021 |
| **Dependency** | SPK-ARC-003,013 |
| **Required evidence** | Minor exposure blocked |
| **Permitted environment** | Harness only (later) — **none authorized in 1A** |
| **Code permission** | **DENIED** (1A) |
| **Database permission** | **DENIED** |
| **Deployment permission** | **DENIED** |
| **Status** | **PLANNED · NOT RUN** |
| **Pass criteria** | Minor public profile fields suppressed server-side under policy. |
| **Fail criteria** | Client-only hide; age gate bypass. |

## Explicit non-claims

```text
No spike has been run
No spike PASS/FAIL evidence exists
No stack ADR ACCEPTED from these rows
No Product Code authorized
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §42 — SPK-ARC-001…025 planned |
