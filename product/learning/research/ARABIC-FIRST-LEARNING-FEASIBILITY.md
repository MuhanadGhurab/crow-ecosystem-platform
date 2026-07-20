# Arabic-First Learning Feasibility

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-AR-FEAS-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Access date** | 2026-07-21 |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [LEARNING-RESEARCH-METHODOLOGY.md](./LEARNING-RESEARCH-METHODOLOGY.md) · [ROUTE-CANDIDATE-REGISTER.md](../routes/ROUTE-CANDIDATE-REGISTER.md) · [LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md](../routes/LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md) · [ROLE-AND-TITLE-BOUNDARIES.md](./ROLE-AND-TITLE-BOUNDARIES.md) |
| **Supporting sources** | SRC-* (role/capability language); Arabic UX / bidi practice themes (provisional) |
| **Limitations** | Feasibility judgments are research-only; no Product Codes; no certification or employment promises; Saudi relevance ≠ endorsement of Vision 2030 / NCA / SDAIA / any vendor; bilingual samples not yet expert-reviewed |
| **Unresolved** | Arabic reviewer panel; Mission-level glossary pilots; bidi lab UI standards (LEARNING.1B); Evidence rubrics in Arabic |
| **Change history** | 1.0.0 (2026-07-21) — Initial RESEARCH BASELINE for GHV.LEARNING.1A |

## Purpose

Assess whether launch Routes can be delivered as **Arabic-first learning** — instruction, terminology discipline, examples, and Evidence guidance designed for Arabic-primary learners — without reducing Arabic to superficial UI chrome.

## Non-negotiable product rule

```text
Arabic-first ≠ UI string translation.
```

Arabic-first means:

- Mission narratives, explanations, and rubrics authored for Arabic-primary learners  
- Domain concepts explained in clear Arabic **with** required English technical terms retained where industry practice demands them  
- Bidirectional (bidi) layout for mixed Arabic/English content, including code and CLI  
- Cultural and Saudi-context examples that remain internationally portable  
- Reviewers who can judge Arabic instructional quality, not only translation accuracy  

Status of all portfolio IDs in this Gate: **NOT LOCKED** (lock deferred to GHV.LEARNING.1D).

## Portfolio under assessment (NOT LOCKED)

| ID | Working title | Band |
|----|---------------|------|
| RC-OPR-001 | Cloud Systems Operations Foundations | Launch |
| RC-BLD-001 | Web Application Delivery Foundations | Launch |
| RC-PRT-001 | Defensive Security Operations Foundations | Launch |
| RC-LED-001 | Technology Delivery & Risk Foundations | Launch |
| RC-ANL-001 | Practical Data Analysis Foundations | Launch alternative |
| CXW-001 | Secure Application Delivery | Launch Cross-Wing |
| SEX-001 | Secure Cloud Operations Extension | Launch Secure Extension |

---

## Feasibility dimensions (apply per Route)

| Dimension | Question |
|-----------|----------|
| **Arabic terminology** | Can core concepts be taught in accurate Arabic without inventing unstable jargon? |
| **English tech terms required** | Which tokens must stay English (CLI, APIs, CVE, IAM, SQL, git)? |
| **Bidi** | Can Arabic prose + LTR identifiers/code coexist without broken layout or copy-paste traps? |
| **CLI / code display** | Are terminals, diffs, and logs readable and teachable in RTL-primary pages? |
| **Source availability** | Are Tier 1–3 sources usable as Arabic teaching anchors, or English-primary with Arabic mediation? |
| **Reviewer availability** | Can bilingual subject-matter reviewers score Arabic instructional quality? |
| **Translation risk** | Where does machine/literal translation produce unsafe or wrong security/ops meaning? |
| **Cultural examples** | Can scenarios feel local without excluding international learners? |
| **Saudi context** | Relevance for Saudi digital workforce themes — **not endorsement** |
| **International portability** | Do Evidence artifacts remain readable to global reviewers/employers? |

---

## RC-OPR-001 — Cloud Systems Operations Foundations

