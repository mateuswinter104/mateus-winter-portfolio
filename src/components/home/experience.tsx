import { getLocale, getTranslations } from "next-intl/server";
import { experience, formatPeriod } from "@/content/experience";
import { sections } from "@/content/site";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ExperienceCard } from "./experience-card";
import { SectionLabel } from "./section-label";

export async function Experience() {
  const t = await getTranslations("Experience");
  const locale = await getLocale();

  return (
    <section id={sections.experience} aria-label={t("title")} className="gutter scroll-mt-20 py-24 md:py-36">
      <SectionLabel index="06" label={t("label")} />
      <div className="mt-10 grid items-end gap-6 md:grid-cols-12">
        <SplitReveal text={t("title")} className="display text-[13vw] md:col-span-8 md:text-[7.5vw]" />
        <p className="label leading-relaxed normal-case tracking-normal md:col-span-4 md:text-right">{t("noImages")}</p>
      </div>

      <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
        {experience.map((group) => (
          <article key={group.key} className="space-y-10">
            <header className="grid gap-4 border-t border-line pt-6 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-5">
                <h3 className="display-tight text-3xl md:text-5xl">{group.company}</h3>
                <p className="label mt-3 text-foreground">{t(`items.${group.key}.role`)}</p>
              </div>
              <p className="label md:col-span-3">
                {formatPeriod(group.start, group.end, t("present"), locale)}
                {group.remote ? ` · ${t("remote")}` : ""}
              </p>
              <p className="text-muted-foreground md:col-span-4 md:text-lg">{t(`items.${group.key}.summary`)}</p>
            </header>

            {group.projects.length > 0 ? (
              <ul className="grid gap-5 md:grid-cols-2 md:gap-x-10 md:gap-y-4 md:pb-28">
                {group.projects.map((project, index) => (
                  <ExperienceCard
                    key={project.key}
                    index={index}
                    title={t(`items.${project.key}.role`)}
                    summary={t(`items.${project.key}.summary`)}
                    tags={project.tags}
                    highlight={project.highlight}
                  />
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
