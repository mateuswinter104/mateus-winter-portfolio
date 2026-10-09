import { ArrowDownRight, Download } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import type { AppLocale } from "@/i18n/routing";
import { cvFor, sections, site, typingWords } from "@/content/site";
import { HackerTyping } from "@/components/motion/hacker-typing";
import { Magnetic } from "@/components/motion/magnetic";
import { Spotlight } from "@/components/motion/spotlight";
import { VariableWordmark } from "@/components/motion/variable-wordmark";
import { PillAnchor } from "@/components/ui/pill";

const socialClass =
  "inline-flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:bg-foreground hover:text-background";

export async function Hero() {
  const t = await getTranslations("Hero");
  const locale = (await getLocale()) as AppLocale;

  return (
    <section
      id="top"
      className="gutter relative isolate flex min-h-svh flex-col justify-between gap-10 overflow-hidden pt-24 pb-8 md:pt-28"
    >
      <Spotlight />

      <div className="relative flex items-start justify-between gap-6">
        <ul className="label space-y-2.5 leading-tight">
          <li className="text-foreground">{t("role")}</li>
          <li>{t("focus")}</li>
          <li>{t("location")}</li>
        </ul>
        <div className="flex flex-col items-end gap-3">
          <span className="label hidden sm:block">{t("social")}</span>
          <div className="flex gap-2">
            <Magnetic>
              <a href={site.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={socialClass}>
                <FaGithub className="size-4" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={socialClass}>
                <FaLinkedinIn className="size-4" aria-hidden />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <VariableWordmark
        words={[site.firstName, site.lastName]}
        label={`${site.name} — ${t("role")}`}
        className="relative -mx-[0.02em] text-[25.5vw] md:text-[13.6vw]"
      />

      <div className="relative grid items-end gap-8 md:grid-cols-12">
        <div className="space-y-6 md:col-span-6">
          <HackerTyping words={typingWords} prefix={t("typingPrefix")} srText={t("stackSr")} />
          <a href={`#${sections.work}`} className="label hidden items-center gap-2 md:inline-flex">
            <ArrowDownRight className="size-3.5 animate-bounce" aria-hidden />
            {t("scroll")}
          </a>
        </div>
        <div className="space-y-6 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <p className="text-base text-balance text-muted-foreground md:text-lg">{t("intro")}</p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <PillAnchor href={`#${sections.work}`} icon={<ArrowDownRight className="size-4" aria-hidden />}>
                {t("ctaWork")}
              </PillAnchor>
            </Magnetic>
            <Magnetic>
              <PillAnchor href={cvFor(locale)} download variant="outline" icon={<Download className="size-4" aria-hidden />}>
                {t("ctaCv")}
              </PillAnchor>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
