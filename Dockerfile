FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration and tsconfig base
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY packages/ packages/

# Install dependencies for API
RUN pnpm install --filter @volleystack/api...

# Copy source and prisma schema
COPY prisma/ prisma/
COPY apps/api/ apps/api/

# Generate Prisma Client and Build API
RUN npx prisma generate
RUN pnpm --filter @volleystack/api run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copy built artifacts and production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/api/dist/server.js"]
