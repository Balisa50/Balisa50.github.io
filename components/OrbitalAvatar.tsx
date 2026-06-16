"use client";

/**
 * The profile picture suspended in a zero-g orbital system: concentric
 * rings, data nodes orbiting at different radii/speeds, expanding pulse
 * waves, and a faint HUD reticle. All motion is CSS keyframes, so the
 * global prefers-reduced-motion rule freezes it into a clean static badge.
 */

interface NodeDef {
  orbit: number; // carrier diameter as % of the container (sets orbit radius)
  size: number; // node px
  color: string;
  duration: number; // s
  reverse?: boolean;
  tilt?: boolean;
  delay?: number;
}

const NODES: NodeDef[] = [
  { orbit: 100, size: 7, color: "#00f0ff", duration: 9 },
  { orbit: 100, size: 4, color: "#8a2be2", duration: 9, delay: -4.5 },
  { orbit: 78, size: 5, color: "#ff0055", duration: 14, reverse: true, tilt: true },
  { orbit: 78, size: 6, color: "#00f0ff", duration: 19, tilt: true, delay: -8 },
  { orbit: 60, size: 3, color: "#9bf6ff", duration: 7, reverse: true, delay: -2 }
];

export function OrbitalAvatar() {
  return (
    <div
      className="relative grid place-items-center [perspective:800px]"
      style={{ width: "min(58vw, 260px)", height: "min(58vw, 260px)" }}
      aria-hidden="true"
    >
      {/* Expanding pulse waves */}
      {[0, 1].map((i) => (
        <span
          key={`pulse-${i}`}
          className="pointer-events-none absolute rounded-full border border-cyan/40"
          style={{
            width: "55%",
            height: "55%",
            animation: `pulse-ring 5.5s ease-out ${i * 2.75}s infinite`
          }}
        />
      ))}

      {/* Decorative orbit rings */}
      <span
        className="pointer-events-none absolute rounded-full border border-white/10"
        style={{ width: "100%", height: "100%" }}
      />
      <span
        className="pointer-events-none absolute rounded-full border border-cyan/15"
        style={{ width: "78%", height: "78%", transform: "rotateX(70deg)" }}
      />
      <span
        className="pointer-events-none absolute rounded-full border border-white/10"
        style={{ width: "60%", height: "60%" }}
      />

      {/* Orbiting data nodes */}
      {NODES.map((n, idx) => (
        <div
          key={`node-${idx}`}
          className="pointer-events-none absolute"
          style={{
            width: `${n.orbit}%`,
            height: `${n.orbit}%`,
            transform: n.tilt ? "rotateX(70deg)" : undefined,
            animation: `${n.reverse ? "orbit-spin-rev" : "orbit-spin"} ${n.duration}s linear ${n.delay ?? 0}s infinite`
          }}
        >
          <span
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
            style={{
              width: n.size,
              height: n.size,
              background: n.color,
              boxShadow: `0 0 ${n.size * 2}px ${n.color}, 0 0 ${n.size}px ${n.color}`
            }}
          />
        </div>
      ))}

      {/* HUD reticle */}
      <svg
        className="pointer-events-none absolute text-cyan/30"
        style={{ width: "86%", height: "86%" }}
        viewBox="0 0 100 100"
        fill="none"
      >
        {[
          "M2 12 V2 H12",
          "M88 2 H98 V12",
          "M98 88 V98 H88",
          "M12 98 H2 V88"
        ].map((d) => (
          <path key={d} d={d} stroke="currentColor" strokeWidth="0.6" />
        ))}
        <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 3" />
      </svg>

      {/* Avatar */}
      <div
        className="relative grid place-items-center rounded-full"
        style={{ width: "44%", height: "44%", animation: "zero-g 7s ease-in-out infinite" }}
      >
        <div className="absolute inset-0 rounded-full bg-cyan/20 blur-2xl" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar.jpg"
          alt="Abdoulie Balisa"
          className="relative h-full w-full rounded-full object-cover ring-2 ring-cyan/50"
          style={{ boxShadow: "0 0 50px -8px rgba(0,240,255,0.55)" }}
          loading="eager"
          decoding="async"
        />
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
      </div>
    </div>
  );
}
