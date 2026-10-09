import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProject, mobileShots, projects } from "@/content/projects";
import { sections } from "@/content/site";
import { assetExists } from "@/lib/assets";
import { Shot } from "@/components/home/shot";
import { SectionLink } from "@/components/layout/section-link";
import { Magnetic } from "@/components/motion/magnetic";
import { FadeIn, SplitReveal } from "@/components/motion/split-reveal";
import { ArchitectureDiagram } from "@/components/project/architecture-diagram";
import { HorizontalGallery } from "@/components/project/horizontal-gallery";
import { Stats } from "@/components/project/stats";
import { RollText, pillClassName } from "@/components/ui/pill";

export const instant = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const t = await getTranslations("Project");
  const locale = await rootLocale();

  return {
    title: project.name,
    description: t(`${slug}.tagline`),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        "pt-BR": `/pt/projects/${slug}`,
      },
    },
    openGraph: {
      title: project.name,
      description: t(`${slug}.tagline`),
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const locale = await rootLocale();
  const t = await getTranslations("Project");
  const work = await getTranslations("Work");
  const shotName = await getTranslations("Shots");
  const { default: Content } = await import(`@/content/projects/${slug}/${locale}.mdx`);
  const alt = work(`projects.${slug}.imageAlt`);

  const galleryShots = [...project.shots, mobileShots.home, mobileShots.catalog];
  const gallery = galleryShots.map((shot) => ({
    portrait: shot.height > shot.width,
    key: shot.src,
    label: shotName(shot.label),
    node: <Shot shot={shot} available={assetExists(shot.src)} alt={`${alt} — ${shotName(shot.label)}`} sizes="(min-width: 768px) 60vw, 86vw" />,
  }));

  const meta = [
    { label: t("role"), value: t(`${slug}.role`) },
    { label: t("timeline"), value: t(`${slug}.timeline`) },
    { label: t("stack"), value: project.stack.join(" · ") },
  ];

  return (
    <article>
      <header className="gutter pt-28 pb-12 md:pt-36 md:pb-20">
        <Link href="/" className="text-roll-trigger label inline-flex items-center gap-2 text-foreground">
          <ArrowLeft className="size-3.5" aria-hidden />
          <RollText>{t("back")}</RollText>
        </Link>

        <div className="mt-12 flex items-center gap-4">
          <span className="label text-foreground">{t("caseStudy")}</span>
          <span aria-hidden className="rule-dotted h-px flex-1" />
          <span className="label">/{project.year}</span>
        </div>

        <SplitReveal as="h1" text={t(`${slug}.title`)} className="display mt-8 text-[22vw] leading-[0.82] md:text-[15vw]" />

        <FadeIn delay={0.2} className="mt-10 grid gap-10 md:grid-cols-12">
          <p className="text-2xl leading-snug text-balance md:col-span-7 md:text-4xl">{t(`${slug}.tagline`)}</p>
          <div className="flex flex-wrap content-start gap-2 md:col-span-4 md:col-start-9 md:justify-end">
            {project.links.live ? (
              <Magnetic>
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className={pillClassName("solid")}>
                  <RollText>{work("liveDemo")}</RollText>
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </Magnetic>
            ) : null}
            {project.links.code ? (
              <Magnetic>
                <a href={project.links.code} target="_blank" rel="noopener noreferrer" className={pillClassName("outline")}>
                  <RollText>{work("code")}</RollText>
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </Magnetic>
            ) : null}
          </div>
        </FadeIn>

        <dl className="mt-14 grid gap-6 border-t border-line pt-6 md:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label} className="space-y-2">
              <dt className="label">{item.label}</dt>
              <dd className="text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <HorizontalGallery items={gallery} label={t("gallery")} hint={t("galleryHint")} />

      <div className="gutter grid gap-10 py-20 md:grid-cols-12 md:py-32">
        <aside className="hidden md:col-span-3 md:block">
          <div className="sticky top-28 space-y-3">
            <p className="label text-foreground">{project.name}</p>
            <p className="label">{work(`projects.${slug}.category`)}</p>
          </div>
        </aside>
        <div className="case-body md:col-span-8 md:col-start-5">
          <Content components={{ ArchitectureDiagram, Stats }} />
        </div>
      </div>

      <footer className="gutter border-t border-line py-20 md:py-28">
        <p className="label">{t("next")}</p>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <SectionLink section={sections.contact} className="display text-[12vw] leading-[0.85] md:text-[7vw]">
            {t("talk")}
          </SectionLink>
          <Link href="/" className={pillClassName("outline")}>
            <ArrowLeft className="size-4" aria-hidden />
            <RollText>{t("back")}</RollText>
          </Link>
        </div>
      </footer>
    </article>
  );
}
