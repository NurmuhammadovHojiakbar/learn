# Nginx & Reverse Proxies — A Practical Course

A hands-on course on **Nginx**, the web server and reverse proxy that sits in front of most
production apps. By the end you'll be able to serve static sites, reverse-proxy and
load-balance a **Node.js** app, terminate **HTTPS/TLS**, and run Nginx in front of the
containerized app from the [Docker course](../docker/README.md).

## Who this is for
Developers who want to put a real front door on their app — routing, TLS, compression,
caching, rate limiting, and load balancing — instead of exposing a bare Node process.

> Pairs with the [Docker](../docker/README.md) course (we containerize Nginx + Node + Redis)
> and the [CI/CD](../ci-cd/README.md) course (which ships the whole stack).

## What is Nginx?
Nginx (“engine-x”) is a high-performance, event-driven server that does several jobs:
- **Web server** — serve static files (HTML, CSS, JS, images) extremely fast.
- **Reverse proxy** — forward requests to backend apps (your Node server) and return their
  responses.
- **Load balancer** — spread traffic across multiple backend instances.
- **TLS terminator** — handle HTTPS so your app doesn't have to.
- **Gateway** — compression, caching, rate limiting, security headers, routing.

```
        ┌──────────────────── Nginx ────────────────────┐
 Client │ TLS · gzip · cache · rate-limit · routing      │
 ──────▶│                                                │──▶ Node app(s)
  :443  │ static files served directly ───────────────┐ │──▶ /api → backend
        └──────────────────────────────────────────────┴─┘
```

## How to use this course
1. Read the lessons in order — they build up a real config.
2. Run Nginx in Docker and edit configs live:
   ```bash
   docker run --name nginx -p 8080:80 -d nginx
   curl localhost:8080        # the default welcome page
   ```
3. Build the [`examples/`](./examples) stack — Nginx reverse-proxying a Node + Redis app.

## Table of contents
| # | Lesson | What you'll learn |
|---|--------|-------------------|
| 01 | [Introduction & Setup](./01-introduction.mdx) | What Nginx is, install/run, request flow |
| 02 | [Configuration Basics](./02-configuration-basics.mdx) | nginx.conf structure, contexts, directives, reload |
| 03 | [Serving Static Sites](./03-serving-static-sites.mdx) | root, index, try_files, SPA routing, cache headers |
| 04 | [Reverse Proxy](./04-reverse-proxy.mdx) | proxy_pass to a Node app, headers, WebSockets |
| 05 | [Load Balancing](./05-load-balancing.mdx) | upstream blocks, algorithms, health, scaling |
| 06 | [HTTPS & TLS](./06-https-and-tls.mdx) | Certificates, Let's Encrypt, HTTP→HTTPS, modern TLS |
| 07 | [Performance & Security](./07-performance-and-security.mdx) | gzip, caching, rate limiting, headers, hardening |
| 08 | [Nginx with Docker & Production](./08-nginx-with-docker-and-production.mdx) | Containerized Nginx in front of Node + Redis |

## Quick reference cheat sheet
```bash
nginx -t                       # test the configuration for syntax errors
nginx -s reload                # reload config with zero downtime
nginx -s quit                  # graceful shutdown
nginx -v                       # version

# config lives here (typical Linux install)
/etc/nginx/nginx.conf          # main config
/etc/nginx/conf.d/*.conf       # drop-in site configs
/etc/nginx/sites-available/    # (Debian) server blocks, symlinked into sites-enabled/

# logs
/var/log/nginx/access.log
/var/log/nginx/error.log
```
