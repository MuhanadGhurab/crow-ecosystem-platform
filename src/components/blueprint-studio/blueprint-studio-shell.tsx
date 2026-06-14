import Link from "next/link";
import { BlueprintStatusBadge } from "@/components/admin/blueprint-status-badge";
import { ProductPageHeader } from "@/components/product/product-page-header";
import {
  BLUEPRINT_STUDIO_SECTIONS,
  type BlueprintStudioSectionKey,
} from "@/lib/crow-core/blueprint-studio/studio-sections";
import { COMMERCIAL_ADVISORY_FOOTER } from "@/lib/crow-core/commercial-intelligence/advisory-labels";
import type { BlueprintStudioContext } from "@/lib/server/blueprint-studio-load";
import { routes } from "@/lib/routes";
import { BlueprintStudioSectionContent } from "./blueprint-studio-section-content";
import { BlueprintStudioTraceabilityDrawer } from "./blueprint-studio-traceability-drawer";

type BlueprintStudioShellProps = {
  blueprintId: string;
  section: BlueprintStudioSectionKey;
  context: BlueprintStudioContext;
};

export function BlueprintStudioShell({
  blueprintId,
  section,
  context,
}: BlueprintStudioShellProps) {
  const b = routes.blueprint(blueprintId);
  const latestVersion = context.versions[context.versions.length - 1];
  const readinessPct =
    context.readiness.checks.length === 0
      ? 0
      : Math.round(
          (context.readiness.checks.filter((c) => c.complete).length /
            context.readiness.checks.length) *
            100
        );

  return (
    <div className="space-y-6">
      {context.isReferenceFixture && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Reference assumptions — not client-validated. Meem Global vertical slice fixture.
        </div>
      )}

      <ProductPageHeader
        eyebrow="Blueprint Command Center"
        title={context.organizationName}
        description="Compose discovery evidence into an enterprise blueprint, ROI scenarios, and SOW draft. Advisory outputs only — human approval required."
        statusChip={{
          label: context.lifecycleState,
          tone: context.lifecycleState === "APPROVED" ? "success" : "info",
        }}
      />

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-sm">
        <BlueprintStatusBadge status={context.blueprintStatus as "DRAFT" | "IN_REVIEW" | "APPROVED" | "ARCHIVED"} />
        <span className="text-slate-400">
          Proposal: <span className="text-slate-200">{context.proposalStatus ?? "—"}</span>
        </span>
        <span className="text-slate-400">
          Version:{" "}
          <span className="font-mono text-cyan-300">
            {latestVersion ? `v${latestVersion.ref.version}` : "—"}
          </span>
        </span>
        <span className="text-slate-400">
          Readiness: <span className="text-white">{readinessPct}%</span>
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <Link href={b.overview} className="cc-btn-secondary !px-3 !py-1.5 text-xs">
            Legacy overview
          </Link>
          <Link href={b.pricing} className="cc-btn-secondary !px-3 !py-1.5 text-xs">
            Pricing
          </Link>
        </div>
      </div>

      <nav
        className="flex flex-wrap gap-1 border-b border-slate-700/60 pb-2"
        aria-label="Blueprint studio sections"
      >
        {BLUEPRINT_STUDIO_SECTIONS.map((item) => {
          const active = item.key === section;
          return (
            <Link
              key={item.key}
              href={b.studioSection(item.key)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-cyan-500/20 font-medium text-cyan-200"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <BlueprintStudioSectionContent section={section} context={context} />
        <BlueprintStudioTraceabilityDrawer timeline={context.timeline} />
      </div>

      <p className="text-xs text-slate-500">{COMMERCIAL_ADVISORY_FOOTER}</p>
    </div>
  );
}
