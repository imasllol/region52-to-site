"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Тонкая полоса внизу шапки: какую часть страницы посетитель уже прокрутил. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-accent shadow-[0_0_12px_rgba(255,90,31,0.8)]"
      style={{ scaleX }}
    />
  );
}
