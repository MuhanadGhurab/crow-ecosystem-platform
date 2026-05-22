import Link from "next/link";
import type { ErpModuleKey } from "@/lib/constants/erp-module-registry";
import { routes } from "@/lib/routes";

export type ErpModuleHubCopy = {
  title: string;
  description: string;
  links?: { href: string; label: string }[];
};

const LOGISTICS_HUB_COPY: Partial<Record<ErpModuleKey, ErpModuleHubCopy>> = {
  sales: {
    title: "Logistics sales",
    description:
      "Freight quotes, B2B distribution contracts, and shipment sales lines tied to dispatch and OCR workflows.",
  },
  inventory: {
    title: "Stock & hubs",
    description:
      "Pallets, cold-chain consumables, fleet spares, and packaging across hub DCs — synced with warehouse intake and demand forecast.",
  },
  warehouse: {
    title: "Warehouse operations",
    description:
      "Zones, bins, and inbound/outbound lanes across hub sites — linked to inventory putaway and dispatch staging.",
  },
  logistics: {
    title: "Operations hub",
    description:
      "Multi-hub logistics with OCR document intake and AI-assisted dispatch on live CEM workflows.",
  },
  finance: {
    title: "Freight billing & ledger",
    description:
      "AR invoices from freight quotes, AP for fleet and consumables, and payment clearance tied to sales reference codes.",
  },
  procurement: {
    title: "Purchase requests",
    description:
      "Reorder signals from low-stock SKUs and demand forecast — PRs flow to AP lines on finance when approved.",
  },
};

const DEFAULT_LINKS: Partial<
  Record<ErpModuleKey, (r: ReturnType<typeof routes.tenant>) => { href: string; label: string }[]>
> = {
  sales: (r) => [
    { href: r.workflows, label: "Shipment dispatch workflow" },
    { href: r.logistics, label: "Logistics hub" },
    { href: r.crm, label: "CRM accounts" },
  ],
  inventory: (r) => [
    { href: r.warehouse, label: "Warehouse" },
    { href: r.logistics, label: "Logistics hub" },
    { href: r.sales, label: "Sales & quotes" },
  ],
  warehouse: (r) => [
    { href: r.inventory, label: "Inventory" },
    { href: r.logistics, label: "Logistics hub" },
    { href: r.workflows, label: "Workflows" },
  ],
  finance: (r) => [
    { href: r.sales, label: "Sales & AR" },
    { href: r.logistics, label: "Logistics hub" },
  ],
  procurement: (r) => [
    { href: r.inventory, label: "Inventory & low stock" },
    { href: r.finance, label: "Finance & AP" },
  ],
};

type ErpModuleHubProps = {
  slug: string;
  organizationName: string;
  moduleKey: ErpModuleKey;
  logisticsCopy?: ErpModuleHubCopy;
};

export function ErpModuleHub({
  slug,
  organizationName,
  moduleKey,
  logisticsCopy,
}: ErpModuleHubProps) {
  const r = routes.tenant(slug);
  const copy = logisticsCopy ?? LOGISTICS_HUB_COPY[moduleKey];
  if (!copy) return null;

  const linkDefs = copy.links ?? DEFAULT_LINKS[moduleKey]?.(r) ?? [];

  return (
    <section className="cc-glass-card border-cyan-500/15">
      <h3 className="text-sm font-medium text-cyan-400">{copy.title}</h3>
      <p className="mt-2 text-sm text-slate-400">
        {organizationName} — {copy.description}
      </p>
      {linkDefs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {linkDefs.map((link) => (
            <Link key={link.href} href={link.href} className="cc-btn-secondary text-sm">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
