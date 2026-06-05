import Link from "next/link";
import type { SareaExperienceMappingSnapshot } from "@/lib/sarea/sarea-experience-mapping-contract";
import { routes } from "@/lib/routes";

type Props = {
  snapshot: SareaExperienceMappingSnapshot;
  compact?: boolean;
  area?: "overview" | "profiles" | "role_mapping" | "preview" | "navigation" | "widgets";
};

export function SareaBlueprintExperienceSummary({ snapshot, compact, area }: Props) {
  const areaNote =
    area === "role_mapping"
      ? "Blueprint roles map to SAREA personas — experience mapping only, not access granting."
      : area === "navigation"
        ? "Navigation visibility recommendations per persona — users still need RBAC for each module."
        : area === "widgets"
          ? "Widget visibility recommendations per persona — hidden widgets do not remove authorization."
          : area === "preview"
            ? "Role-based preview from recommended personas — no permission mutation."
            : null;

  return (
    <section
      className={
        compact
          ? "rounded-lg border border-rose-500/15 bg-rose-950/15 px-3 py-2 text-xs"
          : "rounded-xl border border-rose-500/20 bg-rose-950/20 p-4 space-y-3 text-sm"
      }
    >
      <p className={compact ? "font-medium text-rose-200" : "text-xs font-semibold uppercase text-rose-300"}>
        Blueprint-to-experience mapping (M2)
      </p>
      {!compact && (
        <p className="text-xs text-slate-400">
          {snapshot.cyberCrowDependencies[0]} Tenant:{" "}
          <span className="text-white">{snapshot.tenantName}</span> · Status:{" "}
          <span className="text-rose-200">{snapshot.status.replace(/_/g, " ")}</span>
        </p>
      )}
      {areaNote && <p className="text-xs text-slate-500">{areaNote}</p>}
      {!compact && snapshot.personas.length > 0 && (
        <ul className="text-xs text-slate-400 list-disc list-inside space-y-0.5">
          {snapshot.personas.slice(0, 4).map((p) => (
            <li key={p.key}>
              {p.label} — {p.experienceDensity} density · {p.modulesVisible.slice(0, 3).join(", ")}
            </li>
          ))}
        </ul>
      )}
      {snapshot.warnings.length > 0 && compact && (
        <p className="mt-1 text-amber-200/90">{snapshot.warnings[0]}</p>
      )}
      {!compact && (
        <Link href={routes.sarea.roleMapping} className="text-xs text-rose-400 hover:text-rose-300">
          Role mapping →
        </Link>
      )}
    </section>
  );
}
