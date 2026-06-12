# PostgreSQL for Developers — A Practical Course

A hands-on course on **PostgreSQL**, the world's most capable open-source relational
database — the **source of truth** behind most applications. Built with real **Node.js**
examples (`pg`), and designed to sit underneath the rest of this library: Postgres stores
the data, [Redis](../redis/README.md) caches it, [Docker](../docker/README.md) runs it,
and [Observability](../observability/README.md) watches it.

## Who this is for
Developers who can build an app but want to design schemas, write correct and fast SQL, and
use Postgres confidently in production — not just `SELECT *`.

> This is the **data layer** the other courses assume. Redis is framed throughout as "a
> cache in front of Postgres" — this course is that Postgres.

## Why PostgreSQL?
- **Relational + ACID** — strong consistency and transactions you can trust.
- **Rich SQL** — joins, window functions, CTEs, full-text search.
- **Flexible** — `JSONB` for semi-structured data, arrays, custom types, extensions
  (PostGIS, pgvector).
- **Reliable & open source** — battle-tested, no license cost, huge ecosystem.

### Postgres vs Redis — they're partners, not rivals
| | PostgreSQL | Redis |
|--|-----------|-------|
| Role | Source of truth (durable) | Cache / fast ephemeral data |
| Model | Relational tables, SQL | Key-value & data structures |
| Persistence | Always, on disk | In-memory (optional persistence) |
| Use for | Users, orders, relationships | Caching, sessions, queues, rankings |

A healthy app uses **both**: Postgres for durable data, Redis as a fast cache in front of it.

## How to use this course
1. Read the lessons in order; run every query in `psql` as you go.
2. Start Postgres with Docker:
   ```bash
   docker run --name pg -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:16
   docker exec -it pg psql -U postgres        # interactive SQL shell
   ```
3. Build the [`examples/`](./examples) Node + Postgres + Redis app.

## Table of contents
| # | Lesson | What you'll learn |
|---|--------|-------------------|
| 01 | [Introduction & Setup](./01-introduction.mdx) | Relational basics, install, `psql` |
| 02 | [SQL Fundamentals](./02-sql-fundamentals.mdx) | Tables, types, CRUD, filtering, sorting |
| 03 | [Schema Design & Relationships](./03-schema-design.mdx) | Keys, constraints, normalization, relationships |
| 04 | [Joins & Aggregation](./04-joins-and-aggregation.mdx) | Joins, GROUP BY, subqueries, CTEs, windows |
| 05 | [Indexing & Performance](./05-indexing-and-performance.mdx) | Indexes, EXPLAIN, query tuning, N+1 |
| 06 | [Transactions & Concurrency](./06-transactions-and-concurrency.mdx) | ACID, isolation levels, locking |
| 07 | [PostgreSQL with Node.js](./07-postgres-with-nodejs.mdx) | `pg`, pooling, safe queries, migrations, caching |
| 08 | [Production](./08-production.mdx) | Backups, HA, security, monitoring, JSONB |

## Quick reference cheat sheet
```sql
-- psql meta-commands
\l            -- list databases       \dt   -- list tables
\d users      -- describe a table     \du   -- list roles
\x            -- toggle expanded output  \q  -- quit

-- the essentials
SELECT * FROM users WHERE age > 21 ORDER BY created_at DESC LIMIT 10;
INSERT INTO users (name, email) VALUES ('Ada', 'ada@example.com') RETURNING id;
UPDATE users SET name = 'Ada L' WHERE id = 1;
DELETE FROM users WHERE id = 1;

EXPLAIN ANALYZE SELECT ...;   -- see the query plan + real timing
CREATE INDEX idx_users_email ON users (email);
BEGIN; ... COMMIT;            -- a transaction (ROLLBACK to undo)
```
