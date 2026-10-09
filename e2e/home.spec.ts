import { expect, test } from "./fixtures";

test.describe("home page", () => {
  test("introduces Mateus with the live wordmark and the typed stack", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Mateus Winter — Full-stack Developer");
    await expect(page.getByTestId("variable-wordmark")).toBeVisible();
    await expect(page.getByText(/Stack: Next\.js, React\.js, TypeScript/)).toBeAttached();
  });

  test("tells the whole story section by section", async ({ page }) => {
    await page.goto("/en");
    for (const name of ["About me", "Tools I ship with", "Selected work", "From idea to production", "What I do", "Where I've been building", "Quick answers to common questions", "Let's talk"]) {
      await expect(page.getByRole("region", { name })).toBeAttached();
    }
    await expect(page.getByTestId("process-card")).toHaveCount(4);
    await expect(page.getByTestId("experience-card")).toHaveCount(5);
  });

  test("puts a face to the name in the about section", async ({ page }) => {
    await page.goto("/en");
    const about = page.getByRole("region", { name: "About me" });
    await about.scrollIntoViewIfNeeded();
    const portrait = about.getByRole("img", { name: /Portrait of Mateus Winter/ });
    await expect(portrait).toBeVisible();
    await expect.poll(() => portrait.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  });

  test("describes client work without showing screenshots of it", async ({ page }) => {
    await page.goto("/en");
    const experience = page.getByRole("region", { name: "Where I've been building" });
    await expect(experience.getByText("MyFleet — fleet tracking & telematics")).toBeVisible();
    await expect(experience.locator("img")).toHaveCount(0);
  });

  test("puts AI-assisted engineering front and center in the experience", async ({ page }) => {
    await page.goto("/en");
    const experience = page.getByRole("region", { name: "Where I've been building" });
    const aiCard = experience.locator("[data-highlight]");
    await expect(aiCard).toHaveCount(1);
    await expect(aiCard.getByRole("heading", { name: "AI-assisted engineering" })).toBeAttached();
    await expect(aiCard).toContainText("Claude Code");
  });

  test("answers recruiter questions on demand", async ({ page }) => {
    await page.goto("/en");
    const faq = page.getByRole("region", { name: "Quick answers to common questions" });
    await expect(faq.getByText(/as a pair, not an autopilot/)).toBeVisible();
    await faq.getByRole("button", { name: /What's your time zone\?/ }).click();
    await expect(faq.getByText(/Brasília time \(UTC−3\)/)).toBeVisible();
    await expect(faq.getByText(/as a pair, not an autopilot/)).toBeHidden();
  });

  test("remembers the chosen theme", async ({ page, isMobile }) => {
    test.skip(isMobile, "the theme toggle lives inside the mobile menu");
    await page.goto("/en");
    const html = page.locator("html");
    const initial = (await html.getAttribute("class"))?.includes("dark") ? "dark" : "light";
    await page.getByTestId("theme-toggle").first().click();
    const flipped = initial === "dark" ? "light" : "dark";
    await expect(html).toHaveClass(new RegExp(`\\b${flipped}\\b`));
    await page.reload();
    await expect(html).toHaveClass(new RegExp(`\\b${flipped}\\b`));
  });

  test("copies the e-mail address", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "clipboard permissions are Chromium-only");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en");
    await page.getByRole("button", { name: "Copy e-mail" }).click();
    await expect(page.getByText("E-mail copied to the clipboard")).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("mateuswinter2002@gmail.com");
  });
});
