import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const LAST_UPDATE = new Date("2026-10-08");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...projects.map((project) => `/projects/${project.slug}`)];

  return paths.flatMap((path) =>
    (["en", "pt"] as const).map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: LAST_UPDATE,
      changeFrequency: "monthly" as const,
      priority: path ? 0.8 : 1,
      alternates: {
        languages: {
          en: `${site.url}/en${path}`,
          "pt-BR": `${site.url}/pt${path}`,
        },
      },
    })),
  );
}
