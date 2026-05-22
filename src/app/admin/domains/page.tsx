import { PageHeader } from "@/components/ui/page-header";
import { listPlatformDomains } from "@/lib/services/platform-admin.service";

export default function AdminDomainsPage() {
  const domains = listPlatformDomains();

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Architecture"
        title="Platform domains"
        description="Ten orchestration engines that map to routes and services in the Crow Ecosystem."
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {domains.map((d) => (
          <li key={d.id} className="cc-glass-card">
            <p className="font-mono text-xs text-cyan-400">{d.id} · {d.key}</p>
            <p className="mt-1 font-medium text-white">{d.name}</p>
            <p className="mt-2 text-sm text-slate-400">{d.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
