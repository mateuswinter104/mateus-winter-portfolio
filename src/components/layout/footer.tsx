import { getTranslations } from "next-intl/server";
import { availableCvs, navItems, sections, site } from "@/content/site";
import { FollowOrb } from "@/components/motion/orb";
import { RollText } from "@/components/ui/pill";
import { BackToTop } from "./back-to-top";
import { LocalClock } from "./local-clock";
import { SectionLink } from "./section-link";

const linkClass = "text-roll-trigger text-muted-foreground transition-colors hover:text-foreground";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const contact = await getTranslations("Contact");
  const cvs = availableCvs();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="gutter relative grid gap-12 pt-16 pb-10 md:grid-cols-12">
        <div className="space-y-4 md:col-span-4">
          <p className="label">{t("localTime")}</p>
          <LocalClock timeZone={site.timeZone} />
          <p className="max-w-xs text-sm text-muted-foreground">{t("built")}</p>
        </div>

        <nav aria-label={t("navigation")} className="space-y-4 md:col-span-2 md:col-start-6">
          <p className="label">{t("navigation")}</p>
          <ul className="space-y-2 text-sm">
            {[...navItems, { id: sections.contact, key: "contact" as const }].map((item) => (
              <li key={item.id}>
                <SectionLink section={item.id} className={linkClass}>
                  <RollText>{nav(item.key)}</RollText>
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4 md:col-span-2">
          <p className="label">{t("social")}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={site.social.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <RollText>GitHub</RollText>
              </a>
            </li>
            <li>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <RollText>LinkedIn</RollText>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className={linkClass}>
                <RollText>E-mail</RollText>
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4 md:col-span-2">
          <p className="label">{t("resources")}</p>
          <ul className="space-y-2 text-sm">
            {cvs.map((cv) => (
              <li key={cv.locale}>
                <a href={cv.href} download className={linkClass}>
                  <RollText>{cv.locale === "pt" ? contact("cvPt") : contact("cvEn")}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start md:col-span-1 md:justify-end">
          <BackToTop label={t("backToTop")} />
        </div>
      </div>

      <div className="gutter relative pb-6">
        <FollowOrb className="pointer-events-none absolute right-[8%] bottom-[30%] w-[22vw] max-w-72 min-w-28 opacity-90" rotate={-20} />
        <p aria-hidden className="display relative text-[17.5vw] leading-[0.8] md:text-[14.2vw]">
          Mateus Winter
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <span className="label">{t("rights")}</span>
          <span className="label">React · Next.js · TypeScript · Laravel/Node</span>
        </div>
      </div>
    </footer>
  );
}
