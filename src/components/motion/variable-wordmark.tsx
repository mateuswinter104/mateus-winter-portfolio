"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIntroDone } from "@/hooks/use-intro";
import { FINE_POINTER_QUERY } from "@/hooks/use-media-query";

const REST = { wght: 760, wdth: 68 };
const PEAK = { wght: 900, wdth: 108 };
const TOUCH = { wghtMin: 520, wghtMax: 900, wdthMin: 62, wdthMax: 84 };
const EASE = [0.22, 1, 0.36, 1] as const;

type VariableWordmarkProps = {
  words: string[];
  label: string;
  as?: "h1" | "p";
  className?: string;
};

function variation(wght: number, wdth: number) {
  return `"wght" ${wght.toFixed(1)}, "wdth" ${wdth.toFixed(1)}`;
}

export function VariableWordmark({ words, label, as: Tag = "h1", className }: VariableWordmarkProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<HTMLSpanElement[]>([]);
  const reduceMotion = useReducedMotion();
  const introDone = useIntroDone();

  useEffect(() => {
    const container = containerRef.current;
    const slots = slotRefs.current.filter(Boolean);
    if (!container || reduceMotion || slots.length === 0) return;

    const finePointer = window.matchMedia(FINE_POINTER_QUERY).matches;
    const state = slots.map(() => ({ wght: REST.wght, wdth: REST.wdth }));
    const pointer = { x: 0, y: 0, active: false };
    let centers: { x: number; y: number }[] = [];
    let radius = 200;
    let frame = 0;
    let visible = false;

    const measure = () => {
      centers = slots.map((slot) => {
        const rect = slot.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 + window.scrollX, y: rect.top + rect.height / 2 + window.scrollY };
      });
      radius = parseFloat(getComputedStyle(container).fontSize) * 1.7;
    };

    const target = (index: number, time: number) => {
      if (!finePointer) {
        const phase = time * 0.0011 + window.scrollY * 0.012;
        const wave = (Math.sin(phase - index * 0.62) + 1) / 2;
        return {
          wght: TOUCH.wghtMin + (TOUCH.wghtMax - TOUCH.wghtMin) * wave,
          wdth: TOUCH.wdthMin + (TOUCH.wdthMax - TOUCH.wdthMin) * wave,
        };
      }

      if (!pointer.active) {
        const wave = ((Math.sin(time * 0.0014 - index * 0.5) + 1) / 2) * 0.28;
        return {
          wght: REST.wght + (PEAK.wght - REST.wght) * wave,
          wdth: REST.wdth + (PEAK.wdth - REST.wdth) * wave * 0.4,
        };
      }

      const center = centers[index];
      const distance = Math.hypot(pointer.x - center.x, (pointer.y - center.y) * 1.3);
      const reach = Math.max(0, 1 - distance / radius);
      const eased = reach * reach * (3 - 2 * reach);
      return {
        wght: REST.wght + (PEAK.wght - REST.wght) * eased,
        wdth: REST.wdth + (PEAK.wdth - REST.wdth) * eased,
      };
    };

    const tick = (time: number) => {
      slots.forEach((slot, index) => {
        const goal = target(index, time);
        const current = state[index];
        current.wght += (goal.wght - current.wght) * 0.14;
        current.wdth += (goal.wdth - current.wdth) * 0.14;
        slot.style.fontVariationSettings = variation(current.wght, current.wdth);
      });
      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (!frame && visible) frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = event.pageX;
      pointer.y = event.pageY;
      pointer.active =
        event.clientX > rect.left - radius &&
        event.clientX < rect.right + radius &&
        event.clientY > rect.top - radius &&
        event.clientY < rect.bottom + radius;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    observer.observe(container);
    window.addEventListener("resize", measure);
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reduceMotion]);

  let letterIndex = 0;

  return (
    <Tag className={cn("display select-none", className)}>
      <span className="sr-only">{label}</span>
      <span
        ref={containerRef}
        aria-hidden
        data-testid="variable-wordmark"
        className="flex flex-wrap justify-between gap-x-[0.12em] md:flex-nowrap"
      >
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-flex overflow-hidden pb-[0.04em]">
            {Array.from(word).map((char, charIndex) => {
              const index = letterIndex++;
              return (
                <span
                  key={`${char}-${charIndex}`}
                  ref={(node) => {
                    if (node) slotRefs.current[index] = node;
                  }}
                  className="inline-block"
                  style={{ fontVariationSettings: variation(REST.wght, REST.wdth) }}
                >
                  <motion.span
                    data-reveal
                    className="inline-block will-change-transform"
                    initial={{ y: "112%" }}
                    animate={introDone ? { y: "0%" } : undefined}
                    transition={{ duration: 1, ease: EASE, delay: 0.05 + index * 0.035 }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}
