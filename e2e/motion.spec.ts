import { test as base } from "@playwright/test";
import { expect, test } from "./fixtures";

base.describe("intro", () => {
  base("plays once per session", async ({ page }, testInfo) => {
    base.skip(testInfo.project.name !== "desktop");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
    await expect(page.getByTestId("preloader")).toBeVisible();
    await expect(page.getByTestId("preloader")).toBeHidden({ timeout: 5000 });
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", "play");

    await page.reload();
    await expect(page.getByTestId("preloader")).toBeHidden();
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", "play");
  });

  base("is skipped for visitors who prefer reduced motion", async ({ page }, testInfo) => {
    base.skip(testInfo.project.name !== "reduced-motion");
    await page.goto("/en");
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", "play");
    await expect(page.getByTestId("preloader")).toBeHidden();
  });
});

test.describe("smooth scrolling", () => {
  test("opens the case study from the top even when clicked mid-glide", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop");
    await page.goto("/en");
    await page.mouse.move(700, 450);
    for (let step = 0; step < 8; step++) {
      await page.mouse.wheel(0, 500);
    }
    await page.waitForTimeout(150);
    await page.locator("#work a[href$='/projects/grao-co']").first().evaluate((link: HTMLAnchorElement) => link.click());
    await expect(page).toHaveURL(/\/en\/projects\/grao-co$/);
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("lands on the right section when a link points to the home page", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop");
    await page.goto("/en/projects/grao-co");
    await page.getByRole("banner").getByRole("link", { name: /Contact/ }).click();
    await expect(page).toHaveURL(/\/en#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });
});

test.describe("pointer effects", () => {
  test("follows the mouse with a labelled cursor on desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop");
    await page.goto("/en");
    await page.mouse.move(400, 400);
    await expect(page.getByTestId("custom-cursor")).toBeAttached();
    await page.locator("#work a[data-cursor]").first().hover();
    await expect(page.getByTestId("custom-cursor-label")).toHaveText("View case");
  });

  test("leaves touch screens with the native experience", async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.goto("/en");
    await expect(page.getByTestId("custom-cursor")).toHaveCount(0);
  });

  test("swells the letters closest to the cursor", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop");
    await page.goto("/en");
    const wordmark = page.getByTestId("variable-wordmark");
    const box = (await wordmark.boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + box.height / 2, { steps: 4 });
    await page.waitForTimeout(600);
    const weights = await wordmark.locator("span[style*='font-variation-settings']").evaluateAll((slots) =>
      slots.map((slot) => Number(/"wght" ([\d.]+)/.exec((slot as HTMLElement).style.fontVariationSettings)?.[1])),
    );
    expect(weights[0]).toBeGreaterThan(weights[weights.length - 1] + 50);
  });
});

test.describe("reduced motion", () => {
  test("shows every piece of content without animation", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "reduced-motion");
    await page.goto("/en");
    await expect(page.getByTestId("hacker-typing-static")).toContainText("Next.js · React.js · TypeScript · React Native · Laravel/Node.js · Figma · Git");
    await expect(page.getByTestId("custom-cursor")).toHaveCount(0);
    await page.goto("/en/projects/grao-co");
    await expect(page.getByTestId("snap-gallery")).toBeVisible();
  });
});

test.describe("mobile", () => {
  test("navigates through the full-screen menu", async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.goto("/en");
    await page.getByTestId("mobile-menu-trigger").click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: /FAQ/ }).click();
    await expect(menu).toBeHidden();
    await expect(page.getByRole("region", { name: "Quick answers to common questions" })).toBeInViewport();
  });

  test("never scrolls sideways on a small phone", async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.setViewportSize({ width: 360, height: 780 });
    for (const path of ["/en", "/pt", "/pt/projects/grao-co"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });

  test("swipes through the case study screens", async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.goto("/en/projects/grao-co");
    const gallery = page.getByTestId("snap-gallery");
    await expect(gallery).toBeVisible();
    await gallery.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => gallery.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  });
});
