"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Что разрешено показывать на текущем устройстве (блупринт «Система анимаций»). */
export interface MotionCapabilities {
  /** Возможности уже определены (после гидратации) */
  ready: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  lowEnd: boolean;
  coarsePointer: boolean;
  allow3D: boolean;
}

const INITIAL: MotionCapabilities = {
  ready: false,
  reducedMotion: false,
  webgl: false,
  lowEnd: false,
  coarsePointer: false,
  allow3D: false,
};

const MotionCapabilitiesContext = createContext<MotionCapabilities>(INITIAL);

export function useMotionCapabilities(): MotionCapabilities {
  return useContext(MotionCapabilitiesContext);
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function detectLowEnd(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency;
  const memory = nav.deviceMemory;
  return (typeof cores === "number" && cores > 0 && cores <= 2) ||
    (typeof memory === "number" && memory > 0 && memory < 4);
}

export function MotionCapabilitiesProvider({ children }: { children: ReactNode }) {
  const [caps, setCaps] = useState<MotionCapabilities>(INITIAL);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const webgl = detectWebGL();
    const lowEnd = detectLowEnd();

    const update = () => {
      const reducedMotion = reducedQuery.matches;
      setCaps({
        ready: true,
        reducedMotion,
        webgl,
        lowEnd,
        coarsePointer: coarseQuery.matches,
        allow3D: webgl && !lowEnd && !reducedMotion,
      });
    };

    update();
    reducedQuery.addEventListener("change", update);
    coarseQuery.addEventListener("change", update);
    return () => {
      reducedQuery.removeEventListener("change", update);
      coarseQuery.removeEventListener("change", update);
    };
  }, []);

  return (
    <MotionCapabilitiesContext.Provider value={caps}>{children}</MotionCapabilitiesContext.Provider>
  );
}
