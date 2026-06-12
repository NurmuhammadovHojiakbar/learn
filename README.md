# Learn — A Developer's Practical Course Library

Hands-on, project-focused courses that take you from fundamentals to production. Each
course is a set of numbered `.mdx` lessons plus **runnable examples**, written in a
consistent style: concepts → real code → pitfalls → best practices → a "Try it yourself"
exercise.

The courses are designed to **interlock** — you build a Node.js app on a Postgres database,
give it a Redis cache, containerize it with Docker, front it with Nginx, ship it with
CI/CD, and operate it with an observability stack.

```
   DATA LAYER                 PACKAGE & SHIP                       OPERATE
 ┌──────────┐ ┌───────┐   ┌────────┐ ┌───────┐ ┌────────┐   ┌──────────────┐
 │ Postgres │ │ Redis │─▶ │ Docker │ │ Nginx │ │ CI/CD  │─▶ │ Observability│
 │ store    │ │ cache │   │package │ │ front │ │  ship  │   │   operate    │
 └──────────┘ └───────┘   └────────┘ └───────┘ └────────┘   └──────────────┘
  source of    fast cache  containerize front  test&deploy   metrics·logs·traces
  truth
```

---

## Courses

### 🐘 [PostgreSQL](./postgres/README.md) — the relational database
Store your data with integrity: SQL fundamentals, schema design & relationships, joins &
aggregation, indexing & performance, transactions & concurrency, and production use with
Node.js (`pg`) plus Redis caching.
**8 lessons + a runnable Node + Postgres + Redis app.**

> Start here for the source-of-truth data layer everything else builds on.

### 🔴 [Redis](./redis/README.md) — in-memory data & caching
Use Redis to make apps fast: data types, caching patterns, pub/sub & streams, transactions,
persistence, scaling, vector search, and production use with Node.js (`node-redis`).
**11 lessons + runnable examples.**

> Start here if you're building the app's data/cache layer.

### 🐳 [Docker](./docker/README.md) — containers & images
Package and run apps anywhere: images vs containers, Dockerfiles & layer caching,
multi-stage builds, volumes & networking, Docker Compose, security, and orchestration.
**8 lessons + a runnable Node + Redis stack.**

> Start here if you want consistent environments and deployable artifacts.

### 🌐 [Nginx](./nginx/README.md) — reverse proxy & web server
Put a fast, secure front door on your app: serving static sites, reverse-proxying and
load-balancing a Node backend, HTTPS/TLS termination, caching, compression, and rate
limiting — running in front of the Docker stack.
**8 lessons + a runnable Nginx → Node → Redis stack.**

> Start here once you have an app to expose safely to the internet.

### ⚙️ [CI/CD](./ci-cd/README.md) — automated testing & delivery
Ship with confidence using GitHub Actions: workflows, build & test pipelines, matrix builds
+ service containers, secrets & environments, building/publishing Docker images, and gated
deploys with rollbacks. **8 lessons + ready-to-use workflows.**

> Start here once you have an app and image to automate.

### 📊 [Observability](./observability/README.md) — operate what you shipped
Know what your app is doing in production: structured logging (pino), metrics (Prometheus),
dashboards (Grafana), alerting & SLOs, and distributed tracing (OpenTelemetry + Jaeger).
**8 lessons + a runnable app → Prometheus → Grafana → Jaeger stack.**

> Start here once your app is live and you need to monitor and debug it.

---

## Suggested learning paths

**Full stack-to-ship path (recommended):**
1. **PostgreSQL** 01–04 — model and query the app's data (the source of truth).
2. **Redis** 01–05 — add caching in front of Postgres.
3. **Docker** 01–06 — containerize the app + dependencies.
4. **Nginx** 01–04 — front the app with a reverse proxy.
5. **CI/CD** 01–06 — automate lint/test/build and publish the image.
6. **CI/CD** 07–08 + **Docker** 07–08 + **Nginx** 05–08 — deploy, load-balance, add TLS,
   harden, and operate it.
7. **Observability** 01–08 — instrument the running app with metrics, logs, traces, and
   alerts so you can operate it.
8. Go deeper as needed: **PostgreSQL** 05–08 (indexing, transactions, production) and
   **Redis** 06–11 (pub/sub, scaling, vector search).

**Just need a database?** PostgreSQL 01–04 + 07.
**Just need caching?** Redis 01–05 + 10 (production patterns).
**Just need to containerize?** Docker 01–06.
**Just need a reverse proxy / HTTPS?** Nginx 01–04 + 06.
**Just automating an existing app?** CI/CD 01–06.
**Just need monitoring/alerts?** Observability 01–06.

---

## How to use this library
- Read each course's lessons in order; they build on each other.
- Keep the relevant service running and run every command/example as you go:
  - Redis / Docker examples need **Docker** installed.
  - CI/CD workflows run once copied into a repo's `.github/workflows/`.
- The example apps are intentionally tiny so you can focus on the concept, not the app.

## Prerequisites
- Comfort with a terminal and basic **Node.js** (the example stack throughout).
- **Docker** installed for the Redis and Docker courses
  ([install guide](./docker/01-introduction.mdx)).
- A **GitHub** account for the CI/CD course.

---

## At a glance
| Course | Lessons | Example stack | You'll be able to… |
|--------|:-------:|---------------|--------------------|
| [PostgreSQL](./postgres/README.md) | 8 | Node + `pg` + Redis | Design schemas, write fast SQL, run it in prod |
| [Redis](./redis/README.md) | 11 | Node + `node-redis` | Cache, rank, queue, pub/sub, vector-search |
| [Docker](./docker/README.md) | 8 | Node + Redis | Containerize and run multi-service apps |
| [Nginx](./nginx/README.md) | 8 | Nginx + Node + Redis | Reverse-proxy, load-balance, and TLS your app |
| [CI/CD](./ci-cd/README.md) | 8 | GitHub Actions | Auto-test, build images, and deploy safely |
| [Observability](./observability/README.md) | 8 | Prometheus + Grafana + Jaeger | Monitor, dashboard, alert, and trace in prod |
