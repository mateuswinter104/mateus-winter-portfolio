"use client";

import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";
import { RollText, pillClassName } from "@/components/ui/pill";

type Tile = {
  key: string;
  node: ReactNode;
  className: string;
  depth: number;
};

type ProjectFeatureProps = {
  slug: string;
  name: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  tiles: Tile[];
  links: { live?: string; code?: string };
  labels: { viewCase: string; liveDemo: string; code: string };
};

function ParallaxTile({ tile }: { tile: Tile }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-6 * tile.depth}%`, `${6 * tile.depth}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-xl border border-line bg-card", tile.className)}>
      <motion.div className="absolute inset-[-8%]" style={{ y }}>
        <div className="size-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]">
          {tile.node}
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectFeature({ slug, name, year, category, summary, stack, tiles, links, labels }: ProjectFeatureProps) {
  return (
    <article className="mt-12 md:mt-16">
      <Link
        href={`/projects/${slug}`}
        data-cursor={labels.viewCase}
        aria-label={`${labels.viewCase}: ${name}`}
        className="group grid grid-cols-12 gap-3 md:gap-5"
      >
        {tiles.map((tile) => (
          <ParallaxTile key={tile.key} tile={tile} />
        ))}
      </Link>

      <div className="mt-6 grid items-start gap-6 border-t border-line pt-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-baseline justify-between gap-4 md:block">
            <h3 className="display-tight text-4xl md:text-5xl">{name}</h3>
            <span className="label md:mt-3 md:block">/{year}</span>
          </div>
          <p className="label mt-3">{category}</p>
        </div>
        <div className="space-y-4 md:col-span-5">
          <p className="text-muted-foreground md:text-lg">{summary}</p>
          <ul className="flex flex-wrap gap-1.5">
            {stack.map((item) => (
              <li key={item} className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
          <Magnetic>
            <Link href={`/projects/${slug}`} className={pillClassName("solid")}>
              <RollText>{labels.viewCase}</RollText>
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Magnetic>
          {links.live ? (
            <a href={links.live} target="_blank" rel="noopener noreferrer" className={pillClassName("outline")}>
              <RollText>{labels.liveDemo}</RollText>
            </a>
          ) : null}
          {links.code ? (
            <a href={links.code} target="_blank" rel="noopener noreferrer" className={pillClassName("outline")}>
              <RollText>{labels.code}</RollText>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
