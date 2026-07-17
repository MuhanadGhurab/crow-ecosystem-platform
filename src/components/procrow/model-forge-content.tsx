"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PersonaCard } from "@/components/procrow/studio/persona-card";
import { ModelDnaSummary } from "@/components/procrow/studio/model-dna-summary";
import { ScaleDimensionProfile } from "@/components/procrow/studio/scale-radar";
import { StudioPanel, StudioStatusChip, StudioEmptyState } from "@/components/procrow/studio/studio-panel";
import { StudioShell } from "@/components/procrow/studio/studio-shell";
import { StudioModeSwitcher, type ForgeMode } from "@/components/procrow/studio/studio-mode-switcher";
import {
  StudioGraphCanvas,
  StudioGraphControls,
  StudioValidationList,
} from "@/components/procrow/studio/studio-graph-canvas";
import { StudioInspector, StudioScenarioDiff } from "@/components/procrow/studio/studio-scenario-diff";
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
  buildOperatingGraph,
  filterGraph,
  getConnectedNodeIds,
  compareOperatingModelVariants,
  OPERATING_MODEL_VARIANTS,
  GRAPH_LAYOUT_MODES,
  computeGraphBounds,
  fitViewportToBounds,
  DEFAULT_VIEWPORT,
  ENTITY_PACK_CATALOG,
  DEPARTMENT_ARCHETYPE_CATALOG,
  createDraftPersonaFromTemplate,
  createDraftWorkflowFromTemplate,
  exportDraftPersonaJson,
  exportDraftWorkflowJson,
  type TenantScalePreset,
  type OrganizationalTopologyKey,
  type GraphLayoutMode,
  type OperatingModelVariantKey,
  type DraftWorkPersona,
  type DraftWorkflow,
} from "@/lib/model-forge";
import { compileEnterpriseBlueprintPreview } from "@/lib/model-forge/blueprint/blueprint-compiler";
import { saveCompileInputToSession, saveBlueprintPreviewToSession } from "@/lib/model-forge/blueprint/blueprint-session";
import { listIndustryArchetypes, listOrganizationalOverlays } from "@/lib/tenant-composition";
import { routes } from "@/lib/routes";
import type { ClientEnterpriseDesignSnapshot } from "@/lib/client-enterprise-design/types";

type ClientDesignHandoff = {
  requestId: string;
  snapshot: ClientEnterpriseDesignSnapshot;
  clientSelections: {
    field: string | null;
    domains: string[];
    primaryPurpose: string | null;
    currentScale: string | null;
    targetScale: string | null;
  };
};

