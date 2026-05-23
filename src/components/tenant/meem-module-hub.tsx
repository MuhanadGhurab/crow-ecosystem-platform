import Link from "next/link";
import { AI_EXTRAS } from "@/lib/constants/ai-extras";
import type { LogisticsAiFeature } from "@/lib/erp/industry-packs/logistics";
import { getMeemHubConfig, type MeemHubModuleKey } from "@/lib/meem/meem-hub-config";

type MeemModuleHubProps = {
  moduleKey: MeemHubModuleKey;
  slug: string;
  organizationName: string;
  aiExtraKeys: string[];
};

function AiCapabilityGrid({
  title,
  features,
  aiExtraKeys,
}: {
  title: string;
  features: readonly LogisticsAiFeature[];
  aiExtraKeys: string[];
}) {
  const enabled = new Set(aiExtraKeys);

  return (
    <section>
      <h3 className="text-sm font-medium text-teal-300">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">
        Blueprint add-ons from discovery — priced on blueprint; wired to tenant workflows below.
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const extra = AI_EXTRAS.find((e) => e.key === feature.aiExtraKey);
          const isOn = enabled.has(feature.aiExtraKey);
          return (
            <li
              key={feature.key}
              className={`rounded-cc border p-4 ${
                isOn
                  ? "border-teal-500/25 bg-teal-950/20"
                  : "border-slate-700/40 bg-white/[0.02]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-white">{feature.title}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isOn ? "bg-teal-500/20 text-teal-300" : "bg-slate-700/50 text-slate-500"
                  }`}
                >
                  {isOn ? feature.status : "Not subscribed"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              {extra && (
                <p className="mt-3 text-xs text-teal-300/90">
                  +{extra.monthlySar} SAR/mo · {extra.nameEn}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function OpsPipeline({ title, steps }: { title: string; steps: readonly string[] }) {
  return (
    <section className="cc-glass-card">
      <h3 className="text-sm font-medium text-cyan-400">{title}</h3>
      <ol className="mt-4 space-y-2 text-sm text-slate-400">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-2">
            <span className="font-mono text-cyan-500/80">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** MEEM logistics tenant module hub — ops links, AI capability cards, and workflow pipeline. */
export function MeemModuleHub({ moduleKey, slug, organizationName, aiExtraKeys }: MeemModuleHubProps) {
  const config = getMeemHubConfig(moduleKey);
  const links = config.links(slug);

  return (
    <div className="space-y-8">
      <section className="cc-glass-card border-cyan-500/15">
        <h3 className="text-sm font-medium text-cyan-400">{config.opsTitle}</h3>
        <p className="mt-2 text-sm text-slate-400">
          {organizationName} — {config.opsDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="cc-btn-secondary text-sm">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <AiCapabilityGrid
        title={config.aiSectionTitle}
        features={config.features}
        aiExtraKeys={aiExtraKeys}
      />

      <OpsPipeline title={config.pipelineTitle} steps={config.pipeline} />
    </div>
  );
}
