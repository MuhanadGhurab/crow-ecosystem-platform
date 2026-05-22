import { listIntegrationConnections } from "@/lib/services/platform-admin.service";

export default async function AdminIntegrationsPage() {
  const connections = await listIntegrationConnections();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Integrations</h2>
      <p className="text-sm text-slate-400">
        Platform and tenant integration connections (from discovery and blueprint).
      </p>
      {connections.length === 0 ? (
        <p className="text-sm text-slate-500">No integration connections recorded yet.</p>
      ) : (
        <ul className="space-y-2">
          {connections.map((c) => (
            <li
              key={c.id}
              className="flex justify-between rounded-cc border border-cyan-500/10 bg-white/5 px-4 py-3 text-sm"
            >
              <span className="text-white">{c.providerKey}</span>
              <span className="text-slate-500">{c.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
