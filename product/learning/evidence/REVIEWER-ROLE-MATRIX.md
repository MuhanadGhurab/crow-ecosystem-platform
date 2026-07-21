# Reviewer Role Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-REV-ROLE-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-REVIEW-MODEL.md](./EVIDENCE-REVIEW-MODEL.md) · [EVIDENCE-REVISION-AND-APPEAL.md](./EVIDENCE-REVISION-AND-APPEAL.md) · [LEARNING-INTEGRITY-MODEL.md](../integrity/LEARNING-INTEGRITY-MODEL.md) · [EXPERT-REVIEW-REQUIREMENTS.md](../architecture/EXPERT-REVIEW-REQUIREMENTS.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-001 · SRC-010 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Expert and reviewer staffing; Mastery/qualification thresholds for “qualified reviewer” → GHV.PROGRESSION.1; appeal panel composition |
| **Limitations** | Role architecture only — staffing not hired; no Product Code RBAC implementation |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Reviewer Role Matrix |

## Purpose

Define reviewer **roles** and, for each, required assurance, qualification posture, permitted/prohibited actions, conflict-of-interest, audit, and escalation (§20).

```text
Expert and reviewer staffing remain unresolved dependencies.
Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Roles (§20)

```text
Learner
Peer contributor
Mentor
Qualified reviewer
Domain expert
Integrity reviewer
Appeal reviewer
Administrator
```

For each role below: **Required assurance** · **Required Mastery or qualification** · **Permitted actions** · **Prohibited actions** · **Conflict-of-interest** · **Audit** · **Escalation**.

---

### Learner

| Dimension | Content |
|-----------|---------|
| Required assurance | Authenticated identity; Mission eligibility |
| Mastery / qualification | None beyond Mission entry rules (numeric Mastery PENDING PROGRESSION.1) |
| Permitted | Produce Evidence; self-check; disclose AI; request revision / appeal per policy |
| Prohibited | Approve own Route-Proven; impersonate reviewers; submit prohibited data |
| Conflict of interest | N/A (subject) |
| Audit | Submission and disclosure records retained per policy direction |
| Escalation | To mentor / qualified reviewer / integrity / appeal |

### Peer contributor

| Dimension | Content |
|-----------|---------|
| Required assurance | Authenticated peer in allowed Mission |
| Mastery / qualification | Same Stage band or governed peer pool (detail PENDING) |
| Permitted | Developmental feedback; Team contribution confirmation |
| Prohibited | Grant Route-Proven; access SENSITIVE_RESTRICTED without need; coerce |
| Conflict of interest | Disclose Teammates / friends; recuse when biased |
| Audit | Feedback attribution retained |
| Escalation | To qualified reviewer if dispute |

### Mentor

| Dimension | Content |
|-----------|---------|
| Required assurance | Designated mentor role |
| Mastery / qualification | Mentorship designation (staffing PENDING) |
| Permitted | Coaching; prepare learner for submit; clarify briefs |
| Prohibited | Silent edit of learner artifacts; rubber-stamp Proven; hide integrity issues |
| Conflict of interest | Disclose commercial / personal relationships |
| Audit | Coaching notes separate from formal review record when required |
| Escalation | To qualified reviewer / integrity |

### Qualified reviewer

| Dimension | Content |
|-----------|---------|
| Required assurance | Reviewer credentialing process (staffing PENDING) |
| Mastery / qualification | Domain-qualified per policy — **numeric Mastery thresholds PENDING PROGRESSION.1** |
| Permitted | Rubric review; request revision; record STANDARD_MET / NOT_YET_MET |
| Prohibited | Silently alter artifacts; approve under integrity hold; invent XP |
| Conflict of interest | Recuse from own mentees / relatives / financial interest |
| Audit | Rubric scores/comments + decision timestamp |
| Escalation | Dual review / domain expert / integrity |

### Domain expert

| Dimension | Content |
|-----------|---------|
| Required assurance | Expert panel / specialty designation |
| Mastery / qualification | Expert criteria per [EXPERT-REVIEW-REQUIREMENTS.md](../architecture/EXPERT-REVIEW-REQUIREMENTS.md) — **NOT RUN** |
| Permitted | High-impact / specialized Evidence review; content-blueprint advice |
| Prohibited | Claim catalogue PUBLISHED without Gate; bypass integrity |
| Conflict of interest | Vendor / employer conflicts disclosed |
| Audit | Expert decision record |
| Escalation | Dual review / Founder Change Control for systemic issues |

### Integrity reviewer

| Dimension | Content |
|-----------|---------|
| Required assurance | Integrity function designation |
| Mastery / qualification | Integrity training / designation (staffing PENDING) |
| Permitted | Authenticity review; VOID / hold; recommend remediation |
| Prohibited | Substitute for capability rubric unless dual-hatted under policy; invasive surveillance design |
| Conflict of interest | Independent from original capability reviewer when feasible |
| Audit | Integrity case file |
| Escalation | Appeal reviewer / administrator |

### Appeal reviewer

| Dimension | Content |
|-----------|---------|
| Required assurance | Appeal panel designation |
| Mastery / qualification | Appeal-qualified (staffing PENDING) |
| Permitted | Review appeals; uphold / overturn process outcomes within policy |
| Prohibited | Be the **same** original reviewer when separation is required; punish good-faith appeals |
| Conflict of interest | Must not have decided the original capability review under separation rules |
| Audit | Appeal decision + rationale |
| Escalation | Administrator / Change Control |

### Administrator

| Dimension | Content |
|-----------|---------|
| Required assurance | Platform / learning ops admin |
| Mastery / qualification | Operational admin rights (not a pedagogy override by default) |
| Permitted | Access control; quarantine; takedown; audit export; process enforcement |
| Prohibited | Quietly rewrite learner Evidence content; award Proven as subscription perk |
| Conflict of interest | Segregation of duties from sole reviewer where required |
| Audit | Admin actions logged |
| Escalation | Founder / Change Control |

---

## Binding rules

1. Peer feedback ≠ Proven.
2. Integrity review is separable from quality review.
3. Appeal reviewers must not be the original reviewer when separation is required.
4. Staffing and numeric qualification thresholds remain **unresolved**.
