import { PROJECTS } from "./projects";

export interface RepoStars {
  slug: string;
  repo: string;
  stars: number | null;
  source: "api" | "fallback";
}

const GITHUB_API = "https://api.github.com";

/**
 * Fetch star counts for every project in parallel. Any single failure falls
 * back to the hand-set `fallbackStars` on the project record. Never throws,
 * the portfolio must render even if GitHub is down or rate-limited.
 */
export async function fetchAllStars(): Promise<RepoStars[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "balisa-portfolio"
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const results = await Promise.allSettled(
    PROJECTS.map(async (p) => {
      const res = await fetch(`${GITHUB_API}/repos/${p.githubRepo}`, {
        headers,
        // Next 15: revalidate every hour
        next: { revalidate: 3600 }
      });
      if (!res.ok) throw new Error(`${p.githubRepo}: ${res.status}`);
      const data = (await res.json()) as { stargazers_count?: number };
      return {
        slug: p.slug,
        repo: p.githubRepo,
        stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
        source: "api" as const
      };
    })
  );

  return results.map((r, i) => {
    const p = PROJECTS[i];
    if (r.status === "fulfilled" && r.value.stars != null) return r.value;
    return {
      slug: p.slug,
      repo: p.githubRepo,
      stars: p.fallbackStars,
      source: "fallback" as const
    };
  });
}
