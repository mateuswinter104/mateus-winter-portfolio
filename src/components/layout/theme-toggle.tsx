"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      data-testid="theme-toggle"
      aria-label={t("themeToggle")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full border border-line transition-colors hover:bg-foreground hover:text-background",
        className,
      )}
    >
      <Sun className="size-4 transition-transform duration-500 dark:-translate-y-8 dark:rotate-90" aria-hidden />
      <Moon
        className="absolute size-4 translate-y-8 -rotate-90 transition-transform duration-500 dark:translate-y-0 dark:rotate-0"
        aria-hidden
      />
    </button>
  );
}
