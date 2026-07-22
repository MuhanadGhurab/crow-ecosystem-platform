# GHURAVIA Nest Readiness Fixture Catalogue v0.1.0

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-NEST-RDY-FIX-001 |
| **Version** | **0.1.0** |
| **Status** | **TECHNICAL FIXTURE ONLY · LOCAL / AUTOMATED TEST ONLY** |
| **Gate** | GHV.IMPLEMENTATION.0E |
| **Authorization** | GHV-IMP-AUTH-005 |

## Explicit non-claims

```text
NOT PRODUCTION CONTENT
NOT EXPERT REVIEWED
NOT PILOT VALIDATED
NOT PUBLICATION READY
NOT A CREDENTIAL
NOT EVIDENCE
NOT MASTERY
Does not prove real-world digital competence.
```

## Scoring

| Field | Value |
|-------|-------|
| Items | 10 deterministic single-select scenarios |
| Options | 4 per item (`OPT-A` … `OPT-D`) |
| Correct | 1 per item |
| Points | 10 per correct item |
| Total | 100 |
| Percentage | `round((correctAnswers / totalItems) * 100)` |
| Thresholds | ≥70 READY_TO_FLY · ≥50 &lt;70 GUIDED_SKIP · &lt;50 NEST_RECOMMENDED |

## Capability coverage (all 13 required)

| Item | Capabilities |
|------|----------------|
| NST-RDY-001 | NST-CAP-001, NST-CAP-012 |
| NST-RDY-002 | NST-CAP-002 |
| NST-RDY-003 | NST-CAP-003, NST-CAP-009 |
| NST-RDY-004 | NST-CAP-004 |
| NST-RDY-005 | NST-CAP-005 |
| NST-RDY-006 | NST-CAP-006 |
| NST-RDY-007 | NST-CAP-007 |
| NST-RDY-008 | NST-CAP-008, NST-CAP-013 |
| NST-RDY-009 | NST-CAP-010 |
| NST-RDY-010 | NST-CAP-011 |

## Items (canonical Product Code must match)

### NST-RDY-001 — Device vs account problem
- **EN prompt:** Your tablet will not open a learning app. Other apps work. What is the safest first check?
- **AR prompt:** جهازك اللوحي لا يفتح تطبيق تعلم بينما التطبيقات الأخرى تعمل. ما أول فحص آمن؟
- **Correct:** OPT-B
- **OPT-A:** Share your account password with a stranger for help
- **OPT-B:** Check whether the app needs an update or a restart, without sharing secrets
- **OPT-C:** Disable the device lock screen permanently
- **OPT-D:** Post your recovery codes in a public chat
- **Explanation EN:** Start with low-risk isolation (update/restart) before escalating; never share secrets.

### NST-RDY-002 — App permissions
- **EN:** A flashlight app asks for contacts and microphone. Best action?
- **AR:** تطبيق مصباح يطلب جهات الاتصال والميكروفون. أفضل تصرف؟
- **Correct:** OPT-C
- **OPT-A:** Grant all permissions immediately
- **OPT-B:** Grant contacts only because it is convenient
- **OPT-C:** Deny unrelated permissions and use a simpler trusted tool if needed
- **OPT-D:** Send the app your national ID to unlock features
- **Explanation EN:** Grant least privilege; unrelated permissions are a risk cue.

### NST-RDY-003 — Browser / phishing cue
- **EN:** A message says “Verify your account” with a shortened link and urgent tone. Best next step?
- **AR:** رسالة تقول «تحقق من حسابك» مع رابط مختصر ونبرة عاجلة. أفضل خطوة؟
- **Correct:** OPT-A
- **OPT-A:** Open the official site yourself from a bookmark or typed address; do not use the message link
- **OPT-B:** Click the link quickly before it expires
- **OPT-C:** Reply with your password to confirm
- **OPT-D:** Forward the link to everyone you know
- **Explanation EN:** Urgency + unexpected links are common scam patterns; use known official entry points.

### NST-RDY-004 — Files and sharing
- **EN:** You need to share a practice file with one teammate. Safest habit?
- **AR:** تحتاج مشاركة ملف تمرين مع زميل واحد. العادة الأسلم؟
- **Correct:** OPT-D
- **OPT-A:** Make the folder public to the whole internet
- **OPT-B:** Put secrets in the filename
- **OPT-C:** Share with “anyone with the link” forever by default
- **OPT-D:** Share with the specific person and least-needed permission
- **Explanation EN:** Least privilege sharing reduces accidental exposure.

