"use client";

import { useEffect, useRef } from "react";
import { useGPUTier } from "@/hooks/useGPUTier";

/**
 * A living sci-fi environment painted on a single fixed canvas behind all
 * content: a 3-layer parallax starfield, slow-drifting nebula clouds, and
 * rare cinematic events (a meteor streak, a flock of particle "birds").
 *
 * Performance: capped DPR, particle counts scale with GPU tier, the rAF loop
 * pauses when the tab is hidden, and reduced-motion paints a single static
 * frame with no loop at all. The CSS `.cinematic-bg` adds the drifting grid.
 */
export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gpu = useGPUTier();

  useEffect(() => {
    if (!gpu.ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      // Robust viewport read: some embed/hydration timings briefly report 0.
      w = Math.max(window.innerWidth, document.documentElement.clientWidth, 1);
      h = Math.max(window.innerHeight, document.documentElement.clientHeight, 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    // Re-measure after first paint in case layout wasn't ready at mount.
    requestAnimationFrame(resize);

    // Star density scales with capability.
    const density = gpu.isMobile || gpu.tier === "low" ? 0.00010 : 0.00022;
    const starCount = Math.round(w * h * density);
    type Star = { x: number; y: number; z: number; r: number; tw: number };
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.7 + 0.3, // depth → parallax + size
      r: Math.random() * 1.2 + 0.2,
      tw: Math.random() * Math.PI * 2
    }));

    // Matrix-style data streams (capable GPUs only).
    const showStreams = !gpu.isMobile && gpu.tier !== "low";
    const STREAM_GLYPHS = "01<>/{}[]#$%&*+=ｱｲｳｴｵｶｷｸ";
    type Stream = { x: number; y: number; speed: number; size: number; chars: string[] };
    const streams: Stream[] = Array.from(
      { length: showStreams ? Math.min(14, Math.round(w / 140)) : 0 },
      () => {
        const size = 12 + Math.floor(Math.random() * 4);
        const len = 8 + Math.floor(Math.random() * 14);
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          speed: 0.6 + Math.random() * 1.4,
          size,
          chars: Array.from(
            { length: len },
            () => STREAM_GLYPHS[Math.floor(Math.random() * STREAM_GLYPHS.length)]
          )
        };
      }
    );

    // Nebula blobs.
    const nebula = [
      { x: w * 0.2, y: h * 0.25, r: Math.max(w, h) * 0.5, c: "0,240,255", a: 0.05, dx: 0.012, dy: 0.006 },
      { x: w * 0.8, y: h * 0.7, r: Math.max(w, h) * 0.55, c: "138,43,226", a: 0.045, dx: -0.01, dy: 0.008 },
      { x: w * 0.6, y: h * 0.15, r: Math.max(w, h) * 0.4, c: "255,0,85", a: 0.03, dx: 0.008, dy: -0.01 }
    ];

    const reduced = gpu.reducedMotion;
    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    // ---- rare cinematic events -------------------------------------------
    type Meteor = { x: number; y: number; vx: number; vy: number; life: number; len: number };
    let meteor: Meteor | null = null;
    type Bird = { x: number; y: number; phase: number };
    let flock: Bird[] | null = null;
    let flockX = 0;
    let flockDir = 1;
    let flockY = 0;

    const spawnMeteor = () => {
      const fromLeft = Math.random() > 0.5;
      meteor = {
        x: fromLeft ? -50 : w + 50,
        y: Math.random() * h * 0.4,
        vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 4),
        vy: 2.5 + Math.random() * 1.5,
        life: 1,
        len: 120 + Math.random() * 80
      };
    };
    const spawnFlock = () => {
      flockDir = Math.random() > 0.5 ? 1 : -1;
      flockX = flockDir === 1 ? -60 : w + 60;
      flockY = h * (0.15 + Math.random() * 0.35);
      flock = Array.from({ length: 7 }, (_, i) => ({
        x: -i * 22 * flockDir,
        y: (i % 2 === 0 ? -1 : 1) * (i * 6),
        phase: Math.random() * Math.PI * 2
      }));
    };

    type Sat = { x: number; y: number; vx: number; vy: number; blink: number };
    let satellite: Sat | null = null;
    const spawnSat = () => {
      const fromLeft = Math.random() > 0.5;
      satellite = {
        x: fromLeft ? -30 : w + 30,
        y: h * (0.08 + Math.random() * 0.32),
        vx: (fromLeft ? 1 : -1) * (1.1 + Math.random() * 0.6),
        vy: (Math.random() - 0.5) * 0.3,
        blink: 0
      };
    };

    let meteorTimer = window.setTimeout(spawnMeteor, 6000 + Math.random() * 8000);
    let flockTimer = window.setTimeout(spawnFlock, 25000 + Math.random() * 30000);
    let satTimer = window.setTimeout(spawnSat, 35000 + Math.random() * 40000);

    const drawBird = (x: number, y: number, wing: number) => {
      ctx.beginPath();
      ctx.moveTo(x - 6, y + wing);
      ctx.quadraticCurveTo(x, y - 2, x, y);
      ctx.quadraticCurveTo(x, y - 2, x + 6, y + wing);
      ctx.strokeStyle = "rgba(0,240,255,0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    let raf = 0;
    let t = 0;

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      // Nebula
      for (const n of nebula) {
        if (!reduced) {
          n.x += n.dx;
          n.y += n.dy;
          if (n.x < -n.r) n.x = w + n.r;
          if (n.x > w + n.r) n.x = -n.r;
          if (n.y < -n.r) n.y = h + n.r;
          if (n.y > h + n.r) n.y = -n.r;
        }
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `rgba(${n.c},${n.a})`);
        g.addColorStop(1, `rgba(${n.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Stars (parallax against scroll + gentle twinkle)
      for (const s of stars) {
        const py = (s.y - scrollY * s.z * 0.15) % h;
        const yy = py < 0 ? py + h : py;
        const twinkle = reduced ? 0.7 : 0.55 + 0.45 * Math.sin(t * 0.02 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x, yy, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.z > 0.75 ? "155,246,255" : "255,255,255"},${twinkle * s.z})`;
        ctx.fill();
      }

      // Matrix data streams
      if (!reduced) {
        ctx.textBaseline = "top";
        for (const st of streams) {
          st.y += st.speed;
          if (st.y - st.chars.length * st.size > h) {
            st.y = -Math.random() * h * 0.5;
            st.x = Math.random() * w;
          }
          ctx.font = `${st.size}px ui-monospace, monospace`;
          for (let i = 0; i < st.chars.length; i++) {
            const cy = st.y - i * st.size;
            if (cy < -st.size || cy > h) continue;
            const a = i === 0 ? 0.5 : 0.18 * (1 - i / st.chars.length);
            ctx.fillStyle = `rgba(0,240,255,${a})`;
            ctx.fillText(st.chars[i], st.x, cy);
          }
          if (Math.random() < 0.04) {
            st.chars[Math.floor(Math.random() * st.chars.length)] =
              STREAM_GLYPHS[Math.floor(Math.random() * STREAM_GLYPHS.length)];
          }
        }
      }

      if (!reduced) {
        // Meteor
        if (meteor) {
          meteor.x += meteor.vx;
          meteor.y += meteor.vy;
          const tailX = meteor.x - meteor.vx * (meteor.len / 8);
          const tailY = meteor.y - meteor.vy * (meteor.len / 8);
          const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, "rgba(155,246,255,0.9)");
          grad.addColorStop(1, "rgba(155,246,255,0)");
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.stroke();
          if (meteor.x > w + 100 || meteor.x < -100 || meteor.y > h + 100) {
            meteor = null;
            meteorTimer = window.setTimeout(spawnMeteor, 12000 + Math.random() * 18000);
          }
        }

        // Particle-bird flock
        if (flock) {
          flockX += flockDir * 2.2;
          for (const b of flock) {
            b.phase += 0.18;
            const wing = Math.sin(b.phase) * 4;
            drawBird(flockX + b.x, flockY + b.y + Math.sin(t * 0.03 + b.phase) * 3, wing);
          }
          if ((flockDir === 1 && flockX > w + 120) || (flockDir === -1 && flockX < -120)) {
            flock = null;
            flockTimer = window.setTimeout(spawnFlock, 45000 + Math.random() * 40000);
          }
        }

        // Orbiting satellite
        if (satellite) {
          satellite.x += satellite.vx;
          satellite.y += satellite.vy;
          satellite.blink += 0.12;
          ctx.strokeStyle = "rgba(120,160,220,0.6)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(satellite.x - 7, satellite.y);
          ctx.lineTo(satellite.x + 7, satellite.y);
          ctx.stroke();
          ctx.fillStyle = "rgba(210,225,255,0.9)";
          ctx.fillRect(satellite.x - 2, satellite.y - 1.5, 4, 3);
          if (Math.sin(satellite.blink) > 0) {
            ctx.fillStyle = "rgba(255,0,85,0.9)";
            ctx.beginPath();
            ctx.arc(satellite.x, satellite.y - 3, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
          if (satellite.x > w + 40 || satellite.x < -40) {
            satellite = null;
            satTimer = window.setTimeout(spawnSat, 40000 + Math.random() * 50000);
          }
        }
      }

      if (!reduced && !document.hidden) {
        raf = requestAnimationFrame(render);
      }
    };

    const onVisibility = () => {
      if (!document.hidden && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    render(); // paints one frame even under reduced-motion

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(meteorTimer);
      clearTimeout(flockTimer);
      clearTimeout(satTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [gpu.ready, gpu.isMobile, gpu.tier, gpu.reducedMotion]);

  return <canvas ref={canvasRef} className="cinematic-bg" aria-hidden="true" />;
}
