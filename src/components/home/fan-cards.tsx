"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type FanCardsProps = {
  cards: { key: string; node: ReactNode }[];
};

const REST = [
  { rotate: -9, x: -36, y: 10 },
  { rotate: 0, x: 0, y: 0 },
  { rotate: 9, x: 36, y: 10 },
];

const OPEN = [
  { rotate: -18, x: -120, y: 26 },
  { rotate: 0, x: 0, y: -18 },
  { rotate: 18, x: 120, y: 26 },
];

export function FanCards({ cards }: FanCardsProps) {
  return (
    <motion.div
      aria-hidden
      initial="rest"
      whileHover="open"
      animate="rest"
      className="relative mx-auto hidden h-72 w-60 md:block lg:h-80 lg:w-64"
    >
      {cards.slice(0, 3).map((card, index) => (
        <motion.div
          key={card.key}
          className="absolute inset-0 overflow-hidden rounded-xl border border-line bg-card shadow-2xl"
          style={{ zIndex: index === 1 ? 3 : 2 - Math.abs(index - 1) }}
          variants={{ rest: REST[index], open: OPEN[index] }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {card.node}
        </motion.div>
      ))}
    </motion.div>
  );
}
