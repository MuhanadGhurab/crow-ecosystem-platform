import Link from "next/link";
import { routes } from "@/lib/routes";

type MeemSalesHubProps = {
  slug: string;
  organizationName: string;
};

export function MeemSalesHub({ slug, organizationName }: MeemSalesHubProps) {
  const r = routes.tenant(slug);

  return (
    <section className="cc-glass-card border-cyan-500/15">
      <h3 className="text-sm font-medium text-cyan-400">MEEM logistics sales</h3>
      <p className="mt-2 text-sm text-slate-400">
        {organizationName} — freight quotes, B2B distribution contracts, and shipment sales lines
        tied to dispatch and OCR workflows.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={r.workflows} className="cc-btn-secondary text-sm">
          Shipment dispatch workflow
        </Link>
        <Link href={r.logistics} className="cc-btn-secondary text-sm">
          Logistics hub
        </Link>
        <Link href={r.crm} className="cc-btn-secondary text-sm">
          CRM accounts
        </Link>
      </div>
    </section>
  );
}
