# Multi-stage, production-oriented image for the Node app (Lessons 03, 04, 07).
# Build context is the node-app/ folder (see docker-compose.yml / build instructions).

# ---- Stage 1: install dependencies ----
FROM node:20-alpine AS builder
WORKDIR /app
# Copy manifests first so this layer stays cached unless deps change.
COPY package*.json ./
RUN npm install
COPY . .

# ---- Stage 2: lean production runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install ONLY production dependencies, then clean the cache.
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Bring in the application source from the builder stage.
COPY --from=builder /app/app.js ./app.js

# Run as the unprivileged "node" user that ships with the image.
USER node

EXPOSE 3000

# Healthcheck hits the /health endpoint.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Exec form so Node receives SIGTERM for graceful shutdown.
CMD ["node", "app.js"]
