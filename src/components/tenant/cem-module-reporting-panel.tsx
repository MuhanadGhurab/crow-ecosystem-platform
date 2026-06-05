import Link from "next/link";
import { routes } from "@/lib/routes";

type Props = {
  slug: string;
  reports: string[];
  moduleLabel: string;
};

export function CemModuleReportingPanel({ slug, reports, moduleLabel }: Props) {
  const r = routes.tenant(slug);

  return (
    <section className="cc-glass-card border-cyan-500/10 !py-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
          Reporting outputs
        </h3>
        <Link href={r.reports} className="text-xs text-cyan-400 hover:text-cyan-300">
          Reports hub →
        </Link>
      </div>
      <p className="text-xs text-slate-500">
        Advisory BI roll-ups for {moduleLabel} — tenant-backed when data exists; not certified
        management reporting.
      </p>
      {reports.length === 0 ? (
        <p className="text-xs text-slate-500">No report outputs mapped yet.</p>
      ) : (
        <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
          {reports.map((rep) => (
            <li key={rep}>{rep}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
