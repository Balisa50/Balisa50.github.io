"use client";

import { useEffect, useState } from "react";

/**
 * A small floating command-center telemetry panel (desktop only). Shows a
 * live clock, drifting "coordinates", and a system-status bar. Purely
 * decorative and non-interactive; hidden on mobile and under reduced-motion
 * the readouts simply stop animating.
 */
export function HudPanel() {
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const [coords, setCoords] = useState("13.4549N · 16.5790W");

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString("en-GB", { hour12: false }));
      const lat = (13.4549 + Math.sin(d.getTime() / 9000) * 0.0007).toFixed(4);
      const lon = (16.579 + Math.cos(d.getTime() / 9000) * 0.0007).toFixed(4);
      setCoords(`${lat}N · ${lon}W`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hud-panel hidden select-none lg:block" aria-hidden="true">
      <div className="w-[210px] rounded-lg border border-cyan/20 bg-black/55 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-cyan/70 backdrop-blur-md">
        <div className="mb-1.5 flex items-center justify-between text-cyan/90">
          <span className="flex items-center gap-1.5">
            <span className="hud-blink inline-block h-1.5 w-1.5 rounded-full bg-status-live" />
            Systems nominal
          </span>
          <span>{clock}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>LOC</span>
          <span>{coords}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-text-secondary">
          <span>Render</span>
          <span className="text-cyan/80">WEBGL · OK</span>
        </div>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div className="hud-bar-fill h-full rounded-full bg-gradient-to-r from-cyan to-violet-400" />
        </div>
      </div>
    </div>
  );
}
