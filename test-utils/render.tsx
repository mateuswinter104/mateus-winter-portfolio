import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import en from "../messages/en.json";
import pt from "../messages/pt.json";

const catalogs = { en, pt } as unknown as Record<"en" | "pt", AbstractIntlMessages>;

type IntlRenderOptions = Omit<RenderOptions, "wrapper"> & {
  locale?: "en" | "pt";
};

export function renderWithIntl(ui: ReactElement, { locale = "en", ...options }: IntlRenderOptions = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale={locale} messages={catalogs[locale]} timeZone="America/Sao_Paulo">
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });
}

export { en as messagesEn, pt as messagesPt };
