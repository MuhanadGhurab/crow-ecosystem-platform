# Mission Category Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-CAT-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](./ROUTE-ARCHITECTURE-STANDARD.md) · [STAGE-ARCHITECTURE-STANDARD.md](./STAGE-ARCHITECTURE-STANDARD.md) · [LAUNCH-EVIDENCE-VALUE-MATRIX.md](../evidence/LAUNCH-EVIDENCE-VALUE-MATRIX.md) |
| **Limitations** | Categories are architecture labels — not Product Codes; not XP multipliers; Mission scripts deferred to LEARNING.1C |
| **Unresolved** | Per-Mission bilingual templates; Live Sky facilitation standards; team matchmaking |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1B |

## Purpose

Register **canonical Mission categories** used in Stage tables. Categories describe learning modality and Evidence posture. They do **not** encode rewards, XP, or employment claims.

## Category index

| ID | Name |
|----|------|
| ORIENTATION | Orientation |
| KNOWLEDGE | Knowledge |
| SCENARIO | Scenario |
| GUIDED_PRACTICE | Guided Practice |
| INDEPENDENT_PRACTICE | Independent Practice |
| LABORATORY | Laboratory |
| ANALYSIS | Analysis |
| TROUBLESHOOTING | Troubleshooting |
| DESIGN | Design |
| DOCUMENTATION | Documentation |
| ASSESSMENT | Assessment |
| EVIDENCE_PREPARATION | Evidence Preparation |
| TEAM_MISSION | Team Mission |
| LIVE_SKY_MISSION | Live Sky Mission |
| REMEDIATION | Remediation |
| INTEGRATION | Integration |
| CAPSTONE | Capstone |

---

## ORIENTATION

| Dimension | Content |
|-----------|---------|
| **Purpose** | Situate the learner in Route/Stage goals, norms, tooling, and safety expectations |
| **Appropriate use** | STG-01 openers; re-entry after long pause; Extension attach briefings |
| **Inappropriate** | Sole progression mechanism; replacing practice; “watch-only” Capstone |
| **Evidence potential** | Low–Med — orientation checklist, ethics attestation, readiness self-check |
| **Review** | Spot-check completion; enforce mandatory safety/ethics gates |
| **Offline** | High — readable packs work offline |
| **A11y** | High — text-first; captioned overview media |
| **Integrity** | Low risk; still require identity-bound acknowledgment where safety-critical |
| **Safety** | Use to set lab boundaries and prohibited behaviors early |

## KNOWLEDGE

| Dimension | Content |
|-----------|---------|
| **Purpose** | Build conceptual models and vocabulary needed for practice |
| **Appropriate use** | Pre-lab primers; glossaries; concept maps; short explainers |
| **Inappropriate** | Quiz-only mastery claims; dumping vendor certification dumps as GHURAVIA Evidence |
| **Evidence potential** | Low–Med — annotated notes, concept checks tied to later artifacts |
| **Review** | Light; prefer later artifact linkage over isolated scores |
| **Offline** | High |
| **A11y** | High — structured text; RTL-ready; avoid image-only diagrams without alt text |
| **Integrity** | Med — AI can summarize; require later practice citation |
| **Safety** | Avoid fear-mongering; keep PROTECT knowledge defensive |

## SCENARIO

| Dimension | Content |
|-----------|---------|
| **Purpose** | Practice judgment inside a bounded narrative with seeded constraints |
| **Appropriate use** | Incident triage; delivery trade-offs; stakeholder decisions; defensive case packs |
| **Inappropriate** | Live attacks on real targets; real confidential org data; offensive exploitation steps |
| **Evidence potential** | High — decision notes, triage reports, trade-off memos |
| **Review** | Rubric on reasoning quality and proportionality |
| **Offline** | Med–High if scenario pack is downloadable |
| **A11y** | Med–High — structured forms beat dense dashboards |
| **Integrity** | Med — randomize seeds; require scenario-specific constraints |
| **Safety** | Synthetic only; ethics declaration for PROTECT scenarios |

## GUIDED_PRACTICE

| Dimension | Content |
|-----------|---------|
| **Purpose** | Scaffolded do-along practice with hints and checkpoints |
| **Appropriate use** | Early labs; first CLI/console sessions; first git workflows |
| **Inappropriate** | Entire late-Route progression; Capstone replacement |
| **Evidence potential** | Med — checkpoint artifacts, annotated screenshots |
| **Review** | Checklist + spot human review |
| **Offline** | Med — depends on tooling class |
| **A11y** | Med — provide non-mouse paths; captioned demos |
| **Integrity** | Med — unique lab seeds preferred |
| **Safety** | Keep within sandbox quotas and allowlists |

