"use client";

import { useEffect, useState } from "react";

/**
 * Fires `true` after `delayMs` of no user interaction. Resets on any
 * pointer/keyboard/touch activity. Good for a "still here? let's talk" CTA.
 */
export function useIdleCTA(delayMs = 12_000): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let dismissed = false;

    const arm = () => {
      if (dismissed) return;
      if (timer) clearTimeout(timer);
      setIdle(false);
      timer = setTimeout(() => {
        dismissed = true;
        setIdle(true);
      }, delayMs);
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "pointerdown"
    ];
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [delayMs]);

  return idle;
}
