export const PUBLIC_CLIENT_JOURNEY_PHASES = [
  { id: "browse", phase: "Browse", summary: "Explore Crow publicly — no sign-in required." },
  { id: "choose", phase: "Choose path", summary: "Build new or transform existing — learn the journey first." },
  { id: "signin", phase: "Sign in", summary: "Authenticate only when starting the secure client process." },
  { id: "request", phase: "Request", summary: "Submit your intake when ready to begin formally." },
  { id: "discovery", phase: "Discovery", summary: "Collaborate on scope, constraints, and readiness." },
  { id: "blueprint", phase: "Blueprint", summary: "Review the governed operating design." },
  { id: "commercial", phase: "Commercial", summary: "Accept agreement and commercial terms." },
  { id: "tenant", phase: "Build tenant", summary: "Provision your governed environment." },
  { id: "live", phase: "Go live", summary: "Operate with CEM, CyberCrow, SAREA, and ProCrow." },
  { id: "improve", phase: "Improve", summary: "Continue through subscription and monthly improvement." },
] as const;

type JourneyHighlight = (typeof PUBLIC_CLIENT_JOURNEY_PHASES)[number]["id"];

type PublicClientJourneyStepsProps = {
  highlight?: JourneyHighlight | JourneyHighlight[];
  compact?: boolean;
};

export function PublicClientJourneySteps({ highlight, compact = false }: PublicClientJourneyStepsProps) {
  const highlights = highlight == null ? [] : Array.isArray(highlight) ? highlight : [highlight];

  return (
    <ol className={compact ? "pv2-journey-steps pv2-journey-steps-compact" : "pv2-journey-steps"}>
      {PUBLIC_CLIENT_JOURNEY_PHASES.map((step, index) => {
        const isHighlighted = highlights.includes(step.id);
        return (
          <li
            key={step.id}
            className={`pv2-journey-step${isHighlighted ? " is-highlighted" : ""}`}
            aria-current={isHighlighted ? "step" : undefined}
          >
            <span className="pv2-journey-step-index" aria-hidden>
              {index + 1}
            </span>
            <div>
              <p className="pv2-journey-step-phase">{step.phase}</p>
              <p className="pv2-journey-step-summary">{step.summary}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
