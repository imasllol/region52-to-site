"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMotionCapabilities } from "./MotionCapabilities";

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")";

/** Фон страницы: шум и размытые пятна акцентного цвета с параллаксом. */
export function AmbientBackground() {
  const { reducedMotion } = useMotionCapabilities();
  const { scrollYProgress } = useScroll();
  const yUp = useTransform(scrollYProgress, [0, 1], ["0vh", "-40vh"]);
  const yDown = useTransform(scrollYProgress, [0, 1], ["0vh", "35vh"]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-[20vw] top-[60vh] size-[60vw] rounded-full bg-accent/[0.07] blur-[120px]"
        style={{ y: reducedMotion ? 0 : yUp }}
      />
      <motion.div
        className="absolute -right-[15vw] top-[120vh] size-[50vw] rounded-full bg-accent/[0.06] blur-[120px]"
        style={{ y: reducedMotion ? 0 : yDown }}
      />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
    </div>
  );
}
