"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductPageHeader } from "@/components/product/product-page-header";
import { PersonaCard } from "@/components/procrow/studio/persona-card";
import { ModelDnaSummary } from "@/components/procrow/studio/model-dna-summary";
import { ScaleDimensionProfile } from "@/components/procrow/studio/scale-radar";
import { StudioPanel, StudioStatusChip, StudioEmptyState } from "@/components/procrow/studio/studio-panel";
import { studioMotion } from "@/components/procrow/studio/studio-motion";
import {
  HYBRID_REFERENCE_MODELS,
  buildScaleProfile,
  composeEnterpriseModel,
  listOrganizationalTopologies,
  listSpecialistDomains,
  scaleWorkflowTemplate,
  suggestPersonaMerge,
  suggestPersonaSplit,
  type TenantScalePreset,
  type OrganizationalTopologyKey,
} from "@/lib/model-forge";
import { listIndustryArchetypes, listOrganizationalOverlays } from "@/lib/tenant-composition";
import { routes } from "@/lib/routes";

type ForgeTab = "composer" | "personas" | "workflows" | "dna" | "relationships";

export function ModelForgeContent() {
  const industries = listIndustryArchetypes();
  const specialists = listSpecialistDomains();
  const topologies = listOrganizationalTopologies();
  const overlays = listOrganizationalOverlays();

  const [tab, setTab] = useState<ForgeTab>("composer");
  const [primaryIndustry, setPrimaryIndustry] = useState("technology_and_saas");
  const [secondaryIndustries, setSecondaryIndustries] = useState<string[]>(["media_and_creative"]);
  const [specialistDomains, setSpecialistDomains] = useState<string[]>(["gaming_and_esports"]);
  const [scalePreset, setScalePreset] = useState<TenantScalePreset>("GROWING_ORGANIZATION");
  const [topology, setTopology] = useState<OrganizationalTopologyKey>("PRODUCT_TEAMS");
  const [selectedOverlays, setSelectedOverlays] = useState<string[]>(["mid_market"]);
  const [referenceKey, setReferenceKey] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [generated, setGenerated] = useState(false);

  const scaleProfile = useMemo(() => buildScaleProfile(scalePreset), [scalePreset]);

  const draft = useMemo(
    () =>
      composeEnterpriseModel({
        primaryIndustry,
        secondaryIndustries,
        specialistDomains,
        organizationalOverlays: selectedOverlays,
        scaleProfile,
        topologies: [topology],
        organizationSignals: { approval_complexity: "medium" },
      }),
    [primaryIndustry, secondaryIndustries, specialistDomains, selectedOverlays, scaleProfile, topology],
  );

  const mergeSuggestions = useMemo(() => suggestPersonaMerge(draft.workPersonas.map((p) => p.key), scaleProfile), [draft.workPersonas, scaleProfile]);
  const splitSuggestions = useMemo(() => suggestPersonaSplit("workflow_coordinator", scaleProfile), [scaleProfile]);
  const scaledWorkflow = draft.workflowTemplates[0] ? scaleWorkflowTemplate(draft.workflowTemplates[0].key, scaleProfile) : null;

  function toggleSpecialist(key: string) {
    setSpecialistDomains((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function loadReference(key: string) {
    const ref = HYBRID_REFERENCE_MODELS.find((r) => r.key === key);
    if (!ref) return;
    setReferenceKey(key);
    const i = ref.input;
    setPrimaryIndustry(i.primaryIndustry);
    setSecondaryIndustries([...(i.secondaryIndustries ?? [])]);
    setSpecialistDomains([...(i.specialistDomains ?? [])]);
    setSelectedOverlays([...(i.organizationalOverlays ?? [])]);
    if (i.scaleProfile) setScalePreset(i.scaleProfile.preset);
    if (i.topologies?.[0]) setTopology(i.topologies[0]);
    setGenerated(true);
  }

  function handleGenerate() {
    setGenerated(true);
    setTab("dna");
  }

  const exportJson = JSON.stringify(
    {
      version: "1.0.0",
      advisory: true,
      authoritative: false,
      dna: draft.dna,
      personaCount: draft.workPersonas.length,
      workflowCount: draft.workflowTemplates.length,
      warnings: draft.warnings,
    },
    null,
    2,
  );

  const tabs: { id: ForgeTab; label: string }[] = [
    { id: "composer", label: "Operating model" },
    { id: "personas", label: "Work personas" },
    { id: "workflows", label: "Workflow forge" },
    { id: "dna", label: "Model DNA" },
    { id: "relationships", label: "Relationships" },
  ];

  return (
    <div className="space-y-8 pb-16">
      <nav className="flex flex-wrap items-center gap-3 text-sm">
        <Link href={routes.admin.overview} className="text-cyan-400 hover:text-cyan-300">
          ← Overview
        </Link>
        <span className="text-slate-600">|</span>
        <Link href={routes.admin.tenantStudio} className="text-slate-400 hover:text-cyan-300">
          Tenant Studio
        </Link>
        <span className="text-slate-600">|</span>
        <span className="text-violet-300">Model Forge</span>
      </nav>

      <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-50">
        Enterprise Model Forge — draft invention only. No provisioning, no permission grants, no hosted writes.
        PLATFORM_ADMIN only.
      </div>

      <ProductPageHeader
        eyebrow="ProCrow · Enterprise model design"
        title="Model Forge"
        description="Compose hybrid operating models, Work Personas, workflow networks, KPI and evidence recommendations. All outputs are explainable, reviewable, and non-authoritative."
        statusChip={{ label: "Draft model", tone: "info" }}
      />

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${studioMotion.chipSelect} ${studioMotion.reducedMotion} ${
              tab === t.id ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`grid gap-8 lg:grid-cols-2 ${studioMotion.tabTransition}`}>
        {tab === "composer" && (
          <>
            <StudioPanel title="Operating Model Composer" description="Hybrid industry + specialist domain composition.">
              <label className="mb-1 block text-xs text-slate-400">Primary industry</label>
              <select
                value={primaryIndustry}
                onChange={(e) => setPrimaryIndustry(e.target.value)}
                className="mb-3 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white"
              >
                {industries.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.displayName}
                  </option>
                ))}
              </select>

              <p className="mb-1 text-xs text-slate-400">Specialist domains</p>
              <div className="mb-3 max-h-36 overflow-y-auto rounded border border-slate-700 p-2">
                {specialists.map((s) => (
                  <label key={s.key} className="flex items-center gap-2 py-0.5 text-xs text-slate-300">
                    <input type="checkbox" checked={specialistDomains.includes(s.key)} onChange={() => toggleSpecialist(s.key)} />
                    {s.displayName}
                  </label>
                ))}
              </div>

              <label className="mb-1 block text-xs text-slate-400">Scale preset</label>
              <select
                value={scalePreset}
                onChange={(e) => setScalePreset(e.target.value as TenantScalePreset)}
                className="mb-3 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm"
              >
                {(["SOLO", "MICRO", "SMALL_TEAM", "GROWING_ORGANIZATION", "MULTI_DEPARTMENT", "MULTI_BRANCH", "ENTERPRISE", "GROUP_OR_ECOSYSTEM"] as const).map((p) => (
                  <option key={p} value={p}>
                    {p.replace(/_/g, " ")}
                  </option>
                ))}
              </select>

              <label className="mb-1 block text-xs text-slate-400">Organizational topology</label>
              <select
                value={topology}
                onChange={(e) => setTopology(e.target.value as OrganizationalTopologyKey)}
                className="mb-3 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm"
              >
                {topologies.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.displayName}
                  </option>
                ))}
              </select>

              <p className="mb-1 text-xs text-slate-400">Overlays</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {overlays.slice(0, 10).map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() =>
                      setSelectedOverlays((prev) => (prev.includes(o.key) ? prev.filter((k) => k !== o.key) : [...prev, o.key]))
                    }
                    className={`rounded px-2 py-0.5 text-[10px] ${selectedOverlays.includes(o.key) ? "bg-cyan-700 text-white" : "bg-slate-800 text-slate-500"}`}
                  >
                    {o.displayName}
                  </button>
                ))}
              </div>

              <label className="mb-1 block text-xs text-slate-400">Hybrid reference</label>
              <select
                value={referenceKey}
                onChange={(e) => loadReference(e.target.value)}
                className="mb-4 w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm"
              >
                <option value="">— Select hybrid example —</option>
                {HYBRID_REFERENCE_MODELS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.displayName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleGenerate}
                className="w-full rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                Generate draft model
              </button>
            </StudioPanel>

            <StudioPanel title="Scale profile" description="Multidimensional scale — does not grant features or authority.">
              <ScaleDimensionProfile dimensions={scaleProfile.dimensions} />
            </StudioPanel>
          </>
        )}

        {tab === "personas" && (
          <div className="lg:col-span-2">
            {!generated ? (
              <StudioEmptyState title="No draft generated" detail="Use Operating Model Composer to generate Work Personas." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {draft.workPersonas.map((p) => (
                  <PersonaCard key={p.key} persona={p} />
                ))}
              </div>
            )}
            {(mergeSuggestions.length > 0 || splitSuggestions.length > 0) && (
              <div className={`mt-4 studio-surface p-3 ${studioMotion.warningReveal}`}>
                <p className="mb-2 text-xs font-semibold text-amber-200">Persona granularity recommendations</p>
                {mergeSuggestions.map((m) => (
                  <p key={m.recommendation} className="text-xs text-slate-400">
                    Merge: {m.recommendation} — {m.riskWarning}
                  </p>
                ))}
                {splitSuggestions.map((s) => (
                  <p key={s.recommendation} className="text-xs text-slate-400">
                    Split: {s.recommendation} — {s.riskWarning}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "workflows" && (
          <div className="lg:col-span-2 space-y-4">
            {draft.workflowTemplates.length === 0 ? (
              <StudioEmptyState title="No workflows" detail="Select specialist domains to include workflow templates." />
            ) : (
              draft.workflowTemplates.slice(0, 8).map((wf) => (
                <StudioPanel key={wf.key} title={wf.displayName} description={wf.purpose}>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <StudioStatusChip label={wf.topology} tone="advisory" />
                    <StudioStatusChip label={`${wf.states.length} states`} />
                  </div>
                  <p className="text-xs text-slate-500">States: {wf.states.join(" → ")}</p>
                  <p className="mt-1 text-xs text-slate-500">Positions: {wf.workflowPositions.join(", ")}</p>
                </StudioPanel>
              ))
            )}
            {scaledWorkflow && (
              <StudioPanel title="Scaled workflow variant" description={scaledWorkflow.rationale}>
                <p className="text-xs text-slate-400">Approval depth: {scaledWorkflow.approvalDepth}</p>
                <p className="mt-1 text-xs text-cyan-100">{scaledWorkflow.states.join(" → ")}</p>
              </StudioPanel>
            )}
          </div>
        )}

        {tab === "dna" && (
          <div className="lg:col-span-2">
            <StudioPanel title="Organizational Model DNA" description="Explainable summary with provenance.">
              <ModelDnaSummary dna={draft.dna} />
            </StudioPanel>
          </div>
        )}

        {tab === "relationships" && (
          <div className="lg:col-span-2 space-y-4">
            <StudioPanel title="Persona ↔ workflow matrix" description="Advisory participation map.">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-500">
                    <tr>
                      <th className="px-2 py-1.5">Persona</th>
                      <th className="px-2 py-1.5">Workflows</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.workPersonas.slice(0, 10).map((p) => (
                      <tr key={p.key} className="border-t border-slate-800">
                        <td className="px-2 py-1.5">{p.displayName}</td>
                        <td className="px-2 py-1.5">{p.workflowParticipation.join(", ") || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </StudioPanel>

            <StudioPanel title="Authority proposals" description="authoritative: false — requires human approval.">
              {draft.authorityProposals.map((a) => (
                <div key={a.key} className="mb-2 rounded border border-amber-500/30 bg-amber-500/5 p-2 text-xs">
                  <p className="font-medium text-amber-100">{a.displayName}</p>
                  <p className="text-slate-400">{a.description}</p>
                  <p className="mt-1 text-slate-500">Bundles: {a.recommendedPermissionBundleKeys.join(", ")}</p>
                </div>
              ))}
            </StudioPanel>

            <StudioPanel title="KPI & evidence" description="Outcome-focused metrics — no employee surveillance.">
              <p className="mb-2 text-xs text-slate-400">KPIs ({draft.kpiRecommendations.length})</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {draft.kpiRecommendations.map((k) => (
                  <span key={k.key} className="studio-chip">
                    {k.displayName}
                  </span>
                ))}
              </div>
              <p className="mb-2 text-xs text-slate-400">Evidence requirements</p>
              <div className="flex flex-wrap gap-1">
                {draft.evidenceRequirements.map((e) => (
                  <span key={e.key} className="studio-chip-violet">
                    {e.displayName}
                  </span>
                ))}
              </div>
            </StudioPanel>
          </div>
        )}
      </div>

      {draft.warnings.length > 0 && (
        <div className={`studio-surface border-amber-500/30 p-4 ${studioMotion.warningReveal}`}>
          <p className="mb-2 text-xs font-semibold uppercase text-amber-200">Advisory warnings</p>
          <ul className="space-y-1 text-xs text-amber-100/90">
            {draft.warnings.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setExportOpen(!exportOpen)}
          className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          {exportOpen ? "Hide" : "Export"} draft JSON
        </button>
      </div>
      {exportOpen && (
        <pre className="max-h-64 overflow-auto rounded-lg border border-slate-700 bg-slate-950 p-4 text-[11px] text-cyan-100">
          {exportJson}
        </pre>
      )}
    </div>
  );
}
