"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Service = { title: string; body: string };

type WhatIDoListProps = {
  items: Service[];
  previews: ReactNode[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhatIDoList({ items, previews }: WhatIDoListProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-12">
      <ul className="md:col-span-7">
        {items.map((item, index) => (
          <li key={item.title} className="border-b border-line first:border-t">
            <button
              type="button"
              aria-pressed={active === index}
              aria-controls="services-preview"
              data-testid="service-item"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(index);
              }}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              className="group flex w-full items-baseline gap-4 py-3 text-left md:gap-6 md:py-4"
            >
              <span className="label w-6 shrink-0">{String(index + 1).padStart(2, "0")}</span>
              <span
                className={cn(
                  "display text-[13vw] leading-[0.95] transition-colors duration-500 md:text-[6.2vw]",
                  active === index ? "text-foreground" : "text-faint group-hover:text-muted-foreground",
                )}
              >
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div id="services-preview" aria-live="polite" className="self-start md:sticky md:top-28 md:col-span-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="space-y-5"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-card">{previews[active]}</div>
            <p data-testid="service-body" className="text-muted-foreground md:text-lg">
              {items[active].body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
