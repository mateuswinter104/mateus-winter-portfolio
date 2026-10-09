"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type GalleryItem = {
  key: string;
  label: string;
  node: ReactNode;
  portrait?: boolean;
};

type HorizontalGalleryProps = {
  items: GalleryItem[];
  label: string;
  hint: string;
};

export function HorizontalGallery({ items, label, hint }: HorizontalGalleryProps) {
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();

  if (!finePointer || reduceMotion) {
    return <SnapGallery items={items} label={label} />;
  }

  return <PinnedGallery items={items} label={label} hint={hint} />;
}

function Figure({ item, index, total, className }: { item: GalleryItem; index: number; total: number; className: string }) {
  return (
    <figure className={className}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-line bg-card",
          item.portrait ? "aspect-[900/1948]" : "aspect-[16/10]",
        )}
      >
        {item.node}
      </div>
      <figcaption className="mt-3 flex items-center justify-between">
        <span className="label text-foreground">{item.label}</span>
        <span className="label">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}

function SnapGallery({ items, label }: { items: GalleryItem[]; label: string }) {
  return (
    <section aria-label={label} className="py-10">
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        data-testid="snap-gallery"
        className="gutter flex snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-4 [scrollbar-width:none]"
      >
        {items.map((item, index) => (
          <Figure
            key={item.key}
            item={item}
            index={index}
            total={items.length}
            className={cn("shrink-0 snap-center", item.portrait ? "w-[52vw] md:w-[26vw]" : "w-[86vw] md:w-[60vw]")}
          />
        ))}
      </div>
    </section>
  );
}

function PinnedGallery({ items, label, hint }: HorizontalGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;
      const travel = Math.max(0, track.scrollWidth - window.innerWidth);
      distance.set(travel);
      section.style.height = `${window.innerHeight + travel}px`;
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distance]);

  return (
    <section ref={sectionRef} aria-label={label} data-testid="pinned-gallery" className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center gap-8 overflow-hidden">
        <div className="gutter flex items-center justify-between">
          <span className="label text-foreground">{label}</span>
          <span className="label">{hint}</span>
        </div>
        <motion.div ref={trackRef} className="gutter flex w-max items-start gap-6" style={{ x }}>
          {items.map((item, index) => (
            <Figure
              key={item.key}
              item={item}
              index={index}
              total={items.length}
              className={cn("shrink-0", item.portrait ? "w-[17.9vw] lg:w-[16.2vw]" : "w-[62vw] lg:w-[56vw]")}
            />
          ))}
        </motion.div>
        <div className="gutter">
          <div className="h-px w-full bg-line">
            <motion.div className="h-px origin-left bg-foreground" style={{ scaleX: progress }} />
          </div>
        </div>
      </div>
    </section>
  );
}
