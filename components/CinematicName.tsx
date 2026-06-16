"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@><*/+=";

/**
 * The name as a holographic readout. A shimmer + scan line run continuously
 * (CSS), and every 9–18s the letters briefly "reconstruct" — scrambling
 * through glyphs with an RGB-split glitch before locking back in.
 * Reduced-motion renders the plain shimmering name with no scramble.
 */
export function CinematicName({ name }: { name: string }) {
  const letters = useRef(name.split(""));
  const [display, setDisplay] = useState<string[]>(name.split(""));
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    letters.current = name.split("");
    setDisplay(name.split(""));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scrambleTimer: ReturnType<typeof setInterval> | undefined;
    let scheduleTimer: ReturnType<typeof setTimeout> | undefined;

    const runGlitch = () => {
      const chars = letters.current;
      const maxFrames = 14;
      let frame = 0;
      setGlitch(true);
      scrambleTimer = setInterval(() => {
        frame++;
        setDisplay(
          chars.map((ch, i) => {
            if (ch === " ") return " ";
            // Letters lock in left-to-right as frames progress.
            const lockAt = Math.floor((i / chars.length) * maxFrames * 0.55) + 4;
            if (frame >= lockAt) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
        );
        if (frame >= maxFrames) {
          clearInterval(scrambleTimer);
          setDisplay(chars);
          setGlitch(false);
        }
      }, 50);
    };

    const schedule = () => {
      scheduleTimer = setTimeout(() => {
        if (!document.hidden) runGlitch();
        schedule();
      }, 9000 + Math.random() * 9000);
    };
    schedule();

    return () => {
      clearInterval(scrambleTimer);
      clearTimeout(scheduleTimer);
    };
  }, [name]);

  return (
    <span className="cinematic-name" data-glitch={glitch || undefined} aria-label={name}>
      <span className="name-scan" aria-hidden="true" />
      <span aria-hidden="true">
        {display.map((ch, i) => (
          <span key={i}>{ch === " " ? " " : ch}</span>
        ))}
      </span>
    </span>
  );
}
