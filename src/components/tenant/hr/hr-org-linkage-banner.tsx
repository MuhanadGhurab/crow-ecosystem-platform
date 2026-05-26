import Link from "next/link";
import { routes } from "@/lib/routes";

type HrOrgLinkageBannerProps = {
  slug: string;
  warnings?: string[];
};

export function HrOrgLinkageBanner({ slug, warnings = [] }: HrOrgLinkageBannerProps) {
  const r = routes.tenant(slug);

  return (
    <aside className="rounded-cc border border-cyan-500/15 bg-cyan-950/15 px-4 py-3 text-sm text-slate-300">
      <p className="font-medium text-cyan-300">HR workforce readiness</p>
      <p className="mt-1 text-xs text-slate-500">
        RBAC controls access via roles on this workspace. SAREA adapts experience by profile — not
        permissions. HR employee records are operator-managed and separate from login profiles
        unless email matches.
      </p>
      {warnings.length > 0 && (
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-200">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <Link href={r.hr} className="text-cyan-400 hover:text-cyan-300">
          HR readiness hub →
        </Link>
        <Link href={routes.sarea.roleMapping} className="text-rose-300 hover:text-rose-200">
          SAREA role mapping →
        </Link>
        <Link href={r.cybercrow.auditLogs} className="text-violet-300 hover:text-violet-200">
          CyberCrow audit →
        </Link>
      </div>
    </aside>
  );
}
