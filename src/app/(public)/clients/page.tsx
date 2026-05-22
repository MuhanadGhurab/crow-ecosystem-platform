import Link from "next/link";
import { PublicPageHeader } from "@/components/public/public-page-header";
import { MARKETING_CLIENTS } from "@/lib/constants/marketing";
import { PLATFORM_IDENTITIES } from "@/lib/constants/platform";

const ENGINE_BADGE: Record<string, keyof typeof PLATFORM_IDENTITIES> = {
  CEM: "cem",
  CyberCrow: "cybercrow",
  SAREA: "sarea",
};

export default function ClientsPage() {
  return (
    <>
      <PublicPageHeader
        badge="Trust"
        title="Clients"
        description="Organizations running on Crow Ecosystem across the Kingdom and GCC — implementation through governed go-live."
      />
      <div className="cc-public-section space-y-10">
        <p className="max-w-2xl text-sm text-slate-400">
          Representative engagements shown for positioning. Full case narratives publish on{" "}
          <Link href="/case-studies" className="text-cyan-400 hover:text-cyan-300">
            case studies
          </Link>
          .
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {MARKETING_CLIENTS.map((client) => (
            <article key={client.name} className="cc-glass-card">
              <h2 className="font-display text-lg font-semibold text-white">{client.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {client.industry} · {client.region}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {client.engines.map((engine) => {
                  const key = ENGINE_BADGE[engine];
                  const id = PLATFORM_IDENTITIES[key];
                  return (
                    <span key={engine} className={`cc-entity-badge cc-entity-badge--${key}`}>
                      {id.name}
                    </span>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <Link href="/request" className="cc-btn-primary inline-block">
          Start your implementation →
        </Link>
      </div>
    </>
  );
}
