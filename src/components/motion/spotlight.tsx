"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion, useSpring } from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const x = useSpring(50, { stiffness: 80, damping: 20 });
  const y = useSpring(35, { stiffness: 80, damping: 20 });
  const background = useMotionTemplate`radial-gradient(42rem circle at ${x}% ${y}%, color-mix(in oklab, var(--foreground) 9%, transparent), transparent 62%)`;

  useEffect(() => {
    if (!finePointer || reduceMotion) return;

    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      x.set(((event.clientX - rect.left) / rect.width) * 100);
      y.set(((event.clientY - rect.top) / rect.height) * 100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer, reduceMotion, x, y]);

  return <motion.div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" style={{ background }} />;
}
