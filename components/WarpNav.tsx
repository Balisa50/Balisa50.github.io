"use client";

import { useEffect, useRef } from "react";

/**
 * Wormhole transition for in-page navigation. Intercepts clicks on hash
 * links, plays a brief radial warp (light streaks rushing outward from
 * centre) and smooth-scrolls to the target mid-warp. Reduced-motion users
 * are left untouched, links behave normally.
 */
export function WarpNav() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;

    const playWarp = (onMid: () => void) => {
      canvas.classList.add("active");
      const cx = w / 2;
      const cy = h / 2;
      const max = Math.hypot(w, h);
      const streaks = Array.from({ length: 150 }, () => ({
        ang: Math.random() * Math.PI * 2,
        r: Math.random() * max * 0.25,
        sp: 5 + Math.random() * 13,
        hue: Math.random() > 0.5 ? "0,240,255" : "138,43,226"
      }));
      const start = performance.now();
      const dur = 720;
      let midFired = false;

      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = `rgba(5,5,5,${Math.min(0.55, t * 0.7)})`;
        ctx.fillRect(0, 0, w, h);
        for (const s of streaks) {
          s.r += s.sp * (1 + t * 4);
          const x1 = cx + Math.cos(s.ang) * s.r;
          const y1 = cy + Math.sin(s.ang) * s.r;
          const tail = s.sp * 5 * (1 + t * 5);
          const x2 = cx + Math.cos(s.ang) * (s.r + tail);
          const y2 = cy + Math.sin(s.ang) * (s.r + tail);
          ctx.strokeStyle = `rgba(${s.hue},${0.5 * (1 - t) + 0.25})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        if (!midFired && t >= 0.32) {
          midFired = true;
          onMid();
        }
        if (t < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          ctx.clearRect(0, 0, w, h);
          canvas.classList.remove("active");
        }
      };
      raf = requestAnimationFrame(frame);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      playWarp(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="warp-overlay" aria-hidden="true" />;
}
