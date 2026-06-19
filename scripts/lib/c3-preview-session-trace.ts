import type { BrowserContext, Page, Response } from "playwright";
import { assertPreviewHost } from "./c3-preview-host-guard";

export type SanitizedSetCookie = {
  name: string;
  path?: string;
  secure?: boolean;
  sameSite?: string;
  httpOnly?: boolean;
  maxAge?: number;
  expires?: string;
};

export type SessionFlowTrace = {
  label: string;
  cookiesBeforeSignIn: string[];
  signInPostStatus: number | null;
  signInLocation: string | null;
  signInSetCookieNames: string[];
  signInSetCookieAttributes: SanitizedSetCookie[];
  firstRedirectGetStatus: number | null;
  firstRedirectRequestCookieNames: string[];
  cookieNamesAfterFirstNav: string[];
  sessionProofAfterFirstNav: SessionProofSnapshot | null;
  reloadRequestCookieNames: string[];
  reloadStatus: number | null;
  sessionProofAfterReload: SessionProofSnapshot | null;
  finalRoute: string | null;
};

export type SessionProofSnapshot = {
  authenticated: boolean;
  platformAccountActive: boolean;
  sessionCookiePresent: boolean;
  authCookieCount: number;
};

function parseSetCookieHeader(header: string): SanitizedSetCookie {
  const [nameValue, ...parts] = header.split(";");
  const name = nameValue?.split("=")[0]?.trim() ?? "";
  const attrs: SanitizedSetCookie = { name };

  for (const part of parts) {
    const [rawKey, rawVal] = part.trim().split("=");
    const key = rawKey?.toLowerCase();
    if (key === "path") attrs.path = rawVal;
    if (key === "secure") attrs.secure = true;
    if (key === "httponly") attrs.httpOnly = true;
    if (key === "samesite") attrs.sameSite = rawVal;
    if (key === "max-age") attrs.maxAge = Number(rawVal);
    if (key === "expires") attrs.expires = rawVal;
  }

  return attrs;
}

function authTokenCookieNames(names: string[]): string[] {
  return names.filter((name) => name.includes("-auth-token"));
}

export async function readSessionProof(
  page: Page,
  previewBase: string
): Promise<SessionProofSnapshot | null> {
  const response = await page.goto(`${previewBase}/api/c3/session-proof`, {
    waitUntil: "commit",
  });
  if (!response || response.status() === 404) return null;
  const body = (await response.json()) as SessionProofSnapshot;
  return body;
}

export async function captureBrowserSignInTrace(input: {
  page: Page;
  context: BrowserContext;
  previewBase: string;
  label: string;
  email: string;
  password: string;
  expectedLanding: RegExp;
  loginPath?: string;
}): Promise<SessionFlowTrace> {
  const {
    page,
    context,
    previewBase,
    label,
    email,
    password,
    expectedLanding,
    loginPath = "/login",
  } = input;

  const trace: SessionFlowTrace = {
    label,
    cookiesBeforeSignIn: (await context.cookies(previewBase)).map((c) => c.name),
    signInPostStatus: null,
    signInLocation: null,
    signInSetCookieNames: [],
    signInSetCookieAttributes: [],
    firstRedirectGetStatus: null,
    firstRedirectRequestCookieNames: [],
    cookieNamesAfterFirstNav: [],
    sessionProofAfterFirstNav: null,
    reloadRequestCookieNames: [],
    reloadStatus: null,
    sessionProofAfterReload: null,
    finalRoute: null,
  };

  let signInPostResponse: Response | null = null;
  let firstAccountGet: Response | null = null;

  const onResponse = (response: Response) => {
    const request = response.request();
    const url = new URL(response.url());
    assertPreviewHost(url, previewBase, `${label} response`);

    if (
      request.method() === "POST" &&
      url.pathname === "/login/submit" &&
      !signInPostResponse
    ) {
      signInPostResponse = response;
    }

    if (
      request.method() === "GET" &&
      (url.pathname === "/account" || url.pathname === "/client") &&
      !firstAccountGet &&
      signInPostResponse
    ) {
      firstAccountGet = response;
    }
  };

  page.on("response", onResponse);

  try {
    await page.goto(`${previewBase}${loginPath}`, { waitUntil: "networkidle" });
    assertPreviewHost(page.url(), previewBase, `${label} login page`);

    await page.fill("#email", email);
    await page.fill("#password", password);

    await Promise.all([
      page.waitForURL((url) => expectedLanding.test(url.pathname), { timeout: 90_000 }),
      page.getByRole("button", { name: /sign in with email/i }).click(),
    ]);

    assertPreviewHost(page.url(), previewBase, `${label} post sign-in`);

    if (signInPostResponse) {
      trace.signInPostStatus = signInPostResponse.status();
      trace.signInLocation = signInPostResponse.headers()["location"] ?? null;
      const setCookieHeaders = signInPostResponse
        .headersArray()
        .filter((h) => h.name.toLowerCase() === "set-cookie")
        .map((h) => h.value);
      trace.signInSetCookieAttributes = setCookieHeaders.map(parseSetCookieHeader);
      trace.signInSetCookieNames = authTokenCookieNames(
        trace.signInSetCookieAttributes.map((c) => c.name)
      );
    }

    if (firstAccountGet) {
      trace.firstRedirectGetStatus = firstAccountGet.status();
      trace.firstRedirectRequestCookieNames = authTokenCookieNames(
        (await firstAccountGet.request().headerValue("cookie"))?.split(";").map((p) => p.trim().split("=")[0] ?? "") ?? []
      );
    }

    trace.cookieNamesAfterFirstNav = authTokenCookieNames(
      (await context.cookies(previewBase)).map((c) => c.name)
    );
    trace.sessionProofAfterFirstNav = await readSessionProof(page, previewBase);

    const reloadResponse = await page.reload({ waitUntil: "networkidle" });
    trace.reloadStatus = reloadResponse?.status() ?? null;
    trace.reloadRequestCookieNames = authTokenCookieNames(
      (await context.cookies(previewBase)).map((c) => c.name)
    );
    trace.sessionProofAfterReload = await readSessionProof(page, previewBase);
    trace.finalRoute = new URL(page.url()).pathname;
    assertPreviewHost(page.url(), previewBase, `${label} after reload`);

    return trace;
  } finally {
    page.off("response", onResponse);
  }
}

