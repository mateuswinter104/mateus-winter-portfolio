import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { site } from "@/content/site";
import { introScript } from "@/hooks/use-intro";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ScrollReset } from "@/components/layout/scroll-reset";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Preloader } from "@/components/motion/preloader";
import { Cursor } from "@/components/motion/cursor";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  const locale = await rootLocale();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("title"),
      template: `%s — ${site.name}`,
    },
    description: t("description"),
    authors: [{ name: site.name, url: site.social.linkedin }],
    creator: site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        "pt-BR": "/pt",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: t("title"),
      description: t("description"),
      locale: locale === "pt" ? "pt_BR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const noscriptStyles = "[data-reveal]{transform:none!important;opacity:1!important}";

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations("Nav");

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{noscriptStyles}</style>
        </noscript>
      </head>
      <body className="min-h-svh">
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#content"
              className="sr-only z-[110] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
              {t("skip")}
            </a>
            <SmoothScroll />
            <ScrollReset />
            <Preloader />
            <Cursor />
            <ScrollProgress />
            <Header />
            <main id="content">{children}</main>
            <Footer />
            <div aria-hidden className="grain" />
            <Toaster position="bottom-center" />
          </Providers>
        </NextIntlClientProvider>
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
