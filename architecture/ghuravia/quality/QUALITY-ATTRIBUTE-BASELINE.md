# Quality Attribute Baseline

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-QA |
| **Version** | 0.1.0 |
| **Status** | **VALIDATION PLAN** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §12 |
| **Last updated** | 2026-07-21 |
| **Limitations** | All numeric targets are **DRAFT VALIDATION TARGET · NOT PRODUCTION SLO** · Technical Validation **NOT RUN** · not industry cargo-cult |

```text
DRAFT VALIDATION TARGET
NOT PRODUCTION SLO
NOT TECHNICALLY VALIDATED
```

Blocking levels: **Hard** (blocks Product Code / baseline lock) · **Soft** (tracked debt) · **Observe** (measure first).

---

## QA-PERF — Performance

| Field | Content |
|-------|---------|
| **Stimulus** | Learner opens Nest or resumes mission under normal load |
| **Environment** | Controlled launch cohort; single region candidate |
| **Affected** | Nest, Mission Runtime |
| **Expected response** | Interactive UI without multi-second blank states for core reads |
| **Draft target** | Nest primary aggregate p95 **< 800 ms** server time (**DRAFT VALIDATION TARGET · NOT PRODUCTION SLO**) |
| **Source baseline** | Founder-operable UX; Mission resume QAS-001 |
| **Validation method** | Spike load + synthetic timings |
| **Future Gate** | 1D/1E |
| **Blocking** | Soft until measured |

## QA-AVL — Availability

| Field | Content |
|-------|---------|
| **Stimulus** | Provider or dependency outage |
| **Environment** | Launch |
| **Affected** | Edge + core modules |
| **Expected response** | Core learning path remains usable when non-critical deps fail |
| **Draft target** | Search/notifications failure **does not** hard-down Nest (**DRAFT · NOT SLO**) |
| **Source** | P-17; QAS-015/017/018 |
| **Method** | Failure injection spikes |
| **Gate** | 1D/1E |
| **Blocking** | Hard for silent fabrication; Soft for uptime % |

## QA-DUR — Durability

| Field | Content |
|-------|---------|
| **Stimulus** | Accepted Evidence or progression event committed |
| **Environment** | Primary datastore candidate |
| **Affected** | Evidence, Progression, Audit |
| **Expected response** | No silent loss after success ack |
| **Draft target** | Acked writes survive process restart (**DRAFT · NOT SLO**) |
| **Source** | P-10/P-11 |
| **Method** | Crash/restart tests |
| **Gate** | 1C/1E |
| **Blocking** | Hard |

## QA-CON — Consistency

| Field | Content |
|-------|---------|
| **Stimulus** | Concurrent duplicate events / webhook retries |
| **Environment** | At-least-once delivery |
| **Affected** | Progression, Payments→Entitlements |
| **Expected response** | Idempotent effects |
| **Draft target** | Duplicate event ⇒ **0** duplicate XP/Achievement (**DRAFT · NOT SLO**) |
| **Source** | QAS-004/007; P-03/P-11 |
| **Method** | Replay harness |
| **Gate** | 1C/1E |
| **Blocking** | Hard |

## QA-SCL — Scalability

| Field | Content |
|-------|---------|
| **Stimulus** | Cohort growth; spectator surge |
| **Environment** | Modular monolith candidate |
| **Affected** | Live Sky, Leaderboards, Search |
| **Expected response** | Participant path protected from spectator fanout |
| **Draft target** | Spectator surge must not add **> 20%** latency to participant actions in spike lab (**DRAFT · NOT SLO**) |
| **Source** | QAS-009; shape Option B |
| **Method** | Load spike |
| **Gate** | 1D/1E |
| **Blocking** | Soft |

## QA-SEC — Security

