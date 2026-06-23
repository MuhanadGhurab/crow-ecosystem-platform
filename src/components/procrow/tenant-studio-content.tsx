"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductPageHeader } from "@/components/product/product-page-header";
import { ProductSection } from "@/components/product/product-section";
import { ProductStatusCard } from "@/components/product/product-status-card";
import {
  composeTenantBlueprint,
  listCapabilities,
  listCyberCrowPolicyPacks,
  listIndustryArchetypes,
  listJobFamilies,
  listOrganizationalOverlays,
  listPermissionBundles,
  listRoleArchetypes,
  listSareaExperiencePatterns,
  listWorkflowPatterns,
  REFERENCE_COMPOSITIONS,
} from "@/lib/tenant-composition";
import { routes } from "@/lib/routes";

type CatalogTab =
  | "industries"
  | "capabilities"
  | "workflows"
  | "roles"
  | "jobFamilies"
  | "permissions"
  | "sarea"
  | "cybercrow"
  | "overlays";

const CATALOG_TABS: { id: CatalogTab; label: string }[] = [
  { id: "industries", label: "Industries" },
  { id: "capabilities", label: "Capabilities" },
  { id: "workflows", label: "Workflows" },
  { id: "roles", label: "Roles" },
  { id: "jobFamilies", label: "Job families" },
  { id: "permissions", label: "Permission bundles" },
  { id: "sarea", label: "SAREA patterns" },
  { id: "cybercrow", label: "CyberCrow packs" },
  { id: "overlays", label: "Overlays" },
];

