import { getTranslations } from "next-intl/server";
import { mobileShots, projects } from "@/content/projects";
import { assetExists } from "@/lib/assets";
import { SectionLabel } from "./section-label";
import { PhoneFrame, Shot } from "./shot";
import { WhatIDoList } from "./what-i-do";

type Service = { title: string; body: string };

const rateLimiter = `RateLimiter::for('login', function (Request $request) {
    $email = Str::lower((string) $request->input('email'));

    return Limit::perMinute(6)
        ->by($email.'|'.$request->ip());
});`;

function CodePreview({ caption }: { caption: string }) {
  return (
    <figure className="flex size-full flex-col justify-between gap-4 p-5 md:p-6">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full border border-line" />
        <span className="size-2.5 rounded-full border border-line" />
        <span className="size-2.5 rounded-full border border-line" />
        <span className="label ml-3">AppServiceProvider.php</span>
      </div>
      <pre className="overflow-x-auto font-mono text-[0.72rem] leading-relaxed text-foreground md:text-[0.8rem]">
        <code>{rateLimiter}</code>
      </pre>
      <figcaption className="label leading-relaxed normal-case tracking-normal">{caption}</figcaption>
    </figure>
  );
}

export async function Services() {
  const t = await getTranslations("Services");
  const work = await getTranslations("Work");
  const shotName = await getTranslations("Shots");
  const items = t.raw("items") as Service[];
  const project = projects[0];
  const alt = work(`projects.${project.slug}.imageAlt`);
  const catalog = project.shots[1];
  const light = project.shots[3];

  const previews = [
    <Shot key="front" shot={catalog} available={assetExists(catalog.src)} alt={`${alt} — ${shotName(catalog.label)}`} sizes="(min-width: 768px) 40vw, 90vw" />,
    <PhoneFrame key="mobile">
      <Shot
        shot={mobileShots.home}
        available={assetExists(mobileShots.home.src)}
        alt={`${alt} — ${shotName(mobileShots.home.label)}`}
        sizes="200px"
      />
    </PhoneFrame>,
    <CodePreview key="back" caption={t("codeCaption")} />,
    <Shot key="design" shot={light} available={assetExists(light.src)} alt={`${alt} — ${shotName(light.label)}`} sizes="(min-width: 768px) 40vw, 90vw" />,
  ];

  return (
    <section aria-label={t("title")} className="gutter py-24 md:py-36">
      <SectionLabel index="05" label={t("label")} />
      <h2 className="sr-only">{t("title")}</h2>
      <WhatIDoList items={items} previews={previews} />
    </section>
  );
}
