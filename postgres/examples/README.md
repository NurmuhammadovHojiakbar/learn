# PostgreSQL Examples

A runnable **Node + Postgres + Redis** stack: an Express API backed by Postgres (the source
of truth) with Redis cache-aside in front — exactly the pattern from
[Lesson 07](../07-postgres-with-nodejs.mdx).

```
examples/
  docker-compose.yml     # app + postgres + redis
  db/
    schema.sql           # users, products, orders, order_items (+ indexes)
    seed.sql             # sample data
  app/
    app.js               # Express: cache-aside reads, aggregation, transactional orders
    db.js                # pg connection pool
    Dockerfile, package.json
```

## Run it
```bash
docker compose up -d        # schema.sql + seed.sql load automatically on first start

# Cached read (first call hits Postgres, second hits Redis)
curl localhost:3000/users/1
curl localhost:3000/users/1

# Aggregation: order count + total spent
curl localhost:3000/users/1/summary

# Transactional order (decrements stock atomically; rolls back if any item is out of stock)
curl -X POST localhost:3000/orders \
  -H 'content-type: application/json' \
  -d '{"userId":1,"items":[{"productId":2,"qty":2}]}'

# Try an out-of-stock product (USB-C Hub, id 4, stock 0) -> 400 + full rollback
curl -X POST localhost:3000/orders \
  -H 'content-type: application/json' \
  -d '{"userId":1,"items":[{"productId":4,"qty":1}]}'

docker compose down          # add -v to also wipe the pg-data + schema
```

## Explore with psql
```bash
docker compose exec postgres psql -U postgres -d appdb
# then:  \dt    \d orders    SELECT * FROM users;    EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;
```

## What to notice
- **Parameterized queries** (`$1, $2`) everywhere — no string concatenation, no injection.
- **Connection pool** (`db.js`) shared across requests; the transaction checks out one
  client and always `release()`s it.
- **Cache-aside**: `/users/:id` returns `source: "postgres"` on a miss, `source: "cache"` on
  the next call (and the cache is dropped on writes).
- **Transactional `/orders`**: the atomic `UPDATE ... WHERE stock >= $1` prevents overselling;
  any failure `ROLLBACK`s the whole order.
- **Constraints** (`CHECK (stock >= 0)`, FKs) enforce integrity in the database itself.

## Run the app locally without Docker (optional)
```bash
cd app && npm install
# needs Postgres on :5432 (load db/schema.sql + db/seed.sql) and Redis on :6379
DATABASE_URL=postgresql://postgres:secret@localhost:5432/appdb npm start
```
