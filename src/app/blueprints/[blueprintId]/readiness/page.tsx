import Link from "next/link";
import { notFound } from "next/navigation";
import { BlueprintPlanDiffPanel } from "@/components/blueprint/blueprint-plan-diff-panel";
import { ReadinessManualToggle } from "@/components/blueprint/readiness-manual-toggle";
import { EngineBadges } from "@/components/pipeline/engine-badges";
import { routes } from "@/lib/routes";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import { computeBlueprintPlanDiff } from "@/lib/services/blueprint-plan-diff.service";
import {
  evaluateGroupedBlueprintReadiness,
  groupedReadinessSummary,
  isReadinessGateEnabled,
} from "@/lib/services/readiness.service";

const ENTITY_BORDER: Record<string, string> = {
  cem: "border-cyan-500/20",
  cybercrow: "border-violet-500/20",
  sarea: "border-rose-500/20",
};

export default async function BlueprintReadinessPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId).catch(() => null);
  if (!blueprint) notFound();

  const [grouped, planDiff] = await Promise.all([
    evaluateGroupedBlueprintReadiness(blueprintId).catch(() => null),
    computeBlueprintPlanDiff(blueprintId).catch(() => null),
  ]);
  const summary = grouped ? groupedReadinessSummary(grouped.groups) : null;
  const b = routes.blueprint(blueprintId);
  const hasTenant = Boolean(blueprint.tenant);
  const gateEnabled = isReadinessGateEnabled();
  const canGoLive = grouped?.canProvision ?? false;

  return (
    <div className="space-y-8">
      {hasTenant && blueprint.tenant && (
        <section className="rounded-lg border border-teal-500/25 bg-teal-950/20 p-4">
          <p className="text-sm font-medium text-teal-300">Tenant already live</p>
          <p className="mt-1 text-xs text-slate-400">
            <span className="font-mono text-cyan-300">/{blueprint.tenant.slug}</span> — checklist
            reflects post-provision state (CyberCrow, workflows, SAREA).
          </p>
          <Link
            href={routes.tenant(blueprint.tenant.slug).dashboard}
            className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300"
          >
            Open CEM dashboard →
          </Link>
        </section>
      )}

      {planDiff && <BlueprintPlanDiffPanel diff={planDiff} />}

      <header>
        <span className="cc-star-badge">Pre-launch</span>
        <h2 className="mt-3 font-display text-2xl font-bold text-white">Go-live readiness</h2>
        <p className="mt-2 text-sm text-slate-400">
          Grouped validation across modules, structure, RBAC, workflows, CyberCrow, SAREA, and
          integrations before CEM provision.
        </p>
        <EngineBadges className="mt-4" />
      </header>

      {summary && grouped && (
        <section className="cc-glass-card flex flex-wrap gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Required checks
            </p>
            <p className="font-display text-3xl font-bold tabular-nums text-cyan-300">
              {summary.requiredPassed}/{summary.requiredTotal}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Groups passed
            </p>
            <p className="font-display text-3xl font-bold tabular-nums text-cyan-300">
              {summary.groupsPassed}/{summary.groupCount}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Provision gate
            </p>
            <p
              className={`text-sm font-medium ${canGoLive ? "text-teal-300" : "text-amber-300"}`}
            >
              {hasTenant
                ? "Tenant live — re-provision only with new slug"
                : canGoLive
                  ? "Ready for go-live"
                  : "Resolve blockers below"}
            </p>
            {gateEnabled && (
              <p className="mt-1 text-xs text-slate-500">
                Server gate: <code className="text-cyan-400">GO_LIVE_READINESS_GATE=true</code>
              </p>
            )}
          </div>
        </section>
      )}

      {grouped && grouped.blockers.length > 0 && (
        <section className="rounded-lg border border-red-500/30 bg-red-950/20 p-4">
          <h3 className="text-sm font-medium text-red-300">Blockers</h3>
          <ul className="mt-2 space-y-1 text-sm text-red-200/90">
            {grouped.blockers.map((b) => (
              <li key={b}>• {b}</li>
            ))}
          </ul>
        </section>
      )}

      {grouped && grouped.warnings.length > 0 && (
        <section className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-4">
          <h3 className="text-sm font-medium text-amber-200">Warnings</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-100/80">
            {grouped.warnings.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        </section>
      )}

      {grouped?.groups.map((group) => (
        <section
          key={group.key}
          className={`cc-glass-card border ${ENTITY_BORDER[group.entity ?? ""] ?? "border-white/10"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-white">{group.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{group.description}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                group.passed
                  ? "bg-teal-500/15 text-teal-300"
                  : "bg-amber-500/15 text-amber-300"
              }`}
            >
              {group.requiredPassed}/{group.requiredTotal} required
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {group.items.map((item) => (
              <li
                key={item.key}
                className={`cc-checklist-row ${item.passed ? "cc-checklist-row--pass" : "cc-checklist-row--pending"}`}
              >
                <div>
                  <p className="font-medium text-white">
                    <span
                      className={item.passed ? "text-teal-400" : "text-amber-400"}
                      aria-hidden
                    >
                      {item.passed ? "✓" : "○"}
                    </span>{" "}
                    {item.label}
                    {item.required && (
                      <span className="ml-2 text-xs font-semibold uppercase text-cyan-400">
                        required
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                </div>
                {group.key === "operations" &&
                  (item.key === "performance_validated" || item.key === "support_ready") && (
                    <ReadinessManualToggle
                      blueprintId={blueprintId}
                      itemKey={item.key as "performance_validated" | "support_ready"}
                      label="Confirm"
                      defaultChecked={item.passed}
                    />
                  )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="flex flex-wrap gap-3">
        {canGoLive || hasTenant ? (
          <Link href={b.goLive} className="cc-btn-primary text-sm">
            Go live →
          </Link>
        ) : (
          <span
            className="cc-btn-primary cursor-not-allowed text-sm opacity-50"
            title="Complete required readiness groups first"
          >
            Go live (blocked)
          </span>
        )}
        <Link href={b.overview} className="cc-btn-secondary text-sm">
          Blueprint overview
        </Link>
      </div>
    </div>
  );
}
