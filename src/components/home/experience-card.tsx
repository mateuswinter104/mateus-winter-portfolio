"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type ExperienceCardProps = {
  index: number;
  title: string;
  summary: string;
  tags: string[];
  highlight?: boolean;
};

const ROTATIONS = [-1.6, 1.2, 1.4, -1.1];
const DRIFT = [36, 64, 48, 72];

export function ExperienceCard({ index, title, summary, tags, highlight = false }: ExperienceCardProps) {
  const ref = useRef<HTMLLIElement>(null);
  const desktop = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = DRIFT[index % DRIFT.length];
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const rotate = ROTATIONS[index % ROTATIONS.length];

  return (
    <motion.li
      ref={ref}
      data-testid="experience-card"
      data-highlight={highlight || undefined}
      className={cn("sticky md:static", index % 2 === 1 ? "md:mt-28" : "")}
      style={{ top: `calc(5.5rem + ${index * 0.9}rem)`, y: desktop ? y : 0 }}
    >
      <motion.article
        className={cn(
          "flex min-h-[19rem] flex-col justify-between gap-8 rounded-2xl border p-6 shadow-[0_-20px_50px_-40px_rgb(0_0_0/0.6)] md:min-h-[22rem] md:p-9",
          highlight ? "border-foreground bg-foreground text-background" : "border-line bg-card",
        )}
        initial={false}
        animate={{ rotate: desktop ? rotate : 0 }}
        whileHover={desktop ? { rotate: 0, scale: 1.02 } : undefined}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className={cn("label", highlight ? "text-background" : "text-foreground")}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <ul className="flex flex-wrap justify-end gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[0.625rem]",
                  highlight ? "border-background/25 text-background/80" : "border-line text-muted-foreground",
                )}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="display-tight text-3xl md:text-4xl">{title}</h4>
          <p className={highlight ? "text-background/80" : "text-muted-foreground"}>{summary}</p>
        </div>
      </motion.article>
    </motion.li>
  );
}
