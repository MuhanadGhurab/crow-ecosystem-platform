"use client";

import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { ActivationPageFrame } from "../../activation/_components/ActivationPageFrame";

export function OnboardingEntryClient({
  initialResource,
}: {
  initialResource: ActivationResource;
}) {
  return (
    <ActivationPageFrame
      screenId="ONB-001"
      titleKey="onb001Title"
      initialResource={initialResource}
    >
      {({ msg }) => (
        <>
          <p data-major-state="handoff">{msg("onb001Body")}</p>
          <aside role="note" className="legal-disclaimer">
            <p>{msg("onb001LocalNotice")}</p>
          </aside>
          <p role="status">{msg("onb001CtaDeferred")}</p>
          <nav aria-label="activation">
            <a href="/activation/complete">{msg("act006Title")}</a>
            {" · "}
            <a href="/activation/mobile-optional">{msg("act007Title")}</a>
          </nav>
        </>
      )}
    </ActivationPageFrame>
  );
}