export function TenantStudioContent() {
  const industries = listIndustryArchetypes();
  const overlays = listOrganizationalOverlays();
  const capabilities = listCapabilities();

  const [catalogTab, setCatalogTab] = useState<CatalogTab>("industries");
  const [industryKey, setIndustryKey] = useState(industries[0]?.key ?? "logistics_and_fleet");
  const [selectedOverlays, setSelectedOverlays] = useState<string[]>(["multi_branch"]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [approvalComplexity, setApprovalComplexity] = useState("medium");
  const [fieldWorkforce, setFieldWorkforce] = useState(false);
  const [referenceKey, setReferenceKey] = useState<string | "">("");

  const draft = useMemo(
    () =>
      composeTenantBlueprint({
        industryArchetype: industryKey,
        overlays: selectedOverlays,
        selectedCapabilities,
        organizationSignals: {
          approval_complexity: approvalComplexity,
          field_workforce: fieldWorkforce,
        },
      }),
    [industryKey, selectedOverlays, selectedCapabilities, approvalComplexity, fieldWorkforce],
  );

  function toggleOverlay(key: string) {
    setSelectedOverlays((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function toggleCapability(key: string) {
    setSelectedCapabilities((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function loadReference(key: string) {
    const ref = REFERENCE_COMPOSITIONS.find((r) => r.key === key);
    if (!ref) return;
    setReferenceKey(key);
    setIndustryKey(ref.industryArchetype);
    setSelectedOverlays([...ref.overlays]);
    setSelectedCapabilities([]);
    setApprovalComplexity(String(ref.organizationSignals.approval_complexity ?? "medium"));
    setFieldWorkforce(ref.organizationSignals.field_workforce === true);
  }

  return (
    <div className="space-y-10 pb-16">
      <Link href={routes.admin.overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Control tower overview
      </Link>

      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-50">
        Tenant Studio — internal composition surface. Draft recommendations only; no tenant provisioning or hosted
        mutations. PLATFORM_ADMIN only.
      </div>

      <ProductPageHeader
        eyebrow="ProCrow · Tenant composition"
        title="Tenant Studio"
        description="Browse composable catalogs, apply organizational overlays, and preview draft tenant blueprints. Industry and job titles are advisory — authorization remains tenant-scoped assignment."
        statusChip={{ label: "Draft composition", tone: "info" }}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <ProductSection title="Catalog explorer" description="Reusable building blocks across industries.">
            <div className="mb-4 flex flex-wrap gap-2">
              {CATALOG_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCatalogTab(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    catalogTab === tab.id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/50 p-3">
              {catalogTab === "industries" &&
                industries.map((item) => (
                  <CatalogRow key={item.key} title={item.displayName} meta={item.status} detail={item.commonOperatingModel} />
                ))}
              {catalogTab === "capabilities" &&
                capabilities.map((item) => (
                  <CatalogRow key={item.key} title={item.displayName} meta={item.status} detail={item.group} />
                ))}
              {catalogTab === "workflows" &&
                listWorkflowPatterns().map((item) => (
                  <CatalogRow key={item.key} title={item.displayName} meta={item.status} detail={item.description} />
                ))}
              {catalogTab === "roles" &&
                listRoleArchetypes().map((item) => (
                  <CatalogRow key={item.key} title={item.displayName} meta="advisory" detail={item.responsibilitySummary} />
                ))}
              {catalogTab === "jobFamilies" &&
                listJobFamilies().map((item) => (
                  <CatalogRow key={item.key} title={item.displayName} meta={item.domain} detail={item.description} />
                ))}
              {catalogTab === "permissions" &&
                listPermissionBundles().map((item) => (
                  <CatalogRow
                    key={item.key}
                    title={item.displayName}
                    meta={`scope:${item.scope}`}
                    detail={`${item.resource} — tenant-scoped`}
                  />
                ))}
              {catalogTab === "sarea" &&
                listSareaExperiencePatterns().map((item) => (
                  <CatalogRow
                    key={item.key}
                    title={item.displayName}
                    meta="presentation"
                    detail={`Mobile: ${item.mobileSuitability}`}
                  />
                ))}
              {catalogTab === "cybercrow" &&
                listCyberCrowPolicyPacks().map((item) => (
                  <CatalogRow key={item.key} title={item.displayName} meta={item.status} detail={item.purpose} />
                ))}
              {catalogTab === "overlays" &&
                overlays.map((item) => (
                  <CatalogRow key={item.key} title={item.displayName} meta={item.status} detail={item.description} />
                ))}
            </div>
          </ProductSection>

          <ProductSection title="Composition workspace" description="Select archetype, overlays, and signals.">
            <label className="mb-2 block text-sm text-slate-300">Industry archetype</label>
            <select
              value={industryKey}
              onChange={(e) => setIndustryKey(e.target.value)}
              className="mb-4 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              {industries.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.displayName}
                </option>
              ))}
            </select>

            <p className="mb-2 text-sm text-slate-300">Organizational overlays</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {overlays.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => toggleOverlay(o.key)}
                  className={`rounded-md px-2 py-1 text-xs ${
                    selectedOverlays.includes(o.key) ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {o.displayName}
                </button>
              ))}
            </div>

            <p className="mb-2 text-sm text-slate-300">Optional capability picks</p>
            <div className="mb-4 max-h-32 overflow-y-auto rounded border border-slate-700 p-2">
              {capabilities.slice(0, 24).map((c) => (
                <label key={c.key} className="flex items-center gap-2 py-0.5 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedCapabilities.includes(c.key)}
                    onChange={() => toggleCapability(c.key)}
                  />
                  {c.displayName}
                </label>
              ))}
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-slate-300">
                Approval complexity
                <select
                  value={approvalComplexity}
                  onChange={(e) => setApprovalComplexity(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="flex items-end gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={fieldWorkforce} onChange={(e) => setFieldWorkforce(e.target.checked)} />
                Field workforce signal
              </label>
            </div>

            <label className="mb-2 block text-sm text-slate-300">Load reference composition</label>
            <select
              value={referenceKey}
              onChange={(e) => loadReference(e.target.value)}
              className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="">— Select example —</option>
              {REFERENCE_COMPOSITIONS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.displayName}
                </option>
              ))}
            </select>
          </ProductSection>
        </div>

        <div className="space-y-8">
          <ProductSection title="Blueprint preview" description="Read-only draft composition timeline.">
            <CompositionBlock title="Departments" items={draft.recommendedDepartments} />
            <CompositionBlock title="Capabilities" items={draft.recommendedCapabilities} />
            <CompositionBlock title="Workflows" items={draft.recommendedWorkflows} />
            <CompositionBlock title="Role archetypes" items={draft.recommendedRoles} />
            <CompositionBlock title="Job families" items={draft.recommendedJobFamilies} />
            <CompositionBlock title="Permission bundles (advisory)" items={draft.recommendedPermissionBundles} />
            <CompositionBlock title="SAREA patterns" items={draft.recommendedSareaPatterns} />
            <CompositionBlock title="CyberCrow policy packs" items={draft.recommendedCyberCrowPolicyPacks} />

            {draft.warnings.length > 0 && (
              <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-200">Warnings</p>
                <ul className="space-y-1 text-xs text-amber-100">
                  {draft.warnings.map((w) => (
                    <li key={w}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {draft.unresolvedDecisions.length > 0 && (
              <div className="mt-4 rounded-lg border border-violet-500/40 bg-violet-500/10 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-200">
                  Unresolved decisions
                </p>
                <ul className="space-y-1 text-xs text-violet-100">
                  {draft.unresolvedDecisions.map((u) => (
                    <li key={u}>• {u}</li>
                  ))}
                </ul>
              </div>
            )}
          </ProductSection>

          <ProductSection title="Role ↔ workflow matrix" description="Advisory participation map.">
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Workflow</th>
                    <th className="px-3 py-2">Permission bundles</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.recommendedWorkflows.slice(0, 8).map((wfKey) => {
                    const wf = listWorkflowPatterns().find((w) => w.key === wfKey);
                    return (
                      <tr key={wfKey} className="border-t border-slate-800">
                        <td className="px-3 py-2 font-medium text-white">{wf?.displayName ?? wfKey}</td>
                        <td className="px-3 py-2">{(wf?.requiredPermissionBundleKeys ?? []).join(", ")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ProductSection>

          <div className="grid gap-3 sm:grid-cols-2">
            <ProductStatusCard
              status="Authority"
              title="No provisioning"
              why="Tenant Studio never mutates tenants, Discovery, or platform assignments."
              nextAction="Export draft for blueprint review"
            />
            <ProductStatusCard
              status="SAREA"
              title="Presentation only"
              why="Experience patterns consume authority; they never create it."
              nextAction="Assign bundles at tenant build time"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogRow({ title, meta, detail }: { title: string; meta: string; detail: string }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950/60 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="shrink-0 rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-slate-400">{meta}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function CompositionBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title} ({items.length})
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-cyan-100">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