export function formatComparisonTable(
  controlled: SessionFlowTrace,
  fresh: SessionFlowTrace
): string {
  const row = (signal: string, a: string, b: string) =>
    `| ${signal} | ${a} | ${b} |`;

  return [
    "| Signal | Controlled user | Fresh user |",
    "| --- | --- | --- |",
    row(
      "Sign-in session returned",
      String(controlled.signInPostStatus === 303),
      String(fresh.signInPostStatus === 303)
    ),
    row(
      "Set-Cookie count",
      String(controlled.signInSetCookieNames.length),
      String(fresh.signInSetCookieNames.length)
    ),
    row(
      "Cookie names",
      controlled.signInSetCookieNames.join(", ") || "—",
      fresh.signInSetCookieNames.join(", ") || "—"
    ),
    row(
      "Cookie chunks",
      String(controlled.signInSetCookieNames.filter((n) => n.includes(".")).length),
      String(fresh.signInSetCookieNames.filter((n) => n.includes(".")).length)
    ),
    row(
      "Secure/SameSite/Path",
      controlled.signInSetCookieAttributes
        .map((c) => `${c.name}:secure=${Boolean(c.secure)};SameSite=${c.sameSite ?? "?"};Path=${c.path ?? "/"}`)
        .join(" · ") || "—",
      fresh.signInSetCookieAttributes
        .map((c) => `${c.name}:secure=${Boolean(c.secure)};SameSite=${c.sameSite ?? "?"};Path=${c.path ?? "/"}`)
        .join(" · ") || "—"
    ),
    row(
      "Redirect host",
      controlled.signInLocation ?? "—",
      fresh.signInLocation ?? "—"
    ),
    row(
      "First GET sends cookie",
      String(controlled.firstRedirectRequestCookieNames.length > 0),
      String(fresh.firstRedirectRequestCookieNames.length > 0)
    ),
    row(
      "Server auth after first nav",
      String(controlled.sessionProofAfterFirstNav?.authenticated ?? false),
      String(fresh.sessionProofAfterFirstNav?.authenticated ?? false)
    ),
    row(
      "Hard reload sends cookie",
      String(controlled.reloadRequestCookieNames.length > 0),
      String(fresh.reloadRequestCookieNames.length > 0)
    ),
    row(
      "Server auth after reload",
      String(controlled.sessionProofAfterReload?.authenticated ?? false),
      String(fresh.sessionProofAfterReload?.authenticated ?? false)
    ),
    row("Final route", controlled.finalRoute ?? "—", fresh.finalRoute ?? "—"),
  ].join("\n");
}
