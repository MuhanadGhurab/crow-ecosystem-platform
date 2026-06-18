import { execSync } from "node:child_process";
import { chromium } from "playwright";

const PREVIEW =
  process.env.C3_PREVIEW_BASE_URL?.replace(/\/$/, "") ??
  "https://crow-ecosystem-platform-ey92776e8-muhanadghurabs-projects.vercel.app";

function bypass(): string {
  const out = execSync(`npx vercel curl -v "${PREVIEW}/api/health" 2>&1`, {
    encoding: "utf8",
  });
  const m = out.match(/x-vercel-protection-bypass:\s*(\S+)/i);
  if (!m?.[1]) throw new Error("no bypass");
  return m[1];
}

async function main() {
  const token = bypass();
  const email = `mkkaweg4mer+c3dbg${Date.now().toString(36)}@gmail.com`;
  const password = `CrowDbg-${Date.now()}!9`;
  const redirects: string[] = [];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    extraHTTPHeaders: {
      "x-vercel-protection-bypass": token,
      "x-vercel-set-bypass-cookie": "true",
      "Accept-Language": "en-US",
    },
  });

  page.on("response", (res) => {
    if ([301, 302, 303, 307, 308].includes(res.status())) {
      redirects.push(`${res.status()} ${res.url()} -> ${res.headers()["location"] ?? ""}`);
    }
  });

  page.on("request", (req) => {
    if (req.method() === "POST") {
      console.log("POST", req.url());
    }
  });

  page.on("response", async (res) => {
    if (res.request().method() !== "POST") return;
    const headers = res.headers();
    console.log(
      "POST response",
      res.status(),
      "location=",
      headers.location ?? "",
      "x-action-redirect=",
      headers["x-action-redirect"] ?? ""
    );
  });

  await page.goto(`${PREVIEW}/signup`, { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.fill("#passwordConfirm", password);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForURL(/\/register\/legal/);
  redirects.length = 0;

  for (const docType of ["TERMS_OF_SERVICE", "PRIVACY_NOTICE", "ACCEPTABLE_USE_POLICY"]) {
    await page.locator(`#legal-tab-${docType}`).click().catch(() => undefined);
    await page
      .locator(`#legal-panel-${docType}`)
      .getByRole("checkbox", { name: /accessibility alternative/i })
      .click()
      .catch(() => undefined);
  }
  for (const id of ["terms-ack-checkbox", "privacy-ack-checkbox", "aup-ack-checkbox"] as const) {
    const input = page.locator(`#${id}`);
    if ((await input.count()) === 0) continue;
    await input.check();
  }
  await page.waitForFunction(
    () => {
      const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      return Boolean(btn && !btn.disabled);
    },
    { timeout: 30_000 }
  );
  await page.locator("#reg-password").fill(password);
  await page.locator("#reg-password-confirm").fill(password);
  await page.getByRole("button", { name: /continue to email verification/i }).click();
  await page.waitForTimeout(15_000);

  console.log("redirects:", redirects);
  console.log("final:", page.url());
  await browser.close();
}

main();
