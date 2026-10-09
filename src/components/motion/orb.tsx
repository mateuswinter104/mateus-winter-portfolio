"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/use-media-query";

type OrbProps = {
  className?: string;
  rotate?: number;
};

export function Orb({ className, rotate = 0 }: OrbProps) {
  return <div aria-hidden className={cn("orb", className)} style={{ rotate: `${rotate}deg` }} />;
}

type FollowOrbProps = OrbProps & {
  reach?: number;
};

export function FollowOrb({ className, rotate, reach = 0.08 }: FollowOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 60, damping: 18, mass: 1 });
  const y = useSpring(0, { stiffness: 60, damping: 18, mass: 1 });

  useEffect(() => {
    if (!finePointer || reduceMotion) return;

    const onMove = (event: PointerEvent) => {
      const node = ref.current?.parentElement;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      x.set((event.clientX - (rect.left + rect.width / 2)) * reach);
      y.set((event.clientY - (rect.top + rect.height / 2)) * reach);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer, reduceMotion, reach, x, y]);

  return (
    <motion.div ref={ref} aria-hidden className={cn("orb", className)} style={{ x, y, rotate: `${rotate ?? 0}deg` }} />
  );
}
