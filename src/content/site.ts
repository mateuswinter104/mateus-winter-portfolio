import type { AppLocale } from "@/i18n/routing";

export const site = {
  name: "Mateus Winter",
  firstName: "Mateus",
  lastName: "Winter",
  email: "mateuswinter2002@gmail.com",
  timeZone: "America/Sao_Paulo",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    github: "https://github.com/mateuswinter104",
    linkedin: "https://www.linkedin.com/in/mateuswinters",
  },
} as const;

export const cvFiles: Partial<Record<AppLocale, string>> = {
  en: "/cv/mateus-winter-cv-en.pdf",
};

export const sections = {
  work: "work",
  about: "about",
  experience: "experience",
  faq: "faq",
  contact: "contact",
} as const;

export const navItems = [
  { id: sections.work, key: "work" },
  { id: sections.about, key: "about" },
  { id: sections.experience, key: "experience" },
  { id: sections.faq, key: "faq" },
] as const;

export const typingWords = [
  "Next.js",
  "React.js",
  "TypeScript",
  "React Native",
  "Laravel/Node.js",
  "Figma",
  "Git",
] as const;

export const aboutStats = [
  { key: "years", value: "5+" },
  { key: "projects", value: "11" },
  { key: "apps", value: "4" },
  { key: "commits", value: "1,000+" },
] as const;

export function cvFor(locale: AppLocale) {
  return cvFiles[locale] ?? (cvFiles.en as string);
}

export function availableCvs() {
  return (Object.entries(cvFiles) as [AppLocale, string][]).map(([locale, href]) => ({ locale, href }));
}
