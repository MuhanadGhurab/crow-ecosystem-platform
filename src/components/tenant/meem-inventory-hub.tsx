import Link from "next/link";
import { routes } from "@/lib/routes";

type MeemInventoryHubProps = {
  slug: string;
  organizationName: string;
};

export function MeemInventoryHub({ slug, organizationName }: MeemInventoryHubProps) {
  const r = routes.tenant(slug);

  return (
    <section className="cc-glass-card border-cyan-500/15">
      <h3 className="text-sm font-medium text-cyan-400">MEEM stock & hubs</h3>
      <p className="mt-2 text-sm text-slate-400">
        {organizationName} — pallets, cold-chain consumables, fleet spares, and packaging
        across Riyadh, Jeddah, and Dammam DCs. Synced with warehouse intake and demand
        forecast signals.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={r.warehouse} className="cc-btn-secondary text-sm">
          Warehouse
        </Link>
        <Link href={r.logistics} className="cc-btn-secondary text-sm">
          Logistics hub
        </Link>
        <Link href={r.sales} className="cc-btn-secondary text-sm">
          Sales & quotes
        </Link>
      </div>
    </section>
  );
}
