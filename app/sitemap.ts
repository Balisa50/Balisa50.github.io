import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/case-studies";

export const dynamic = "force-static";

/**
 * The five nav routes replaced five fragments on one page in September 2026.
 * A fragment was never a separate URL, so this file used to list exactly one
 * page; each section is now indexable on its own and has to be declared.
 */
const ROUTES = ["/", "/work", "/papers", "/stack", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://balisa50.github.io";
  const now = new Date();

  return [
    ...ROUTES.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8
    })),
    ...Object.keys(CASE_STUDIES).flatMap((slug) => [
      {
        url: `${base}/projects/${slug}/`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7
      },
      {
        url: `${base}/case-studies/${slug}/`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6
      }
    ]),
    {
      url: `${base}/api/resume`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];
}
