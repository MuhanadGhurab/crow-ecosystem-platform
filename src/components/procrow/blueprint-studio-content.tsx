"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudioShell } from "@/components/procrow/studio/studio-shell";
import { StudioModeSwitcher, type ForgeMode } from "@/components/procrow/studio/studio-mode-switcher";
import { StudioPanel, StudioStatusChip, StudioEmptyState } from "@/components/procrow/studio/studio-panel";
import { StudioGraphCanvas, StudioGraphControls } from "@/components/procrow/studio/studio-graph-canvas";
import { StudioProvenanceDrawer } from "@/components/procrow/studio/studio-provenance-drawer";
import { StudioCompilationTimeline } from "@/components/procrow/studio/studio-compilation-timeline";
import { StudioDecisionTimeline } from "@/components/procrow/studio/studio-decision-timeline";
import { StudioRelationshipRulesView } from "@/components/procrow/studio/studio-relationship-rules";
import { StudioValidationList } from "@/components/procrow/studio/studio-graph-canvas";
import { studioMotion } from "@/components/procrow/studio/studio-motion";
import { saveCompileInputToSession, saveBlueprintPreviewToSession, loadBlueprintPreviewFromSession, loadCompileInputFromSession } from "@/lib/model-forge/blueprint/blueprint-session";
import { compileEnterpriseBlueprintPreview } from "@/lib/model-forge/blueprint/blueprint-compiler";
import {
  compareEnterpriseBlueprintDrafts,
  buildCompilerReadinessMatrix,
  exportBlueprintJson,
  exportBlueprintMarkdown,
  exportValidationReport,
  exportDecisionRegister,
  exportProvenanceSummary,
  importBlueprintPreviewJson,
  composeEnterpriseModel,
  buildOperatingGraph,
  filterGraphByLayerPreset,
  analyzeOperatingGraphCompleteness,
  buildProvenanceChain,
  getConnectedNodeIds,
  computeGraphBounds,
  fitViewportToBounds,
  DEFAULT_VIEWPORT,
  GRAPH_LAYER_PRESETS,
  HYBRID_REFERENCE_MODELS,
  buildScaleProfile,
  synchronizeStudioSelection,
  assessBlueprintReviewReadiness,
  buildReviewSummary,
  compositionInputFromBlueprintScenario,
  compareScenarioGraphs,
  analyzeBlueprintDecisionImpact,
  applyDecisionToSessionDraft,
  revertSessionDecision,
  type EnterpriseBlueprintDraft,
  type BlueprintCompileInput,
} from "@/lib/model-forge";
import { routes } from "@/lib/routes";

type BlueprintMode = ForgeMode | "overview" | "organization" | "information" | "authority" | "experience" | "trust" | "decisions" | "compare" | "relationships";

const MODES: { key: BlueprintMode; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "organization", label: "Organization" },
  { key: "personas", label: "Personas" },
  { key: "workflows", label: "Workflows" },
  { key: "information", label: "Information" },
  { key: "authority", label: "Authority" },
  { key: "experience", label: "Experience" },
  { key: "trust", label: "Trust" },
  { key: "validation", label: "Validation" },
  { key: "decisions", label: "Decisions" },
  { key: "compare", label: "Compare" },
  { key: "relationships", label: "Relationships" },
  { key: "graph", label: "Graph" },
  { key: "export", label: "Export" },
];

const DEFAULT_INPUT: BlueprintCompileInput = {
  primaryIndustry: "technology_and_saas",
  specialistDomains: ["gaming_and_esports"],
  scalePreset: "GROWING_ORGANIZATION",
  topology: "PRODUCT_TEAMS",
  organizationalOverlays: ["mid_market"],
};

