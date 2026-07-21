# Route Evidence Map

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-MAP-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-ANCHOR-REGISTRY.md](./EVIDENCE-ANCHOR-REGISTRY.md) · [ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md) · [LAUNCH-EVIDENCE-VALUE-MATRIX.md](./LAUNCH-EVIDENCE-VALUE-MATRIX.md) · Scope §3.11 |
| **Limitations** | Architecture mapping only — no Mission steps, no numeric Mastery, no retention days locked |
| **Unresolved** | Rubric depth (1C); retention periods & deletion UX (policy + 1C/PROGRESSION.1); expert review |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B Route Evidence Map |

## Purpose

For each P0 Route, Cross-Wing, and Secure Extension, map formative / practical / Capstone Evidence, public vs private artifacts, review type, integrity risk, privacy classification, portability, retention requirement, and revocation implications. **RT-ANL-001** is included and marked **reserve**.

## Evidence requirements (binding)

Every Route / CXW / SEX must produce:

1. At least one independently reviewable **practical** artifact.
2. At least one **explanation or decision** record.
3. One **Capstone** artifact or artifact bundle.

Passive completion records are insufficient.

---

## RT-OPR-001 — Cloud Systems Operations Foundations (P0)

| Dimension | Architecture mapping |
|-----------|----------------------|
| **Formative** | Lab command summaries; STG orientation notes feeding EVD-03 context |
| **Practical** | **RT-OPR-001-EVD-01** Config · **RT-OPR-001-EVD-02** Troubleshooting · **RT-OPR-001-EVD-03** Runbook |
| **Capstone** | **RT-OPR-001-CAP-01** — timeline + change note + mini-runbook + sanitized config |
| **Public portfolio** | Sanitized runbook / timeline excerpts (lab-branded; secrets stripped) |
| **Private / sensitive** | Raw console exports, account IDs, unredacted logs — submit-gated by redaction checklist |
| **Review type** | Checklist + human rubric (diagnosis quality, safety, clarity); target ≤15–20 min |
| **Integrity risk** | Med — shared runbooks; mitigate with lab seed IDs + personalized narrative |
| **Privacy classification** | Med — logs / cloud identifiers; mandatory redaction |
| **Portability** | Med–High — sanitized incident notes travel well |
| **Retention requirement** | Retain approved Evidence for governed portfolio / Flight Log duration; retain integrity audit trail after learner deletion request until policy window closes (detail PENDING) |
| **Revocation** | Integrity fail or unsafe artifact → revoke approval; may block Route-Proven and SEX eligibility until remediation |

## RT-BLD-001 — Web Application Delivery Foundations (P0)

| Dimension | Architecture mapping |
|-----------|----------------------|
| **Formative** | Guided git / a11y drills supporting EVD-01 / EVD-02 |
| **Practical** | **RT-BLD-001-EVD-01** Repo · **EVD-02** A11y note · **EVD-03** Tests · **EVD-04** Delivery doc |
| **Capstone** | **RT-BLD-001-CAP-01** — feature + tests + delivery note + explain-your-diff |
| **Public portfolio** | Repo / preview (sandbox) + README (strong public candidate) |
| **Private / sensitive** | Env secrets, real PII in demos — forbidden in submit path |
| **Review type** | Smoke checklist + human rubric; AI-disclosure required |
| **Integrity risk** | Med–High — templates / AI code; require unique seed + disclosure |
| **Privacy classification** | Low–Med |
| **Portability** | High |
| **Retention requirement** | Same governed portfolio retention; cap media / exclude `node_modules` |
| **Revocation** | Plagiarism / secret commits / undeclared AI-only paste → revoke; Capstone resubmit cycle |

## RT-PRT-001 — Defensive Security Operations Foundations (P0)

| Dimension | Architecture mapping |
|-----------|----------------------|
| **Formative** | Ethics attestation; detection drills feeding EVD-01 / EVD-03 |
| **Practical** | **RT-PRT-001-EVD-01** Triage · **EVD-02** Timeline · **EVD-03** Investigation report |
| **Capstone** | **RT-PRT-001-CAP-01** — triage + ethics + briefing (lab-only) |
| **Public portfolio** | Conditional — briefing without sensitive IOC dumps; lab-marked |
| **Private / sensitive** | Synthetic IOC packets may still be treated as lab-sensitive; no real victim data ever |
| **Review type** | Structured forms + human defensive-reasoning rubric |
| **Integrity risk** | Med–High — AI-plausible triage; require lab artifact citations + seed |
| **Privacy classification** | High if mishandled — synthetic-only policy |
| **Portability** | Med — sanitized case notes |
| **Retention requirement** | Prefer text Evidence; retain ethics attestation with pack |
| **Revocation** | Live-target claims / ethics fail / unsafe content → hard revoke + REMEDIATION |