| Dimension | Assessment |
|-----------|------------|
| **Arabic terminology** | Strong — operations concepts (مراقبة، تغيير، حادثة، صلاحيات) map cleanly; keep vendor/cloud nouns English |
| **English tech terms required** | IAM, VPC/subnet, CPU, disk, quota, CLI commands, log field names, ticket IDs |
| **Bidi** | Medium–High effort — runbooks mix Arabic steps with LTR resource names |
| **CLI / code display** | Feasible with LTR code blocks, copy buttons, and “do not reverse command order” callouts |
| **Source availability** | Cloud docs largely English; teach from Arabic narrative + English console/CLI |
| **Reviewer availability** | Ops bilingual reviewers findable; cloud console UI churn raises review load |
| **Translation risk** | Medium — “privilege,” “role,” “policy” false friends; keep English IAM terms |
| **Cultural examples** | Maintenance windows, shared accounts, cost surprises — portable across regions |
| **Saudi context** | High relevance to cloud/digital ops hiring patterns; **not endorsement** |
| **International portability** | High if Evidence keeps English identifiers + Arabic reflection optional/supplemental |
| **Arabic-first verdict** | **Feasible** with glossary + bidi runbook templates |

---

## RC-BLD-001 — Web Application Delivery Foundations

| Dimension | Assessment |
|-----------|------------|
| **Arabic terminology** | Strong for process (إصدار، مراجعة، نشر); language/framework names stay English |
| **English tech terms required** | git, commit, PR/MR, HTTP, HTML/CSS/JS, CI, README, dependency names |
| **Bidi** | High — repos, diffs, and error messages are LTR-dominant |
| **CLI / code display** | Critical — full LTR panes for terminal/editor; Arabic only in Mission prose and comments where safe |
| **Source availability** | Framework docs English-primary; OWASP patterns English; Arabic mediation required |
| **Reviewer availability** | Bilingual web engineers available; need reviewers who refuse “translated variable names” |
| **Translation risk** | High if code identifiers or commit messages are forcibly Arabicized — **forbid** for Evidence |
| **Cultural examples** | Local-service mock apps OK if domain-neutral and privacy-safe |
| **Saudi context** | Relevant to digital product delivery demand; **not endorsement** |
| **International portability** | Highest when Evidence is English-repo + Arabic learning journal optional |
| **Arabic-first verdict** | **Feasible** if Arabic teaches *why/how* and English owns *code surface* |

---

## RC-PRT-001 — Defensive Security Operations Foundations

| Dimension | Assessment |
|-----------|------------|
| **Arabic terminology** | Medium — defensive concepts teachable; many control/threat terms unstable if invented |
| **English tech terms required** | Alert, IOC, CVE, SIEM field names, MITRE-style tactic labels (as labels), playbook step IDs |
| **Bidi** | High — timelines and log excerpts must stay LTR chronological |
| **CLI / code display** | Feasible with scenario packets in LTR; no live attack tooling in Arabic or English |
| **Source availability** | NICE / SCyWF / CSF language English or bilingual frameworks; Arabic mediation careful |
| **Reviewer availability** | Scarcer — need security + Arabic instructional reviewers; ethics review mandatory |
| **Translation risk** | **High** — mistranslating severity, containment, or “offensive” vs defensive guidance is unsafe |
| **Cultural examples** | Phishing / misuse scenarios must avoid real orgs, real persons, and sensational framing |
| **Saudi context** | High workforce-framework relevance (reference only); **not endorsement** |
| **International portability** | Keep case IDs, IOCs, and technical fields English; Arabic for reasoning narrative |
| **Arabic-first verdict** | **Feasible with elevated review bar** — glossary locked before Mission authoring |

---

## RC-LED-001 — Technology Delivery & Risk Foundations

| Dimension | Assessment |
|-----------|------------|
| **Arabic terminology** | Strong — plan, risk, stakeholder, priority map well |
| **English tech terms required** | RACI, risk ID, SLA (as industry acronym), ticket/system names if used |
| **Bidi** | Lower — mostly prose/tables; still need LTR IDs in registers |
| **CLI / code display** | Minimal |
| **Source availability** | Delivery/risk practice themes portable; avoid cert-prep framing |
| **Reviewer availability** | Good — bilingual PMO/delivery reviewers more available than deep security |
| **Translation risk** | Medium — “lead,” “manager,” “governance” can inflate titles (see ROLE-AND-TITLE-BOUNDARIES) |
| **Cultural examples** | Cross-team delivery friction, change freezes — portable |
| **Saudi context** | Aligns with human-capability / digital delivery themes; **not endorsement** |
| **International portability** | High — plans/risk registers with dual-language notes work well |
| **Arabic-first verdict** | **Strongly feasible** — guard against senior-title language in beginner Stages |

---

## RC-ANL-001 — Practical Data Analysis Foundations (launch alternative)

