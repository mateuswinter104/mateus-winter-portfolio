"use client";

import { Fragment, useRef, type ElementType } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type SplitRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function SplitReveal({ text, as = "h2", className, delay = 0, stagger = 0.06 }: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const Tag = as as ElementType;
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="-my-[0.16em] inline-block overflow-hidden py-[0.16em] align-top">
            <motion.span
              data-reveal
              className="inline-block"
              initial={{ y: "140%" }}
              animate={inView ? { y: "0%" } : undefined}
              transition={{ duration: 0.85, ease: EASE, delay: delay + index * stagger }}
            >
              {word}
            </motion.span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function FadeIn({ children, className, delay = 0, y = 24 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
