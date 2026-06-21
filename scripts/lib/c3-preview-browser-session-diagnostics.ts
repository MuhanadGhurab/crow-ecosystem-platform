import type { BrowserContext, CDPSession, Page } from "playwright";
import { assertPreviewHost } from "./c3-preview-host-guard";
import { isSupabaseAuthCookieName } from "../../src/lib/supabase/auth-cookie-names";

export type SanitizedCookieMeta = {
  name: string;
  domain: string;
  path: string;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None" | undefined;
  httpOnly: boolean;
  expires: number;
  partitionKey?: string;
};

export type DocumentCookieRow = {
  requestLabel: string;
  pathname: string;
  supabaseCookieStored: boolean;
  applicableToUrl: boolean;
  sentOnRequest: boolean;
  blockedReasons: string[];
};

export type DocumentSessionResult = {
  proofCategory: "BROWSER_DOCUMENT_SESSION";
  finalPathname: string;
  landedOnLogin: boolean;
  reloadSurvived: boolean;
  profileSurvived: boolean;
  vercelJwtPresent: boolean;
  vercelJwtRequiredForAuth: boolean;
  allContextCookieNames: string[];
  urlApplicableCookieNames: string[];
  applicableCookieMeta: SanitizedCookieMeta[];
  documentCookieTable: DocumentCookieRow[];
};

function sanitizeCookieMeta(
  cookies: Awaited<ReturnType<BrowserContext["cookies"]>>
): SanitizedCookieMeta[] {
  return cookies.map((c) => ({
    name: c.name,
    domain: c.domain,
    path: c.path,
    secure: c.secure,
    sameSite: c.sameSite as SanitizedCookieMeta["sameSite"],
    httpOnly: c.httpOnly,
    expires: c.expires,
    partitionKey: "partitionKey" in c ? String((c as { partitionKey?: string }).partitionKey ?? "") : undefined,
  }));
}

function authNames(names: string[]): string[] {
  return names.filter((n) => isSupabaseAuthCookieName(n));
}

export class DocumentCookieObserver {
  private readonly requestUrls = new Map<string, string>();
  private readonly rows: DocumentCookieRow[] = [];
  private cdp: CDPSession | null = null;

  constructor(
    private readonly previewBase: string,
    private readonly previewHost: string
  ) {}

  async attach(page: Page): Promise<void> {
    this.cdp = await page.context().newCDPSession(page);
    await this.cdp.send("Network.enable");

    this.cdp.on("Network.requestWillBeSent", (params: { requestId: string; request: { url: string } }) => {
      this.requestUrls.set(params.requestId, params.request.url);
    });

    this.cdp.on(
      "Network.requestWillBeSentExtraInfo",
      (params: {
        requestId: string;
        associatedCookies?: Array<{
          cookie?: { name?: string };
          blockedReasons?: string[];
        }>;
      }) => {
        const url = this.requestUrls.get(params.requestId);
        if (!url) return;
        const parsed = new URL(url);
        if (parsed.host !== this.previewHost || parsed.protocol !== "https:") return;

        const associated = params.associatedCookies ?? [];
        const authEntries = associated.filter((entry) =>
          isSupabaseAuthCookieName(entry.cookie?.name ?? "")
        );
        const sent = authEntries.some(
          (entry) => !entry.blockedReasons || entry.blockedReasons.length === 0
        );
        const blocked = [
          ...new Set(
            authEntries.flatMap((entry) => entry.blockedReasons ?? []).filter(Boolean)
          ),
        ];

        this.rows.push({
          requestLabel: `${parsed.pathname}${parsed.search}`,
          pathname: parsed.pathname,
          supabaseCookieStored: false,
          applicableToUrl: false,
          sentOnRequest: sent,
          blockedReasons: blocked,
        });
      }
    );
  }

  async detach(): Promise<void> {
    if (this.cdp) {
      await this.cdp.detach().catch(() => undefined);
      this.cdp = null;
    }
  }

  getRows(): DocumentCookieRow[] {
    return this.rows;
  }
}

async function enrichRowsWithJarState(
  context: BrowserContext,
  previewBase: string,
  rows: DocumentCookieRow[]
): Promise<DocumentCookieRow[]> {
  const all = await context.cookies();
  const applicable = await context.cookies(previewBase);
  const stored = authNames(all.map((c) => c.name)).length > 0;
  const applicableAuth = authNames(applicable.map((c) => c.name)).length > 0;

  return rows.map((row) => ({
    ...row,
    supabaseCookieStored: stored,
    applicableToUrl: applicableAuth,
  }));
}

