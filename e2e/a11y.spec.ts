import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

const pages = ["/en", "/pt", "/en/projects/grao-co", "/pt/projects/grao-co"];

test.describe("accessibility", () => {
  for (const path of pages) {
    test(`${path} has no serious or critical axe violations`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "reduced-motion", "checked once, with every element in its final state");
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations
        .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
        .map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target.join(" ")).slice(0, 5) }));
      expect(blocking).toEqual([]);
    });
  }
});
