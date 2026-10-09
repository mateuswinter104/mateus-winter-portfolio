import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { mobileShots, projects } from "@/content/projects";
import { availableCvs, sections, site } from "@/content/site";
import { assetExists } from "@/lib/assets";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitReveal } from "@/components/motion/split-reveal";
import { RollText } from "@/components/ui/pill";
import { CopyEmail } from "./copy-email";
import { FanCards } from "./fan-cards";
import { SectionLabel } from "./section-label";
import { Shot } from "./shot";

const linkClass = "text-roll-trigger text-lg transition-colors hover:text-muted-foreground";

export async function Contact() {
  const t = await getTranslations("Contact");
  const work = await getTranslations("Work");
  const shotName = await getTranslations("Shots");
  const cvs = availableCvs();
  const project = projects[0];
  const alt = work(`projects.${project.slug}.imageAlt`);
  const fan = [mobileShots.catalog, mobileShots.home, mobileShots.menu].map((shot) => ({
    key: shot.src,
    node: <Shot shot={shot} available={assetExists(shot.src)} alt={`${alt} — ${shotName(shot.label)}`} sizes="260px" />,
  }));

  return (
    <section id={sections.contact} aria-label={t("title")} className="gutter scroll-mt-20 py-24 md:py-40">
      <SectionLabel index="08" label={t("label")} />

      <div className="mt-14 grid items-center gap-12 md:mt-20 md:grid-cols-12">
        <div className="flex flex-wrap items-end gap-6 md:col-span-8 md:gap-10">
          <a href={`mailto:${site.email}`} data-cursor={t("sayHi")} className="block">
            <SplitReveal as="h2" text={t("title")} className="display text-[19vw] leading-[0.82] md:text-[10.5vw]" />
          </a>
          <Magnetic strength={0.5}>
            <a
              href={`mailto:${site.email}`}
              aria-label={site.email}
              className="group inline-flex size-20 items-center justify-center rounded-full bg-foreground text-background md:size-32"
            >
              <ArrowUpRight className="size-8 transition-transform duration-500 group-hover:rotate-45 md:size-12" aria-hidden />
            </a>
          </Magnetic>
        </div>
        <div className="md:col-span-4">
          <FanCards cards={fan} />
        </div>
      </div>

      <div className="mt-16 grid gap-10 border-t border-line pt-8 md:grid-cols-12">
        <div className="space-y-4 md:col-span-6">
          <p className="label">E-mail</p>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="text-xl font-medium tracking-tight break-all underline-offset-8 hover:underline sm:text-2xl md:text-3xl"
            >
              {site.email}
            </a>
            <CopyEmail email={site.email} />
          </div>
          <p className="max-w-md text-muted-foreground">{t("body")}</p>
        </div>
        <div className="space-y-4 md:col-span-3">
          <p className="label">LinkedIn · GitHub</p>
          <ul className="space-y-2">
            <li>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <RollText>in/mateuswinters ↗</RollText>
              </a>
            </li>
            <li>
              <a href={site.social.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <RollText>github.com/mateuswinter104 ↗</RollText>
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4 md:col-span-3">
          <p className="label">{t("cv")}</p>
          <ul className="space-y-2">
            {cvs.map((cv) => (
              <li key={cv.locale}>
                <a href={cv.href} download data-testid={`cv-${cv.locale}`} className={linkClass}>
                  <RollText>{cv.locale === "pt" ? t("cvPt") : t("cvEn")} ↓</RollText>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
