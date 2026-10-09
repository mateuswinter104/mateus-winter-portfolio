"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const names: Record<AppLocale, string> = {
  en: "English",
  pt: "Português",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className={cn("flex items-center font-mono text-xs tracking-[0.14em] uppercase", className)}>
      {routing.locales.map((item, index) => (
        <span key={item} className="flex items-center">
          {index > 0 ? <span aria-hidden className="px-1.5 text-faint">/</span> : null}
          {item === locale ? (
            <span aria-current="true" className="text-foreground">
              {item}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={item}
              lang={item === "pt" ? "pt-BR" : "en"}
              aria-label={t("switchTo", { language: names[item] })}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
