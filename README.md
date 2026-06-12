# Learn — A Developer's Practical Course Library

Hands-on, project-focused courses that take you from fundamentals to production. Each
course is a set of numbered `.mdx` lessons plus **runnable examples**, written in a
consistent style: concepts → real code → pitfalls → best practices → a "Try it yourself"
exercise.

The courses are designed to **interlock** — you build a Node.js app, give it a Redis cache,
containerize it with Docker, and ship it automatically with CI/CD.

```
   ┌─────────┐    ┌─────────┐    ┌─────────┐
   │  Redis  │ ─▶ │ Docker  │ ─▶ │  CI/CD  │
   │  cache  │    │ package │    │  ship   │
   └─────────┘    └─────────┘    └─────────┘
   build the app   containerize   test & deploy
```

---

## Courses

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

### ⚙️ [CI/CD](./ci-cd/README.md) — automated testing & delivery
Ship with confidence using GitHub Actions: workflows, build & test pipelines, matrix builds
+ service containers, secrets & environments, building/publishing Docker images, and gated
deploys with rollbacks. **8 lessons + ready-to-use workflows.**

> Start here once you have an app and image to automate.

---

## Suggested learning paths

**Full stack-to-ship path (recommended):**
1. **Redis** 01–05 — core data types & caching (build the app's data layer).
2. **Docker** 01–06 — containerize the app + dependencies.
3. **CI/CD** 01–06 — automate lint/test/build and publish the image.
4. **CI/CD** 07–08 + **Docker** 07–08 — deploy, harden, and operate it.
5. Circle back to **Redis** 06–11 for pub/sub, scaling, and vector search as you need them.

**Just need caching?** Redis 01–05 + 10 (production patterns).
**Just need to containerize?** Docker 01–06.
**Just automating an existing app?** CI/CD 01–06.

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
| [Redis](./redis/README.md) | 11 | Node + `node-redis` | Cache, rank, queue, pub/sub, vector-search |
| [Docker](./docker/README.md) | 8 | Node + Redis | Containerize and run multi-service apps |
| [CI/CD](./ci-cd/README.md) | 8 | GitHub Actions | Auto-test, build images, and deploy safely |
