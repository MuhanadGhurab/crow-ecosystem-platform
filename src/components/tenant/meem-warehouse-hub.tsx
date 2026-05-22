import Link from "next/link";
import { routes } from "@/lib/routes";

type MeemWarehouseHubProps = {
  slug: string;
  organizationName: string;
};

export function MeemWarehouseHub({ slug, organizationName }: MeemWarehouseHubProps) {
  const r = routes.tenant(slug);

  return (
    <section className="cc-glass-card border-cyan-500/15">
      <h3 className="text-sm font-medium text-cyan-400">MEEM hubs & zones</h3>
      <p className="mt-2 text-sm text-slate-400">
        {organizationName} — Riyadh DC intake, Jeddah cold room, Dammam pack lanes, and
        outbound staging tied to warehouse intake and dispatch workflows.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={r.inventory} className="cc-btn-secondary text-sm">
          Inventory
        </Link>
        <Link href={r.logistics} className="cc-btn-secondary text-sm">
          Logistics hub
        </Link>
        <Link href={r.workflows} className="cc-btn-secondary text-sm">
          Warehouse intake
        </Link>
      </div>
    </section>
  );
}
