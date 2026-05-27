import { CYBERCROW_SCOPE } from "@/lib/constants/cybercrow-ux-depth";

type CybercrowScopeNoteProps = {
  compact?: boolean;
  emphasizeLegal?: boolean;
};

export function CybercrowScopeNote({ compact, emphasizeLegal }: CybercrowScopeNoteProps) {
  return (
    <section
      className={
        compact
          ? "rounded-lg border border-violet-500/15 bg-violet-950/15 px-3 py-2 text-xs text-slate-400"
          : "rounded-lg border border-violet-500/20 bg-violet-950/20 px-4 py-3 text-sm"
      }
    >
      <p className={compact ? "font-medium text-violet-200" : "font-medium text-violet-100"}>
        Advisory trust posture — operator-reviewed
      </p>
      <ul className={`mt-2 list-inside list-disc space-y-0.5 ${compact ? "text-[11px]" : "text-xs"} text-slate-500`}>
        {CYBERCROW_SCOPE.whatItIsNot.slice(0, compact ? 2 : 4).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {emphasizeLegal ? (
        <p className={`mt-2 ${compact ? "text-[11px]" : "text-xs"} text-slate-500`}>
          Evidence catalog entries are readiness metadata — not legal audit artifacts or regulator
          attestation.
        </p>
      ) : null}
    </section>
  );
}
