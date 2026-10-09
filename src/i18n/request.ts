import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale: override }) => {
  const candidate = override ?? (await rootLocale());

  if (!hasLocale(routing.locales, candidate)) {
    notFound();
  }

  return {
    locale: candidate,
    messages: (await import(`../../messages/${candidate}.json`)).default,
    timeZone: "America/Sao_Paulo",
  };
});