export function ModelForgeContent({
  clientDesignHandoff = null,
}: {
  clientDesignHandoff?: ClientDesignHandoff | null;
}) {
  const router = useRouter();
  const industries = listIndustryArchetypes();
  const specialists = listSpecialistDomains();
  const topologies = listOrganizationalTopologies();
  const overlays = listOrganizationalOverlays();

  const [mode, setMode] = useState<ForgeMode>("compose");
  const [primaryIndustry, setPrimaryIndustry] = useState("technology_and_saas");
  const [secondaryIndustries, setSecondaryIndustries] = useState<string[]>(["media_and_creative"]);
  const [specialistDomains, setSpecialistDomains] = useState<string[]>(["gaming_and_esports"]);
  const [scalePreset, setScalePreset] = useState<TenantScalePreset>("GROWING_ORGANIZATION");
  const [topology, setTopology] = useState<OrganizationalTopologyKey>("PRODUCT_TEAMS");
  const [selectedOverlays, setSelectedOverlays] = useState<string[]>(["mid_market"]);
  const [referenceKey, setReferenceKey] = useState("");
  const [generated, setGenerated] = useState(true);
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>("OPERATING_MODEL");
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string>("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [variantA, setVariantA] = useState<OperatingModelVariantKey>("MICRO");
  const [variantB, setVariantB] = useState<OperatingModelVariantKey>("ENTERPRISE");
  const [draftPersonas, setDraftPersonas] = useState<DraftWorkPersona[]>([]);
  const [draftWorkflows, setDraftWorkflows] = useState<DraftWorkflow[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!clientDesignHandoff) return;
    const draft = clientDesignHandoff.snapshot;
    const field = clientDesignHandoff.clientSelections.field;
    const industry = industries.find((i) => i.displayName === field || i.key === field);
    if (industry) setPrimaryIndustry(industry.key);
    const domainKeys = clientDesignHandoff.snapshot.recommendedPersonaKeys.length
      ? specialists
          .filter((d) => clientDesignHandoff.clientSelections.domains.includes(d.displayName))
          .map((d) => d.key)
      : [];
    if (domainKeys.length) setSpecialistDomains(domainKeys);
    const scale = clientDesignHandoff.clientSelections.targetScale;
    const allowed: TenantScalePreset[] = [
      "SOLO",
      "MICRO",
      "SMALL_TEAM",
      "GROWING_ORGANIZATION",
      "MULTI_DEPARTMENT",
      "MULTI_BRANCH",
      "ENTERPRISE",
      "GROUP_OR_ECOSYSTEM",
    ];
    if (scale && allowed.includes(scale as TenantScalePreset)) {
      setScalePreset(scale as TenantScalePreset);
    }
  }, [clientDesignHandoff, industries, specialists]);

  const scaleProfile = useMemo(() => buildScaleProfile(scalePreset), [scalePreset]);

  const compositionInput = useMemo(
    () => ({
      primaryIndustry,
      secondaryIndustries,
      specialistDomains,
      organizationalOverlays: selectedOverlays,
      scaleProfile,
      topologies: [topology] as const,
      organizationSignals: { approval_complexity: "medium" as const },
    }),
    [primaryIndustry, secondaryIndustries, specialistDomains, selectedOverlays, scaleProfile, topology],
  );

  const draft = useMemo(() => composeEnterpriseModel(compositionInput), [compositionInput]);

  const operatingGraph = useMemo(() => {
    const g = buildOperatingGraph(draft, layoutMode, specialistDomains);
    if (!nodeTypeFilter) return g;
    return filterGraph(g, new Set([nodeTypeFilter]));
  }, [draft, layoutMode, specialistDomains, nodeTypeFilter]);

  const connectedIds = useMemo(
    () => (selectedNodeId ? getConnectedNodeIds(operatingGraph, selectedNodeId) : undefined),
    [operatingGraph, selectedNodeId],
  );

  const selectedNode = operatingGraph.nodes.find((n) => n.id === selectedNodeId);

  const scenarioDiff = useMemo(
    () => compareOperatingModelVariants(compositionInput, variantA, variantB),
    [compositionInput, variantA, variantB],
  );

  const mergeSuggestions = useMemo(
    () => suggestPersonaMerge(draft.workPersonas.map((p) => p.key), scaleProfile),
    [draft.workPersonas, scaleProfile],
  );
  const splitSuggestions = useMemo(() => suggestPersonaSplit("workflow_coordinator", scaleProfile), [scaleProfile]);
  const scaledWorkflow = draft.workflowTemplates[0] ? scaleWorkflowTemplate(draft.workflowTemplates[0].key, scaleProfile) : null;

  const fitGraph = useCallback(() => {
    const bounds = computeGraphBounds(operatingGraph);
    setViewport(fitViewportToBounds(bounds, 720, 480));
  }, [operatingGraph]);

  useEffect(() => {
    if (mode === "graph") fitGraph();
  }, [mode, layoutMode, fitGraph]);

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
    setMode("graph");
  }

  const exportJson = JSON.stringify(
    {
      version: "2.0.0",
      advisory: true,
      authoritative: false,
      grantsPermissions: false,
      dna: draft.dna,
      personaCount: draft.workPersonas.length,
      workflowCount: draft.workflowTemplates.length,
      graphNodeCount: operatingGraph.nodes.length,
      warnings: draft.warnings,
      validationFindings: operatingGraph.findings,
    },
    null,
    2,
  );

  function compileBlueprintPreview() {
    const input = {
      primaryIndustry,
      secondaryIndustries,
      specialistDomains,
      organizationalOverlays: selectedOverlays,
      scalePreset,
      topology,
    };
    saveCompileInputToSession(input);
    const preview = compileEnterpriseBlueprintPreview(input);
    saveBlueprintPreviewToSession(preview);
    router.push(routes.admin.blueprintStudio);
  }

  const catalogRail = (
    <StudioPanel title="Composition" description="Catalog-driven controls.">
      <label className="mb-1 block text-xs text-white/50">Primary industry</label>
      <select
        value={primaryIndustry}
        onChange={(e) => setPrimaryIndustry(e.target.value)}
        className="mb-3 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white"
      >
        {industries.map((a) => (
          <option key={a.key} value={a.key}>{a.displayName}</option>
        ))}
      </select>
      <p className="mb-1 text-xs text-white/50">Specialist domains ({specialists.length})</p>
      <div className="mb-3 max-h-40 overflow-y-auto rounded border border-white/10 p-2">
        {specialists.map((s) => (
          <label key={s.key} className="flex items-center gap-2 py-0.5 text-xs text-white/70">
            <input type="checkbox" checked={specialistDomains.includes(s.key)} onChange={() => toggleSpecialist(s.key)} />
            {s.displayName}
          </label>
        ))}
      </div>
      <button
        type="button"
        className="mb-3 w-full rounded-md bg-cyan-600/80 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        onClick={compileBlueprintPreview}
      >
        Compile Blueprint Preview
      </button>
      <label className="mb-1 block text-xs text-white/50">Hybrid reference</label>
      <select
        value={referenceKey}
        onChange={(e) => loadReference(e.target.value)}
        className="mb-3 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm"
      >
        <option value="">— Select —</option>
        {HYBRID_REFERENCE_MODELS.map((r) => (
          <option key={r.key} value={r.key}>{r.displayName}</option>
        ))}
      </select>
      <label className="mb-1 block text-xs text-white/50">Scale</label>
      <select
        value={scalePreset}
        onChange={(e) => setScalePreset(e.target.value as TenantScalePreset)}
        className="mb-3 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm"
      >
        {(["SOLO", "MICRO", "SMALL_TEAM", "GROWING_ORGANIZATION", "MULTI_DEPARTMENT", "MULTI_BRANCH", "ENTERPRISE"] as const).map((p) => (
          <option key={p} value={p}>{p.replace(/_/g, " ")}</option>
        ))}
      </select>
      <label className="mb-1 block text-xs text-white/50">Topology</label>
      <select
        value={topology}
        onChange={(e) => setTopology(e.target.value as OrganizationalTopologyKey)}
        className="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-sm"
      >
        {topologies.map((t) => (
          <option key={t.key} value={t.key}>{t.displayName}</option>
        ))}
      </select>
    </StudioPanel>
  );

  const mainContent = (() => {
    switch (mode) {
      case "compose":
        return (
          <div className="grid gap-4 p-4 lg:grid-cols-2">
            <StudioPanel title="Scale profile" description="Multidimensional scale — advisory only.">
              <ScaleDimensionProfile dimensions={scaleProfile.dimensions} />
            </StudioPanel>
            <StudioPanel title="Model DNA preview" description="Generated from composition input.">
              <ModelDnaSummary dna={draft.dna} />
            </StudioPanel>
            <div className="lg:col-span-2">
              <p className="mb-2 text-xs text-white/50">Overlays</p>
              <div className="flex flex-wrap gap-1">
                {overlays.slice(0, 12).map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setSelectedOverlays((prev) => (prev.includes(o.key) ? prev.filter((k) => k !== o.key) : [...prev, o.key]))}
                    className={`rounded px-2 py-0.5 text-[10px] ${selectedOverlays.includes(o.key) ? "bg-cyan-600/40 text-cyan-100" : "bg-white/5 text-white/50"}`}
                  >
                    {o.displayName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "graph":
        return (
          <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
              <select
                value={layoutMode}
                onChange={(e) => setLayoutMode(e.target.value as GraphLayoutMode)}
                className="rounded border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                aria-label="Graph layout mode"
              >
                {GRAPH_LAYOUT_MODES.map((m) => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
              <select
                value={nodeTypeFilter}
                onChange={(e) => setNodeTypeFilter(e.target.value)}
                className="rounded border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                aria-label="Filter node type"
              >
                <option value="">All node types</option>
                {["INDUSTRY", "SPECIALIST_DOMAIN", "DEPARTMENT", "WORK_PERSONA", "WORKFLOW", "KPI", "EVIDENCE"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <StudioGraphControls
                onZoomIn={() => setViewport((v) => ({ ...v, zoom: Math.min(v.zoom * 1.15, 2) }))}
                onZoomOut={() => setViewport((v) => ({ ...v, zoom: Math.max(v.zoom / 1.15, 0.4) }))}
                onReset={() => setViewport(DEFAULT_VIEWPORT)}
                onFit={fitGraph}
              />
            </div>
            <div className={`flex-1 ${generated ? studioMotion.panelEnter : ""} ${studioMotion.reducedMotion}`}>
              <StudioGraphCanvas
                nodes={operatingGraph.nodes}
                edges={operatingGraph.edges}
                viewport={viewport}
                selectedNodeId={selectedNodeId}
                connectedIds={connectedIds}
                collapsedGroups={collapsedGroups}
                onSelectNode={setSelectedNodeId}
                reducedMotion={reducedMotion}
              />
            </div>
            <div className="border-t border-white/10 px-3 py-2 text-xs text-white/50">
              {operatingGraph.nodes.length} nodes · {operatingGraph.edges.length} edges · layout: {layoutMode}
            </div>
          </div>
        );
      case "personas":
        return (
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded bg-violet-600/80 px-3 py-1.5 text-xs text-white"
                onClick={() => {
                  const p = createDraftPersonaFromTemplate("workflow_coordinator");
                  if (p) setDraftPersonas((prev) => [...prev, p]);
                }}
              >
                Create draft persona
              </button>
            </div>
            {!generated && draft.workPersonas.length === 0 ? (
              <StudioEmptyState title="No personas" detail="Compose a model first." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {draft.workPersonas.map((p) => (
                  <PersonaCard key={p.key} persona={p} />
                ))}
                {draftPersonas.map((p) => (
                  <div key={p.key} className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <p className="text-xs font-semibold text-amber-200">ADVISORY — NOT AN AUTHORITY ASSIGNMENT</p>
                    <p className="mt-1 font-medium text-white">{p.displayName}</p>
                    <p className="text-xs text-white/60">{p.purpose}</p>
                  </div>
                ))}
              </div>
            )}
            {(mergeSuggestions.length > 0 || splitSuggestions.length > 0) && (
              <div className={`studio-surface p-3 ${studioMotion.warningReveal}`}>
                {mergeSuggestions.map((m) => (
                  <p key={m.recommendation} className="text-xs text-white/60">Merge: {m.recommendation}</p>
                ))}
                {splitSuggestions.map((s) => (
                  <p key={s.recommendation} className="text-xs text-white/60">Split: {s.recommendation}</p>
                ))}
              </div>
            )}
          </div>
        );
      case "workflows":
        return (
          <div className="space-y-3 p-4">
            <button
              type="button"
              className="rounded bg-violet-600/80 px-3 py-1.5 text-xs text-white"
              onClick={() => {
                const w = createDraftWorkflowFromTemplate(draft.workflowTemplates[0]?.key ?? "case_resolution");
                if (w) setDraftWorkflows((prev) => [...prev, w]);
              }}
            >
              Create draft workflow
            </button>
            {draft.workflowTemplates.slice(0, 10).map((wf) => (
              <StudioPanel key={wf.key} title={wf.displayName} description={wf.purpose}>
                <div className="mb-2 flex flex-wrap gap-2">
                  <StudioStatusChip label={wf.topology} tone="advisory" />
                  <StudioStatusChip label={`${wf.states.length} states`} />
                </div>
                <p className="text-xs text-white/50">{wf.states.join(" → ")}</p>
              </StudioPanel>
            ))}
            {draftWorkflows.map((w) => (
              <StudioPanel key={w.key} title={w.displayName} description="Draft workflow — no runtime instances">
                <p className="text-xs text-amber-200">ADVISORY</p>
                <p className="text-xs text-white/50">{w.stages.map((s) => s.label).join(" → ")}</p>
              </StudioPanel>
            ))}
            {scaledWorkflow && (
              <StudioPanel title="Scaled variant" description={scaledWorkflow.rationale}>
                <p className="text-xs text-white/60">Approval depth: {scaledWorkflow.approvalDepth}</p>
              </StudioPanel>
            )}
          </div>
        );
      case "entities":
        return (
          <div className="space-y-3 p-4">
            {ENTITY_PACK_CATALOG.map((pack) => (
              <StudioPanel key={pack.key} title={pack.displayName} description={pack.description}>
                <p className="text-xs text-white/50">Core: {pack.coreEntityKeys.slice(0, 8).join(", ")}{pack.coreEntityKeys.length > 8 ? "…" : ""}</p>
                {pack.specialistEntityKeys.length > 0 && (
                  <p className="mt-1 text-xs text-white/50">Specialist: {pack.specialistEntityKeys.join(", ")}</p>
                )}
              </StudioPanel>
            ))}
            <StudioPanel title="Department archetypes" description={`${DEPARTMENT_ARCHETYPE_CATALOG.length} advisory departments`}>
              <div className="flex flex-wrap gap-1">
                {DEPARTMENT_ARCHETYPE_CATALOG.slice(0, 16).map((d) => (
                  <span key={d.key} className="studio-chip">{d.displayName}</span>
                ))}
              </div>
            </StudioPanel>
          </div>
        );
      case "scenario":
        return (
          <div className="space-y-4 p-4">
            <div className="flex flex-wrap gap-3">
              <label className="text-xs text-white/60">
                Variant A
                <select value={variantA} onChange={(e) => setVariantA(e.target.value as OperatingModelVariantKey)} className="ml-2 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm">
                  {OPERATING_MODEL_VARIANTS.map((v) => (
                    <option key={v.key} value={v.key}>{v.displayName}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-white/60">
                Variant B
                <select value={variantB} onChange={(e) => setVariantB(e.target.value as OperatingModelVariantKey)} className="ml-2 rounded border border-white/10 bg-black/40 px-2 py-1 text-sm">
                  {OPERATING_MODEL_VARIANTS.map((v) => (
                    <option key={v.key} value={v.key}>{v.displayName}</option>
                  ))}
                </select>
              </label>
            </div>
            <StudioPanel title={`${variantA} vs ${variantB}`} description="Deterministic advisory diff">
              <StudioScenarioDiff diffs={scenarioDiff.diffs} />
            </StudioPanel>
          </div>
        );
      case "validation":
        return (
          <div className="p-4">
            <StudioPanel title="Graph validation" description="Blocking errors affect export only — not runtime authority.">
              <StudioValidationList findings={operatingGraph.findings} />
            </StudioPanel>
            {draft.warnings.length > 0 && (
              <ul className="mt-4 space-y-1 text-xs text-amber-100/90">
                {draft.warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            )}
          </div>
        );
      case "export":
        return (
          <div className="p-4">
            <StudioPanel title="Export draft JSON" description="Safe local export — no hosted persistence.">
              <pre className="max-h-96 overflow-auto rounded border border-white/10 bg-black/50 p-3 text-[11px] text-cyan-100">{exportJson}</pre>
              {draftPersonas[0] && (
                <pre className="mt-3 max-h-32 overflow-auto rounded border border-white/10 bg-black/50 p-2 text-[10px] text-white/70">
                  {exportDraftPersonaJson(draftPersonas[0])}
                </pre>
              )}
              {draftWorkflows[0] && (
                <pre className="mt-3 max-h-32 overflow-auto rounded border border-white/10 bg-black/50 p-2 text-[10px] text-white/70">
                  {exportDraftWorkflowJson(draftWorkflows[0])}
                </pre>
              )}
            </StudioPanel>
          </div>
        );
      default:
        return null;
    }
  })();

  const inspector = (
    <StudioInspector title={selectedNode ? selectedNode.label : "Context"}>
      {selectedNode ? (
        <>
          <p><span className="text-white/50">Type:</span> {selectedNode.type}</p>
          <p><span className="text-white/50">Key:</span> {selectedNode.key}</p>
          {mode === "graph" && selectedNode.group && (
            <button
              type="button"
              className="mt-2 text-xs text-cyan-300"
              onClick={() => {
                setCollapsedGroups((prev) => {
                  const next = new Set(prev);
                  if (next.has(selectedNode.group!)) next.delete(selectedNode.group!);
                  else next.add(selectedNode.group!);
                  return next;
                });
              }}
            >
              {collapsedGroups.has(selectedNode.group) ? "Expand" : "Collapse"} group {selectedNode.group}
            </button>
          )}
        </>
      ) : (
        <p className="text-white/50">Select a graph node or switch workspace mode.</p>
      )}
      <p className="mt-4 text-xs text-white/40">Personas: {draft.workPersonas.length} · Workflows: {draft.workflowTemplates.length}</p>
    </StudioInspector>
  );

  return (
    <div className="space-y-4 pb-16">
      <nav className="flex flex-wrap items-center gap-3 text-sm">
        <Link href={routes.admin.overview} className="text-cyan-400 hover:text-cyan-300">← Overview</Link>
        <span className="text-white/20">|</span>
        <Link href={routes.admin.tenantStudio} className="text-white/50 hover:text-cyan-300">Tenant Studio</Link>
        <span className="text-white/20">|</span>
        <Link href={routes.admin.blueprintStudio} className="text-white/50 hover:text-cyan-300">Blueprint Studio</Link>
        <span className="text-white/20">|</span>
        <span className="text-violet-300">Model Forge</span>
      </nav>
      {clientDesignHandoff && (
        <section className="rounded-lg border border-violet-500/40 bg-violet-950/30 px-4 py-3 text-sm text-violet-100">
          Client design handoff from request {clientDesignHandoff.requestId.slice(0, 8)}… — selections
          preserved; no Discovery answers modified.
        </section>
      )}

      <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-50">
        Enterprise Operating Graph laboratory — draft invention only. No provisioning, no permission grants, no hosted writes.
      </div>

      <StudioShell
        title="Model Forge"
        subtitle="Domain packs · operating graph · scenario lab · advisory composition"
        modeSwitcher={<StudioModeSwitcher mode={mode} onChange={setMode} />}
        catalog={catalogRail}
        main={mainContent}
        inspector={inspector}
        footer={
          draft.unresolvedDecisions.length > 0 ? (
            <p className="text-amber-100/90">Unresolved: {draft.unresolvedDecisions.join("; ")}</p>
          ) : undefined
        }
      />
    </div>
  );
}
