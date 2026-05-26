import Link from "next/link";
import {
  acceptOrgIntelligenceFormAction,
  regenerateOrgIntelligenceFormAction,
} from "@/lib/actions/org-intelligence";
import type { OrgIntelligenceModel } from "@/lib/org-intelligence/types";
import type { OrgIntelligenceStatus } from "@/lib/org-intelligence/types";
import { SECTOR_TEMPLATE_KEYS } from "@/lib/org-intelligence/sector-template-data";
import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";
import type { OrgModelTrimStats } from "@/lib/org-intelligence/apply-plan-depth";
import {
  advisoryHintForCapability,
  advisoryLabelForHint,
  PLAN_DISPLAY_NAMES,
} from "@/lib/subscription/plan-capabilities";

const STATUS_LABEL: Record<OrgIntelligenceStatus, string> = {
  RECOMMENDED: "Sector template suggested",
  CUSTOMIZED: "Customized — pending accept",
  ACCEPTED: "Accepted into Discovery",
};

export function OrganizationModelPanel({
  requestId,
  model,
  status,
  sectorTemplateKey,
  canEdit,
  planKey,
  planDisplayName,
  trimStats,
}: {
  requestId: string;
  model: OrgIntelligenceModel;
  status: OrgIntelligenceStatus;
  sectorTemplateKey: string;
  canEdit: boolean;
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  trimStats?: OrgModelTrimStats | null;
}) {
  const approvalHint = advisoryLabelForHint(
    advisoryHintForCapability(planKey, "advanced_approval_chain_modeling"),
    planKey
  );
  const cybercrowHint = advisoryLabelForHint(
    advisoryHintForCapability(planKey, "compliance_evidence"),
    planKey
  );
  const sareaHint = advisoryLabelForHint(
    advisoryHintForCapability(planKey, "executive_command_center"),
    planKey
  );
  const discoveryHint = advisoryLabelForHint(
    advisoryHintForCapability(planKey, "full_organizational_intelligence"),
    planKey
  );
  return (
    <div className="space-y-8">
      <section className="cc-glass-card border border-cyan-500/20 !p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Advisory sector template
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-white">
              {model.sectorName}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Sector template:{" "}
              <span className="font-mono text-cyan-300">{sectorTemplateKey}</span> ·{" "}
              {STATUS_LABEL[status]}
            </p>
          </div>
          {canEdit && (
            <div className="flex flex-wrap gap-2">
              <form action={regenerateOrgIntelligenceFormAction}>
                <input type="hidden" name="requestId" value={requestId} />
                <button type="submit" className="cc-btn-secondary !px-3 !py-1.5 text-xs">
                  Refresh recommendations
                </button>
              </form>
              {status !== "ACCEPTED" && (
                <form action={acceptOrgIntelligenceFormAction}>
                  <input type="hidden" name="requestId" value={requestId} />
                  <button type="submit" className="cc-btn-primary !px-3 !py-1.5 text-xs">
                    Accept into Discovery
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Crow advises — you decide. Recommendations are tailored for{" "}
          <span className="text-cyan-300">{planDisplayName}</span> ({planKey}). Nothing here blocks
          your choices; upgrade tiers expand depth, not access to edit.
        </p>
        <PlanAdvisoryBanner
          planKey={planKey}
          planDisplayName={planDisplayName}
          discoveryHint={discoveryHint}
          trimStats={trimStats}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrgSection title="Recommended departments" count={model.departments.length}>
          <ul className="space-y-2">
            {model.departments.map((d) => (
              <li
                key={d.key}
                className="rounded-cc-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-sm"
              >
                <span className="font-medium text-white">{d.name}</span>
                {d.recommendedHeadcount && (
                  <span className="ml-2 text-xs text-slate-500">
                    headcount {d.recommendedHeadcount.min}–{d.recommendedHeadcount.max}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </OrgSection>

        <OrgSection title="Recommended positions" count={model.positions.length}>
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {model.positions.map((p) => (
              <li
                key={p.key}
                className="rounded-cc-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-white">{p.title}</span>
                  {p.riskSensitive && <Badge tone="amber">Risk-sensitive role</Badge>}
                  {p.cybercrowSensitive && <Badge tone="violet">CyberCrow-monitored</Badge>}
                  {p.sareaPersonaKey && <Badge tone="rose">SAREA-ready</Badge>}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {p.level} · {p.departmentKey}
                </p>
              </li>
            ))}
          </ul>
        </OrgSection>

        <OrgSection
          title="Approval chains"
          count={model.approvalChains.length}
          advisory={approvalHint}
        >
          <ul className="space-y-3">
            {model.approvalChains.map((c) => (
              <li key={c.key} className="text-sm">
                <p className="font-medium text-cyan-200">{c.name}</p>
                <p className="mt-1 text-xs text-slate-400">{c.steps.join(" → ")}</p>
              </li>
            ))}
          </ul>
        </OrgSection>

        <OrgSection title="Workflows" count={model.workflows.length}>
          <ul className="space-y-2">
            {model.workflows.map((w) => (
              <li key={w.key} className="text-sm text-slate-300">
                {w.name}
                {w.complexityLevel && (
                  <span className="ml-2 text-xs text-slate-500">({w.complexityLevel})</span>
                )}
              </li>
            ))}
          </ul>
        </OrgSection>

        <OrgSection
          title="CyberCrow posture suggestions"
          count={model.cybercrowBaselines.length}
          entity="cybercrow"
          advisory={cybercrowHint}
        >
          <ul className="space-y-2">
            {model.cybercrowBaselines.map((b) => (
              <li
                key={b.key}
                className="rounded-cc-sm border border-violet-500/15 bg-violet-500/5 px-3 py-2 text-sm"
              >
                <p className="font-medium text-violet-200">{b.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{b.controls.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </OrgSection>

        <OrgSection
          title="SAREA experience suggestions"
          count={model.sareaProfiles.length}
          entity="sarea"
          advisory={sareaHint}
        >
          <ul className="space-y-2">
            {model.sareaProfiles.map((s) => (
              <li
                key={s.key}
                className="rounded-cc-sm border border-rose-500/15 bg-rose-500/5 px-3 py-2 text-sm"
              >
                <p className="font-medium text-rose-200">{s.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {s.dashboardType} · {s.personaKey}
                </p>
              </li>
            ))}
          </ul>
        </OrgSection>
      </div>

      {canEdit && status !== "ACCEPTED" && (
        <section className="cc-glass-card !p-5">
          <p className="text-sm font-medium text-white">Switch sector template</p>
          <p className="mt-1 text-xs text-slate-500">
            Regenerate recommendations from a different industry pattern.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SECTOR_TEMPLATE_KEYS.map((key) => (
              <form key={key} action={regenerateOrgIntelligenceFormAction}>
                <input type="hidden" name="requestId" value={requestId} />
                <input type="hidden" name="sectorKey" value={key} />
                <button
                  type="submit"
                  className={`rounded-full border px-3 py-1 text-xs capitalize ${
                    key === sectorTemplateKey
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200"
                      : "border-white/10 text-slate-400 hover:border-cyan-500/30"
                  }`}
                >
                  {key}
                </button>
              </form>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-slate-500">
        After accept: edit on{" "}
        <Link href={`/discovery/${requestId}/departments`} className="text-cyan-400">
          Structure
        </Link>{" "}
        and{" "}
        <Link href={`/discovery/${requestId}/roles`} className="text-cyan-400">
          Roles
        </Link>
        . Blueprint freezes the tenant-specific organization contract at go-live.
      </p>
    </div>
  );
}

function PlanAdvisoryBanner({
  planKey,
  planDisplayName,
  discoveryHint,
  trimStats,
}: {
  planKey: SubscriptionTierKey;
  planDisplayName: string;
  discoveryHint: string;
  trimStats?: OrgModelTrimStats | null;
}) {
  const planNarrative =
    planKey === "startup"
      ? {
          headline: "Crow Start — intentionally lean for startup operations",
          body: "Recommendations focus on core departments, essential roles, and lightweight workflows so you can launch fast without over-building governance.",
          upgrade:
            "Upgrade to Crow Growth expands operational structure, incident reporting, and deeper SAREA layouts when you outgrow this footprint.",
        }
      : planKey === "growth"
        ? {
            headline: "Crow Growth — expands operational structure and workflows",
            body: "Recommendations add multi-branch patterns, richer approval chains, and operational blueprint depth suited to scaling multi-site and holding-group operations.",
            upgrade:
              "Upgrade to Crow Enterprise when you need Entra ID SSO, SCIM, full organizational intelligence, and executive command center experiences.",
          }
        : {
            headline: "Crow Enterprise — full governance, identity, CyberCrow, and SAREA depth",
            body: "Recommendations include the full sector model: advanced approval chains, compliance posture, executive and analyst SAREA experiences, and enterprise blueprint depth.",
            upgrade: null,
          };

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-cc-sm border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-slate-400">
        <p>
          <span className="font-medium text-cyan-200">{planNarrative.headline}</span> — generated for{" "}
          <span className="text-cyan-200">{planDisplayName}</span>.
        </p>
        <p className="mt-2 text-slate-300">{planNarrative.body}</p>
        {planNarrative.upgrade && (
          <p className="mt-2 text-amber-200/90">{planNarrative.upgrade}</p>
        )}
        <p className="mt-2">
          <span className="text-slate-300">{discoveryHint}</span> — Crow advises; you may accept or
          customize without tier blocking.
        </p>
      </div>
      {trimStats && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            Included vs trimmed for {planDisplayName}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <TrimStat label="Recommendation depth" value={trimStats.discoveryDepth} />
            <TrimStat label="Roles included" value={trimStats.positionsShown} />
            <TrimStat
              label="Roles trimmed (upgrade may restore)"
              value={trimStats.rolesHiddenCount}
              highlight={trimStats.rolesHiddenCount > 0}
            />
            <TrimStat label="Workflows included" value={trimStats.workflowsShown} />
            {trimStats.workflowsTrimmed > 0 && (
              <TrimStat
                label="Workflows trimmed"
                value={trimStats.workflowsTrimmed}
                highlight
              />
            )}
            <TrimStat label="CyberCrow posture included" value={trimStats.cybercrowBaselinesShown} />
            {trimStats.cybercrowBaselinesTrimmed > 0 && (
              <TrimStat
                label="CyberCrow items trimmed"
                value={trimStats.cybercrowBaselinesTrimmed}
                highlight
              />
            )}
            <TrimStat label="SAREA profiles included" value={trimStats.sareaProfilesShown} />
            {trimStats.sareaProfilesTrimmed > 0 && (
              <TrimStat
                label="SAREA profiles trimmed"
                value={trimStats.sareaProfilesTrimmed}
                highlight
              />
            )}
            {trimStats.departmentsTrimmed > 0 && (
              <TrimStat label="Departments trimmed" value={trimStats.departmentsTrimmed} highlight />
            )}
            {trimStats.approvalChainsTrimmed > 0 && (
              <TrimStat
                label="Approval chains hidden"
                value={trimStats.approvalChainsTrimmed}
                highlight
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TrimStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-cc-sm border px-3 py-2 ${
        highlight ? "border-amber-500/20 bg-amber-500/5" : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`text-sm font-medium capitalize ${highlight ? "text-amber-200" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function OrgSection({
  title,
  count,
  children,
  entity = "cem",
  advisory,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  entity?: "cem" | "cybercrow" | "sarea";
  advisory?: string;
}) {
  const block =
    entity === "cybercrow"
      ? "cc-entity-block--cybercrow"
      : entity === "sarea"
        ? "cc-entity-block--sarea"
        : "cc-entity-block--cem";

  return (
    <section className={`cc-glass-card ${block} !p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-white">
          {title} <span className="font-mono text-xs text-slate-500">({count})</span>
        </h3>
        {advisory && !advisory.startsWith("Included in") && (
          <span className="text-[10px] uppercase tracking-wide text-amber-400/90">{advisory}</span>
        )}
        {advisory?.startsWith("Included in") && (
          <span className="text-[10px] text-emerald-400/80">{advisory}</span>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "amber" | "violet" | "rose" }) {
  const cls =
    tone === "amber"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
      : tone === "violet"
        ? "border-violet-500/30 bg-violet-500/10 text-violet-200"
        : "border-rose-500/30 bg-rose-500/10 text-rose-200";
  return (
    <span className={`rounded-full border px-1.5 py-0.5 text-[10px] ${cls}`}>{children}</span>
  );
}
