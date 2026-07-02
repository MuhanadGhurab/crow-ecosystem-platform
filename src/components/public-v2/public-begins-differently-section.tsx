import { PublicSection } from "@/components/public-v2/public-section";
import { CROW_APPROACH_POINTS, TRADITIONAL_SOFTWARE_POINTS } from "@/lib/public-v2/journey-definitions";
import { PUBLIC_V2_SECTION_IDS } from "@/lib/public-v2/routes";

function ComparisonColumn({
  title,
  tone,
  points,
}: {
  title: string;
  tone: "neutral" | "crow";
  points: readonly string[];
}) {
  const toneClass =
    tone === "crow"
      ? "border-cyan-500/25 bg-cyan-500/[0.04]"
      : "border-white/[0.08] bg-white/[0.02]";
  const titleClass = tone === "crow" ? "text-cyan-200" : "text-slate-300";

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${toneClass}`}>
      <h3 className={`text-sm font-semibold uppercase tracking-wide ${titleClass}`}>{title}</h3>
      <ul className="mt-4 space-y-3" role="list">
        {points.map((point) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-400">
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "crow" ? "bg-cyan-400" : "bg-slate-500"}`}
              aria-hidden
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicBeginsDifferentlySection() {
  return (
    <PublicSection
      id={PUBLIC_V2_SECTION_IDS.beginsDifferently}
      eyebrow="Why Crow"
      title="Crow begins differently"
      description="A fair comparison — Crow is designed around how organizations actually operate, not around a catalog of modules."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        <ComparisonColumn title="Traditional business software" tone="neutral" points={TRADITIONAL_SOFTWARE_POINTS} />
        <ComparisonColumn title="Crow" tone="crow" points={CROW_APPROACH_POINTS} />
      </div>
    </PublicSection>
  );
}
