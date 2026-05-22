import { notFound } from "next/navigation";
import { DiscoveryEntityPanel } from "@/components/discovery/discovery-entity-panel";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import { addIntegration, removeIntegration } from "@/lib/actions/discovery";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoveryIntegrationsPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const ctx = await getDiscoveryContext(requestId);
  const profile = ctx?.discoveryProfile;
  if (!profile) notFound();

  const d = routes.discovery(requestId);

  return (
    <div className="space-y-8">
      <header className="cc-entity-block cc-entity-block--cem mb-2 !p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Integrations</p>
        <p className="mt-1 text-sm text-slate-400">
          ERP, IdP, and messaging connectors inform blueprint integration slots at go-live.
        </p>
      </header>
      <DiscoveryEntityPanel
        title="Integrations"
        description="Systems to connect at or after go-live."
        emptyLabel="No integrations listed yet."
        items={profile.integrations.map((i) => ({
          id: i.id,
          primary: i.providerKey,
          secondary: i.notes ?? undefined,
        }))}
        requestId={requestId}
        addAction={addIntegration}
        removeAction={removeIntegration}
      >
        <input name="providerKey" required placeholder="e.g. microsoft-365" className="input-cc" />
        <input name="notes" placeholder="Scope / notes" className="input-cc" />
      </DiscoveryEntityPanel>
      <DiscoveryStepFooter backHref={d.identity} nextHref={d.experience} nextLabel="Experience →" />
    </div>
  );
}
