import type { ComponentType, SVGProps } from "react";
import { Drama } from "lucide-react";
import {
  SiClaude,
  SiExpo,
  SiFigma,
  SiGit,
  SiJest,
  SiLaravel,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export type StackItem = {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const stack: StackItem[] = [
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "React Native", icon: SiExpo },
  { name: "Laravel", icon: SiLaravel },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Git", icon: SiGit },
  { name: "Jest", icon: SiJest },
  { name: "Playwright", icon: Drama },
  { name: "Figma", icon: SiFigma },
  { name: "Claude Code", icon: SiClaude },
];
