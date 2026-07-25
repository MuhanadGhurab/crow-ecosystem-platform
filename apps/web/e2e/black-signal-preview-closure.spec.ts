import { test, expect, type Page } from "@playwright/test";
import { bootstrapSession } from "./helpers";

test.describe.configure({ timeout: 180_000 });

async function playUntil(
  page: Page,
  predicate: () => Promise<boolean>,
  maxSteps = 24,
) {
  for (let i = 0; i < maxSteps; i++) {
    if (await predicate()) return;
    const firstChoice = page.locator(".choice-stack button").first();
    await expect(firstChoice).toBeVisible({ timeout: 15_000 });
    await firstChoice.click();
    await page.waitForTimeout(150);
  }
  throw new Error("playUntil exceeded maxSteps");
}

async function captureRunSnapshot(page: Page) {
  const shell = page.locator("[data-mission=black-signal]");
  return {
    runId: await shell.getAttribute("data-run-id"),
    kind: await shell.getAttribute("data-run-kind"),
    version: await shell.getAttribute("data-run-version"),
    worldHash: await shell.getAttribute("data-world-hash"),
    status: await shell.getAttribute("data-run-status"),
    choiceCount: await shell.getAttribute("data-choice-count"),
    currentNode: await shell.getAttribute("data-current-node"),
    bands: await page.locator("[data-band]").evaluateAll((els) =>
      els.map((el) => ({
        text: el.textContent?.trim() ?? "",
        band: el.getAttribute("data-band"),
      })),
    ),
  };
}

