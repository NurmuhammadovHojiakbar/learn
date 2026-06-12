# Redis for Developers — A Practical Course

A hands-on Redis course that takes you from zero to production, with real
**Node.js** examples using the official [`node-redis`](https://github.com/redis/node-redis)
client. By the end you'll understand Redis data types, caching patterns, pub/sub,
transactions, persistence, scaling, and how to wire all of it into a real app.

## Who this is for
Backend / full-stack developers who want to **learn Redis and actually use it** in
their projects — not just memorize commands.

## How to use this course
1. Read the lessons in order (they build on each other).
2. Keep a Redis server running and try the `redis-cli` commands as you go.
3. Run the Node.js snippets in [`examples/`](./examples) against your local Redis.

### Start a Redis server
```bash
# Option A: Docker (easiest)
docker run --name redis -p 6379:6379 -d redis:7

# Option B: macOS
brew install redis && brew services start redis

# Option C: Debian/Ubuntu
sudo apt-get install redis-server && sudo systemctl start redis

# Verify it works
redis-cli ping        # -> PONG
```

### Run the Node examples
```bash
cd examples
npm install
node cache-aside.js
```

## Table of contents
| # | Lesson | What you'll learn |
|---|--------|-------------------|
| 01 | [Introduction & Setup](./01-introduction.mdx) | What Redis is, when to use it, install, redis-cli |
| 02 | [Data Types](./02-data-types.mdx) | Strings, lists, sets, sorted sets, hashes, streams, and more |
| 03 | [Core Commands & Keys](./03-core-commands.mdx) | TTL, expiry, key naming, SCAN vs KEYS |
| 04 | [Node.js: Getting Started](./04-nodejs-getting-started.mdx) | node-redis client, connect, async/await, errors |
| 05 | [Caching Patterns](./05-caching-patterns.mdx) | Cache-aside, write-through, invalidation, stampede |
| 06 | [Pub/Sub & Streams](./06-pubsub-and-streams.mdx) | Real-time messaging and event streams |
| 07 | [Transactions & Scripting](./07-transactions-and-scripting.mdx) | MULTI/EXEC, WATCH, pipelining, Lua |
| 08 | [Persistence & Reliability](./08-persistence-and-reliability.mdx) | RDB, AOF, eviction, memory |
| 09 | [Scaling Redis](./09-scaling.mdx) | Replication, Sentinel, Cluster |
| 10 | [Node.js in Production](./10-nodejs-production.mdx) | Sessions, rate limiting, locks, queues, security |

## Quick reference cheat sheet
```bash
SET key value EX 60      # set with 60s expiry
GET key                  # read
DEL key                  # delete
EXPIRE key 30            # add/refresh TTL
TTL key                  # remaining seconds
INCR counter             # atomic increment
KEYS *                   # list keys (avoid in prod — use SCAN)
SCAN 0 MATCH user:*      # cursor-based, production-safe iteration
FLUSHALL                 # wipe everything (be careful!)
```

> Tip: keys are namespaced by convention with colons, e.g. `user:1000:profile`.
> Redis doesn't enforce this, but it keeps your keyspace organized.
