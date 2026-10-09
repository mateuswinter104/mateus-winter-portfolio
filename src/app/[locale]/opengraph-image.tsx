import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import { loadDisplayFont, OG_SIZE, OgCard } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Mateus Winter — Full-stack Developer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const hero = await getTranslations({ locale, namespace: "Hero" });

  return new ImageResponse(
    <OgCard eyebrow={t("ogTagline")} title={site.name} subtitle={hero("intro")} footer="github.com/mateuswinter104" />,
    { ...OG_SIZE, fonts: [{ name: "Archivo Narrow", data: await loadDisplayFont(), weight: 700, style: "normal" }] },
  );
}
