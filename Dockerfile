# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Three stages, and the only one that ships is the last.
#
# The reason this is worth doing rather than copying the repo into a node image
# is size on a box with one vCPU and 2 GB of memory. A naive image here is
# around 1.2 GB because node_modules for a Next.js app is roughly 500 MB and
# none of it is needed at runtime. The standalone output traces the modules the
# server actually imports and copies only those, which is the difference
# between an image that redeploys in under a minute on a small droplet and one
# that does not.
#
#   docker build -t balisa-portfolio .
#   docker run --rm -p 3000:3000 balisa-portfolio
# ---------------------------------------------------------------------------

FROM node:22-alpine AS deps
WORKDIR /app
# Only the manifests, so this layer is cached until a dependency actually
# changes. Editing a case study should not reinstall node_modules.
COPY package.json package-lock.json ./
RUN npm ci


FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# build:standalone sets NEXT_OUTPUT=standalone and regenerates the diagram SVGs
# from data/ first, so a build can never ship a stale architecture diagram.
RUN npm run build:standalone


FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Never root. Coolify runs this behind its own proxy, but the container should
# not be the weak link if something else is misconfigured.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Read from disk when a page revalidates, so they have to be in the image.
# standalone tracing does not pick up files opened by path at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/content ./content
COPY --from=builder --chown=nextjs:nodejs /app/docs ./docs
COPY --from=builder --chown=nextjs:nodejs /app/deploy ./deploy

USER nextjs
EXPOSE 3000

# busybox wget, already in the base image. Coolify waits on this before it
# moves traffic to the new container, which is what makes a bad deploy a
# non-event instead of an outage.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
