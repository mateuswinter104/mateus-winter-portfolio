import { existsSync } from "node:fs";
import { join } from "node:path";
import en from "../../messages/en.json";
import pt from "../../messages/pt.json";
import { getNextProject, getProject, mobileShots, projects } from "@/content/projects";
import { routing } from "@/i18n/routing";

const root = join(__dirname, "..", "..");

describe("projects", () => {
  it("use unique slugs", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(projects.map((project) => [project.slug]))("%s has a case study in every locale", (slug) => {
    for (const locale of routing.locales) {
      expect(existsSync(join(root, "src", "content", "projects", slug, `${locale}.mdx`))).toBe(true);
    }
  });

  it.each(projects.map((project) => [project.slug]))("%s has copy for the card and the case study in both languages", (slug) => {
    for (const messages of [en, pt]) {
      const work = (messages.Work.projects as Record<string, Record<string, string>>)[slug];
      const project = (messages.Project as unknown as Record<string, Record<string, string>>)[slug];
      expect(work.category && work.summary && work.imageAlt).toBeTruthy();
      expect(project.title && project.tagline && project.role && project.timeline).toBeTruthy();
    }
  });

  it("ship every screenshot they reference", () => {
    const shots = [...projects.flatMap((project) => [project.cover, ...project.shots]), ...Object.values(mobileShots)];
    const missing = shots.filter((shot) => !existsSync(join(root, "public", shot.src)));
    expect(missing).toEqual([]);
  });

  it("label every screenshot in both languages", () => {
    const shots = [...projects.flatMap((project) => project.shots), ...Object.values(mobileShots)];
    for (const shot of shots) {
      expect((en.Shots as Record<string, string>)[shot.label]).toBeTruthy();
      expect((pt.Shots as Record<string, string>)[shot.label]).toBeTruthy();
    }
  });

  it("keep the Grão & Co. test count in the copy in sync with the stats", () => {
    const total = (getProject("grao-co")?.stats ?? []).reduce((sum, stat) => sum + stat.value, 0);
    expect(en.Project["grao-co"].tagline).toContain(String(total));
    expect(pt.Project["grao-co"].tagline).toContain(String(total));
    expect(en.Work.projects["grao-co"].summary).toContain(String(total));
    expect(pt.Work.projects["grao-co"].summary).toContain(String(total));
  });

  it("only link to HTTPS destinations", () => {
    for (const project of projects) {
      for (const link of Object.values(project.links).filter(Boolean)) {
        expect(link).toMatch(/^https:\/\//);
      }
    }
  });

  it("returns undefined for unknown slugs and when there is nothing next", () => {
    expect(getProject("nope")).toBeUndefined();
    expect(getNextProject("nope")).toBeUndefined();
  });
});
