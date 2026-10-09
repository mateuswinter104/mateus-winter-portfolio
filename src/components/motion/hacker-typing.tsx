"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useIntroDone } from "@/hooks/use-intro";

export const GLYPHS = "!<>-_\\/[]{}=+*^?#%&$";

const TIMING = {
  firstHold: 1600,
  hold: 1700,
  scramble: 26,
  settle: 42,
  erase: 30,
  scrambleSteps: 3,
};

type HackerTypingProps = {
  words: readonly string[];
  prefix: string;
  srText: string;
  className?: string;
};

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export function HackerTyping({ words, prefix, srText, className }: HackerTypingProps) {
  const reduceMotion = useReducedMotion();
  const introDone = useIntroDone();
  const [display, setDisplay] = useState<string>(words[0]);

  useEffect(() => {
    if (reduceMotion || !introDone || words.length < 2) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timeout = setTimeout(resolve, ms);
      });

    const run = async () => {
      let index = 0;
      await wait(TIMING.firstHold);

      while (!cancelled) {
        const current = words[index];
        for (let length = current.length; length >= 0 && !cancelled; length--) {
          const tail = length > 0 ? randomGlyph() : "";
          setDisplay(current.slice(0, Math.max(0, length - 1)) + tail);
          await wait(TIMING.erase);
        }

        index = (index + 1) % words.length;
        const next = words[index];

        for (let position = 1; position <= next.length && !cancelled; position++) {
          for (let step = 0; step < TIMING.scrambleSteps && !cancelled; step++) {
            setDisplay(next.slice(0, position - 1) + randomGlyph());
            await wait(TIMING.scramble);
          }
          setDisplay(next.slice(0, position));
          await wait(TIMING.settle);
        }

        await wait(TIMING.hold);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [reduceMotion, introDone, words]);

  return (
    <p className={cn("font-mono text-sm tracking-tight sm:text-base", className)}>
      <span className="sr-only">{srText}</span>
      <span aria-hidden data-testid="hacker-typing" className="inline-flex flex-wrap items-baseline gap-x-2">
        <span className="text-muted-foreground">&gt; {prefix}</span>
        <span data-testid="hacker-typing-static" className="hidden text-foreground motion-reduce:inline">
          {words.join(" · ")}
        </span>
        <span className="text-foreground motion-reduce:hidden">
          [<span data-testid="hacker-typing-word">{display}</span>
          <span className="ml-px inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] animate-blink bg-foreground" />]
        </span>
      </span>
    </p>
  );
}
