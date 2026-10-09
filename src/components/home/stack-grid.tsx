import { getTranslations } from "next-intl/server";
import { stack } from "@/content/stack";
import { SectionLabel } from "./section-label";

export async function StackGrid() {
  const t = await getTranslations("Stack");

  return (
    <section aria-label={t("title")} className="gutter py-16 md:py-24">
      <SectionLabel index="02" label={t("label")} />
      <h2 className="sr-only">{t("title")}</h2>
      <ul className="mt-10 grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-6">
        {stack.map(({ name, icon: Icon }) => (
          <li
            key={name}
            className="group relative flex aspect-[4/3] flex-col items-center justify-center gap-4 border-r border-b border-line transition-colors duration-500 hover:bg-foreground hover:text-background"
          >
            <Icon className="size-7 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 md:size-8" aria-hidden />
            <span className="label transition-colors duration-500 group-hover:text-background">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
