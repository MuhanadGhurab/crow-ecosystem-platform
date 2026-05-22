import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscoveryCompleteButton } from "@/components/discovery/discovery-complete-button";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import { moduleLabel, planLabel, securityPackageLabel } from "@/lib/catalog-labels";
import { getDiscoveryAnswer } from "@/lib/discovery-answers";
import { getMockBlueprintIdForRequest } from "@/lib/mock/blueprint";
import { isUseMockData } from "@/lib/mock/env";
import { routes } from "@/lib/routes";
import { getConfirmedModuleKeys } from "@/lib/discovery-answers";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

const OPERATING_LABELS: Record<string, string> = {
  single_hq: "Single headquarters",
  multi_branch: "Multi-branch national",
  multi_country: "Multi-country",
  franchise: "Franchise / partner network",
};

export default async function DiscoverySummaryPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const ctx = await getDiscoveryContext(requestId);

  if (!ctx?.discoveryProfile) {
    notFound();
  }

  const answers = ctx.discoveryProfile.answers;
  const modules = getConfirmedModuleKeys(
    ctx.requestedModules.map((m) => m.moduleKey),
    answers
  );
  const planKey = ctx.requestedPlans[0]?.planKey;
  const d = routes.discovery(requestId);
  const operatingModel = getDiscoveryAnswer<string>(answers, "organization", "operatingModel");
  const canComplete = ctx.status === "UNDER_DISCOVERY";
  const profile = ctx.discoveryProfile;
  const blueprintId =
    ctx.enterpriseBlueprint?.id ??
    (isUseMockData() ? getMockBlueprintIdForRequest(requestId) : null);
  const blueprintRoutes = blueprintId ? routes.blueprint(blueprintId) : null;

  return (
    <div className="space-y-8">
      {blueprintRoutes && (
        <section className="cc-entity-block cc-entity-block--sarea !p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
            Handoff · Blueprint pricing
          </p>
          <h2 className="cc-section-title mt-2 text-xl">Discovery ready for commercial review</h2>
          <p className="mt-2 text-sm text-slate-400">
            Open the blueprint control room to confirm CEM modules, CyberCrow security, and SAREA
            experience pricing before sending the client proposal.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={blueprintRoutes.overview} className="cc-btn-primary text-sm">
              Blueprint overview →
            </Link>
            <Link href={blueprintRoutes.pricing} className="cc-btn-secondary text-sm">
              Pricing workspace →
            </Link>
          </div>
        </section>
      )}

      <section className="cc-glass-card space-y-4">
        <h2 className="cc-section-title text-lg">Discovery summary</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-slate-500">Organization</dt>
            <dd className="text-white">{ctx.organizationName}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Operating model</dt>
            <dd className="text-white">
              {operatingModel ? (OPERATING_LABELS[operatingModel] ?? operatingModel) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Plan</dt>
            <dd className="text-white">{planKey ? planLabel(planKey) : "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Modules ({modules.length})</dt>
            <dd className="text-white">
              {modules.length ? modules.map(moduleLabel).join(", ") : "None"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Structure</dt>
            <dd className="text-white">
              {profile.departments.length} dept · {profile.branches.length} branches
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Roles & workflows</dt>
            <dd className="text-white">
              {profile.roles.length} roles · {profile.workflows.length} workflows
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Security requirements</dt>
            <dd className="text-white">{profile.securityRequirements.length} captured</dd>
          </div>
          <div>
            <dt className="text-slate-500">Integrations</dt>
            <dd className="text-white">{profile.integrations.length} systems</dd>
          </div>
          <div>
            <dt className="text-slate-500">SAREA experience</dt>
            <dd className="text-white">{profile.experienceRequirements.length} personas</dd>
          </div>
        </dl>
        {ctx.requestedSecurityPkgs.length > 0 && (
          <p className="text-sm text-slate-400">
            Security:{" "}
            {ctx.requestedSecurityPkgs.map((p) => securityPackageLabel(p.packageKey)).join(", ")}
          </p>
        )}
      </section>

      {canComplete ? (
        <DiscoveryCompleteButton requestId={requestId} />
      ) : blueprintRoutes ? (
        <section className="cc-glass-card border-teal-500/20 bg-teal-500/5">
          <p className="text-sm text-teal-300">Discovery completed — blueprint in build.</p>
          <Link
            href={blueprintRoutes.overview}
            className="mt-3 inline-block text-sm text-cyan-400 hover:text-cyan-300"
          >
            Open blueprint →
          </Link>
        </section>
      ) : null}

      <DiscoveryStepFooter backHref={d.experience} backLabel="← Experience" />
    </div>
  );
}
