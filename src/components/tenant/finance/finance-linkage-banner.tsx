import Link from "next/link";
import { routes } from "@/lib/routes";

type FinanceLinkageVariant = "sales" | "procurement" | "plan";

type FinanceLinkageBannerProps = {
  slug: string;
  variant: FinanceLinkageVariant;
  warnings?: string[];
};

const COPY: Record<
  FinanceLinkageVariant,
  { title: string; body: string }
> = {
  sales: {
    title: "Revenue readiness",
    body: "Sales pipeline and won opportunities contribute to finance coordination — not automated invoicing or payment collection in this phase.",
  },
  procurement: {
    title: "Expense / purchase readiness",
    body: "Approved purchase requests should reference finance lines where possible. Finance does not execute live supplier payments here.",
  },
  plan: {
    title: "Plan & subscription advisory",
    body: "Tenant plan entitlements are advisory. Checkout and payment gateway activation are out of scope unless explicitly enabled by operators.",
  },
};

export function FinanceLinkageBanner({
  slug,
  variant,
  warnings = [],
}: FinanceLinkageBannerProps) {
  const r = routes.tenant(slug);
  const { title, body } = COPY[variant];

  return (
    <aside className="rounded-cc border border-amber-500/15 bg-amber-950/10 px-4 py-3 text-sm text-slate-300">
      <p className="font-medium text-amber-200">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{body}</p>
      {warnings.length > 0 && (
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-200">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <Link href={r.finance} className="text-amber-300 hover:text-amber-200">
          Finance readiness hub →
        </Link>
        {variant !== "sales" && (
          <Link href={r.sales} className="text-cyan-400 hover:text-cyan-300">
            Sales →
          </Link>
        )}
        {variant !== "procurement" && (
          <Link href={r.procurement} className="text-cyan-400 hover:text-cyan-300">
            Procurement →
          </Link>
        )}
        {variant !== "plan" && (
          <Link href={r.settingsPlan} className="text-slate-400 hover:text-slate-300">
            Plan advisory →
          </Link>
        )}
        <Link href={routes.sarea.roleMapping} className="text-rose-300 hover:text-rose-200">
          SAREA role mapping →
        </Link>
      </div>
    </aside>
  );
}
