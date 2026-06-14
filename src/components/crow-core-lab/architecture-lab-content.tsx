import Link from "next/link";
import { ProductPageHeader } from "@/components/product/product-page-header";
import { ProductSection } from "@/components/product/product-section";
import { ProductStatusCard } from "@/components/product/product-status-card";
import {
  ARCHITECTURE_LAB_REFERENCE,
  C1_ARCHITECTURE_LAB_REFERENCE,
  MOCK_AI_RECOMMENDATION,
  MOCK_BLUEPRINT_SLICES,
  MOCK_C1_COMMAND_CENTER,
  MOCK_C1_ROI_SCENARIOS,
  MOCK_C1_SAREA_ROLE_COMPARISON,
  MOCK_C1_SOW_SECTIONS,
  MOCK_C1_TRACEABILITY_TIMELINE,
  MOCK_C1_VERSION_COMPARE,
  MOCK_DECISION,
  MOCK_ENTITY_PROFILE,
  MOCK_LIFECYCLE_HIGHLIGHTS,
  MOCK_PLATFORM_SURFACES,
  MOCK_ROI_ASSUMPTIONS,
  MOCK_SAUDI_CAPABILITIES,
  MOCK_SECURITY_SIGNALS,
  MOCK_SAREA_PERSONAS,
  MOCK_SOW_SECTIONS,
  MOCK_TRACEABILITY_CHAIN,
  MOCK_WORK_QUEUE,
} from "@/lib/crow-core/lab/mock-architecture-lab-data";
import { routes } from "@/lib/routes";

