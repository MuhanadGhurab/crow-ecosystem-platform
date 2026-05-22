import Link from "next/link";
import { notFound } from "next/navigation";
import { BlueprintProvisionForm } from "@/components/blueprint/blueprint-provision-form";
import { BlueprintStatusBadge } from "@/components/admin/blueprint-status-badge";
import { EngineBadges } from "@/components/pipeline/engine-badges";
import { routes } from "@/lib/routes";
import { slugifyOrganization } from "@/lib/slugify";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";
import {
  evaluateGroupedBlueprintReadiness,
  evaluatePreProvisionReadiness,
  isReadinessGateEnabled,
} from "@/lib/services/readiness.service";

export default async function BlueprintGoLivePage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId).catch(() => null);
  if (!blueprint) notFound();

  const suggestedSlug = slugifyOrganization(blueprint.request.organizationName);
  const hasTenant = Boolean(blueprint.tenant);
  const grouped = hasTenant
    ? null
    : await evaluateGroupedBlueprintReadiness(blueprintId).catch(() => null);
  const preProvision = hasTenant
    ? null
    : await evaluatePreProvisionReadiness(blueprintId).catch(() => null);
  const gateEnabled = isReadinessGateEnabled();
  const uiBlockers = preProvision?.blockers ?? [];
  const b = routes.blueprint(blueprintId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="cc-go-live-hero">
        <span className="cc-star-badge">CEM launch</span>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">Go live</h2>
        <p className="mt-2 text-sm text-slate-400">
          Provision tenant, seed CEM from discovery, initialize CyberCrow and SAREA sibling engines.
        </p>
        <EngineBadges className="mt-4" />
      </header>

      <section className="cc-glass-card flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-500">Blueprint</span>
        <BlueprintStatusBadge status={blueprint.status} />
      </section>

      {hasTenant && blueprint.tenant ? (
        <section className="cc-go-live-hero">
          <p className="text-sm font-medium text-teal-300">Already live</p>
          <p className="mt-2 text-sm text-slate-400">
            This blueprint was provisioned. Re-running go-live with the same slug is not required;
            use a new slug only for a separate tenant instance.
          </p>
          <p className="mt-3 font-mono text-2xl text-cyan-300">/{blueprint.tenant.slug}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={routes.tenant(blueprint.tenant.slug).dashboard}
              className="cc-btn-primary text-sm"
            >
              Open CEM dashboard →
            </Link>
            <Link
              href={routes.tenant(blueprint.tenant.slug).logistics}
              className="cc-btn-secondary text-sm"
            >
              Logistics hub
            </Link>
          </div>
        </section>
      ) : (
        <>
          <Link
            href={b.readiness}
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            Review go-live readiness checklist →
          </Link>
          {gateEnabled && (
            <p className="text-xs text-slate-500">
              Readiness gate enabled (<code className="text-cyan-400">GO_LIVE_READINESS_GATE=true</code>
              ).
            </p>
          )}
          {grouped && !grouped.canProvision && (
            <section className="rounded-lg border border-amber-500/25 bg-amber-950/15 p-4 text-sm text-amber-100/90">
              <p className="font-medium text-amber-200">Readiness incomplete</p>
              <p className="mt-1 text-xs text-slate-400">
                {grouped.requiredPassed}/{grouped.requiredTotal} required checks passed ·{" "}
                <Link href={b.readiness} className="text-cyan-400 hover:text-cyan-300">
                  Open full checklist
                </Link>
              </p>
            </section>
          )}
          <BlueprintProvisionForm
            blueprintId={blueprintId}
            suggestedSlug={suggestedSlug}
            blockers={uiBlockers}
            warnings={preProvision?.warnings ?? []}
          />
        </>
      )}

      <ol className="cc-glass-card space-y-3 !p-5 text-sm text-slate-300">
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-cyan-400">01</span>
          Create organization + tenant slug
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-cyan-400">02</span>
          Seed departments, roles, workflows from discovery
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-violet-400">03</span>
          Initialize CyberCrow audit baseline
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-xs font-bold text-rose-400">04</span>
          Create SAREA personas with default layouts and rules
        </li>
      </ol>

      <Link href={b.overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Blueprint overview
      </Link>
    </div>
  );
}
