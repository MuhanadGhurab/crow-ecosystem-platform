import { notFound } from "next/navigation";
import { DiscoveryIdentityForm } from "@/components/discovery/discovery-identity-form";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoveryIdentityPage({
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
      <header className="cc-entity-block cc-entity-block--cybercrow mb-2 !p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
          Identity & access
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Feeds blueprint IdP configuration and CyberCrow MFA policy at provision.
        </p>
      </header>
      <DiscoveryIdentityForm requestId={requestId} answers={profile.answers} />
      <DiscoveryStepFooter backHref={d.security} nextHref={d.integrations} nextLabel="Integrations →" />
    </div>
  );
}
