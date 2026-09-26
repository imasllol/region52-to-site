"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMotionCapabilities } from "./MotionCapabilities";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Плавное появление со сдвигом снизу, когда блок попадает в видимую область. Один раз за посещение. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { reducedMotion } = useMotionCapabilities();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
