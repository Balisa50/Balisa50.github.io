import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/case-studies";
import { PROJECTS } from "@/lib/projects";

export const dynamic = "force-static";

const BASE = "https://balisa50.github.io";

// Top-level routes. /projects redirects to /work, so it is not listed —
// a redirect in the sitemap is a soft 404 signal.
const ROUTES = ["/", "/work", "/papers", "/about", "/contact", "/case-studies"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only list a /case-studies/<slug>/ URL when a study actually exists for it.
  const studiesWithContent = PROJECTS.filter((p) => CASE_STUDIES[p.slug]);

  return [
    ...ROUTES.map((path) => ({
      url: `${BASE}${path}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8
    })),
    ...studiesWithContent.map((p) => ({
      url: `${BASE}/case-studies/${p.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    {
      url: `${BASE}/api/resume`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5
    }
  ];
}
