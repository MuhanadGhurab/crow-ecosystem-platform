# Launch Evidence Value Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVID-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.11 · [ROUTE-CANDIDATE-REGISTER.md](../routes/ROUTE-CANDIDATE-REGISTER.md) · [LAUNCH-CROSS-WING-STUDY.md](../cross-wing/LAUNCH-CROSS-WING-STUDY.md) · [LAUNCH-SECURE-EXTENSION-STUDY.md](../secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) · [LAUNCH-LEARNING-GRAPH-CONCEPT.md](../graph/LAUNCH-LEARNING-GRAPH-CONCEPT.md) · [TOOLING-AND-LAB-FEASIBILITY.md](../research/TOOLING-AND-LAB-FEASIBILITY.md) |
| **Limitations** | Research judgments only; no accreditation claims; no employment guarantees; rubrics not yet bilingual-locked; human review capacity is a launch constraint; portfolio **RECOMMENDED — NOT YET LOCKED** |
| **Unresolved** | Exact Evidence schemas / rubrics (GHV.LEARNING.1B) · automated integrity checks depth · external assessor path (POST-LAUNCH) · retention/deletion policy detail · GHV.PROGRESSION.1 Mastery mapping (no formula invented here) |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A |

## Purpose

Assess Evidence **value** for the recommended launch portfolio. Prefer **visible, defensible Evidence** — artifacts a reviewer (and later, a professional audience) can inspect — over opaque quiz scores alone.

## Design preference (launch)

| Prefer | Avoid at launch |
|--------|-----------------|
| Observable artifacts (logs, configs, repos, write-ups, checklists) | Quiz-only Capstones |
| Before/after or seed-finding trails | Unverifiable “I did it” claims |
| Short reflections tied to the artifact | Long essays without product |
| Lab-scoped screenshots with secrets redacted | Raw credentials / production data |
| Clear AI-assist disclosure | Undeclared generative paste |

Automated checks + human review + revision + approval/revocation remain Scope CONTROLLED LAUNCH (§3.11). Advanced external assessor / accredited Evidence: POST-LAUNCH or CONDITIONAL.

## Evaluation dimensions

| Dimension | Question |
|-----------|----------|
| **Evidence classes** | What artifact types fit this Route/CW/SE? |
| **Authenticity** | Can we believe the learner did the work? |
| **Relevance** | Does it match real tasks in the capability statement? |
| **Reviewability** | Can a human review it in bounded time? |
| **Portability** | Useful outside GHURAVIA (portfolio / interview)? |
| **Privacy** | Risk of PII / secrets / third-party data? |
| **Plagiarism** | Copy/reuse risk? |
| **AI-assist risk** | Generative completion without understanding? |
| **Accessibility** | Can diverse learners produce/submit fairly? |
| **Storage** | Size, format, retention burden? |
| **Professional value** | Signal for workplace-adjacent competence (no employment claim)? |

Ratings use: **High / Med / Low** risk or value as labeled per column.

---

## Portfolio (RECOMMENDED — NOT YET LOCKED)

### RC-OPR-001 — Cloud Systems Operations Foundations

| Dimension | Assessment |
|-----------|------------|
| **Evidence classes** | Lab completion pack · change log sample · incident timeline notes · monitoring screenshot (redacted) · short ops reflection · runbook snippet |
| **Authenticity** | **Med–High** — lab telemetry + timestamped change notes beat quizzes; require unique lab seed IDs |
| **Relevance** | **High** — mirrors ops documentation and incident hygiene |
| **Reviewability** | **Med** — structured templates keep reviews ≤15–20 min |
| **Portability** | **Med–High** — sanitized incident notes and change logs travel well |
| **Privacy** | **Med** — cloud account IDs, logs; mandate redaction checklist |
| **Plagiarism** | **Med** — shared runbooks; require personalized incident narrative + lab seed |
| **AI-assist risk** | **Med** — AI can draft reflections; require artifact-linked prompts (“cite your change ID”) |
| **Accessibility** | **Med–High** — allow text + annotated screenshots; keyboard-friendly consoles preferred |
| **Storage** | **Med** — screenshots + markdown; cap media size |
| **Professional value** | **High** — visible ops discipline |

