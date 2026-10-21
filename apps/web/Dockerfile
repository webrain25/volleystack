FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/ packages/

# Install dependencies
RUN pnpm install --filter web...

# Copy source
COPY apps/web/ apps/web/

# Build
ENV VITE_API_URL=/api
RUN pnpm --filter web run build

# Production image uses Caddy to serve static files
FROM caddy:2.7-alpine AS runner
WORKDIR /srv

COPY --from=builder /app/apps/web/dist /srv
# The Caddyfile will be mounted from the host via docker-compose
