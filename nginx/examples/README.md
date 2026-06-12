# Nginx Examples

A runnable stack where **Nginx** is the front door to a **Node + Redis** app — exactly the
production shape from [Lesson 08](../08-nginx-with-docker-and-production.mdx).

```
examples/
  docker-compose.yml      # nginx + api (Node) + redis
  conf.d/
    default.conf          # the active Nginx site: static + /api proxy + rate limit + headers
    load-balanced.conf.example   # optional load-balancing variant (Lesson 05)
  html/
    index.html            # static frontend served directly by Nginx
  node-app/               # the Express + Redis API (app.js, Dockerfile, package.json)
```

## Run it
```bash
docker compose up -d

open http://localhost            # static page (served by Nginx)
curl http://localhost/api/       # {"message":"Hello via Nginx reverse proxy!","hits":1,...}
curl http://localhost/healthz    # ok   (Nginx health endpoint)

docker compose down              # add -v to also wipe the redis-data volume
```
Click the button on the page to call `/api/` and watch the Redis-backed counter increase.

## What to notice
- **Only Nginx publishes a port** (`80`). The Node `api` uses `expose`, so it's reachable
  **only through Nginx** over the Compose network — the host can't hit it directly.
- Nginx reaches the backend by **service name** (`api:3000`) via the `upstream` block.
- The single config does a lot: static SPA serving with `try_files` fallback, `/api/`
  reverse proxy with the correct `X-Forwarded-*` headers, gzip, rate limiting, security
  headers, and a health endpoint.
- The app sets `trust proxy`, so `req.ip` reflects the real client via `X-Forwarded-For`.

## Try the load balancer (Lesson 05)
```bash
# Scale the API to 3 replicas; Compose's DNS round-robins the "api" service name.
docker compose up -d --scale api=3
# (optionally swap in conf.d/load-balanced.conf.example for least_conn + tuning)
```

## Reload config without downtime
```bash
# After editing conf.d/default.conf:
docker compose exec nginx nginx -t        # validate first
docker compose exec nginx nginx -s reload # apply with zero downtime
```

## Run the API locally without Docker (optional)
```bash
cd node-app && npm install
# needs Redis on localhost:6379
npm start
```