export function ArchitectureLabContent() {
  return (
    <div className="space-y-10">
      <Link href={routes.admin.overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Control tower overview
      </Link>

      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        {ARCHITECTURE_LAB_REFERENCE.label}
      </div>

      <ProductPageHeader
        eyebrow="Crow Core · C0"
        title="Architecture Lab"
        description="Reference prototype demonstrating Crow Core patterns — platform map, blueprint intelligence, process fabric, trust signals, SAREA composition, and AI boundaries. Mock data only; no mutations."
        statusChip={{ label: "Reference prototype", tone: "warning" }}
      />

      <ProductSection
        title="Platform map"
        description="Canonical surfaces and operating fabric (documentation-aligned)."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PLATFORM_SURFACES.map((surface) => (
            <ProductStatusCard
              key={surface.id}
              status="Surface"
              title={surface.label}
              why={surface.purpose}
              nextAction="See docs/architecture/crow-core/00-CROW-CORE-OVERVIEW.md"
            />
          ))}
        </div>
      </ProductSection>

      <ProductSection title="Blueprint workspace" description="Six slices with advisory completeness scores.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_BLUEPRINT_SLICES.map((slice) => (
            <div key={slice.key} className="cc-glass-card !p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{slice.label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-white">{slice.completeness}%</p>
              <p className="mt-1 text-xs text-slate-500">Advisory completeness — not production readiness</p>
            </div>
          ))}
        </div>
      </ProductSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductSection title="ROI model (sourced assumptions)" description="Every assumption must cite source and approval status.">
          <ul className="space-y-3">
            {MOCK_ROI_ASSUMPTIONS.map((a) => (
              <li key={a.id} className="cc-glass-card !p-4 text-sm">
                <p className="font-medium text-white">{a.label}</p>
                <p className="text-slate-400">
                  {a.value} {a.unit} · {a.confidence} confidence · {a.approvalStatus}
                </p>
                <p className="mt-1 text-slate-500">Source: {a.source}</p>
              </li>
            ))}
          </ul>
        </ProductSection>

        <ProductSection title="SOW draft sections" description="Advisory until client and operator approval.">
          <ul className="space-y-2">
            {MOCK_SOW_SECTIONS.map((s) => (
              <li key={s.key} className="flex items-center justify-between rounded-lg border border-slate-700/50 px-3 py-2 text-sm">
                <span className="text-slate-200">{s.title}</span>
                <span className="text-xs uppercase tracking-wide text-cyan-400/80">{s.status}</span>
              </li>
            ))}
          </ul>
        </ProductSection>
      </div>

      <ProductSection title="Entity profile pattern" description="Universal identity fields on a tenant-scoped entity.">
        <div className="cc-glass-card !p-4 text-sm">
          <p className="font-display text-lg font-semibold text-white">{MOCK_ENTITY_PROFILE.displayName}</p>
          <p className="text-slate-400">
            {MOCK_ENTITY_PROFILE.role} · {MOCK_ENTITY_PROFILE.department}
          </p>
          <p className="mt-2 text-slate-500">
            Ref: {MOCK_ENTITY_PROFILE.entityRef.domain}/{MOCK_ENTITY_PROFILE.entityRef.entityType}/
            {MOCK_ENTITY_PROFILE.entityRef.entityId}
          </p>
        </div>
      </ProductSection>

      <ProductSection title="Process workspace" description="22-stage lifecycle (first eight highlighted).">
        <ol className="flex flex-wrap gap-2">
          {MOCK_LIFECYCLE_HIGHLIGHTS.map((item, index) => (
            <li
              key={item.stage}
              className="rounded-full border border-slate-600/60 bg-slate-800/40 px-3 py-1 text-xs text-slate-300"
            >
              {index + 1}. {item.label}
            </li>
          ))}
        </ol>
      </ProductSection>

      <ProductSection title="Work queue pattern" description="One primary action per row; SLA visible.">
        <ul className="space-y-2">
          {MOCK_WORK_QUEUE.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 px-3 py-2">
              <span className="text-sm text-slate-200">{item.title}</span>
              <span className="text-xs text-slate-500">
                {item.priority} · SLA {item.slaHours}h
              </span>
            </li>
          ))}
        </ul>
      </ProductSection>

      <ProductSection title="Decision workspace" description="Human approval required; AI assistance is advisory only.">
        <div className="cc-glass-card !p-4">
          <p className="font-medium text-white">{MOCK_DECISION.title}</p>
          <p className="mt-2 text-sm text-slate-400">{MOCK_DECISION.assistanceSummary}</p>
          {MOCK_DECISION.prohibitedAutonomous && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-300/90">
              No autonomous approval
            </p>
          )}
        </div>
      </ProductSection>

      <ProductSection title="Security context (CyberCrow)" description="Signals — not SIEM, not autonomous SOC.">
        <ul className="space-y-2">
          {MOCK_SECURITY_SIGNALS.map((sig) => (
            <li key={sig.id} className="cc-glass-card !p-4 text-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                {sig.dimension} · {sig.severity}
              </p>
              <p className="mt-1 text-slate-200">{sig.summary}</p>
              <p className="mt-1 text-cyan-400/90">→ {sig.recommendedAction}</p>
            </li>
          ))}
        </ul>
      </ProductSection>

      <ProductSection
        title="SAREA persona comparison"
        description="SAREA composes experience only — never grants access or permissions."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {MOCK_SAREA_PERSONAS.map((p) => (
            <div key={p.persona} className="cc-glass-card !p-4 text-sm">
              <p className="font-semibold capitalize text-white">{p.persona.replace(/_/g, " ")}</p>
              <p className="text-slate-400">{p.primarySurface}</p>
              <p className="mt-1 text-xs text-slate-500">Density: {p.density}</p>
            </div>
          ))}
        </div>
      </ProductSection>

      <ProductSection title="AI recommendation panel" description="Risk-tiered capabilities with prohibited autonomous actions.">
        <div className="cc-glass-card !p-4 text-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            {MOCK_AI_RECOMMENDATION.capability} · risk {MOCK_AI_RECOMMENDATION.riskTier}
          </p>
          <p className="mt-2 text-slate-200">{MOCK_AI_RECOMMENDATION.summary}</p>
          <p className="mt-2 text-xs text-slate-500">
            Prohibited: {MOCK_AI_RECOMMENDATION.prohibitedActions.join(", ")}
          </p>
        </div>
      </ProductSection>

      <ProductSection title="Saudi capability cards" description="Assessment and blueprint fields only in C0.">
        <div className="grid gap-3 sm:grid-cols-2">
          {MOCK_SAUDI_CAPABILITIES.map((cap) => (
            <ProductStatusCard
              key={cap.id}
              status={cap.status}
              title={cap.label}
              why={cap.note}
              nextAction="Document in blueprint assessment"
            />
          ))}
        </div>
      </ProductSection>

      <ProductSection title="Traceability constitution" description="Material changes must chain evidence end-to-end.">
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-300">
          {MOCK_TRACEABILITY_CHAIN.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </ProductSection>

      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100">
        {C1_ARCHITECTURE_LAB_REFERENCE.label} — route pattern {C1_ARCHITECTURE_LAB_REFERENCE.studioRoute}
      </div>

      <ProductPageHeader
        eyebrow="Crow Core · C1"
        title="Blueprint Studio (reference)"
        description="Command Center layout: ten workspace tabs, version compare, ROI scenarios, 22-section SOW draft, and traceability drawer. Mock data only; no DB mutations."
        statusChip={{ label: "C1 prototype", tone: "info" }}
      />

      <ProductSection
        title="Blueprint Command Center"
        description="Primary action bar + lifecycle status (presentation only)."
      >
        <div className="cc-glass-card !p-4 text-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Lifecycle · {MOCK_C1_COMMAND_CENTER.lifecycleState}
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-white">
            {MOCK_C1_COMMAND_CENTER.readinessScore}% readiness
          </p>
          <p className="mt-1 text-xs text-slate-500">{MOCK_C1_COMMAND_CENTER.advisoryNote}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MOCK_C1_COMMAND_CENTER.primaryActions.map((action) => (
              <span
                key={action}
                className="rounded-full border border-slate-600/60 px-3 py-1 text-xs text-slate-300"
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      </ProductSection>

      <ProductSection title="Version compare (mock)" description="Section-level diff with impact labels.">
        <ul className="space-y-2">
          {MOCK_C1_VERSION_COMPARE.sections.map((row) => (
            <li key={row.sectionKey} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 px-3 py-2 text-sm">
              <span className="text-slate-200">{row.sectionKey}</span>
              <span className="text-xs uppercase tracking-wide text-amber-300/90">{row.impact}</span>
              <span className="w-full text-xs text-slate-500">{row.summary}</span>
            </li>
          ))}
        </ul>
      </ProductSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductSection title="ROI scenarios (mock)" description="Conservative / base / optimistic — deterministic formulas in C1 services.">
          <ul className="space-y-2">
            {MOCK_C1_ROI_SCENARIOS.map((s) => (
              <li key={s.scenario} className="cc-glass-card !p-4 text-sm">
                <p className="font-medium text-white">{s.scenario}</p>
                <p className="text-slate-400">
                  Net annual benefit {s.netAnnualBenefitSar.toLocaleString()} SAR · payback {s.paybackMonths} mo
                </p>
              </li>
            ))}
          </ul>
        </ProductSection>

        <ProductSection title="SOW workspace (22 sections)" description="Deterministic draft sections — advisory until approved.">
          <p className="mb-2 text-xs text-slate-500">{MOCK_C1_SOW_SECTIONS.length} sections in C1 contract</p>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-slate-300">
            {MOCK_C1_SOW_SECTIONS.map((key) => (
              <li key={key} className="rounded border border-slate-800/60 px-2 py-1 font-mono text-xs">
                {key}
              </li>
            ))}
          </ul>
        </ProductSection>
      </div>

      <ProductSection title="Traceability timeline (mock)" description="Actor attribution — AI entries labeled separately in production.">
        <ul className="space-y-2">
          {MOCK_C1_TRACEABILITY_TIMELINE.map((evt) => (
            <li key={evt.stage} className="cc-glass-card !p-3 text-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">{evt.stage}</p>
              <p className="text-slate-200">{evt.summary}</p>
              <p className="text-xs text-cyan-400/80">{evt.actor}</p>
            </li>
          ))}
        </ul>
      </ProductSection>

      <ProductSection
        title="SAREA role comparison (C1)"
        description="Studio tab mapping per persona — SAREA never grants access."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {MOCK_C1_SAREA_ROLE_COMPARISON.map((row) => (
            <div key={row.role} className="cc-glass-card !p-4 text-sm">
              <p className="font-semibold capitalize text-white">{row.role.replace(/_/g, " ")}</p>
              <p className="text-slate-400">Tab: {row.studioTab}</p>
              <p className="mt-1 text-xs text-slate-500">Density: {row.density}</p>
              {!row.grantsAccess && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-300/90">
                  Does not grant access
                </p>
              )}
            </div>
          ))}
        </div>
      </ProductSection>
    </div>
  );
}