**Preferred Capstone shape:** Stabilize guided multi-service lab under injected faults; submit timeline + change log + residual risk note.

### RC-BLD-001 — Web Application Delivery Foundations

| Dimension | Assessment |
|-----------|------------|
| **Evidence classes** | Repo / lab project · PR or change summary · test output · deployed preview URL (sandbox) · README · short delivery reflection |
| **Authenticity** | **High** — commit history + unique feature seed |
| **Relevance** | **High** — shippable artifacts |
| **Reviewability** | **Med** — checklist + smoke-test script for reviewers |
| **Portability** | **High** — portfolio-grade |
| **Privacy** | **Low–Med** — avoid real user data in demos |
| **Plagiarism** | **Med–High** — public starter templates; require delta beyond scaffold + personal walkthrough |
| **AI-assist risk** | **High** — code generation common; require AI disclosure + explain-your-diff Mission |
| **Accessibility** | **Med** — provide non-CLI paths where possible; captioned demos |
| **Storage** | **Med** — git bundle or link + snapshot; avoid huge `node_modules` |
| **Professional value** | **High** |

**Preferred Capstone shape:** Small feature shipped in sandbox with tests + release notes + explain-your-diff.

### RC-PRT-001 — Defensive Security Operations Foundations

| Dimension | Assessment |
|-----------|------------|
| **Evidence classes** | Alert triage write-up · detection/logic note (lab) · IOC/false-positive analysis · escalation brief · ethics attestation · defensive checklist |
| **Authenticity** | **Med–High** — lab-seeded scenarios with unique variants |
| **Relevance** | **High** — SecOps task patterns without red-team theater |
| **Reviewability** | **Med** — rubrics for triage quality; avoid requiring full SIEM expertise |
| **Portability** | **Med** — sanitized case notes |
| **Privacy** | **High risk if mishandled** — no real victim data; synthetic only |
| **Plagiarism** | **Med** — case study banks; randomize seeds |
| **AI-assist risk** | **Med–High** — AI can invent plausible triage; require lab artifact citations |
| **Accessibility** | **Med** — cognitive load; offer structured forms |
| **Storage** | **Low–Med** — text-heavy Evidence |
| **Professional value** | **High** — when scoped to defensive practice |

**Preferred Capstone shape:** Triage a seeded incident family; document decisions, false positives, and handoff — lab only.

### RC-LED-001 — Technology Delivery & Risk Foundations

| Dimension | Assessment |
|-----------|------------|
| **Evidence classes** | Risk register excerpt · decision log · stakeholder brief · trade-off memo · delivery plan slice · retrospect note |
| **Authenticity** | **Med** — narrative risk; mitigate with scenario packs + forced constraints |
| **Relevance** | **High** — delivery/risk language employers recognize |
| **Reviewability** | **High** — short structured memos |
| **Portability** | **High** — decision logs as interview talk tracks |
| **Privacy** | **Low–Med** — fictional org scenarios |
| **Plagiarism** | **Med–High** — template reuse; require scenario-specific numbers/constraints |
| **AI-assist risk** | **High** — AI drafts fluent risk prose; require “show your alternatives rejected” section + disclosure |
| **Accessibility** | **High** — text-first; multiple format options |
| **Storage** | **Low** |
| **Professional value** | **High** — if grounded in concrete scenario, not soft-skills theater |

**Preferred Capstone shape:** Decide under constraints on a delivery/risk scenario; submit decision log + residual risk + communication brief.

### RC-ANL-001 — Practical Data Analysis Foundations (optional alt)

