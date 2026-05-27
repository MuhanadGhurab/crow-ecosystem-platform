import type { ProCrowOperatorDocCategory, ProCrowOperatorDocItem } from "@/lib/procrow/procrow-operator-console-contract";

const CATEGORY_LABELS: Record<ProCrowOperatorDocCategory, string> = {
  start_here: "Start here",
  portal_architecture: "Portal architecture",
  client_portal: "Client portal",
  procrow: "ProCrow",
  cybercrow: "CyberCrow",
  sarea: "SAREA",
  tenant_runtime: "Tenant runtime",
  validation: "Validation",
  deployment: "Deployment",
  git_safety: "Git safety",
  demo: "Demo",
  phase_history: "Phase history",
};

type ProCrowDocsIndexPanelProps = {
  docs: ProCrowOperatorDocItem[];
  highlightKeys?: string[];
};

export function ProCrowDocsIndexPanel({ docs, highlightKeys = [] }: ProCrowDocsIndexPanelProps) {
  const highlightSet = new Set(highlightKeys);
  const categories = [...new Set(docs.map((d) => d.category))] as ProCrowOperatorDocCategory[];

  return (
    <div className="space-y-6" data-procrow="docs-index">
      {categories.map((cat) => {
        const items = docs.filter((d) => d.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="space-y-3">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500">
              {CATEGORY_LABELS[cat]}
            </h3>
            <ul className="space-y-2">
              {items.map((doc) => (
                <li
                  key={doc.key}
                  className={`rounded-cc-sm border p-3 ${
                    highlightSet.has(doc.key)
                      ? "border-cyan-500/30 bg-cyan-500/5"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">{doc.title}</span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-600">{doc.audience}</span>
                    {doc.relatedPhase ? (
                      <span className="text-[10px] text-cyan-500/80">{doc.relatedPhase}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{doc.description}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    <span className="text-slate-500">When: </span>
                    {doc.whenToUse}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-slate-600">{doc.path}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
