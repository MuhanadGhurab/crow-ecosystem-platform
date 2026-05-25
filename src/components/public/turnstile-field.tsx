"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: { sitekey: string; callback?: (token: string) => void; "expired-callback"?: () => void }
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileField({
  onTokenChange,
}: {
  onTokenChange: (token: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [scriptReady, setScriptReady] = useState(false);

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token) => onTokenChange(token),
      "expired-callback": () => onTokenChange(null),
    });
  }, [onTokenChange]);

  useEffect(() => {
    if (scriptReady) renderWidget();
  }, [scriptReady, renderWidget]);

  if (!siteKey) return null;

  return (
    <div className="mt-4">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" aria-label="Security check" />
      <p className="mt-1 text-xs text-slate-500">Protected by Cloudflare Turnstile</p>
    </div>
  );
}

export function isTurnstileWidgetConfigured(): boolean {
  return Boolean(siteKey);
}
