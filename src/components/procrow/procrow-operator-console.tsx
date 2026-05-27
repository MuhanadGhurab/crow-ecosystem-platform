import Link from "next/link";
import type { ProCrowOperatorConsoleSnapshot } from "@/lib/procrow/procrow-operator-console-contract";
import { ProCrowDocsIndexPanel } from "@/components/procrow/procrow-docs-index-panel";
import { ProCrowValidationCommandPanel } from "@/components/procrow/procrow-validation-command-panel";
import { ProCrowOperatorSafetyWarnings } from "@/components/procrow/procrow-operator-safety-warnings";
import { ProCrowRecommendedNextActions } from "@/components/procrow/procrow-recommended-next-actions";
import { routes } from "@/lib/routes";

type ProCrowOperatorConsoleProps = {
  snapshot: ProCrowOperatorConsoleSnapshot;
};

export function ProCrowOperatorConsole({ snapshot }: ProCrowOperatorConsoleProps) {
  const highlightDocKeys = snapshot.recommendedReading.map((d) => d.key);

  return (
    <div className="space-y-8" data-procrow="operator-console">
      <section className="rounded-cc-sm border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-slate-400">
        <p>
          <span className="font-semibold text-cyan-200/90">Operator docs & validation console</span> — metadata index
          for internal runbooks and npm verifiers. For advisory gate posture (F23, migrations, payments), use the{" "}
          <Link href={routes.admin.goNoGo} className="text-cyan-400 hover:text-cyan-300">
            deployment go/no-go center
          </Link>
          . For request prioritization, use the{" "}
          <Link href={routes.admin.queue} className="text-cyan-400 hover:text-cyan-300">
            operator queue
          </Link>
          .
        </p>
      </section>

      <ProCrowOperatorSafetyWarnings warnings={snapshot.safetyWarnings} />

      <ProCrowRecommendedNextActions actions={snapshot.nextActions} />

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Start here (recommended reading)
        </h2>
        <div className="cc-glass-card !p-5">
          <ul className="space-y-2 text-sm text-slate-400">
            {snapshot.recommendedReading.map((doc) => (
              <li key={doc.key}>
                <span className="text-slate-200">{doc.title}</span>
                <span className="ml-2 font-mono text-xs text-slate-600">{doc.path}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Recommended commands (manual)
        </h2>
        <div className="cc-glass-card !p-5">
          <ProCrowValidationCommandPanel commands={snapshot.recommendedCommands} compact />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Documentation index
        </h2>
        <p className="text-xs text-slate-500">
          Paths are repo-relative — not exposed as public web routes. Open files in your editor or docs viewer.
        </p>
        <div className="cc-glass-card !p-5">
          <ProCrowDocsIndexPanel docs={snapshot.docs} highlightKeys={highlightDocKeys} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Full validation command index
        </h2>
        <p className="text-xs text-slate-500">
          Shared with J6 go/no-go — same command list, extended with proves and doc links here.
        </p>
        <div className="cc-glass-card !p-5">
          <ProCrowValidationCommandPanel commands={snapshot.validationCommands} />
        </div>
      </section>

      <p className="text-[10px] text-slate-600">
        Snapshot generated {new Date(snapshot.generatedAt).toLocaleString()} — static metadata; revalidate on page load.
      </p>
    </div>
  );
}
