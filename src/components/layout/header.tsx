"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { navItems, sections } from "@/content/site";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";
import { RollText, pillClassName } from "@/components/ui/pill";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { SectionLink } from "./section-link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const t = useTranslations("Nav");
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 24);
    setHidden(current > 320 && current > previous + 2);
    if (current < previous - 2) setHidden(false);
  });

  return (
    <motion.header
      className={cn(
        "gutter fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-border bg-background/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="text-roll-trigger justify-self-start font-medium tracking-tight" aria-label={t("home")}>
          <RollText>Mateus Winter</RollText>
        </Link>

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm">
            {navItems.map((item) => (
              <li key={item.id}>
                <SectionLink section={item.id} className="text-roll-trigger text-muted-foreground transition-colors hover:text-foreground">
                  <RollText>{t(item.key)}</RollText>
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <Magnetic className="hidden md:inline-flex" strength={0.3}>
            <SectionLink section={sections.contact} className={pillClassName("solid", "h-10")}>
              <RollText>{t("contact")}</RollText>
            </SectionLink>
          </Magnetic>
          <MobileNav />
        </div>
      </div>
    </motion.header>
  );
}
