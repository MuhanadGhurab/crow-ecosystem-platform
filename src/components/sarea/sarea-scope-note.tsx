import { SAREA_COPY, SAREA_SCOPE } from "@/lib/constants/sarea-ux-depth";

type SareaScopeNoteProps = {
  compact?: boolean;
};

export function SareaScopeNote({ compact }: SareaScopeNoteProps) {
  return (
    <section
      className={
        compact
          ? "rounded-lg border border-rose-500/15 bg-rose-950/15 px-3 py-2 text-xs"
          : "cc-glass-card cc-entity-block--sarea !p-5"
      }
    >
      <h2
        className={
          compact
            ? "font-medium text-rose-200"
            : "font-display text-sm font-semibold uppercase tracking-wider text-rose-300"
        }
      >
        What SAREA is — and is not
      </h2>
      <div className={`mt-3 grid gap-4 sm:grid-cols-2 ${compact ? "text-[11px]" : "text-sm"}`}>
        <div>
          <p className="font-medium text-slate-300">Experience orchestration</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-500">
            {SAREA_SCOPE.whatItIs.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-slate-300">Out of scope</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-500">
            {SAREA_SCOPE.whatItIsNot.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className={`mt-3 text-slate-500 ${compact ? "text-[11px]" : "text-xs"}`}>
        {SAREA_COPY.rbacBoundary}
      </p>
    </section>
  );
}
