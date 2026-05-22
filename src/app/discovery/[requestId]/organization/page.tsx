import { notFound } from "next/navigation";
import { DiscoveryOrganizationForm } from "@/components/discovery/discovery-organization-form";
import { DiscoveryTemplateApply } from "@/components/discovery/discovery-template-apply";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import { getDiscoveryAnswer } from "@/lib/discovery-answers";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoveryOrganizationPage({
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
  const d = routes.discovery(requestId);

  const hasStructure =
    ctx.discoveryProfile.departments.length > 0 || ctx.discoveryProfile.branches.length > 0;

  return (
    <>
      <header className="cc-entity-block cc-entity-block--cem mb-6 !p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Step 1 · Organization</p>
        <p className="mt-1 text-sm text-slate-400">
          CEM foundation — org profile feeds blueprint pricing and tenant slug at go-live.
        </p>
      </header>
      <DiscoveryTemplateApply
        requestId={requestId}
        industry={ctx.industry}
        hasStructure={hasStructure}
      />
      <DiscoveryOrganizationForm
        requestId={requestId}
        initial={{
          organizationName: ctx.organizationName,
          industry: ctx.industry,
          operatingModel: getDiscoveryAnswer<string>(answers, "organization", "operatingModel") ?? "",
          employeeBand:
            getDiscoveryAnswer<string>(answers, "organization", "employeeBand") ??
            ctx.employeeBand ??
            "",
          goLiveTarget: getDiscoveryAnswer<string>(answers, "organization", "goLiveTarget") ?? "",
          discoveryNotes: getDiscoveryAnswer<string>(answers, "organization", "discoveryNotes") ?? "",
        }}
      />
      <DiscoveryStepFooter nextHref={d.modules} nextLabel="2. Modules →" />
    </>
  );
}
