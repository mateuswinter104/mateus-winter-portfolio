import { getTranslations } from "next-intl/server";
import { mobileShots, projects } from "@/content/projects";
import { sections } from "@/content/site";
import { assetExists } from "@/lib/assets";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ProjectFeature } from "./project-feature";
import { SectionLabel } from "./section-label";
import { PhoneFrame, Shot } from "./shot";

export async function SelectedWork() {
  const t = await getTranslations("Work");
  const shotName = await getTranslations("Shots");
  const project = projects[0];
  const [cover, catalog, product] = project.shots;
  const alt = t(`projects.${project.slug}.imageAlt`);

  const tiles = [
    {
      key: "cover",
      depth: 1,
      className: "col-span-12 aspect-[16/10] md:col-span-8",
      node: <Shot shot={cover} available={assetExists(cover.src)} alt={`${alt} — ${shotName(cover.label)}`} sizes="(min-width: 768px) 66vw, 100vw" />,
    },
    {
      key: "mobile",
      depth: 1.6,
      className: "col-span-5 aspect-[4/5] md:col-span-4 md:aspect-auto",
      node: (
        <PhoneFrame>
          <Shot
            shot={mobileShots.home}
            available={assetExists(mobileShots.home.src)}
            alt={`${alt} — ${shotName(mobileShots.home.label)}`}
            sizes="(min-width: 768px) 16vw, 30vw"
          />
        </PhoneFrame>
      ),
    },
    {
      key: "catalog",
      depth: 1.3,
      className: "col-span-7 aspect-[4/5] md:col-span-5 md:aspect-[4/3]",
      node: (
        <Shot
          shot={catalog}
          available={assetExists(catalog.src)}
          alt={`${alt} — ${shotName(catalog.label)}`}
          sizes="(min-width: 768px) 42vw, 58vw"
          className="object-left-top"
        />
      ),
    },
    {
      key: "product",
      depth: 0.8,
      className: "col-span-12 aspect-[16/9] md:col-span-7 md:aspect-auto",
      node: <Shot shot={product} available={assetExists(product.src)} alt={`${alt} — ${shotName(product.label)}`} sizes="(min-width: 768px) 58vw, 100vw" />,
    },
  ];

  return (
    <section id={sections.work} aria-label={t("title")} className="gutter scroll-mt-20 py-24 md:py-36">
      <SectionLabel index="03" label={t("label")} />
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <SplitReveal text={t("title")} className="display max-w-[12ch] text-[12.5vw] md:text-[9vw]" />
        <p className="label max-w-56 text-right">{t("more")}</p>
      </div>

      <ProjectFeature
        slug={project.slug}
        name={project.name}
        year={project.year}
        category={t(`projects.${project.slug}.category`)}
        summary={t(`projects.${project.slug}.summary`)}
        stack={project.stack}
        tiles={tiles}
        links={project.links}
        labels={{ viewCase: t("viewCase"), liveDemo: t("liveDemo"), code: t("code") }}
      />
    </section>
  );
}
