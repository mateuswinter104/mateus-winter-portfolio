export type ProjectShot = {
  src: string;
  width: number;
  height: number;
  label: string;
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  stack: string[];
  links: {
    live?: string;
    code?: string;
  };
  cover: ProjectShot;
  shots: ProjectShot[];
  stats?: { key: "jest" | "playwright" | "phpunit"; value: number }[];
};

const graoShot = (file: string, width: number, height: number, label: string): ProjectShot => ({
  src: `/projects/grao-co/${file}`,
  width,
  height,
  label,
});

export const projects: Project[] = [
  {
    slug: "grao-co",
    name: "Grão & Co.",
    year: "2026",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Laravel 13", "Sanctum", "Jest", "Playwright", "PHPUnit"],
    links: {
      live: process.env.NEXT_PUBLIC_GRAO_DEMO_URL || undefined,
      code: "https://github.com/mateuswinter104/coffee-commerce",
    },
    cover: graoShot("home-dark.webp", 2400, 1500, "home"),
    shots: [
      graoShot("home-dark.webp", 2400, 1500, "home"),
      graoShot("catalog.webp", 2400, 1500, "catalog"),
      graoShot("product.webp", 2400, 1500, "product"),
      graoShot("home-light.webp", 2400, 1500, "light"),
      graoShot("login.webp", 2400, 1500, "login"),
      graoShot("account.webp", 2400, 1500, "account"),
    ],
    stats: [
      { key: "jest", value: 121 },
      { key: "playwright", value: 36 },
      { key: "phpunit", value: 39 },
    ],
  },
];

export const mobileShots = {
  home: graoShot("mobile-home.webp", 900, 1948, "mobileHome"),
  catalog: graoShot("mobile-catalog.webp", 900, 1948, "mobileCatalog"),
  menu: graoShot("mobile-menu.webp", 900, 1948, "mobileMenu"),
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return undefined;
  return projects[(index + 1) % projects.length];
}
