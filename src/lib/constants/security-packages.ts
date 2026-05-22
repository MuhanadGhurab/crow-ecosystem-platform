/** CyberCrow security packages — NCA-aware tiers */

export const SECURITY_PACKAGES = [

  {

    key: "crow_shield",

    nameEn: "Crow Shield",

    icon: "🛡️",

    monthlyAddonSar: 349,

    descriptionEn: "Baseline protection: RBAC, password policy, foundational audit logs.",

    descriptionAr: "طبقة حماية أساسية: RBAC، سياسات كلمات المرور، سجلات تدقيق أساسية.",

  },

  {

    key: "crow_sentinel",

    nameEn: "Crow Sentinel",

    icon: "👁️",

    monthlyAddonSar: 899,

    descriptionEn: "Advanced monitoring: security alerts, suspicious sign-in tracking, risk summaries.",

    descriptionAr: "مراقبة متقدمة: تنبيهات أمنية، محاولات دخول مشبوهة، تقارير مخاطر.",

  },

  {

    key: "crow_fortress",

    nameEn: "Crow Fortress",

    icon: "🏰",

    monthlyAddonSar: 1_699,

    descriptionEn: "Enterprise-grade: incident workflows, compliance evidence, NCA-aligned posture.",

    descriptionAr: "حماية مؤسسية: حوادث، أدلة امتثال، وضعية متوافقة مع NCA.",

  },

] as const;



export type SecurityPackageKey = (typeof SECURITY_PACKAGES)[number]["key"];

