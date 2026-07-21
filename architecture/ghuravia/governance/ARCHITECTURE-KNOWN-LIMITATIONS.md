# Architecture Known Limitations

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-LIM-001 |
| **Version** | 1.0.0 |
| **Status** | **LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E (Gate §29 minimum set) |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |
| **Related** | [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](./FINAL-ARCHITECTURE-CONDITION-REGISTER.md) · [ARCHITECTURE-RISK-REGISTER.md](./ARCHITECTURE-RISK-REGISTER.md) · [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](./GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md) |

## Purpose

Record known limitations that remain true after GHURAVIA Architecture Design Baseline v1.0.0 lock. These limitations **must remain visible** and must not be overwritten by “LOCKED” language.

```text
LOCKED AS GOVERNED ARCHITECTURE DESIGN BASELINE
≠ EXTERNALLY VALIDATED
≠ PRODUCTION READY
≠ IMPLEMENTATION AUTHORIZED
≠ COMPLIANCE CERTIFIED
```

---

## Known limitations (Gate §29 minimum set)

| # | Limitation | Status |
|---|------------|--------|
| 1 | Full external technical validation | **NOT COMPLETE** |
| 2 | Product Code | **BLOCKED** |
| 3 | Implementation authorization | **NOT GRANTED** |
| 4 | Production deployment | **NOT AUTHORIZED** |
| 5 | Production SLOs / SLA commitments | **NOT ESTABLISHED** (DRAFT targets only) |
| 6 | Identity provider (IdP) selected and sandbox-validated | **DEFERRED** |
| 7 | Email / contact verification provider deliverability tested | **DEFERRED** |
| 8 | Evidence object-storage provider selected | **DEFERRED** |
| 9 | Malware / secret scanner vendor selected and benchmarked | **DEFERRED** |
| 10 | Realtime transport provider (Live Sky) sandbox-validated | **DEFERRED** |
| 11 | Search provider beyond relational FTS at production scale | **DEFERRED** |
| 12 | Notification delivery provider sandbox-validated | **DEFERRED** |
| 13 | Observability / APM provider selected | **DEFERRED** |
| 14 | KMS / encryption provider selected | **DEFERRED** |
| 15 | Primary relational datastore host / residency finalized | **DEFERRED** |
| 16 | Preview / Production external infrastructure proof | **NOT RUN** |
| 17 | Backup / restore operational DR drill | **NOT RUN** (DRAFT RPO/RTO only) |
| 18 | Penetration testing | **NOT RUN** |
| 19 | Compliance certification (SOC2, ISO, etc.) | **NOT CLAIMED** |
| 20 | Arabic RTL user typography / mixed-script validation | **NOT RUN** |
| 21 | Accessibility user validation (beyond spike harness) | **NOT RUN** |
| 22 | Real-user calibration / usability studies | **NOT RUN** |
| 23 | Legal retention duration review | **PENDING LEGAL** |
| 24 | Minor identity / parental consent legal review | **PENDING LEGAL** |
| 25 | Saudi / Nafath official API access | **NOT VERIFIED** |
| 26 | Spike harness evidence at production load / scale | **NOT PROVEN** |
| 27 | Inherited CyberCrow repository tooling | **NOT** automatic stack approval |
| 28 | External message broker / shared distributed cache | **DEFERRED** — not required at launch |
| 29 | Architecture baseline lock | **DOES NOT** authorize Learning or Progression formula changes |

### Additional programme limitations

* Learning Design Baseline v1.0.0 and Progression Design Baseline v1.0.0 remain **separately locked** — architecture lock does not reopen them.
* Provider adapter interfaces are locked; **vendor selection** remains open.
* Moderation operational SLAs and appeals UX are **not** validated at architecture lock.
* Session timeout values require **UX validation** before controlled launch.
* Hono API extraction and worker scaling triggers remain **future implementation** decisions.

## Visibility rule

These limitations remain authoritative after 1E lock. Closing a limitation requires evidence (external validation report, legal clearance, user study, provider sandbox, DR drill) and register updates — not status-label inflation.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E §29 — architecture known limitations register |
