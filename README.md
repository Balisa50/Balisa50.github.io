# balisa50.github.io

The portfolio of Abdoulie Balisa. Eleven projects, each with an architecture diagram, the decisions behind it, and a write-up of something that broke.

It builds three ways from one source tree: a container for a VPS, a normal server build for a platform, and static HTML for a free host. That is not over-engineering for its own sake. It is the point of the thing, and it is explained below.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## The routes

| Route | What it is |
| --- | --- |
| `/` | The ring, and four projects worth reading first |
| `/work` | All eleven, filterable by stack and by status |
| `/work/[slug]` | The deep dive: diagram, trade-offs, post-mortem, live probe, full memo |
| `/stack` | What I use, grouped, with where each piece actually runs |
| `/moat` | What is hard to copy about this work, and where that claim stops |
| `/balisa-agent` | An offline voice assistant, written and not yet run |
| `/about` | Why any of it exists |
| `/contact` | Email and phone, deliberately not on the home page |
| `/infra` | The droplet, the containers, the pipeline, the bill |
| `/infra/deploy` | Deploy to a VPS with Coolify in five minutes |
| `/notes/vercel-to-vps` | Why I moved, including the parts where the platform wins |

## Scripts

```bash
npm run dev              # dev server
npm run build            # server build, for a platform or for local `npm start`
npm run build:standalone # the build the Dockerfile runs
npm run build:static     # static HTML into out/, for GitHub Pages
npm run diagrams         # regenerate the architecture SVGs from data/
npm run audio            # regenerate the hero voiceover (needs edge-tts)
npm run probe            # refresh data/metrics-snapshot.json
npm run typecheck
```

Every build runs the diagram and audio generators first, so no build can ship a page whose diagram is stale.

## Generated, not hand-drawn

The architecture diagrams are laid out at build time by `scripts/generate-diagrams.mjs`, which reads a JSON description of each system from `data/architecture/` and writes SVG into `public/diagrams/` plus a TypeScript module the pages inline.

Mermaid was the obvious choice and is not what this does. Mermaid renders in the browser, which means shipping a large parser to every visitor so their phone can lay out a diagram that is identical for everyone and has not changed since the commit. Doing it once at build time costs nothing at runtime, keeps the labels selectable and searchable, and lets the SVG inherit the page's own colour tokens in both the light page and the dark hero.

To add one: drop a file in `data/architecture/`, run `npm run diagrams`, and reference it as `<Architecture />` in that project's MDX. A missing diagram throws at build time rather than rendering an empty box nobody notices.

## The voiceover

`scripts/generate-hero-audio.mjs` produces `public/audio/hero.mp3` with [edge-tts](https://github.com/rany2/edge-tts), which is free and needs no key.

The mp3 is committed, because the build machines do not have Python. If edge-tts is missing the script logs and exits zero and the committed file ships unchanged. To regenerate after changing the line:

```bash
pip install edge-tts
npm run audio
```

It does not autoplay, and it is not going to. Browsers block unmuted autoplay, so the version that "works" is a muted clip nobody hears, and the version that gets through on a permissive browser is a stranger's voice in a quiet room. There is a transcript in the markup for anyone who would rather read it.

## The money, plainly

The droplet costs 6 to 12 US dollars a month. I am a student, that is real money, and this repository is built so that not paying it does not take the site offline.

Everything else in the deployment stack is open source and free: Coolify, Docker, Traefik, Uptime Kuma, Postgres, Next.js. The machine is the only line item.

**Two free fallbacks, both fully wired:**

1. **Vercel.** Import the repository and accept the defaults. Route handlers and revalidation both work, so nothing is missing.
2. **GitHub Pages.** Already configured in `.github/workflows`. It runs `npm run build:static`, which sets `NEXT_OUTPUT=export` and writes static HTML to `out/`.

The static build has no server, so the live probe on each project page cannot run. Rather than print nothing or invent a number, it falls back to the measurement committed in `data/metrics-snapshot.json` and shows the date it was taken. Refresh that with `npm run probe`.

That fallback is the honest part. A feature that disappears loudly, and says which mode it is in, is fine. One that quietly starts lying is not.

## Deploying to the VPS

Full guide with the failure modes: [`docs/DEPLOY-COOLIFY.md`](docs/DEPLOY-COOLIFY.md), also readable on the site at `/infra/deploy`.

```bash
docker build -t balisa-portfolio .
docker run --rm -p 3000:3000 balisa-portfolio
```

The Dockerfile is a three-stage build on `node:22-alpine`: dependencies, build, then a runner carrying only the standalone output and running as a non-root user. `deploy/docker-compose.prod.yml` documents the whole box and is the escape hatch if Coolify ever becomes the problem rather than the solution. The `docker-compose.yml` in the root is local development with hot reload, which exists because my machine is Windows and the droplet is Ubuntu, and that difference has bitten me before.

## Structure

```
app/                 routes
components/
  site/              nav, footer, hero, page header, transitions
  work/              project index and rows
  mdx/               trade-offs, post-mortems, the engineering memo
  ui/                shadcn primitives
content/
  work/              eleven case studies as MDX
  notes/             longer-form writing
data/
  architecture/      one JSON per system, input to the diagram generator
  stack.json         input to the stack explorer and its diagram
  infra.json         droplet specs, services, pipeline, costs
  metrics-snapshot.json   committed probe results, the static-build fallback
docs/                the deploy guide
lib/                 projects, case studies, MDX loading, metrics, nav
scripts/             build entrypoint, diagram generator, audio, probe
deploy/              production compose
```

`lib/projects.ts` and `lib/case-studies.ts` are the source of truth for the structured content. The MDX on top of each case study is where a project gets to be different; the memo underneath is where they are comparable.

## Why the portfolio is one of the projects

There is no chatbot on this site. A chatbot on a portfolio demonstrates an API key, not engineering, and the advice to leave it out was right.

What is here instead is the same constraint every project on it was built under. It runs on one small machine or on nothing. It lays out its diagrams at build time because a runtime library would cost every visitor bandwidth for a picture that never changes. It measures response times itself and tells you when the number is stale rather than pretending it is live. If the bill goes unpaid it degrades to static HTML on a free host, and says so on the page.

That is the argument the whole site is making, made once more in its own deployment.
