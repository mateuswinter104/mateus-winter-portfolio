"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

type WordRevealProps = {
  text: string;
  className?: string;
};

export function WordReveal({ text, className }: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.42"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn(className)}>
      {words.map((word, index) => (
        <Word
          key={`${word}-${index}`}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
          last={index === words.length - 1}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

type WordProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  last: boolean;
};

function Word({ children, progress, range, last }: WordProps) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <>
      <motion.span data-reveal data-word-reveal style={{ opacity }}>
        {children}
      </motion.span>
      {last ? null : " "}
    </>
  );
}
