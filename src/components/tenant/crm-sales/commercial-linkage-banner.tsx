import Link from "next/link";
import { routes } from "@/lib/routes";

type CommercialLinkageVariant = "crm" | "sales";

type CommercialLinkageBannerProps = {
  slug: string;
  variant: CommercialLinkageVariant;
  requestReferenceCode?: string | null;
  requestStatus?: string | null;
  warnings?: string[];
};

const COPY: Record<CommercialLinkageVariant, { title: string; body: string }> = {
  crm: {
    title: "Client & account readiness",
    body: "CRM holds operator-managed accounts and contacts. Implementation request context links through blueprint when present — not a full CRM product or marketing automation.",
  },
  sales: {
    title: "Commercial coordination",
    body: "Sales readiness tracks pipeline lines for coordination with CRM and Finance — not live revenue recognition, invoicing, or payment capture.",
  },
};

export function CommercialLinkageBanner({
  slug,
  variant,
  requestReferenceCode,
  requestStatus,
  warnings = [],
}: CommercialLinkageBannerProps) {
  const r = routes.tenant(slug);
  const { title, body } = COPY[variant];

  return (
    <aside className="rounded-cc border border-cyan-500/15 bg-cyan-950/10 px-4 py-3 text-sm text-slate-300">
      <p className="font-medium text-cyan-300">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{body}</p>
      {requestReferenceCode && (
        <p className="mt-2 text-xs text-slate-400">
          Blueprint request:{" "}
          <span className="font-mono text-cyan-300">{requestReferenceCode}</span>
          {requestStatus ? ` · ${requestStatus}` : ""}
        </p>
      )}
      {warnings.length > 0 && (
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-200">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {variant !== "crm" && (
          <Link href={r.crm} className="text-cyan-400 hover:text-cyan-300">
            CRM readiness →
          </Link>
        )}
        {variant !== "sales" && (
          <Link href={r.sales} className="text-cyan-400 hover:text-cyan-300">
            Sales readiness →
          </Link>
        )}
        <Link href={r.finance} className="text-amber-300 hover:text-amber-200">
          Finance handoff →
        </Link>
        <Link href={r.reports} className="text-slate-400 hover:text-slate-300">
          Reports →
        </Link>
        <Link href={routes.sarea.roleMapping} className="text-rose-300 hover:text-rose-200">
          SAREA role mapping →
        </Link>
      </div>
    </aside>
  );
}