export function BlueprintStudioContent() {
  const router = useRouter();
  const [mode, setMode] = useState<BlueprintMode>("overview");
  const [compileInput, setCompileInput] = useState<BlueprintCompileInput>(DEFAULT_INPUT);
  const [blueprint, setBlueprint] = useState<EnterpriseBlueprintDraft | null>(null);
  const [variantBInput, setVariantBInput] = useState<BlueprintCompileInput>({ ...DEFAULT_INPUT, scalePreset: "ENTERPRISE" });
  const [layerPreset, setLayerPreset] = useState("FULL_BLUEPRINT");
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [timelinePhase, setTimelinePhase] = useState(0);
  const [selectedBlueprintPath, setSelectedBlueprintPath] = useState<string | null>(null);
  const [decisionTimeline, setDecisionTimeline] = useState<{ decisionKey: string; reverted?: boolean }[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fromSession = loadCompileInputFromSession();
    const cached = loadBlueprintPreviewFromSession();
    if (fromSession) setCompileInput(fromSession);
    if (cached) setBlueprint(cached);
    else if (fromSession) {
      const compiled = compileEnterpriseBlueprintPreview(fromSession);
      setBlueprint(compiled);
      saveBlueprintPreviewToSession(compiled);
    }
  }, []);

  const compile = useCallback((input: BlueprintCompileInput) => {
    if (!reducedMotion) {
      setTimelinePhase(0);
      const steps = 17;
      let i = 0;
      const timer = setInterval(() => {
        i += 1;
        setTimelinePhase(i);
        if (i >= steps) clearInterval(timer);
      }, reducedMotion ? 0 : 40);
    } else {
      setTimelinePhase(17);
    }
    const draft = compileEnterpriseBlueprintPreview(input);
    setBlueprint(draft);
    saveBlueprintPreviewToSession(draft);
    return draft;
  }, [reducedMotion]);

  const modelDraft = useMemo(() => {
    if (!blueprint) return null;
    return composeEnterpriseModel({
      primaryIndustry: compileInput.primaryIndustry,
      secondaryIndustries: compileInput.secondaryIndustries,
      specialistDomains: compileInput.specialistDomains,
      organizationalOverlays: compileInput.organizationalOverlays,
      scaleProfile: buildScaleProfile((compileInput.scalePreset ?? "GROWING_ORGANIZATION") as never),
      topologies: [(compileInput.topology ?? "DEPARTMENTAL_HIERARCHY") as never],
      organizationSignals: { approval_complexity: "medium" },
    });
  }, [blueprint, compileInput]);

  const graph = useMemo(() => {
    if (!modelDraft) return null;
    const g = buildOperatingGraph(modelDraft, "OPERATING_MODEL", [...(compileInput.specialistDomains ?? [])], { registerProvenance: false });
    return filterGraphByLayerPreset(g, layerPreset);
  }, [modelDraft, compileInput, layerPreset]);

  const completeness = useMemo(() => {
    if (!graph || !modelDraft) return null;
    return analyzeOperatingGraphCompleteness(graph, modelDraft, [...(compileInput.specialistDomains ?? [])]);
  }, [graph, modelDraft, compileInput]);

  const readiness = useMemo(() => {
    if (!blueprint || !modelDraft) return null;
    const ci = compositionInputFromBlueprintScenario(blueprint, compileInput.primaryIndustry, compileInput.specialistDomains ? [...compileInput.specialistDomains] : undefined);
    return assessBlueprintReviewReadiness(blueprint, graph ?? undefined, ci);
  }, [blueprint, modelDraft, graph, compileInput]);

  const reviewSummary = useMemo(() => (readiness && blueprint ? buildReviewSummary(readiness, blueprint) : null), [readiness, blueprint]);

  const scenarioGraphDiff = useMemo(() => {
    if (!blueprint) return null;
    return compareScenarioGraphs(
      {
        primaryIndustry: compileInput.primaryIndustry,
        specialistDomains: compileInput.specialistDomains,
        scaleProfile: buildScaleProfile((compileInput.scalePreset ?? "GROWING_ORGANIZATION") as never),
        topologies: [(compileInput.topology ?? "DEPARTMENTAL_HIERARCHY") as never],
        organizationSignals: { approval_complexity: "medium" },
      },
      "MICRO",
      "ENTERPRISE",
      [...(compileInput.specialistDomains ?? [])],
    );
  }, [blueprint, compileInput]);

  const handleGraphSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (!nodeId) return;
    const sync = synchronizeStudioSelection({ source: "GRAPH", target: { graphNodeId: nodeId }, timestamp: Date.now() });
    if (sync.blueprintMode) setMode(sync.blueprintMode as BlueprintMode);
    if (sync.blueprintPath) setSelectedBlueprintPath(sync.blueprintPath);
  }, []);

  const compilerReadiness = useMemo(() => (blueprint ? buildCompilerReadinessMatrix(blueprint) : null), [blueprint]);
  void compilerReadiness;

  const blueprintB = useMemo(() => compileEnterpriseBlueprintPreview(variantBInput), [variantBInput]);
  const blueprintDiff = useMemo(
    () => (blueprint ? compareEnterpriseBlueprintDrafts(blueprint, blueprintB) : []),
    [blueprint, blueprintB],
  );

  const provenanceChain = useMemo(() => {
    const path = selectedBlueprintPath ?? (selectedNodeId ? `graph:${selectedNodeId}` : "blueprint.organization.primary");
    return blueprint ? buildProvenanceChain(path.startsWith("graph:") ? path : path) : null;
  }, [selectedNodeId, selectedBlueprintPath, blueprint]);

  const connectedIds = useMemo(
    () => (graph && selectedNodeId ? getConnectedNodeIds(graph, selectedNodeId) : undefined),
    [graph, selectedNodeId],
  );

  const fitGraph = useCallback(() => {
    if (!graph) return;
    setViewport(fitViewportToBounds(computeGraphBounds(graph), 720, 420));
  }, [graph]);

  function loadReference(key: string) {
    const ref = HYBRID_REFERENCE_MODELS.find((r) => r.key === key);
    if (!ref) return;
    const i = ref.input;
    const input: BlueprintCompileInput = {
      primaryIndustry: i.primaryIndustry,
      secondaryIndustries: i.secondaryIndustries ? [...i.secondaryIndustries] : undefined,
      specialistDomains: i.specialistDomains ? [...i.specialistDomains] : undefined,
      organizationalOverlays: i.organizationalOverlays ? [...i.organizationalOverlays] : undefined,
      scalePreset: i.scaleProfile?.preset,
      topology: i.topologies?.[0],
    };
    setCompileInput(input);
    compile(input);
  }

  function handleImportJson(raw: string) {
    const result = importBlueprintPreviewJson(raw);
    if (!result.ok) {
      setImportError(result.errors.join("; "));
      return;
    }
    setImportError(null);
    setBlueprint(result.draft);
    saveBlueprintPreviewToSession(result.draft);
  }

  const navRail = (
    <StudioPanel title="Blueprint navigation" description="Section status — preview only.">
      {readiness && (
        <p className="mb-2 text-xs text-cyan-200">{readiness.overallStatus.replace(/_/g, " ")}</p>
      )}
      {reviewSummary && (
        <p className="mb-2 text-[10px] text-white/40">Provenance: {reviewSummary.provenanceCoverage}</p>
      )}
      <button type="button" className="mb-2 w-full rounded bg-violet-600/80 px-2 py-1.5 text-xs text-white" onClick={() => compile(compileInput)}>
        Recompile preview
      </button>
      <select className="mb-2 w-full rounded border border-white/10 bg-black/40 px-2 py-1 text-xs" onChange={(e) => loadReference(e.target.value)} defaultValue="">
        <option value="">Load reference model</option>
        {HYBRID_REFERENCE_MODELS.map((r) => (
          <option key={r.key} value={r.key}>{r.displayName}</option>
        ))}
      </select>
      {blueprint && (
        <ul className="space-y-1 text-xs text-white/60">
          <li>Personas: {blueprint.workPersonas.items.length}</li>
          <li>Workflows: {blueprint.workflows.items.length}</li>
          <li>Decisions: {blueprint.unresolvedDecisions.length}</li>
        </ul>
      )}
    </StudioPanel>
  );

  const main = !blueprint ? (
    <div className="p-6">
      <StudioEmptyState title="No Blueprint preview" detail="Compile from Model Forge or load a reference model." />
      <button type="button" className="mt-4 text-sm text-cyan-400" onClick={() => router.push(routes.admin.modelForge)}>
        Open Model Forge
      </button>
    </div>
  ) : (
    <div className={`p-4 ${studioMotion.tabTransition}`}>
      {mode === "overview" && (
        <div className="space-y-3">
          <p className="text-sm text-white/80">{blueprint.executiveSummary}</p>
          <StudioStatusChip label={blueprint.metadata.previewClassification} tone="advisory" />
          {reviewSummary && (
            <div className="rounded border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-white/70">
              <p className="font-medium text-cyan-100">Review readiness: {reviewSummary.readiness}</p>
              <p>Blocking issues: {reviewSummary.blockingIssues}</p>
              <p>Unresolved decisions: {reviewSummary.unresolvedDecisions}</p>
              <p className="text-white/40">Hash: {reviewSummary.contentHash}</p>
            </div>
          )}
          <p className="text-xs text-white/50">Content hash: {blueprint.metadata.contentHash}</p>
          <StudioCompilationTimeline completedPhaseCount={timelinePhase} reducedMotion={reducedMotion} />
        </div>
      )}
      {mode === "organization" && (
        <ul className="text-sm text-white/70">
          {blueprint.departments.items.map((d) => (
            <li key={(d as { key: string }).key}>{(d as { displayName: string }).displayName}</li>
          ))}
        </ul>
      )}
      {mode === "personas" && blueprint.workPersonas.items.map((p) => (
        <div key={(p as { key: string }).key} className="mb-2 rounded border border-white/10 p-2 text-sm">
          <p className="font-medium text-white">{(p as { displayName: string }).displayName}</p>
          <p className="text-xs text-amber-200">ADVISORY — NOT AN AUTHORITY ASSIGNMENT</p>
        </div>
      ))}
      {mode === "workflows" && blueprint.workflows.items.map((w) => (
        <div key={(w as { key: string }).key} className="mb-2 text-sm text-white/70">
          {(w as { displayName: string }).displayName}
        </div>
      ))}
      {mode === "information" && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs text-white/40">Capabilities</p>
            {blueprint.capabilities.items.map((c) => (
              <p key={(c as { key: string }).key} className="text-sm text-white/70">{(c as { displayName: string }).displayName}</p>
            ))}
          </div>
          <div>
            <p className="text-xs text-white/40">Entities</p>
            {blueprint.entities.items.slice(0, 12).map((e) => (
              <p key={(e as { key: string }).key} className="text-sm text-white/70">{(e as { displayName: string }).displayName}</p>
            ))}
          </div>
        </div>
      )}
      {mode === "authority" && blueprint.authorityProposals.items.map((a) => (
        <div key={(a as { key: string }).key} className="mb-2 rounded border border-amber-500/30 bg-amber-500/5 p-2 text-sm">
          <p className="text-amber-100">{(a as { displayName: string }).displayName}</p>
          <p className="text-xs text-white/50">Advisory authority proposal</p>
        </div>
      ))}
      {mode === "experience" && blueprint.sareaExperiences.items.map((s) => (
        <p key={(s as { key: string }).key} className="text-sm text-white/70">{(s as { displayName: string }).displayName}</p>
      ))}
      {mode === "trust" && (
        <>
          {blueprint.cyberCrowPolicies.items.map((c) => (
            <p key={(c as { key: string }).key} className="text-sm text-white/70">{(c as { displayName: string }).displayName}</p>
          ))}
          {blueprint.complianceOverlays.items.map((c) => (
            <p key={(c as { key: string }).key} className="text-sm text-white/60">{(c as { displayName: string }).displayName}</p>
          ))}
        </>
      )}
      {mode === "validation" && <StudioValidationList findings={blueprint.validation.findings.map((f) => ({ ...f, severity: f.severity }))} />}
      {mode === "decisions" && (
        <div className="space-y-3">
          <StudioDecisionTimeline
            entries={(blueprint?.unresolvedDecisions ?? []).map((d) => ({
              decision: d,
              impact: d.draftSelection ? analyzeBlueprintDecisionImpact(blueprint!, d, d.draftSelection) : undefined,
              reverted: decisionTimeline.find((t) => t.decisionKey === d.key)?.reverted,
            }))}
            reducedMotion={reducedMotion}
          />
          <ul className="space-y-2 text-sm">
            {blueprint.unresolvedDecisions.map((d) => (
              <li key={d.key} className="rounded border border-white/10 p-2 text-white/70">
                <p>{d.question}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {d.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className="rounded border border-white/15 px-2 py-0.5 text-xs hover:border-cyan-400/40"
                      onClick={() => {
                        const next = applyDecisionToSessionDraft(blueprint, d.key, opt);
                        setBlueprint(next);
                        saveBlueprintPreviewToSession(next);
                        setDecisionTimeline((t) => [...t.filter((x) => x.decisionKey !== d.key), { decisionKey: d.key }]);
                      }}
                    >
                      Preview: {opt}
                    </button>
                  ))}
                  {d.draftSelection && (
                    <button
                      type="button"
                      className="rounded border border-amber-500/30 px-2 py-0.5 text-xs text-amber-200"
                      onClick={() => {
                        const next = revertSessionDecision(blueprint, d.key);
                        setBlueprint(next);
                        saveBlueprintPreviewToSession(next);
                        setDecisionTimeline((t) => [...t, { decisionKey: d.key, reverted: true }]);
                      }}
                    >
                      Revert
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {mode === "compare" && (
        <div className="space-y-2">
          <select
            className="rounded border border-white/10 bg-black/40 px-2 py-1 text-xs"
            value={variantBInput.scalePreset}
            onChange={(e) => setVariantBInput({ ...variantBInput, scalePreset: e.target.value })}
          >
            <option value="MICRO">MICRO</option>
            <option value="ENTERPRISE">ENTERPRISE</option>
          </select>
          <ul className="max-h-64 overflow-y-auto text-xs">
            {blueprintDiff.filter((d) => d.change !== "UNCHANGED").slice(0, 20).map((d, i) => (
              <li key={`${d.key}-${i}`} className="text-white/60">{d.change}: {d.key}</li>
            ))}
          </ul>
          {scenarioGraphDiff && (
            <div className="mt-3 border-t border-white/10 pt-2">
              <p className="text-xs text-white/40">Graph scenario diff (MICRO → ENTERPRISE)</p>
              <ul className="max-h-40 overflow-y-auto text-xs">
                {scenarioGraphDiff.nodeDiffs.filter((d) => d.change !== "UNCHANGED").slice(0, 15).map((d) => (
                  <li key={`${d.nodeType}-${d.key}`} className="text-white/60">
                    {d.change}: {d.whatChanged}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-[10px] text-white/40">Edge changes: {scenarioGraphDiff.edgeDiffs.length}</p>
            </div>
          )}
        </div>
      )}
      {mode === "relationships" && (
        <StudioRelationshipRulesView
          reducedMotion={reducedMotion}
          onSelectRule={(ruleKey) => {
            synchronizeStudioSelection({ source: "RELATIONSHIP_RULE", target: { relationshipRuleKey: ruleKey }, timestamp: Date.now() });
          }}
        />
      )}
      {mode === "graph" && graph && (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <select value={layerPreset} onChange={(e) => setLayerPreset(e.target.value)} className="rounded border border-white/10 bg-black/40 px-2 py-1 text-xs">
              {GRAPH_LAYER_PRESETS.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
            <StudioGraphControls
              onZoomIn={() => setViewport((v) => ({ ...v, zoom: Math.min(v.zoom * 1.15, 2) }))}
              onZoomOut={() => setViewport((v) => ({ ...v, zoom: Math.max(v.zoom / 1.15, 0.4) }))}
              onReset={() => setViewport(DEFAULT_VIEWPORT)}
              onFit={fitGraph}
            />
          </div>
          <StudioGraphCanvas
            nodes={graph.nodes}
            edges={graph.edges}
            viewport={viewport}
            selectedNodeId={selectedNodeId}
            connectedIds={connectedIds}
            onSelectNode={handleGraphSelect}
            reducedMotion={reducedMotion}
          />
          {completeness && (
            <p className="mt-2 text-xs text-white/40">
              Layers partial: {completeness.layers.filter((l) => l.status === "PARTIAL").length}
            </p>
          )}
        </div>
      )}
      {mode === "export" && (
        <div className="space-y-2">
          <button type="button" className="rounded border border-white/15 px-3 py-1 text-xs" onClick={() => download(exportBlueprintJson(blueprint))}>JSON</button>
          <button type="button" className="rounded border border-white/15 px-3 py-1 text-xs" onClick={() => download(exportBlueprintMarkdown(blueprint))}>Markdown</button>
          <button type="button" className="rounded border border-white/15 px-3 py-1 text-xs" onClick={() => download(exportValidationReport(blueprint))}>Validation</button>
          <button type="button" className="rounded border border-white/15 px-3 py-1 text-xs" onClick={() => download(exportDecisionRegister(blueprint))}>Decisions</button>
          <button type="button" className="rounded border border-white/15 px-3 py-1 text-xs" onClick={() => download(exportProvenanceSummary(blueprint))}>Provenance</button>
          <textarea
            className="mt-3 w-full rounded border border-white/10 bg-black/40 p-2 text-xs"
            placeholder="Paste preview JSON to import"
            onBlur={(e) => e.target.value && handleImportJson(e.target.value)}
          />
          {importError && <p className="text-xs text-rose-400">{importError}</p>}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 pb-16">
      <nav className="flex flex-wrap gap-3 text-sm">
        <Link href={routes.admin.overview} className="text-cyan-400">← Overview</Link>
        <Link href={routes.admin.tenantStudio} className="text-white/50 hover:text-cyan-300">Tenant Studio</Link>
        <Link href={routes.admin.modelForge} className="text-white/50 hover:text-cyan-300">Model Forge</Link>
        <span className="text-violet-300">Blueprint Studio</span>
      </nav>
      <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-50">
        Blueprint compiler preview — EPHEMERAL_PREVIEW. No database persistence. Human approval required.
      </div>
      <StudioShell
        title="Blueprint Studio"
        subtitle="Deterministic preview compilation and human review"
        modeSwitcher={
          <nav className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/30 p-1">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`rounded-md px-2 py-1 text-xs ${mode === m.key ? "bg-cyan-500/20 text-cyan-200" : "text-white/60"}`}
              >
                {m.label}
              </button>
            ))}
          </nav>
        }
        catalog={navRail}
        main={main}
        inspector={<StudioProvenanceDrawer chain={provenanceChain} reducedMotion={reducedMotion} />}
        footer={blueprint?.warnings.length ? <p className="text-xs text-amber-100">{blueprint.warnings[0]?.message}</p> : undefined}
      />
    </div>
  );
}

function download(file: { filename: string; content: string }) {
  const blob = new Blob([file.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.filename;
  a.click();
  URL.revokeObjectURL(url);
}
