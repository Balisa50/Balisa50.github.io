# Portfolio

Dark-mode, WebGL-powered personal site. Next.js 15 (App Router) + TypeScript + Tailwind + React Three Fiber + Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's inside

| Area | Stack |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TS strict |
| Styling | Tailwind CSS, glassmorphic card system |
| 3D | Three.js + @react-three/fiber (500-particle brain, spring physics, scroll-linked dissolve) |
| Motion | Framer Motion, Intersection Observer scroll reveals |
| Icons | lucide-react |

## Features

- **GPU tier detection** (`hooks/useGPUTier.ts`). Falls back to a static SVG brain on mobile, low-tier GPUs, or when the OS reports `prefers-reduced-motion`.
- **Error boundary** around the WebGL canvas so a runtime blip can't blank the page.
- **GitHub stars API route** with 1h revalidation and graceful fallback to hand-set counts if rate-limited or offline.
- **JSON résumé** at `/api/resume`, cached 24h.
- **Status endpoint** at `/api/status`.
- **Console greeting**, **Konami code** (↑↑↓↓←→←→ B A) opens a hidden roadmap, and an **idle CTA** that fades in after 12 seconds of no interaction.
- **Service worker** cache-first for static assets; skips `/api/*` and `/_next/*`.
- **Accessibility**: skip link, focus rings, 44×44 min touch targets, reduced-motion short-circuits every animation.

## API

- `GET /api/github/stars`: star counts for the featured repos (cached 1h).
- `GET /api/resume`: JSON resume (cached 24h, CORS open).
- `GET /api/status`: project shipping status.

## Deploy

Built for Vercel. Just `vercel deploy`. Optional `GITHUB_TOKEN` env var raises the GitHub rate limit.

## Project structure

```
app/              Next.js App Router (pages + API routes + sitemap)
components/       UI (Hero, HeroParticles, ProjectsGrid, …)
hooks/            useGPUTier, useIdleCTA, useScrollReveal, useKonami
lib/              projects data, github client, utils
public/           favicon, manifest, service worker, robots
```
