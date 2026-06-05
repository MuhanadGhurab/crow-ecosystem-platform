import Link from "next/link";
import { routes } from "@/lib/routes";

type Props = {
  slug: string;
  cyberCrowHooks: string[];
  sareaHooks: string[];
  cybercrowInitialized?: boolean;
};

export function CemModuleTrustExperiencePanel({
  slug,
  cyberCrowHooks,
  sareaHooks,
  cybercrowInitialized = false,
}: Props) {
  const r = routes.tenant(slug);

  return (
    <section className="cc-glass-card border-rose-500/10 !py-4 space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-300">
        CyberCrow trust & SAREA experience
      </h3>
      <p className="text-xs text-slate-500">
        Observability and role-experience hooks — not SIEM replacement, not compliance
        certification, RBAC unchanged.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              CyberCrow
            </p>
            <Link
              href={cybercrowInitialized ? r.cybercrow.auditLogs : r.cybercrow.dashboard}
              className="text-[10px] text-cyan-400 hover:text-cyan-300"
            >
              Open →
            </Link>
          </div>
          <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
            {cyberCrowHooks.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              SAREA
            </p>
            <Link
              href={routes.sarea.overview}
              className="text-[10px] text-cyan-400 hover:text-cyan-300"
            >
              Studio →
            </Link>
          </div>
          <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
            {sareaHooks.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
