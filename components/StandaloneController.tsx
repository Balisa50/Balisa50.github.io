"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reflects `?standalone=true` onto <html data-standalone> so CSS can strip the
 * site chrome (see globals.css). This runs on client-side navigations too —
 * the inline guard in StandaloneMode only fires on a full page load, so this
 * covers in-app <Link> clicks from the homepage grid. Renders nothing.
 */
export function StandaloneController() {
  const params = useSearchParams();
  const standalone = params.get("standalone") === "true";

  useEffect(() => {
    const root = document.documentElement;
    if (standalone) root.setAttribute("data-standalone", "true");
    else root.removeAttribute("data-standalone");
    // Leaving the page (e.g. back to the grid) must restore the chrome.
    return () => root.removeAttribute("data-standalone");
  }, [standalone]);

  return null;
}
