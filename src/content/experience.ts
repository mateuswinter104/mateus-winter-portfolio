export type ExperienceKey =
  | "codescript"
  | "myfleet"
  | "ai"
  | "govtech"
  | "ifdc"
  | "design"
  | "orni"
  | "qi";

export type ExperienceProject = {
  key: ExperienceKey;
  tags: string[];
  highlight?: boolean;
};

export type ExperienceGroup = {
  key: ExperienceKey;
  company: string;
  start: string;
  end: string | null;
  remote?: boolean;
  projects: ExperienceProject[];
};

export const experience: ExperienceGroup[] = [
  {
    key: "codescript",
    company: "Code Script Technology",
    start: "2021-09",
    end: null,
    remote: true,
    projects: [
      { key: "myfleet", tags: ["Next.js", "Mapbox", "ECharts", "React Native", "Laravel", "Claude Code"] },
      { key: "ai", tags: ["Claude Code", "MCP", "Skills", "Hooks"], highlight: true },
      { key: "govtech", tags: ["Next.js", "TypeScript", "React Hook Form", "React-PDF"] },
      { key: "ifdc", tags: ["React", "TypeScript"] },
      { key: "design", tags: ["Figma", "Design systems", "UX"] },
    ],
  },
  {
    key: "orni",
    company: "Orni",
    start: "2020-11",
    end: "2021-04",
    projects: [],
  },
  {
    key: "qi",
    company: "QI Faculdade & Escola Técnica",
    start: "2018",
    end: "2021",
    projects: [],
  },
];

export function formatPeriod(start: string, end: string | null, present: string, locale: string) {
  const format = (value: string) => {
    if (!value.includes("-")) return value;
    const [year, month] = value.split("-").map(Number);
    return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
      .format(new Date(Date.UTC(year, month - 1, 1)))
      .replace(".", "");
  };

  return `${format(start)} — ${end ? format(end) : present}`;
}
