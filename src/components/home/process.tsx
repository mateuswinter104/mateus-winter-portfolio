import { getTranslations } from "next-intl/server";
import { Orb } from "@/components/motion/orb";
import { SplitReveal } from "@/components/motion/split-reveal";
import { SectionLabel } from "./section-label";

type Step = { title: string; kicker: string; body: string };

export async function Process() {
  const t = await getTranslations("Process");
  const steps = t.raw("steps") as Step[];

  return (
    <section aria-label={t("title")} className="gutter py-24 md:py-36">
      <SectionLabel index="04" label={t("label")} />
      <SplitReveal text={t("title")} className="display mt-10 max-w-[14ch] text-[15vw] md:text-[8vw]" />

      <ol className="mt-12 space-y-6 md:mt-16">
        {steps.map((step, index) => (
          <li
            key={step.title}
            data-testid="process-card"
            className="sticky"
            style={{ top: `calc(5.25rem + ${index * 1.4}rem)` }}
          >
            <article className="relative grid min-h-[68svh] gap-8 overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-[0_-24px_60px_-40px_rgb(0_0_0/0.5)] md:min-h-[70vh] md:grid-cols-12 md:p-12">
              <div className="flex flex-col justify-between gap-10 md:col-span-7">
                <div className="flex items-center gap-4">
                  <span className="label shrink-0 text-foreground">
                    {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="rule-dotted h-px flex-1" />
                  <span className="label text-right">{step.kicker}</span>
                </div>
                <h3 className="display text-[21vw] leading-[0.8] md:text-[10.5vw]">{step.title}</h3>
              </div>
              <div className="flex flex-col items-start justify-between gap-8 md:col-span-5 md:items-end">
                <Orb className="w-32 md:w-56 lg:w-64" rotate={index * 75} />
                <p className="max-w-md text-muted-foreground md:text-right md:text-lg">{step.body}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
