import type { ProCrowValidationCommand, ProCrowValidationRiskLevel } from "@/lib/procrow/procrow-go-no-go-contract";

const RISK_BADGE: Record<ProCrowValidationRiskLevel, string> = {
  read_only: "border-slate-600/50 bg-slate-800/50 text-slate-300",
  writes_local: "border-amber-500/30 bg-amber-500/5 text-amber-100",
  db_write: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  deployment_sensitive: "border-violet-500/40 bg-violet-500/10 text-violet-100",
};

const RISK_LABEL: Record<ProCrowValidationRiskLevel, string> = {
  read_only: "Read-only",
  writes_local: "Local / build",
  db_write: "DB-write",
  deployment_sensitive: "Deploy-sensitive",
};

type ProCrowValidationCommandListProps = {
  commands: ProCrowValidationCommand[];
};

export function ProCrowValidationCommandList({ commands }: ProCrowValidationCommandListProps) {
  const baseline = commands.filter((c) =>
    ["npm run mock:verify", "npm run typecheck", "npm run lint", "npm run build", "npm run public:mirror-manifest"].includes(
      c.command
    )
  );
  const client = commands.filter((c) => c.command.includes("client-"));
  const procrowOnly = commands.filter(
    (c) => c.command.includes("procrow") && !c.command.includes("cybercrow") && !c.command.includes("sarea")
  );
  const cybercrowSarea = commands.filter((c) => c.command.includes("cybercrow") || c.command.includes("sarea"));
  const runtime = commands.filter((c) =>
    ["npm run erp:verify", "npm run sector:verify", "npm run runtime:verify", "npm run request:pipeline:verify"].includes(c.command)
  );
  const sensitive = commands.filter((c) => c.riskLevel === "db_write" || c.riskLevel === "deployment_sensitive");

  function renderGroup(title: string, items: ProCrowValidationCommand[]) {
    if (items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
        <ul className="space-y-2">
          {items.map((c) => (
            <li
              key={c.command}
              className="flex flex-wrap items-start justify-between gap-2 rounded-cc-sm border border-white/[0.04] bg-black/20 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200">{c.name}</p>
                <p className="font-mono text-xs text-cyan-400/90">{c.command}</p>
                <p className="mt-1 text-xs text-slate-500">{c.purpose}</p>
                {c.caution ? <p className="mt-1 text-xs text-amber-200/90">{c.caution}</p> : null}
                <p className="mt-1 text-[10px] text-slate-600">
                  Demo: {c.requiredForDemo ? "yes" : "—"} · Push: {c.requiredForPush ? "yes" : "—"} · Prod path:{" "}
                  {c.requiredForProduction ? "yes" : "—"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${RISK_BADGE[c.riskLevel]}`}
              >
                {RISK_LABEL[c.riskLevel]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-procrow="validation-command-list">
      {renderGroup("Baseline", baseline)}
      {renderGroup("Client portal", client)}
      {renderGroup("ProCrow · CyberCrow · SAREA", [...procrowOnly, ...cybercrowSarea])}
      {renderGroup("Runtime / product", runtime)}
      {renderGroup("Dangerous or deployment-sensitive (review before run)", sensitive)}
    </div>
  );
}
