import type { RequestIndustryPreview } from "@/lib/constants/sector-catalog";

type Props = {
  preview: RequestIndustryPreview;
};

export function RequestIndustryPreviewPanel({ preview }: Props) {
  return (
    <div
      className="mt-3 rounded-xl border border-violet-500/20 bg-violet-950/15 p-4 text-sm"
      role="region"
      aria-live="polite"
      aria-label={`Industry preview: ${preview.title}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-violet-300/80">
        If you proceed with {preview.title}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <PreviewList title="Typical CEM modules" items={preview.recommendedModules} />
        <PreviewList title="Typical workflows" items={preview.typicalWorkflows} />
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium text-slate-500">What discovery will ask next</p>
        <ul className="mt-1.5 space-y-1 text-xs text-slate-400">
          {preview.discoveryNext.map((line) => (
            <li key={line} className="leading-snug">
              {line}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-slate-500">
        {preview.advisoryNote}
      </p>
    </div>
  );
}

function PreviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <ul className="mt-1.5 space-y-0.5 text-xs text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
