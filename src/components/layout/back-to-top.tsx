"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";
import { Magnetic } from "@/components/motion/magnetic";

export function BackToTop({ label }: { label: string }) {
  const lenis = useLenis();

  const onClick = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Magnetic strength={0.4}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="inline-flex size-12 items-center justify-center rounded-full border border-line transition-colors hover:bg-foreground hover:text-background"
      >
        <ArrowUp className="size-4" aria-hidden />
      </button>
    </Magnetic>
  );
}
