"use client";

import dynamic from "next/dynamic";
import { Component, useState, type ReactNode } from "react";
import { useMotionCapabilities } from "@/features/motion/MotionCapabilities";
import { HeroFallback } from "./HeroFallback";

// Код 3D загружается отдельно и только на подходящих устройствах.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });

/** Если 3D упало (нет WebGL и т. п.), просто не показываем его. */
class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const AREA = "absolute inset-x-0 bottom-0 h-[55%] lg:inset-y-0 lg:left-[36%] lg:h-auto";

export function HeroBackground() {
  const { allow3D, coarsePointer } = useMotionCapabilities();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const show3D = allow3D && !failed;
  const sceneVisible = show3D && ready;

  return (
    <div className="absolute inset-0">
      <div
        className={`${AREA} transition-opacity duration-1000 ${sceneVisible ? "opacity-0" : "opacity-100"}`}
      >
        <HeroFallback />
      </div>

      {show3D ? (
        <div
          className={`${AREA} transition-opacity duration-1000 ${sceneVisible ? "opacity-100" : "opacity-0"}`}
        >
          <SceneErrorBoundary onError={() => setFailed(true)}>
            <HeroScene onReady={() => setReady(true)} coarse={coarsePointer} />
          </SceneErrorBoundary>
        </div>
      ) : null}

      {/* Затемнение, чтобы текст оставался читаемым */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/90 via-night/55 to-night/10 lg:bg-gradient-to-r lg:from-night lg:via-night/55 lg:to-transparent" />
    </div>
  );
}
