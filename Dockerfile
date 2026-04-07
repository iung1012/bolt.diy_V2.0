# Multi-stage Dockerfile for BoltDIY V2.0

# ================================
# Stage 1: Base Image
# ================================
FROM node:20-slim AS base

ENV PNPM_VERSION=10.18.0
ENV PNPM_HOME=/usr/local/bin
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
COPY --from=build /app/functions ./functions
COPY --from=build /app/wrangler.toml ./wrangler.toml

RUN pnpm add -g wrangler && \
    mkdir -p /root/.config/.wrangler && \
    echo '{"enabled":false}' > /root/.config/.wrangler/metrics.json

EXPOSE 8788

# Startup script: build bindings from env vars and start wrangler
CMD ["sh", "-c", "\
  BINDINGS=''; \
  for var in ANTHROPIC_API_KEY OPENAI_API_KEY GOOGLE_API_KEY DEEPSEEK_API_KEY XAI_API_KEY MISTRAL_API_KEY \
             SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY \
             VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY VITE_LOG_LEVEL; do \
    val=$(eval echo \"\\$$var\"); \
    if [ -n \"$val\" ]; then BINDINGS=\"$BINDINGS --binding ${var}=${val}\"; fi; \
  done; \
  wrangler pages dev ./build/client $BINDINGS --port 8788 --ip 0.0.0.0 --no-show-interactive-dev-session \
"]