| Field | Content |
|-------|---------|
| **Stimulus** | Compromised object-storage credential / forged webhook |
| **Environment** | Separated secrets |
| **Affected** | Integration Gateway, Admin |
| **Expected response** | Storage keys cannot administer app; webhooks signature-fail closed |
| **Draft target** | QAS-014 pass in threat review (**DRAFT · NOT SLO**) |
| **Source** | P-04; Trust boundaries |
| **Method** | Threat model + spike |
| **Gate** | 1C/1E |
| **Blocking** | Hard |

## QA-PRI — Privacy

| Field | Content |
|-------|---------|
| **Stimulus** | Public profile / analytics export |
| **Environment** | Minor and adult learners |
| **Affected** | Account, Nest public views |
| **Expected response** | Crow identity without private identity or exact age |
| **Draft target** | QAS-019 checklist 100% on public payloads (**DRAFT · NOT SLO**) |
| **Source** | P-05 |
| **Method** | Payload review |
| **Gate** | 1C |
| **Blocking** | Hard |

## QA-A11Y — Accessibility

| Field | Content |
|-------|---------|
| **Stimulus** | Reduced motion / keyboard / AT use |
| **Environment** | Core shells |
| **Affected** | Frontend experience |
| **Expected response** | Equivalent function without motion-only cues |
| **Draft target** | QAS-011 pass; critical flows keyboard operable (**DRAFT · NOT SLO**) |
| **Source** | P-07 |
| **Method** | Manual + automated a11y checks |
| **Gate** | 1B/1D |
| **Blocking** | Soft→Hard before public launch |

## QA-L10N — Localization

| Field | Content |
|-------|---------|
| **Stimulus** | Arabic RTL mission with LTR technical tokens |
| **Environment** | Arabic-first UI |
| **Affected** | Mission Runtime UI |
| **Expected response** | Readable mixed-direction content |
| **Draft target** | QAS-010 pass on representative missions (**DRAFT · NOT SLO**) |
| **Source** | P-06 |
| **Method** | RTL visual/regression spike |
| **Gate** | 1B/1D |
| **Blocking** | Hard for Arabic launch surfaces |

## QA-MNT — Maintainability

| Field | Content |
|-------|---------|
| **Stimulus** | Domain change (e.g., Evidence revoke scope) |
| **Environment** | Modular monolith |
| **Affected** | Domain modules |
| **Expected response** | Change localized; no cross-domain spaghetti |
| **Draft target** | Ownership map enforced in review checklist (**DRAFT · NOT SLO**) |
| **Source** | Domain catalogue; P-09 |
| **Method** | Architecture fitness functions (later) |
| **Gate** | 1B/1E |
| **Blocking** | Soft |

## QA-TST — Testability

| Field | Content |
|-------|---------|
| **Stimulus** | Need to prove idempotency / activation |
| **Environment** | CI candidate (absent today) |
| **Affected** | All integrity domains |
| **Expected response** | Deterministic unit/integration seams without live vendors |
| **Draft target** | Provider adapters mockable (**DRAFT · NOT SLO**) |
| **Source** | P-16/P-24 |
| **Method** | Spike harness design |
| **Gate** | 1B/1E |
| **Blocking** | Soft |

## QA-OPS — Operability

| Field | Content |
|-------|---------|
| **Stimulus** | Founder diagnoses failed activation or payment |
| **Environment** | Launch telemetry |
| **Affected** | Observability, Integration Gateway |
| **Expected response** | Correlated logs across request/webhook |
| **Draft target** | Trace/correlation ID on activation & payment paths (**DRAFT · NOT SLO**) |
| **Source** | P-19/P-23 |
| **Method** | Ops drill |
| **Gate** | 1D/1E |
| **Blocking** | Soft→Hard at go-live |

## QA-PRT — Portability

| Field | Content |
|-------|---------|
| **Stimulus** | Provider substitution |
| **Environment** | Adapter layer |
| **Affected** | Integration Gateway |
| **Expected response** | Swap email/payment/storage without rewriting ledgers |
| **Draft target** | Domain events free of vendor IDs (**DRAFT · NOT SLO**) |
| **Source** | P-15/P-16 |
| **Method** | Dual-adapter spike |
| **Gate** | 1B/1E |
| **Blocking** | Soft |

