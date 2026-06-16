"use client";

import { useEffect, useState } from "react";

/**
 * A rare cinematic event: every ~90–150s an AI "drone" sweeps a scan line
 * down the whole page. Pure CSS animation toggled by a timer; disabled for
 * reduced-motion and paused while the tab is hidden.
 */
export function DroneScan() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onTimer: ReturnType<typeof setTimeout>;
    let offTimer: ReturnType<typeof setTimeout>;

    const loop = () => {
      onTimer = setTimeout(() => {
        if (!document.hidden) {
          setActive(true);
          offTimer = setTimeout(() => setActive(false), 2600);
        }
        loop();
      }, 90000 + Math.random() * 60000);
    };
    loop();

    return () => {
      clearTimeout(onTimer);
      clearTimeout(offTimer);
    };
  }, []);

  return (
    <div className={`drone-scan${active ? " active" : ""}`} aria-hidden="true">
      <div className="drone-line" />
    </div>
  );
}
