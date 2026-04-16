"use client";

/**
 * Lightweight SVG "brain" used as the hero fallback on mobile, low-tier GPUs,
 * or when the user prefers reduced motion. No animation on reduced-motion.
 */
export function StaticBrainSVG({ reducedMotion = false }: { reducedMotion?: boolean }) {
  // Deterministic point cloud, sampled to look vaguely like a brain silhouette
  const nodes = [
    [50, 20], [62, 22], [72, 28], [80, 38], [83, 50], [80, 62], [72, 72], [62, 78], [50, 80],
    [38, 78], [28, 72], [20, 62], [17, 50], [20, 38], [28, 28], [38, 22],
    [42, 35], [50, 30], [58, 35], [65, 42], [68, 52], [65, 62], [58, 68], [50, 70], [42, 68],
    [35, 62], [32, 52], [35, 42], [50, 50], [45, 45], [55, 45], [55, 55], [45, 55]
  ] as const;

  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [ax, ay] = nodes[i];
      const [bx, by] = nodes[j];
      const d = Math.hypot(ax - bx, ay - by);
      if (d < 18) edges.push([i, j]);
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#00F0FF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </radialGradient>
        <filter id="brainBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      <circle cx="50" cy="50" r="45" fill="url(#brainGlow)" />

      <g stroke="#00F0FF" strokeWidth="0.18" strokeOpacity="0.5" filter="url(#brainBlur)">
        {edges.map(([a, b], i) => {
          const [ax, ay] = nodes[a];
          const [bx, by] = nodes[b];
          return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} />;
        })}
      </g>

      <g fill="#00F0FF">
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={0.9}
            opacity={0.9}
            style={
              reducedMotion
                ? undefined
                : {
                    animation: `pulse 3.2s ease-in-out ${(i % 7) * 0.2}s infinite`,
                    transformOrigin: `${x}px ${y}px`
                  }
            }
          />
        ))}
      </g>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </svg>
  );
}
