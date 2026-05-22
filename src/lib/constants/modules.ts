/** CEM module catalog — migrated from HTML_proc/data/modules.json */

export const CEM_MODULES = [

  { key: "iam", nameEn: "Identity & access management", nameAr: "إدارة الهوية والمستخدمين", icon: "👤", monthlyAddonSar: 139 },

  { key: "hr", nameEn: "Human resources", nameAr: "الموارد البشرية", icon: "🧑‍💼", monthlyAddonSar: 175 },

  { key: "finance", nameEn: "Finance & accounting", nameAr: "المالية والمحاسبة", icon: "💳", monthlyAddonSar: 239 },

  { key: "inventory", nameEn: "Inventory & warehousing", nameAr: "المخزون والمستودعات", icon: "📦", monthlyAddonSar: 195 },

  { key: "warehouse", nameEn: "Warehouse operations", nameAr: "عمليات المستودع", icon: "🏭", monthlyAddonSar: 195 },

  { key: "logistics", nameEn: "Logistics", nameAr: "اللوجستيات", icon: "🚚", monthlyAddonSar: 185 },

  { key: "sales", nameEn: "Sales", nameAr: "المبيعات", icon: "📈", monthlyAddonSar: 189 },

  { key: "crm", nameEn: "CRM", nameAr: "إدارة العملاء CRM", icon: "🤝", monthlyAddonSar: 199 },

  { key: "procurement", nameEn: "Procurement", nameAr: "المشتريات", icon: "🧾", monthlyAddonSar: 159 },

  { key: "projects", nameEn: "Project management", nameAr: "إدارة المشاريع", icon: "🏗️", monthlyAddonSar: 179 },

  { key: "bi", nameEn: "Reporting & dashboards", nameAr: "التقارير ولوحات المؤشرات", icon: "📊", monthlyAddonSar: 219 },

  { key: "documents", nameEn: "Document management", nameAr: "إدارة المستندات", icon: "📁", monthlyAddonSar: 129 },

  { key: "approvals", nameEn: "Approval workflows", nameAr: "مسارات الموافقة", icon: "✅", monthlyAddonSar: 169 },

] as const;



export type CemModuleKey = (typeof CEM_MODULES)[number]["key"];