export function formatDocumentCookieTable(rows: DocumentCookieRow[]): string {
  const header =
    "| Request | Supabase cookie stored | Applicable to URL | Sent on request | Blocked reason |";
  const sep = "| --- | ---: | ---: | ---: | --- |";
  const body = rows.map(
    (r) =>
      `| ${r.requestLabel} | ${r.supabaseCookieStored} | ${r.applicableToUrl} | ${r.sentOnRequest} | ${r.blockedReasons.join(", ") || "—"} |`
  );
  return [header, sep, ...body].join("\n");
}

export type DocumentLoginMode = "server-action" | "post-route";

export async function runDocumentLoginSessionProof(input: {
  page: Page;
  context: BrowserContext;
  previewBase: string;
  email: string;
  password: string;
  loginPath?: string;
  expectedLanding?: RegExp;
  loginMode?: DocumentLoginMode;
}): Promise<DocumentSessionResult> {
  const {
    page,
    context,
    previewBase,
    email,
    password,
    loginPath = "/login",
    expectedLanding = /^\/account(\/|$)/,
    loginMode = "server-action",
  } = input;

  const observer = new DocumentCookieObserver(previewBase, new URL(previewBase).host);
  await observer.attach(page);

  const base = previewBase.replace(/\/$/, "");

  await page.goto(`${base}${loginPath}`, { waitUntil: "networkidle" });
  assertPreviewHost(page.url(), previewBase, "login page");

  await page.fill("#email", email);
  await page.fill("#password", password);

  if (loginMode === "post-route") {
    await page.evaluate(() => {
      const form = document.querySelector("form");
      if (form) {
        form.setAttribute("action", "/login/submit");
        form.setAttribute("method", "post");
      }
    });
  }

  const signInClick = page.getByRole("button", { name: /sign in with email/i }).click();

  if (loginMode === "post-route") {
    await Promise.all([
      page.waitForResponse(
        (r) =>
          r.request().method() === "POST" && new URL(r.url()).pathname === "/login/submit",
        { timeout: 90_000 }
      ),
      page.waitForURL((url) => expectedLanding.test(url.pathname), { timeout: 90_000 }),
      signInClick,
    ]);
  } else {
    await Promise.all([
      page.waitForURL((url) => expectedLanding.test(url.pathname), { timeout: 90_000 }),
      signInClick,
    ]);
  }
  assertPreviewHost(page.url(), previewBase, "post sign-in landing");

  await page.reload({ waitUntil: "networkidle" });
  assertPreviewHost(page.url(), previewBase, "after account reload");
  const reloadSurvived = !page.url().includes("/login");

  await page.goto(`${base}/account/profile`, { waitUntil: "networkidle" });
  assertPreviewHost(page.url(), previewBase, "account profile");
  const profileSurvived = !page.url().includes("/login");

  await page.reload({ waitUntil: "networkidle" });
  assertPreviewHost(page.url(), previewBase, "after profile reload");
  const profileReloadSurvived = !page.url().includes("/login");

  await observer.detach();

  const allCookies = await context.cookies();
  const urlCookies = await context.cookies(base);
  const vercelJwt = allCookies.some((c) => c.name === "_vercel_jwt");

  const documentCookieTable = await enrichRowsWithJarState(
    context,
    previewBase,
    observer.getRows()
  );

  return {
    proofCategory: "BROWSER_DOCUMENT_SESSION",
    finalPathname: new URL(page.url()).pathname,
    landedOnLogin: page.url().includes("/login"),
    reloadSurvived: reloadSurvived && profileReloadSurvived,
    profileSurvived: profileSurvived && profileReloadSurvived,
    vercelJwtPresent: vercelJwt,
    vercelJwtRequiredForAuth: false,
    allContextCookieNames: allCookies.map((c) => c.name),
    urlApplicableCookieNames: urlCookies.map((c) => c.name),
    applicableCookieMeta: sanitizeCookieMeta(
      urlCookies.filter((c) => isSupabaseAuthCookieName(c.name))
    ),
    documentCookieTable,
  };
}

export function assertDocumentSessionPass(result: DocumentSessionResult, label: string): void {
  if (result.landedOnLogin && !result.reloadSurvived) {
    throw new Error(`${label}: document session lost — reload redirected to login`);
  }
  if (!result.reloadSurvived) {
    throw new Error(`${label}: hard reload /account did not preserve document session`);
  }
  if (!result.profileSurvived) {
    throw new Error(`${label}: /account/profile document navigation lost session`);
  }
  const authApplicable = result.urlApplicableCookieNames.filter((n) =>
    isSupabaseAuthCookieName(n)
  );
  if (authApplicable.length === 0) {
    throw new Error(`${label}: no Supabase auth cookie applicable to Preview URL after login`);
  }
}
