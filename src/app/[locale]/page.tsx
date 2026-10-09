import { getTranslations } from "next-intl/server";
import { About } from "@/components/home/about";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { SelectedWork } from "@/components/home/selected-work";
import { Services } from "@/components/home/services";
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
      <SelectedWork />
      <Process />
      <Services />
      <Experience />
    </>
  );
}
