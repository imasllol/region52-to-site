"use client";

import { motion, useSpring } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useMotionCapabilities } from "./MotionCapabilities";

const RADIUS = 80;
const MAX_SHIFT = 10;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Кнопка слегка смещается к курсору, когда курсор ближе 80 px. */
export function MagneticButton({
  children,
  className = "grid",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready, reducedMotion, coarsePointer } = useMotionCapabilities();
  const enabled = ready && !reducedMotion && !coarsePointer;
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
      return;
    }
    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const near =
        event.clientX > rect.left - RADIUS &&
        event.clientX < rect.right + RADIUS &&
        event.clientY > rect.top - RADIUS &&
        event.clientY < rect.bottom + RADIUS;
      if (!near) {
        x.set(0);
        y.set(0);
        return;
      }
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      x.set(clamp(dx * 0.2, -MAX_SHIFT, MAX_SHIFT));
      y.set(clamp(dy * 0.3, -MAX_SHIFT, MAX_SHIFT));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);

  return (
    <motion.span ref={ref} className={className} style={{ x, y }}>
      {children}
    </motion.span>
  );
}
