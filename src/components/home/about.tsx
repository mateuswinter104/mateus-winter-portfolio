import { getTranslations } from "next-intl/server";
import { aboutStats, sections } from "@/content/site";
import { assetExists, portraitPath } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { Orb } from "@/components/motion/orb";
import { FadeIn } from "@/components/motion/split-reveal";
import { WordReveal } from "@/components/motion/word-reveal";
import { AboutPhoto } from "./about-photo";
import { SectionLabel } from "./section-label";

export async function About() {
  const t = await getTranslations("About");
  const hasPhoto = assetExists(portraitPath);

  return (
    <section id={sections.about} aria-label={t("label")} className="gutter scroll-mt-20 py-24 md:py-36">
      <SectionLabel index="01" label={t("label")} />

      <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          {hasPhoto ? (
            <div className="md:sticky md:top-28">
              <AboutPhoto src={portraitPath} alt={t("photoAlt")} />
            </div>
          ) : (
            <div className="hidden md:sticky md:top-28 md:block">
              <Orb className="w-3/4" rotate={-30} />
            </div>
          )}
        </div>

        <div className="space-y-12 md:col-span-8 md:space-y-16">
          <WordReveal
            text={t("lead")}
            className="display-tight text-[2.1rem] leading-[1.02] text-balance md:text-5xl lg:text-[4.25rem]"
          />

          <FadeIn className="grid gap-6 text-muted-foreground md:grid-cols-2 md:gap-10 md:text-lg">
            <p>{t("body")}</p>
            <p className="text-foreground">{t("ai")}</p>
          </FadeIn>

          <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
            {aboutStats.map((stat, index) => (
              <FadeIn
                key={stat.key}
                delay={index * 0.08}
                className={cn(
                  "flex flex-col-reverse gap-2 border-line py-6 pr-4",
                  index % 2 === 1 ? "pl-4 md:pl-6" : "md:pl-6",
                  index > 0 ? "md:border-l" : "md:pl-0",
                  index % 2 === 1 ? "border-l" : "",
                  index > 1 ? "border-t md:border-t-0" : "",
                )}
              >
                <dt className="label">{t(`stats.${stat.key}`)}</dt>
                <dd className="display text-5xl md:text-6xl">{stat.value}</dd>
              </FadeIn>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