## RT-LED-001 — Technology Delivery & Risk Foundations (P0)

| Dimension | Architecture mapping |
|-----------|----------------------|
| **Formative** | Stakeholder / constraint warm-ups feeding EVD-01 / EVD-02 |
| **Practical** | **RT-LED-001-EVD-01** Brief · **EVD-02** Plan · **EVD-03** Risk register · **EVD-04** Decision record |
| **Capstone** | **RT-LED-001-CAP-01** — plan + risk + decision + communication brief |
| **Public portfolio** | Decision logs / plans (fictional org) — strong portfolio pieces |
| **Private / sensitive** | Real org confidential data — forbidden; scenarios only |
| **Review type** | Short structured memo review (realism + risk quality, not eloquence) |
| **Integrity risk** | High AI-prose risk; require rejected alternatives + AI disclosure |
| **Privacy classification** | Low–Med |
| **Portability** | High |
| **Retention requirement** | Low storage burden; retain with Flight Log |
| **Revocation** | Template-only paste / title inflation language → reject/revise; integrity revoke if fabricated constraints |

## RT-ANL-001 — Practical Data Analysis Foundations (**RESERVE**)

| Dimension | Architecture mapping |
|-----------|----------------------|
| **Status** | **LAUNCH RESERVE — CAPACITY CONDITIONAL** — Evidence map architected; not committed launch load |
| **Formative** | Question-framing / quality drills feeding EVD-01 / EVD-04 |
| **Practical** | **RT-ANL-001-EVD-01**…**EVD-04** (dataset note, analysis, viz, decision report) |
| **Capstone** | **RT-ANL-001-CAP-01** — only if Route capacity-activated |
| **Public portfolio** | Yes if dataset license allows |
| **Private / sensitive** | Ban real personal datasets; synthetic only |
| **Review type** | Method honesty + interpretation rubric; dual sheet/notebook path |
| **Integrity risk** | High AI analysis text; require re-runnable steps |
| **Privacy classification** | Med–High without synthetic discipline |
| **Portability** | High |
| **Retention requirement** | Cap dataset size; retain seed ID with pack |
| **Revocation** | Real PII upload / irreproducible claims → revoke |

---

## CXW-001 — Secure Application Delivery

| Dimension | Architecture mapping |
|-----------|----------------------|
| **Formative** | Integration readiness checks; source Stage refresh if needed |
| **Practical** | **CXW-001-EVD-01** Delivery delta · **EVD-02** Finding/remediation · **EVD-03** Secure delivery checklist |
| **Capstone** | **CXW-001-CAP-01** — integrated bundle proving *integration* |
| **Public portfolio** | Sanitized feature + findings summary |
| **Private / sensitive** | Demo secrets / vuln details — redact before public share |
| **Review type** | Dual rubric (delivery + secure practice); BUILD+PROTECT-aware reviewer preferred |
| **Integrity risk** | High — code + security prose; mandate disclosure + finding reproduction |
| **Privacy classification** | Med |
| **Portability** | High |
| **Retention requirement** | Retain integrated pack as whole; do not split approval without policy |
| **Revocation** | Badge-only “secure” labeling / non-integrated sequential paste → revoke Integration Evidence |

## SEX-001 — Secure Cloud Operations Extension

| Dimension | Architecture mapping |
|-----------|----------------------|
| **Formative** | Baseline walkthroughs on host Route lab |
| **Practical** | **SEX-001-EVD-01** Secure baseline · **EVD-02** Before/after hardening · **EVD-03** Secrets & misconfig note |
| **Capstone** | **SEX-001-CAP-01** — harden ops path (extension Capstone, not full PROTECT) |
| **Public portfolio** | Sanitized hardening diffs |
| **Private / sensitive** | IAM screenshots / logs — strict redaction |
| **Review type** | Control checklist + human privilege-reduction rubric |
| **Integrity risk** | Med — AI control lists; require applied before/after on learner lab |
| **Privacy classification** | Med |
| **Portability** | Med–High |
| **Retention requirement** | Retain with host Route Evidence trail; Extension marker depends on approved pack |
| **Revocation** | Production claims / secret leakage → revoke Extension Evidence; may re-open host Route review if integrity shared |

---

## Cross-cutting controls

| Control | Applies |
|---------|---------|
| Lab seed / variant IDs | All practical / Capstone packs |
| Redaction checklist | OPR · PRT · SEX · CXW · ANL |
| AI-assist disclosure | All Capstones; elevated for BLD · LED · CXW · ANL |
| Revision loop | Reject → revise → resubmit |
| Revocation → governed re-evaluation | Route-Proven / CW / Extension eligibility |

## Explicit non-goals

- No XP weights per Evidence type.
- No final retention day counts in 1B.
- No accredited external assessor path at launch (POST-LAUNCH / CONDITIONAL per Scope).
