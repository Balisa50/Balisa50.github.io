/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // static HTML export for GitHub Pages
  trailingSlash: true,       // /about → /about/index.html
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,       // required for static export
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" }
    ]
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["warn", "error", "info"] }
        : false
  }
  // Note: headers() is not supported with output: 'export'
  // Security headers are handled by the GitHub Pages CNAME / CDN layer
};

module.exports = nextConfig;
