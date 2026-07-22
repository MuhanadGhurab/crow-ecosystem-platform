"use client";

import type { OnboardingResource } from "@ghuravia/contracts/schemas";
import { useLocale } from "../../../lib/locale-context";
import {
  ONBOARDING_ROUTES,
  ONBOARDING_SCREEN_ORDER,
  type OnboardingScreenId,
} from "../../../lib/onboarding-routes";
import { ErrorPanel } from "../../activation/_components/ActivationShell";

export function OnboardingShell({
  screenId,
  title,
  children,
  resource,
}: {
  screenId: OnboardingScreenId;
  title: string;
  children: React.ReactNode;
  resource: OnboardingResource | null;
}) {
  const { locale, setLocale, msg } = useLocale();
  const accessible = new Set(resource?.accessibleScreens ?? ["ONB-001"]);

  return (
    <div className="activation-shell onboarding-shell">
      <a className="skip-link" href="#main">
        {msg("skipToContent")}
      </a>
      <header role="banner" className="activation-header">
        <div className="brand">{msg("productName")}</div>
        <p className="local-banner" role="status">
          {msg("localOnlyBanner")}
        </p>
        <div className="header-actions">
          <button
            type="button"
            className="lang-switch"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            aria-label={
              locale === "ar"
                ? msg("languageSwitchToEn")
                : msg("languageSwitchToAr")
            }
          >
            {locale === "ar"
              ? msg("languageSwitchToEn")
              : msg("languageSwitchToAr")}
          </button>
        </div>
      </header>

      <aside
        className="activation-progress"
        aria-labelledby="onboarding-progress-heading"
      >
        <h2 id="onboarding-progress-heading">
          {msg("onboardingProgressTitle")}
        </h2>
        <ol>
          {ONBOARDING_SCREEN_ORDER.map((id) => (
            <li
              key={id}
              data-done={accessible.has(id) ? "true" : "false"}
              data-current={id === screenId ? "true" : "false"}
            >
              {id}
              {accessible.has(id) ? " ✓" : ""}
            </li>
          ))}
        </ol>
        <p className="screen-meta" dir="ltr">
          {screenId} · {ONBOARDING_ROUTES[screenId]}
        </p>
        {resource ? (
          <p className="tech" dir="ltr" data-onboarding-state={resource.state}>
            {resource.state} · v{resource.version}
          </p>
        ) : null}
      </aside>

      <main id="main" tabIndex={-1}>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}

export { ErrorPanel };
