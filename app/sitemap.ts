import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://balisa.dev";
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
