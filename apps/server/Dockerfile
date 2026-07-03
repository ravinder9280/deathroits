# syntax=docker/dockerfile:1.7


# ---------- Base: pnpm via corepack ----------
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    CI=true
RUN corepack enable
WORKDIR /repo

# ---------- Install workspace deps (cached on manifests) ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter server...

# ---------- Build: prisma generate + esbuild bundle ----------
FROM deps AS build
COPY apps/server apps/server
RUN pnpm --filter server build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm --filter server --prod --legacy deploy /prod

# ---------- Runtime: slim image, prod deps only ----------
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY --from=build /prod/node_modules ./node_modules
COPY --from=build /repo/apps/server/dist ./dist
COPY --from=build /repo/apps/server/prisma ./prisma
COPY --from=build /repo/apps/server/package.json ./package.json

USER node
EXPOSE 5000
CMD ["node", "dist/main.js"]