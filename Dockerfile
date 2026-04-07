# Multi-stage Dockerfile for BoltDIY V2.0

# ================================
# Stage 1: Base Image
# ================================
FROM node:20-slim AS base

ENV PNPM_VERSION=10.18.0
RUN npm install -g pnpm@${PNPM_VERSION}

WORKDIR /app

# ================================
# Stage 2: Dependencies
# ================================
FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ================================
# Stage 3: Build
# ================================
FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ================================
# Stage 4: Development
# ================================
FROM base AS development

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 5173
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]

# ================================
# Stage 5: Production (default)
# ================================
FROM base AS production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/wrangler.toml ./wrangler.toml
COPY --from=build /app/bindings.sh ./bindings.sh

RUN pnpm add -g wrangler && \
    mkdir -p /root/.config/.wrangler && \
    echo '{"enabled":false}' > /root/.config/.wrangler/metrics.json

EXPOSE 8788

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8788', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["sh", "-c", "wrangler pages dev ./build/client --port 8788 --ip 0.0.0.0 --no-show-interactive-dev-session"]