### NST-RDY-005 — Passwords
- **EN:** How should you store unique account passwords for learning tools?
- **AR:** كيف تخزّن كلمات مرور فريدة لأدوات التعلم؟
- **Correct:** OPT-B
- **OPT-A:** Reuse one short password everywhere
- **OPT-B:** Use a password manager (or another safe unique-password habit); never paste real passwords into assessments
- **OPT-C:** Email yourself passwords in plain text weekly
- **OPT-D:** Write them on a public classroom whiteboard
- **Explanation EN:** Unique passwords and a manager habit beat reuse; assessments never collect real secrets.

### NST-RDY-006 — MFA
- **EN:** Your account offers MFA. Which practice is safest?
- **AR:** حسابك يوفّر المصادقة متعددة العوامل. أي ممارسة أسلم؟
- **Correct:** OPT-A
- **OPT-A:** Enroll MFA and store recovery materials privately offline or in a secure vault — never in chat
- **OPT-B:** Share MFA codes with coworkers for convenience
- **OPT-C:** Approve every MFA prompt even if you did not sign in
- **OPT-D:** Disable MFA because it slows you down
- **Explanation EN:** MFA reduces account takeover risk; prompt bombing and shared codes are unsafe.

### NST-RDY-007 — Public Wi-Fi
- **EN:** You are on public café Wi-Fi. Safer habit?
- **AR:** أنت على شبكة واي فاي عامة في مقهى. عادة أكثر أمانًا؟
- **Correct:** OPT-C
- **OPT-A:** Enter banking passwords on any open page
- **OPT-B:** Disable all updates forever while traveling
- **OPT-C:** Prefer sensitive account work on trusted networks or a personal hotspot; avoid unnecessary logins on open Wi-Fi
- **OPT-D:** Broadcast your session cookies in a group chat
- **Explanation EN:** Public Wi-Fi increases interception risk; reduce sensitive sessions when possible.

### NST-RDY-008 — Privacy and digital identity
- **EN:** Building a public learning profile. Best practice?
- **AR:** عند بناء ملف تعلّم عام. أفضل ممارسة؟
- **Correct:** OPT-B
- **OPT-A:** Publish home address and national ID for “credibility”
- **OPT-B:** Minimize personal data; separate personal vs learning identity cues; review what is public
- **OPT-C:** Use the same password as your email in the bio
- **OPT-D:** Post private recovery codes as “backup”
- **Explanation EN:** Footprint minimization and identity separation reduce doxxing/scam risk.

### NST-RDY-009 — AI literacy
- **EN:** An AI tool invents a citation that looks real. What should you do?
- **AR:** أداة ذكاء اصطناعي تختلق استشهادًا يبدو حقيقيًا. ماذا تفعل؟
- **Correct:** OPT-D
- **OPT-A:** Paste your API keys into the chat to “improve accuracy”
- **OPT-B:** Trust the citation without checking
- **OPT-C:** Claim the AI output as verified fact
- **OPT-D:** Verify important claims with reliable sources; never paste secrets into tools
- **Explanation EN:** AI can invent; verify and protect secrets.

### NST-RDY-010 — Collaboration
- **EN:** A teammate asks you to edit a shared doc. Responsible habit?
- **AR:** يطلب زميل تعديل مستند مشترك. عادة مسؤولة؟
- **Correct:** OPT-A
- **OPT-A:** Use shared editing with clear attribution; escalate blockers; do not remove others’ credit
- **OPT-B:** Delete their sections silently to “speed up”
- **OPT-C:** Share the doc publicly without asking
- **OPT-D:** Paste classmates’ private emails into a public forum
- **Explanation EN:** Collaboration needs attribution, consent, and respectful conflict handling.

## Weak capability rule

Union of capability IDs mapped from **incorrect** items; unique; stable ascending ID order. Never from Origin.

## Product Code mirror

Canonical machine catalogue MUST live in repository Product Code (e.g. `packages/domain` / `packages/contracts`) with identical IDs, correct options, and capability maps.
