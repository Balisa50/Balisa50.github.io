"use client";

import { useEffect, useState } from "react";

export type GPUTier = "high" | "medium" | "low";

export interface GPUTierInfo {
  tier: GPUTier;
  isMobile: boolean;
  reducedMotion: boolean;
  shouldUseWebGL: boolean;
  ready: boolean;
}

const DEFAULT: GPUTierInfo = {
  tier: "medium",
  isMobile: false,
  reducedMotion: false,
  shouldUseWebGL: false,
  ready: false
};

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

function detectMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return true;
  // Tablet/phone viewport heuristic as a second signal
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) return true;
  return false;
}

function detectTier(): GPUTier {
  if (typeof navigator === "undefined") return "medium";

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;

  // Try a quick WebGL probe
  let rendererHint = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return "low";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbg) {
      rendererHint = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "").toLowerCase();
    }
  } catch {
    return "low";
  }

  // Known-weak renderers → low
  if (/swiftshader|llvmpipe|software/.test(rendererHint)) return "low";

  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4 && memory >= 4) return "medium";
  return "low";
}

/**
 * Detects device capability + user preferences to decide whether the
 * portfolio should mount a full WebGL scene or a static fallback.
 *
 * SSR-safe: returns `ready=false` with conservative defaults until mounted.
 */
export function useGPUTier(): GPUTierInfo {
  const [info, setInfo] = useState<GPUTierInfo>(DEFAULT);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = detectMobile();
    const tier = detectTier();
    const shouldUseWebGL = !isMobile && !reducedMotion && tier !== "low";

    setInfo({
      tier,
      isMobile,
      reducedMotion,
      shouldUseWebGL,
      ready: true
    });

    // Respond live to reduced-motion toggles (OS-level)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () =>
      setInfo((prev) => ({
        ...prev,
        reducedMotion: mq.matches,
        shouldUseWebGL: !prev.isMobile && !mq.matches && prev.tier !== "low"
      }));
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return info;
}
