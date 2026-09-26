"use client";

import { motion, useSpring } from "motion/react";
import { useState, type PointerEvent, type ReactNode } from "react";
import { useMotionCapabilities } from "./MotionCapabilities";

const MAX_TILT = 8;

/** Наклон карточки в сторону курсора и световой блик за курсором. */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ready, reducedMotion, coarsePointer } = useMotionCapabilities();
  const enabled = ready && !reducedMotion && !coarsePointer;
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });
  const [hover, setHover] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  if (!enabled) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * MAX_TILT);
    rotateX.set((0.5 - py) * 2 * MAX_TILT);
    setGlare({ x: px * 100, y: py * 100 });
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHover(false);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerEnter={() => setHover(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity: hover ? 1 : 0,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.13), transparent 45%)`,
        }}
      />
    </motion.div>
  );
}
