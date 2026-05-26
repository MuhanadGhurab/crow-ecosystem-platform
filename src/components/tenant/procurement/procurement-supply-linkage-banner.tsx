import Link from "next/link";
import { routes } from "@/lib/routes";

type ProcurementSupplyLinkageBannerProps = {
  slug: string;
  hasFinance: boolean;
  hasInventory: boolean;
  hasWarehouse: boolean;
  warnings?: string[];
};

export function ProcurementSupplyLinkageBanner({
  slug,
  hasFinance,
  hasInventory,
  hasWarehouse,
  warnings = [],
}: ProcurementSupplyLinkageBannerProps) {
  const r = routes.tenant(slug);

  return (
    <aside className="rounded-cc border border-amber-500/15 bg-amber-950/10 px-4 py-3 text-sm text-slate-300">
      <p className="font-medium text-amber-200">Supply chain coordination</p>
      <p className="mt-1 text-xs text-slate-500">
        Procurement coordinates purchase requests and supplier touchpoints — not live supplier
        payments, not a vendor marketplace, and not automated PO issuance as a legal document.
      </p>
      {warnings.length > 0 && (
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-200">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {hasFinance && (
          <Link href={r.finance} className="text-amber-300 hover:text-amber-200">
            Finance handoff →
          </Link>
        )}
        {hasInventory && (
          <Link href={r.inventory} className="text-cyan-400 hover:text-cyan-300">
            Inventory →
          </Link>
        )}
        {hasWarehouse && (
          <Link href={r.warehouse} className="text-cyan-400 hover:text-cyan-300">
            Warehouse →
          </Link>
        )}
        <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
          Tasks →
        </Link>
        <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
          Workflows →
        </Link>
        <Link href={r.reports} className="text-slate-400 hover:text-slate-300">
          Reports →
        </Link>
        <Link href={r.cybercrow.evidence} className="text-violet-300 hover:text-violet-200">
          CyberCrow evidence →
        </Link>
        <Link href={routes.sarea.roleMapping} className="text-rose-300 hover:text-rose-200">
          SAREA role mapping →
        </Link>
      </div>
    </aside>
  );
}
