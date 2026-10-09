import { existsSync } from "node:fs";
import { join } from "node:path";
import { experience, formatPeriod } from "@/content/experience";
import { availableCvs, cvFiles, cvFor, site } from "@/content/site";
import en from "../../messages/en.json";
import pt from "../../messages/pt.json";

describe("site content", () => {
  it("serves every CV it lists", () => {
    for (const cv of availableCvs()) {
      expect(existsSync(join(__dirname, "..", "..", "public", cv.href))).toBe(true);
    }
  });

  it("falls back to the English CV when a locale has none", () => {
    expect(cvFor("en")).toBe(cvFiles.en);
    expect(cvFor("pt")).toBe(cvFiles.pt ?? cvFiles.en);
  });

  it("points to the right public profiles", () => {
    expect(site.social.github).toBe("https://github.com/mateuswinter104");
    expect(site.social.linkedin).toBe("https://www.linkedin.com/in/mateuswinters");
    expect(site.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]+$/);
  });
});

describe("experience", () => {
  const keys = experience.flatMap((group) => [group.key, ...group.projects.map((project) => project.key)]);

  it.each([
    ["en", en],
    ["pt", pt],
  ])("has a role and a summary for every entry in %s", (_, messages) => {
    const items = messages.Experience.items as Record<string, { role: string; summary: string }>;
    for (const key of keys) {
      expect(items[key]?.role).toBeTruthy();
      expect(items[key]?.summary).toBeTruthy();
    }
  });

  it("highlights AI-assisted engineering at Code Script", () => {
    const codescript = experience.find((group) => group.key === "codescript");
    const highlighted = codescript?.projects.filter((project) => project.highlight) ?? [];
    expect(highlighted.map((project) => project.key)).toEqual(["ai"]);
    expect(highlighted[0].tags).toContain("Claude Code");
  });
});

describe("formatPeriod", () => {
  it("formats month ranges in English", () => {
    expect(formatPeriod("2020-11", "2021-04", "Present", "en")).toBe("Nov 2020 — Apr 2021");
  });

  it("formats month ranges in Portuguese and an open end", () => {
    expect(formatPeriod("2021-09", null, "Atual", "pt")).toBe("set de 2021 — Atual");
  });

  it("keeps plain years as they are", () => {
    expect(formatPeriod("2018", "2021", "Present", "en")).toBe("2018 — 2021");
  });
});