## INDEPENDENT_PRACTICE

| Dimension | Content |
|-----------|---------|
| **Purpose** | Unscaffolded practice of previously guided skills |
| **Appropriate use** | Mid/late Stages after guided exposure |
| **Inappropriate** | First exposure to hazardous tooling; unsupervised offensive tasks (forbidden entirely) |
| **Evidence potential** | High — learner-produced artifacts with minimal template fill |
| **Review** | Rubric; compare against seed expectations |
| **Offline** | Med |
| **A11y** | Med — offer alternate input modes where feasible |
| **Integrity** | Med–High — originality and seed binding matter |
| **Safety** | Same sandbox rules as guided; escalate supervision on PROTECT |

## LABORATORY

| Dimension | Content |
|-----------|---------|
| **Purpose** | Hands-on environment work (cloud sandbox, container, local-safe stack) |
| **Appropriate use** | OPERATE/BUILD/ANALYZE labs; defensive log labs |
| **Inappropriate** | Production tenants; unrestricted internet attack labs; specialized ranges at launch foundations |
| **Evidence potential** | High — configs, logs, before/after diffs, lab telemetry |
| **Review** | Artifact + seed ID; redaction checklist |
| **Offline** | Low–Med — LOCAL-SAFE fallbacks where designed |
| **A11y** | Med — prefer keyboard-friendly consoles; text alternatives |
| **Integrity** | High value when seed-bound |
| **Safety** | Quotas, egress controls, no secrets in Evidence, idle shutdown |

## ANALYSIS

| Dimension | Content |
|-----------|---------|
| **Purpose** | Examine data, signals, or artifacts to produce interpretation |
| **Appropriate use** | ANALYZE Route; observability interpretation; defensive signal reading; delivery metrics lite |
| **Inappropriate** | Claiming statistical certification; using real personal datasets |
| **Evidence potential** | High — charts + interpretation + method steps |
| **Review** | Require interpretation quality, not chart beauty alone |
| **Offline** | Med–High with local datasets |
| **A11y** | Med — text description of visuals required |
| **Integrity** | High AI-draft risk — require reproducible steps |
| **Safety** | Synthetic / permitted lab data only |

## TROUBLESHOOTING

| Dimension | Content |
|-----------|---------|
| **Purpose** | Structured diagnose → isolate → fix → document under faults |
| **Appropriate use** | OPERATE recovery; BUILD debug; defensive triage adjacent |
| **Inappropriate** | Blame-only narratives; destructive “fix” without rollback plan |
| **Evidence potential** | High — timelines, RCA-lite notes, fix logs |
| **Review** | Diagnosis quality + safety of fix |
| **Offline** | Med with local fault packs |
| **A11y** | Med — structured troubleshooting forms |
| **Integrity** | Seed faults; disallow copied answer keys |
| **Safety** | Lab-only; no prod; document residual risk |

## DESIGN

| Dimension | Content |
|-----------|---------|
| **Purpose** | Produce plans, structures, or design choices under constraints |
| **Appropriate use** | LEAD plans; BUILD UI structure; ANALYZE analysis plans; threat models lite (defensive) |
| **Inappropriate** | Senior architect title claims; unbounded greenfield without constraints |
| **Evidence potential** | High — plans, diagrams, decision records |
| **Review** | Constraint fidelity + clarity |
| **Offline** | High |
| **A11y** | High — text + simple diagrams with alt text |
| **Integrity** | Med–High AI prose risk — require rejected alternatives |
| **Safety** | Fictional constraints; no real confidential designs |

## DOCUMENTATION

| Dimension | Content |
|-----------|---------|
| **Purpose** | Produce durable operator/builder/analyst documentation |
| **Appropriate use** | Runbooks, READMEs, escalation notes, decision logs |
| **Inappropriate** | Documentation without practice (paper-only Route) |
| **Evidence potential** | High — portable professional artifacts |
| **Review** | Clarity, completeness, redaction |
| **Offline** | High |
| **A11y** | High |
| **Integrity** | Med — personalize to seed/lab |
| **Safety** | Strip secrets; mark lab context |

## ASSESSMENT

| Dimension | Content |
|-----------|---------|
| **Purpose** | Check readiness or Stage outcomes with governed checks |
| **Appropriate use** | Stage gates; Nest-adjacent checks; integrity challenges |
| **Inappropriate** | Quiz-only Capstone; sole Evidence for Professional Titles |
| **Evidence potential** | Low–Med alone; Med–High when paired with artifacts |
| **Review** | Item quality; bilingual review when Arabic-first |
| **Offline** | High for text assessments |
| **A11y** | High — avoid time-pressure traps unless justified |
| **Integrity** | Item banks; anti-share; variant seeds |
| **Safety** | No harmful actionable offensive content in items |

