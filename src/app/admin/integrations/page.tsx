import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { listIntegrationConnections } from "@/lib/services/platform-admin.service";
import { routes } from "@/lib/routes";

export default async function AdminIntegrationsPage() {
  const connections = await listIntegrationConnections();

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Platform Admin"
        title="Integrations"
        description="Integration connections recorded during discovery and blueprint work. Advisory only — no automation or external calls are executed from here."
      />

      {connections.length === 0 ? (
        <section className="cc-glass-card space-y-3">
          <p className="text-sm font-medium text-white">No integration connections recorded</p>
          <p className="text-sm text-slate-500">
            This is expected until a request captures integrations during discovery, or a blueprint stores a connection reference.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href={routes.admin.requests} className="cc-btn-secondary text-sm">
              Review requests →
            </Link>
            <Link href={routes.admin.discovery} className="cc-btn-secondary text-sm">
              Open discovery workspace →
            </Link>
          </div>
        </section>
      ) : (
        <section className="cc-glass-card">
          <h3 className="text-sm font-medium text-cyan-400">Recorded connections</h3>
          <ul className="mt-3 space-y-2">
            {connections.map((c) => (
              <li key={c.id} className="cc-list-item justify-between text-sm">
                <span className="text-white">{c.providerKey}</span>
                <span className="font-mono text-xs text-slate-500">{c.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
