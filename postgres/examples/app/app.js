// Express API over Postgres, with Redis cache-aside (Lesson 07).
// Demonstrates: connection pool, parameterized queries, a transactional order,
// and caching reads in Redis (Postgres = source of truth, Redis = cache).
import express from 'express';
import { createClient } from 'redis';
import pool, { query } from './db.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.on('error', (err) => console.error('Redis error:', err.message));
await redis.connect();

// --- Read with cache-aside ---
app.get('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const key = `user:${id}`;

  const cached = await redis.get(key);
  if (cached) return res.json({ source: 'cache', user: JSON.parse(cached) });

  // Parameterized query — never string-concatenate input.
  const { rows } = await query('SELECT id, name, email FROM users WHERE id = $1', [id]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: 'not found' });

  await redis.set(key, JSON.stringify(user), { EX: 300 });
  res.json({ source: 'postgres', user });
});

// --- Aggregation: each user's order count + total spent (Lesson 04) ---
app.get('/users/:id/summary', async (req, res) => {
  const { rows } = await query(
    `SELECT u.id, u.name,
            count(o.id)               AS order_count,
            coalesce(sum(o.total), 0) AS total_spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     WHERE u.id = $1
     GROUP BY u.id, u.name`,
    [Number(req.params.id)]
  );
  res.json(rows[0] || null);
});

// --- Transactional order placement (Lessons 06 + 07) ---
app.post('/orders', async (req, res) => {
  const { userId, items } = req.body; // items: [{ productId, qty }]
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, 0) RETURNING id',
      [userId]
    );
    const orderId = rows[0].id;

    let total = 0;
    for (const item of items) {
      // Atomic stock check + decrement — never goes negative under concurrency.
      const upd = await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING price',
        [item.qty, item.productId]
      );
      if (upd.rowCount === 0) throw new Error(`product ${item.productId} out of stock`);

      const price = upd.rows[0].price;
      total += Number(price) * item.qty;
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1,$2,$3,$4)',
        [orderId, item.productId, item.qty, price]
      );
    }

    await client.query('UPDATE orders SET total = $1 WHERE id = $2', [total, orderId]);
    await client.query('COMMIT');
    res.status(201).json({ orderId, total });
  } catch (err) {
    await client.query('ROLLBACK'); // any failure undoes the whole order
    res.status(400).json({ error: err.message });
  } finally {
    client.release(); // ALWAYS return the connection to the pool
  }
});

app.get('/healthz', async (req, res) => {
  try { await query('SELECT 1'); res.json({ status: 'ok' }); }
  catch { res.status(503).json({ status: 'db down' }); }
});

const server = app.listen(PORT, () => console.log(`api listening on :${PORT}`));

async function shutdown() { server.close(); await redis.quit(); await pool.end(); process.exit(0); }
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
