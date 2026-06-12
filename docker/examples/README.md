# Docker Examples

A tiny Express + Redis app you can containerize and run, used throughout the lessons.

```
examples/
  node-app/            # the app (app.js, package.json, .dockerignore)
  Dockerfile           # multi-stage, non-root, alpine (Lessons 03/04/07)
  .dockerignore        # reference copy (the build uses node-app/.dockerignore)
  docker-compose.yml   # Node + Redis stack (Lesson 06)
```

## Run the whole stack with Compose (easiest)
```bash
docker compose up -d
curl localhost:3000          # {"message":"Hello from Docker!","visits":1}
curl localhost:3000/health   # {"status":"ok"}
docker compose logs -f api
docker compose down          # add -v to also delete the redis-data volume
```
The API reaches Redis at `redis://redis:6379` — `redis` is the **service name**, resolved
by Compose's built-in network.

## Build & run just the image
```bash
# Build using the app folder as context
docker build -f Dockerfile -t node-demo ./node-app

# It needs a Redis to talk to — start one on a shared network:
docker network create appnet
docker run -d --name redis --network appnet redis:7-alpine
docker run -d --name api --network appnet -p 3000:3000 \
  -e REDIS_URL=redis://redis:6379 node-demo

curl localhost:3000
docker rm -f api redis && docker network rm appnet   # cleanup
```

## Things to notice
- **Multi-stage build** → the final image is alpine-based and ships only production deps.
- **`USER node`** → `docker exec -it api whoami` prints `node`, not `root`.
- **Healthcheck** → `docker ps` shows the container as `healthy`.
- **Graceful shutdown** → `docker stop` lets Node close connections cleanly.

## Run locally without Docker (optional)
```bash
cd node-app && npm install
# needs a Redis on localhost:6379
npm start
```
