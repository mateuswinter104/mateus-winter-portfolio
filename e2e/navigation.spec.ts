import { expect, test } from "./fixtures";

test.describe("routing and languages", () => {
  test("sends visitors to English by default", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("sends Portuguese speakers to the Portuguese site", async ({ browser }) => {
    const context = await browser.newContext({ locale: "pt-BR", extraHTTPHeaders: { "Accept-Language": "pt-BR,pt;q=0.9" } });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/pt$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(/Desenvolvedor Full-stack/);
    await context.close();
  });

  test("keeps the visitor on the same page when switching language", async ({ page, isMobile }) => {
    test.skip(isMobile, "the switcher lives inside the mobile menu");
    await page.goto("/en/projects/grao-co");
    await page.getByRole("link", { name: "Switch to Português" }).first().click();
    await expect(page).toHaveURL(/\/pt\/projects\/grao-co$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Grão & Co\./);
  });

  test("shows a friendly 404 for unknown projects and pages", async ({ page }) => {
    for (const [path, heading] of [
      ["/en/projects/does-not-exist", "Nothing here"],
      ["/pt/qualquer/coisa", "Nada por aqui"],
    ]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    }
  });

  test("opens the Grão & Co. case study from the home page", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#work").getByRole("link", { name: "View case", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/projects\/grao-co$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Grão & Co\./);
    await expect(page.getByRole("link", { name: /Source code/ })).toHaveAttribute("href", "https://github.com/mateuswinter104/coffee-commerce");
  });

  test("always opens a case study from the top and brings the visitor back with the back button", async ({ page }) => {
    await page.goto("/en");
    const card = page.locator("#work").getByRole("link", { name: "View case", exact: true });
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
    const homeScroll = await page.evaluate(() => window.scrollY);

    await card.click();
    await expect(page).toHaveURL(/\/en\/projects\/grao-co$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();

    await page.goBack();
    await expect(page).toHaveURL(/\/en$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(homeScroll - 200);
  });

  test("starts a revisited case study from the top instead of where the last visit stopped", async ({ page }) => {
    for (const leave of ["back button", "home link"]) {
      await page.goto("/en");
      await page.locator("#work").getByRole("link", { name: "View case", exact: true }).click();
      await expect(page).toHaveURL(/\/en\/projects\/grao-co$/);
      await page.getByRole("heading", { name: "Key decisions" }).scrollIntoViewIfNeeded();
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1500);

      if (leave === "back button") {
        await page.goBack();
      } else {
        await page.getByRole("main").getByRole("link", { name: /Back to home/ }).last().click();
      }
      await expect(page).toHaveURL(/\/en$/);

      await page.locator("#work").getByRole("link", { name: "View case", exact: true }).click();
      await expect(page).toHaveURL(/\/en\/projects\/grao-co$/);
      await expect.poll(() => page.evaluate(() => window.scrollY), { message: `after leaving with the ${leave}` }).toBe(0);
    }
  });

  test("serves the CV as a PDF", async ({ page, request }) => {
    await page.goto("/en");
    const href = await page.getByRole("link", { name: /Download CV/ }).getAttribute("href");
    const response = await request.get(href!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });
});
