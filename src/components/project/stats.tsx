"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { getProject } from "@/content/projects";

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

export function Stats({ slug }: { slug: string }) {
  const t = useTranslations("Project.stats");
  const stats = getProject(slug)?.stats ?? [];

  return (
    <dl className="not-prose my-12 grid grid-cols-3 border-y border-line" data-testid="project-stats">
      {stats.map((stat, index) => (
        <div key={stat.key} className={`flex flex-col-reverse gap-2 py-6 ${index > 0 ? "border-l border-line pl-4 md:pl-6" : ""}`}>
          <dt className="label">{t(stat.key)}</dt>
          <dd className="display text-5xl md:text-7xl">
            <CountUp value={stat.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
