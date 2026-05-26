import Link from "next/link";
import { routes } from "@/lib/routes";

type SupplyChainLinkageVariant = "inventory" | "warehouse" | "logistics";

type SupplyChainOperationsLinkageBannerProps = {
  slug: string;
  variant: SupplyChainLinkageVariant;
  warnings?: string[];
};

const COPY: Record<SupplyChainLinkageVariant, { title: string; body: string }> = {
  inventory: {
    title: "Stock / material coordination",
    body: "Inventory tracks SKU readiness and adjustments — not real-time stock accuracy, barcode automation, or automated replenishment engines.",
  },
  warehouse: {
    title: "Warehouse operations coordination",
    body: "Warehouse coordinates receiving, putaway, picking, and movement readiness — not a full WMS, RFID, or IoT platform.",
  },
  logistics: {
    title: "Logistics operations coordination",
    body: "Logistics coordinates dispatch, delivery lifecycle, exceptions, and handoffs from warehouse and inventory — not live GPS, carrier APIs, or automated dispatch.",
  },
};

export function SupplyChainOperationsLinkageBanner({
  slug,
  variant,
  warnings = [],
}: SupplyChainOperationsLinkageBannerProps) {
  const r = routes.tenant(slug);
  const { title, body } = COPY[variant];

  return (
    <aside className="rounded-cc border border-cyan-500/15 bg-cyan-950/10 px-4 py-3 text-sm text-slate-300">
      <p className="font-medium text-cyan-200">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{body}</p>
      {warnings.length > 0 && (
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-200">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {variant !== "inventory" && (
          <Link href={r.inventory} className="text-cyan-400 hover:text-cyan-300">
            Inventory →
          </Link>
        )}
        {variant !== "warehouse" && (
          <Link href={r.warehouse} className="text-cyan-400 hover:text-cyan-300">
            Warehouse →
          </Link>
        )}
        {variant !== "logistics" && (
          <Link href={r.logistics} className="text-cyan-400 hover:text-cyan-300">
            Logistics →
          </Link>
        )}
        <Link href={r.procurement} className="text-cyan-400 hover:text-cyan-300">
          Procurement →
        </Link>
        <Link href={r.crm} className="text-cyan-400 hover:text-cyan-300">
          CRM →
        </Link>
        <Link href={r.finance} className="text-cyan-400 hover:text-cyan-300">
          Finance →
        </Link>
        <Link href={routes.sarea.roleMapping} className="text-rose-300 hover:text-rose-200">
          SAREA role mapping →
        </Link>
      </div>
    </aside>
  );
}
