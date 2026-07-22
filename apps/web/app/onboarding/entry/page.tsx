"use client";

import { ActivationPageFrame } from "../../activation/_components/ActivationPageFrame";

export default function OnboardingEntryPage() {
  return (
    <ActivationPageFrame screenId="ONB-001" titleKey="onb001Title">
      {({ msg }) => (
        <>
          <p>{msg("onb001Body")}</p>
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
