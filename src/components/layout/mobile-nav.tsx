"use client";

import { useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Dialog as SheetPrimitive } from "radix-ui";
import { usePathname } from "@/i18n/navigation";
import { navItems, sections, site } from "@/content/site";
import { LocaleSwitcher } from "./locale-switcher";
import { SectionLink } from "./section-link";
import { ThemeToggle } from "./theme-toggle";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MobileNav() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = [...navItems, { id: sections.contact, key: "contact" as const }];

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setOpen(false);
    if (pathname !== "/") return;
    event.preventDefault();
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }, 320);
  };

  return (
    <SheetPrimitive.Root open={open} onOpenChange={setOpen}>
      <SheetPrimitive.Trigger
        data-testid="mobile-menu-trigger"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-mono text-xs tracking-[0.14em] uppercase md:hidden"
      >
        {t("menu")}
        <span aria-hidden className="flex flex-col gap-1">
          <span className="block h-px w-4 bg-current" />
          <span className="block h-px w-4 bg-current" />
        </span>
      </SheetPrimitive.Trigger>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-[80] bg-background/60 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <SheetPrimitive.Content
          data-testid="mobile-menu"
          className="gutter fixed inset-0 z-[85] flex flex-col bg-background py-5 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-4 data-closed:animate-out data-closed:fade-out-0"
        >
          <div className="flex h-10 items-center justify-between">
            <SheetPrimitive.Title className="font-medium tracking-tight">Mateus Winter</SheetPrimitive.Title>
            <SheetPrimitive.Close className="inline-flex h-10 items-center rounded-full border border-line px-4 font-mono text-xs tracking-[0.14em] uppercase">
              {t("close")}
            </SheetPrimitive.Close>
          </div>
          <SheetPrimitive.Description className="sr-only">{t("primary")}</SheetPrimitive.Description>

          <nav aria-label={t("primary")} className="mt-auto">
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li key={item.id} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.08 + index * 0.06 }}
                  >
                    <SectionLink
                      section={item.id}
                      onClick={(event) => navigate(event, item.id)}
                      className="display flex items-baseline gap-3 text-[17vw] leading-[0.9]"
                    >
                      <span className="font-mono text-xs font-normal tracking-normal text-muted-foreground">
                        0{index + 1}
                      </span>
                      {t(item.key)}
                    </SectionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
            <LocaleSwitcher />
            <div className="flex items-center gap-3">
              <a href={site.social.github} target="_blank" rel="noopener noreferrer" className="label text-foreground">
                GitHub
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="label text-foreground">
                LinkedIn
              </a>
              <ThemeToggle />
            </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  );
}
