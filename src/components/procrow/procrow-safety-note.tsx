import { PROCROW_CONTROL_TOWER } from "@/lib/constants/procrow-portal";

type ProCrowSafetyNoteProps = {
  className?: string;
};

/** Shared staging / F23-gated disclaimer for ProCrow operator surfaces. */
export function ProCrowSafetyNote({ className = "" }: ProCrowSafetyNoteProps) {
  return (
    <p
      className={`text-xs leading-relaxed text-slate-500 ${className}`.trim()}
      data-procrow="safety-note"
    >
      {PROCROW_CONTROL_TOWER.stagingNote}
    </p>
  );
}
