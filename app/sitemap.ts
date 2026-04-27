import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://balisa50.github.io/portfolio";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/api/resume`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];
}
