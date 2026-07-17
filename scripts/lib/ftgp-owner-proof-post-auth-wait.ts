import type { Page } from "playwright";

const OAUTH_WAIT_MS = 300_000;
const LEGAL_COMPLETION_WAIT_MS = 600_000;

function isCrowDeploymentHost(hostname: string): boolean {
  return hostname.includes("vercel.app");
}

function isPostOAuthCrowPath(pathname: string): boolean {
  return (
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/resolving") ||
    pathname.startsWith("/register/legal") ||
    pathname.startsWith("/account")
  );
}

function isAccountLanding(pathname: string): boolean {
  return pathname === "/account" || pathname.startsWith("/account/");
}

export type PostAuthWaitResult = {
  postAuthLanding: string;
  legalGateEncountered: boolean;
  normalGoogleAuthenticationCompleted: boolean;
};

/**
 * Wait for operator Google OAuth, optional legal acceptance, then /account landing.
 */
export async function waitForNormalOwnerPostAuthLanding(page: Page): Promise<PostAuthWaitResult> {
  console.log("  awaiting operator Google authentication (up to 300s)...");
  await page.waitForURL(
    (url) => {
      const { hostname, pathname } = new URL(url);
      return isCrowDeploymentHost(hostname) && isPostOAuthCrowPath(pathname);
    },
    { timeout: OAUTH_WAIT_MS }
  );

  let legalGateEncountered = false;
  let pathname = new URL(page.url()).pathname;

  if (pathname.startsWith("/register/legal")) {
    legalGateEncountered = true;
    console.log(
      "  legal gate active — complete required acceptance in the browser (up to 600s)..."
    );
    await page.waitForURL(
      (url) => {
        const { hostname, pathname: p } = new URL(url);
        return isCrowDeploymentHost(hostname) && isAccountLanding(p);
      },
      { timeout: LEGAL_COMPLETION_WAIT_MS }
    );
    pathname = new URL(page.url()).pathname;
  } else if (!isAccountLanding(pathname)) {
    console.log("  awaiting resolver / account landing...");
    await page.waitForURL(
      (url) => {
        const { hostname, pathname: p } = new URL(url);
        if (!isCrowDeploymentHost(hostname)) return false;
        if (p.startsWith("/register/legal")) {
          legalGateEncountered = true;
          return false;
        }
        return isAccountLanding(p);
      },
      { timeout: OAUTH_WAIT_MS }
    );
    pathname = new URL(page.url()).pathname;
    if (pathname.startsWith("/register/legal")) {
      legalGateEncountered = true;
      console.log(
        "  legal gate active — complete required acceptance in the browser (up to 600s)..."
      );
      await page.waitForURL(
        (url) => {
          const { hostname, pathname: p } = new URL(url);
          return isCrowDeploymentHost(hostname) && isAccountLanding(p);
        },
        { timeout: LEGAL_COMPLETION_WAIT_MS }
      );
      pathname = new URL(page.url()).pathname;
    }
  }

  if (!isAccountLanding(pathname)) {
    throw new Error(`post-auth landing=${pathname} (expected /account)`);
  }

  return {
    postAuthLanding: pathname,
    legalGateEncountered,
    normalGoogleAuthenticationCompleted: true,
  };
}
