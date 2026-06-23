/**
 * FTGP.1H.4a — Distinguish automation-bypass secret presence from active bypass usage.
 */
export const BYPASS_HEADER_NAME = "x-vercel-protection-bypass";
export const BYPASS_COOKIE_SET_HEADER = "x-vercel-set-bypass-cookie";

export type AutomationBypassUsageSignals = {
  useBypassBrowserContext?: boolean;
  extraHttpHeaders?: Record<string, string | undefined>;
  cookies?: Array<{ name: string; value?: string }>;
  url?: string;
};

function headerUsesBypass(headers: Record<string, string | undefined>): boolean {
  for (const [key, value] of Object.entries(headers)) {
    if (!value?.trim()) continue;
    const lower = key.toLowerCase();
    if (lower === BYPASS_HEADER_NAME || lower === BYPASS_COOKIE_SET_HEADER) {
      return true;
    }
  }
  return false;
}

function urlUsesBypass(url: string): boolean {
  try {
    const parsed = new URL(url);
    for (const key of parsed.searchParams.keys()) {
      const lower = key.toLowerCase();
      if (lower === BYPASS_HEADER_NAME || lower === BYPASS_COOKIE_SET_HEADER) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

function cookiesUseBypass(cookies: Array<{ name: string; value?: string }>): boolean {
  return cookies.some((cookie) => {
    const name = cookie.name.toLowerCase();
    return name.includes("vercel-protection-bypass") || name.includes("x-vercel-set-bypass-cookie");
  });
}

/** True when bypass is attached to browser traffic, not merely present in operator env. */
export function isAutomationBypassActivelyUsed(signals: AutomationBypassUsageSignals): boolean {
  if (signals.useBypassBrowserContext) return true;
  if (signals.extraHttpHeaders && headerUsesBypass(signals.extraHttpHeaders)) return true;
  if (signals.url && urlUsesBypass(signals.url)) return true;
  if (signals.cookies && cookiesUseBypass(signals.cookies)) return true;
  return false;
}

export function assertCertificationOwnerProofBypassPolicy(input: {
  certificationMode: boolean;
  bypassSecretPresent: boolean;
  activeBypassUsage: boolean;
}): void {
  if (!input.certificationMode) return;
  if (input.activeBypassUsage) {
    throw new Error("automation bypass must not be used for certification owner proof");
  }
  void input.bypassSecretPresent;
}

export function shouldUsePreviewAutomationBypassContext(
  certificationMode: boolean,
  bypassSecretPresent: boolean
): boolean {
  return !certificationMode && bypassSecretPresent;
}
