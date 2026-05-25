import Link from "next/link";

type Step = {
  label: string;
  href: string;
  count?: number;
};

type Props = {
  steps: Step[];
};

export function CybercrowSocWorkflowStrip({ steps }: Props) {
  return (
    <section className="rounded-lg border border-violet-500/10 bg-violet-500/[0.04] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-violet-300/90">
        SOC workflow
      </p>
      <ol className="mt-3 flex flex-wrap items-center gap-1 text-xs">
        {steps.map((step, i) => (
          <li key={step.href} className="flex items-center gap-1">
            {i > 0 ? <span className="text-slate-600" aria-hidden>→</span> : null}
            <Link href={step.href} className="rounded-full bg-violet-500/10 px-2 py-1 text-violet-200 hover:bg-violet-500/20">
              {step.label}
              {step.count != null && step.count > 0 ? (
                <span className="ml-1 tabular-nums text-slate-500">({step.count})</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
