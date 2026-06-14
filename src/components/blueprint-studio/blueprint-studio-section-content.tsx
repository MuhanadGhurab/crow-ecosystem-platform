import Link from "next/link";
import { compareBlueprintSnapshots } from "@/lib/crow-core/blueprint-studio/blueprint-diff.service";
import { COMMERCIAL_ADVISORY_FOOTER } from "@/lib/crow-core/commercial-intelligence/advisory-labels";
import type { BlueprintStudioSectionKey } from "@/lib/crow-core/blueprint-studio/studio-sections";
import type { IntegrationBlueprintSlice } from "@/lib/crow-core/blueprint";
import type { BlueprintStudioContext } from "@/lib/server/blueprint-studio-load";
import { routes } from "@/lib/routes";
import { captureBlueprintSnapshotAction } from "@/lib/actions/blueprint-studio";

type Props = {
  section: BlueprintStudioSectionKey;
  context: BlueprintStudioContext;
};

function SliceCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cc-glass-card space-y-3 p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function readinessScore(context: BlueprintStudioContext): number {
  const { checks } = context.readiness;
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((c) => c.complete).length / checks.length) * 100);
}

function integrationRows(slice: IntegrationBlueprintSlice) {
  const rows: { key: string; name: string; category: string }[] = [];
  for (const name of slice.identityProviders) {
    rows.push({ key: `idp-${name}`, name, category: "Identity" });
  }
  for (const name of slice.financeSystems) {
    rows.push({ key: `fin-${name}`, name, category: "Finance" });
  }
  for (const name of slice.hrSystems) {
    rows.push({ key: `hr-${name}`, name, category: "HR" });
  }
  for (const name of slice.externalApis) {
    rows.push({ key: `api-${name}`, name, category: "External API" });
  }
  for (const name of slice.governmentServices) {
    rows.push({ key: `gov-${name}`, name, category: "Government" });
  }
  return rows;
}

