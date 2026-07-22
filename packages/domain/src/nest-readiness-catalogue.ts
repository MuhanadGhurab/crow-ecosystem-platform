/**
 * Nest readiness fixture catalogue v0.1.0 — TECHNICAL / LOCAL TEST ONLY.
 * NOT production content · NOT expert reviewed · NOT pilot validated.
 * Mirrors governance/implementation/GHURAVIA-NEST-READINESS-FIXTURE-CATALOGUE-v0.1.0.md
 */

export const NEST_READINESS_CATALOGUE_VERSION = "0.1.0" as const;

export type NestCapabilityId =
  | "NST-CAP-001"
  | "NST-CAP-002"
  | "NST-CAP-003"
  | "NST-CAP-004"
  | "NST-CAP-005"
  | "NST-CAP-006"
  | "NST-CAP-007"
  | "NST-CAP-008"
  | "NST-CAP-009"
  | "NST-CAP-010"
  | "NST-CAP-011"
  | "NST-CAP-012"
  | "NST-CAP-013";

export type NestReadinessOptionId = `${string}-OPT-${"A" | "B" | "C" | "D"}`;

export type NestReadinessOption = {
  id: string;
  labelEn: string;
  labelAr: string;
};

export type NestReadinessItem = {
  id: string;
  promptEn: string;
  promptAr: string;
  explanationEn: string;
  explanationAr: string;
  capabilityIds: readonly NestCapabilityId[];
  options: readonly NestReadinessOption[];
  correctOptionId: string;
};

