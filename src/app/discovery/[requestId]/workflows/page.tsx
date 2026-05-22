import { notFound } from "next/navigation";
import { DiscoveryEntityPanel } from "@/components/discovery/discovery-entity-panel";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import { addWorkflow, removeWorkflow } from "@/lib/actions/discovery";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoveryWorkflowsPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const ctx = await getDiscoveryContext(requestId);
  const profile = ctx?.discoveryProfile;

  if (!profile) {
    notFound();
  }

  const d = routes.discovery(requestId);

  return (
    <div className="space-y-8">
      <DiscoveryEntityPanel
        title="Workflows"
        description="Approval and operational flows to configure in CEM during blueprinting."
        emptyLabel="No workflows captured yet."
        items={profile.workflows.map((w) => ({
          id: w.id,
          primary: w.name,
          secondary: w.description ?? undefined,
        }))}
        requestId={requestId}
        addAction={addWorkflow}
        removeAction={removeWorkflow}
      >
        <input name="name" required placeholder="Workflow name" className="input-cc" />
        <input name="description" placeholder="Short description" className="input-cc" />
      </DiscoveryEntityPanel>

      <DiscoveryStepFooter
        backHref={d.roles}
        backLabel="← Roles"
        nextHref={d.summary}
        nextLabel="Summary →"
      />
    </div>
  );
}
