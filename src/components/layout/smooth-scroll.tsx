"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";

export function SmoothScroll() {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  if (!finePointer || reduceMotion) {
    return null;
  }

  return <ReactLenis root options={{ lerp: 0.11, anchors: { offset: -72 } }} />;
}
