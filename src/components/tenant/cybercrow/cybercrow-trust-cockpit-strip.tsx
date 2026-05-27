import Link from "next/link";
import { routes } from "@/lib/routes";

type CybercrowTrustCockpitStripProps = {
  tenantSlug: string;
};

const LINKS = [
  { key: "evidence", label: "Evidence" },
  { key: "grc", label: "GRC" },
  { key: "risk", label: "Risk" },
  { key: "securityEvents", label: "Security events" },
  { key: "auditLogs", label: "Audit logs" },
] as const;

export function CybercrowTrustCockpitStrip({ tenantSlug }: CybercrowTrustCockpitStripProps) {
  const r = routes.tenant(tenantSlug).cybercrow;

  return (
    <nav
      className="flex flex-wrap gap-2 rounded-lg border border-violet-500/20 bg-violet-950/25 px-3 py-2"
      aria-label="CyberCrow trust areas"
    >
      <span className="self-center pr-2 text-[10px] font-semibold uppercase tracking-wider text-violet-400">
        Trust cockpit
      </span>
      {LINKS.map(({ key, label }) => (
        <Link
          key={key}
          href={r[key]}
          className="rounded-md border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-200 hover:border-violet-400/40 hover:text-white"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
