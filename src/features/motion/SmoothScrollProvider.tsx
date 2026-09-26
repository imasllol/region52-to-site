"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { useMotionCapabilities } from "./MotionCapabilities";

const HEADER_OFFSET = 88;

/** Плавная прокрутка колесом и сенсорной панелью. На сенсорных экранах и в режиме уменьшения движения отключена. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { ready, reducedMotion, coarsePointer } = useMotionCapabilities();

  useEffect(() => {
    if (!ready || reducedMotion || coarsePointer) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Внутри окна записи прокрутка обычная
      prevent: (node: HTMLElement) => node.closest("dialog") !== null,
    });

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      if (hash === "#top") {
        event.preventDefault();
        lenis.scrollTo(0);
        history.replaceState(null, "", hash);
        return;
      }
      const section = document.querySelector(hash);
      if (!(section instanceof HTMLElement)) return;
      event.preventDefault();
      lenis.scrollTo(section, { offset: -HEADER_OFFSET });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.style.scrollBehavior = previousBehavior;
    };
  }, [ready, reducedMotion, coarsePointer]);

  return <>{children}</>;
}
