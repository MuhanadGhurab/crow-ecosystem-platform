# Evidence Classification

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-CLS-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-BLUEPRINT-STANDARD.md](./EVIDENCE-BLUEPRINT-STANDARD.md) · [EVIDENCE-RUBRIC-STANDARD.md](./EVIDENCE-RUBRIC-STANDARD.md) · [SAFE-EVIDENCE-HANDLING.md](./SAFE-EVIDENCE-HANDLING.md) · [LAUNCH-EVIDENCE-VALUE-MATRIX.md](./LAUNCH-EVIDENCE-VALUE-MATRIX.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-001 · SRC-006 · SRC-010 · SRC-016 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Per-Route class instances; storage metadata schema (ARCHITECTURE.1); pilot of public portfolio subset |
| **Limitations** | Classification taxonomy only — not Mastery weights; not Product Codes |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Evidence Classification |

## Purpose

Register governed **Evidence classes** and, for each class, define typical value, review method, integrity risk, privacy risk, public-display suitability, and minimum metadata (§16).

```text
Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Class index

```text
KNOWLEDGE_EXPLANATION
TECHNICAL_CONFIGURATION
SOURCE_REPOSITORY
AUTOMATION_ARTIFACT
DATA_ANALYSIS
ARCHITECTURE_MODEL
TROUBLESHOOTING_RECORD
SECURITY_TRIAGE
INCIDENT_ANALYSIS
RISK_REGISTER
PROJECT_PLAN
DECISION_RECORD
OPERATIONAL_RUNBOOK
TECHNICAL_REPORT
PRESENTATION
TEAM_CONTRIBUTION
INTEGRATION_PACKAGE
CAPSTONE_BUNDLE
```

---

## Class definitions

For each class: **Typical value** · **Review method** · **Integrity risk** · **Privacy risk** · **Public-display suitability** · **Minimum metadata**.

### KNOWLEDGE_EXPLANATION

| Dimension | Content |
|-----------|---------|
| Typical value | Shows conceptual understanding in learner’s words |
| Review method | STRUCTURED_SELF_CHECK · QUALIFIED_REVIEWER spot-check |
| Integrity risk | AI paraphrase without disclosure; copied notes |
| Privacy risk | Low if synthetic examples |
| Public-display | Conditional — redact personal context |
| Minimum metadata | Mission ID · Stage ID · language · AI disclosure |

### TECHNICAL_CONFIGURATION

| Dimension | Content |
|-----------|---------|
| Typical value | Sanitized config / before-after demonstrating control |
| Review method | AUTOMATED_VALIDATION (presence/format) + QUALIFIED_REVIEWER |
| Integrity risk | Copied configs; fabricated diffs; seed mismatch |
| Privacy risk | Secrets, hostnames, account IDs |
| Public-display | Conditional after redaction |
| Minimum metadata | Seed ID · redaction checklist · environment class |

### SOURCE_REPOSITORY

| Dimension | Content |
|-----------|---------|
| Typical value | Lab repo / history showing authorship and iteration |
| Review method | AUTOMATED_VALIDATION + QUALIFIED_REVIEWER |
| Integrity risk | Copied repos; rewritten history; borrowed commits |
| Privacy risk | Tokens in history; personal emails |
| Public-display | Conditional (public fork of lab only) |
| Minimum metadata | Commit range · seed / lab ID · license note |

### AUTOMATION_ARTIFACT

| Dimension | Content |
|-----------|---------|
| Typical value | Script / pipeline fragment with verified run notes |
| Review method | AUTOMATED_VALIDATION + QUALIFIED_REVIEWER |
| Integrity risk | Unrun scripts; pasted CI logs |
| Privacy risk | Credentials in scripts |
| Public-display | Conditional |
| Minimum metadata | Run context · expected output hash/notes · AI disclosure |

### DATA_ANALYSIS

| Dimension | Content |
|-----------|---------|
| Typical value | Analysis steps + interpretation on permitted datasets |
| Review method | QUALIFIED_REVIEWER · EXPERT_REVIEW if high-impact |
| Integrity risk | AI-generated charts without method; fabricated results |
| Privacy risk | Real PII datasets |
| Public-display | Conditional — synthetic preferred |
| Minimum metadata | Dataset seed · method steps · uncertainty note |

### ARCHITECTURE_MODEL

| Dimension | Content |
|-----------|---------|
| Typical value | Bounded architecture / trust-boundary model |
| Review method | QUALIFIED_REVIEWER |
| Integrity risk | Template-only fill; vendor diagram dump |
| Privacy risk | Real org topology |
| Public-display | Conditional |
| Minimum metadata | Scope constraints · assumptions · Stage ID |

### TROUBLESHOOTING_RECORD

| Dimension | Content |
|-----------|---------|
| Typical value | Diagnose → isolate → fix → document timeline |
| Review method | QUALIFIED_REVIEWER |
| Integrity risk | Fabricated timelines; backdated fixes |
| Privacy risk | Real incident data |
| Public-display | Usually private / redacted |
| Minimum metadata | Fault seed · timeline · safety of fix |

### SECURITY_TRIAGE

| Dimension | Content |
|-----------|---------|
| Typical value | Defensive alert triage write-up (synthetic) |
| Review method | QUALIFIED_REVIEWER · EXPERT_REVIEW for sensitive packs |
| Integrity risk | Copied playbooks; offensive detail leakage |
| Privacy risk | Real alert payloads; victim data |
| Public-display | Rare — REVIEWER_RESTRICTED default |
| Minimum metadata | Ethics attestation · seed · severity rationale |

### INCIDENT_ANALYSIS

| Dimension | Content |
|-----------|---------|
| Typical value | Investigation timeline + escalation brief |
| Review method | QUALIFIED_REVIEWER · DUAL_REVIEW when Prestige-sensitive |
| Integrity risk | Fabricated logs/screenshots |
| Privacy risk | High — real incident material prohibited |
| Public-display | No (unless heavily synthetic + approved) |
| Minimum metadata | Synthetic case ID · chain of custody notes · redaction log |

### RISK_REGISTER

| Dimension | Content |
|-----------|---------|
| Typical value | Risks, owners (role), residual risk |
| Review method | QUALIFIED_REVIEWER |
| Integrity risk | Generic copied registers |
| Privacy risk | Real vendor / org risk data |
| Public-display | Conditional |
| Minimum metadata | Scenario ID · residual risk statement |

### PROJECT_PLAN

| Dimension | Content |
|-----------|---------|
| Typical value | Delivery plan / RACI-lite under constraints |
| Review method | QUALIFIED_REVIEWER |
| Integrity risk | Template spam without decisions |
| Privacy risk | Real client names |
| Public-display | Conditional |
| Minimum metadata | Constraints · milestones · decision links |

### DECISION_RECORD

| Dimension | Content |
|-----------|---------|
| Typical value | Decision log with options and rationale |
| Review method | QUALIFIED_REVIEWER |
| Integrity risk | Post-hoc rationalization without evidence |
| Privacy risk | Confidential stakeholder data |
| Public-display | Conditional |
| Minimum metadata | Options considered · chosen option · rejection reasons |

### OPERATIONAL_RUNBOOK

| Dimension | Content |
|-----------|---------|
| Typical value | Mini-runbook / change hygiene sample |
| Review method | QUALIFIED_REVIEWER |
| Integrity risk | Copied vendor runbooks |
| Privacy risk | Production endpoints / credentials |
| Public-display | Conditional after sanitize |
| Minimum metadata | Scope · rollback note · seed / lab ID |

### TECHNICAL_REPORT

| Dimension | Content |
|-----------|---------|
| Typical value | Structured technical report tying practice to claims |
| Review method | QUALIFIED_REVIEWER · EXPERT_REVIEW if Capstone-linked |
| Integrity risk | Ghostwritten / undisclosed AI body |
| Privacy risk | Embedded secrets / PII |
| Public-display | Conditional |
| Minimum metadata | Claim list · Evidence links · AI disclosure |

### PRESENTATION

| Dimension | Content |
|-----------|---------|
| Typical value | Briefing deck / talk track with accessible alternative |
| Review method | QUALIFIED_REVIEWER |
| Integrity risk | Stock slides without learner judgment |
| Privacy risk | Screenshots with sensitive data |
| Public-display | Conditional |
| Minimum metadata | Audience · duration note · transcript/alt text |

### TEAM_CONTRIBUTION

| Dimension | Content |
|-----------|---------|
| Typical value | Individual contribution signals within Team result |
| Review method | PEER_FEEDBACK + QUALIFIED_REVIEWER |
| Integrity risk | Free-riding; inflated peer praise |
| Privacy risk | Peer personal data |
| Public-display | Usually private |
| Minimum metadata | Role · action record · authored artifact IDs — see [TEAM-CONTRIBUTION-EVIDENCE.md](./TEAM-CONTRIBUTION-EVIDENCE.md) |

### INTEGRATION_PACKAGE

| Dimension | Content |
|-----------|---------|
| Typical value | Cross-Wing integrated pack (delivery + findings + checklist) |
| Review method | QUALIFIED_REVIEWER · DUAL_REVIEW if conflict |
| Integrity risk | Reused single-Route Evidence without integration delta |
| Privacy risk | Combined sensitive artifacts |
| Public-display | Conditional / often restricted |
| Minimum metadata | Bridge/CXW IDs · delta note · residual risk |

### CAPSTONE_BUNDLE

| Dimension | Content |
|-----------|---------|
| Typical value | Capstone Evidence pack integrating Stage outcomes |
| Review method | QUALIFIED_REVIEWER · EXPERT_REVIEW where required |
| Integrity risk | Assembled from others’ work; incomplete authenticity |
| Privacy risk | Bundle-wide secret leakage |
| Public-display | Conditional portfolio subset only |
| Minimum metadata | Capstone ID · required output checklist · integrity clear flag |

---

## Binding rules

1. Every Evidence Blueprint selects **one primary class** (secondary optional).
2. Classes do **not** encode XP or Mastery points.
3. Public display always respects privacy class from [SAFE-EVIDENCE-HANDLING.md](./SAFE-EVIDENCE-HANDLING.md).
4. SECURITY_TRIAGE / INCIDENT_ANALYSIS remain **defensive and synthetic** for launch foundations.
