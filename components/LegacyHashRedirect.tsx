"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Sends old one-page links to the route that replaced them.
 *
 * The site was a single page until September 2026, so links like
 * balisa50.github.io/#projects are already out there in messages, on LinkedIn
 * and in applications. On a static export there is no server to redirect them,
 * and a bare fragment now matches nothing, so those links would quietly land on
 * the intro and look like the section had been deleted.
 *
 * Runs on the intro page only, and only when a fragment is actually present.
 * Replaces the history entry rather than pushing, so Back still leaves the site
 * instead of bouncing between the fragment and its destination.
 */
const MOVED: Record<string, string> = {
  "#projects": "/work",
  "#work": "/work",
  "#papers": "/papers",
  "#skills": "/about",
  "#stack": "/about",
  "#about": "/about",
  "#experience": "/about",
  "#education": "/about",
  "#certifications": "/about",
  "#contact": "/contact"
};

export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const target = MOVED[window.location.hash.toLowerCase()];
    if (target) router.replace(target);
  }, [router]);

  return null;
}
