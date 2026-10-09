import { getTranslations } from "next-intl/server";
import { About } from "@/components/home/about";
import { Hero } from "@/components/home/hero";
import { StackGrid } from "@/components/home/stack-grid";
import { Marquee } from "@/components/motion/marquee";

export default async function HomePage() {
  const t = await getTranslations("Marquee");

  return (
    <>
      <Hero />
      <Marquee items={t.raw("items") as string[]} label={t("label")} />
      <About />
      <StackGrid />
    </>
  );
}
