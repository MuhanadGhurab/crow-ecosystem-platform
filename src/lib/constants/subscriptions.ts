/** Subscription tiers — Startup, Growth, Enterprise (orchestration platform base fee) */

export const SUBSCRIPTION_TIERS = [

  {

    key: "startup",

    nameEn: "Crow Start",

    nameAr: "Crow Start",

    icon: "🌱",

    baseMonthlySar: 1_899,

    descriptionEn: "Core CEM orchestration for teams under 50 — native auth, essential workflows.",

    descriptionAr: "منصة CEM الأساسية للفرق أقل من 50 موظف.",

    authMode: "native" as const,

  },

  {

    key: "growth",

    nameEn: "Crow Growth",

    nameAr: "Crow Growth",

    icon: "🚀",

    baseMonthlySar: 4_499,

    descriptionEn: "Multi-module operations, reporting, and CyberCrow baseline for growing orgs (50–100 band).",

    descriptionAr: "عمليات متعددة الوحدات وتقارير وأمان Crow للشركات النامية.",

    authMode: "native" as const,

  },

  {

    key: "enterprise",

    nameEn: "Crow Enterprise",

    nameAr: "Crow Enterprise",

    icon: "🏢",

    baseMonthlySar: 8_999,

    descriptionEn: "Entra ID SSO, advanced workflows, priority support — MEEM-scale logistics & holding groups.",

    descriptionAr: "Entra ID SSO ومسارات متقدمة ودعم ذي أولوية للمؤسسات.",

    authMode: "entra_id" as const,

  },

] as const;



export type SubscriptionTierKey = (typeof SUBSCRIPTION_TIERS)[number]["key"];

