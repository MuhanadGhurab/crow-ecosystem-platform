import Link from "next/link";

import { notFound } from "next/navigation";

import { BlueprintStatusBadge } from "@/components/admin/blueprint-status-badge";

import { RequestStatusBadge } from "@/components/admin/request-status-badge";

import { BlueprintProposalPanel } from "@/components/blueprint/commercial/blueprint-proposal-panel";

import { BlueprintProvisionForm } from "@/components/blueprint/blueprint-provision-form";

import {

  evaluatePreProvisionReadiness,

} from "@/lib/services/readiness.service";

import { moduleLabel, planLabel } from "@/lib/catalog-labels";

import { routes } from "@/lib/routes";

import { slugifyOrganization } from "@/lib/slugify";

import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";

import { resolveBlueprintPricingEstimate } from "@/lib/blueprint-pricing";

import type { ImplementationRequestStatus } from "@/lib/types/platform";



export default async function BlueprintOverviewPage({

  params,

}: {

  params: Promise<{ blueprintId: string }>;

}) {

  const { blueprintId } = await params;

  const blueprint = await getEnterpriseBlueprint(blueprintId).catch(() => null);



  if (!blueprint) {

    notFound();

  }



  const planKey = blueprint.request.requestedPlans[0]?.planKey;

  const suggestedSlug = slugifyOrganization(blueprint.request.organizationName);

  const hasTenant = Boolean(blueprint.tenant);

  const estimate = await resolveBlueprintPricingEstimate(blueprint.requestId);



  const estimatedMonthlySar = blueprint.request.estimatedMonthlySar

    ? Number(blueprint.request.estimatedMonthlySar)

    : null;

  const preProvision = hasTenant ? null : await evaluatePreProvisionReadiness(blueprintId).catch(() => null);

  const b = routes.blueprint(blueprintId);



  return (

    <div className="space-y-8">

      <div className="grid gap-8 xl:grid-cols-[1fr_min(22rem,40%)] xl:items-start">

        <div className="space-y-6">

          <section className="cc-glass-card grid gap-4 sm:grid-cols-2">

            <div>

              <p className="text-xs text-slate-500">Blueprint status</p>

              <div className="mt-1">

                <BlueprintStatusBadge status={blueprint.status} />

              </div>

            </div>

            <div>

              <p className="text-xs text-slate-500">Request status</p>

              <div className="mt-1">

                <RequestStatusBadge

                  status={blueprint.request.status as ImplementationRequestStatus}

                />

              </div>

            </div>

            <div>

              <p className="text-xs text-slate-500">Plan</p>

              <p className="text-lg font-medium text-cyan-300">{planKey ? planLabel(planKey) : "—"}</p>

            </div>

            <div className="sm:col-span-2">

              <p className="text-xs text-slate-500">Modules ({blueprint.modules.length})</p>

              <p className="mt-1 text-sm text-slate-300">

                {blueprint.modules.length

                  ? blueprint.modules.map((m) => moduleLabel(m.moduleKey)).join(" · ")

                  : "No modules on blueprint yet"}

              </p>

            </div>

          </section>



          <div className="flex flex-wrap gap-2">

            <Link href={b.readiness} className="cc-btn-secondary text-sm">

              Readiness checklist →

            </Link>

            <Link href={b.goLive} className="cc-btn-primary text-sm">

              Go live →

            </Link>

          </div>



          {hasTenant && blueprint.tenant ? (

            <section className="cc-go-live-hero">

              <p className="text-sm font-medium text-teal-300">Tenant provisioned</p>

              <p className="mt-2 font-mono text-2xl text-cyan-300">/{blueprint.tenant.slug}</p>

              <Link

                href={routes.tenant(blueprint.tenant.slug).dashboard}

                className="mt-4 inline-block cc-btn-primary text-sm"

              >

                Open CEM workspace →

              </Link>

            </section>

          ) : (

            <BlueprintProvisionForm

              blueprintId={blueprintId}

              suggestedSlug={suggestedSlug}

              blockers={preProvision?.blockers ?? []}

              warnings={preProvision?.warnings ?? []}

            />

          )}

        </div>



        <div className="xl:sticky xl:top-24 xl:self-start">
          <BlueprintProposalPanel
            blueprintId={blueprintId}
            proposalStatus={blueprint.proposalStatus}
            proposalToken={blueprint.proposalToken}
            estimatedMonthlySar={estimatedMonthlySar}
            estimateBreakdown={estimate}
          />
          <p className="mt-3 text-center text-xs text-slate-500">
            <Link href={b.pricing} className="text-cyan-400 hover:text-cyan-300">
              Full pricing workspace →
            </Link>
          </p>
        </div>
      </div>

    </div>

  );

}

