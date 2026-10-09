import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RollText, pillClassName } from "@/components/ui/pill";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="gutter flex min-h-svh flex-col justify-end gap-10 pt-28 pb-16">
      <p className="label">404</p>
      <h1 className="display text-[30vw] leading-[0.8] md:text-[18vw]">{t("title")}</h1>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="max-w-md text-muted-foreground md:text-lg">{t("body")}</p>
        <Link href="/" className={pillClassName("solid")}>
          <ArrowLeft className="size-4" aria-hidden />
          <RollText>{t("cta")}</RollText>
        </Link>
      </div>
    </section>
  );
}
