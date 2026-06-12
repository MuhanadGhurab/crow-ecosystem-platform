import Link from "next/link";
import { TENANT_COMMAND_CENTER_SUBTITLE, TENANT_COMMAND_CENTER_TITLE } from "@/lib/constants/tenant-command-center";
import { routes } from "@/lib/routes";

type TenantCommandCenterHeaderProps = {
  displayName: string;
  slug: string;
  healthLabel: string;
  runtimeLabel: string;
  portalReadinessLabel: string;
  membershipCount: number;
  enabledModuleCount: number;
  cybercrowInitialized: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  requestReference?: string;
};

function StatusChip({
  label,
  tone = "muted",
}: {
  label: string;
  tone?: "success" | "attention" | "muted" | "accent";
}) {
  const toneClass =
    tone === "success"
      ? "border-teal-500/35 bg-teal-500/10 text-teal-200"
      : tone === "attention"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-200"
        : tone === "accent"
          ? "border-cyan-500/35 bg-cyan-500/10 text-cyan-200"
          : "border-slate-600/50 bg-slate-800/50 text-slate-300";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${toneClass}`}>
      {label}
    </span>
  );
}

export function TenantCommandCenterHeader({
  displayName,
  slug,
  healthLabel,
  runtimeLabel,
  portalReadinessLabel,
  membershipCount,
  enabledModuleCount,
  cybercrowInitialized,
  createdAt,
  updatedAt,
  requestReference,
}: TenantCommandCenterHeaderProps) {
  const created = createdAt ? new Date(createdAt).toLocaleDateString() : null;
  const updated = updatedAt ? new Date(updatedAt).toLocaleDateString() : null;

  return (
    <header className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-slate-950/40 to-slate-950/20 p-5 sm:p-6">
      <Link href={routes.admin.tenants} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← All tenants
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
        ProCrow · {TENANT_COMMAND_CENTER_TITLE}
      </p>
      <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{displayName}</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-400">{TENANT_COMMAND_CENTER_SUBTITLE}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="font-mono text-cyan-300">/{slug}</span>
        {requestReference && (
          <>
            <span aria-hidden>·</span>
            <span className="font-mono">{requestReference}</span>
          </>
        )}
        {created && (
          <>
            <span aria-hidden>·</span>
            <span>Created {created}</span>
          </>
        )}
        {updated && (
          <>
            <span aria-hidden>·</span>
            <span>Updated {updated}</span>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusChip label={`Health: ${healthLabel}`} tone="accent" />
        <StatusChip label={`Runtime: ${runtimeLabel}`} tone={cybercrowInitialized ? "success" : "attention"} />
        <StatusChip label={`Portal: ${portalReadinessLabel}`} />
        <StatusChip label={`${membershipCount} membership${membershipCount === 1 ? "" : "s"}`} />
        <StatusChip label={`${enabledModuleCount} module${enabledModuleCount === 1 ? "" : "s"}`} tone="muted" />
      </div>
    </header>
  );
}