## QA-REC — Recoverability

| Field | Content |
|-------|---------|
| **Stimulus** | Datastore unavailable or bad deploy |
| **Environment** | Controlled rollback |
| **Affected** | All writers |
| **Expected response** | Fail closed; no fabricated progress; restore path documented |
| **Draft target** | QAS-016: writes refuse safely (**DRAFT · NOT SLO**) |
| **Source** | P-17/P-20; recovery stub |
| **Method** | Chaos/refusal tests |
| **Gate** | 1D/1E |
| **Blocking** | Hard |

## QA-CST — Cost efficiency

| Field | Content |
|-------|---------|
| **Stimulus** | Launch traffic |
| **Environment** | Few deployables |
| **Affected** | Hosting, storage, realtime |
| **Expected response** | Avoid distributed tax pre-need |
| **Draft target** | Prefer Option B cost profile until extraction trigger (**DRAFT · NOT SLO**) |
| **Source** | Shape options; P-22 |
| **Method** | Cost model in 1B |
| **Gate** | 1B |
| **Blocking** | Observe |

## QA-EXP — Explainability

| Field | Content |
|-------|---------|
| **Stimulus** | User hits pending/restricted/locked state |
| **Environment** | Activation / Trust / Onboarding |
| **Affected** | Identity, Moderation, Nest |
| **Expected response** | Governed screen + reason class |
| **Draft target** | No dead-end without ACT-012-class recovery or appeal path (**DRAFT · NOT SLO**) |
| **Source** | P-08; QAS-005/012 |
| **Method** | Journey review |
| **Gate** | 1C |
| **Blocking** | Hard for activation |

## QA-AUD — Auditability

| Field | Content |
|-------|---------|
| **Stimulus** | Admin/moderator correction |
| **Environment** | Privileged ops |
| **Affected** | Audit, Admin |
| **Expected response** | Who/why/before/after recorded |
| **Draft target** | QAS-020 mandatory fields present (**DRAFT · NOT SLO**) |
| **Source** | P-12 |
| **Method** | Audit fixture tests |
| **Gate** | 1C/1E |
| **Blocking** | Hard |

## QA-ABU — Abuse resistance

| Field | Content |
|-------|---------|
| **Stimulus** | Spam uploads, OTP brute force, webhook flood |
| **Environment** | Public + provider edges |
| **Affected** | Identity, Evidence, Integration Gateway |
| **Expected response** | Rate limits; quarantine; signature checks |
| **Draft target** | Bounded retries; no ledger amplification (**DRAFT · NOT SLO**) |
| **Source** | P-04/P-18; QAS-002 |
| **Method** | Red-team lite spikes |
| **Gate** | 1C/1D |
| **Blocking** | Soft→Hard |

## QA-RET — Data retention

| Field | Content |
|-------|---------|
| **Stimulus** | Time passes; user deletion/export request |
| **Environment** | Privacy regime |
| **Affected** | Identity, Evidence, Audit |
| **Expected response** | Classified retention; audit may outlive content under policy |
| **Draft target** | Retention matrix draft approved before Product Code stores PII (**DRAFT · NOT SLO**) |
| **Source** | P-05; Scope |
| **Method** | Policy review |
| **Gate** | 1C |
| **Blocking** | Hard before PII persistence |

## QA-DEG — Graceful degradation

| Field | Content |
|-------|---------|
| **Stimulus** | Non-critical provider outage |
| **Environment** | Launch |
| **Affected** | Search, Notifications, Spectators |
| **Expected response** | Explicit degraded mode; integrity preserved |
| **Draft target** | QAS-015/017/018 pass (**DRAFT · NOT SLO**) |
| **Source** | P-17 |
| **Method** | Dependency kill switches |
| **Gate** | 1D/1E |
| **Blocking** | Soft (Observe→Hard at launch) |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Draft quality attributes for GHV.ARCHITECTURE.1A |
