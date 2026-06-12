# Runnable Examples

Small, self-contained Node.js scripts that accompany the lessons. They use the official
`node-redis` client and share one connection via [`redisClient.js`](./redisClient.js).

## Setup
```bash
# 1. Make sure Redis is running (Docker is easiest)
docker run --name redis -p 6379:6379 -d redis:7

# 2. Install dependencies
npm install
```

Point at a non-default server with `REDIS_URL`:
```bash
REDIS_URL=redis://:password@host:6379 node cache-aside.js
```

## Run
| Command | Lesson | What it shows |
|---------|--------|---------------|
| `npm run cache` | 05 | Cache-aside: slow DB call vs fast cache hit |
| `npm run ratelimit` | 07 / 10 | Atomic Lua rate limiter (5 req / 10s) |
| `npm run pubsub` | 06 | Publish/subscribe messaging |
| `npm run session` | 10 | Express sessions stored in Redis (open http://localhost:3000) |
| `npm run vector` | 11 | Vector KNN search (**needs Redis Stack** — see note below) |

> **`vector-search.js` requires Redis Stack**, not plain `redis:7`:
> ```bash
> docker run --name redis-stack -p 6379:6379 -p 8001:8001 -d redis/redis-stack:latest
> ```
> It uses tiny fake embeddings so it runs with no external API.

Each script connects, demonstrates the pattern, and exits cleanly with `client.quit()`
(except the Express server, which stays up until you press Ctrl+C).
