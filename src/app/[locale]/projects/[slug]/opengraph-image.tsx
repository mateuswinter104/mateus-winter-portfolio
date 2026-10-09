import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { getProject, projects } from "@/content/projects";
import { loadDisplayFont, OG_SIZE, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study by Mateus Winter";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpenGraphImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  const t = await getTranslations({ locale, namespace: "Project" });
  const work = await getTranslations({ locale, namespace: "Work" });

  return new ImageResponse(
    <OgCard
      eyebrow={project ? `${t("caseStudy")} · ${work(`projects.${slug}.category`)}` : t("caseStudy")}
      title={project?.name ?? "Mateus Winter"}
      subtitle={project ? t(`${slug}.tagline`) : ""}
      footer={project?.stack.slice(0, 5).join(" · ") ?? ""}
    />,
    { ...OG_SIZE, fonts: [{ name: "Archivo Narrow", data: await loadDisplayFont(), weight: 700, style: "normal" }] },
  );
}
