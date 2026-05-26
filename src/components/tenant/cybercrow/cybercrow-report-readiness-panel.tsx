import type { ReportReadiness } from "@/lib/services/cybercrow-evidence-grc.service";

type Props = {
  report: ReportReadiness;
};

export function CybercrowReportReadinessPanel({ report }: Props) {
  return (
    <section className="cc-glass-card border-indigo-500/20">
      <h3 className="text-sm font-medium text-indigo-300">{report.headline}</h3>
      <p className="mt-1 text-xs text-slate-500">
        Export pipelines are deferred — use the summary below for operator notes or ticket paste.
      </p>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
        {report.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500">Deferred exports</p>
        <ul className="mt-1 space-y-0.5 text-xs text-slate-600">
          {report.deferredExports.map((d) => (
            <li key={d}>· {d}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500">Copyable summary (select text)</p>
        <pre className="mt-2 max-h-40 overflow-auto rounded-cc-sm border border-white/10 bg-black/30 p-3 text-xs text-slate-300 whitespace-pre-wrap">
          {report.copyableSummary}
        </pre>
      </div>
    </section>
  );
}