## EVIDENCE_PREPARATION

| Dimension | Content |
|-----------|---------|
| **Purpose** | Coach learners to package, redact, disclose AI-assist, and submit Evidence |
| **Appropriate use** | Before Capstone; after major labs; portfolio hygiene |
| **Inappropriate** | Substituting for doing the work |
| **Evidence potential** | Med — Evidence packs, disclosure statements |
| **Review** | Completeness of pack + redaction checklist |
| **Offline** | High |
| **A11y** | High — templates and checklists |
| **Integrity** | Central to authenticity |
| **Safety** | Enforce redaction and privacy rules |

## TEAM_MISSION

| Dimension | Content |
|-----------|---------|
| **Purpose** | Coordinated multi-learner practice with role clarity |
| **Appropriate use** | Optional launch Team/Live Sky concepts; LEAD collaboration |
| **Inappropriate** | Required for all foundational Stage progress at constrained capacity |
| **Evidence potential** | High — role artifacts + team retrospective |
| **Review** | Individual contribution must remain attributable |
| **Offline** | Low–Med — sync coordination often needed |
| **A11y** | Med — async-friendly roles preferred |
| **Integrity** | Contribution attribution; anti-free-ride checks |
| **Safety** | Conduct rules; no harassment; lab-only systems |

## LIVE_SKY_MISSION

| Dimension | Content |
|-----------|---------|
| **Purpose** | Facilitated live learning experience (critique, simulation window) |
| **Appropriate use** | Optional enrichment; LEAD critique; selective OPERATE/PROTECT sims |
| **Inappropriate** | Hard dependency for Route exit at launch without facilitation capacity |
| **Evidence potential** | Med–High — session artifacts + reflection |
| **Review** | Facilitator rubric + learner artifact |
| **Offline** | Low |
| **A11y** | Med — provide catch-up packs |
| **Integrity** | Attendance ≠ Evidence; artifact still required |
| **Safety** | Facilitator controls; scenario boundaries |

## REMEDIATION

| Dimension | Content |
|-----------|---------|
| **Purpose** | Recover from failed checks, weak Evidence, or Nest capability gaps |
| **Appropriate use** | Micro-Missions; ethics reset; retry labs |
| **Inappropriate** | Primary “content path” disguising weak Stage design |
| **Evidence potential** | Med — revised artifacts |
| **Review** | Confirm gap closed |
| **Offline** | Med–High |
| **A11y** | High — short, structured refreshers |
| **Integrity** | New seed on retry when needed |
| **Safety** | Re-assert safety gates after ethics/safety fails |

## INTEGRATION

| Dimension | Content |
|-----------|---------|
| **Purpose** | Force combined practice across Horizons / source Routes |
| **Appropriate use** | Cross-Wing Integration Missions; light bridges on host Routes |
| **Inappropriate** | Fake title mashups without dual Evidence; duplicating full second Route |
| **Evidence potential** | High — dual-horizon Evidence packs |
| **Review** | Dual checklist (e.g. BUILD+PROTECT) |
| **Offline** | Med |
| **A11y** | Med — higher cognitive load; scaffold |
| **Integrity** | Seeded finding + unique delta |
| **Safety** | Lab-only; residual risk documentation |

## CAPSTONE

| Dimension | Content |
|-----------|---------|
| **Purpose** | Culminating Evidence experience proving Route capability statement |
| **Appropriate use** | `{ROUTE}-CAP-01` after Stages + required EVD |
| **Inappropriate** | Mid-Route filler; quiz-only finale; senior title award |
| **Evidence potential** | Highest — portfolio-grade pack |
| **Review** | Full rubric; human review capacity planned |
| **Offline** | Depends on Route tooling; must document fallback |
| **A11y** | Must offer fair production paths |
| **Integrity** | Seed + originality + AI disclosure |
| **Safety** | Same as Route Horizon rules; public portfolio sanitization |

---

## Mixing rules (Stage design)

| Pattern | Guidance |
|---------|----------|
| Early Stage | ORIENTATION + KNOWLEDGE + GUIDED_PRACTICE |
| Mid Stage | LABORATORY / SCENARIO / ANALYSIS / TROUBLESHOOTING + DOCUMENTATION |
| Late Stage | INDEPENDENT_PRACTICE + EVIDENCE_PREPARATION + ASSESSMENT |
| Exit | CAPSTONE (Route-level), not an extra Stage by default |
| Recovery | REMEDIATION without blocking catalogue architecture |

## Non-goals

- No XP weights per category  
- No Product Codes per category  
- No employment signaling from category completion alone  
