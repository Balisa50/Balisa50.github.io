"use client";

import { useEffect, useRef } from "react";

/**
 * Constellation of drifting points around the avatar. Lines form and dissolve
 * between points as they pass near each other — the classic "constellation
 * connecting" effect. Sizes to its parent; reduced-motion paints one static
 * frame; the loop pauses while the tab is hidden.
 */
export function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;

    const resize = () => {
      size = Math.max(parent.clientWidth, 1);
      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const N = 8;
    const pts = Array.from({ length: N }, (_, i) => ({
      a: (i / N) * Math.PI * 2,
      r: 0.74 + Math.random() * 0.26, // fraction of radius
      sp: (Math.random() * 0.0006 + 0.0002) * (Math.random() > 0.5 ? 1 : -1),
      rad: 1.1 + Math.random() * 1.6,
      tw: Math.random() * Math.PI * 2
    }));

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    let raf = 0;
    let t = 0;

    const render = () => {
      t++;
      ctx.clearRect(0, 0, size, size);
      const c = size / 2;
      const R = size * 0.46;
      const coords = pts.map((p) => {
        if (!reduced) p.a += p.sp;
        return {
          x: c + Math.cos(p.a) * R * p.r,
          y: c + Math.sin(p.a) * R * p.r * 0.74,
          p
        };
      });

      const thresh = size * 0.34;
      for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const d = Math.hypot(coords[i].x - coords[j].x, coords[i].y - coords[j].y);
          if (d < thresh) {
            ctx.strokeStyle = `rgba(0,240,255,${(1 - d / thresh) * 0.33})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(coords[i].x, coords[i].y);
            ctx.lineTo(coords[j].x, coords[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.shadowColor = "#00f0ff";
      for (const cc of coords) {
        const tw = reduced ? 0.85 : 0.5 + 0.5 * Math.sin(t * 0.03 + cc.p.tw);
        ctx.beginPath();
        ctx.arc(cc.x, cc.y, cc.p.rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,246,255,${tw})`;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!reduced && !document.hidden) raf = requestAnimationFrame(render);
    };
    render();

    const onVis = () => {
      if (!document.hidden && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 m-auto"
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}
