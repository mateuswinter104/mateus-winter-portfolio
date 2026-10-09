import { getTranslations } from "next-intl/server";
import { sections } from "@/content/site";
import { SplitReveal } from "@/components/motion/split-reveal";
import { FaqList } from "./faq-list";
import { SectionLabel } from "./section-label";

type FaqItem = { q: string; a: string };

export async function Faq() {
  const t = await getTranslations("Faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id={sections.faq} aria-label={t("title")} className="gutter scroll-mt-20 py-24 md:py-36">
      <SectionLabel index="07" label={t("label")} />
      <div className="mt-10 grid gap-12 md:grid-cols-12">
        <SplitReveal text={t("title")} className="display self-start text-[12vw] md:sticky md:top-28 md:col-span-5 md:text-[5.6vw]" />
        <div className="md:col-span-7">
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