| Dimension | Assessment |
|-----------|------------|
| **Arabic terminology** | Medium–Strong for analysis process; chart/stat terms need glossary |
| **English tech terms required** | SQL, CSV, join, null, notebook, library names, column names in datasets |
| **Bidi** | High — tables and notebooks LTR; Arabic captions around them |
| **CLI / code display** | Same rule as BUILD: code/SQL stay English tokens |
| **Source availability** | Tool docs English-primary; national AI/data literacy themes for relevance only |
| **Reviewer availability** | Medium — bilingual data practitioners; watch for overclaiming “AI expert” language |
| **Translation risk** | Medium — statistical terms; PII/privacy wording must stay precise |
| **Cultural examples** | Synthetic public-interest datasets preferred over scraped personal data |
| **Saudi context** | Strategic data/AI literacy relevance; **not endorsement** |
| **International portability** | High with English analysis artifacts + Arabic interpretation notes |
| **Arabic-first verdict** | **Feasible** if privacy examples and SQL surface stay disciplined |

---

## CXW-001 — Secure Application Delivery (Cross-Wing)

| Dimension | Assessment |
|-----------|------------|
| **Arabic terminology** | Combines BUILD + PROTECT loads — glossary must merge both Horizons |
| **English tech terms required** | Full BUILD set + secure delivery terms (SAST labels, dependency CVE IDs, secret scanning) |
| **Bidi** | Highest among portfolio — integration Evidence spans prose, repo, and security notes |
| **CLI / code display** | Mandatory LTR tooling panes; Arabic Integration Mission narrative |
| **Source availability** | Multi-source; reject mashup titles without Atlas (DEC-015 spirit) |
| **Reviewer availability** | Needs dual-competence reviewers (app delivery + secure practice) in Arabic |
| **Translation risk** | High — “secure” marketing language vs demonstrated secure practice |
| **Cultural examples** | Delivery under constraint; no real customer data |
| **Saudi context** | Relevant to secure digital product delivery; **not endorsement** |
| **International portability** | Evidence portfolio must remain inspectable internationally |
| **Arabic-first verdict** | **Feasible after source Route glossaries** — do not author CW Arabic first |

---

## SEX-001 — Secure Cloud Operations Extension

| Dimension | Assessment |
|-----------|------------|
| **Arabic terminology** | Extends OPR glossary with least-privilege / logging / hardening language |
| **English tech terms required** | Same as RC-OPR-001 plus policy JSON/YAML keys, audit log fields |
| **Bidi** | Same ops runbook challenges + security config snippets |
| **CLI / code display** | LTR configs; Arabic explains *why* a setting is safer |
| **Source availability** | Host Route RC-OPR-001 must exist in Arabic-first form first |
| **Reviewer availability** | Ops + security bilingual reviewers; overlap with PRT review capacity |
| **Translation risk** | High for privilege and exposure language |
| **Cultural examples** | Shared credentials, over-broad roles — universal, locally framed |
| **Saudi context** | Cloud hardening relevance; **not endorsement**; not a full PROTECT Route |
| **International portability** | High if Evidence shows configs + Arabic decision notes |
| **Arabic-first verdict** | **Feasible as extension layer** after RC-OPR-001 Arabic baseline |

---

## Cross-cutting controls

1. **Glossary before Missions** — locked Arabic↔English term pairs per Horizon; English tech tokens marked `KEEP-EN`.  
2. **Code/CLI never RTL-forced** — display in LTR islands; teach copy-paste hygiene.  
3. **Evidence language policy** — technical artifacts default English identifiers; Arabic allowed for reflection/rationale fields.  
4. **No superficial localization** — UI RTL alone does not satisfy Arabic-first.  
5. **Reviewer gate** — Arabic instructional review required before PUBLISHED (see CONTENT-FRESHNESS-AND-LIFECYCLE).  
6. **No employment / cert promises** in Arabic or English marketing copy.  
7. **No Product Codes** in this Gate.

## Overall research conclusion

Launch portfolio is **Arabic-first feasible** with differentiated effort: LEAD easiest; BUILD/ANALYZE code-surface heavy; PROTECT/SEX/CXW require elevated bilingual security review. All IDs remain **NOT LOCKED**.

## Explicit non-claims

- Does not claim GHURAVIA is endorsed by any Saudi or international authority.  
- Does not promise employment, promotion, visa, or salary outcomes.  
- Does not equate Route completion with professional titles (see ROLE-AND-TITLE-BOUNDARIES → GHV.PROGRESSION.1).
