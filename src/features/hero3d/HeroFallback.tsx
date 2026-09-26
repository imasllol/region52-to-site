/** Запасное изображение первого экрана: светящийся силуэт того же автомобиля (SVG). */
export function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-[10%] lg:items-center lg:pb-0">
      <svg
        viewBox="-2.3 -1.75 4.6 2.2"
        fill="none"
        aria-hidden="true"
        className="w-[88%] max-w-[720px] drop-shadow-[0_0_24px_rgba(255,90,31,0.45)]"
      >
        <line x1="-2.3" y1="0" x2="2.3" y2="0" stroke="#ff5a1f" strokeOpacity="0.45" strokeWidth="0.01" />
        <ellipse cx="0" cy="0" rx="2.4" ry="0.12" fill="#ff5a1f" fillOpacity="0.12" />
        <path
          d="M -1.95 -0.35 L -1.95 -0.8 L -1.7 -0.95 L -1.1 -1.0 L -0.7 -1.4 L 0.35 -1.42 L 0.95 -1.0 L 1.8 -0.88 L 1.98 -0.7 L 1.98 -0.38 L 1.7 -0.35 A 0.45 0.45 0 0 0 0.8 -0.35 L -0.8 -0.35 A 0.45 0.45 0 0 0 -1.7 -0.35 Z"
          stroke="#ff5a1f"
          strokeWidth="0.025"
          strokeLinejoin="round"
          fill="#ff5a1f"
          fillOpacity="0.06"
        />
        <path
          d="M -1.0 -1.02 L -0.65 -1.34 L 0.3 -1.36 L 0.85 -1.02 Z"
          stroke="#ff5a1f"
          strokeOpacity="0.6"
          strokeWidth="0.018"
          fill="#ffffff"
          fillOpacity="0.04"
        />
        <line x1="-1.6" y1="-0.62" x2="1.7" y2="-0.62" stroke="#ff5a1f" strokeWidth="0.02" />
        <rect x="1.93" y="-0.79" width="0.06" height="0.09" fill="#fff4e6" />
        <rect x="-1.99" y="-0.83" width="0.05" height="0.08" fill="#ff2323" />
        {[1.25, -1.25].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="-0.35" r="0.34" stroke="#f4f4f5" strokeOpacity="0.55" strokeWidth="0.02" />
            <circle cx={cx} cy="-0.35" r="0.26" stroke="#ff5a1f" strokeWidth="0.015" />
            <circle cx={cx} cy="-0.35" r="0.06" fill="#a1a1aa" />
          </g>
        ))}
      </svg>
    </div>
  );
}