export const NEST_READINESS_ITEMS: readonly NestReadinessItem[] = [
  {
    id: "NST-RDY-001",
    promptEn:
      "Your tablet will not open a learning app. Other apps work. What is the safest first check?",
    promptAr:
      "جهازك اللوحي لا يفتح تطبيق تعلم بينما التطبيقات الأخرى تعمل. ما أول فحص آمن؟",
    explanationEn:
      "Start with low-risk isolation (update/restart) before escalating; never share secrets.",
    explanationAr:
      "ابدأ بعزل منخفض المخاطر (تحديث/إعادة تشغيل) قبل التصعيد؛ لا تشارك الأسرار أبدًا.",
    capabilityIds: ["NST-CAP-001", "NST-CAP-012"],
    correctOptionId: "NST-RDY-001-OPT-B",
    options: [
      {
        id: "NST-RDY-001-OPT-A",
        labelEn: "Share your account password with a stranger for help",
        labelAr: "شارك كلمة مرور حسابك مع غريب للمساعدة",
      },
      {
        id: "NST-RDY-001-OPT-B",
        labelEn:
          "Check whether the app needs an update or a restart, without sharing secrets",
        labelAr:
          "تحقق مما إذا كان التطبيق يحتاج تحديثًا أو إعادة تشغيل دون مشاركة أسرار",
      },
      {
        id: "NST-RDY-001-OPT-C",
        labelEn: "Disable the device lock screen permanently",
        labelAr: "عطّل قفل الشاشة نهائيًا",
      },
      {
        id: "NST-RDY-001-OPT-D",
        labelEn: "Post your recovery codes in a public chat",
        labelAr: "انشر رموز الاستعادة في دردشة عامة",
      },
    ],
  },
  {
    id: "NST-RDY-002",
    promptEn: "A flashlight app asks for contacts and microphone. Best action?",
    promptAr: "تطبيق مصباح يطلب جهات الاتصال والميكروفون. أفضل تصرف؟",
    explanationEn:
      "Grant least privilege; unrelated permissions are a risk cue.",
    explanationAr: "امنح أقل صلاحية لازمة؛ الصلاحيات غير المرتبطة إشارة خطر.",
    capabilityIds: ["NST-CAP-002"],
    correctOptionId: "NST-RDY-002-OPT-C",
    options: [
      {
        id: "NST-RDY-002-OPT-A",
        labelEn: "Grant all permissions immediately",
        labelAr: "امنح كل الصلاحيات فورًا",
      },
      {
        id: "NST-RDY-002-OPT-B",
        labelEn: "Grant contacts only because it is convenient",
        labelAr: "امنح جهات الاتصال فقط لأنه مريح",
      },
      {
        id: "NST-RDY-002-OPT-C",
        labelEn:
          "Deny unrelated permissions and use a simpler trusted tool if needed",
        labelAr: "ارفض الصلاحيات غير المرتبطة واستخدم أداة موثوقة أبسط إن لزم",
      },
      {
        id: "NST-RDY-002-OPT-D",
        labelEn: "Send the app your national ID to unlock features",
        labelAr: "أرسل للتطبيق هويتك الوطنية لفتح الميزات",
      },
    ],
  },
  {
    id: "NST-RDY-003",
    promptEn:
      'A message says "Verify your account" with a shortened link and urgent tone. Best next step?',
    promptAr:
      "رسالة تقول «تحقق من حسابك» مع رابط مختصر ونبرة عاجلة. أفضل خطوة؟",
    explanationEn:
      "Urgency + unexpected links are common scam patterns; use known official entry points.",
    explanationAr:
      "الاستعجال والروابط غير المتوقعة أنماط احتيال شائعة؛ استخدم مداخل رسمية معروفة.",
    capabilityIds: ["NST-CAP-003", "NST-CAP-009"],
    correctOptionId: "NST-RDY-003-OPT-A",
    options: [
      {
        id: "NST-RDY-003-OPT-A",
        labelEn:
          "Open the official site yourself from a bookmark or typed address; do not use the message link",
        labelAr:
          "افتح الموقع الرسمي بنفسك من إشارة مرجعية أو عنوان مكتوب؛ لا تستخدم رابط الرسالة",
      },
      {
        id: "NST-RDY-003-OPT-B",
        labelEn: "Click the link quickly before it expires",
        labelAr: "انقر الرابط بسرعة قبل انتهاء صلاحيته",
      },
      {
        id: "NST-RDY-003-OPT-C",
        labelEn: "Reply with your password to confirm",
        labelAr: "أجب بكلمة مرورك للتأكيد",
      },
      {
        id: "NST-RDY-003-OPT-D",
        labelEn: "Forward the link to everyone you know",
        labelAr: "أعد توجيه الرابط لكل من تعرفهم",
      },
    ],
  },
  {
    id: "NST-RDY-004",
    promptEn:
      "You need to share a practice file with one teammate. Safest habit?",
    promptAr: "تحتاج مشاركة ملف تمرين مع زميل واحد. العادة الأسلم؟",
    explanationEn: "Least privilege sharing reduces accidental exposure.",
    explanationAr: "المشاركة بأقل صلاحية تقلل التعرض العرضي.",
    capabilityIds: ["NST-CAP-004"],
    correctOptionId: "NST-RDY-004-OPT-D",
    options: [
      {
        id: "NST-RDY-004-OPT-A",
        labelEn: "Make the folder public to the whole internet",
        labelAr: "اجعل المجلد عامًا للإنترنت كله",
      },
      {
        id: "NST-RDY-004-OPT-B",
        labelEn: "Put secrets in the filename",
        labelAr: "ضع أسرارًا في اسم الملف",
      },
      {
        id: "NST-RDY-004-OPT-C",
        labelEn: 'Share with "anyone with the link" forever by default',
        labelAr: "شارك مع «أي شخص لديه الرابط» إلى الأبد افتراضيًا",
      },
      {
        id: "NST-RDY-004-OPT-D",
        labelEn: "Share with the specific person and least-needed permission",
        labelAr: "شارك مع الشخص المحدد وبأقل صلاحية لازمة",
      },
    ],
  },
  {
    id: "NST-RDY-005",
    promptEn:
      "How should you store unique account passwords for learning tools?",
    promptAr: "كيف تخزّن كلمات مرور فريدة لأدوات التعلم؟",
    explanationEn:
      "Unique passwords and a manager habit beat reuse; assessments never collect real secrets.",
    explanationAr:
      "كلمات المرور الفريدة ومدير كلمات المرور أفضل من إعادة الاستخدام؛ التقييمات لا تجمع أسرارًا حقيقية.",
    capabilityIds: ["NST-CAP-005"],
    correctOptionId: "NST-RDY-005-OPT-B",
    options: [
      {
        id: "NST-RDY-005-OPT-A",
        labelEn: "Reuse one short password everywhere",
        labelAr: "أعد استخدام كلمة مرور قصيرة واحدة في كل مكان",
      },
      {
        id: "NST-RDY-005-OPT-B",
        labelEn:
          "Use a password manager (or another safe unique-password habit); never paste real passwords into assessments",
        labelAr:
          "استخدم مدير كلمات مرور (أو عادة آمنة لكلمات فريدة)؛ لا تلصق كلمات مرور حقيقية في التقييمات",
      },
      {
        id: "NST-RDY-005-OPT-C",
        labelEn: "Email yourself passwords in plain text weekly",
        labelAr: "أرسل كلمات المرور لنفسك بنص واضح أسبوعيًا",
      },
      {
        id: "NST-RDY-005-OPT-D",
        labelEn: "Write them on a public classroom whiteboard",
        labelAr: "اكتبها على سبورة صف عامة",
      },
    ],
  },
  {
    id: "NST-RDY-006",
    promptEn: "Your account offers MFA. Which practice is safest?",
    promptAr: "حسابك يوفّر المصادقة متعددة العوامل. أي ممارسة أسلم؟",
    explanationEn:
      "MFA reduces account takeover risk; prompt bombing and shared codes are unsafe.",
    explanationAr:
      "المصادقة متعددة العوامل تقلل اختطاف الحساب؛ مشاركة الرموز والموافقة العشوائية غير آمنة.",
    capabilityIds: ["NST-CAP-006"],
    correctOptionId: "NST-RDY-006-OPT-A",
    options: [
      {
        id: "NST-RDY-006-OPT-A",
        labelEn:
          "Enroll MFA and store recovery materials privately offline or in a secure vault — never in chat",
        labelAr:
          "فعّل المصادقة متعددة العوامل واحفظ مواد الاستعادة خاصًا دون اتصال أو في خزنة آمنة — لا في الدردشة",
      },
      {
        id: "NST-RDY-006-OPT-B",
        labelEn: "Share MFA codes with coworkers for convenience",
        labelAr: "شارك رموز المصادقة مع الزملاء للراحة",
      },
      {
        id: "NST-RDY-006-OPT-C",
        labelEn: "Approve every MFA prompt even if you did not sign in",
        labelAr: "وافق على كل طلب مصادقة حتى إن لم تسجّل الدخول",
      },
      {
        id: "NST-RDY-006-OPT-D",
        labelEn: "Disable MFA because it slows you down",
        labelAr: "عطّل المصادقة لأنها تبطئك",
      },
    ],
  },
  {
    id: "NST-RDY-007",
    promptEn: "You are on public café Wi-Fi. Safer habit?",
    promptAr: "أنت على شبكة واي فاي عامة في مقهى. عادة أكثر أمانًا؟",
    explanationEn:
      "Public Wi-Fi increases interception risk; reduce sensitive sessions when possible.",
    explanationAr:
      "الواي فاي العام يزيد خطر الاعتراض؛ قلّل الجلسات الحساسة عند الإمكان.",
    capabilityIds: ["NST-CAP-007"],
    correctOptionId: "NST-RDY-007-OPT-C",
    options: [
      {
        id: "NST-RDY-007-OPT-A",
        labelEn: "Enter banking passwords on any open page",
        labelAr: "أدخل كلمات مرور مصرفية على أي صفحة مفتوحة",
      },
      {
        id: "NST-RDY-007-OPT-B",
        labelEn: "Disable all updates forever while traveling",
        labelAr: "عطّل كل التحديثات إلى الأبد أثناء السفر",
      },
      {
        id: "NST-RDY-007-OPT-C",
        labelEn:
          "Prefer sensitive account work on trusted networks or a personal hotspot; avoid unnecessary logins on open Wi-Fi",
        labelAr:
          "فضّل العمل الحساس على شبكات موثوقة أو نقطة اتصال شخصية؛ تجنّب تسجيلات الدخول غير اللازمة على واي فاي مفتوح",
      },
      {
        id: "NST-RDY-007-OPT-D",
        labelEn: "Broadcast your session cookies in a group chat",
        labelAr: "انشر ملفات تعريف جلستك في دردشة جماعية",
      },
    ],
  },
  {
    id: "NST-RDY-008",
    promptEn: "Building a public learning profile. Best practice?",
    promptAr: "عند بناء ملف تعلّم عام. أفضل ممارسة؟",
    explanationEn:
      "Footprint minimization and identity separation reduce doxxing/scam risk.",
    explanationAr: "تقليل البصمة وفصل الهويات يقللان مخاطر التعرض والاحتيال.",
    capabilityIds: ["NST-CAP-008", "NST-CAP-013"],
    correctOptionId: "NST-RDY-008-OPT-B",
    options: [
      {
        id: "NST-RDY-008-OPT-A",
        labelEn: 'Publish home address and national ID for "credibility"',
        labelAr: "انشر عنوان المنزل والهوية الوطنية من أجل «المصداقية»",
      },
      {
        id: "NST-RDY-008-OPT-B",
        labelEn:
          "Minimize personal data; separate personal vs learning identity cues; review what is public",
        labelAr:
          "قلّل البيانات الشخصية؛ افصل إشارات الهوية الشخصية عن التعلّم؛ راجع ما هو عام",
      },
      {
        id: "NST-RDY-008-OPT-C",
        labelEn: "Use the same password as your email in the bio",
        labelAr: "ضع نفس كلمة مرور بريدك في النبذة",
      },
      {
        id: "NST-RDY-008-OPT-D",
        labelEn: 'Post private recovery codes as "backup"',
        labelAr: "انشر رموز الاستعادة الخاصة كـ«نسخة احتياطية»",
      },
    ],
  },
  {
    id: "NST-RDY-009",
    promptEn:
      "An AI tool invents a citation that looks real. What should you do?",
    promptAr: "أداة ذكاء اصطناعي تختلق استشهادًا يبدو حقيقيًا. ماذا تفعل؟",
    explanationEn: "AI can invent; verify and protect secrets.",
    explanationAr: "الذكاء الاصطناعي قد يختلق؛ تحقّق واحمِ الأسرار.",
    capabilityIds: ["NST-CAP-010"],
    correctOptionId: "NST-RDY-009-OPT-D",
    options: [
      {
        id: "NST-RDY-009-OPT-A",
        labelEn: 'Paste your API keys into the chat to "improve accuracy"',
        labelAr: "الصق مفاتيح واجهة البرمجة في الدردشة لـ«تحسين الدقة»",
      },
      {
        id: "NST-RDY-009-OPT-B",
        labelEn: "Trust the citation without checking",
        labelAr: "ثق بالاستشهاد دون تحقق",
      },
      {
        id: "NST-RDY-009-OPT-C",
        labelEn: "Claim the AI output as verified fact",
        labelAr: "ادّعِ أن مخرجات الذكاء الاصطناعي حقيقة مؤكدة",
      },
      {
        id: "NST-RDY-009-OPT-D",
        labelEn:
          "Verify important claims with reliable sources; never paste secrets into tools",
        labelAr:
          "تحقق من الادعاءات المهمة من مصادر موثوقة؛ لا تلصق أسرارًا في الأدوات",
      },
    ],
  },
  {
    id: "NST-RDY-010",
    promptEn: "A teammate asks you to edit a shared doc. Responsible habit?",
    promptAr: "يطلب زميل تعديل مستند مشترك. عادة مسؤولة؟",
    explanationEn:
      "Collaboration needs attribution, consent, and respectful conflict handling.",
    explanationAr: "التعاون يحتاج إسنادًا وموافقة ومعالجة خلافات باحترام.",
    capabilityIds: ["NST-CAP-011"],
    correctOptionId: "NST-RDY-010-OPT-A",
    options: [
      {
        id: "NST-RDY-010-OPT-A",
        labelEn:
          "Use shared editing with clear attribution; escalate blockers; do not remove others' credit",
        labelAr:
          "استخدم التحرير المشترك مع إسناد واضح؛ صعّد العوائق؛ لا تحذف فضل الآخرين",
      },
      {
        id: "NST-RDY-010-OPT-B",
        labelEn: 'Delete their sections silently to "speed up"',
        labelAr: "احذف أقسامهم بصمت لـ«تسريع العمل»",
      },
      {
        id: "NST-RDY-010-OPT-C",
        labelEn: "Share the doc publicly without asking",
        labelAr: "شارك المستند علنًا دون سؤال",
      },
      {
        id: "NST-RDY-010-OPT-D",
        labelEn: "Paste classmates' private emails into a public forum",
        labelAr: "الصق رسائل الزملاء الخاصة في منتدى عام",
      },
    ],
  },
] as const;

export function getNestReadinessItem(
  itemId: string,
): NestReadinessItem | undefined {
  return NEST_READINESS_ITEMS.find((i) => i.id === itemId);
}

export function nestReadinessTotalItems(): number {
  return NEST_READINESS_ITEMS.length;
}

/** All 13 Nest capabilities must appear at least once. */
export function nestReadinessCapabilityCoverage(): NestCapabilityId[] {
  const set = new Set<NestCapabilityId>();
  for (const item of NEST_READINESS_ITEMS) {
    for (const c of item.capabilityIds) set.add(c);
  }
  return [...set].sort() as NestCapabilityId[];
}