test.describe("Black Signal resume and Echo browser closure", () => {
  test("mid-Mission refresh resumes the same canonical run", async ({
    page,
  }) => {
    await bootstrapSession(page);
    await page.goto("/missions/black-signal");
    await page.getByRole("button", { name: "ابدأ الرحلة" }).click();
    await expect(page.locator("[data-node]")).toBeVisible({ timeout: 20_000 });

    // Interrupt after several decisions (not only one stage).
    await playUntil(page, async () => {
      const count = Number(
        (await page
          .locator("[data-mission=black-signal]")
          .getAttribute("data-choice-count")) ?? "0",
      );
      return count >= 3;
    });
    const before = await captureRunSnapshot(page);
    expect(before.runId).toBeTruthy();
    expect(before.kind).toBe("CANONICAL");
    expect(Number(before.choiceCount)).toBeGreaterThanOrEqual(3);

    await page.reload();
    await expect(page.locator("[data-node]")).toBeVisible({ timeout: 20_000 });
    const after = await captureRunSnapshot(page);
    expect(after.runId).toBe(before.runId);
    expect(after.currentNode).toBe(before.currentNode);
    expect(after.version).toBe(before.version);
    expect(after.worldHash).toBe(before.worldHash);
    expect(after.choiceCount).toBe(before.choiceCount);
    expect(after.bands).toEqual(before.bands);
    expect(after.status).not.toBe("COMPLETED");

    await playUntil(page, async () =>
      page.locator("[data-debrief]").isVisible(),
    );
    await expect(page.locator("[data-debrief]")).toBeVisible();
    const completed = await captureRunSnapshot(page);
    expect(completed.runId).toBe(before.runId);
    expect(completed.status).toBe("COMPLETED");
    expect(completed.kind).toBe("CANONICAL");

    await page.getByRole("button", { name: /قرارات التشغيل/ }).click();
    await expect(page.getByText(/سجل الرحلة/)).toBeVisible({ timeout: 15_000 });
  });

  test("Echo Flight diverges without mutating canonical history", async ({
    page,
  }) => {
    await bootstrapSession(page);
    await page.goto("/missions/black-signal");
    await page.getByRole("button", { name: "ابدأ الرحلة" }).click();
    await playUntil(page, async () =>
      page.locator("[data-debrief]").isVisible(),
    );
    await page.getByRole("button", { name: /قرارات التشغيل/ }).click();
    await expect(page.getByText(/بصمة الغراب/)).toBeVisible({
      timeout: 15_000,
    });

    const canonical = await captureRunSnapshot(page);
    expect(canonical.kind).toBe("CANONICAL");
    expect(canonical.status).toBe("COMPLETED");
    const canonicalOutcome = await page
      .locator("[data-debrief]")
      .locator("p")
      .filter({ hasText: /النتيجة/ })
      .textContent();

    await page
      .getByRole("button", { name: /ابدأ Echo Flight من قرار الفرز/ })
      .click();
    await expect(page.locator('[data-echo="true"]')).toBeVisible({
      timeout: 15_000,
    });
    const echoStart = await captureRunSnapshot(page);
    expect(echoStart.kind).toBe("ECHO");
    expect(echoStart.runId).not.toBe(canonical.runId);

    // Alternate action: prefer last choice to diverge from first-choice path.
    const lastChoice = page.locator(".choice-stack button").last();
    await expect(lastChoice).toBeVisible();
    await lastChoice.click();
    await expect(page.locator("[data-node]")).toBeVisible({ timeout: 10_000 });
    const echoMid = await captureRunSnapshot(page);
    expect(echoMid.kind).toBe("ECHO");
    expect(echoMid.runId).toBe(echoStart.runId);

    await page.reload();
    await expect(page.locator('[data-echo="true"]')).toBeVisible({
      timeout: 20_000,
    });
    const echoResumed = await captureRunSnapshot(page);
    expect(echoResumed.kind).toBe("ECHO");
    expect(echoResumed.runId).toBe(echoStart.runId);
    expect(echoResumed.runId).not.toBe(canonical.runId);

    const canonicalCheck = await page.request.get(
      `/api/missions/black-signal?runId=${canonical.runId}`,
    );
    expect(canonicalCheck.ok()).toBeTruthy();
    const canonicalBody = (await canonicalCheck.json()) as {
      resource: {
        run: {
          runId: string;
          kind: string;
          status: string;
          worldHash: string;
          version: number;
          choiceHistory: unknown[];
        };
        flightLog: { majorConsequences: string[] } | null;
      };
    };
    expect(canonicalBody.resource.run.kind).toBe("CANONICAL");
    expect(canonicalBody.resource.run.status).toBe("COMPLETED");
    expect(canonicalBody.resource.run.worldHash).toBe(canonical.worldHash);
    expect(canonicalBody.resource.run.version).toBe(Number(canonical.version));
    expect(canonicalBody.resource.flightLog).toBeTruthy();
    expect(echoResumed.worldHash).not.toBe(canonical.worldHash);
    expect(canonicalOutcome).toBeTruthy();
    void echoMid;
  });

  test("cross-user ownership isolates Black Signal runs", async ({
    browser,
  }) => {
    const learnerA = await browser.newContext();
    const learnerB = await browser.newContext();
    const pageA = await learnerA.newPage();
    const pageB = await learnerB.newPage();

    await bootstrapSession(pageA);
    await pageA.goto("/missions/black-signal");
    await pageA.getByRole("button", { name: "ابدأ الرحلة" }).click();
    await expect(pageA.locator("[data-node]")).toBeVisible({ timeout: 20_000 });
    await playUntil(pageA, async () => {
      const count = Number(
        (await pageA
          .locator("[data-mission=black-signal]")
          .getAttribute("data-choice-count")) ?? "0",
      );
      return count >= 2;
    });
    const aSnap = await captureRunSnapshot(pageA);
    expect(aSnap.runId).toBeTruthy();

    await bootstrapSession(pageB);
    const foreignGet = await pageB.request.get("/api/missions/black-signal");
    expect(foreignGet.ok()).toBeTruthy();
    const foreignBody = (await foreignGet.json()) as {
      resource: { run: { runId: string } } | null;
    };
    expect(foreignBody.resource).toBeNull();

    const mutate = await pageB.request.post(
      "/api/missions/black-signal/commands/select-choice",
      {
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        data: {
          runId: aSnap.runId,
          nodeId: aSnap.currentNode,
          choiceId: "should-not-matter",
          expectedVersion: Number(aSnap.version),
        },
      },
    );
    expect(mutate.status()).toBeGreaterThanOrEqual(400);
    const err = (await mutate.json()) as {
      category?: string;
      message?: string;
      runId?: string;
    };
    expect(JSON.stringify(err)).not.toContain(aSnap.worldHash ?? "___");
    expect(
      err.category === "NOT_FOUND" ||
        err.category === "FORBIDDEN" ||
        err.category === "UNAUTHORIZED",
    ).toBe(true);

    const stillA = await pageA.request.get("/api/missions/black-signal");
    const stillBody = (await stillA.json()) as {
      resource: { run: { runId: string; worldHash: string } } | null;
    };
    expect(stillBody.resource?.run.runId).toBe(aSnap.runId);
    expect(stillBody.resource?.run.worldHash).toBe(aSnap.worldHash);

    await learnerA.close();
    await learnerB.close();
  });
});
