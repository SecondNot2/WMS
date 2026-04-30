# syntax=docker/dockerfile:1.7

# =============================================================================
# WMS web app — multi-stage Dockerfile
# Build context: monorepo root. Run from project root:
#   docker build -f apps/web/Dockerfile -t wms-web .
# =============================================================================

ARG NODE_VERSION=20-alpine
ARG PNPM_VERSION=10.33.0

# -----------------------------------------------------------------------------
# Stage 1: base — pnpm + corepack on slim Alpine
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
RUN apk add --no-cache libc6-compat openssl \
    && corepack enable \
    && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /repo

# -----------------------------------------------------------------------------
# Stage 2: deps — install workspace dependencies (cached layer)
# -----------------------------------------------------------------------------
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/validations/package.json ./packages/validations/
COPY packages/config/package.json ./packages/config/
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# -----------------------------------------------------------------------------
# Stage 3: builder — generate Prisma client + build Next.js standalone
# -----------------------------------------------------------------------------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /repo/packages ./packages
COPY . .

# Build-time placeholders — Next.js needs these to be set during build,
# but real runtime values come from `docker run -e` / docker-compose.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV DIRECT_URL="postgresql://build:build@localhost:5432/build"
ENV JWT_SECRET="build-time-placeholder-not-used-at-runtime"
ENV JWT_REFRESH_SECRET="build-time-placeholder-not-used-at-runtime"

RUN pnpm --filter @wms/web exec prisma generate \
    && pnpm --filter @wms/web build

# -----------------------------------------------------------------------------
# Stage 4: runner — minimal image with just the standalone server
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
RUN apk add --no-cache libc6-compat openssl tini
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as unprivileged user (UID 1001 matches Next.js docs convention).
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy Next.js standalone server output (includes only required deps).
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public

# Prisma needs schema + generated client + migrations at runtime.
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/prisma ./apps/web/prisma
COPY --from=builder --chown=nextjs:nodejs /repo/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /repo/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs
EXPOSE 3000

# tini handles PID 1 signal forwarding so SIGTERM / Ctrl+C exits cleanly.
ENTRYPOINT ["/sbin/tini", "--"]

# Standalone server lives at apps/web/server.js after Next build.
CMD ["node", "apps/web/server.js"]
