"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";

type CursorMode = "default" | "interactive" | "label" | "hidden";

const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor-hover]";
const TEXT_INPUT = "input, textarea, select, [contenteditable='true']";

export function Cursor() {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  if (!finePointer || reduceMotion) return null;

  return <CursorFollower />;
}

function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const labelX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const labelY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });
  const [mode, setMode] = useState<CursorMode>("hidden");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      setMode((current) => (current === "hidden" ? "default" : current));
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled?.dataset.cursor) {
        setLabel(labelled.dataset.cursor);
        setMode("label");
        return;
      }

      if (target.closest(TEXT_INPUT)) {
        setMode("hidden");
        return;
      }

      setMode(target.closest(INTERACTIVE) ? "interactive" : "default");
    };

    const onLeave = () => setMode("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  return (
    <div aria-hidden data-testid="custom-cursor" data-mode={mode} className="pointer-events-none fixed inset-0 z-[95]">
      <div className="absolute inset-0 mix-blend-difference">
        <motion.span
          className="absolute top-0 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{ x, y }}
          animate={{
            opacity: mode === "hidden" || mode === "label" ? 0 : 1,
            scale: mode === "interactive" ? 2 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </div>
      <AnimatePresence>
        {mode === "label" ? (
          <motion.span
            key="label"
            data-testid="custom-cursor-label"
            className="absolute top-0 left-0 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground p-3 text-center font-mono text-[0.625rem] leading-tight tracking-[0.14em] text-background uppercase"
            style={{ x: labelX, y: labelY }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
