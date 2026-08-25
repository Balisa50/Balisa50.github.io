import type { MetadataRoute } from "next";
import { caseStudySlugs, noteSlugs } from "@/lib/mdx";

export const dynamic = "force-static";

const BASE = "https://balisa50.github.io";

/**
 * The old sitemap listed two URLs, because the old site was two URLs.
 *
 * The redirect stubs at /projects and /case-studies are deliberately absent.
 * They exist for links that already went out; pointing a crawler at them would
 * put them in competition with the pages they redirect to.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const fixed: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/work", 0.9, "weekly"],
    ["/stack", 0.7, "monthly"],
    ["/moat", 0.7, "monthly"],
    ["/balisa-agent", 0.6, "monthly"],
    ["/about", 0.7, "monthly"],
    ["/contact", 0.6, "yearly"],
    ["/infra", 0.6, "monthly"],
    ["/infra/deploy", 0.5, "monthly"],
    ["/research/gambia-2074", 0.7, "monthly"]
  ];

  return [
    ...fixed.map(([url, priority, changeFrequency]) => ({
      url: `${BASE}${url}`,
      lastModified: now,
      changeFrequency,
      priority
    })),
    ...caseStudySlugs().map((slug) => ({
      url: `${BASE}/work/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...noteSlugs().map((slug) => ({
      url: `${BASE}/notes/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
