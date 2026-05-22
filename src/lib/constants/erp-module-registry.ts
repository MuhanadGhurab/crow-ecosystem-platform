import { routes } from "@/lib/routes";

/** ERP module keys mapped to CEM blueprint / TenantModule keys. */
export type ErpModuleKey =
  | "sales"
  | "inventory"
  | "warehouse"
  | "logistics"
  | "finance"
  | "procurement"
  | "hr"
  | "crm"
  | "tasks"
  | "reports";

export type ErpNavItem = {
  key: ErpModuleKey;
  cemModuleKey: string;
  routeSegment: string;
  label: string;
  href: string;
};

export type ErpChainLink = {
  key: ErpModuleKey;
  label: string;
  href: string;
};

type ErpModuleDef = {
  key: ErpModuleKey;
  cemModuleKey: string;
  routeSegment: string;
  label: string;
  chainPrev?: ErpModuleKey;
  chainNext?: ErpModuleKey;
};

/** Canonical ERP modules — chain: sales → inventory → warehouse → logistics → finance */
const ERP_MODULE_DEFS: ErpModuleDef[] = [
  { key: "sales", cemModuleKey: "sales", routeSegment: "sales", label: "Sales", chainNext: "inventory" },
  {
    key: "inventory",
    cemModuleKey: "inventory",
    routeSegment: "inventory",
    label: "Inventory",
    chainPrev: "sales",
    chainNext: "warehouse",
  },
  {
    key: "warehouse",
    cemModuleKey: "warehouse",
    routeSegment: "warehouse",
    label: "Warehouse",
    chainPrev: "inventory",
    chainNext: "logistics",
  },
  {
    key: "logistics",
    cemModuleKey: "logistics",
    routeSegment: "logistics",
    label: "Logistics",
    chainPrev: "warehouse",
    chainNext: "finance",
  },
  {
    key: "finance",
    cemModuleKey: "finance",
    routeSegment: "finance",
    label: "Finance",
    chainPrev: "logistics",
    chainNext: "procurement",
  },
  {
    key: "procurement",
    cemModuleKey: "procurement",
    routeSegment: "procurement",
    label: "Procurement",
    chainPrev: "finance",
    chainNext: "inventory",
  },
  { key: "hr", cemModuleKey: "hr", routeSegment: "hr", label: "HR" },
  { key: "crm", cemModuleKey: "crm", routeSegment: "crm", label: "CRM" },
  { key: "tasks", cemModuleKey: "approvals", routeSegment: "tasks", label: "Tasks" },
  { key: "reports", cemModuleKey: "bi", routeSegment: "reports", label: "Reports" },
];

const ERP_BY_KEY = new Map(ERP_MODULE_DEFS.map((d) => [d.key, d]));

type TenantModuleLike = { moduleKey: string; enabled?: boolean };

function enabledKeys(tenantModules: TenantModuleLike[]): Set<string> {
  return new Set(
    tenantModules.filter((m) => m.enabled !== false).map((m) => m.moduleKey)
  );
}

/** Nav items for enabled ERP modules (chain + people + insights). */
export function getEnabledErpNavItems(
  slug: string,
  tenantModules: TenantModuleLike[]
): ErpNavItem[] {
  const keys = enabledKeys(tenantModules);
  const r = routes.tenant(slug);
  const segmentHref: Record<string, string> = {
    sales: r.sales,
    inventory: r.inventory,
    warehouse: r.warehouse,
    logistics: r.logistics,
    finance: r.finance,
    procurement: r.procurement,
    hr: r.hr,
    crm: r.crm,
    tasks: r.tasks,
    reports: r.reports,
  };

  return ERP_MODULE_DEFS.filter((d) => keys.has(d.cemModuleKey)).map((d) => ({
    key: d.key,
    cemModuleKey: d.cemModuleKey,
    routeSegment: d.routeSegment,
    label: d.label,
    href: segmentHref[d.routeSegment] ?? `/${slug}/${d.routeSegment}`,
  }));
}

export type ErpChainContext = {
  prev: ErpChainLink | null;
  next: ErpChainLink | null;
  current: ErpModuleKey;
};

/** Previous/next chain links for a module slug, respecting enabled tenant modules. */
export function getErpChain(
  moduleSlug: ErpModuleKey,
  tenantSlug: string,
  tenantModules: TenantModuleLike[]
): ErpChainContext {
  const def = ERP_BY_KEY.get(moduleSlug);
  if (!def) {
    return { current: moduleSlug, prev: null, next: null };
  }

  const keys = enabledKeys(tenantModules);
  const r = routes.tenant(tenantSlug);

  const toLink = (key: ErpModuleKey): ErpChainLink | null => {
    const mod = ERP_BY_KEY.get(key);
    if (!mod || !keys.has(mod.cemModuleKey)) return null;
    const hrefMap: Record<string, string> = {
      sales: r.sales,
      inventory: r.inventory,
      warehouse: r.warehouse,
      logistics: r.logistics,
      finance: r.finance,
      procurement: r.procurement,
    };
    return {
      key,
      label: mod.label,
      href: hrefMap[key] ?? `/${tenantSlug}/${mod.routeSegment}`,
    };
  };

  return {
    current: moduleSlug,
    prev: def.chainPrev ? toLink(def.chainPrev) : null,
    next: def.chainNext ? toLink(def.chainNext) : null,
  };
}

export function hasErpModule(
  tenantModules: TenantModuleLike[],
  cemModuleKey: string
): boolean {
  return enabledKeys(tenantModules).has(cemModuleKey);
}

export function getErpModuleDef(key: ErpModuleKey): ErpModuleDef | undefined {
  return ERP_BY_KEY.get(key);
}