| Dimension | Assessment |
|-----------|------------|
| **Evidence classes** | Analysis notebook or spreadsheet · cleaned dataset note · chart + interpretation · reproducibility steps · ethics/privacy note |
| **Authenticity** | **Med–High** — unique dataset seeds |
| **Relevance** | **High** |
| **Reviewability** | **Med** — require executive interpretation, not only charts |
| **Portability** | **High** |
| **Privacy** | **Med–High** — ban real personal datasets; provide synthetic data |
| **Plagiarism** | **Med** — shared Kaggle-like patterns; seed + personal insight required |
| **AI-assist risk** | **High** — AI can write analysis text; require method steps learner can re-run |
| **Accessibility** | **Med** — spreadsheet path + notebook path |
| **Storage** | **Med** — cap dataset size |
| **Professional value** | **High** |

**Preferred Capstone shape:** Answer a business question on synthetic data with reproducible steps + interpretation.

### CXW-001 — Secure Application Delivery

| Dimension | Assessment |
|-----------|------------|
| **Evidence classes** | Integration pack: app change artifact · threat notes · remediated finding log · secure delivery checklist · residual risk reflection |
| **Authenticity** | **High** when seeded finding + unique app delta required |
| **Relevance** | **High** — integrative real-world capability |
| **Reviewability** | **Med** — dual-horizon checklist; may need BUILD+PROTECT-aware reviewer |
| **Portability** | **High** |
| **Privacy** | **Med** — demo credentials/secrets must be fake and redacted |
| **Plagiarism** | **Med** — integration uniqueness helps |
| **AI-assist risk** | **High** — both code and security prose; mandate disclosure + finding reproduction steps |
| **Accessibility** | **Med** — heavier cognitive load; scaffold Integration Mission |
| **Storage** | **Med** |
| **Professional value** | **High** — visible secure delivery trail |

**Preferred Capstone shape:** Ship feature + remediate seeded finding + document residual risk (lab-only targets).

### SEX-001 — Secure Cloud Operations Extension

| Dimension | Assessment |
|-----------|------------|
| **Evidence classes** | Secure baseline checklist · before/after config evidence · secrets-handling attestation · misconfiguration note · least-privilege role screenshot (redacted) |
| **Authenticity** | **High** with lab tenant seed + before/after diffs |
| **Relevance** | **High** — cloud misconfiguration is a dominant failure mode |
| **Reviewability** | **Med** — control checklist speeds review |
| **Portability** | **Med–High** — sanitized hardening notes |
| **Privacy** | **Med** — logs and IAM; strict redaction |
| **Plagiarism** | **Low–Med** — environment-specific diffs |
| **AI-assist risk** | **Med** — AI can list CIS-like controls; require applied before/after on learner lab |
| **Accessibility** | **Med** — console complexity; provide guided UI alternatives where feasible |
| **Storage** | **Med** |
| **Professional value** | **High** — practical secure ops signal (not full PROTECT career claim) |

**Preferred Capstone shape:** Harden lab account/service; prove least privilege + secret hygiene + seeded misconfig fix.

---

## Cross-cutting integrity controls (research baseline)

| Control | Intent |
|---------|--------|
| Lab seed / variant IDs | Authenticity |
| Redaction checklist before submit | Privacy |
| AI-assist disclosure field | AI-assist risk |
| Artifact-linked reflection prompts | Relevance + authenticity |
| Size / format allowlists | Storage |
| Revision loop after reject | Reviewability / learning |
| Revocation on integrity failure | Trust of Evidence (policy detail PENDING 1B / PROGRESSION.1) |

## Explicit non-goals

- No Mastery point formulas or Trust numeric thresholds.
- No claim of accredited certification Evidence at launch.
- No requirement for expensive proctoring hardware at launch.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1B | Evidence schemas, rubrics, integrity automation scope |
| GHV.LEARNING.1C | `EVIDENCE_FOR` / `REMEDIATES` edge instances |
| GHV.PROGRESSION.1 | How approved Evidence maps to Mastery (if at all) |
| GHV.LEARNING.1D | Lock Evidence expectations with catalogue |
)