export function BlueprintStudioSectionContent({ section, context }: Props) {
  const doc = context.document;
  const org = doc.slices.find((s) => s.type === "organizational");
  const ops = doc.slices.find((s) => s.type === "operational");
  const sec = doc.slices.find((s) => s.type === "security_trust");
  const exp = doc.slices.find((s) => s.type === "experience");
  const integ = doc.slices.find((s) => s.type === "integration");
  const comm = doc.slices.find((s) => s.type === "commercial");
  const b = routes.blueprint(context.blueprintId);

  switch (section) {
    case "overview":
      return (
        <div className="space-y-4">
          <SliceCard title="Blueprint overview">
            <p className="text-sm text-slate-300">
              {doc.assumptions[0] ?? `Blueprint v${doc.ref.version} for ${context.organizationName}`}
            </p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Lifecycle</dt>
                <dd className="text-slate-200">{context.lifecycleState}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Readiness score</dt>
                <dd className="text-slate-200">{readinessScore(context)}%</dd>
              </div>
              <div>
                <dt className="text-slate-500">ROI ready</dt>
                <dd className="text-slate-200">{context.readiness.roiReady ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">SOW ready</dt>
                <dd className="text-slate-200">{context.readiness.sowReady ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </SliceCard>
          <SliceCard title="Readiness checks">
            <ul className="space-y-2 text-sm">
              {context.readiness.checks.map((check) => (
                <li key={check.key} className="flex items-start justify-between gap-3">
                  <span className="text-slate-300">{check.label}</span>
                  <span className={check.complete ? "text-emerald-400" : "text-amber-400"}>
                    {check.complete ? "Complete" : check.blocker ?? "Incomplete"}
                  </span>
                </li>
              ))}
            </ul>
          </SliceCard>
          <SliceCard title="Focused runtime prep">
            <p className="text-sm text-slate-400">
              Studio composes blueprint intent. Use existing surfaces for pricing, CEM, and
              provisioning prep.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href={b.pricing} className="cc-btn-secondary !px-3 !py-1.5 text-xs">
                Pricing
              </Link>
              <Link href={b.cem} className="cc-btn-secondary !px-3 !py-1.5 text-xs">
                CEM
              </Link>
              <Link href={b.readiness} className="cc-btn-secondary !px-3 !py-1.5 text-xs">
                Readiness
              </Link>
            </div>
          </SliceCard>
        </div>
      );

    case "organization":
      return (
        <SliceCard title="Organization">
          {org ? (
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Tenant: {org.tenantName}</li>
              <li>Departments: {org.departments.map((d) => d.label).join(", ") || "—"}</li>
              <li>Branches: {org.branches.map((b) => b.label).join(", ") || "—"}</li>
              <li>Roles: {org.roles.map((r) => r.label).join(", ") || "—"}</li>
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No organizational slice in adapter output.</p>
          )}
        </SliceCard>
      );

    case "operations":
      return (
        <SliceCard title="Operations">
          {ops ? (
            <ul className="space-y-2 text-sm text-slate-300">
              {ops.processes.map((p) => (
                <li key={p.key}>
                  <span className="font-medium text-white">{p.label}</span>
                  {p.departmentKey ? ` — ${p.departmentKey}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No operational processes mapped.</p>
          )}
        </SliceCard>
      );

    case "security-trust":
      return (
        <SliceCard title="Security & Trust">
          {sec ? (
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Authorization: {sec.authorizationModel || "—"}</li>
              <li>Identity assurance: {sec.identityAssurance.join(", ") || "—"}</li>
              <li>Privacy controls: {sec.privacyControls.join(", ") || "—"}</li>
              <li>
                Evidence retention: {sec.evidenceRetentionPolicy ?? "—"}
              </li>
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No security slice available.</p>
          )}
        </SliceCard>
      );

    case "experience-sarea":
      return (
        <SliceCard title="Experience / SAREA">
          {exp ? (
            <>
              <p className="text-xs text-slate-500">
                SAREA maps presentation only — it does not grant permissions.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Personas: {exp.personas.map((p) => p.label).join(", ") || "—"}</li>
                <li>Navigation: {exp.navigationKeys.join(", ") || "—"}</li>
                <li>SAREA rules: {exp.sareaRules.join(", ") || "—"}</li>
                <li>Accessibility: {exp.accessibilityRequirements.join(", ") || "—"}</li>
              </ul>
              <Link href={b.sarea} className="cc-btn-secondary mt-3 inline-block !px-3 !py-1.5 text-xs">
                Open SAREA studio
              </Link>
            </>
          ) : (
            <p className="text-sm text-slate-500">No experience slice available.</p>
          )}
        </SliceCard>
      );

    case "integrations":
      return (
        <SliceCard title="Integrations">
          {integ ? (
            <ul className="space-y-2 text-sm text-slate-300">
              {integrationRows(integ).map((s) => (
                <li key={s.key}>
                  <span className="font-medium text-white">{s.name}</span> ({s.category})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No integrations mapped.</p>
          )}
          <Link
            href={b.integrations}
            className="cc-btn-secondary mt-3 inline-block !px-3 !py-1.5 text-xs"
          >
            Integrations surface
          </Link>
        </SliceCard>
      );

    case "commercial":
      return (
        <SliceCard title="Commercial">
          {comm ? (
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Modules</dt>
                <dd className="text-slate-200">{comm.modules.join(", ") || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Timeline (weeks)</dt>
                <dd className="text-slate-200">{comm.timelineWeeks ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Implementation effort (days)</dt>
                <dd className="text-slate-200">{comm.implementationEffortDays ?? "—"}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-500">No commercial slice.</p>
          )}
          <Link href={b.pricing} className="cc-btn-secondary mt-3 inline-block !px-3 !py-1.5 text-xs">
            Pricing workspace
          </Link>
        </SliceCard>
      );

    case "roi":
      return (
        <div className="space-y-4">
          <SliceCard title="ROI scenarios">
            <p className="text-xs text-slate-500">{COMMERCIAL_ADVISORY_FOOTER}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {context.roiResult.calculations.map((calc) => (
                <div
                  key={calc.scenario}
                  className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-4"
                >
                  <h3 className="font-medium text-cyan-200">{calc.scenario}</h3>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {calc.netAnnualBenefitSar.toLocaleString()} SAR
                  </p>
                  <p className="text-xs text-slate-500">Net annual benefit</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Payback: {calc.paybackMonths ?? "—"} mo · Confidence:{" "}
                    {context.roiResult.confidence}
                  </p>
                </div>
              ))}
            </div>
          </SliceCard>
          <SliceCard title="Assumptions">
            <ul className="space-y-2 text-sm">
              {context.roiModel.assumptions.map((a) => (
                <li key={a.key} className="flex justify-between gap-4 text-slate-300">
                  <span>
                    {a.label}
                    {context.isReferenceFixture ? " (reference)" : ""}
                  </span>
                  <span className="font-mono text-slate-200">
                    {a.value} {a.unit ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          </SliceCard>
        </div>
      );

    case "sow":
      return (
        <div className="space-y-4">
          <SliceCard title="SOW draft (22 sections)">
            <p className="text-xs text-slate-500">{context.sowResult.draft.advisoryDisclaimer}</p>
            {context.sowResult.warnings.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-300">
                {context.sowResult.warnings.map((w) => (
                  <li key={w}>⚠ {w}</li>
                ))}
              </ul>
            )}
            <div className="mt-4 space-y-4">
              {context.sowResult.draft.sections.map((s) => (
                <article key={s.key} className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-medium text-white">{s.title}</h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-400">{s.body}</p>
                </article>
              ))}
            </div>
          </SliceCard>
        </div>
      );

    case "versions-evidence": {
      const versions = context.versions;
      const diff =
        versions.length >= 2
          ? compareBlueprintSnapshots(versions[versions.length - 2], versions[versions.length - 1])
          : null;

      return (
        <div className="space-y-4">
          <SliceCard title="Version snapshots">
            <p className="text-xs text-slate-500">
              Prototype store (in-memory). Path C migration required for durable version history.
            </p>
            <form action={captureBlueprintSnapshotAction} className="mt-3">
              <input type="hidden" name="blueprintId" value={context.blueprintId} />
              <button type="submit" className="cc-btn-primary !px-3 !py-1.5 text-xs">
                Capture new snapshot
              </button>
            </form>
            <ul className="mt-4 space-y-2 text-sm">
              {versions.map((v) => (
                <li
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-800 px-3 py-2"
                >
                  <span className="font-mono text-cyan-300">v{v.ref.version}</span>
                  <span className="text-slate-500">{v.ref.status}</span>
                  <span className="font-mono text-xs text-slate-600">{v.contentHash.slice(0, 12)}…</span>
                </li>
              ))}
            </ul>
          </SliceCard>
          {diff && (
            <SliceCard title="Latest diff">
              <p className="text-sm text-slate-400">
                Overall impact: <span className="text-white">{diff.overallImpact}</span>
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {diff.sections
                  .filter((s) => s.impact !== "NONE")
                  .map((s) => (
                    <li key={s.sectionKey} className="text-slate-300">
                      <span className="text-white">{s.sectionKey}</span> ({s.impact}): {s.summary}
                    </li>
                  ))}
              </ul>
            </SliceCard>
          )}
          <SliceCard title="Assumptions & acceptance">
            <h3 className="text-sm font-medium text-slate-300">Assumptions</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
              {doc.assumptions.map((a, i) => (
                <li key={`${a}-${i}`}>{a}</li>
              ))}
            </ul>
            <h3 className="mt-4 text-sm font-medium text-slate-300">Acceptance criteria</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
              {doc.acceptanceCriteria.map((a, i) => (
                <li key={`${a}-${i}`}>{a}</li>
              ))}
            </ul>
          </SliceCard>
        </div>
      );
    }

    default:
      return null;
  }
}
