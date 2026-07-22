"use client";

import type { ActivationResource } from "@ghuravia/contracts/schemas";
import { useLocale } from "../../../lib/locale-context";
import { lockCopy } from "../../../lib/localization/format";
import {
  ACTIVATION_ROUTES,
  type GovernedScreenId,
} from "../../../lib/activation-routes";

export function ActivationShell({
  screenId,
  title,
  children,
  resource,
}: {
  screenId: GovernedScreenId;
  title: string;
  children: React.ReactNode;
  resource: ActivationResource | null;
}) {
  const { locale, setLocale, msg } = useLocale();
  const gates = resource?.gates;

  return (
    <div className="activation-shell">
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

      <aside className="activation-progress" aria-labelledby="progress-heading">
        <h2 id="progress-heading">{msg("progressTitle")}</h2>
        <ol>
          <li data-done={gates?.emailVerified ? "true" : "false"}>
            {msg("gateEmail")}
            {gates?.emailVerified ? " ✓" : ""}
          </li>
          <li data-done={gates?.termsAccepted ? "true" : "false"}>
            {msg("gateTerms")}
            {gates?.termsAccepted ? " ✓" : ""}
          </li>
          <li data-done={gates?.accountRiskAcceptable ? "true" : "false"}>
            {msg("gateRisk")}
            {gates?.accountRiskAcceptable ? " ✓" : ""}
          </li>
          <li data-done={resource?.state === "ACTIVATED" ? "true" : "false"}>
            {msg("gateComplete")}
            {resource?.state === "ACTIVATED" ? " ✓" : ""}
          </li>
        </ol>
        <p className="optional-note">{msg("mobileOptionalLabel")}</p>
        <p className="screen-meta" dir="ltr">
          {screenId} · {ACTIVATION_ROUTES[screenId]}
        </p>
      </aside>

      <main id="main" tabIndex={-1}>
        <h1>{title}</h1>
        {children}
      </main>
    </div>
  );
}

export function ExplainableLocks({
  resource,
}: {
  resource: ActivationResource;
}) {
  const { locale, msg } = useLocale();
  if (resource.locks.length === 0) return null;
  return (
    <section aria-labelledby="locks-heading" className="locks">
      <h2 id="locks-heading">
        {locale === "ar" ? "أقفال التفعيل" : "Explainable Locks"}
      </h2>
      <ul>
        {resource.locks.map((lock) => {
          const copy = lockCopy(locale, lock.code);
          return (
            <li key={lock.code}>
              <strong>{copy.title}</strong>
              <p>{copy.body}</p>
              <p>
                {msg("nextAction")}: {lock.nextAction}
              </p>
              <p className="tech" dir="ltr">
                {lock.code}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ErrorPanel({
  message,
  correlationId,
}: {
  message: string;
  correlationId?: string;
}) {
  const { msg } = useLocale();
  return (
    <div
      role="alert"
      className="error-summary"
      tabIndex={-1}
      id="error-summary"
    >
      <h2>{msg("errorSummary")}</h2>
      <p>{message}</p>
      {correlationId ? (
        <p className="tech" dir="ltr">
          {msg("correlationId")}: {correlationId}
        </p>
      ) : null}
    </div>
  );
}
