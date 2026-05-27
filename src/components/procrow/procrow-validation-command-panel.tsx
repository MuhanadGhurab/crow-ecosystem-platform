import type {
  ProCrowValidationCommandCategory,
  ProCrowValidationCommandItem,
} from "@/lib/procrow/procrow-operator-console-contract";
import { ProCrowCommandRiskBadge } from "@/components/procrow/procrow-command-risk-badge";

const CATEGORY_LABELS: Record<ProCrowValidationCommandCategory, string> = {
  baseline: "Baseline",
  client_portal: "Client portal",
  procrow_stack: "ProCrow stack",
  cybercrow_sarea: "CyberCrow & SAREA",
  runtime_product: "Runtime & product",
  deployment_sensitive: "Deployment-sensitive",
};

function RequirementDots({
  demo,
  push,
  production,
}: {
  demo: boolean;
  push: boolean;
  production: boolean;
}) {
  return (
    <span className="flex flex-wrap gap-1 text-[10px] text-slate-600">
      {demo ? <span className="rounded bg-slate-800 px-1 text-cyan-400/90">demo</span> : null}
      {push ? <span className="rounded bg-slate-800 px-1 text-sky-400/90">push</span> : null}
      {production ? <span className="rounded bg-slate-800 px-1 text-amber-400/90">prod*</span> : null}
    </span>
  );
}

type ProCrowValidationCommandPanelProps = {
  commands: ProCrowValidationCommandItem[];
  compact?: boolean;
};

export function ProCrowValidationCommandPanel({ commands, compact = false }: ProCrowValidationCommandPanelProps) {
  const categories = [...new Set(commands.map((c) => c.category))] as ProCrowValidationCommandCategory[];

  return (
    <div className="space-y-6" data-procrow="validation-command-panel">
      <p className="text-xs text-slate-500">
        Commands are copied from the J6 validation index — run manually in terminal. *prod = required only when F23
        production path is explicitly approved.
      </p>
      {categories.map((cat) => {
        const items = commands.filter((c) => c.category === cat);
        return (
          <section key={cat}>
            <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-slate-500">
              {CATEGORY_LABELS[cat]}
            </h3>
            <ul className="space-y-2">
              {items.map((cmd) => (
                <li
                  key={cmd.key}
                  className="rounded-cc-sm border border-white/5 bg-white/[0.02] px-3 py-2"
                  data-procrow="validation-command-row"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="text-xs text-cyan-200/90">{cmd.command}</code>
                    <ProCrowCommandRiskBadge riskLevel={cmd.riskLevel} />
                    <RequirementDots
                      demo={cmd.requiredForDemo}
                      push={cmd.requiredForPush}
                      production={cmd.requiredForProduction}
                    />
                  </div>
                  {!compact ? (
                    <>
                      <p className="mt-1 text-xs text-slate-500">{cmd.purpose}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        <span className="text-slate-500">Proves: </span>
                        {cmd.proves}
                      </p>
                      {cmd.relatedDoc ? (
                        <p className="mt-0.5 font-mono text-[10px] text-slate-600">Doc: {cmd.relatedDoc}</p>
                      ) : null}
                      {cmd.notes ? (
                        <p className="mt-1 text-xs text-amber-200/80">{cmd.notes}</p>
                      ) : null}
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
