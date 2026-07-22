"use client";

import type { ReactNode } from "react";
import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { useLocale } from "../../../lib/locale-context";
import type { OnboardingScreenId } from "../../../lib/onboarding-routes";
import type { MessageKey } from "../../../lib/localization/messages";
import { OnboardingShell, ErrorPanel } from "./OnboardingShell";
import { useOnboarding } from "./useOnboarding";

type FrameContext = Omit<ReturnType<typeof useOnboarding>, "resource"> & {
  resource: OnboardingResource;
  msg: (k: MessageKey) => string;
};

export function OnboardingPageFrame({
  screenId,
  titleKey,
  children,
  initialResource = null,
  activationAggregateId,
}: {
  screenId: OnboardingScreenId;
  titleKey: MessageKey;
  children: (ctx: FrameContext) => ReactNode;
  initialResource?: OnboardingResource | null;
  activationAggregateId?: string;
}) {
  const { msg } = useLocale();
  const ctx = useOnboarding(screenId, {
    initialResource,
    activationAggregateId,
  });
  const { resource, error, correlationId, loading, submitting, access } = ctx;

  return (
    <OnboardingShell
      screenId={screenId}
      title={msg(titleKey)}
      resource={resource}
    >
      {loading ? <p aria-live="polite">{msg("loading")}</p> : null}
      {submitting ? <p aria-live="polite">{msg("submitting")}</p> : null}
      {error ? (
        <ErrorPanel message={error} correlationId={correlationId} />
      ) : null}
      {!resource ? (
        <p role="status" data-access-blocked="true">
          {msg("errUnauthorized")}
        </p>
      ) : !access.allowed ? (
        <p role="status" data-access-blocked="true">
          {msg("loading")}
        </p>
      ) : (
        <>
          <p data-screen-id={screenId} className="sr-meta" dir="ltr">
            {screenId}
          </p>
          {children({ ...ctx, resource, msg })}
        </>
      )}
    </OnboardingShell>
  );
}
