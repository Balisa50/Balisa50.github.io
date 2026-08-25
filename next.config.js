/** @type {import('next').NextConfig} */

/**
 * One codebase, three deploy targets.
 *
 *   NEXT_OUTPUT=standalone  → Docker image on the VPS (Coolify). The real home.
 *   NEXT_OUTPUT=export      → static HTML for GitHub Pages. The zero-cost fallback
 *                             while the droplet is not paid for.
 *   unset                   → Vercel, or `next dev` locally.
 *
 * The site is written so the static build loses features rather than breaking:
 * route handlers are all `force-static`, and anything that needs a live request
 * (the uptime probe) falls back to a committed snapshot when the endpoint 404s.
 */
const mode = process.env.NEXT_OUTPUT;

const nextConfig = {
  output: mode === "export" ? "export" : mode === "standalone" ? "standalone" : undefined,

  // Kept on for every target, not just the static one. GitHub Pages needs it to
  // resolve /work/ to work/index.html, and matching it everywhere else means a
  // link copied off one host still resolves on the others.
  trailingSlash: true,

  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    // No sharp in the Docker image and none needed: every raster on the site is
    // a pre-sized matplotlib PNG or a screenshot.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" }
    ]
  },

  env: {
    // Client components read this to decide whether probing /api is worth the
    // round trip. On Pages there is no server, so they go straight to snapshot.
    NEXT_PUBLIC_BUILD_TARGET: mode ?? "server"
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["warn", "error", "info"] }
        : false
  }
};

module.exports = nextConfig;
