"use client";

import { useEffect, useRef } from "react";
import { animate } from "motion/react";
import { useTranslations } from "next-intl";
import { INTRO_DONE_EVENT, INTRO_STORAGE_KEY, isIntroPlaying } from "@/hooks/use-intro";

const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

function finishIntro() {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {}
  delete document.documentElement.dataset.intro;
}

export function Preloader() {
  const t = useTranslations("Intro");
  const overlayRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !isIntroPlaying()) return;

    let cancelled = false;
    const counter = animate(0, 100, {
      duration: 0.8,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (value) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(value)).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${value / 100})`;
      },
    });

    let curtain: ReturnType<typeof animate> | undefined;

    counter.then(() => {
      if (cancelled) return;
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      curtain = animate(
        overlay,
        { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] },
        { duration: 0.55, ease: EASE_IN_OUT },
      );
      curtain.then(finishIntro);
    });

    return () => {
      cancelled = true;
      counter.stop();
      curtain?.stop();
      if (isIntroPlaying()) {
        window.dispatchEvent(new Event(INTRO_DONE_EVENT));
        finishIntro();
      }
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      data-testid="preloader"
      className="intro-overlay gutter fixed inset-0 z-[100] flex-col justify-between bg-foreground py-6 text-background"
    >
      <div className="flex items-start justify-between font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
        <span>Mateus Winter</span>
        <span>{t("label")}</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <span className="font-mono text-[0.6875rem] tracking-[0.14em] uppercase opacity-60">{t("loading")}</span>
        <span ref={countRef} className="display text-[28vw] leading-[0.8] tabular-nums md:text-[18vw]">
          000
        </span>
      </div>
      <span
        ref={barRef}
        className="absolute inset-x-0 bottom-0 h-1 origin-left bg-background"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
