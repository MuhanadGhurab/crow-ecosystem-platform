import type { ControlReadinessRow, GrcDomainGroup } from "@/lib/services/cybercrow-evidence-grc.service";
import {
  readinessLabelClass,
  readinessLabelText,
} from "@/lib/services/cybercrow-evidence-grc.service";

type Props = {
  domains: GrcDomainGroup[];
  mapping?: ControlReadinessRow[];
  showMapping?: boolean;
};

export function CybercrowControlReadinessPanel({
  domains,
  mapping,
  showMapping = false,
}: Props) {
  return (
    <div className="space-y-6">
      {domains.map((d) => (
        <section key={d.domainLabel} className="cc-glass-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-violet-300">{d.domainLabel}</h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${readinessLabelClass(d.readiness)}`}
            >
              {readinessLabelText(d.readiness)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {d.controlCount} control(s) · {d.evidenceCount} evidence row(s) ·{" "}
            {d.missingEvidenceCount} example gap(s) vs templates
          </p>
          <ul className="mt-4 space-y-3">
            {d.controls.map((c) => (
              <li
                key={c.controlKey}
                className="rounded-cc-sm border border-violet-500/10 bg-violet-500/[0.03] p-3"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] text-violet-300/80">{c.frameworkId}</p>
                    <p className="text-sm font-medium text-white">{c.title}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] ${readinessLabelClass(c.readiness)}`}
                  >
                    {readinessLabelText(c.readiness)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {c.controlStatus} · {c.evidenceCount} catalog evidence · missing examples:{" "}
                  {c.missingEvidenceCount}
                </p>
                <p className="mt-2 text-xs text-slate-400">{c.recommendedAction}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {showMapping && mapping && mapping.length > 0 ? (
        <section className="cc-glass-card border-cyan-500/15">
          <h3 className="text-sm font-medium text-cyan-300">Control-to-evidence mapping</h3>
          <p className="mt-1 text-xs text-slate-500">
            Required examples are advisory templates — compare to catalog titles on file.
          </p>
          <ul className="mt-4 space-y-4">
            {mapping.map((c) => (
              <li key={c.controlKey} className="border-t border-white/5 pt-4 first:border-0 first:pt-0">
                <p className="font-medium text-white">{c.title}</p>
                <p className="text-xs text-slate-500 font-mono">{c.controlKey}</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-medium uppercase text-slate-600">Required examples</p>
                    <ul className="mt-1 list-inside list-disc text-xs text-slate-400">
                      {c.requiredExamples.map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase text-slate-600">Available catalog</p>
                    {c.availableTitles.length > 0 ? (
                      <ul className="mt-1 list-inside list-disc text-xs text-slate-400">
                        {c.availableTitles.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-xs text-amber-400/90">None — needs evidence</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
