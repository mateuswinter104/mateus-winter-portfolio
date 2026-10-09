"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";

type AboutPhotoProps = {
  src: string;
  alt: string;
};

export function AboutPhoto({ src, alt }: AboutPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.35"] });
  const reveal = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useTransform(reveal, (value) => `inset(${value}% 0% 0% 0%)`);
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const rotateX = useSpring(0, { stiffness: 150, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 18 });

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!finePointer || reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
    rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className="[perspective:1200px]">
      <motion.div
        ref={ref}
        data-testid="about-photo"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-card motion-reduce:[clip-path:none!important]"
        style={{ clipPath, rotateX, rotateY }}
      >
        <motion.div className="size-full motion-reduce:[transform:none!important]" style={{ scale }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 30vw, 90vw"
            className="object-cover object-[50%_30%] grayscale contrast-[1.08] transition-[filter] duration-700 group-hover:grayscale-0"
          />
        </motion.div>
        <span aria-hidden className="grain !absolute !inset-0 !z-10" />
      </motion.div>
    </div>
  );
}
