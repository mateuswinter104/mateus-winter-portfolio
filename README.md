# Mateus Winter — Portfolio

Personal portfolio of Mateus Winter, a full-stack developer with a front-end and UI/UX focus. Bilingual (English and Portuguese), black and white, and built around motion: a variable-font wordmark that reacts to the cursor, a "hacker" typing line, a custom cursor with magnetic buttons, stacked cards, scroll-driven reveals and a horizontal case-study gallery.

## Stack

- **Next.js 16** (App Router, Cache Components, Partial Prerendering) and **React 19**
- **TypeScript**, **Tailwind CSS 4** and **shadcn/ui** (Radix)
- **next-intl** for `en` / `pt` routing with `next/root-params`
- **Motion** and **Lenis** for animation and smooth scrolling
- **MDX** for case studies
- **Jest** + Testing Library and **Playwright** + axe for tests

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 — the proxy redirects to `/en` or `/pt` based on the browser language.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata, the sitemap and OG images |
| `NEXT_PUBLIC_GRAO_DEMO_URL` | Live demo of Grão & Co.; the "Live demo" buttons only appear when it is set |

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route type generation + `tsc --noEmit` |
| `npm test` | Jest unit and component tests |
| `npm run test:e2e` | Playwright on desktop, mobile and reduced-motion projects |

## Project structure

```
messages/            en.json and pt.json — every string on the site
src/app/[locale]/    root layout, home, case study route, OG images, 404
src/components/
  home/              page sections (hero, about, work, process, experience, FAQ, contact)
  motion/            preloader, cursor, magnetic, variable wordmark, typing, reveals, orb
  project/           case-study gallery, architecture diagram, stats
src/content/         typed site data, experience, stack, projects and MDX case studies
src/proxy.ts         locale routing and real 404s for unknown projects
e2e/                 Playwright specs
__tests__/           Jest specs
```

## Accessibility and motion

Every effect respects `prefers-reduced-motion`; pointer effects only run with a fine pointer, so touch devices get scroll-driven motion instead. Animated text always keeps its full content in the DOM, and the Playwright suite runs axe against every page.

## Adding a project

1. Add an entry to `src/content/projects.ts` and its screenshots to `public/projects/<slug>/`.
2. Write `src/content/projects/<slug>/en.mdx` and `pt.mdx`.
3. Add the card and case-study copy under `Work.projects.<slug>` and `Project.<slug>` in both message files.

The Jest suite fails if a locale, a screenshot or a translation is missing.
